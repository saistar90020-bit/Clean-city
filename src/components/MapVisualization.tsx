import React, { useState } from "react";
import { Complaint } from "../types";
import { PriorityBadge, StatusBadge } from "./StatusBadge";
import { MapPin, Navigation, Eye, AlertTriangle } from "lucide-react";

interface MapVisualizationProps {
  complaints: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
  className?: string;
  selectedId?: string | null;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  complaints,
  onSelectComplaint,
  className = "",
  selectedId = null,
}) => {
  const [activePin, setActivePin] = useState<Complaint | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("all");

  // Approximate Visakhapatnam bounding box for SVG projection
  // Lat range: 17.65 to 17.85 (South to North)
  // Lng range: 83.18 to 83.42 (West to East)
  const minLat = 17.66;
  const maxLat = 17.84;
  const minLng = 83.18;
  const maxLng = 83.42;

  const projectToPercent = (lat: number, lng: number) => {
    // Invert lat for SVG Y (top is north)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 82 + 10;
    const x = ((lng - minLng) / (maxLng - minLng)) * 82 + 10;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  const getMarkerColor = (complaint: Complaint) => {
    if (complaint.status === "RESOLVED") return { bg: "bg-emerald-700", ring: "ring-emerald-400", text: "text-emerald-800", fill: "#047857" };
    switch (complaint.priority) {
      case "CRITICAL":
        return { bg: "bg-rose-600", ring: "ring-rose-300", text: "text-rose-700", fill: "#e11d48" };
      case "HIGH":
        return { bg: "bg-amber-500", ring: "ring-amber-300", text: "text-amber-700", fill: "#f59e0b" };
      case "MEDIUM":
        return { bg: "bg-yellow-500", ring: "ring-yellow-300", text: "text-yellow-700", fill: "#eab308" };
      case "LOW":
      default:
        return { bg: "bg-teal-600", ring: "ring-teal-300", text: "text-teal-800", fill: "#0d9488" };
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (selectedZone === "all") return true;
    return c.location.zone.toLowerCase().includes(selectedZone.toLowerCase());
  });

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* Map Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              GVMC Civic Sanitation Geo-Grid
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual distribution of reported sanitation events across Visakhapatnam
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-slate-600 font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-slate-600 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
            <span className="text-slate-600 font-medium">Resolved</span>
          </div>
        </div>
      </div>

      {/* Zone quick filter buttons */}
      <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">Filter Zone:</span>
        <button
          onClick={() => setSelectedZone("all")}
          className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedZone === "all" ? "bg-slate-800 text-white shadow-2xs" : "bg-white text-slate-600 hover:bg-slate-200"
          }`}
        >
          All GVMC ({complaints.length})
        </button>
        <button
          onClick={() => setSelectedZone("Zone 1")}
          className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedZone === "Zone 1" ? "bg-emerald-700 text-white shadow-2xs" : "bg-white text-slate-600 hover:bg-slate-200"
          }`}
        >
          Zone 1 (Dwaraka/Central)
        </button>
        <button
          onClick={() => setSelectedZone("Zone 2")}
          className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedZone === "Zone 2" ? "bg-emerald-700 text-white shadow-2xs" : "bg-white text-slate-600 hover:bg-slate-200"
          }`}
        >
          Zone 2 (MVP/East)
        </button>
        <button
          onClick={() => setSelectedZone("Zone 3")}
          className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedZone === "Zone 3" ? "bg-emerald-700 text-white shadow-2xs" : "bg-white text-slate-600 hover:bg-slate-200"
          }`}
        >
          Zone 3 (Gajuwaka/South)
        </button>
        <button
          onClick={() => setSelectedZone("Zone 4")}
          className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedZone === "Zone 4" ? "bg-emerald-700 text-white shadow-2xs" : "bg-white text-slate-600 hover:bg-slate-200"
          }`}
        >
          Zone 4 (Madhurawada/North)
        </button>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden select-none">
        {/* Subtle grid pattern & coastline illustration */}
        <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Bay of Bengal stylized coastline */}
          <path
            d="M 650 -20 Q 520 180 570 320 T 480 500 L 800 500 L 800 -20 Z"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <text x="82%" y="45%" fill="#38bdf8" fillOpacity="0.3" fontSize="13" fontWeight="bold" transform="rotate(45 580 180)">
            BAY OF BENGAL
          </text>
        </svg>

        {/* City Landmarks Annotations */}
        <div className="absolute top-4 left-6 text-[11px] font-semibold text-slate-400/80 pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>Visakhapatnam Metropolitan Region</span>
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 pointer-events-none">
          GVMC Civic GIS Grid • Open Vector Projection
        </div>

        {/* Zone Labels on Map */}
        <div className="absolute top-[18%] right-[28%] text-[10px] font-bold text-slate-500 tracking-wider uppercase pointer-events-none">
          Zone 4 (Madhurawada)
        </div>
        <div className="absolute top-[48%] right-[22%] text-[10px] font-bold text-slate-500 tracking-wider uppercase pointer-events-none">
          Zone 2 (MVP / Coast)
        </div>
        <div className="absolute top-[52%] left-[28%] text-[10px] font-bold text-slate-500 tracking-wider uppercase pointer-events-none">
          Zone 1 (Dwaraka)
        </div>
        <div className="absolute bottom-[22%] left-[20%] text-[10px] font-bold text-slate-500 tracking-wider uppercase pointer-events-none">
          Zone 3 (Gajuwaka)
        </div>

        {/* Complaint Markers */}
        {filteredComplaints.map((complaint) => {
          const coords = projectToPercent(complaint.location.lat, complaint.location.lng);
          const markerTheme = getMarkerColor(complaint);
          const isSelected = selectedId === complaint.id || activePin?.id === complaint.id;

          return (
            <div
              key={complaint.id}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-transform hover:scale-125"
              onClick={() => {
                setActivePin(complaint);
                if (onSelectComplaint) onSelectComplaint(complaint);
              }}
            >
              <div className="relative group">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white shadow-lg ring-2 ${markerTheme.ring} ${markerTheme.bg} transition ${
                    isSelected ? "ring-4 ring-white scale-115" : ""
                  }`}
                >
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>

                {/* Pulsing ring for critical issues */}
                {complaint.priority === "CRITICAL" && complaint.status !== "RESOLVED" && (
                  <span className="absolute -inset-1 rounded-full bg-rose-500/50 animate-ping pointer-events-none" />
                )}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap border border-slate-700">
                    {complaint.id}: {complaint.category}
                  </div>
                  <div className="w-2 h-1 bg-slate-900 clip-triangle" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Active Pin Detail Card Overlay */}
        {activePin && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3.5 z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{activePin.id}</span>
                  <PriorityBadge priority={activePin.priority} />
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                  {activePin.category}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePin(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2 mb-2.5">
              {activePin.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="truncate max-w-[170px]">📍 {activePin.location.ward} • {activePin.location.zone}</span>
              <StatusBadge status={activePin.status} />
            </div>

            {onSelectComplaint && (
              <button
                onClick={() => onSelectComplaint(activePin)}
                className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Complaint & Timeline</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
