import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge";
import { normalizeStatus } from "../utils/lifecycle";
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Search
} from "lucide-react";

export const CitizenDashboard: React.FC = () => {
  const { complaints, auth, viewComplaintDetails, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const citizenEmail = auth.user?.email || "citizen@cleancity.demo";
  const citizenName = auth.user?.name || "Citizen";

  // Filter complaints by citizen (or include demo complaints for rich demo experience)
  const myComplaints = complaints.filter(
    (c) => c.citizenEmail.toLowerCase() === citizenEmail.toLowerCase() || c.citizenName.toLowerCase().includes("arun")
  );

  const pendingCount = myComplaints.filter(
    (c) => normalizeStatus(c.status) !== "RESOLVED"
  ).length;

  const resolvedCount = myComplaints.filter(
    (c) => normalizeStatus(c.status) === "RESOLVED"
  ).length;

  const totalCount = myComplaints.length;

  const displayedComplaints = myComplaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.ward.toLowerCase().includes(searchTerm.toLowerCase());

    const isResolved = normalizeStatus(c.status) === "RESOLVED";
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "resolved"
        ? isResolved
        : !isResolved;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {citizenName} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thank you for being an active civic guardian for Visakhapatnam. Track your complaints and monitor GVMC resolution times.
          </p>
        </div>

        <button
          onClick={() => setCurrentView("report-issue")}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-sm transition cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Report New Issue</span>
        </button>
      </div>

      {/* Your Civic Impact KPIs */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Your Civic Impact Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Reports Logged
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{totalCount}</span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">GVMC Verified</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              Active / In Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
              <span className="text-xs text-slate-500">Under Municipal Action</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Successfully Resolved
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-800">{resolvedCount}</span>
              <span className="text-xs text-emerald-800 font-semibold">
                {totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}% Success Rate` : "100%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            My Sanitation Reports ({displayedComplaints.length})
          </h2>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Active Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid */}
        {displayedComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No complaints match your criteria</h3>
            <p className="text-xs text-slate-500 mb-4">You have a clean slate! Encountered a sanitation issue in Visakhapatnam?</p>
            <button
              onClick={() => setCurrentView("report-issue")}
              className="py-2.5 px-5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition cursor-pointer"
            >
              + Report New Issue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => viewComplaintDetails(item.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-600/50 shadow-2xs hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col group"
              >
                {/* Photo banner */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-900/90 text-white backdrop-blur-xs">
                      {item.id}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-white/90 bg-slate-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {new Date(item.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">
                      {item.category}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item.location.address} • {item.location.ward}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer link */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
                    <span>View Resolution Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
