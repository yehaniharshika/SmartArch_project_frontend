import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ZoomIn,
  DoorOpen,
  Square,
  LayoutGrid,
  Ruler,
  Map,
  MessageSquare,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import ShareLinkPanel from "../components/upload/ShareLinkPanel.jsx";
import Badge from "../components/ui/Badge.jsx";
import { usePlan } from "../hooks/usePlans.js";
import client from "../api/client.js";

function useAnnotatedImage(projectId) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    let objectUrl;
    setLoading(true);
    setSrc(null);

    client
      .get(`/api/floor-plan/${projectId}/annotated`, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      })
      .catch(() => setSrc(null))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [projectId]);

  return { src, loading };
}

const TABS = [
  { id: "detections", label: "Detections", icon: Ruler },
  { id: "rooms", label: "Rooms", icon: LayoutGrid },
  { id: "ocr", label: "OCR Text", icon: Map },
];

const LEGEND = [
  ["#3B82F6", "Walls"],
  ["#EF4444", "Doors"],
  ["#22C55E", "Windows"],
  ["#A855F7", "Rooms"],
];

export default function ResultPage() {
  const { projectId } = useParams();
  const { plan: result, loading, error } = usePlan(projectId);
  const { src: annotatedSrc, loading: imgLoading } =
    useAnnotatedImage(projectId);

  const [activeTab, setActiveTab] = useState("detections");

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center">
          <p
            className="text-sm text-stone-400"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Loading analysis result...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (error || !result) {
    return (
      <PageWrapper>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center space-y-3">
          <p
            className="text-sm text-red-700"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {error || "Floor plan not found."}
          </p>
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            <ArrowLeft size={13} /> Back to Dashboard
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const detections = result.detections ?? [];
  const rooms = result.rooms ?? [];
  const ocrRawTexts = result.ocr?.raw_texts ?? [];

  const doorCount = result.door_count ?? 0;
  const windowCount = result.window_count ?? 0;
  const roomCount = result.room_count ?? rooms.length;
  const totalSqm = result.total_area_sqm ?? 0;
  const totalSqft = result.total_area_sqft ?? 0;
  const processingTime = result.processing_time ?? 0;

  const projectName =
    result.project_name || result.original_filename || "Untitled Project";
  const shareUrl = result.share_url
    ? result.share_url.startsWith("http")
      ? result.share_url
      : `${window.location.origin}${result.share_url}`
    : result.share_token
      ? `${window.location.origin}/client/${result.share_token}`
      : "";

  const detectionCounts = {
    wall: detections.filter((d) => d.label?.toLowerCase() === "wall").length,
    door: detections.filter((d) => d.label?.toLowerCase() === "door").length,
    window: detections.filter((d) => d.label?.toLowerCase() === "window")
      .length,
  };

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <Link
              to="/dashboard"
              className="btn-ghost px-0 text-stone-500 mb-1 flex items-center gap-1 text-xs sm:text-sm"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              <ArrowLeft size={13} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1
                className="font-display text-2xl sm:text-display-md text-stone-900 truncate max-w-[220px] sm:max-w-lg"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                {projectName}
              </h1>
              <Badge
                label={result.status || "ready"}
                variant={
                  result.status === "ready" || !result.status
                    ? "success"
                    : "pending"
                }
                dot
              />
            </div>
            <p
              className="text-xs sm:text-sm text-stone-400"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Processed in {processingTime}s
            </p>
          </div>

          <div className="flex items-center gap-2">
            {annotatedSrc && (
              <a
                href={annotatedSrc}
                download={`${projectId}_annotated.jpg`}
                className="btn-secondary py-2 px-4 text-sm w-full sm:w-auto justify-center"
                style={{ fontFamily: "'Fredoka', sans-serif",borderRadius:"4px" }}
              >
                <Download size={13} /> Download report
              </a>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          <StatCard
            label="Total Area (Approx.)"
            value={Number(totalSqm).toFixed(1)}
            unit="m²"
            accent
          />
          <StatCard label="Doors" value={doorCount} icon={DoorOpen} />
          <StatCard label="Windows" value={windowCount} icon={Square} />
          <StatCard label="Rooms" value={roomCount} icon={LayoutGrid} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left — annotated image + tabs */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <div className="card overflow-hidden">
              <div
                className="flex items-center justify-center p-3 sm:p-6"
                style={{
                  backgroundColor: "var(--parchment)",
                  minHeight: "220px",
                }}
              >
                {imgLoading ? (
                  <p
                    className="font-mono text-xs"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    Loading annotated image…
                  </p>
                ) : annotatedSrc ? (
                  <img
                    src={annotatedSrc}
                    alt={`Annotated floor plan for ${projectName}`}
                    className="max-h-[280px] sm:max-h-[380px] lg:max-h-[480px] w-auto max-w-full object-contain rounded-sm shadow-md"
                  />
                ) : (
                  <p
                    className="font-mono text-xs text-center px-4"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    Annotated image unavailable.
                  </p>
                )}
              </div>

              {annotatedSrc && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-t border-stone-200 bg-white">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                    {LEGEND.map(([c, l]) => (
                      <div
                        key={l}
                        className="flex items-center gap-1.5 flex-shrink-0"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: c }}
                        />
                        <span className="font-mono text-[10px] text-stone-500 whitespace-nowrap">
                          {l}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-mono text-[10px] text-stone-400 whitespace-nowrap">
                      {result.image_width_px}×{result.image_height_px}px
                    </span>
                    <a
                      href={annotatedSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-400 hover:text-stone-700 transition-colors flex-shrink-0"
                    >
                      <ZoomIn size={14} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tab bar — horizontally scrollable on small screens */}
            <div className="border-b border-stone-200 flex gap-1 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0
                    ${
                      activeTab === tab.id
                        ? "border-stone-900 text-stone-900 font-medium"
                        : "border-transparent text-stone-500 hover:text-stone-700"
                    }`}
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  <tab.icon size={14} className="sm:w-[15px] sm:h-[15px]" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">
              {activeTab === "detections" && (
                <div className="space-y-4">
                  <p
                    className="label-mono"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    {detections.length} elements detected
                  </p>

                  {detections.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">
                      No structural elements detected.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 justify-center sm:justify-start">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: "#3B82F6" }}
                        />
                        <span className="text-xs sm:text-sm text-stone-700">
                          Walls
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-stone-900">
                          {detectionCounts.wall}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 justify-center sm:justify-start">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: "#EF4444" }}
                        />
                        <span className="text-xs sm:text-sm text-stone-700">
                          Doors
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-stone-900">
                          {detectionCounts.door}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 justify-center sm:justify-start">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: "#22C55E" }}
                        />
                        <span className="text-xs sm:text-sm text-stone-700">
                          Windows
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-stone-900">
                          {detectionCounts.window}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "rooms" && (
                <div className="space-y-3">
                  <p
                    className="label-mono"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    {rooms.length} rooms identified
                  </p>
                  {rooms.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">
                      No rooms identified.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rooms.map((room, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-md border border-stone-200 bg-stone-50"
                        >
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <p className="text-sm font-medium text-stone-800 truncate">
                              {room.name}
                            </p>
                            <span className="badge badge-bronze flex-shrink-0">
                              {room.room_type}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-stone-500">
                            <span>Width: {room.width_ft_in ?? "–"}</span>
                            <span>Height: {room.height_ft_in ?? "–"}</span>
                            <span>Area: {room.area_sqft ?? "–"} ft²</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ocr" && (
                <div className="space-y-2">
                  <p
                    className="label-mono mb-3"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    {ocrRawTexts.length} text blocks extracted
                  </p>
                  {ocrRawTexts.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">
                      No OCR text extracted.
                    </p>
                  ) : (
                    ocrRawTexts.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-md border border-stone-200 bg-stone-50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs text-stone-400 w-5 flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-xs sm:text-sm text-stone-800 truncate">
                            {t.text}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-stone-400 flex-shrink-0">
                          {Math.round((t.confidence ?? 0) * 100)}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {shareUrl && (
              <ShareLinkPanel
                shareUrl={shareUrl}
                shareToken={result.share_token}
              />
            )}

            <div className="card p-4 sm:p-5 space-y-3">
              <p
                className="label-mono"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                Area breakdown
              </p>
              {[
                ["Total floor area", `${Number(totalSqm).toFixed(2)} m²`],
                ["In square feet", `${Number(totalSqft).toFixed(0)} ft²`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 border-b border-stone-100 last:border-0"
                >
                  <span className="text-xs text-stone-500">{k}</span>
                  <span className="font-display text-base sm:text-lg text-stone-900">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {result.share_token && (
              <Link
                to={`/client/${result.share_token}`}
                className="btn-secondary w-full justify-center"
              >
                <MessageSquare size={14} />
                Preview client chatbot
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}