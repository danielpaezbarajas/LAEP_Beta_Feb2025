export interface Assessment {
  id: string;
  name: string;
  criteria: AssessmentCriteria[];
}

export interface AssessmentCriteria {
  id: string;
  title: string;
  description: string;
  score: number;
  maxScore: number;
  aiAnalysis?: string;
  isAnalyzing?: boolean;
}

export interface AIAnalysisResponse {
  criteriaId: string;
  score: number;
  analysis: string;
}