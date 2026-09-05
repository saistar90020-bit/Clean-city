import React, { useState } from "react";

export interface InstitutionLogoProps {
  type: "sitam" | "gvmc" | "police";
  variant?: "compact" | "badge" | "full";
  className?: string;
  showSubtitle?: boolean;
}

export const InstitutionLogo: React.FC<InstitutionLogoProps> = ({
  type,
  variant = "compact",
  className = "",
  showSubtitle = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Path to the authentic asset files in /public/logos/
  const imgPath = `/logos/${type}-logo.png`;

  const sizeClasses = {
    compact: "w-7 h-7 sm:w-8 sm:h-8",
    badge: "w-9 h-9 sm:w-10 sm:h-10",
    full: "w-11 h-11 sm:w-12 sm:h-12",
  }[variant];

  if (type === "sitam") {
    return (
      <div
        className={`inline-flex items-center gap-2 select-none ${className}`}
        title="SITAM - Satya Institute of Technology and Management (Since 1996)"
      >
        <div
          className={`relative flex items-center justify-center ${sizeClasses} rounded-lg bg-white border border-slate-200 shadow-2xs overflow-hidden shrink-0 transition-transform hover:scale-105`}
        >
          {!imgError ? (
            <img
              src={imgPath}
              alt="SITAM Crest - Satya Institute of Technology and Management"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-0.5"
            />
          ) : (
            <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="6" fill="#ffffff" />
              <circle cx="24" cy="18" r="8" fill="#f59e0b" />
              <path d="M24 10V26" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 26C18 22 30 22 34 26" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="24" cy="32" r="6" fill="#991b1b" />
              <text x="24" y="35" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">S</text>
            </svg>
          )}
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-xs font-black tracking-wider text-slate-900 uppercase">SITAM</span>
            <span className="text-[10px] text-amber-700 font-bold hidden sm:inline">CSE R&D</span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] text-slate-500 font-medium">Satya Institute of Tech • Since 1996</span>
          )}
        </div>
      </div>
    );
  }

  if (type === "gvmc") {
    return (
      <div
        className={`inline-flex items-center gap-2 select-none ${className}`}
        title="GVMC - Greater Visakhapatnam Municipal Corporation & AP State Government"
      >
        <div
          className={`relative flex items-center justify-center ${sizeClasses} rounded-lg bg-white border border-slate-200 shadow-2xs overflow-hidden shrink-0 transition-transform hover:scale-105`}
        >
          {!imgError ? (
            <img
              src={imgPath}
              alt="GVMC Official Seal - Government of Andhra Pradesh"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-0.5"
            />
          ) : (
            <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="6" fill="#ffffff" />
              <circle cx="24" cy="24" r="18" stroke="#047857" strokeWidth="2.5" fill="#f0fdf4" />
              <circle cx="24" cy="24" r="10" stroke="#f59e0b" strokeWidth="1.5" />
              <path d="M24 14V34M14 24H34" stroke="#047857" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="3" fill="#047857" />
            </svg>
          )}
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-xs font-black tracking-wider text-emerald-900 uppercase">GVMC</span>
            <span className="text-[10px] text-emerald-700 font-bold hidden sm:inline">AP GOVT</span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] text-slate-500 font-medium">Municipal Authority • Vizag</span>
          )}
        </div>
      </div>
    );
  }

  // Police Station / Public Safety - AP Police Badge
  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
      title="Andhra Pradesh Police - Public Safety & Escalation"
    >
      <div
        className={`relative flex items-center justify-center ${sizeClasses} rounded-lg bg-slate-950 border border-amber-500/30 shadow-2xs overflow-hidden shrink-0 transition-transform hover:scale-105`}
      >
        {!imgError ? (
          <img
            src={imgPath}
            alt="AP Police Badge Emblem"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-0.5"
          />
        ) : (
          <svg viewBox="0 0 48 48" className="w-full h-full p-0.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="6" fill="#090d16" />
            <path d="M24 7L37 12V24C37 33 24 41 24 41C24 41 11 33 11 24V12L24 7Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="24" cy="22" r="7" stroke="#dc2626" strokeWidth="2" fill="#1e293b" />
            <text x="24" y="24" textAnchor="middle" fill="#f8fafc" fontSize="5" fontWeight="bold" fontFamily="sans-serif">AP</text>
            <rect x="14" y="32" width="20" height="5" rx="1.5" fill="#1e3a8a" />
            <text x="24" y="36" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold" fontFamily="sans-serif">POLICE</text>
          </svg>
        )}
      </div>
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-xs font-black tracking-wider text-slate-900 uppercase">AP POLICE</span>
        </div>
        {showSubtitle ? (
          <span className="text-[9px] text-slate-500 font-medium">Law Enforcement & Safety</span>
        ) : (
          <span className="text-[9px] text-blue-700 font-semibold hidden md:inline">Public Safety</span>
        )}
      </div>
    </div>
  );
};

