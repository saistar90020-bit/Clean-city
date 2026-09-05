import React from "react";
import { useApp } from "../../context/AppContext";
import { RotateCcw, Sparkles, ShieldCheck, UserCheck } from "lucide-react";

export const DemoDataBanner: React.FC = () => {
  const { auth, resetToDefaultData, login, setCurrentView } = useApp();

  return (
    <div
      id="demo-data-banner"
      className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            Prototype Evaluation Mode
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Greater Visakhapatnam Municipal Corporation (GVMC) • SITAM Collaboration
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role switcher for evaluators */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-md p-0.5 border border-slate-700">
            <button
              id="switch-to-citizen"
              type="button"
              onClick={() => {
                login("citizen@cleancity.demo", "citizen123");
                setCurrentView("citizen-dashboard");
              }}
              className={`px-2 py-1 rounded transition-colors ${
                auth.user?.role === "citizen"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Switch to Citizen Portal"
            >
              Citizen
            </button>
            <button
              id="switch-to-worker"
              type="button"
              onClick={() => {
                login("worker@cleancity.demo", "worker123");
                setCurrentView("worker-dashboard");
              }}
              className={`px-2 py-1 rounded transition-colors ${
                auth.user?.role === "worker"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Switch to Worker Portal"
            >
              Worker
            </button>
            <button
              id="switch-to-admin"
              type="button"
              onClick={() => {
                login("admin@cleancity.demo", "admin123");
                setCurrentView("admin-dashboard");
              }}
              className={`px-2 py-1 rounded transition-colors ${
                auth.user?.role === "admin"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Switch to Municipal Admin Portal"
            >
              Admin
            </button>
          </div>

          <button
            id="reset-demo-data-btn"
            type="button"
            onClick={() => {
              if (window.confirm("Reset all complaints back to default demo dataset?")) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset complaints to initial demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
