import React, { useState } from "react";
import { MapPin, Navigation, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { GVMC_AREAS } from "../../data/initialData";
import { ComplaintLocation } from "../../types";

interface LocationPickerProps {
  location: ComplaintLocation;
  onChange: (location: ComplaintLocation) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onChange,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "success" | "fallback">("idle");
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const handleFetchCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("fallback");
      setGpsMessage("Geolocation is not supported by your browser. Please select your GVMC area manually below.");
      return;
    }

    setIsLocating(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setGpsStatus("success");
        setGpsMessage("Current GPS coordinates captured with high precision.");

        onChange({
          ...location,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: location.address || "Current Location, Greater Visakhapatnam",
        });
      },
      (err) => {
        setIsLocating(false);
        setGpsStatus("fallback");
        if (err.code === err.PERMISSION_DENIED) {
          setGpsMessage("GPS access denied. You can select your municipal area from the GVMC area list below.");
        } else {
          setGpsMessage("GPS lookup timed out. Defaulted to GVMC zonal center coordinates.");
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectArea = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaName = e.target.value;
    const match = GVMC_AREAS.find((a) => a.name === areaName);
    if (match) {
      onChange({
        address: `${match.name}, ${match.ward}`,
        ward: match.ward,
        zone: match.zone,
        lat: match.lat,
        lng: match.lng,
      });
      setGpsStatus("success");
      setGpsMessage(`Mapped to GVMC ${match.ward} (${match.zone})`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          Complaint Location & Ward <span className="text-red-500">*</span>
        </label>
        <button
          id="get-gps-btn"
          type="button"
          onClick={handleFetchCurrentGps}
          disabled={isLocating}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? "Acquiring GPS..." : "Auto-Detect GPS"}</span>
        </button>
      </div>

      {gpsMessage && (
        <div
          className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${
            gpsStatus === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}
        >
          {gpsStatus === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          )}
          <span>{gpsMessage}</span>
        </div>
      )}

      {/* Select Predefined GVMC Area / Ward */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Select GVMC Sector / Ward
        </label>
        <select
          id="gvmc-area-select"
          value={location.ward ? GVMC_AREAS.find((a) => a.ward === location.ward)?.name || GVMC_AREAS[0].name : GVMC_AREAS[0].name}
          onChange={handleSelectArea}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm"
        >
          {GVMC_AREAS.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name} — {a.ward} ({a.zone})
            </option>
          ))}
        </select>
      </div>

      {/* Specific street address or landmark input */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Exact Street, Landmark or Door No.
        </label>
        <div className="relative">
          <input
            id="location-street-address"
            type="text"
            value={location.address}
            onChange={(e) => onChange({ ...location, address: e.target.value })}
            placeholder="e.g. Near Sector 4 Market, Opposite Government School"
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Geographic metadata pill */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
          Ward: <strong className="text-slate-800">{location.ward || "Ward 18"}</strong>
        </span>
        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
          Zone: <strong className="text-slate-800">{location.zone || "Zone 2"}</strong>
        </span>
        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 font-mono">
          {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
        </span>
      </div>
    </div>
  );
};
