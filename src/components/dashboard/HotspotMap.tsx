import React, { useState } from "react";
import { HotspotData } from "../../types";
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

interface HotspotMapProps {
  hotspots: HotspotData[];
  onSelectWard?: (ward: string) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  hotspots,
  onSelectWard,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(hotspots[0] || null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getRiskBadge = (risk: HotspotData["riskLevel"]) => {
    switch (risk) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Critical Risk
          </span>
        );
      case "Severe":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            Severe Risk
          </span>
        );
      case "Moderate":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium uppercase bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Low Risk
          </span>
        );
    }
  };

  return (
    <div id="hotspot-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600" />
              Civic Cleanliness Hotspot Matrix
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              GVMC Zonal Heat Index
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated real-time sanitation risk based on active waste clusters, biological hazards, and drainage blocks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hotspots Ward list */}
        <div className="lg:col-span-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {hotspots.map((h) => {
              const isSelected = selectedHotspot?.ward === h.ward;
              return (
                <div
                  key={h.ward}
                  onClick={() => setSelectedHotspot(h)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-600"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{h.ward}</h4>
                      <p className="text-xs text-slate-500 font-medium">{h.zone}</p>
                    </div>
                    {getRiskBadge(h.riskLevel)}
                  </div>

                  <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Dominant Issue</span>
                      <span className="font-medium text-slate-800 truncate block max-w-[130px]">
                        {h.dominantCategory}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 block text-[11px]">Cleanliness Index</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${getScoreColor(
                          h.cleanlinessScore
                        )}`}
                      >
                        {h.cleanlinessScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Hotspot Deep Dive */}
        {selectedHotspot && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hotspot Analytics
                </span>
                {getRiskBadge(selectedHotspot.riskLevel)}
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 mb-0.5">
                {selectedHotspot.ward}
              </h4>
              <p className="text-xs text-slate-600 mb-4 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedHotspot.zone} • Coordinates: {selectedHotspot.lat.toFixed(3)}°N, {selectedHotspot.lng.toFixed(3)}°E
              </p>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Active Unresolved Issues</span>
                  <span className="font-bold text-slate-900">
                    {selectedHotspot.activeComplaints}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Critical Priority Alerts</span>
                  <span className={`font-bold ${selectedHotspot.criticalComplaints > 0 ? "text-rose-600" : "text-slate-900"}`}>
                    {selectedHotspot.criticalComplaints}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Total Logged (Historical)</span>
                  <span className="font-bold text-slate-900">
                    {selectedHotspot.totalComplaints}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Most Prevalent Waste Type</span>
                  <span className="font-bold text-emerald-800">
                    {selectedHotspot.dominantCategory}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  AI Zonal Recommendation
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {selectedHotspot.criticalComplaints > 0
                    ? "Dispatch immediate rapid response hazard vehicle to clear urgent industrial or bio-matter risk."
                    : selectedHotspot.activeComplaints >= 2
                    ? "Increase twice-daily compaction dumper frequency and assign dedicated foot sweepers."
                    : "Routine scheduled sanitary sweep meets GVMC standards for this sector."}
                </p>
              </div>
            </div>

            {onSelectWard && (
              <button
                type="button"
                onClick={() => onSelectWard(selectedHotspot.ward)}
                className="mt-4 w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                Filter Complaints for {selectedHotspot.ward}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
