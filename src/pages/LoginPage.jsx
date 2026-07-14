import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import SmartArchLogo from "../assets/SmartArch-logo.png";
import planImageOne from "../assets/img-01.jpg";
import planImageTwo from "../assets/img-02.jpg";
import { loginUser, clearError } from "../reducers/userSlice.js";

function PlanRevealAnimation() {
  const [stage, setStage] = useState("hold");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("reveal"), 1400),
      setTimeout(() => setStage("scan"), 2800),
      setTimeout(() => setStage("done"), 5000),
      setTimeout(() => setStage("hold"), 6600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stage === "hold" ? Math.random() : stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const showImageTwo = stage !== "hold";
  const showScan = stage === "scan" || stage === "done";
  const showReticles = stage === "done";

  return (
    // Wider, shorter frame — max-width increased, aspect-ratio switched
    // from a near-square 4:3.1 to a panoramic 16:9, so the plan reads
    // as a wide architectural drawing rather than a tall photo crop.
    <div className="relative w-full mx-auto" style={{ maxWidth: "44rem" }}>
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ aspectRatio: "16 / 9" }}
      >
        <motion.img
          src={planImageOne}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{
            scale: showImageTwo ? 1.04 : [1, 1.015, 1],
            filter: showImageTwo ? "blur(6px)" : "blur(0px)",
          }}
          transition={
            showImageTwo
              ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <AnimatePresence>
          {showImageTwo && (
            <motion.img
              src={planImageTwo}
              alt="Floor plan analysis preview"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, filter: "blur(8px)", scale: 1.03 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScan && (
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: "30%",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(59,143,240,0) 20%, rgba(59,143,240,0.35) 50%, rgba(59,143,240,0) 80%, transparent 100%)",
                boxShadow: "0 0 24px 6px rgba(59,143,240,0.25)",
              }}
              initial={{ top: "-40%", opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {[
          { top: 10, left: 10, rotate: 0 },
          { top: 10, right: 10, rotate: 90 },
          { bottom: 10, right: 10, rotate: 180 },
          { bottom: 10, left: 10, rotate: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6"
            style={{ ...pos }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              showReticles
                ? { opacity: [0, 1, 0.7], scale: [0.6, 1.1, 1] }
                : { opacity: 0, scale: 0.6 }
            }
            transition={{ duration: 0.6, delay: i * 0.08, ease: "backOut" }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${pos.rotate}deg)` }}>
              <path
                d="M2 8V3.5C2 2.67 2.67 2 3.5 2H8"
                stroke="#3B8FF0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 60px 10px rgba(0,0,0,0.25)" }}
        />

        <AnimatePresence>
          {showReticles && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{ border: "1.5px solid rgba(59,143,240,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
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
      toast.error(result.payload || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-arch-cream flex">
      <div
        className="hidden lg:flex lg:w-[50%] bg-stone-900 flex-col justify-between
                      p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-[400px]
                        bg-gradient-to-t from-bronze-DEFAULT/10 to-transparent"
        />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]" />

        <div className="relative flex items-center gap-2 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-bronze-light rounded-full animate-pulse-slow" />
          <span className="font-mono text-xs text-stone-400 tracking-widest uppercase">
            Floor Plan Intelligence
          </span>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-8">
          <PlanRevealAnimation />
        </div>

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

        <p className="relative font-mono text-xs text-stone-600">
          v1.0 · SmartArch
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {/*
          Card restructured: outer wrapper now holds ONLY the rounded
          corners + shadow + overflow-hidden (so the top accent strip's
          corners get clipped cleanly), no more full border-all-sides.
          The accent-sweep strip (defined in index.css, using the same
          bronze/parchment palette as the rest of the app) sits as the
          first child, then all the original form content is nested
          in an inner padded div.
        */}
        <div className="w-full max-w-sm page-enter rounded-2xl shadow-lg bg-white overflow-hidden">
          <div className="accent-sweep h-1.5 w-full" />

          <div className="space-y-7 p-10">
            <div className="flex flex-col items-center text-center gap-1 -mt-2">
              <img
                src={SmartArchLogo}
                alt="SmartArch logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="space-y-1 text-center">
              <h1
                className="font-display text-display-md text-stone-900 font-semibold"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                Welcome back
              </h1>
              <p
                className="text-md text-stone-500"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Sign in to your architect account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="label-mono">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@studio.com"
                  className="input-field text-[12px] sm:text-lg rounded-[12px]"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
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
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
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

            <div className="relative">
              <div className="divider-line" />
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                               bg-white px-3 font-mono text-xs text-stone-400"
              >
                or
              </span>
            </div>

            <p
              className="text-md text-stone-500 text-center"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-bronze-DEFAULT hover:underline font-medium"
              >
                Sign up <ArrowRight size={12} className="inline" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}