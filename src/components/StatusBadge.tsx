import React from "react";
import { ComplaintPriority, ComplaintSeverity, ComplaintStatus } from "../types";
import { normalizeStatus, getStatusBadgeStyles, getStatusLabel } from "../utils/lifecycle";
import { getPriorityBadgeStyles } from "../utils/formatters";

export const PriorityBadge: React.FC<{ priority: ComplaintPriority; className?: string; id?: string }> = ({
  priority,
  className = "",
  id,
}) => {
  const styles = getPriorityBadgeStyles(priority);
  const pUpper = (priority || "MEDIUM").toUpperCase();

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles.bg} ${styles.text} border ${styles.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${pUpper === "CRITICAL" ? "animate-ping" : ""}`} />
      {pUpper}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: ComplaintSeverity; className?: string; id?: string }> = ({
  severity,
  className = "",
  id,
}) => {
  const upper = (severity || "MEDIUM").toUpperCase() as ComplaintPriority;
  return <PriorityBadge priority={upper} className={className} id={id} />;
};

export const StatusBadge: React.FC<{ status: ComplaintStatus | string; className?: string; id?: string }> = ({
  status,
  className = "",
  id,
}) => {
  const norm = normalizeStatus(status);
  const styles = getStatusBadgeStyles(norm);
  const label = getStatusLabel(norm);

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.bg} ${styles.text} border ${styles.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
};
