import React from "react";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: Role | Role[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const { auth, setCurrentView } = useApp();

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div id="unauthorized-card" className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <LogIn className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-600 mb-6">
          Please sign in with your municipal or citizen account to access this portal.
        </p>
        <button
          id="go-to-login-btn"
          type="button"
          onClick={() => setCurrentView("login")}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-sm"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    // Admin has universal inspection permission
    const hasAccess = roles.includes(auth.user.role) || auth.user.role === "admin";

    if (!hasAccess) {
      return (
        <div id="permission-denied-card" className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-600 mb-6">
            You don't have permission to access this portal. Your current account role is{" "}
            <span className="font-semibold text-slate-900 capitalize">{auth.user.role}</span>.
          </p>
          <div className="flex flex-col gap-2">
            <button
              id="back-to-own-dashboard"
              type="button"
              onClick={() => {
                if (auth.user?.role === "citizen") setCurrentView("citizen-dashboard");
                else if (auth.user?.role === "worker") setCurrentView("worker-dashboard");
                else setCurrentView("admin-dashboard");
              }}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Your Portal
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
