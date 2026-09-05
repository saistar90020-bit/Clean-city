import React, { createContext, useContext, useEffect, useState } from "react";
import { Complaint, ComplaintPriority, ComplaintStatus, User } from "../types";
import { DEMO_USERS, INITIAL_COMPLAINTS, MUNICIPAL_WORKERS } from "../data/initialData";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AppContextType {
  // Auth
  auth: AuthState;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  confirmLogout: () => void;

  // Complaints
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "reportedAt" | "timeline">) => Complaint;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, note?: string, authorName?: string) => void;
  assignWorkerToComplaint: (complaintId: string, workerId: string) => void;
  submitWorkerResolution: (complaintId: string, notes: string, evidenceImageUrl: string) => void;
  verifyComplaintResolution: (complaintId: string, adminNotes?: string) => void;
  getComplaintById: (id: string) => Complaint | undefined;

  // Active View Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  viewComplaintDetails: (id: string) => void;

  // Reset demo data helper
  resetToDefaultData: () => void;
}

const STORAGE_KEY_COMPLAINTS = "cleancity_complaints_v1";
const STORAGE_KEY_AUTH = "cleancity_auth_session_v1";

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load complaints from localStorage", e);
    }
    return INITIAL_COMPLAINTS;
  });

  // 2. Auth state
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    }
    return { isAuthenticated: false, user: null };
  });

  // 3. Navigation state
  const [currentView, setCurrentView] = useState<string>("landing");
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync complaints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error("Failed to save complaints to localStorage", e);
    }
  }, [complaints]);

  // Sync auth session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth));
    } catch (e) {
      console.error("Failed to save auth to localStorage", e);
    }
  }, [auth]);

  // On initial mount or auth change, route to appropriate dashboard if logged in
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      if (currentView === "landing" || currentView === "login") {
        if (auth.user.role === "citizen") setCurrentView("citizen-dashboard");
        else if (auth.user.role === "worker") setCurrentView("worker-dashboard");
        else if (auth.user.role === "admin") setCurrentView("admin-dashboard");
      }
    }
  }, [auth.isAuthenticated, auth.user?.role]);

  // Login handler
  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const match = DEMO_USERS[cleanEmail];

    if (!match) {
      return { success: false, message: "Invalid email or mobile number. Please use demo credentials." };
    }

    if (match.pass !== pass) {
      return { success: false, message: "Incorrect password. Please verify credentials." };
    }

    const newAuthState: AuthState = {
      isAuthenticated: true,
      user: match.user,
    };
    setAuth(newAuthState);

    // Navigate to role view
    if (match.user.role === "citizen") setCurrentView("citizen-dashboard");
    else if (match.user.role === "worker") setCurrentView("worker-dashboard");
    else if (match.user.role === "admin") setCurrentView("admin-dashboard");

    return { success: true };
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    setShowLogoutModal(false);
    setSelectedComplaintId(null);
    setCurrentView("landing");
  };

  // Add new complaint
  const addComplaint = (
    complaintData: Omit<Complaint, "id" | "reportedAt" | "timeline">
  ): Complaint => {
    // Generate Complaint ID (e.g. CLN-1025)
    const existingIds = complaints
      .map((c) => parseInt(c.id.replace("CLN-", ""), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1009;
    const newId = `CLN-${nextNum}`;

    const now = new Date().toISOString();

    // Auto-assign worker based on zone if available
    let assignedWorker = complaintData.assignedWorker;
    if (!assignedWorker && complaintData.location?.zone) {
      const zoneWorker = MUNICIPAL_WORKERS.find((w) =>
        w.zone.toLowerCase().includes(complaintData.location.zone.toLowerCase())
      );
      if (zoneWorker) {
        assignedWorker = {
          id: zoneWorker.id,
          name: zoneWorker.name,
          phone: zoneWorker.phone,
          zone: zoneWorker.zone,
        };
      }
    }

    const newComplaint: Complaint = {
      ...complaintData,
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
          author: `${complaintData.citizenName || "Citizen"}`,
          note: `Location verified at ${complaintData.location.address}`,
        },
        {
          id: `tl-${Date.now()}-2`,
          status: "AI ANALYZED",
          label: `AI Audit Completed (${complaintData.aiAnalysis?.category || "Analyzed"})`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          author: complaintData.aiAnalysis?.engine || "CleanCity AI Core",
          note: `Assigned Priority: ${complaintData.priority}. Severity: ${complaintData.severity}. Confidence: ${Math.round(
            (complaintData.aiAnalysis?.confidence || 0.9) * 100
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

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  // Update complaint status
  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    authorName?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const newTimelineEntry = {
          id: `tl-${Date.now()}`,
          status: newStatus,
          label: getStatusLabel(newStatus),
          timestamp: new Date().toISOString(),
          author: authorName || auth.user?.name || "System",
          note: note || `Status transitioned to ${newStatus}`,
        };

        return {
          ...c,
          status: newStatus,
          timeline: [...c.timeline, newTimelineEntry],
        };
      })
    );
  };

  // Assign worker
  const assignWorkerToComplaint = (complaintId: string, workerId: string) => {
    const worker = MUNICIPAL_WORKERS.find((w) => w.id === workerId);
    if (!worker) return;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineEntry = {
          id: `tl-${Date.now()}`,
          status: "ASSIGNED" as ComplaintStatus,
          label: `Assigned to ${worker.name}`,
          timestamp: new Date().toISOString(),
          author: auth.user?.name || "Municipal Administrator",
          note: `Assigned to ${worker.name} (${worker.department})`,
        };

        return {
          ...c,
          status: "ASSIGNED",
          assignedWorker: {
            id: worker.id,
            name: worker.name,
            phone: worker.phone,
            zone: worker.zone,
          },
          timeline: [...c.timeline, newTimelineEntry],
        };
      })
    );
  };

  // Worker submits resolution
  const submitWorkerResolution = (
    complaintId: string,
    notes: string,
    evidenceImageUrl: string
  ) => {
    const now = new Date().toISOString();
    const workerName = auth.user?.name || "Field Worker";
    const workerId = auth.user?.id || "wrk-01";

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newTimelineEntry = {
          id: `tl-${Date.now()}`,
          status: "RESOLUTION SUBMITTED" as ComplaintStatus,
          label: "Resolution Evidence Uploaded",
          timestamp: now,
          author: workerName,
          note: notes || "Field work completed with photographic proof attached.",
        };

        return {
          ...c,
          status: "RESOLUTION SUBMITTED",
          resolution: {
            notes,
            evidenceImageUrl,
            submittedAt: now,
            workerId,
            workerName,
          },
          timeline: [...c.timeline, newTimelineEntry],
        };
      })
    );
  };

  // Admin verifies resolution
  const verifyComplaintResolution = (complaintId: string, adminNotes?: string) => {
    const now = new Date().toISOString();
    const adminName = auth.user?.name || "GVMC Administrator";

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const verifyTimelineEntry = {
          id: `tl-${Date.now()}-1`,
          status: "VERIFIED" as ComplaintStatus,
          label: "Resolution Verified by Authority",
          timestamp: now,
          author: adminName,
          note: adminNotes || "Visual evidence and cleaning standards verified.",
        };

        const resolvedTimelineEntry = {
          id: `tl-${Date.now()}-2`,
          status: "RESOLVED" as ComplaintStatus,
          label: "Complaint Closed as RESOLVED",
          timestamp: new Date(Date.now() + 1000).toISOString(),
          author: "CleanCity System",
          note: "Citizen informed of successful completion.",
        };

        return {
          ...c,
          status: "RESOLVED",
          resolution: c.resolution
            ? {
                ...c.resolution,
                verifiedAt: now,
                verifiedBy: adminName,
              }
            : undefined,
          timeline: [...c.timeline, verifyTimelineEntry, resolvedTimelineEntry],
        };
      })
    );
  };

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id);
  };

  const viewComplaintDetails = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentView("complaint-detail");
  };

  const resetToDefaultData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
        showLogoutModal,
        setShowLogoutModal,
        confirmLogout,
        complaints,
        addComplaint,
        updateComplaintStatus,
        assignWorkerToComplaint,
        submitWorkerResolution,
        verifyComplaintResolution,
        getComplaintById,
        currentView,
        setCurrentView,
        selectedComplaintId,
        setSelectedComplaintId,
        viewComplaintDetails,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

function getStatusLabel(status: ComplaintStatus): string {
  switch (status) {
    case "REPORTED":
      return "Complaint Submitted";
    case "AI ANALYZED":
      return "AI Multi-Modal Audit Completed";
    case "ASSIGNED":
      return "Assigned to Sanitation Worker";
    case "IN PROGRESS":
      return "Cleaning in Progress";
    case "RESOLUTION SUBMITTED":
      return "Resolution Evidence Uploaded";
    case "VERIFIED":
      return "Verified by Municipal Authority";
    case "RESOLVED":
      return "Complaint Resolved";
    default:
      return status;
  }
}
