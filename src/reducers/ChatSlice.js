import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../api/chatApi.js";

/**
 * sendChatMessage
 * Sends the client's question to the backend RAG chatbot and
 * returns the AI's answer for a given project (via share token).
 */
export const sendChatMessage = createAsyncThunk(
  "chat/send",
  async ({ shareToken, question }, { rejectWithValue }) => {
    try {
      const response = await chatApi.ask(shareToken, question);
      if (!response.success) {
        return rejectWithValue(response.message || "Could not get an answer.");
      }
      return response.data; // { project_id, question, answer }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Could not reach the assistant. Please try again."
      );
    }
  }
);

function makeMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    status: "idle", // "idle" | "sending" | "error"
    error: null,
  },
  reducers: {
    // Add the client's own message immediately (optimistic UI)
    addUserMessage: (state, action) => {
      state.messages.push(makeMessage("user", action.payload));
    },
    // Seed the conversation with a welcome message once plan data loads
    addBotMessage: (state, action) => {
      state.messages.push(makeMessage("bot", action.payload));
    },
    // Reset when leaving the chat page / switching projects
    resetChat: (state) => {
      state.messages = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.status = "sending";
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages.push(makeMessage("bot", action.payload.answer));
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        // Surface the failure as a bot message too, so the chat
        // thread stays readable instead of silently dropping it.
        state.messages.push(
          makeMessage(
            "bot",
            action.payload || "Something went wrong. Please try again."
          )
        );
      });
  },
});

export const { addUserMessage, addBotMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;