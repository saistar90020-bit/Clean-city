import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { InstitutionLogo } from "./InstitutionLogo";
import { 
  Sparkles, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  HelpCircle,
  HardHat,
  Building2,
  UserCheck
} from "lucide-react";

export const Header: React.FC = () => {
  const { auth, logout, currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = auth.isAuthenticated && auth.user;

  const getPortalLabel = () => {
    if (!auth.user) return null;
    switch (auth.user.role) {
      case "citizen":
        return { title: "Citizen Portal", icon: UserCheck, color: "text-emerald-800 bg-emerald-50 border-emerald-300" };
      case "worker":
        return { title: "Field Worker Portal", icon: HardHat, color: "text-amber-800 bg-amber-50 border-amber-300" };
      case "admin":
        return { title: "Municipal Command Portal", icon: Building2, color: "text-slate-800 bg-slate-100 border-slate-300" };
    }
  };

  const portalInfo = getPortalLabel();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Official Civic Banner Strip */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] font-medium py-1 px-4 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold tracking-wide uppercase">
              Greater Visakhapatnam Municipal Corporation (GVMC)
            </span>
            <span className="text-emerald-300/60 hidden md:inline">•</span>
            <span className="text-emerald-200/90 hidden md:inline">
              Smart Civic Sanitation Portal
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-emerald-200">
            <span className="hidden sm:inline">SITAM CSE Collaboration</span>
            <span className="text-emerald-400/60 hidden sm:inline">|</span>
            <span className="font-semibold text-emerald-300">Toll Free: 1800-425-0001</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: CleanCity Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  if (auth.user?.role === "citizen") setCurrentView("citizen-dashboard");
                  else if (auth.user?.role === "worker") setCurrentView("worker-dashboard");
                  else if (auth.user?.role === "admin") setCurrentView("admin-dashboard");
                } else {
                  setCurrentView("landing");
                }
              }}
              className="flex items-center gap-2.5 text-left group transition cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                    Clean<span className="text-emerald-700">City</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                    GVMC
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden xs:block">
                  Report. Respond. Restore.
                </p>
              </div>
            </button>

            {/* If logged in, show the portal name pill in center-left */}
            {isLoggedIn && portalInfo && (
              <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${portalInfo.color}`}>
                  <portalInfo.icon className="w-3.5 h-3.5" />
                  <span>{portalInfo.title}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Institutional Logos Hierarchy */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <InstitutionLogo type="sitam" />
              <span className="text-slate-300 text-xs font-light">|</span>
              <InstitutionLogo type="gvmc" />
              <span className="text-slate-300 text-xs font-light hidden md:inline">|</span>
              <div className="hidden md:block">
                <InstitutionLogo type="police" />
              </div>
            </div>

            {/* Desktop Navigation Links / Actions */}
            <nav className="hidden lg:flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setCurrentView("landing")}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                      currentView === "landing"
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setCurrentView("how-it-works")}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                      currentView === "how-it-works"
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => setCurrentView("report-issue")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report Issue</span>
                  </button>
                  <button
                    onClick={() => setCurrentView("login")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Login</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Role Specific Desktop Navigation */}
                  {auth.user?.role === "citizen" && (
                    <>
                      <button
                        onClick={() => setCurrentView("citizen-dashboard")}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                          currentView === "citizen-dashboard"
                            ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        My Dashboard
                      </button>
                      <button
                        onClick={() => setCurrentView("report-issue")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs transition cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Report New Issue</span>
                      </button>
                    </>
                  )}

                  {auth.user?.role === "worker" && (
                    <button
                      onClick={() => setCurrentView("worker-dashboard")}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                        currentView === "worker-dashboard"
                          ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      Assigned Tasks
                    </button>
                  )}

                  {auth.user?.role === "admin" && (
                    <button
                      onClick={() => setCurrentView("admin-dashboard")}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                        currentView === "admin-dashboard"
                          ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      Municipal Command Center
                    </button>
                  )}

                  {/* User chip & Logout */}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="text-right hidden xl:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {auth.user?.name}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {auth.user?.role} • {auth.user?.zone || "GVMC"}
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      title="Logout from CleanCity"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </nav>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView("login")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 bg-white"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {/* Institutional subline for mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Civic & Academic Initiative
            </div>
            <div className="flex items-center gap-2">
              <InstitutionLogo type="sitam" />
              <span className="text-slate-200">|</span>
              <InstitutionLogo type="gvmc" />
              <span className="text-slate-200">|</span>
              <InstitutionLogo type="police" />
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="space-y-1 pt-1">
              <button
                onClick={() => {
                  setCurrentView("landing");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentView("how-it-works");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setCurrentView("report-issue");
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Sanitation Issue</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-800 bg-slate-50 mt-1"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Staff & Citizen Login</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">{auth.user?.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{auth.user?.role} • {auth.user?.zone || "GVMC"}</div>
                </div>
                {portalInfo && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${portalInfo.color}`}>
                    {portalInfo.title}
                  </span>
                )}
              </div>

              {auth.user?.role === "citizen" && (
                <>
                  <button
                    onClick={() => {
                      setCurrentView("citizen-dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    My Complaints Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("report-issue");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-emerald-700 text-white"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report New Issue</span>
                  </button>
                </>
              )}

              {auth.user?.role === "worker" && (
                <button
                  onClick={() => {
                    setCurrentView("worker-dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  My Assigned Cleaning Tasks
                </button>
              )}

              {auth.user?.role === "admin" && (
                <button
                  onClick={() => {
                    setCurrentView("admin-dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Municipal Command Center
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
