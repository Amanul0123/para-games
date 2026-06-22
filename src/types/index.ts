export interface Step1Data {
  npc: string;
  reportedBy: string;
  dateOfReport: string;
  email: string;
  phone: string;
}

export interface InjuryEntry {
  accreditationNo: string;
  sportEvent: string;
  roundHeat?: string;
  injuryDate: string;
  injuryTime?: string;
  bodyPart: string;
  bodyPartCode?: string;
  injuryType: string;
  injuryTypeCode?: string;
  causeOfInjury?: string;
  causeCode?: string;
  absenceDays?: number;
}

export interface IllnessEntry {
  accreditationNo: string;
  sportEvent: string;
  occurredOn: string;
  diagnosis: string;
  affectedSystem?: string;
  systemCode?: string;
  mainSymptoms?: string;
  symptomCodes?: string;
  causeOfIllness?: string;
  causeCode?: string;
  absenceDays?: number;
}

export interface Step2Data {
  injuries: InjuryEntry[];
  illnesses: IllnessEntry[];
}

export interface FormData {
  step1: Step1Data;
  step2: Step2Data;
}

export type ReportStatus = "submitted" | "under_review" | "resolved";

export interface ReportSummary {
  id: string;
  npc: string;
  reportedBy: string;
  dateOfReport: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  injuryCount: number;
  illnessCount: number;
}

export interface ReportNoteEntry {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface ReportDetail extends Omit<ReportSummary, "injuryCount" | "illnessCount"> {
  injuries: InjuryEntry[];
  illnesses: IllnessEntry[];
  notes: ReportNoteEntry[];
}

export interface DashboardStats {
  totalSubmissions: number;
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
