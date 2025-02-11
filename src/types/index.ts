export interface AIResponse {
  solution: string;
  explanation: string;
  steps: string[];
  confidence: number;
  model: string;
}

export interface AIModel {
  name: string;
  description: string;
  specialties: string[];
}

export type ProblemCategory = 'mathematics' | 'physics' | 'accounting';