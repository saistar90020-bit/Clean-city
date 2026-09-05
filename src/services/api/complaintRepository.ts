import { 
  Complaint, 
  ComplaintStatus, 
  DashboardStatistics, 
  HotspotData, 
  Role, 
  User 
} from "../../types";
import { INITIAL_COMPLAINTS, MUNICIPAL_WORKERS } from "../../data/initialData";
import { canTransitionStatus, normalizeStatus } from "../../utils/lifecycle";

const STORAGE_KEY_COMPLAINTS = "cleancity_complaints_v2";

class ComplaintRepository {
  private complaints: Complaint[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) {
        this.complaints = JSON.parse(saved);
        return;
      }
      // Check legacy storage key
      const legacy = localStorage.getItem("cleancity_complaints_v1");
      if (legacy) {
        this.complaints = JSON.parse(legacy);
        this.saveToStorage();
        return;
      }
    } catch (e) {
      console.error("Failed to load complaints from storage, using initial mock data", e);
    }
    this.complaints = [...INITIAL_COMPLAINTS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(this.complaints));
    } catch (e) {
      console.error("Failed to persist complaints", e);
    }
  }

  public getAll(): Complaint[] {
    return [...this.complaints];
  }

  public getById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id === id);
  }

  public create(
    data: Omit<Complaint, "id" | "reportedAt" | "timeline">
  ): Complaint {
    const existingNums = this.complaints
      .map((c) => {
        const match = c.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : NaN;
      })
      .filter((n) => !isNaN(n));

    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1009;
    const newId = `CLN-${nextNum}`;
    const now = new Date().toISOString();

    // Auto-assign worker based on zone if available
    let assignedWorker = data.assignedWorker;
    if (!assignedWorker && data.location?.zone) {
      const zoneWorker = MUNICIPAL_WORKERS.find((w) =>
        w.zone.toLowerCase().includes(data.location.zone.toLowerCase())
      );
      if (zoneWorker) {
        assignedWorker = {
          id: zoneWorker.id,
          name: zoneWorker.name,
          phone: zoneWorker.phone,
          zone: zoneWorker.zone,
          assignedAt: now,
        };
      }
    }

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      reportedAt: now,
      status: "REPORTED",
      assignedWorker,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: "REPORTED",
          label: "Complaint Submitted by Citizen",
          timestamp: now,
          author: data.citizenName || "Citizen",
          note: `Location verified at ${data.location.address}`,
        },
        {
          id: `tl-${Date.now()}-2`,
          status: "AI_ANALYZED",
          label: `AI Audit Completed (${data.aiAnalysis?.category || "Analyzed"})`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          author: data.aiAnalysis?.engine || "CleanCity AI Vision Engine",
          note: `Calculated Priority: ${data.priority}. Severity: ${data.severity}. Confidence: ${Math.round(
            (data.aiAnalysis?.confidence || 0.9) * 100
          )}%`,
        },
      ],
    };

    if (assignedWorker) {
      newComplaint.timeline.push({
        id: `tl-${Date.now()}-3`,
        status: "ASSIGNED",
        label: `Task Assigned to ${assignedWorker.name}`,
        timestamp: new Date(Date.now() + 2000).toISOString(),
        author: "GVMC Zonal Automated Dispatch",
        note: `Assigned based on zone proximity (${assignedWorker.zone}).`,
      });
      newComplaint.status = "ASSIGNED";
    }

    this.complaints = [newComplaint, ...this.complaints];
    this.saveToStorage();
    return newComplaint;
  }

  public updateStatus(
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    authorName?: string,
    userRole: Role = "admin"
  ): { success: boolean; error?: string; complaint?: Complaint } {
    const existing = this.complaints.find((c) => c.id === id);
    if (!existing) {
      return { success: false, error: "Complaint not found." };
    }

    // Validate lifecycle transition
    const validation = canTransitionStatus(existing.status, newStatus, userRole);
    if (!validation.allowed) {
      return { success: false, error: validation.reason || "This status transition is not permitted." };
    }

    const now = new Date().toISOString();
    const normalized = normalizeStatus(newStatus);

    const timelineEntry = {
      id: `tl-${Date.now()}`,
      status: normalized,
      label: `Status changed to ${normalized.replace(/_/g, " ")}`,
      timestamp: now,
      author: authorName || "Municipal System",
      note: note || `Status progressed to ${normalized}`,
    };

    const updated: Complaint = {
      ...existing,
      status: normalized,
      timeline: [...existing.timeline, timelineEntry],
    };

    this.complaints = this.complaints.map((c) => (c.id === id ? updated : c));
    this.saveToStorage();
    return { success: true, complaint: updated };
  }

  public assignWorker(
    complaintId: string,
    workerId: string,
    adminUser?: User
  ): { success: boolean; error?: string; complaint?: Complaint } {
    const worker = MUNICIPAL_WORKERS.find((w) => w.id === workerId);
    if (!worker) {
      return { success: false, error: "Selected municipal worker does not exist." };
    }

    const existing = this.complaints.find((c) => c.id === complaintId);
    if (!existing) {
      return { success: false, error: "Complaint not found." };
    }

    const now = new Date().toISOString();
    const updated: Complaint = {
      ...existing,
      status: "ASSIGNED",
      assignedWorker: {
        id: worker.id,
        name: worker.name,
        phone: worker.phone,
        zone: worker.zone,
        assignedAt: now,
      },
      timeline: [
        ...existing.timeline,
        {
          id: `tl-${Date.now()}`,
          status: "ASSIGNED",
          label: `Assigned to ${worker.name}`,
          timestamp: now,
          author: adminUser?.name || "GVMC Central Dispatch",
          note: `Task assigned to ${worker.name} (${worker.department}). Contact: ${worker.phone}`,
        },
      ],
    };

    this.complaints = this.complaints.map((c) => (c.id === complaintId ? updated : c));
    this.saveToStorage();
    return { success: true, complaint: updated };
  }

  public submitResolution(
    complaintId: string,
    notes: string,
    evidenceImageUrl: string,
    workerUser?: User
  ): { success: boolean; error?: string; complaint?: Complaint } {
    const existing = this.complaints.find((c) => c.id === complaintId);
    if (!existing) {
      return { success: false, error: "Complaint not found." };
    }

    const now = new Date().toISOString();
    const workerName = workerUser?.name || existing.assignedWorker?.name || "Sanitation Field Worker";
    const workerId = workerUser?.id || existing.assignedWorker?.id || "wrk-01";

    const updated: Complaint = {
      ...existing,
      status: "RESOLUTION_SUBMITTED",
      resolution: {
        notes,
        evidenceImageUrl,
        submittedAt: now,
        workerId,
        workerName,
      },
      timeline: [
        ...existing.timeline,
        {
          id: `tl-${Date.now()}`,
          status: "RESOLUTION_SUBMITTED",
          label: "Resolution Evidence Uploaded",
          timestamp: now,
          author: workerName,
          note: notes || "Cleaning completed; photographic proof uploaded for municipal verification.",
        },
      ],
    };

    this.complaints = this.complaints.map((c) => (c.id === complaintId ? updated : c));
    this.saveToStorage();
    return { success: true, complaint: updated };
  }

  public verifyResolution(
    complaintId: string,
    adminNotes?: string,
    adminUser?: User
  ): { success: boolean; error?: string; complaint?: Complaint } {
    const existing = this.complaints.find((c) => c.id === complaintId);
    if (!existing) {
      return { success: false, error: "Complaint not found." };
    }

    const now = new Date().toISOString();
    const adminName = adminUser?.name || "GVMC Health Officer";

    const updated: Complaint = {
      ...existing,
      status: "RESOLVED",
      resolution: existing.resolution
        ? {
            ...existing.resolution,
            verifiedAt: now,
            verifiedBy: adminName,
            adminVerificationNotes: adminNotes,
          }
        : undefined,
      timeline: [
        ...existing.timeline,
        {
          id: `tl-${Date.now()}-1`,
          status: "VERIFIED",
          label: "Resolution Evidence Inspected & Verified",
          timestamp: now,
          author: adminName,
          note: adminNotes || "Visual inspection and waste disposal standard satisfied.",
        },
        {
          id: `tl-${Date.now()}-2`,
          status: "RESOLVED",
          label: "Complaint Officially Closed as RESOLVED",
          timestamp: new Date(Date.now() + 1000).toISOString(),
          author: "CleanCity Civic Portal",
          note: "Resolution archived. Citizen notified of successful restoration.",
        },
      ],
    };

    this.complaints = this.complaints.map((c) => (c.id === complaintId ? updated : c));
    this.saveToStorage();
    return { success: true, complaint: updated };
  }

  public getStatistics(): DashboardStatistics {
    const total = this.complaints.length;
    let reported = 0;
    let assigned = 0;
    let inProgress = 0;
    let resolutionSubmitted = 0;
    let resolved = 0;
    let critical = 0;
    let highPriority = 0;

    const catMap: Record<string, number> = {};
    const zoneMap: Record<string, { total: number; resolved: number }> = {};
    const sevMap: Record<string, number> = {};

    let totalResolutionHours = 0;
    let resolvedWithTimes = 0;

    for (const c of this.complaints) {
      const norm = normalizeStatus(c.status);
      if (norm === "REPORTED") reported++;
      else if (norm === "ASSIGNED") assigned++;
      else if (norm === "IN_PROGRESS") inProgress++;
      else if (norm === "RESOLUTION_SUBMITTED") resolutionSubmitted++;
      else if (norm === "RESOLVED") resolved++;

      const p = (c.priority || "").toUpperCase();
      if (p === "CRITICAL") critical++;
      else if (p === "HIGH") highPriority++;

      const s = (c.severity || "Medium").toUpperCase();
      sevMap[s] = (sevMap[s] || 0) + 1;

      // Category
      catMap[c.category] = (catMap[c.category] || 0) + 1;

      // Zone
      const zoneName = c.location?.zone || "Zone 2";
      if (!zoneMap[zoneName]) zoneMap[zoneName] = { total: 0, resolved: 0 };
      zoneMap[zoneName].total++;
      if (norm === "RESOLVED") zoneMap[zoneName].resolved++;

      // Resolution time
      if (norm === "RESOLVED" && c.resolution?.submittedAt && c.reportedAt) {
        const start = new Date(c.reportedAt).getTime();
        const end = new Date(c.resolution.submittedAt).getTime();
        const hours = (end - start) / (1000 * 60 * 60);
        if (hours > 0 && hours < 240) {
          totalResolutionHours += hours;
          resolvedWithTimes++;
        }
      }
    }

    const avgResolutionHours = resolvedWithTimes > 0 
      ? Math.round((totalResolutionHours / resolvedWithTimes) * 10) / 10 
      : 3.8;

    const categoryDistribution = Object.keys(catMap).map((category) => ({
      category,
      count: catMap[category],
      percentage: total > 0 ? Math.round((catMap[category] / total) * 100) : 0,
    }));

    const zoneDistribution = Object.keys(zoneMap).map((zone) => ({
      zone,
      count: zoneMap[zone].total,
      resolved: zoneMap[zone].resolved,
    }));

    const severityDistribution = Object.keys(sevMap).map((severity) => ({
      severity,
      count: sevMap[severity],
    }));

    return {
      total,
      reported,
      assigned,
      inProgress,
      resolutionSubmitted,
      resolved,
      critical,
      highPriority,
      avgResolutionHours,
      categoryDistribution,
      zoneDistribution,
      severityDistribution,
    };
  }

  public getHotspots(): HotspotData[] {
    const wardMap: Record<string, {
      zone: string;
      total: number;
      active: number;
      critical: number;
      categories: Record<string, number>;
      lat: number;
      lng: number;
    }> = {};

    for (const c of this.complaints) {
      const ward = c.location.ward || "Ward 18";
      if (!wardMap[ward]) {
        wardMap[ward] = {
          zone: c.location.zone || "Zone 2",
          total: 0,
          active: 0,
          critical: 0,
          categories: {},
          lat: c.location.lat,
          lng: c.location.lng,
        };
      }

      wardMap[ward].total++;
      const norm = normalizeStatus(c.status);
      if (norm !== "RESOLVED" && norm !== "REJECTED" && norm !== "CANCELLED") {
        wardMap[ward].active++;
      }
      if ((c.priority || "").toUpperCase() === "CRITICAL" && norm !== "RESOLVED") {
        wardMap[ward].critical++;
      }
      wardMap[ward].categories[c.category] = (wardMap[ward].categories[c.category] || 0) + 1;
    }

    return Object.keys(wardMap).map((ward) => {
      const data = wardMap[ward];
      let topCategory = "Garbage Overflow";
      let topCount = 0;
      for (const [cat, count] of Object.entries(data.categories)) {
        if (count > topCount) {
          topCount = count;
          topCategory = cat;
        }
      }

      // Calculate cleanliness score (100 is best, penalize active and critical)
      const penalty = (data.active * 12) + (data.critical * 25);
      const cleanlinessScore = Math.max(15, Math.min(98, 100 - penalty));

      let riskLevel: "Low" | "Moderate" | "Severe" | "Critical" = "Low";
      if (data.critical > 0 || cleanlinessScore < 50) riskLevel = "Critical";
      else if (data.active >= 2 || cleanlinessScore < 70) riskLevel = "Severe";
      else if (data.active >= 1 || cleanlinessScore < 85) riskLevel = "Moderate";

      return {
        ward,
        zone: data.zone,
        totalComplaints: data.total,
        activeComplaints: data.active,
        criticalComplaints: data.critical,
        dominantCategory: topCategory,
        cleanlinessScore,
        riskLevel,
        lat: data.lat,
        lng: data.lng,
      };
    });
  }

  public resetToDefaultData(): void {
    this.complaints = [...INITIAL_COMPLAINTS];
    this.saveToStorage();
  }
}

export const complaintRepository = new ComplaintRepository();
