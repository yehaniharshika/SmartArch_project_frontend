/**
 * SmartArch — Chat API
 * Calls to /api/chat/* endpoints (Phase 2 — RAG chatbot).
 * For Phase 1 (UI only), this uses a mock response locally.
 */

import client from "./client.js";

export const chatApi = {
  /**
   * Send a message to the RAG chatbot for a given floor plan.
   * @param {string} shareToken  - the plan's share token
   * @param {string} question    - user question
   * @param {Array}  history     - previous [{role, content}] messages
   * @returns {{ answer: string, suggestions: string[] }}
   */
  ask: (shareToken, question, history = []) =>
    client
      .post("/api/chat/ask", {
        share_token: shareToken,
        question,
        history,
      })
      .then((r) => r.data),
};

// ── Mock responses for UI-only mode (no backend) ──────────────────────────────
const RESPONSES = {
  area:     "The total floor area is **215.40 m²** (approximately 2,318 sq ft), which includes all rooms, circulation spaces, and the garage.",
  door:     "There are **8 doors** detected — 1 main entrance, 5 interior room doors, 1 bathroom, and 1 garage door. Standard 800–900mm widths throughout.",
  window:   "**12 windows** were detected. Living room has 3 large south-facing windows (1.5m wide). Bedroom windows average 900mm–1200mm.",
  room:     "Rooms identified: **Living Room, Dining Room, Kitchen, Bedroom 1, Bedroom 2, Bedroom 3, Bathroom 1, Bathroom 2, Utility Room, Double Garage** — 10 distinct spaces.",
  colour:   "For this layout I'd recommend **Farrow & Ball 'String'** for living areas, **'Cornforth White'** for bedrooms, and **'Railings'** charcoal as a feature accent. Pair with natural oak timber details.",
  bathroom: "The corner door position is **not optimal** — it creates dead space behind the swing. A sliding door or outward-opening door would improve usability in the 2.8m × 2.2m bathroom.",
  default:  "Based on the analysed floor plan, this is a well-organised residential layout with clear separation of public and private zones. What specific area would you like to explore?",
};

export function getMockResponse(question) {
  const q = question.toLowerCase();
  if (q.includes("area") || q.includes("sqm") || q.includes("size"))  return RESPONSES.area;
  if (q.includes("door"))     return RESPONSES.door;
  if (q.includes("window"))   return RESPONSES.window;
  if (q.includes("room") || q.includes("floor plan")) return RESPONSES.room;
  if (q.includes("colour") || q.includes("color") || q.includes("palette")) return RESPONSES.colour;
  if (q.includes("bathroom") || q.includes("corner")) return RESPONSES.bathroom;
  return RESPONSES.default;
}
