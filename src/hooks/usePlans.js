/**
 * SmartArch — services/planApi.js
 * Calls to /api/floor-plan/* and /api/chat/* endpoints.
 *
 * Backend endpoints (see FloorPlan_controller.py / Chat_controller.py):
 *   POST   /api/floor-plan/upload          ← upload + analyze (JWT required)
 *   GET    /api/floor-plan/my-plans        ← list user's plans (JWT required)
 *   GET    /api/floor-plan/<project_id>    ← get single plan   (JWT required)
 *   DELETE /api/floor-plan/<project_id>    ← delete plan       (JWT required)
 *   GET    /api/floor-plan/share/<token>   ← public share view (no auth)
 *   POST   /api/chat/share/<token>/ask     ← client asks chatbot (no auth)
 *   POST   /api/chat/<project_id>/ask      ← architect asks    (JWT required)
 *   GET    /api/chat/<project_id>/history  ← chat history      (JWT required)
 *
 * IMPORTANT: `client` (axios instance) is expected to attach the
 * Authorization: Bearer <token> header automatically via an interceptor
 * for every request except the two public share-link endpoints below.
 */

import client from "./client.js";

export const planApi = {

  // ── UPLOAD ─────────────────────────────────────────────────
  /**
   * Upload a floor plan for analysis.
   * Backend expects multipart/form-data with fields:
   *   project_name (text, required)
   *   file         (file, required — PNG/JPG/JPEG/PDF)
   *
   * @param {string}   projectName
   * @param {File}     file
   * @param {function} [onProgress]  (percent: number) => void
   * @returns {Promise<{success: boolean, data?: object, message?: string}>}
   */
  upload: (projectName, file, onProgress) => {
    const form = new FormData();
    form.append("project_name", projectName || "Untitled Project");
    form.append("file", file);

    return client
      .post("/api/floor-plan/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000,   // 5 min — YOLO + OCR pipeline can take time
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
   * Backend response shape: { success, count, data: [FloorPlan, ...] }
   */
  list: () =>
    client.get("/api/floor-plan/my-plans").then((r) => r.data),

  // ── GET BY ID ───────────────────────────────────────────────
  /**
   * Get a single floor plan's full analysis result.
   * @param {string} projectId  e.g. "PRJ-AB1C2D"
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
   * Delete a floor plan and all its related data (detections, OCR, chat).
   * Also removes uploaded/annotated files from disk (handled server-side).
   * @param {string} projectId
   */
  delete: (projectId) =>
    client.delete(`/api/floor-plan/${projectId}`).then((r) => r.data),
};

// ── CHAT API ────────────────────────────────────────────────────
export const chatApi = {

  /**
   * Client asks a question via the public share link.
   * NO authentication required — the share token identifies the plan.
   *
   * IMPORTANT: shareToken ≠ login JWT!
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