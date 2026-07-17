import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Download, ZoomIn,
  Minus, DoorOpen, Square, LayoutGrid,
  Ruler, Map, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import PageWrapper    from "../components/layout/PageWrapper.jsx";
import StatCard       from "../components/ui/StatCard.jsx";
import DetectionCard  from "../components/upload/DetectionCard.jsx";
import ShareLinkPanel from "../components/upload/ShareLinkPanel.jsx";
import Badge          from "../components/ui/Badge.jsx";
import { usePlan }    from "../hooks/usePlans.js";
import client         from "../api/client.js";


function useAnnotatedImage(projectId) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    let objectUrl;
    setLoading(true);

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
  { id: "rooms",       label: "Rooms",      icon: LayoutGrid },
  { id: "ocr",         label: "OCR Text",   icon: Map },
];

export default function ResultPage() {
  const { projectId } = useParams();
  const { plan: result, loading, error } = usePlan(projectId);
  const { src: annotatedSrc, loading: imgLoading } = useAnnotatedImage(projectId);

  const [activeTab, setActiveTab] = useState("detections");
  const [showAllDets, setShowAllDets] = useState(false);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-20 text-center">
          <p className="text-sm text-stone-400" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Loading analysis result...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (error || !result) {
    return (
      <PageWrapper>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-20 text-center space-y-3">
          <p className="text-sm text-red-700" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {error || "Floor plan not found."}
          </p>
          <Link to="/dashboard" className="btn-secondary inline-flex">
            <ArrowLeft size={13} /> Back to Dashboard
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Extract data from the result object
  const detections  = result.detections ?? [];
  const rooms       = result.rooms ?? [];
  const ocrRawTexts = result.ocr?.raw_texts ?? [];

  const wallCount   = result.wall_count ?? 0;
  const doorCount   = result.door_count ?? 0;
  const windowCount = result.window_count ?? 0;
  const roomCount   = result.room_count ?? rooms.length;
  const totalSqm    = result.total_area_sqm ?? 0;
  const totalSqft   = result.total_area_sqft ?? 0;
  const processingTime = result.processing_time ?? 0;

  // scale: nested (GET /<id>) vs flat (upload response) — try both
  const pxPerMeter  = result.scale?.pixels_per_meter ?? result.pixels_per_meter ?? 0;
  const scaleMethod = result.scale?.method ?? result.scale_method ?? "unknown";
  const scaleConf   = result.scale?.confidence ?? result.scale_confidence ?? 0;

  const projectName = result.project_name || result.original_filename || "Untitled Project";
  const shareUrl = result.share_url
    ? (result.share_url.startsWith("http") ? result.share_url : `${window.location.origin}${result.share_url}`)
    : (result.share_token ? `${window.location.origin}/client/${result.share_token}` : "");

  const visibleDets = showAllDets ? detections : detections.slice(0, 6);

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to="/dashboard" className="btn-ghost px-0 text-stone-500 mb-1 flex items-center gap-1">
              <ArrowLeft size={13} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1
                className="font-display text-display-md text-stone-900 truncate max-w-lg"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                {projectName}
              </h1>
              <Badge
                label={result.status || "ready"}
                variant={result.status === "ready" || !result.status ? "success" : "pending"}
                dot
              />
            </div>
            <p className="text-sm text-stone-400" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Processed in {processingTime}s · Scale: {Number(pxPerMeter).toFixed(1)} px/m ({String(scaleMethod).replace(/_/g, " ")})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {annotatedSrc && (
              <a href={annotatedSrc} download={`${projectId}_annotated.jpg`} className="btn-secondary py-2 px-4 text-xs">
                <Download size={13} /> Download report
              </a>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total Area(Approximate)" value={Number(totalSqm).toFixed(1)} unit="m²" accent />
          <StatCard label="Doors"   value={doorCount}   icon={DoorOpen} />
          <StatCard label="Windows" value={windowCount} icon={Square} />
          <StatCard label="Rooms"   value={roomCount}   icon={LayoutGrid} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — annotated image + tabs */}
          <div className="lg:col-span-2 space-y-6">

            <div className="card overflow-hidden">
              <div className="bg-stone-800 aspect-[4/3] flex items-center justify-center relative group">
                {imgLoading ? (
                  <p className="font-mono text-xs text-stone-500">Loading annotated image…</p>
                ) : annotatedSrc ? (
                  <img
                    src={annotatedSrc}
                    alt={`Annotated floor plan for ${projectName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="font-mono text-xs text-stone-500">Annotated image unavailable.</p>
                )}

                {annotatedSrc && (
                  <>
                    <div className="absolute bottom-3 left-3 flex items-center gap-3">
                      {[
                        ["#3B82F6", "Walls"],
                        ["#EF4444", "Doors"],
                        ["#22C55E", "Windows"],
                      ].map(([c, l]) => (
                        <div key={l} className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c, opacity: 0.7 }} />
                          <span className="font-mono text-[9px] text-stone-400">{l}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={annotatedSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-sm transition-colors"
                    >
                      <ZoomIn size={13} className="text-white" />
                    </a>

                    <div className="absolute bottom-3 right-3 font-mono text-[9px] text-stone-500">
                      YOLOv8 annotated · {result.image_width_px}×{result.image_height_px}px
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-stone-200 flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-5 py-3 text-sm border-b-2 -mb-px transition-all
                    ${activeTab === tab.id
                      ? "border-stone-900 text-stone-900 font-medium"
                      : "border-transparent text-stone-500 hover:text-stone-700"
                    }`}
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">

              {activeTab === "detections" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                      {detections.length} elements detected
                    </p>
                    <div className="flex gap-2">
                      {["wall", "door", "window"].map((lbl) => (
                        <span key={lbl} className="badge badge-info">
                          {detections.filter((d) => d.label?.toLowerCase() === lbl).length} {lbl}s
                        </span>
                      ))}
                    </div>
                  </div>

                  {detections.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">No structural elements detected.</p>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {visibleDets.map((det, i) => (
                          <DetectionCard key={i} detection={det} index={i} />
                        ))}
                      </div>
                      {detections.length > 6 && (
                        <button
                          onClick={() => setShowAllDets(!showAllDets)}
                          className="btn-ghost w-full justify-center border border-stone-200"
                        >
                          {showAllDets ? (
                            <><ChevronUp size={14} /> Show less</>
                          ) : (
                            <><ChevronDown size={14} /> Show all {detections.length} detections</>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === "rooms" && (
                <div className="space-y-3">
                  <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                    {rooms.length} rooms identified
                  </p>
                  {rooms.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">No rooms identified.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {rooms.map((room, i) => (
                        <div key={i} className="p-4 rounded-md border border-stone-200 bg-stone-50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-stone-800">{room.name}</p>
                            <span className="badge badge-bronze">{room.room_type}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-stone-500">
                            <span>Width: {room.width_ft_in ?? "–"}</span>
                            <span>Height: {room.height_ft_in ?? "–"}</span>
                            <span>Area: {room.area_sqft ?? "–"} ft²</span>
                            <span className="truncate" title={room.dimension_source}>
                              Source: {room.dimension_source ?? "–"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ocr" && (
                <div className="space-y-2">
                  <p className="label-mono mb-3" style={{ fontFamily: "'Saira', sans-serif" }}>
                    {ocrRawTexts.length} text blocks extracted
                  </p>
                  {ocrRawTexts.length === 0 ? (
                    <p className="text-sm text-stone-400 py-8 text-center">No OCR text extracted.</p>
                  ) : (
                    ocrRawTexts.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-md border border-stone-200 bg-stone-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-stone-400 w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-sm text-stone-800">{t.text}</span>
                        </div>
                        <span className="font-mono text-xs text-stone-400">
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
              <ShareLinkPanel shareUrl={shareUrl} shareToken={result.share_token} />
            )}

            <div className="card p-5 space-y-3">
              <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                Area breakdown
              </p>
              {[
                ["Total floor area", `${Number(totalSqm).toFixed(2)} m²`],
                ["In square feet", `${Number(totalSqft).toFixed(0)} ft²`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-xs text-stone-500">{k}</span>
                  <span className="font-display text-lg text-stone-900">{v}</span>
                </div>
              ))}
            </div>

            {result.share_token && (
              <Link to={`/client/${result.share_token}`} className="btn-secondary w-full justify-center">
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