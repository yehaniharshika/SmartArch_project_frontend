import { Link } from "react-router-dom";
import {
  FileImage, DoorOpen, Square, Minus, LayoutGrid,
  ArrowRight, Share2, Trash2, Clock
} from "lucide-react";
import Badge from "../ui/Badge.jsx";

export default function PlanCard({ plan, onDelete }) {
  const statusVariant = {
    ready:      "success",
    processing: "pending",
    error:      "error",
    pending:    "pending",
  }[plan.status] || "info";

  const date = plan.created_at
    ? new Date(plan.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—";

  return (
    <div className="card p-5 space-y-4 group">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 bg-stone-100 rounded-sm flex items-center justify-center flex-shrink-0
                          group-hover:bg-stone-200 transition-colors">
            <FileImage size={16} className="text-stone-500" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-sm font-medium text-stone-800 truncate">
              {plan.original_filename}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock size={10} className="text-stone-400" />
              <span className="font-mono text-xs text-stone-400">{date}</span>
            </div>
          </div>
        </div>
        <Badge label={plan.status} variant={statusVariant} dot />
      </div>

      {/* Stats row */}
      {plan.status === "ready" && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Minus,      count: plan.wall_count,   label: "Walls"   },
            { icon: DoorOpen,   count: plan.door_count,   label: "Doors"   },
            { icon: Square,     count: plan.window_count, label: "Windows" },
            { icon: LayoutGrid, count: plan.room_count,   label: "Rooms"   },
          ].map(({ icon: Icon, count, label }) => (
            <div key={label} className="bg-stone-50 rounded-sm p-2 text-center">
              <Icon size={12} className="text-stone-400 mx-auto mb-1" />
              <p className="font-mono text-sm font-medium text-stone-700">{count ?? 0}</p>
              <p className="font-mono text-[10px] text-stone-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Area */}
      {plan.status === "ready" && (
        <div className="flex items-center justify-between px-3 py-2 bg-stone-50 rounded-sm">
          <span className="font-mono text-xs text-stone-500">Total floor area</span>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-stone-900">
              {plan.total_floor_area_sqm?.toFixed(2) ?? "—"}
            </span>
            <span className="font-mono text-xs text-stone-400">m²</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1">
          {plan.share_token && (
            <Link
              to={`/chat/${plan.share_token}`}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              <Share2 size={12} />
              Share
            </Link>
          )}
          <button
            onClick={() => onDelete?.(plan.id)}
            className="btn-ghost text-xs py-1.5 px-3 hover:text-red-600"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
        <Link
          to={`/result/${plan.id}`}
          className="btn-primary py-1.5 px-4 text-xs"
        >
          View
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
