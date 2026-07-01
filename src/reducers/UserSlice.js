import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi.js";

// ── Thunks ──────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      if (!res.success) {
        return rejectWithValue(res.message || "Registration failed.");
      }
      return res.data; // { user, token }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed.";
      return rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      if (!res.success) {
        return rejectWithValue(res.message || "Login failed.");
      }
      return res.data; // { user, token }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Login failed.";
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────────

const initialState = {
  user: JSON.parse(localStorage.getItem("sa_user") || "null"),
  token: localStorage.getItem("sa_access_token") || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("sa_access_token");
      localStorage.removeItem("sa_user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("sa_access_token", action.payload.token);
        localStorage.setItem("sa_user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("sa_access_token", action.payload.token);
        localStorage.setItem("sa_user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;