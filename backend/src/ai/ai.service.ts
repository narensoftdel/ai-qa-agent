import OpenAI from 'openai';
import { logger } from '../config/logger.js';
import { SecurityFinding } from '../security/security.types.js';

export interface AIAnalysis {
  securityScore: number;

  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  executiveSummary: string;

  recommendations: string[];

  topFindings: SecurityFinding[];
}

class AIService {
  private client?: OpenAI;

  private initialized = false;

  /**
   * Resolve the OpenAI client lazily on first use. Reading the key here
   * (rather than in the constructor) means it is read after the process
   * entrypoint has loaded .env, regardless of module import order.
   */
  /**
   * Eagerly resolve the client so the startup log prints at boot.
   * Safe to call once .env is loaded; the lazy guard still protects
   * against being read before that.
   */
  init(): void {
    this.getClient();
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
