/**
 * SmartArch — App Constants
 */

export const APP_NAME = "SmartArch";
export const APP_VERSION = "1.0.0";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const FRONTEND_BASE = import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";

export const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "pdf"];
export const MAX_FILE_SIZE_MB   = 20;

export const PLAN_STATUSES = {
  PENDING:    "pending",
  PROCESSING: "processing",
  READY:      "ready",
  ERROR:      "error",
};

export const STATUS_VARIANTS = {
  ready:      "success",
  processing: "pending",
  error:      "error",
  pending:    "pending",
};

export const LABEL_COLORS = {
  wall:   { bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-600"    },
  door:   { bg: "bg-red-50",     border: "border-red-100",     text: "text-red-600"     },
  window: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
};

export const PIPELINE_STEPS = [
  { id: 1, label: "Saving file",           sub: "Storing floor plan securely"       },
  { id: 2, label: "PDF conversion",        sub: "Rendering at 200 DPI"               },
  { id: 3, label: "OCR extraction",        sub: "Reading text & dimensions"           },
  { id: 4, label: "Scale detection",       sub: "Calculating pixel-to-meter ratio"   },
  { id: 5, label: "YOLOv8 detection",      sub: "Detecting rooms, doors, windows"    },
  { id: 6, label: "Area calculation",      sub: "Computing floor areas"              },
  { id: 7, label: "GPT-4o vision",         sub: "Deep architectural analysis"        },
  { id: 8, label: "Saving results",        sub: "Persisting to database"             },
  { id: 9, label: "Generating share link", sub: "Creating client chatbot URL"        },
];

export const CHAT_SUGGESTIONS = [
  "What is the total floor area of the plan?",
  "How many doors are in the floor plan?",
  "What is the width of the largest window?",
  "What rooms are on this floor?",
  "What colour palette suits this home?",
  "Is the bathroom door position ideal?",
];
