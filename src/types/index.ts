export interface AthleteEntry {
  id: string;
  name: string;
  accreditationNo: string;
  sport?: string | null;
  archived: boolean;
}

export interface InjuryEntry {
  athleteId: string;
  sportEvent: string;
  injuryDate: string;
  bodyPart: string;
  injuryType: string;
  causeOfInjury?: string;
  originalDaysLost?: number;
}

export interface IllnessEntry {
  athleteId: string;
  sportEvent: string;
  occurredOn: string;
  diagnosis: string;
  affectedSystem?: string;
  mainSymptoms?: string;
  causeOfIllness?: string;
  originalDaysLost?: number;
}

export type TimeLossStatus = "original" | "edited";
export type RecordStatus = "logged" | "under_review" | "resolved";

export interface RecordNoteEntry {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface InjuryRecord extends InjuryEntry {
  id: string;
  athleteName: string;
  editedDaysLost?: number | null;
  timeLossStatus: TimeLossStatus;
  status: RecordStatus;
  createdAt: string;
  notes?: RecordNoteEntry[];
}

export interface IllnessRecord extends IllnessEntry {
  id: string;
  athleteName: string;
  editedDaysLost?: number | null;
  timeLossStatus: TimeLossStatus;
  status: RecordStatus;
  createdAt: string;
  notes?: RecordNoteEntry[];
}

export interface TeamSummary {
  id: string;
  npc: string;
  name: string;
  email: string;
  phone?: string | null;
  athleteCount: number;
  injuryCount: number;
  illnessCount: number;
  createdAt: string;
}

export interface TeamDetail extends TeamSummary {
  athletes: AthleteEntry[];
  injuries: InjuryRecord[];
  illnesses: IllnessRecord[];
}

export interface DashboardStats {
  totalTeams: number;
  totalInjuries: number;
  totalIllnesses: number;
  npcsReporting: number;
}

export interface TrendPoint {
  label: string;
  injuries: number;
  illnesses: number;
}

export interface BodyZoneStat {
  zone: string;
  count: number;
  percent: number;
}

export interface NpcStat {
  npc: string;
  count: number;
  percent: number;
}
