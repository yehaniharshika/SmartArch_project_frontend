import { DoorOpen, Square, Minus, LayoutGrid } from "lucide-react";

const LABEL_CONFIG = {
  wall:    { icon: Minus,       color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100",   label: "Wall"    },
  door:    { icon: DoorOpen,    color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100",    label: "Door"    },
  window:  { icon: Square,      color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100",label: "Window"  },
  default: { icon: LayoutGrid,  color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", label: "Room"    },
};

export default function DetectionCard({ detection, index }) {
  const cfg = LABEL_CONFIG[detection.label?.toLowerCase()] || LABEL_CONFIG.default;
  const Icon = cfg.icon;
  const conf = Math.round((detection.confidence || 0) * 100);

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-md border ${cfg.bg} ${cfg.border}
                     hover:shadow-warm-sm transition-shadow duration-200`}>
      {/* Icon */}
      <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0
                       bg-white/70 ${cfg.color}`}>
        <Icon size={14} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-mono text-xs font-medium uppercase tracking-wider ${cfg.color}`}>
            {detection.ocr_label || detection.label || cfg.label}
          </span>
          <span className="font-mono text-xs text-stone-400">#{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* Dimensions grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-white/60 rounded-sm px-2 py-1 text-center">
            <p className="font-mono text-[10px] text-stone-400 leading-none mb-0.5">W</p>
            <p className="font-mono text-xs text-stone-700 font-medium">
              {detection.width_m?.toFixed(2) ?? "—"}m
            </p>
          </div>
          <div className="bg-white/60 rounded-sm px-2 py-1 text-center">
            <p className="font-mono text-[10px] text-stone-400 leading-none mb-0.5">H</p>
            <p className="font-mono text-xs text-stone-700 font-medium">
              {detection.height_m?.toFixed(2) ?? "—"}m
            </p>
          </div>
          <div className="bg-white/60 rounded-sm px-2 py-1 text-center">
            <p className="font-mono text-[10px] text-stone-400 leading-none mb-0.5">Area</p>
            <p className="font-mono text-xs text-stone-700 font-medium">
              {detection.area_sqm?.toFixed(2) ?? "—"}m²
            </p>
          </div>
        </div>

        {/* OCR dimension tag */}
        {detection.ocr_dimension && (
          <p className="font-mono text-[10px] text-stone-400">
            OCR: {detection.ocr_dimension}
          </p>
        )}
      </div>

      {/* Confidence pill */}
      <div className="flex-shrink-0 text-right">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center bg-white/50`}>
          <div className="text-center">
            <p className={`font-mono text-xs font-medium ${cfg.color}`}>{conf}%</p>
            <p className="font-mono text-[8px] text-stone-400 leading-none">conf</p>
          </div>
        </div>
      </div>
    </div>
  );
}
