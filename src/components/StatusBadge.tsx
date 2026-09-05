import React from "react";
import { ComplaintPriority, ComplaintSeverity, ComplaintStatus } from "../types";

export const PriorityBadge: React.FC<{ priority: ComplaintPriority; className?: string }> = ({
  priority,
  className = "",
}) => {
  switch (priority) {
    case "CRITICAL":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-100 text-rose-800 border border-rose-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          Critical
        </span>
      );
    case "HIGH":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase bg-yellow-100 text-yellow-800 border border-yellow-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
          Medium
        </span>
      );
    case "LOW":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Low
        </span>
      );
    default:
      return null;
  }
};

export const SeverityBadge: React.FC<{ severity: ComplaintSeverity; className?: string }> = ({
  severity,
  className = "",
}) => {
  const upper = (severity || "MEDIUM").toUpperCase() as ComplaintPriority;
  return <PriorityBadge priority={upper} className={className} />;
};

export const StatusBadge: React.FC<{ status: ComplaintStatus; className?: string }> = ({
  status,
  className = "",
}) => {
  switch (status) {
    case "REPORTED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Reported
        </span>
      );
    case "AI ANALYZED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          AI Analyzed
        </span>
      );
    case "ASSIGNED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          Assigned
        </span>
      );
    case "IN PROGRESS":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          In Progress
        </span>
      );
    case "RESOLUTION SUBMITTED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          Proof Uploaded
        </span>
      );
    case "VERIFIED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          Verified
        </span>
      );
    case "RESOLVED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Resolved
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};
