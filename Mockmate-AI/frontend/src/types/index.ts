export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Question {
  id: number;
  question_text: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  expected_concepts: string[];
  created_at?: string;
}

export interface DimensionScores {
  clarity: number;
  relevance: number;
  structure: number;
  confidence: number;
}

export interface DimensionExplanations {
  clarity: string;
  relevance: string;
  structure: string;
  confidence: string;
}

export interface DimensionEvidence {
  clarity: string;
  relevance: string;
  structure: string;
  confidence: string;
}

export interface Evaluation {
  id: number;
  answer_id: number;
  clarity_score: number;
  relevance_score: number;
  structure_score: number;
  confidence_score: number;
  overall_score: number;
  clarity_explanation: string;
  relevance_explanation: string;
  structure_explanation: string;
  confidence_explanation: string;
  evidence: DimensionEvidence | Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  missing_concepts: string[];
  suggested_answer: string;
  created_at: string;
}

export interface Answer {
  id: number;
  interview_id: number;
  question_id: number;
  answer_text: string;
  question_order: number;
  submitted_at: string;
  question?: Question;
  evaluation?: Evaluation;
}

export interface Interview {
  id: number;
  user_id: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  total_questions: number;
  mode: 'practice' | 'assessment';
  status: 'in_progress' | 'completed' | 'abandoned';
  overall_score: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface InterviewDetail extends Interview {
  answers: Answer[];
  questions: Question[];
}

export interface InterviewSummary {
  interview_id: number;
  category: string;
  difficulty: string;
  mode: string;
  status: string;
  total_questions: number;
  questions_attempted: number;
  overall_score: number;
  average_clarity: number;
  average_relevance: number;
  average_structure: number;
  average_confidence: number;
  strongest_dimension: string;
  weakest_dimension: string;
  key_strengths: string[];
  areas_for_improvement: string[];
  personalized_recommendations: string[];
}

export interface DashboardStats {
  total_interviews: number;
  average_score: number;
  best_score: number;
  total_questions_answered: number;
  recent_interviews: Interview[];
}

export interface TrendPoint {
  date: string;
  score: number;
  category: string;
}

export interface SkillPerformance {
  category: string;
  average_score: number;
  interviews_count: number;
}

export interface ProgressAnalytics {
  overall_trend: TrendPoint[];
  dimension_averages: {
    Clarity: number;
    Relevance: number;
    Structure: number;
    Confidence: number;
  };
  skill_profiles: SkillPerformance[];
  strongest_skill: string | null;
  weakest_skill: string | null;
  recommendations: string[];
}

export interface CreateInterviewPayload {
  category: string;
  difficulty: string;
  total_questions: number;
  mode: 'practice' | 'assessment';
}

export interface SubmitAnswerPayload {
  question_id: number;
  answer_text: string;
  question_order: number;
}
