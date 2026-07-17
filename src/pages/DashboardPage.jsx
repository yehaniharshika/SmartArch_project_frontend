import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2, ExternalLink, Copy, Plus, Home, Ruler, DoorOpen } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import { usePlans } from "../hooks/usePlans.js";

const STATUS_STYLES = {
  ready:      { label: "Ready",      className: "bg-green-50 text-green-700 border-green-200" },
  processing: { label: "Processing", className: "bg-amber-50 text-amber-700 border-amber-200" },
  error:      { label: "Error",      className: "bg-red-50 text-red-700 border-red-200" },
};

// ── Animation variants ──────────────────────────────────────────
// Parent grid staggers each card in one after another; each card
// itself rises + fades in. Kept subtle (12px rise, 0.35s) so it
// reads as "settling into place" rather than a flashy entrance —
// matching the restrained tone of the rest of the app.
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
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
            className="btn-primary flex items-center gap-2 text-[16px]"
            style={{ fontFamily: "'Fredoka', sans-serif", borderRadius: "6px" }}
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
            <button
              onClick={() => navigate("/upload")}
              className="btn-primary"
              style={{ fontFamily: "'Fredoka', sans-serif", borderRadius: "6px" }}
            >
              Upload a floor plan
            </button>
          </div>
        )}

        {/* Plan grid */}
        {!loading && !error && plans.length > 0 && (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {plans.map((plan) => {
              const pid = plan.project_id ?? plan.id;
              const statusInfo = STATUS_STYLES[plan.status] || STATUS_STYLES.processing;

              return (
                <motion.div
                  key={pid}
                  variants={cardVariants}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => navigate(`/result/${pid}`)}
                  /*
                    Card restructured with a thin top accent strip in the
                    same bronze-gradient family used on the login/register
                    cards (--parchment → --bronze-light → --bronze), so the
                    dashboard visually belongs to the same design system
                    instead of using a plain white/stone-only card.
                    overflow-hidden clips the strip's corners to match the
                    card's rounded-md.
                  */
                  className="rounded-md bg-white border border-stone-200
                             shadow-sm hover:shadow-md hover:border-bronze-light
                             transition-colors duration-200 cursor-pointer
                             overflow-hidden"
                >
                  

                  <div className="p-5 space-y-4">
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

                    {/*
                      Stats row — tinted parchment background instead of
                      plain white, with bronze icon chips per stat so the
                      numbers read as "belonging" to the palette rather
                      than sitting in neutral stone-700 on white.
                    */}
                    <div
                      className="grid grid-cols-3 gap-2 py-3 px-2 rounded-sm"
                      style={{ backgroundColor: "var(--parchment)" }}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--bronze-light)" }}
                        >
                          <Home size={12} className="text-white" />
                        </div>
                        <p className="font-mono text-sm" style={{ color: "var(--ink-muted)" }}>
                          {plan.room_count ?? "–"}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>
                          Rooms
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-1 text-center border-x" style={{ borderColor: "var(--warm)" }}>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--bronze-light)" }}
                        >
                          <Ruler size={12} className="text-white" />
                        </div>
                        <p className="font-mono text-sm" style={{ color: "var(--ink-muted)" }}>
                          {plan.total_area_sqft != null ? `${plan.total_area_sqft}` : "–"}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>
                          Total Area
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-1 text-center">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--bronze-light)" }}
                        >
                          <DoorOpen size={12} className="text-white" />
                        </div>
                        <p className="font-mono text-sm" style={{ color: "var(--ink-muted)" }}>
                          {plan.door_count ?? 0} · {plan.window_count ?? 0}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>
                          Doors & Windows
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleCopyShareLink(e, plan.share_token)}
                        className="text-sm flex items-center gap-1 transition-colors"
                        style={{ color: "var(--ink-faint)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bronze)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-faint)")}
                      >
                        <Copy size={12} />
                        Share link
                      </button>
                      <div className="flex items-center gap-3">
                        <ExternalLink size={16} className="text-stone-400" />
                        <button
                          onClick={(e) => handleDelete(e, pid)}
                          className="text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}