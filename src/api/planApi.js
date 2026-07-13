/**
 * SmartArch — services/planApi.js
 * Calls to /api/floor-plan/* and /api/chat/* endpoints.
 */

import client from "./client.js";

export const planApi = {
  // ── UPLOAD ─────────────────────────────────────────────────
  /**
   * Upload a floor plan for analysis.
   * IMPORTANT: client.js sets a default "Content-Type: application/json"
   * header on the axios instance. That default is WRONG for this request
   * (a multipart/form-data body), so it must be explicitly cleared here —
   * setting it to `undefined` forces axios to auto-detect the FormData
   * body and generate the correct "multipart/form-data; boundary=..."
   * header itself.
   *
   * @param {string}   projectName
   * @param {File}     file
   * @param {function} onProgress  (percent: number) => void
   * @returns API response with project_id, share_token, rooms, etc.
   */
  upload: (projectName, file, onProgress) => {
    const form = new FormData();
    form.append("project_name", projectName || "Untitled Project");
    form.append("file", file);

    return client
      .post("/api/floor-plan/upload", form, {
        headers: { "Content-Type": undefined },  // clear the JSON default
        timeout: 300000,                          // 5 min — YOLO + OCR pipeline can take time
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      })
      .then((r) => r.data);
  },

  // ── LIST ────────────────────────────────────────────────────
  list: () => client.get("/api/floor-plan/my-plans").then((r) => r.data),

  // ── GET BY ID ───────────────────────────────────────────────
  getById: (projectId) =>
    client.get(`/api/floor-plan/${projectId}`).then((r) => r.data),

  // ── PUBLIC SHARE VIEW ───────────────────────────────────────
  getByShareToken: (shareToken) =>
    client.get(`/api/floor-plan/share/${shareToken}`).then((r) => r.data),

  // ── DELETE ──────────────────────────────────────────────────
  delete: (projectId) =>
    client.delete(`/api/floor-plan/${projectId}`).then((r) => r.data),

  // ── ANNOTATED IMAGE URL ─────────────────────────────────────
  annotatedImageUrl: (projectId) =>
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/floor-plan/${projectId}/annotated`,
};

// CHAT API 
export const chatApi = {
  askViaShareLink: (shareToken, question) =>
    client
      .post(
        `/api/chat/share/${shareToken}/ask`,
        { question },
        { headers: { Authorization: undefined } }
      )
      .then((r) => r.data),

  askAsArchitect: (projectId, question) =>
    client.post(`/api/chat/${projectId}/ask`, { question }).then((r) => r.data),

  getHistory: (projectId) =>
    client.get(`/api/chat/${projectId}/history`).then((r) => r.data),
};