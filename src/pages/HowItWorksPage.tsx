import React from "react";
import { useApp } from "../context/AppContext";
import { InstitutionLogo } from "../components/InstitutionLogo";
import { 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  HardHat, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  PhoneCall,
  Flame,
  Check
} from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      num: "01",
      icon: Camera,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      title: "Citizen Reports with Photo & GPS",
      desc: "Any resident spots an overflow, drain blockage, or illegal debris. With a single tap, they upload photo evidence and verify their GVMC ward coordinates.",
    },
    {
      num: "02",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      title: "AI Multimodal Diagnostics",
      desc: "Our neural vision engine (Google Gemini 2.5 Flash + Intelligent Civic Rules) classifies the waste category, computes confidence scores, and identifies hazard severity.",
    },
    {
      num: "03",
      icon: AlertTriangle,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      title: "Automated Civic Priority Dispatch",
      desc: "System algorithmically assigns priority (Low, Medium, High, Critical) and instantly notifies the closest GVMC zone field worker based on geographical proximity.",
    },
    {
      num: "04",
      icon: HardHat,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      title: "Field Worker Action & Evidence",
      desc: "Sanitation field workers arrive with specialized compactor or desilting machinery. They perform the cleanup and MUST upload photographic proof before task completion.",
    },
    {
      num: "05",
      icon: CheckCircle2,
      color: "bg-teal-100 text-teal-700 border-teal-200",
      title: "Audit Verification & Citizen Closure",
      desc: "Municipal health inspectors verify cleanup standards. The citizen is notified with photographic proof and the complaint case is permanently logged on the city transparency dashboard.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Back button */}
      <button
        onClick={() => setCurrentView("landing")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Full Citizen → AI → Municipal → Resolution Loop</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How CleanCity Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Bridging the accountability gap between citizens and municipal authorities with artificial intelligence and transparent field verification.
        </p>
      </div>

      {/* Institutional Collaboration Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Institutional Technical Collaboration
          </span>
          <span className="text-[11px] text-slate-500">
            SITAM Department of CSE • Greater Visakhapatnam Municipal Corporation (GVMC) • AP Police
          </span>
        </div>
        <div className="flex items-center gap-3">
          <InstitutionLogo type="sitam" />
          <span className="text-slate-300">|</span>
          <InstitutionLogo type="gvmc" />
          <span className="text-slate-300">|</span>
          <InstitutionLogo type="police" />
        </div>
      </div>

      {/* 5-Step Process Flow */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-5 hover:border-emerald-500/40 transition"
          >
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xl font-black text-slate-300">{step.num}</span>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Police Station & Public Safety Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="shrink-0">
          <InstitutionLogo type="police" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="text-base font-bold text-blue-300">
            Civic Public Safety & Police Station Escalation Protocol
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When CleanCity AI identifies critical hazardous issues—such as illegal commercial chemical sludge dumping, biohazardous hospital waste, or open toxic waste burning—the case is escalated directly to the local Police Station beat and GVMC Enforcement Wing for CCTV examination and regulatory challan issuance.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentView("report-issue")}
          className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-sm transition cursor-pointer"
        >
          <span>Report a Sanitation Issue Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
