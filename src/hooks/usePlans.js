import { useState, useEffect, useCallback } from "react";
import { planApi } from "../api/planApi.js";

/**
 * Hook to fetch and manage the list of floor plans.
 * Falls back to mock data when backend is not available.
 */
export function usePlans() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await planApi.list();
      setPlans(data.plans || []);
    } catch (err) {
      // UI-only mode: use mock data
      setPlans(MOCK_PLANS);
      setError(null);   // silently fall back
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const deletePlan = useCallback(async (id) => {
    try {
      await planApi.delete(id);
    } catch { /* silent in mock mode */ }
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { plans, setPlans, loading, error, refetch: fetchPlans, deletePlan };
}

/**
 * Hook to fetch a single floor plan by ID.
 */
export function usePlan(id) {
  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    planApi.getById(id)
      .then((data) => setPlan(data.plan))
      .catch(() => setPlan(MOCK_PLANS.find((p) => p.id === Number(id)) || null))
      .finally(() => setLoading(false));
  }, [id]);

  return { plan, loading, error };
}

/**
 * Hook to load a plan by share token (public, no auth).
 */
export function usePlanByToken(token) {
  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    planApi.getByShareToken(token)
      .then((data) => setPlan(data.plan))
      .catch(() => setPlan(MOCK_PLAN_DETAIL))
      .finally(() => setLoading(false));
  }, [token]);

  return { plan, loading };
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_PLANS = [
  { id:1, original_filename:"villa_ground_floor.pdf",  status:"ready",      total_floor_area_sqm:215.4,  wall_count:18, door_count:8,  window_count:12, room_count:6, share_token:"tok_abc123", created_at:"2024-11-10T09:30:00Z" },
  { id:2, original_filename:"apartment_type_a.png",    status:"ready",      total_floor_area_sqm:88.2,   wall_count:10, door_count:4,  window_count:6,  room_count:4, share_token:"tok_def456", created_at:"2024-11-08T14:20:00Z" },
  { id:3, original_filename:"office_level2.jpg",       status:"processing", total_floor_area_sqm:0,      wall_count:0,  door_count:0,  window_count:0,  room_count:0, share_token:null,          created_at:"2024-11-12T08:10:00Z" },
  { id:4, original_filename:"bungalow_plan.pdf",       status:"ready",      total_floor_area_sqm:142.7,  wall_count:14, door_count:6,  window_count:9,  room_count:5, share_token:"tok_ghi789", created_at:"2024-11-05T11:45:00Z" },
  { id:5, original_filename:"showroom_layout.pdf",     status:"error",      total_floor_area_sqm:0,      wall_count:0,  door_count:0,  window_count:0,  room_count:0, share_token:null,          created_at:"2024-11-11T16:00:00Z" },
];

const MOCK_PLAN_DETAIL = {
  id:1, original_filename:"villa_ground_floor.pdf", status:"ready",
  image_width_px:2480, image_height_px:1754,
  scale:{ pixels_per_meter:82.5, method:"scale_ratio", confidence:0.90 },
  wall_count:18, door_count:8, window_count:12, room_count:6,
  total_floor_area_sqm:215.4, total_floor_area_sqft:2318.2,
  processing_time_sec:8.34,
  share_token:"tok_abc123eyJhbGciOiJIUzI1NiJ9",
  gpt_summary:"Ground floor of a residential villa spanning approximately 215 m². The open-plan living and dining areas occupy the central zone, benefiting from south-facing windows. Three bedrooms are positioned on the north wing for privacy, each with direct bathroom access.",
  gpt_room_list:["Living Room","Dining Room","Kitchen","Bedroom 1","Bedroom 2","Bedroom 3","Bathroom 1","Bathroom 2","Utility Room","Garage"],
  detections:[
    { label:"door",   confidence:0.92, width_m:0.90, height_m:2.10, area_sqm:1.89, ocr_label:"Main Entrance", x1:100, y1:200, x2:190, y2:410 },
    { label:"door",   confidence:0.88, width_m:0.80, height_m:2.10, area_sqm:1.68, ocr_label:"Bedroom 1",     x1:300, y1:150, x2:380, y2:360 },
    { label:"window", confidence:0.91, width_m:1.20, height_m:1.50, area_sqm:1.80, ocr_label:null,            x1:500, y1:20,  x2:620, y2:140 },
    { label:"window", confidence:0.87, width_m:0.90, height_m:1.20, area_sqm:1.08, ocr_label:null,            x1:700, y1:20,  x2:790, y2:120 },
    { label:"wall",   confidence:0.96, width_m:8.40, height_m:0.20, area_sqm:1.68, ocr_label:null,            x1:20,  y1:20,  x2:712, y2:36  },
    { label:"wall",   confidence:0.94, width_m:6.20, height_m:0.20, area_sqm:1.24, ocr_label:null,            x1:20,  y1:20,  x2:20,  y2:516 },
  ],
  ocr_texts:[
    { text:"3.500m", is_dimension:true,  parsed_meters:3.5, confidence:0.92 },
    { text:"4.200m", is_dimension:true,  parsed_meters:4.2, confidence:0.88 },
    { text:"1:100",  is_dimension:true,  parsed_meters:null,confidence:0.96 },
    { text:"Living Room", is_dimension:false, confidence:0.95 },
    { text:"Kitchen",     is_dimension:false, confidence:0.89 },
  ],
};
