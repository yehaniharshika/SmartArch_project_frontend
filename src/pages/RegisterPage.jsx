import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import SmartArchLogo from "../assets/SmartArch-logo.png";
import { registerUser, clearError } from "../reducers/userSlice.js";

const PERKS = [
  "Upload unlimited floor plans",
  "AI dimension & area extraction",
  "Instant client share links",
  "GPT-4o design analysis",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [visiblePerks, setVisiblePerks] = useState(0); // For staggered animation

  const loading = status === "loading";

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    dispatch(clearError());

    // Map UI field names -> backend UserRegisterDTO field names
    const payload = {
      full_name: form.name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm,
      role: "architect", // default role; swap for a select input if you want users to choose
    };

    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Welcome to SmartArch.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed.");
    }
  };

  // Staggered perk animation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisiblePerks((prev) => {
        if (prev < PERKS.length) return prev + 1;
        return prev;
      });
    }, 800); // Change every 800ms (smooth & nice timing)

    return () => clearInterval(interval);
  }, []);

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9!@#$%]/.test(p)) s++;
    return s;
  })();

  const strengthColors = [
    "bg-stone-200",
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-arch-cream flex">
      {/* Left panel  */}
      <div
        className="hidden lg:flex lg:w-[45%] bg-stone-900 flex-col justify-between
                      p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px]
                        bg-bronze-DEFAULT/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
        />

        <div className="relative flex items-center gap-3">
          <img
            src={SmartArchLogo}
            alt="SmartArch Logo"
            className="w-28 h-28 object-contain"
          />
        </div>

        {/* Perks with staggered animation */}
        <div className="relative space-y-6">
          <h2
            className="font-display text-display-md text-arch-cream leading-tight"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Everything you need
            <br />
            to analyse floor plans.
          </h2>

          <div className="space-y-4">
            {PERKS.map((p, index) => (
              <div
                key={p}
                className={`flex items-start gap-3 transition-all duration-700 ${
                  index < visiblePerks
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CheckCircle2
                  size={18}
                  className="text-bronze-light flex-shrink-0 mt-0.5"
                />
                <span
                  className="font-sans text-[17px] text-stone-300 leading-relaxed"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-xs text-stone-600">
          v1.0 · SmartArch
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm space-y-3 page-enter p-10 border-lg border-stone-700 rounded-md shadow-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-stone-900 rounded-sm flex items-center justify-center">
              <span className="font-display text-arch-cream text-xs">S</span>
            </div>
            <span className="font-display text-lg text-stone-900">
              SmartArch
            </span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1
              className="font-display text-display-md text-stone-900 font-bold"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Create your account
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="label-mono">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ruwan Perera"
                className="input-field text-[12px] sm:text-lg rounded-[12px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label-mono">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@studio.com"
                className="input-field text-[12px] sm:text-lg rounded-[12px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label-mono">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field text-[12px] sm:text-lg rounded-[12px]"
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

              {/* Strength bar */}
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors duration-300
                          ${i <= strength ? strengthColors[strength] : "bg-stone-200"}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`font-mono text-xs
                    ${strength <= 1 ? "text-red-500" : strength <= 2 ? "text-amber-500" : "text-emerald-600"}`}
                  >
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="label-mono">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field text-[12px] sm:text-lg rounded-[12px] ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-300 focus:border-red-400"
                    : ""
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="font-mono text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="font-sans text-sm text-stone-500 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-bronze-DEFAULT hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

          <p className="font-mono text-[10px] text-stone-400 text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}