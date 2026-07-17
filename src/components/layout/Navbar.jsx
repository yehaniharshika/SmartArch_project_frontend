import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../../reducers/UserSlice.js";
import smartArchLogo from "../../assets/SmartArch-logo.png";

export default function Navbar({ transparent = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const isLoggedIn = Boolean(user && token);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Transparency is ONLY for logged-out visitors on a marketing
  // hero page. A logged-in user is always looking at product UI
  // (Dashboard/Upload/their own name), never an anonymous hero — so
  // the navbar must be solid for them from the very first frame,
  // regardless of scroll position. Without the `!isLoggedIn` check,
  // a logged-in user landing on a page with `transparent` set would
  // briefly see the navbar in "hero overlay" mode (transparent bg +
  // light text) before any scroll happened, which produced exactly
  // the washed-out, low-contrast look reported: light text sitting
  // on top of a light page background instead of a dark hero image.
  const isTransparent = transparent && !scrolled && !isLoggedIn;

  const navLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Upload", href: "/upload", icon: Upload },
      ]
    : [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how" },
      ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out.");
    navigate("/login");
  };

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isTransparent
            ? "bg-transparent border-b border-transparent"
            : "bg-arch-cream/95 backdrop-blur-md border-b border-stone-200 shadow-sm"
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img src={smartArchLogo} alt="SmartArch" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 font-sans text-[15px] rounded-sm
                  transition-colors duration-150 whitespace-nowrap
                  ${
                    location.pathname === link.href
                      ? isTransparent
                        ? "text-white bg-white/10"
                        : "text-stone-900 bg-stone-100"
                      : isTransparent
                        ? "text-stone-200 hover:text-white hover:bg-white/10"
                        : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {link.icon && <link.icon size={14} />}
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full max-w-[180px]
                    ${isTransparent ? "bg-white/10" : "bg-stone-100"}`}
                >
                  <div className="w-6 h-6 bg-bronze-DEFAULT rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[10px] text-white font-medium">
                      {initial}
                    </span>
                  </div>
                  <span
                    className={`font-sans text-sm truncate
                      ${isTransparent ? "text-white" : "text-stone-700"}`}
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                    title={user.full_name}
                  >
                    {user.full_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`btn-ghost flex-shrink-0 ${
                    isTransparent
                      ? "text-stone-200 hover:text-white"
                      : "text-stone-500 hover:text-red-600"
                  }`}
                >
                  <LogOut size={14} />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`btn-ghost text-lg ${isTransparent ? "text-white" : ""}`}
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-lg"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Get started
                  <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 flex-shrink-0 ${
              isTransparent ? "text-white" : "text-stone-600 hover:text-stone-900"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-arch-cream">
          <div className="px-6 py-4 space-y-1">
            {isLoggedIn && (
              <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-stone-100 rounded-sm">
                <div className="w-6 h-6 bg-bronze-DEFAULT rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] text-white font-medium">
                    {initial}
                  </span>
                </div>
                <span className="font-sans text-sm text-stone-700 truncate">
                  {user.full_name}
                </span>
              </div>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 font-sans text-sm
                           text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm"
              >
                {link.icon && <link.icon size={14} />}
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="btn-ghost justify-start"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn-secondary justify-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary justify-center"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}