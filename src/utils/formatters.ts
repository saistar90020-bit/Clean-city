export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

export function formatConfidence(confidence: number): string {
  if (typeof confidence !== "number" || isNaN(confidence)) return "92%";
  const pct = Math.round(confidence <= 1 ? confidence * 100 : confidence);
  return `${pct}%`;
}

export function getPriorityBadgeStyles(priority: string) {
  const p = (priority || "MEDIUM").toUpperCase();
  switch (p) {
    case "CRITICAL":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-600",
      };
    case "HIGH":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-600",
      };
    case "MEDIUM":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-600",
      };
    case "LOW":
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
      };
  }
}

export function getSeverityBadgeStyles(severity: string) {
  const s = (severity || "Medium").toUpperCase();
  switch (s) {
    case "CRITICAL":
      return {
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-300",
      };
    case "HIGH":
      return {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-300",
      };
    case "MEDIUM":
      return {
        bg: "bg-sky-50",
        text: "text-sky-800",
        border: "border-sky-300",
      };
    case "LOW":
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-300",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-300",
      };
  }
}
