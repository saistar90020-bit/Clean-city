import React from "react";
import { useApp } from "../context/AppContext";
import { LogOut, AlertCircle } from "lucide-react";

export const LogoutModal: React.FC = () => {
  const { showLogoutModal, setShowLogoutModal, confirmLogout, auth } = useApp();

  if (!showLogoutModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto mb-4">
          <LogOut className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-center text-slate-900 mb-1">
          Are you sure you want to logout?
        </h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          You are currently logged in as{" "}
          <span className="font-semibold text-slate-700">{auth.user?.name || "User"}</span> (
          <span className="capitalize">{auth.user?.role}</span>). Your local data and complaints will remain safely saved in this browser.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
