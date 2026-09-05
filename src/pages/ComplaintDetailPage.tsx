import React from "react";
import { useApp } from "../context/AppContext";
import { PriorityBadge, SeverityBadge, StatusBadge } from "../components/StatusBadge";
import { InstitutionLogo } from "../components/InstitutionLogo";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  Building2,
  HardHat,
  Eye,
  Camera,
  ExternalLink
} from "lucide-react";

export const ComplaintDetailPage: React.FC = () => {
  const { 
    selectedComplaintId, 
    getComplaintById, 
    setCurrentView, 
    auth,
    verifyComplaintResolution,
    updateComplaintStatus
  } = useApp();

  const complaint = selectedComplaintId ? getComplaintById(selectedComplaintId) : null;

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Complaint Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested complaint ID does not exist or has been removed.
        </p>
        <button
          onClick={() => setCurrentView("landing")}
          className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const isAdmin = auth.user?.role === "admin";
  const isWorker = auth.user?.role === "worker";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            if (auth.isAuthenticated) {
              if (auth.user?.role === "citizen") setCurrentView("citizen-dashboard");
              else if (auth.user?.role === "worker") setCurrentView("worker-dashboard");
              else if (auth.user?.role === "admin") setCurrentView("admin-dashboard");
            } else {
              setCurrentView("landing");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">GVMC Civic Case File</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-900 text-white tracking-wider">
            {complaint.id}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Evidence, AI Diagnostics, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Case Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(complaint.reportedAt).toLocaleString()}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              {complaint.category}
            </h1>

            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600 mb-4">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                {complaint.location.address} • <strong className="text-slate-800">{complaint.location.ward}</strong> ({complaint.location.zone})
              </span>
            </div>

            {/* Description quote */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{complaint.description}"
            </div>
          </div>

          {/* Photo Evidence (Before vs After) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Visual Evidence Record</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Initial Citizen Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Citizen Report Photo (Before)</span>
                  <span className="text-[10px] text-slate-500">Original</span>
                </div>
                <div className="h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group relative">
                  <img
                    src={complaint.imageUrl}
                    alt="Original reported issue"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                    Reported: {complaint.location.ward}
                  </span>
                </div>
              </div>

              {/* Resolution Photo (if available) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Field Resolution Photo (After)</span>
                  {complaint.resolution ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Cleaned & Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Work In Progress
                    </span>
                  )}
                </div>
                <div className="h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center relative">
                  {complaint.resolution?.evidenceImageUrl ? (
                    <img
                      src={complaint.resolution.evidenceImageUrl}
                      alt="Resolution Evidence"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2">
                        <HardHat className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium block">
                        Resolution proof pending field work
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* If resolution notes exist */}
            {complaint.resolution && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Field Worker Resolution Report</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium">
                    By {complaint.resolution.workerName} • {new Date(complaint.resolution.submittedAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {complaint.resolution.notes}
                </p>

                {/* Admin Verification Action if pending verification */}
                {isAdmin && complaint.status === "RESOLUTION SUBMITTED" && (
                  <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-xs text-emerald-900 font-semibold">
                      Requires Municipal Commissioner Sign-Off:
                    </span>
                    <button
                      onClick={() => verifyComplaintResolution(complaint.id, "Sanitation quality certified compliant with GVMC health norms.")}
                      className="py-1.5 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify & Close Complaint</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Multimodal Analysis Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    AI Diagnostic & Severity Analysis
                  </h2>
                  <span className="text-[10px] text-slate-500 block">
                    Engine: {complaint.aiAnalysis.engine}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Confidence:</span>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {Math.round(complaint.aiAnalysis.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">{complaint.aiAnalysis.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Severity</span>
                <span className="font-bold text-slate-800 block mt-0.5">{complaint.aiAnalysis.severity}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Priority</span>
                <span className="font-bold text-slate-800 block mt-0.5">{complaint.aiAnalysis.priority}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                <span className="font-bold text-emerald-800 block mt-0.5">{complaint.status}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-0.5">AI Environmental Impact Evaluation:</span>
                <p className="text-slate-600 leading-relaxed">{complaint.aiAnalysis.explanation}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-0.5">Recommended Field Protocol:</span>
                <p className="text-emerald-900 leading-relaxed">{complaint.aiAnalysis.recommendedAction}</p>
              </div>
            </div>

            {/* Contextual Police Station Escalation Notice */}
            {complaint.aiAnalysis.hazardousEscalationRequired && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <InstitutionLogo type="police" showSubtitle={false} />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-blue-300 block mb-0.5">
                    Police Station Public Safety Beat Escalation
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Flagged for hazardous environmental non-compliance. Local Visakhapatnam City Police Station Beat Constable notified for nocturnal vigil and CCTV audit.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Timeline & Assignment Card */}
        <div className="space-y-6">
          {/* Assignment & Contact Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Sanitation Assignment Desk
            </h3>

            {complaint.assignedWorker ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {complaint.assignedWorker.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sanitation Lead • {complaint.assignedWorker.zone}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Contact:</span>
                  <a
                    href={`tel:${complaint.assignedWorker.phone}`}
                    className="font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{complaint.assignedWorker.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Awaiting automatic zone worker dispatch</span>
              </div>
            )}

            {/* Citizen Details */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Reporter:</span>
                <span className="font-semibold text-slate-800">{complaint.citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GVMC Ward:</span>
                <span className="font-semibold text-slate-800">{complaint.location.ward}</span>
              </div>
            </div>
          </div>

          {/* Visual Workflow Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Full Resolution Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.timeline.map((entry, index) => {
                const isLast = index === complaint.timeline.length - 1;
                return (
                  <div key={entry.id} className="relative group">
                    {/* Timeline bullet icon */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        isLast
                          ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                          : "border-slate-300 bg-white text-slate-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isLast ? "bg-white" : "bg-slate-400"}`} />
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className={`text-xs font-bold ${isLast ? "text-emerald-800" : "text-slate-800"}`}>
                          {entry.label}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        By {entry.author}
                      </div>

                      {entry.note && (
                        <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
