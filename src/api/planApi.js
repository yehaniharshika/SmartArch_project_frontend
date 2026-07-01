/**
 * SmartArch — Plan API
 * Calls to /api/plans/* endpoints.
 */

import client from "./client.js";

export const planApi = {
  /**
   * Upload a floor plan file for analysis.
   * @param {File} file
   * @param {function} onProgress  - (percent: number) => void
   * @returns UploadResponseDTO
   */
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    return client
      .post("/api/plans/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 180000,   // 3 min for large PDFs
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      })
      .then((r) => r.data);
  },

  /**
   * List all floor plans for the logged-in architect.
   */
  list: () =>
    client.get("/api/plans/").then((r) => r.data),

  /**
   * Get a single floor plan's full analysis result.
   * @param {number} id
   */
  getById: (id) =>
    client.get(`/api/plans/${id}`).then((r) => r.data),

  /**
   * Get the annotated image URL for a plan.
   * Returns the URL (not the image) so <img src={...}> works.
   * @param {number} id
   */
  annotatedImageUrl: (id) =>
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/plans/${id}/annotated`,

  /**
   * Get a floor plan by its share token (public — no auth).
   * @param {string} token
   */
  getByShareToken: (token) =>
    client.get(`/api/plans/share/${token}`).then((r) => r.data),

  /**
   * Delete a floor plan.
   * @param {number} id
   */
  delete: (id) =>
    client.delete(`/api/plans/${id}`).then((r) => r.data),
};
