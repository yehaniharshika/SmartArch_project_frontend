import client from "./client.js";

export const chatApi = {
  /**
   * Send a question to the RAG chatbot for a given floor plan,
   * identified by its public share token.
   * @param {string} shareToken
   * @param {string} question
   * @returns {Promise<{success: boolean, data?: {project_id, question, answer}, message?: string}>}
   */
  ask: (shareToken, question) =>
    client
      .post(`/api/chat/share/${shareToken}/ask`, { question })
      .then((r) => r.data),
};