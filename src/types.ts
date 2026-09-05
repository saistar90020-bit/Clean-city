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

export type ComplaintSeverity = 
  | "LOW" 
  | "MEDIUM" 
  | "HIGH" 
  | "CRITICAL"
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CanonicalComplaintStatus = 
  | "REPORTED"
  | "AI_ANALYZED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLUTION_SUBMITTED"
  | "VERIFIED"
  | "RESOLVED"
  | "REJECTED"
  | "CANCELLED";

export type LegacyComplaintStatus =
  | "AI ANALYZED"
  | "IN PROGRESS"
  | "RESOLUTION SUBMITTED";

export type ComplaintStatus = CanonicalComplaintStatus | LegacyComplaintStatus;

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
  adminVerificationNotes?: string;
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
    assignedAt?: string;
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
  ward?: string;
  dateRange: string;
}

export interface DashboardStatistics {
  total: number;
  reported: number;
  assigned: number;
  inProgress: number;
  resolutionSubmitted: number;
  resolved: number;
  critical: number;
  highPriority: number;
  avgResolutionHours: number;
  categoryDistribution: { category: string; count: number; percentage: number }[];
  zoneDistribution: { zone: string; count: number; resolved: number }[];
  severityDistribution: { severity: string; count: number }[];
}

export interface HotspotData {
  ward: string;
  zone: string;
  totalComplaints: number;
  activeComplaints: number;
  criticalComplaints: number;
  dominantCategory: string;
  cleanlinessScore: number; // 0 to 100 (100 = perfectly clean)
  riskLevel: "Low" | "Moderate" | "Severe" | "Critical";
  lat: number;
  lng: number;
}
