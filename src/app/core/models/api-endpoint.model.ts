export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface ApiEndpoint {
  id: string;
  scanId: string;
  pageId?: string;
  method: HttpMethod;
  endpoint: string;
  description: string;
  statusCode: number;
  responseTimeMs: number;
  authRequired: boolean;
  contentType: string;
  riskLevel: ApiRiskLevel;
}
