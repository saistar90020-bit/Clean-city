import React from "react";
import { DashboardStatistics } from "../../types";
import { 
  FileText, 
  Clock, 
  HardHat, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  TrendingUp,
  ShieldCheck
} from "lucide-react";

interface DynamicMetricsProps {
  stats: DashboardStatistics;
  onFilterClick?: (filterKey: string, value: string) => void;
}

export const DynamicMetrics: React.FC<DynamicMetricsProps> = ({
  stats,
  onFilterClick,
}) => {
  return (
    <div id="dynamic-metrics-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Total Complaints */}
      <div 
        onClick={() => onFilterClick?.("status", "all")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Total Logged</span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
        <p className="text-[11px] text-slate-500 mt-1">100% geo-tracked</p>
      </div>

      {/* 2. Assigned / Pending */}
      <div 
        onClick={() => onFilterClick?.("status", "ASSIGNED")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-700">Assigned</span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{stats.assigned + stats.reported}</p>
        <p className="text-[11px] text-slate-500 mt-1">Dispatched to field</p>
      </div>

      {/* 3. In Progress */}
      <div 
        onClick={() => onFilterClick?.("status", "IN_PROGRESS")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-amber-700">In Progress</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <HardHat className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{stats.inProgress}</p>
        <p className="text-[11px] text-slate-500 mt-1">Active field crews</p>
      </div>

      {/* 4. Resolution Proof Uploaded */}
      <div 
        onClick={() => onFilterClick?.("status", "RESOLUTION_SUBMITTED")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-700">Proof Uploaded</span>
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{stats.resolutionSubmitted}</p>
        <p className="text-[11px] text-purple-600 font-medium mt-1">Awaiting admin verify</p>
      </div>

      {/* 5. Verified & Resolved */}
      <div 
        onClick={() => onFilterClick?.("status", "RESOLVED")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-700">Resolved</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-emerald-800">{stats.resolved}</p>
        <p className="text-[11px] text-emerald-600 font-medium mt-1">
          Avg: {stats.avgResolutionHours} hrs
        </p>
      </div>

      {/* 6. Critical Priority */}
      <div 
        onClick={() => onFilterClick?.("priority", "CRITICAL")}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-rose-300 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-rose-700">Critical Priority</span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-rose-700">{stats.critical}</p>
        <p className="text-[11px] text-rose-600 font-medium mt-1">Immediate response</p>
      </div>
    </div>
  );
};
