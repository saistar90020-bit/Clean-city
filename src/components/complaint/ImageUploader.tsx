import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { validateImageFile } from "../../utils/validation";

export const SAMPLE_EVALUATION_PHOTOS = [
  {
    id: "sample-1",
    title: "Garbage Overflow",
    category: "Garbage Overflow",
    url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    description: "Massive municipal waste container overflowing onto public footpath in MVP Colony. Scatter waste and stench.",
  },
  {
    id: "sample-2",
    title: "Blocked Storm Drain",
    category: "Blocked Storm Drain & Sewage",
    url: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
    description: "Culvert drainage line choked with single-use plastics and black sewage water backflowing into road.",
  },
  {
    id: "sample-3",
    title: "Open Waste Burning",
    category: "Open Garbage Burning",
    url: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
    description: "Unauthorized open burning of plastics and dry leaves emitting dense hazardous smoke into residential colony.",
  },
  {
    id: "sample-4",
    title: "Construction Rubble",
    category: "Construction & Demolition Waste",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80",
    description: "Broken concrete slabs, tiles and plaster dumped directly on the cycle track and roadside shoulder.",
  },
];

interface ImageUploaderProps {
  imagePreview: string;
  onImageSelected: (base64: string, previewUrl: string, mimeType?: string) => void;
  onSelectSamplePreset?: (sample: typeof SAMPLE_EVALUATION_PHOTOS[0]) => void;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePreview,
  onImageSelected,
  onSelectSamplePreset,
  required = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setValidationError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid file format");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      onImageSelected(base64String, base64String, file.type);
    };
    reader.onerror = () => {
      setValidationError("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          Photographic Evidence {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-slate-500">JPG, PNG, WebP up to 10MB</span>
      </div>

      {imagePreview ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 group">
          <img
            src={imagePreview}
            alt="Sanitation Evidence Preview"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-4">
            <div className="text-white">
              <p className="text-xs font-medium opacity-90 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Photo attached & ready for AI inspection
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="replace-photo-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-sm transition backdrop-blur-sm"
              >
                Change Photo
              </button>
              <button
                id="remove-photo-btn"
                type="button"
                onClick={() => onImageSelected("", "")}
                className="p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg shadow-sm transition"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[180px] ${
            isDragging
              ? "border-emerald-600 bg-emerald-50/50"
              : "border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-slate-100/60"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Drag & drop photo here, or <span className="text-emerald-700 underline">browse device</span>
          </p>
          <p className="text-xs text-slate-500">Take a direct camera photo or upload saved image</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {validationError && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Instant sample presets for hackathon live viva */}
      {onSelectSamplePreset && (
        <div className="pt-2">
          <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
            Quick Test Cases for Evaluation:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_EVALUATION_PHOTOS.map((s) => (
              <button
                key={s.id}
                id={`sample-preset-${s.id}`}
                type="button"
                onClick={() => onSelectSamplePreset(s)}
                className="flex items-center gap-2 p-2 text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition group"
              >
                <img
                  src={s.url}
                  alt={s.title}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-emerald-800 truncate">
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">Click to test</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
