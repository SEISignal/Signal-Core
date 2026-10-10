export type ClimateType = 'temperate' | 'arid' | 'tropical' | 'subarctic';

export type ProfessionType = 
  | 'healthcare' 
  | 'trades' 
  | 'logistics' 
  | 'urban_resident' 
  | 'security_field';

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface PracticeDrill {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  frequency: 'daily' | 'biweekly' | 'weekly';
  difficulty: 'Foundation' | 'Intermediate' | 'High-Stress';
  description: string;
  instructions: string[];
  equipmentNeeded: string[];
  completed: boolean;
  lastPracticed?: string;
  environmentNote?: string;
}

export interface PlanPhase {
  phaseNumber: number;
  name: string;
  timeframe: string;
  focus: string;
  drills: PracticeDrill[];
  milestones: string[];
}

export interface CustomBundle {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  climate: ClimateType;
  profession: ProfessionType;
  riskLevel: RiskLevel;
  selectedPacketIds: string[];
  selectedBranchIds: string[];
  totalEstimatedHours: number;
  phases: PlanPhase[];
  completedDrillIds: string[];
}
