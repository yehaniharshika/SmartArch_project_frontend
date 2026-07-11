import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFloorPlan,
  resetUpload,
} from "../reducers/FloorPlanSlice.js";

/**
 * Hook for managing the floor plan upload + analysis pipeline.
 *
 * This is a thin wrapper around the Redux `uploadFloorPlan` thunk —
 * it does NOT talk to the backend directly and does NOT fall back to
 * mock data on failure. If the upload fails, `error` is set and the
 * caller should show the real error to the user, not silently
 * pretend it succeeded.
 *
 * States: idle → uploading → analysing (steps 1-9) → done | error
 */
export function useUpload() {
  const dispatch = useDispatch();

  const status   = useSelector((s) => s.floorPlan.uploadStatus);
  const step     = useSelector((s) => s.floorPlan.pipelineStep);
  const progress = useSelector((s) => s.floorPlan.uploadProgress);
  const result   = useSelector((s) => s.floorPlan.currentPlan);
  const error    = useSelector((s) => s.floorPlan.error);

  const upload = useCallback(
    async (projectName, file) => {
      const action = await dispatch(uploadFloorPlan({ projectName, file }));
      if (uploadFloorPlan.fulfilled.match(action)) {
        return action.payload;
      }
      // action.payload holds the rejectWithValue error message
      throw new Error(action.payload || "Upload failed.");
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetUpload());
  }, [dispatch]);

  return { status, step, progress, result, error, upload, reset };
}