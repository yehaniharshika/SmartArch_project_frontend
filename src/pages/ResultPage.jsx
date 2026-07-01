import { useState } from "react";
import { Link } from "react-router-dom";
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

// ── Mock result data ──────────────────────────────────────────────────────────
const MOCK_RESULT = {
  id: 1,
  original_filename: "villa_ground_floor.pdf",
  status: "ready",
  image_width_px: 2480,
  image_height_px: 1754,
  scale: { pixels_per_meter: 82.5, method: "scale_ratio", confidence: 0.90 },
  wall_count: 18,
  door_count: 8,
  window_count: 12,
  room_count: 6,
  total_floor_area_sqm: 215.4,
  total_floor_area_sqft: 2318.2,
  processing_time_sec: 8.34,
  share_token: "tok_abc123eyJhbGciOiJIUzI1NiJ9",
  share_url: "http://localhost:3000/chat/tok_abc123eyJhbGciOiJIUzI1NiJ9",
  gpt_summary: "This ground floor plan presents a well-organised residential layout spanning approximately 215 m². The open-plan living and dining areas occupy the central zone, benefiting from south-facing windows. Three bedrooms are positioned on the north wing for privacy, each with direct bathroom access. The kitchen connects to a utility room, and a double garage is accessible via the west entrance. Structural walls are predominantly load-bearing concrete block, with lightweight partitions separating the bedrooms.",
  gpt_room_list: ["Living Room", "Dining Room", "Kitchen", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Bathroom 1", "Bathroom 2", "Utility Room", "Garage"],
  ocr_texts: [
    { text: "3.500m", is_dimension: true,  parsed_meters: 3.5,  confidence: 0.92 },
    { text: "4.200m", is_dimension: true,  parsed_meters: 4.2,  confidence: 0.88 },
    { text: "Living Room", is_dimension: false, confidence: 0.95 },
    { text: "Bedroom 1",   is_dimension: false, confidence: 0.91 },
    { text: "1:100",       is_dimension: true,  confidence: 0.96 },
    { text: "Kitchen",     is_dimension: false, confidence: 0.89 },
  ],
  detections: [
    { label:"door",   confidence:0.92, width_m:0.90, height_m:2.10, area_sqm:1.89, ocr_label:"Main Entrance", ocr_dimension:null  },
    { label:"door",   confidence:0.88, width_m:0.80, height_m:2.10, area_sqm:1.68, ocr_label:"Bedroom 1",     ocr_dimension:null  },
    { label:"door",   confidence:0.85, width_m:0.80, height_m:2.10, area_sqm:1.68, ocr_label:"Bathroom",      ocr_dimension:null  },
    { label:"window", confidence:0.91, width_m:1.20, height_m:1.50, area_sqm:1.80, ocr_label:null,            ocr_dimension:"1.2m"},
    { label:"window", confidence:0.87, width_m:0.90, height_m:1.20, area_sqm:1.08, ocr_label:null,            ocr_dimension:"900mm"},
    { label:"window", confidence:0.84, width_m:1.50, height_m:1.50, area_sqm:2.25, ocr_label:null,            ocr_dimension:"1.5m"},
    { label:"wall",   confidence:0.96, width_m:8.40, height_m:0.20, area_sqm:1.68, ocr_label:null,            ocr_dimension:"8.4m"},
    { label:"wall",   confidence:0.94, width_m:6.20, height_m:0.20, area_sqm:1.24, ocr_label:null,            ocr_dimension:"6.2m"},
    { label:"wall",   confidence:0.89, width_m:4.50, height_m:0.20, area_sqm:0.90, ocr_label:null,            ocr_dimension:"4.5m"},
    { label:"Living Room", confidence:0.82, width_m:5.20, height_m:4.80, area_sqm:24.96, ocr_label:"Living Room", ocr_dimension:null },
    { label:"Bedroom",     confidence:0.79, width_m:4.20, height_m:3.80, area_sqm:15.96, ocr_label:"Bedroom 1",   ocr_dimension:null },
    { label:"Kitchen",     confidence:0.81, width_m:4.50, height_m:3.50, area_sqm:15.75, ocr_label:"Kitchen",     ocr_dimension:null },
  ],
};

export default function ResultPage() {
  const result = MOCK_RESULT;
  const [activeTab, setActiveTab]   = useState("detections");
  const [showAllDets, setShowAllDets] = useState(false);

  const visibleDets = showAllDets ? result.detections : result.detections.slice(0, 6);

  const shareUrl = result.share_url || `http://localhost:3000/chat/${result.share_token}`;

  const TABS = [
    { id: "detections", label: "Detections",   icon: Ruler },
    { id: "ocr",        label: "OCR Text",      icon: Map   },
    { id: "gpt",        label: "GPT-4o Report", icon: MessageSquare },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 space-y-8">

        {/* ── Breadcrumb / header ───────────────────────────────────── */}
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
                {result.original_filename}
              </h1>
              <Badge label="ready" variant="success" dot />
            </div>
            <p 
              className="text-xs text-stone-400"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Processed in {result.processing_time_sec}s • 
              Scale: 1:{Math.round(1000 / result.scale.pixels_per_meter * 82.5)} ({result.scale.method})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary py-2 px-4 text-xs">
              <Download size={13} /> Download report
            </button>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Area", value: result.total_floor_area_sqm.toFixed(1), unit: "m²", accent: true },
            { label: "Area",       value: result.total_floor_area_sqft.toFixed(0), unit: "ft²" },
            { label: "Walls",      value: result.wall_count,   icon: Minus      },
            { label: "Doors",      value: result.door_count,   icon: DoorOpen   },
            { label: "Windows",    value: result.window_count, icon: Square     },
            { label: "Rooms",      value: result.room_count,   icon: LayoutGrid },
          ].map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left — Annotated image + tabs ────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Annotated image */}
            <div className="card overflow-hidden">
              <div className="bg-stone-800 aspect-[4/3] flex items-center justify-center relative group">
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-60" fill="none">
                  {/* SVG content remains unchanged */}
                  <rect x="20" y="20" width="360" height="260" stroke="#8B7355" strokeWidth="3"/>
                  <rect x="20" y="20" width="180" height="140" stroke="#6B9FBF" strokeWidth="1.5" fill="rgba(107,159,191,0.1)"/>
                  <rect x="200" y="20" width="180" height="100" stroke="#6B9FBF" strokeWidth="1.5" fill="rgba(107,159,191,0.1)"/>
                  <rect x="20" y="160" width="120" height="120" stroke="#6B9FBF" strokeWidth="1.5" fill="rgba(107,159,191,0.1)"/>
                  <rect x="140" y="160" width="100" height="120" stroke="#6B9FBF" strokeWidth="1.5" fill="rgba(107,159,191,0.1)"/>
                  <rect x="240" y="120" width="140" height="160" stroke="#6B9FBF" strokeWidth="1.5" fill="rgba(107,159,191,0.1)"/>
                  {[[20,80,12,20],[195,60,10,20],[135,165,20,12]].map(([x,y,w,h],i)=>(
                    <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(200,50,50,0.7)" rx="1"/>
                  ))}
                  {[[80,20,30,6],[250,20,40,6],[380,80,6,25],[380,170,6,30]].map(([x,y,w,h],i)=>(
                    <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(50,180,80,0.7)" rx="1"/>
                  ))}
                  <text x="95" y="95" fontSize="10" fill="#C8B896" textAnchor="middle">Living Room</text>
                  <text x="290" y="65" fontSize="9" fill="#C8B896" textAnchor="middle">Kitchen</text>
                  <text x="75" y="225" fontSize="9" fill="#C8B896" textAnchor="middle">Bedroom 1</text>
                  <text x="190" y="225" fontSize="9" fill="#C8B896" textAnchor="middle">Bed 2</text>
                  <text x="315" y="205" fontSize="9" fill="#C8B896" textAnchor="middle">Garage</text>
                </svg>

                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  {[["#3B82F6","Walls"],["#EF4444","Doors"],["#22C55E","Windows"]].map(([c,l])=>(
                    <div key={l} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:c,opacity:.7}}/>
                      <span className="font-mono text-[9px] text-stone-400">{l}</span>
                    </div>
                  ))}
                </div>

                <button className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-sm transition-colors">
                  <ZoomIn size={13} className="text-white" />
                </button>

                <div className="absolute bottom-3 right-3 font-mono text-[9px] text-stone-500">
                  YOLOv8 annotated · {result.image_width_px}×{result.image_height_px}px
                </div>
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

            {/* Tab Content */}
            <div className="animate-fade-in">

              {activeTab === "detections" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                      {result.detections.length} elements detected
                    </p>
                    <div className="flex gap-2">
                      {["wall","door","window"].map((lbl) => (
                        <span key={lbl} className="badge badge-info">
                          {result.detections.filter(d => d.label.toLowerCase() === lbl).length} {lbl}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {visibleDets.map((det, i) => (
                      <DetectionCard key={i} detection={det} index={i} />
                    ))}
                  </div>
                  {result.detections.length > 6 && (
                    <button
                      onClick={() => setShowAllDets(!showAllDets)}
                      className="btn-ghost w-full justify-center border border-stone-200"
                    >
                      {showAllDets ? (
                        <><ChevronUp size={14} /> Show less</>
                      ) : (
                        <><ChevronDown size={14} /> Show all {result.detections.length} detections</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {activeTab === "ocr" && (
                <div className="space-y-3">
                  <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                    {result.ocr_texts.length} text blocks extracted
                  </p>
                  <div className="space-y-2">
                    {result.ocr_texts.map((t, i) => (
                      <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-md border
                        ${t.is_dimension ? "bg-amber-50 border-amber-100" : "bg-stone-50 border-stone-200"}`}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-stone-400 w-5">
                            {String(i+1).padStart(2,"0")}
                          </span>
                          <span className="font-mono text-sm text-stone-800">{t.text}</span>
                          {t.is_dimension && (
                            <span className="badge badge-bronze">
                              {t.parsed_meters ? `${t.parsed_meters}m` : "dimension"}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-stone-400">
                          {Math.round(t.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "gpt" && (
                <div className="space-y-5">
                  <div>
                    <p className="label-mono mb-3" style={{ fontFamily: "'Saira', sans-serif" }}>
                      Architectural Summary
                    </p>
                    <div className="bg-stone-50 border border-stone-200 rounded-md p-6">
                      <p 
                        className="text-sm leading-relaxed text-stone-700"
                        style={{ fontFamily: "'Fredoka', sans-serif" }}
                      >
                        {result.gpt_summary}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="label-mono mb-3" style={{ fontFamily: "'Saira', sans-serif" }}>
                      Detected Rooms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.gpt_room_list.map((room) => (
                        <span key={room} className="badge badge-info">{room}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar ──────────────────────────────────────── */}
          <div className="space-y-5">
            <ShareLinkPanel
              shareUrl={shareUrl}
              shareToken={result.share_token}
            />

            <div className="card p-5 space-y-3">
              <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                Scale information
              </p>
              {[
                ["Pixels/meter", `${result.scale.pixels_per_meter.toFixed(1)} px/m`],
                ["Method", result.scale.method.replace("_", " ")],
                ["Confidence", `${Math.round(result.scale.confidence * 100)}%`],
                ["Image size", `${result.image_width_px} × ${result.image_height_px}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs text-stone-500">{k}</span>
                  <span className="font-mono text-xs text-stone-800 font-medium">{v}</span>
                </div>
              ))}
            </div>

            <div className="card p-5 space-y-3">
              <p className="label-mono" style={{ fontFamily: "'Saira', sans-serif" }}>
                Area breakdown
              </p>
              {[
                ["Total floor area", `${result.total_floor_area_sqm.toFixed(2)} m²`],
                ["In square feet", `${result.total_floor_area_sqft.toFixed(0)} ft²`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-xs text-stone-500">{k}</span>
                  <span className="font-display text-lg text-stone-900">{v}</span>
                </div>
              ))}
            </div>

            <Link
              to={`/chat/${result.share_token}`}
              className="btn-secondary w-full justify-center"
            >
              <MessageSquare size={14} />
              Preview client chatbot
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}