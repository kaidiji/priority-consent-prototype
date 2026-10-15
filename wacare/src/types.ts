export type TabType = 'knowledge' | 'assessments' | 'activities' | 'cases' | 'education' | 'ai-assistant';

export type ClinicalDomain = 'physical' | 'pediatric' | 'psychosocial' | 'community';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'clinical-domain' | 'ltc2-code' | 'assistive-tech' | 'home-mod';
  domain?: ClinicalDomain;
  subtitle: string;
  summary: string;
  keyPoints: string[];
  protocolSteps: string[];
  precautions: string[];
  references: string;
  tags: string[];
  ltcCode?: string;
  paymentPoints?: number;
}

export interface BarthelItem {
  id: string;
  name: string;
  category: string;
  options: {
    score: number;
    text: string;
    description: string;
  }[];
}

export interface IADLItem {
  id: string;
  name: string;
  genderApplicability: 'all' | 'female_only';
  options: {
    score: number;
    text: string;
  }[];
}

export interface ActivityCard {
  id: string;
  title: string;
  domain: ClinicalDomain;
  focusSkills: string[];
  targetPopulation: string;
  durationMinutes: number;
  materials: string[];
  setting: string;
  description: string;
  gradingDown: string[]; // 降低難度
  gradingUp: string[];   // 提升難度
  adaptations: string[]; // 代償與環境調整
  safetyPrecautions: string[];
  isCustom?: boolean;
}

export interface GasLevel {
  score: -2 | -1 | 0 | 1 | 2;
  label: string;
  description: string;
}

export interface CaseGoal {
  id: string;
  targetArea: string;
  smartGoal: string;
  targetDate: string;
  currentGas: -2 | -1 | 0 | 1 | 2;
  gasHistory: { date: string; score: number }[];
  gasLevels: GasLevel[];
}

export interface SoapRecord {
  id: string;
  date: string;
  sessionNumber: number;
  therapist: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface CaseProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  cmsLevel: number; // 長照等級 1~8 級
  diagnosis: string;
  onsetDuration: string;
  primaryCaregiver: string;
  barthelScore?: number;
  iadlScore?: number;
  tugScore?: number;
  domain: ClinicalDomain;
  reablementStatus: 'active' | 'evaluating' | 'completed';
  goals: CaseGoal[];
  soapRecords: SoapRecord[];
  notes: string;
}

export interface EducationHandout {
  id: string;
  title: string;
  category: 'stroke' | 'fall-prevention' | 'transfer' | 'feeding' | 'dementia';
  targetAudience: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    caution?: string;
  }[];
  tips: string[];
}
