export type QuestionType = 'binary' | 'multiple' | 'slider' | 'scale';

export type UserType = 'coder' | 'professional' | 'casual' | 'unknown';

export type AnswerValue = string | number | boolean;

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: 'habits' | 'work' | 'privacy' | 'autonomy' | 'sophistication' | 'emotional' | 'budget' | 'philosophy';
  options?: string[];
  min?: number;
  max?: number;
  skipIf?: (answers: Record<string, AnswerValue>) => boolean;
  showIf?: (answers: Record<string, AnswerValue>) => boolean;
  weight: number;
}

export interface Answer {
  questionId: string;
  value: AnswerValue;
  timestamp: Date;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface Result {
  overallScore: number;
  percentile: number;
  archetype: Archetype;
  categoryScores: CategoryScore[];
  answers: Record<string, AnswerValue>;
  recommendations: string[];
}

export type Archetype = 
  | 'AI Native'
  | 'Power User'
  | 'Pragmatic Adopter'
  | 'AI Curious'
  | 'AI Skeptic';

export interface ArchetypeProfile {
  name: Archetype;
  description: string;
  traits: string[];
  growthPath: string[];
}
