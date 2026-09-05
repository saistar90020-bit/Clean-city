import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { LogoutModal } from "./components/LogoutModal";
import { DemoDataBanner } from "./components/common/DemoDataBanner";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LoginPage } from "./pages/LoginPage";
import { ReportIssuePage } from "./pages/ReportIssuePage";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { WorkerDashboard } from "./pages/WorkerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ComplaintDetailPage } from "./pages/ComplaintDetailPage";

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <DemoDataBanner />
      <Header />
      
      <main className="flex-1">
        {currentView === "landing" && <LandingPage />}
        {currentView === "how-it-works" && <HowItWorksPage />}
        {currentView === "login" && <LoginPage />}
        {currentView === "report-issue" && <ReportIssuePage />}
        {currentView === "citizen-dashboard" && (
          <ProtectedRoute requiredRole="citizen">
            <CitizenDashboard />
          </ProtectedRoute>
        )}
        {currentView === "worker-dashboard" && (
          <ProtectedRoute requiredRole="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        )}
        {currentView === "admin-dashboard" && (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )}
        {currentView === "complaint-details" && <ComplaintDetailPage />}
      </main>

      <LogoutModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
