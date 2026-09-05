import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge";
import { Complaint, ComplaintStatus } from "../types";
import { 
  HardHat, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Play, 
  UploadCloud, 
  Camera, 
  X, 
  AlertTriangle,
  ArrowRight,
  Phone,
  Search,
  Sparkles,
  Info
} from "lucide-react";

// Resolution evidence demo photos
const RESOLUTION_PHOTOS = [
  {
    label: "Clean Container & Sanitized Street",
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "De-silted Free Flowing Culvert",
    url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Extinguished & Secured Ash Clearance",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  },
];

export const WorkerDashboard: React.FC = () => {
  const { 
    complaints, 
    auth, 
    updateComplaintStatus, 
    submitWorkerResolution, 
    viewComplaintDetails 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [selectedTaskForResolution, setSelectedTaskForResolution] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState(RESOLUTION_PHOTOS[0].url);
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const workerName = auth.user?.name || "Ramesh Kumar";
  const workerZone = auth.user?.zone || "Zone 2";

  // Filter tasks for this worker
  const assignedTasks = complaints.filter(
    (c) =>
      c.assignedWorker?.name === workerName ||
      c.assignedWorker?.id === auth.user?.id ||
      c.location.zone.toLowerCase().includes(workerZone.toLowerCase().slice(0, 6))
  );

  const pendingTasks = assignedTasks.filter((t) => t.status !== "RESOLVED" && t.status !== "RESOLUTION SUBMITTED");
  const completedTasks = assignedTasks.filter((t) => t.status === "RESOLVED" || t.status === "RESOLUTION SUBMITTED");

  const highPriorityCount = pendingTasks.filter((t) => t.priority === "HIGH" || t.priority === "CRITICAL").length;

  const displayedList = activeTab === "pending" ? pendingTasks : completedTasks;
  const filteredList = displayedList.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Workflow Handlers
  const handleAcceptTask = (task: Complaint) => {
    updateComplaintStatus(
      task.id,
      "ASSIGNED",
      `Task accepted by ${workerName}. Field squad mobilized.`,
      workerName
    );
  };

  const handleStartWork = (task: Complaint) => {
    updateComplaintStatus(
      task.id,
      "IN PROGRESS",
      `Sanitary team arrived on site. Active clearance started.`,
      workerName
    );
  };

  const handleOpenResolutionModal = (task: Complaint) => {
    setSelectedTaskForResolution(task);
    setResolutionNotes(`Site thoroughly cleared by GVMC field squad. Waste segregated and transported to Kapuluppada plant. Area disinfected.`);
    setResolutionPhoto(RESOLUTION_PHOTOS[0].url);
  };

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForResolution) return;

    if (!resolutionPhoto) {
      alert("Please upload resolution photographic evidence before marking completed!");
      return;
    }
    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes describing the cleaning work.");
      return;
    }

    setIsSubmittingResolution(true);
    setTimeout(() => {
      submitWorkerResolution(selectedTaskForResolution.id, resolutionNotes, resolutionPhoto);
      setIsSubmittingResolution(false);
      setSelectedTaskForResolution(null);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <HardHat className="w-3.5 h-3.5 text-emerald-400" />
              <span>GVMC Field Action Portal • {workerZone}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {workerName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              You are assigned to the Solid Waste Rapid Response Division. Ensure photographic evidence is logged before closing sanitation tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Zone</span>
              <span className="text-sm font-extrabold text-white">{workerZone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Active Assigned Tasks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendingTasks.length}</span>
            <span className="text-xs text-amber-600 font-semibold">Requires Action</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
            High / Critical Priority
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{highPriorityCount}</span>
            <span className="text-xs text-slate-500">Urgent Dispatch</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Completed / Verified
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-800">{completedTasks.length}</span>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Evidence Uploaded</span>
          </div>
        </div>
      </div>

      {/* Main Task List */}
      <div className="space-y-4">
        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Active Tasks ({pendingTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "completed"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Resolved History ({completedTasks.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, category, area..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Task Cards */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No tasks in this list</h3>
            <p className="text-xs text-slate-500 mt-1">All assigned zone tasks are up to date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredList.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                        {task.id}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {task.category}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{task.location.address} • <strong>{task.location.ward}</strong></span>
                  </div>

                  {/* Image & Description preview */}
                  <div className="flex gap-3 mb-3">
                    <img
                      src={task.imageUrl}
                      alt={task.category}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 line-clamp-2 italic mb-1.5">
                        "{task.description}"
                      </p>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 line-clamp-1">
                        <strong>AI Rec:</strong> {task.aiAnalysis.recommendedAction}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => viewComplaintDetails(task.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    View Timeline
                  </button>

                  <div className="flex items-center gap-2">
                    {task.status === "REPORTED" && (
                      <button
                        onClick={() => handleAcceptTask(task)}
                        className="py-1.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Accept Task
                      </button>
                    )}

                    {task.status === "ASSIGNED" && (
                      <button
                        onClick={() => handleStartWork(task)}
                        className="py-1.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {task.status === "IN PROGRESS" && (
                      <button
                        onClick={() => handleOpenResolutionModal(task)}
                        className="py-1.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Evidence & Complete</span>
                      </button>
                    )}

                    {(task.status === "RESOLUTION SUBMITTED" || task.status === "RESOLVED") && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Work Proof Submitted</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Evidence Modal */}
      {selectedTaskForResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Submit Resolution Evidence
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    {selectedTaskForResolution.id} • {selectedTaskForResolution.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTaskForResolution(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResolution} className="space-y-4">
              {/* Evidence Photo Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Photo Evidence (Mandatory)
                </label>
                <div className="h-44 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 mb-2">
                  <img
                    src={resolutionPhoto}
                    alt="Resolution evidence"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Select demo field proof photo:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {RESOLUTION_PHOTOS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setResolutionPhoto(item.url)}
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition ${
                        resolutionPhoto === item.url
                          ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-12 rounded object-cover mb-1" />
                      <span className="text-[10px] font-medium text-slate-700 line-clamp-1 block">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Field Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the work done: manpower used, equipment mobilized, weight of waste removed, disinfectant sprayed..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Once submitted, the resolution evidence is visible immediately on the Citizen Timeline and queued for Municipal Admin verification.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForResolution(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResolution}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingResolution ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Resolution</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
