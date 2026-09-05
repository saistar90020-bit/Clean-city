export type Role = "citizen" | "worker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  zone?: string;
  department?: string;
  avatar?: string;
}

export type ComplaintSeverity = "Low" | "Medium" | "High" | "Critical";
export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ComplaintStatus = 
  | "REPORTED"
  | "AI ANALYZED"
  | "ASSIGNED"
  | "IN PROGRESS"
  | "RESOLUTION SUBMITTED"
  | "VERIFIED"
  | "RESOLVED";

export interface AIAnalysisResult {
  category: string;
  severity: ComplaintSeverity;
  confidence: number;
  explanation: string;
  recommendedAction: string;
  priority: ComplaintPriority;
  isAiGenerated: boolean;
  engine: string;
  note?: string;
  wardSuggestion?: string;
  hazardousEscalationRequired?: boolean;
}

export interface ComplaintLocation {
  address: string;
  landmark?: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
}

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  label: string;
  timestamp: string;
  note?: string;
  author: string;
}

export interface ResolutionData {
  notes: string;
  evidenceImageUrl: string;
  submittedAt: string;
  workerId: string;
  workerName: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Complaint {
  id: string;
  category: string;
  severity: ComplaintSeverity;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location: ComplaintLocation;
  description: string;
  imageUrl: string;
  reportedAt: string;
  citizenEmail: string;
  citizenName: string;
  citizenPhone?: string;
  assignedWorker?: {
    id: string;
    name: string;
    phone: string;
    zone: string;
  };
  aiAnalysis: AIAnalysisResult;
  timeline: TimelineEntry[];
  resolution?: ResolutionData;
}

export interface FilterOptions {
  search: string;
  status: string;
  priority: string;
  category: string;
  zone: string;
  dateRange: string;
}
