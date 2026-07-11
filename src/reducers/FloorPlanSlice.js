/**
 * SmartArch — floorPlanSlice.js
 *
 * Redux state for floor plan upload + analysis pipeline.
 *
 * State shape:
 *   plans       : []         ← list of user's floor plans (dashboard)
 *   currentPlan : null       ← currently viewed/just-uploaded plan result
 *   uploadStatus: "idle"     ← "idle" | "uploading" | "analysing" | "done" | "error"
 *   uploadProgress: 0        ← file upload progress 0-100
 *   pipelineStep: 0          ← animation step for AnalysisPipelineProgress (1-9)
 *   error       : null       ← error message if upload/fetch fails
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planApi } from "../api/planApi.js";

// ── Async Thunks ─────────────────────────────────────────────────────────────

/**
 * uploadFloorPlan
 * Uploads the file + starts the backend analysis pipeline.
 * The backend runs synchronously (YOLO → OCR → rooms → save),
 * so a single POST returns the full result when done.
 */
export const uploadFloorPlan = createAsyncThunk(
  "floorPlan/upload",
  async ({ projectName, file, onProgress }, { dispatch, rejectWithValue }) => {
    try {
      // Animate pipeline steps while waiting for backend
      let step = 1;
      dispatch(floorPlanSlice.actions.setPipelineStep(step));

      const stepTimer = setInterval(() => {
        step = Math.min(step + 1, 8);  // advance up to step 8 (step 9 = done)
        dispatch(floorPlanSlice.actions.setPipelineStep(step));
      }, 3500);  // new step every 3.5s (backend ~60-200s total)

      const response = await planApi.upload(projectName, file, (pct) => {
        dispatch(floorPlanSlice.actions.setUploadProgress(pct));
        onProgress?.(pct);
      });

      clearInterval(stepTimer);
      dispatch(floorPlanSlice.actions.setPipelineStep(9));  // all done

      if (!response.success) {
        return rejectWithValue(response.message || "Upload failed.");
      }

      return response.data;   // AnalysisResultDTO as JSON

    } catch (err) {
      const msg = err?.response?.data?.message
               || err?.message
               || "Upload failed. Check your connection.";
      return rejectWithValue(msg);
    }
  }
);

/**
 * fetchMyPlans
 * Load the logged-in user's plan list for the dashboard.
 */
export const fetchMyPlans = createAsyncThunk(
  "floorPlan/fetchMyPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await planApi.list();
      if (!response.success) {
        return rejectWithValue(response.message || "Could not load plans.");
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Could not load plans.");
    }
  }
);

/**
 * fetchPlanById
 * Load a single plan's full result (e.g. from result page).
 */
export const fetchPlanById = createAsyncThunk(
  "floorPlan/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await planApi.getById(projectId);
      if (!response.success) {
        return rejectWithValue(response.message || "Plan not found.");
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Plan not found.");
    }
  }
);

/**
 * deletePlan
 * Delete a plan (called from dashboard).
 */
export const deletePlan = createAsyncThunk(
  "floorPlan/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await planApi.delete(projectId);
      if (!response.success) {
        return rejectWithValue(response.message || "Delete failed.");
      }
      return projectId;  // return id so reducer can remove from list
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Delete failed.");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    plans:          [],
    currentPlan:    null,
    uploadStatus:   "idle",    // "idle"|"uploading"|"analysing"|"done"|"error"
    uploadProgress: 0,
    pipelineStep:   0,
    error:          null,
  },
  reducers: {
    // Called during upload to update file-send progress (0-100%)
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      // Once file fully sent, switch label from "uploading" to "analysing"
      if (action.payload >= 100) {
        state.uploadStatus = "analysing";
      }
    },
    // Advance the pipeline animation step (1-9)
    setPipelineStep: (state, action) => {
      state.pipelineStep = action.payload;
    },
    // Reset upload state (e.g. when navigating away from upload page)
    resetUpload: (state) => {
      state.uploadStatus   = "idle";
      state.uploadProgress = 0;
      state.pipelineStep   = 0;
      state.error          = null;
    },
    // Clear current plan (e.g. when leaving result page)
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {

    // ── uploadFloorPlan ────────────────────────────────────────────────────
    builder
      .addCase(uploadFloorPlan.pending, (state) => {
        state.uploadStatus   = "uploading";
        state.uploadProgress = 0;
        state.pipelineStep   = 0;
        state.error          = null;
        state.currentPlan    = null;
      })
      .addCase(uploadFloorPlan.fulfilled, (state, action) => {
        state.uploadStatus   = "done";
        state.uploadProgress = 100;
        state.pipelineStep   = 9;
        state.currentPlan    = action.payload;
        // Add to plan list if not already there
        const exists = state.plans.some(
          (p) => p.project_id === action.payload.project_id
        );
        if (!exists) {
          state.plans.unshift(action.payload);
        }
      })
      .addCase(uploadFloorPlan.rejected, (state, action) => {
        state.uploadStatus = "error";
        state.error        = action.payload;
        state.pipelineStep = 0;
      });

    // ── fetchMyPlans ───────────────────────────────────────────────────────
    builder
      .addCase(fetchMyPlans.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMyPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
      })
      .addCase(fetchMyPlans.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ── fetchPlanById ──────────────────────────────────────────────────────
    builder
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ── deletePlan ─────────────────────────────────────────────────────────
    builder
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(
          (p) => p.project_id !== action.payload
        );
        // If the deleted plan was currently viewed, clear it
        if (state.currentPlan?.project_id === action.payload) {
          state.currentPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────
export const {
  setUploadProgress,
  setPipelineStep,
  resetUpload,
  clearCurrentPlan,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;