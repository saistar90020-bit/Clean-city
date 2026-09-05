import React from "react";
import { useApp } from "../context/AppContext";
import { InstitutionLogo } from "../components/InstitutionLogo";
import { MapVisualization } from "../components/MapVisualization";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  HardHat, 
  Flame, 
  FileText,
  AlertTriangle,
  Play
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { complaints, setCurrentView, viewComplaintDetails } = useApp();

  const totalReports = complaints.length + 12450;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length + 11200;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-slate-200 bg-radial from-emerald-50/60 via-slate-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>GVMC SMART CIVIC SANITATION & PUBLIC ACCOUNTABILITY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Report. Respond. <span className="text-emerald-700">Restore.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Empowering citizens of Greater Visakhapatnam to build a cleaner, greener city through AI computer vision, instant field worker dispatch, and verified photographic resolution evidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView("report-issue")}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Report a Sanitation Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView("how-it-works")}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>View How It Works</span>
              </button>
            </div>

            {/* Institutional Endorsement Bar */}
            <div className="pt-6 mt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                Municipal & Academic Initiative:
              </span>
              <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <InstitutionLogo type="sitam" showSubtitle={true} />
                <span className="text-slate-300">|</span>
                <InstitutionLogo type="gvmc" showSubtitle={true} />
                <span className="text-slate-300">|</span>
                <InstitutionLogo type="police" showSubtitle={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CIVIC METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Sanitation Reports Logged
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalReports.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-700 font-semibold">Across Greater Visakhapatnam</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs bg-emerald-50/20">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Verified Resolution Rate
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              91.4%
            </div>
            <span className="text-xs text-slate-600">With Before/After Photo Proof</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Average Response Time
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800">
              3.4 <span className="text-sm font-semibold text-slate-500">hours</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold">↓ 35% Faster with AI Priority</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active GVMC Zones
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800">
              89 Wards
            </div>
            <span className="text-xs text-slate-500">Zone 1 through Zone 5</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 5-STEP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Seamless 5-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From Citizen Snap to Verified Cleanliness
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every step is recorded on an immutable timeline for total municipal transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: "1", title: "📸 Report", desc: "Citizen uploads photo with auto GPS coordinates" },
            { step: "2", title: "🤖 AI Analyze", desc: "Computer vision detects category, severity & hazards" },
            { step: "3", title: "🚨 Prioritize", desc: "Dynamic priority assigned & routed to zone worker" },
            { step: "4", title: "👷 Resolve", desc: "Sanitation crew clears site & uploads photo evidence" },
            { step: "5", title: "✅ Verify", desc: "Municipal health officer signs off and closes case" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-500/50 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-emerald-700/20 block mb-2">0{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE GVMC MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Live Geographic Tracking
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Visakhapatnam Sanitation Heat Grid
            </h2>
            <p className="text-xs text-slate-500">
              Interactive civic GIS map mapping real-time sanitation alerts across GVMC zones.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("report-issue")}
            className="py-2.5 px-4.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            + Report at Your Location
          </button>
        </div>

        <MapVisualization
          complaints={complaints}
          onSelectComplaint={(c) => viewComplaintDetails(c.id)}
        />
      </section>

      {/* WHY CLEANCITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Innovation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Why CleanCity is Different
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faster, Frictionless Reporting</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                  No complex bureaucratic forms. A single photo and GPS pin triggers the full municipal workflow.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI-Powered Multimodal Classification</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                  Automated waste categorization, severity calculation, and detection of hazardous materials without human bias.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent Resolution Proof</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                  Field workers must upload photographic evidence of the cleaned site before any task can be marked resolved.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Data-Driven Municipal Accountability</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                  Real-time KPI metrics allow zonal commissioners to allocate compactor vehicles and sanitary squads efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 pt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-800 text-sm">Clean<span className="text-emerald-700">City</span></span>
                <span className="text-slate-400 text-xs block">AI-Powered Smart Sanitation Reporting & Accountability Platform • GVMC</span>
              </div>
            </div>

            {/* Logos */}
            <div className="flex items-center gap-3">
              <InstitutionLogo type="sitam" />
              <span className="text-slate-300">|</span>
              <InstitutionLogo type="gvmc" />
              <span className="text-slate-300">|</span>
              <InstitutionLogo type="police" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 CleanCity Platform. Built by CSE Final Year Students at SITAM in collaboration with GVMC.</p>
            <p>Report. Respond. Restore. • Visakhapatnam Metropolitan Region</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
