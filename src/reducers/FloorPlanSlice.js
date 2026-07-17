/**
 * SmartArch — floorPlanSlice.js
 *
 * Redux state for floor plan upload + analysis pipeline.
 * This is the SINGLE SOURCE OF TRUTH for upload/list/detail state —
 * hooks (useUpload, usePlans) are thin wrappers around these thunks,
 * not independent implementations, so there is only one code path
 * that talks to the backend.
 *
 * State shape:
 *   plans         : []      ← list of user's floor plans (dashboard)
 *   currentPlan   : null    ← currently viewed/just-uploaded plan result
 *   uploadStatus  : "idle"  ← "idle" | "uploading" | "analysing" | "done" | "error"
 *   uploadProgress: 0       ← file upload progress 0-100
 *   pipelineStep  : 0       ← animation step for AnalysisPipelineProgress (1-9)
 *   plansStatus   : "idle"  ← "idle" | "loading" | "done" | "error"
 *   error         : null    ← error message if upload/fetch fails
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planApi } from "../api/planApi.js";

// Async Thunks

/**
 * uploadFloorPlan
 * @param {{projectName: string, file: File}} payload
 */
export const uploadFloorPlan = createAsyncThunk(
  "floorPlan/upload",
  async ({ projectName, file }, { dispatch, rejectWithValue }) => {
    if (!file) {
      return rejectWithValue("Please select a floor plan file first.");
    }
    if (!projectName || !projectName.trim()) {
      return rejectWithValue("Please enter a project name.");
    }

    try {
      // Animate pipeline steps while the backend request is in flight.
      // The backend does not report intermediate progress, so this is
      // a visual approximation only — the real result overrides it
      // the moment the response arrives.
      let step = 1;
      dispatch(floorPlanSlice.actions.setPipelineStep(step));
      const stepTimer = setInterval(() => {
        step = Math.min(step + 1, 8); // hold at step 8 until response arrives
        dispatch(floorPlanSlice.actions.setPipelineStep(step));
      }, 3500); // backend pipeline typically takes ~30-90s

      const response = await planApi.upload(projectName, file, (pct) => {
        dispatch(floorPlanSlice.actions.setUploadProgress(pct));
      });

      clearInterval(stepTimer);

      if (!response.success) {
        dispatch(floorPlanSlice.actions.setPipelineStep(0));
        return rejectWithValue(response.message || "Analysis failed.");
      }

      dispatch(floorPlanSlice.actions.setPipelineStep(9));
      return response.data; // AnalysisResultDTO.to_dict() + project_id/share_token/etc.
    } catch (err) {
      dispatch(floorPlanSlice.actions.setPipelineStep(0));
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Upload failed. Check your connection and try again.";
      return rejectWithValue(msg);
    }
  }
);

/* fetchMyPlans */
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
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Could not load plans."
      );
    }
  }
);

/* fetchPlanById */
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
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Plan not found."
      );
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
      return projectId; // return id so the reducer can remove it from the list
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Delete failed."
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    plans: [],
    currentPlan: null,
    uploadStatus: "idle", // "idle" | "uploading" | "analysing" | "done" | "error"
    uploadProgress: 0,
    pipelineStep: 0,
    plansStatus: "idle", // "idle" | "loading" | "done" | "error"
    error: null,
  },
  reducers: {
    // Advance the pipeline animation step (0-9)
    setPipelineStep: (state, action) => {
      state.pipelineStep = action.payload;
    },
    // Called during upload to update file-send progress (0-100%)
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      if (action.payload >= 100 && state.uploadStatus === "uploading") {
        state.uploadStatus = "analysing";
      }
    },
    // Reset upload state (e.g. when navigating away from upload page)
    resetUpload: (state) => {
      state.uploadStatus = "idle";
      state.uploadProgress = 0;
      state.pipelineStep = 0;
      state.error = null;
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
        state.uploadStatus = "uploading";
        state.uploadProgress = 0;
        state.pipelineStep = 0;
        state.error = null;
        state.currentPlan = null;
      })
      .addCase(uploadFloorPlan.fulfilled, (state, action) => {
        state.uploadStatus = "done";
        state.uploadProgress = 100;
        state.pipelineStep = 9;
        state.currentPlan = action.payload;
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
        state.error = action.payload;
        state.pipelineStep = 0;
      });

    // fetchMyPlans
    builder
      .addCase(fetchMyPlans.pending, (state) => {
        state.plansStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyPlans.fulfilled, (state, action) => {
        state.plansStatus = "done";
        state.plans = action.payload;
      })
      .addCase(fetchMyPlans.rejected, (state, action) => {
        state.plansStatus = "error";
        state.error = action.payload;
      });

    // fetchPlanById
    builder
      .addCase(fetchPlanById.pending, (state) => {
        // Clear stale plan + error before loading a new project, so
        // usePlan()'s loading flag (!plan && !error) is accurate and
        // the page doesn't flash the *previous* project's data.
        state.currentPlan = null;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.error = action.payload;
      });

    // deletePlan
    builder
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(
          (p) => p.project_id !== action.payload
        );
        if (state.currentPlan?.project_id === action.payload) {
          state.currentPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setPipelineStep, setUploadProgress, resetUpload, clearCurrentPlan } =
  floorPlanSlice.actions;

export default floorPlanSlice.reducer;