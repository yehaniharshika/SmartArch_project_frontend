import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  FileImage,
  TrendingUp,
  DoorOpen,
  Square,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import PlanCard from "../components/upload/PlanCard.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PLANS = [
  {
    id: 1,
    original_filename: "villa_ground_floor.pdf",
    status: "ready",
    total_floor_area_sqm: 215.4,
    wall_count: 18,
    door_count: 8,
    window_count: 12,
    room_count: 6,
    share_token: "tok_abc123",
    created_at: "2024-11-10T09:30:00Z",
  },
  {
    id: 2,
    original_filename: "apartment_type_a.png",
    status: "ready",
    total_floor_area_sqm: 88.2,
    wall_count: 10,
    door_count: 4,
    window_count: 6,
    room_count: 4,
    share_token: "tok_def456",
    created_at: "2024-11-08T14:20:00Z",
  },
  {
    id: 3,
    original_filename: "office_level2.jpg",
    status: "processing",
    total_floor_area_sqm: 0,
    wall_count: 0,
    door_count: 0,
    window_count: 0,
    room_count: 0,
    share_token: null,
    created_at: "2024-11-12T08:10:00Z",
  },
  {
    id: 4,
    original_filename: "bungalow_plan.pdf",
    status: "ready",
    total_floor_area_sqm: 142.7,
    wall_count: 14,
    door_count: 6,
    window_count: 9,
    room_count: 5,
    share_token: "tok_ghi789",
    created_at: "2024-11-05T11:45:00Z",
  },
  {
    id: 5,
    original_filename: "showroom_layout.pdf",
    status: "error",
    total_floor_area_sqm: 0,
    wall_count: 0,
    door_count: 0,
    window_count: 0,
    room_count: 0,
    share_token: null,
    created_at: "2024-11-11T16:00:00Z",
  },
];

const MOCK_USER = { name: "Ruwan Perera" };

export default function DashboardPage() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = plans.filter((p) => {
    const matchSearch = p.original_filename
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const readyPlans = plans.filter((p) => p.status === "ready");
  const totalArea = readyPlans.reduce(
    (s, p) => s + (p.total_floor_area_sqm || 0),
    0,
  );
  const totalDoors = readyPlans.reduce((s, p) => s + (p.door_count || 0), 0);
  const totalWins = readyPlans.reduce((s, p) => s + (p.window_count || 0), 0);

  const handleDelete = (id) => {
    setPlans((ps) => ps.filter((p) => p.id !== id));
  };

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Page header  */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="label-mono text-bronze-DEFAULT mb-1">DASHBOARD</p>
            <h1
              className="font-display text-display-lg text-stone-900"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Good morning, {MOCK_USER.name.split(" ")[0]}.
            </h1>
            <p
              className="text-sm text-stone-500 mt-1"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {readyPlans.length} floor plan{readyPlans.length !== 1 ? "s" : ""}{" "}
              analysed
            </p>
          </div>
          <Link to="/upload" className="btn-primary self-start sm:self-auto">
            <Plus size={15} />
            Upload floor plan
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Plans"
            value={plans.length}
            icon={FileImage}
            accent
          />
          <StatCard
            label="Total Area"
            value={totalArea.toFixed(1)}
            unit="m²"
            icon={TrendingUp}
          />
          <StatCard
            label="Doors detected"
            value={totalDoors}
            icon={DoorOpen}
            sub={`across ${readyPlans.length} plans`}
          />
          <StatCard
            label="Windows detected"
            value={totalWins}
            icon={Square}
            sub={`across ${readyPlans.length} plans`}
          />
        </div>

        {/* ── Filter / Search bar ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plans…"
              className="input-field pl-9 py-2.5 text-base"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-stone-100 rounded-sm p-1">
              {["all", "ready", "processing", "error"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 font-mono text-xs rounded-sm transition-all
                    ${
                      filter === s
                        ? "bg-white text-stone-800 shadow-warm-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-stone-100 rounded-sm p-1">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-sm transition-all
                  ${view === "grid" ? "bg-white shadow-warm-sm text-stone-800" : "text-stone-400 hover:text-stone-700"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-sm transition-all
                  ${view === "list" ? "bg-white shadow-warm-sm text-stone-800" : "text-stone-400 hover:text-stone-700"}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Plans grid / list ─────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileImage}
            title="No floor plans found."
            description={
              search
                ? `No results for "${search}". Try a different search.`
                : "Upload your first floor plan to get started."
            }
            action={
              <Link to="/upload" className="btn-primary">
                <Plus size={14} /> Upload a floor plan
              </Link>
            }
          />
        ) : (
          <div
            className={
              view === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-3"
            }
          >
            {filtered.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
