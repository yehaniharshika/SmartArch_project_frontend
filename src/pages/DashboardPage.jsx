import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, ExternalLink, Copy, Plus } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import { usePlans } from "../hooks/usePlans.js";

/**
 * NOTE: This file was not part of the originally supplied frontend code —
 * it is built from scratch here, matching the visual conventions used in
 * UploadPage.jsx (PageWrapper, Saira/Fredoka fonts, stone/bronze palette).
 *
 * Field names read from each plan object (e.g. `plan.project_id`,
 * `plan.room_count`) assume the same key names FloorPlan_service.py uses
 * when building the upload response (AnalysisResultDTO.to_dict() +
 * project_id/project_name). The exact keys returned by
 * `FloorPlan_entity.to_dict()` for the /my-plans list endpoint were not
 * available when writing this file — confirm they match, or adjust the
 * `pid`/field lookups below if your entity uses different key names
 * (e.g. "id" instead of "project_id").
 */

const STATUS_STYLES = {
  ready:      { label: "Ready",      className: "bg-green-50 text-green-700 border-green-200" },
  processing: { label: "Processing", className: "bg-amber-50 text-amber-700 border-amber-200" },
  error:      { label: "Error",      className: "bg-red-50 text-red-700 border-red-200" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { plans, loading, error, deletePlan } = usePlans();

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this floor plan? This cannot be undone.")) return;
    try {
      await deletePlan(projectId);
      toast.success("Floor plan deleted.");
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleCopyShareLink = (e, shareToken) => {
    e.stopPropagation();
    if (!shareToken) {
      toast.error("Share link not available yet.");
      return;
    }
    const url = `${window.location.origin}/client/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied.");
  };

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">

        {/* Page header */}
        <div className="mb-10 flex items-end justify-between">
          <div className="space-y-1">
            <p
              className="label-mono text-bronze-DEFAULT"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Your Projects
            </p>
            <h1
              className="font-display text-display-lg text-stone-900"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Dashboard
            </h1>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="btn-primary flex items-center gap-2 text-md"
            style={{fontFamily: "'Fredoka', sans-serif" }}
          >
            <Plus size={14} />
            New Analysis
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <p
              className="text-sm text-stone-400"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Loading your floor plans...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
            <p
              className="text-sm text-red-700"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && plans.length === 0 && (
          <div className="py-20 text-center border border-dashed border-stone-300 rounded-md">
            <p
              className="text-sm text-stone-500 mb-4"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              No floor plans yet. Upload your first one to get started.
            </p>
            <button onClick={() => navigate("/upload")} className="btn-primary" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Upload a floor plan
            </button>
          </div>
        )}

        {/* Plan grid */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const pid = plan.project_id ?? plan.id;
              const statusInfo = STATUS_STYLES[plan.status] || STATUS_STYLES.processing;

              return (
                <div
                  key={pid}
                  onClick={() => navigate(`/result/${pid}`)}
                  className="card p-5 space-y-4 cursor-pointer hover:border-bronze-DEFAULT
                             border border-stone-200 rounded-md transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <p
                        className="text-md font-medium text-stone-800 truncate"
                        style={{ fontFamily: "'Saira', sans-serif" }}
                      >
                        {plan.project_name || plan.original_filename || "Untitled Project"}
                      </p>
                      <p className="font-mono text-sm text-stone-400">{pid}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${statusInfo.className}`}
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100">
                    <div>
                      <p className="font-mono text-sm text-stone-700">{plan.room_count ?? "–"}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide">Rooms</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-stone-700">
                        {plan.total_area_sqft != null ? `${plan.total_area_sqft}` : "–"}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide">Total Area</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-stone-700">
                        {plan.door_count ?? 0} , {plan.window_count ?? 0}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide">Doors & Windows</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleCopyShareLink(e, plan.share_token)}
                      className="text-xs text-stone-500 hover:text-bronze-DEFAULT
                                 flex items-center gap-1"
                    >
                      <Copy size={12} />
                      Share link
                    </button>
                    <div className="flex items-center gap-3">
                      <ExternalLink size={14} className="text-stone-400" />
                      <button
                        onClick={(e) => handleDelete(e, pid)}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}