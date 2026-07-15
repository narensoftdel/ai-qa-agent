import { randomUUID } from 'crypto';

import OpenAI from 'openai';
import { logger } from '../config/logger.js';
import { SecurityFinding, Severity } from '../security/security.types.js';
import { PageContext } from '../playwright/page-context.service.js';

export interface AIAnalysis {
  securityScore: number;

  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  executiveSummary: string;

  recommendations: string[];

  topFindings: SecurityFinding[];
}

export interface PageAnalysisResult {
  /** True when OpenAI was unavailable and the review was skipped. */
  skipped: boolean;

  findings: SecurityFinding[];
}

/** Maps an AI-returned category to a catalog check ID. */
const AI_CATEGORY_TO_CHECK: Record<string, string> = {
  exposed_secret: 'ai-client-secrets',
  stack_trace: 'ai-stack-traces',
  client_side_logic: 'ai-business-logic',
  implementation_disclosure: 'ai-implementation-details',
  excessive_pii: 'ai-excessive-pii'
};

class AIService {
  private client?: OpenAI;

  private initialized = false;

  /**
   * Eagerly resolve the client so the startup log prints at boot.
   * Safe to call once .env is loaded; the lazy guard still protects
   * against being read before that.
   */
  init(): void {
    this.getClient();
  }

  /** Whether an OpenAI client is configured. */
  isAvailable(): boolean {
    return this.getClient() !== undefined;
  }

  private getClient(): OpenAI | undefined {
    if (this.initialized) {
      return this.client;
    }

    this.initialized = true;

    const key = process.env.OPENAI_API_KEY;

    if (key) {
      this.client = new OpenAI({ apiKey: key });

      logger.info('OpenAI client initialized.');
    } else {
      logger.warn('OPENAI_API_KEY not found. Using local AI summary.');
    }

    return this.client;
  }

  async analyze(findings: SecurityFinding[]): Promise<AIAnalysis> {
    const client = this.getClient();

    if (!client) {
      return this.localAnalysis(findings);
    }

    try {
      const prompt = `
You are a Senior Web Application Security Consultant.

Analyze the following findings.

Return ONLY valid JSON.

Findings:

${JSON.stringify(findings, null, 2)}

Return this structure:

{
  "securityScore": number,
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "executiveSummary": "...",
  "recommendations":[ "...", "..." ]
}
`;

      const response = await client.chat.completions.create({
        model: 'gpt-4.1-mini',

        messages: [
          {
            role: 'system',

            content: 'You are an OWASP security expert.'
          },

          {
            role: 'user',

            content: prompt
          }
        ],

        temperature: 0.2
      });

      const content = response.choices[0].message.content;

      if (!content) {
        return this.localAnalysis(findings);
      }

      const ai = JSON.parse(content);

      return {
        securityScore: ai.securityScore,

        riskLevel: ai.riskLevel,

        executiveSummary: ai.executiveSummary,

        recommendations: ai.recommendations,

        topFindings: findings.sort(this.sortBySeverity).slice(0, 5)
      };
    } catch (error) {
      logger.error(error);

      return this.localAnalysis(findings);
    }
  }

  /**
   * Category 2 — AI reasoning over one page's content.
   *
   * `enabledAiChecks` is the set of Category-2 catalog IDs the user
   * turned on; only findings mapping to those are returned. When
   * OpenAI is unavailable (no key or error/quota), returns
   * { skipped: true } so the agent can record a warning instead of
   * silently producing nothing.
   */
  async analyzePage(context: PageContext, enabledAiChecks: string[]): Promise<PageAnalysisResult> {
    const client = this.getClient();

    if (!client) {
      return { skipped: true, findings: [] };
    }

    try {
      const prompt = `
You are a Senior Application Security Consultant reviewing ONE web page.

Identify only concrete, evidence-backed issues in these categories:
- exposed_secret: API keys, tokens, credentials in HTML/JS/storage
- stack_trace: server stack traces or framework errors shown to the user
- excessive_pii: personal data displayed or collected beyond what the page needs
- client_side_logic: sensitive business rules, pricing, or authorization decisions in client code
- implementation_disclosure: internal paths, versions, or debug details revealed in the UI

Return ONLY valid JSON: an array (possibly empty) of:
{ "category": one of the above, "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "title": short, "description": what and why, "recommendation": fix, "evidence": exact snippet }

Do NOT invent issues. If nothing applies, return [].

PAGE URL: ${context.url}

VISIBLE TEXT (truncated):
${context.visibleText}

INLINE SCRIPTS (truncated):
${context.inlineScripts.join('\n---\n').slice(0, 8000)}

LOCAL/SESSION STORAGE KEYS:
${JSON.stringify({
  localStorage: Object.keys(context.localStorage),
  sessionStorage: Object.keys(context.sessionStorage)
})}
`;

      const response = await client.chat.completions.create({
        model: 'gpt-4.1-mini',

        messages: [
          {
            role: 'system',
            content: 'You are an OWASP security expert. Output strict JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],

        temperature: 0.1
      });

      const content = response.choices[0].message.content;

      if (!content) {
        return { skipped: false, findings: [] };
      }

      const parsed = this.parseJsonArray(content);

      const enabled = new Set(enabledAiChecks);

      const findings = parsed
        .map(item => {
          const checkId = AI_CATEGORY_TO_CHECK[item.category] ?? '';

          if (!checkId || !enabled.has(checkId)) {
            return null;
          }

          const finding: SecurityFinding = {
            id: randomUUID(),
            checkId,
            category: `AI: ${item.category}`,
            title: item.title ?? 'AI-identified issue',
            severity: this.normalizeSeverity(item.severity),
            page: context.url,
            description: item.description ?? '',
            recommendation: item.recommendation ?? '',
            evidence: (item.evidence ?? '').slice(0, 500)
          };

          return finding;
        })
        .filter((f): f is SecurityFinding => f !== null);

      return { skipped: false, findings };
    } catch (error) {
      // Quota/network errors: treat as skipped so the scan records a warning.
      logger.error(error);

      return { skipped: true, findings: [] };
    }
  }

  private parseJsonArray(content: string): any[] {
    try {
      const cleaned = content.replace(/```json|```/g, '').trim();

      const parsed = JSON.parse(cleaned);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private normalizeSeverity(value: unknown): Severity {
    const upper = String(value ?? '').toUpperCase();

    if (upper === 'CRITICAL' || upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
      return upper;
    }

    return 'INFO';
  }

  private localAnalysis(findings: SecurityFinding[]): AIAnalysis {
    const score = this.calculateScore(findings);

    return {
      securityScore: score,

      riskLevel: this.calculateRisk(score),

      executiveSummary: this.generateSummary(score, findings),

      recommendations: this.generateRecommendations(findings),

      topFindings: findings

        .sort(this.sortBySeverity)

        .slice(0, 5)
    };
  }

  private calculateScore(findings: SecurityFinding[]): number {
    let score = 100;

    for (const finding of findings) {
      switch (finding.severity) {
        case 'CRITICAL':
          score -= 25;

          break;

        case 'HIGH':
          score -= 15;

          break;

        case 'MEDIUM':
          score -= 8;

          break;

        case 'LOW':
          score -= 3;

          break;
      }
    }

    return Math.max(score, 0);
  }

  private calculateRisk(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 90) return 'LOW';

    if (score >= 70) return 'MEDIUM';

    if (score >= 50) return 'HIGH';

    return 'CRITICAL';
  }

  private generateSummary(
    score: number,

    findings: SecurityFinding[]
  ): string {
    return `The application security assessment completed successfully. ${findings.length} security findings were detected. The calculated security score is ${score}/100. Immediate remediation is recommended for Critical and High severity issues before deploying to production.`;
  }

  private generateRecommendations(findings: SecurityFinding[]): string[] {
    const recommendations = new Set<string>();

    findings.forEach(finding => {
      recommendations.add(finding.recommendation);
    });

    return [...recommendations];
  }

  private sortBySeverity(
    a: SecurityFinding,

    b: SecurityFinding
  ): number {
    const severity = {
      CRITICAL: 4,

      HIGH: 3,

      MEDIUM: 2,

      LOW: 1,

      INFO: 0
    };

    return severity[b.severity] - severity[a.severity];
  }
}

export const aiService = new AIService();
