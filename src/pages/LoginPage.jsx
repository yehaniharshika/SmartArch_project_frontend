import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import SmartArchLogo from "../assets/SmartArch-logo.png";
import { loginUser, clearError } from "../reducers/userSlice.js";

// ── Blueprint floor-plan illustration ──────────────────────────────────
// A hand-drawn-feeling architectural plan that "traces" itself in on load,
// like a draughtsman sketching the outline — the one signature moment for
// this page. Pure SVG, stroke-dashoffset animation, no external assets.
function BlueprintPlan() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="w-full max-w-md mx-auto"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer building outline */}
      <rect
        x="30" y="30" width="340" height="260"
        stroke="#E8C066" strokeWidth="2.5"
        className="blueprint-trace"
        style={{ animationDelay: "0.1s" }}
      />
      {/* Vertical partition walls */}
      <line x1="170" y1="30" x2="170" y2="180"
        stroke="#E8C066" strokeWidth="2" className="blueprint-trace" style={{ animationDelay: "0.6s" }} />
      <line x1="170" y1="180" x2="370" y2="180"
        stroke="#E8C066" strokeWidth="2" className="blueprint-trace" style={{ animationDelay: "0.7s" }} />
      <line x1="270" y1="30" x2="270" y2="180"
        stroke="#E8C066" strokeWidth="2" className="blueprint-trace" style={{ animationDelay: "0.8s" }} />
      <line x1="30" y1="220" x2="170" y2="220"
        stroke="#E8C066" strokeWidth="2" className="blueprint-trace" style={{ animationDelay: "0.9s" }} />

      {/* Door swing arcs */}
      <path d="M170,180 A40,40 0 0 1 210,220" stroke="#3B8FF0" strokeWidth="1.5"
        className="blueprint-trace" style={{ animationDelay: "1.4s" }} />
      <path d="M120,220 A30,30 0 0 1 150,250" stroke="#3B8FF0" strokeWidth="1.5"
        className="blueprint-trace" style={{ animationDelay: "1.5s" }} />
      <path d="M270,100 A35,35 0 0 1 305,135" stroke="#3B8FF0" strokeWidth="1.5"
        className="blueprint-trace" style={{ animationDelay: "1.6s" }} />

      {/* Dimension lines */}
      <line x1="30" y1="305" x2="370" y2="305" stroke="#9AAAC8" strokeWidth="1"
        className="blueprint-trace" style={{ animationDelay: "1.9s" }} />
      <line x1="30" y1="300" x2="30" y2="310" stroke="#9AAAC8" strokeWidth="1" />
      <line x1="370" y1="300" x2="370" y2="310" stroke="#9AAAC8" strokeWidth="1" />

      {/* Room labels — fade in after the lines finish drawing */}
      <g className="blueprint-label" style={{ animationDelay: "2.1s" }}>
        <text x="90" y="115" fill="#F1F4F9" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="middle">BEDROOM</text>
      </g>
      <g className="blueprint-label" style={{ animationDelay: "2.25s" }}>
        <text x="210" y="95" fill="#F1F4F9" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="middle">LIVING</text>
      </g>
      <g className="blueprint-label" style={{ animationDelay: "2.4s" }}>
        <text x="318" y="95" fill="#F1F4F9" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="middle">KITCHEN</text>
      </g>
      <g className="blueprint-label" style={{ animationDelay: "2.55s" }}>
        <text x="220" y="245" fill="#F1F4F9" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="middle">DINING</text>
      </g>
      <g className="blueprint-label" style={{ animationDelay: "2.7s" }}>
        <text x="100" y="255" fill="#F1F4F9" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="middle">BATH</text>
      </g>
      <g className="blueprint-label" style={{ animationDelay: "2.85s" }}>
        <text x="200" y="318" fill="#6B7FA3" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">20'10"</text>
      </g>

      {/* Scanning highlight sweep — suggests "analysis in progress" */}
      <rect x="30" y="30" width="340" height="260" fill="url(#scanGradient)" className="blueprint-scan" />
      <defs>
        <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B8FF0" stopOpacity="0" />
          <stop offset="48%" stopColor="#3B8FF0" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B8FF0" stopOpacity="0.18" />
          <stop offset="52%" stopColor="#3B8FF0" stopOpacity="0" />
          <stop offset="100%" stopColor="#3B8FF0" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const loading = status === "loading";
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    dispatch(clearError());
    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      // result.payload is the rejectWithValue message from the slice
      toast.error(result.payload || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-arch-cream flex">
      {/* ── Left panel — branding + animated blueprint ─────────────── */}
      <div
        className="hidden lg:flex lg:w-[50%] bg-stone-900 flex-col justify-between
                      p-12 relative overflow-hidden"
      >
        {/* Texture */}
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-[400px]
                        bg-gradient-to-t from-bronze-DEFAULT/10 to-transparent"
        />
        {/* Ambient corner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]" />

        {/* Eyebrow label */}
        <div className="relative flex items-center gap-2 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-bronze-light rounded-full animate-pulse-slow" />
          <span className="font-mono text-xs text-stone-400 tracking-widest uppercase">
            Floor Plan Intelligence
          </span>
        </div>

        {/* Animated blueprint illustration — the signature moment */}
        <div className="relative flex-1 flex items-center justify-center py-8">
          <BlueprintPlan />
        </div>

        {/* Tagline */}
        <div className="relative space-y-4">
          <h2
            className="font-display text-display-lg text-arch-cream leading-[1.0] overflow-hidden"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            <span className="block animate-slide-up" style={{ animationDelay: "0.1s" }}>Analyse.</span>
            <span className="block animate-slide-up" style={{ animationDelay: "0.25s" }}>Share.</span>
            <span className="block animate-slide-up text-bronze-light not-italic" style={{ animationDelay: "0.4s" }}>
              Impress.
            </span>
          </h2>
          <p
            className="text-stone-400 leading-relaxed max-w-xs text-[17px] animate-fade-in"
            style={{ fontFamily: "'Fredoka', sans-serif", animationDelay: "0.6s" }}
          >
            The intelligent floor plan analysis tool built for modern
            architects.
          </p>
        </div>

        {/* Version */}
        <p className="relative font-mono text-xs text-stone-600">
          v1.0 · SmartArch
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-7 page-enter p-10 border border-stone-200 rounded-2xl shadow-lg bg-white">
          {/* Logo — sits right above the form, as requested */}
          <div className="flex flex-col items-center text-center gap-1 -mt-2">
            <img
              src={SmartArchLogo}
              alt="SmartArch logo"
              className="w-16 h-16 object-contain"
            />
            <span
              className="font-display text-lg text-stone-900 tracking-tight"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              SmartArch
            </span>
          </div>

          {/* Header */}
          <div className="space-y-1 text-center">
            <h1
              className="font-display text-display-md text-stone-900"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Welcome back
            </h1>
            <p
              className="text-sm text-stone-500"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Sign in to your architect account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="label-mono">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@studio.com"
                className="input-field text-[12px] sm:text-lg rounded-[12px]"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="label-mono">Password</label>
                <a
                  href="#"
                  className="font-mono text-xs text-bronze-DEFAULT hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field text-[12px] sm:text-lg rounded-[12px]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400
                             hover:text-stone-700 transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="divider-line" />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                             bg-arch-cream px-3 font-mono text-xs text-stone-400"
            >
              or
            </span>
          </div>

          {/* Register link */}
          <p
            className="text-sm text-stone-500 text-center"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-bronze-DEFAULT hover:underline font-medium"
            >
              Create one <ArrowRight size={12} className="inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}