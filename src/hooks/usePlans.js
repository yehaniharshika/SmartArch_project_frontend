import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyPlans,
  fetchPlanById,
  deletePlan as deletePlanThunk,
} from "../reducers/FloorPlanSlice.js";
import { planApi } from "../api/planApi.js";

/**
 * Hook to fetch and manage the list of floor plans.
 * Thin wrapper around Redux state — no mock-data fallback, so a real
 * backend/connection failure surfaces as `error` instead of being
 * silently hidden behind fake data.
 */
export function usePlans() {
  const dispatch = useDispatch();
  const plans  = useSelector((s) => s.floorPlan.plans);
  const status = useSelector((s) => s.floorPlan.plansStatus);
  const error  = useSelector((s) => s.floorPlan.error);

  const refetch = useCallback(() => {
    dispatch(fetchMyPlans());
  }, [dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deletePlan = useCallback(
    async (projectId) => {
      const action = await dispatch(deletePlanThunk(projectId));
      if (!deletePlanThunk.fulfilled.match(action)) {
        throw new Error(action.payload || "Delete failed.");
      }
    },
    [dispatch]
  );

  return {
    plans,
    loading: status === "loading",
    error,
    refetch,
    deletePlan,
  };
}

/**
 * Hook to fetch a single floor plan by ID.
 */
export function usePlan(projectId) {
  const dispatch = useDispatch();
  const plan  = useSelector((s) => s.floorPlan.currentPlan);
  const error = useSelector((s) => s.floorPlan.error);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchPlanById(projectId));
  }, [projectId, dispatch]);

  const loading = !plan && !error;

  return { plan, loading, error };
}

/**
 * Hook to load a plan by share token — PUBLIC, no auth/login required.
 * Kept as local state (not Redux) since this is used on the standalone
 * public client-facing chat page, unrelated to the logged-in architect's
 * plan list.
 */
export function usePlanByToken(token) {
  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    planApi
      .getByShareToken(token)
      .then((response) => {
        if (!response.success) {
          setError(response.message || "Floor plan not found.");
          return;
        }
        setPlan(response.data);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || err?.message || "Floor plan not found."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { plan, loading, error };
}