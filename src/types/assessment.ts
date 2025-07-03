export interface Assessment {
  id: string;
  patientId: string;
  testName: string;
  testId: string;
  category: AssessmentCategory;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  score: number;
  maxScore?: number;
  percentile?: number;
  standardScore?: number;
  tScore?: number;
  date: Date;
  completedAt?: Date;
  duration?: number; // in minutes
  administeredBy: string;
  notes?: string;
  responses?: AssessmentResponse[];
  interpretation?: AssessmentInterpretation;
  recommendations?: string[];
  followUpRequired?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  fullName: string;
  category: AssessmentCategory;
  description: string;
  instructions: string;
  estimatedDuration: number; // in minutes
  questions: AssessmentQuestion[];
  scoringMethod: 'automatic' | 'manual';
  normativeData?: NormativeData;
  isActive: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'likert-scale' | 'yes-no' | 'text' | 'numeric';
  options?: AssessmentOption[];
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

export interface AssessmentOption {
  id: string;
  text: string;
  value: number | string;
  order: number;
}

export interface AssessmentResponse {
  questionId: string;
  value: number | string | boolean;
  timestamp: Date;
}

export interface AssessmentInterpretation {
  overallScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'very-severe';
  description: string;
  clinicalSignificance: boolean;
  subscores?: {
    [key: string]: {
      score: number;
      interpretation: string;
    };
  };
  comparisonToNorms?: {
    percentile: number;
    standardScore: number;
    interpretation: string;
  };
}

export interface NormativeData {
  ageGroups: {
    [key: string]: {
      mean: number;
      standardDeviation: number;
      percentiles: { [percentile: number]: number };
    };
  };
  genderNorms?: {
    male: NormativeData['ageGroups'];
    female: NormativeData['ageGroups'];
  };
}

export type AssessmentCategory = 
  | 'anxiety'
  | 'depression'
  | 'cognitive'
  | 'personality'
  | 'behavioral'
  | 'neuropsychological'
  | 'quality-of-life'
  | 'trauma'
  | 'substance-abuse'
  | 'eating-disorders'
  | 'mood-disorders'
  | 'attention-deficit'
  | 'autism-spectrum'
  | 'developmental';

export interface AssessmentStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  averageScore: number;
  completionRate: number;
}

export interface AssessmentComparison {
  assessmentIds: string[];
  comparisonType: 'temporal' | 'cross-sectional';
  metrics: {
    scoreChanges: {
      assessmentId: string;
      previousScore?: number;
      currentScore: number;
      change: number;
      percentChange: number;
    }[];
    trends: {
      direction: 'improving' | 'declining' | 'stable';
      significance: 'significant' | 'moderate' | 'minimal';
      confidence: number;
    };
  };
  recommendations: string[];
}

export interface AssessmentFilter {
  category?: AssessmentCategory;
  status?: Assessment['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  administeredBy?: string;
  scoreRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface AssessmentSession {
  id: string;
  assessmentId: string;
  patientId: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  responses: AssessmentResponse[];
  isCompleted: boolean;
  isPaused: boolean;
  timeSpent: number; // in seconds
}

// Specific assessment types for common psychological tests
export interface PHQ9Assessment extends Assessment {
  testId: 'phq-9';
  subscores: {
    anhedonia: number;
    depressedMood: number;
    sleepProblems: number;
    fatigue: number;
    appetiteProblems: number;
    selfWorth: number;
    concentration: number;
    psychomotor: number;
    suicidalIdeation: number;
  };
}

export interface GAD7Assessment extends Assessment {
  testId: 'gad-7';
  subscores: {
    nervousness: number;
    uncontrollableWorry: number;
    excessiveWorry: number;
    restlessness: number;
    difficulty_relaxing: number;
    irritability: number;
    fearfulness: number;
  };
}

export interface BeckDepressionAssessment extends Assessment {
  testId: 'beck-depression';
  subscores: {
    cognitive: number;
    affective: number;
    somatic: number;
  };
}

export interface BeckAnxietyAssessment extends Assessment {
  testId: 'beck-anxiety';
  subscores: {
    neurophysiological: number;
    subjective: number;
    panic: number;
    autonomic: number;
  };
}
