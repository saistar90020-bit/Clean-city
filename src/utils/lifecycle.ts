import { CanonicalComplaintStatus, ComplaintStatus, Role } from "../types";

/**
 * Normalizes legacy space-delimited statuses to standard canonical snake-case
 */
export function normalizeStatus(status: string): CanonicalComplaintStatus {
  const s = (status || "").trim().toUpperCase();
  if (s === "AI ANALYZED" || s === "AI_ANALYZED") return "AI_ANALYZED";
  if (s === "IN PROGRESS" || s === "IN_PROGRESS") return "IN_PROGRESS";
  if (s === "RESOLUTION SUBMITTED" || s === "RESOLUTION_SUBMITTED") return "RESOLUTION_SUBMITTED";
  if (s === "ASSIGNED") return "ASSIGNED";
  if (s === "VERIFIED") return "VERIFIED";
  if (s === "RESOLVED") return "RESOLVED";
  if (s === "REJECTED") return "REJECTED";
  if (s === "CANCELLED") return "CANCELLED";
  return "REPORTED";
}

/**
 * Checks whether a proposed status transition is permitted under
 * strict civic municipal governance rules and Role-Based Access Control (RBAC).
 */
export function canTransitionStatus(
  rawCurrentStatus: string,
  rawTargetStatus: string,
  userRole: Role
): { allowed: boolean; reason?: string } {
  const current = normalizeStatus(rawCurrentStatus);
  const target = normalizeStatus(rawTargetStatus);

  if (current === target) {
    return { allowed: false, reason: "Complaint is already in this status." };
  }

  // Allowed transitions map
  switch (current) {
    case "REPORTED":
      if (target === "CANCELLED") {
        if (userRole === "citizen" || userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only the reporting citizen or administrator can cancel a reported complaint." };
      }
      if (target === "AI_ANALYZED") {
        return { allowed: true }; // Automated or manual trigger
      }
      if (target === "ASSIGNED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only municipal administrators can assign workers." };
      }
      if (target === "REJECTED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only municipal administrators can reject a complaint." };
      }
      return { allowed: false, reason: `Invalid transition from REPORTED to ${target}. A complaint must be analyzed and assigned before progression.` };

    case "AI_ANALYZED":
      if (target === "ASSIGNED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only administrators can assign a worker after AI analysis." };
      }
      if (target === "REJECTED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only administrators can reject an analyzed complaint." };
      }
      return { allowed: false, reason: `Cannot jump from AI_ANALYZED directly to ${target}. Worker assignment is mandatory.` };

    case "ASSIGNED":
      if (target === "IN_PROGRESS") {
        if (userRole === "worker" || userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only the assigned field worker or administrator can begin work." };
      }
      if (target === "ASSIGNED") {
        if (userRole === "admin") {
          return { allowed: true }; // Reassignment
        }
        return { allowed: false, reason: "Only administrators can reassign tasks." };
      }
      return { allowed: false, reason: `Invalid transition from ASSIGNED to ${target}. Field work must start first.` };

    case "IN_PROGRESS":
      if (target === "RESOLUTION_SUBMITTED") {
        if (userRole === "worker" || userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only the field worker or supervisor can submit photographic proof of resolution." };
      }
      if (target === "ASSIGNED") {
        if (userRole === "admin") {
          return { allowed: true }; // Admin reassigning back
        }
        return { allowed: false, reason: "Only administrators can reassign active work." };
      }
      return { allowed: false, reason: `From IN_PROGRESS, resolution evidence must be submitted before verification.` };

    case "RESOLUTION_SUBMITTED":
      if (target === "VERIFIED" || target === "RESOLVED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only municipal administrators can inspect resolution proof and verify completion." };
      }
      if (target === "IN_PROGRESS") {
        if (userRole === "admin") {
          return { allowed: true }; // Admin rejects insufficient resolution
        }
        return { allowed: false, reason: "Only administrators can send incomplete work back to IN_PROGRESS." };
      }
      return { allowed: false, reason: `Resolution proof must be verified by an administrator.` };

    case "VERIFIED":
      if (target === "RESOLVED") {
        if (userRole === "admin") {
          return { allowed: true };
        }
        return { allowed: false, reason: "Only administrators can close a verified complaint." };
      }
      return { allowed: false, reason: `Verified complaints can only transition to final RESOLVED closure.` };

    case "RESOLVED":
      if (target === "IN_PROGRESS") {
        if (userRole === "admin") {
          return { allowed: true }; // Admin re-opening
        }
        return { allowed: false, reason: "Only municipal administrators can reopen a resolved complaint." };
      }
      return { allowed: false, reason: "This complaint is marked RESOLVED and closed." };

    case "REJECTED":
    case "CANCELLED":
      return { allowed: false, reason: `Complaint is ${current} and cannot be transitioned further.` };

    default:
      return { allowed: false, reason: "Unknown status transition." };
  }
}

/**
 * Returns user-friendly presentation label for any status
 */
export function getStatusLabel(status: string): string {
  const norm = normalizeStatus(status);
  switch (norm) {
    case "REPORTED":
      return "Reported";
    case "AI_ANALYZED":
      return "AI Analyzed";
    case "ASSIGNED":
      return "Assigned";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLUTION_SUBMITTED":
      return "Resolution Submitted";
    case "VERIFIED":
      return "Verified";
    case "RESOLVED":
      return "Resolved";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return norm;
  }
}

/**
 * Accessible status badge styles with high contrast
 */
export function getStatusBadgeStyles(status: string) {
  const norm = normalizeStatus(status);
  switch (norm) {
    case "REPORTED":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-300",
        dot: "bg-amber-500",
      };
    case "AI_ANALYZED":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-300",
        dot: "bg-indigo-500",
      };
    case "ASSIGNED":
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-300",
        dot: "bg-blue-500",
      };
    case "IN_PROGRESS":
      return {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-300",
        dot: "bg-orange-500 animate-pulse",
      };
    case "RESOLUTION_SUBMITTED":
      return {
        bg: "bg-purple-50",
        text: "text-purple-800",
        border: "border-purple-300",
        dot: "bg-purple-500",
      };
    case "VERIFIED":
      return {
        bg: "bg-teal-50",
        text: "text-teal-800",
        border: "border-teal-300",
        dot: "bg-teal-600",
      };
    case "RESOLVED":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-300",
        dot: "bg-emerald-600",
      };
    case "REJECTED":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-300",
        dot: "bg-red-600",
      };
    case "CANCELLED":
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-300",
        dot: "bg-slate-400",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-800",
        border: "border-slate-300",
        dot: "bg-slate-500",
      };
  }
}
