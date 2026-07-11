/**
 * SmartArch — services/planApi.js
 * Calls to /api/floor-plan/* and /api/chat/* endpoints.
 *
 * IMPORTANT: Backend endpoints are:
 *   POST   /api/floor-plan/upload          ← upload + analyze
 *   GET    /api/floor-plan/my-plans        ← list user's plans
 *   GET    /api/floor-plan/<project_id>    ← get single plan
 *   DELETE /api/floor-plan/<project_id>    ← delete plan
 *   GET    /api/floor-plan/share/<token>   ← public share view
 *   POST   /api/chat/share/<token>/ask     ← client asks chatbot (no auth)
 *   POST   /api/chat/<project_id>/ask      ← architect asks  (JWT required)
 *   GET    /api/chat/<project_id>/history  ← chat history    (JWT required)
 */

import client from "./client.js";

export const planApi = {

  // ── UPLOAD ─────────────────────────────────────────────────
  /**
   * Upload a floor plan for analysis.
   * @param {File}     file
   * @param {string}   projectName
   * @param {function} onProgress  (percent: number) => void
   * @returns API response with project_id, share_token, rooms, etc.
   */
  upload: (file, projectName, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    form.append("project_name", projectName || "Untitled Project");

    return client
      .post("/api/floor-plan/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000,   // 5 min — Gemini OCR + YOLO can take time
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      })
      .then((r) => r.data);
  },

  // ── LIST ────────────────────────────────────────────────────
  /**
   * List all floor plans for the logged-in architect.
   * Requires JWT in Authorization header (added by axios interceptor).
   */
  list: () =>
    client.get("/api/floor-plan/my-plans").then((r) => r.data),

  // ── GET BY ID ───────────────────────────────────────────────
  /**
   * Get a single floor plan's full analysis result.
   * @param {string} projectId  e.g. "PRJ-AB1234"
   */
  getById: (projectId) =>
    client.get(`/api/floor-plan/${projectId}`).then((r) => r.data),

  // ── PUBLIC SHARE VIEW ───────────────────────────────────────
  /**
   * Get a floor plan by its share token — PUBLIC, no auth needed.
   * Used when the client opens the shared link.
   * @param {string} shareToken  (from upload response's "share_token" field)
   */
  getByShareToken: (shareToken) =>
    client.get(`/api/floor-plan/share/${shareToken}`).then((r) => r.data),

  // ── DELETE ──────────────────────────────────────────────────
  /**
   * Delete a floor plan and all its data.
   * @param {string} projectId
   */
  delete: (projectId) =>
    client.delete(`/api/floor-plan/${projectId}`).then((r) => r.data),

  // ── ANNOTATED IMAGE URL ─────────────────────────────────────
  /**
   * Returns the annotated image URL for use in <img src={...}>.
   * Note: annotated_image is a file path on the server — serve it
   * via a static files route or convert to base64 in the response.
   * For now, returns the full API URL.
   * @param {string} projectId
   */
  annotatedImageUrl: (projectId) =>
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/floor-plan/${projectId}/annotated`,
};

// ── CHAT API ────────────────────────────────────────────────────
export const chatApi = {

  /**
   * Client asks a question via the public share link.
   * NO authentication required — the share token identifies the plan.
   *
   * IMPORTANT: shareToken ≠ login token!
   * Use the "share_token" field from the upload response.
   *
   * @param {string} shareToken  from upload response "share_token"
   * @param {string} question    the client's question
   */
  askViaShareLink: (shareToken, question) =>
    client
      .post(
        `/api/chat/share/${shareToken}/ask`,
        { question },
        { headers: { Authorization: undefined } }  // no auth header needed
      )
      .then((r) => r.data),

  /**
   * Architect asks a question (JWT required).
   * @param {string} projectId
   * @param {string} question
   */
  askAsArchitect: (projectId, question) =>
    client
      .post(`/api/chat/${projectId}/ask`, { question })
      .then((r) => r.data),

  /**
   * Get chat history for a project (JWT required).
   * @param {string} projectId
   */
  getHistory: (projectId) =>
    client.get(`/api/chat/${projectId}/history`).then((r) => r.data),
};