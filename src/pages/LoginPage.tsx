import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { InstitutionLogo } from "../components/InstitutionLogo";
import { DEMO_USERS } from "../data/initialData";
import { LogIn, Sparkles, AlertCircle, ArrowLeft, ShieldCheck, UserCheck, HardHat, Building2 } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, setCurrentView } = useApp();
  const [email, setEmail] = useState("citizen@cleancity.demo");
  const [password, setPassword] = useState("citizen123");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter an email or mobile number.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || "Invalid credentials.");
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string) => {
    const demo = DEMO_USERS[demoEmail];
    if (demo) {
      setEmail(demoEmail);
      setPassword(demo.pass);
      setErrorMessage("");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full mx-auto">
        {/* Back link */}
        <button
          onClick={() => setCurrentView("landing")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CleanCity Home</span>
        </button>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white mx-auto shadow-sm mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              CLEAN <span className="text-emerald-800">CITY</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Report. Respond. Restore.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Sign in to access your role-based civic sanitation portal
            </p>
          </div>

          {/* Institutional Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-6">
            <InstitutionLogo type="sitam" showSubtitle={false} />
            <span className="text-slate-300 text-xs">|</span>
            <InstitutionLogo type="gvmc" showSubtitle={false} />
            <span className="text-slate-300 text-xs">|</span>
            <InstitutionLogo type="police" showSubtitle={false} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Mobile Number
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. citizen@cleancity.demo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("For this MVP, please use the 1-click Demo credentials below.")}
                  className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN TO PORTAL</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="relative flex items-center justify-center mb-4">
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Quick Demo Access (1-Click)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("citizen@cleancity.demo")}
                className={`p-2 rounded-xl border text-left transition flex flex-col items-center justify-center cursor-pointer ${
                  email === "citizen@cleancity.demo"
                    ? "bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Citizen</span>
                <span className="text-[10px] text-slate-500">Demo User</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("worker@cleancity.demo")}
                className={`p-2 rounded-xl border text-left transition flex flex-col items-center justify-center cursor-pointer ${
                  email === "worker@cleancity.demo"
                    ? "bg-amber-50 border-amber-400 ring-1 ring-amber-400"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
                  <HardHat className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Field Worker</span>
                <span className="text-[10px] text-slate-500">Zone 2 Team</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("admin@cleancity.demo")}
                className={`p-2 rounded-xl border text-left transition flex flex-col items-center justify-center cursor-pointer ${
                  email === "admin@cleancity.demo"
                    ? "bg-blue-50 border-blue-400 ring-1 ring-blue-400"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">GVMC Admin</span>
                <span className="text-[10px] text-slate-500">Commissioner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Note */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Academic CSE Project by SITAM for Greater Visakhapatnam Municipal Corporation (GVMC)
        </p>
      </div>
    </div>
  );
};
