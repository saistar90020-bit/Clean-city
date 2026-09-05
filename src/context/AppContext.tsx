import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  Complaint, 
  ComplaintStatus, 
  DashboardStatistics, 
  HotspotData, 
  Role, 
  User 
} from "../types";
import { complaintRepository } from "../services/api/complaintRepository";
import { authService } from "../services/auth/authService";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AppContextType {
  // Auth
  auth: AuthState;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  loginAsDemoRole: (role: Role) => { success: boolean; message?: string };
  logout: () => void;
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  confirmLogout: () => void;

  // Complaints & Analytics
  complaints: Complaint[];
  stats: DashboardStatistics;
  hotspots: HotspotData[];
  addComplaint: (complaint: Omit<Complaint, "id" | "reportedAt" | "timeline">) => Complaint;
  updateComplaintStatus: (
    id: string, 
    newStatus: ComplaintStatus, 
    note?: string, 
    authorName?: string
  ) => { success: boolean; error?: string };
  assignWorkerToComplaint: (complaintId: string, workerId: string) => { success: boolean; error?: string };
  submitWorkerResolution: (
    complaintId: string, 
    notes: string, 
    evidenceImageUrl: string
  ) => { success: boolean; error?: string };
  verifyComplaintResolution: (
    complaintId: string, 
    adminNotes?: string
  ) => { success: boolean; error?: string };
  getComplaintById: (id: string) => Complaint | undefined;

  // Active View Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  viewComplaintDetails: (id: string) => void;

  // Reset demo data
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Complaints state backed by repository
  const [complaints, setComplaints] = useState<Complaint[]>(() => complaintRepository.getAll());

  // 2. Auth state backed by authService
  const [auth, setAuth] = useState<AuthState>(() => ({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
  }));

  // 3. Navigation state
  const [currentView, setCurrentView] = useState<string>("landing");
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync state when complaints change
  const refreshComplaints = () => {
    setComplaints(complaintRepository.getAll());
  };

  // Login handler
  const login = (email: string, pass: string) => {
    const res = authService.login(email, pass);
    if (res.success && res.user) {
      setAuth({ isAuthenticated: true, user: res.user });
      if (res.user.role === "citizen") setCurrentView("citizen-dashboard");
      else if (res.user.role === "worker") setCurrentView("worker-dashboard");
      else if (res.user.role === "admin") setCurrentView("admin-dashboard");
      return { success: true };
    }
    return { success: false, message: res.message || "Login failed" };
  };

  const loginAsDemoRole = (role: Role) => {
    const res = authService.loginAsDemoRole(role);
    if (res.success && res.user) {
      setAuth({ isAuthenticated: true, user: res.user });
      if (role === "citizen") setCurrentView("citizen-dashboard");
      else if (role === "worker") setCurrentView("worker-dashboard");
      else if (role === "admin") setCurrentView("admin-dashboard");
      return { success: true };
    }
    return { success: false, message: res.message || "Failed to switch demo role" };
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    authService.logout();
    setAuth({ isAuthenticated: false, user: null });
    setShowLogoutModal(false);
    setSelectedComplaintId(null);
    setCurrentView("landing");
  };

  // Add new complaint
  const addComplaint = (
    complaintData: Omit<Complaint, "id" | "reportedAt" | "timeline">
  ): Complaint => {
    const newComplaint = complaintRepository.create(complaintData);
    refreshComplaints();
    return newComplaint;
  };

  // Update complaint status
  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    authorName?: string
  ) => {
    const userRole = auth.user?.role || "admin";
    const res = complaintRepository.updateStatus(
      id,
      newStatus,
      note,
      authorName || auth.user?.name,
      userRole
    );
    if (res.success) {
      refreshComplaints();
      return { success: true };
    }
    return { success: false, error: res.error || "Status update failed." };
  };

  // Assign worker
  const assignWorkerToComplaint = (complaintId: string, workerId: string) => {
    const res = complaintRepository.assignWorker(complaintId, workerId, auth.user || undefined);
    if (res.success) {
      refreshComplaints();
      return { success: true };
    }
    return { success: false, error: res.error || "Assignment failed." };
  };

  // Worker submits resolution
  const submitWorkerResolution = (
    complaintId: string,
    notes: string,
    evidenceImageUrl: string
  ) => {
    const res = complaintRepository.submitResolution(
      complaintId,
      notes,
      evidenceImageUrl,
      auth.user || undefined
    );
    if (res.success) {
      refreshComplaints();
      return { success: true };
    }
    return { success: false, error: res.error || "Resolution submission failed." };
  };

  // Admin verifies resolution
  const verifyComplaintResolution = (complaintId: string, adminNotes?: string) => {
    const res = complaintRepository.verifyResolution(
      complaintId,
      adminNotes,
      auth.user || undefined
    );
    if (res.success) {
      refreshComplaints();
      return { success: true };
    }
    return { success: false, error: res.error || "Verification failed." };
  };

  const getComplaintById = (id: string) => {
    return complaintRepository.getById(id);
  };

  const viewComplaintDetails = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentView("complaint-details");
  };

  const resetToDefaultData = () => {
    complaintRepository.resetToDefaultData();
    refreshComplaints();
  };

  const stats = complaintRepository.getStatistics();
  const hotspots = complaintRepository.getHotspots();

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        loginAsDemoRole,
        logout,
        showLogoutModal,
        setShowLogoutModal,
        confirmLogout,
        complaints,
        stats,
        hotspots,
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
