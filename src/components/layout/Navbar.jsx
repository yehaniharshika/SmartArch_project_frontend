import { useState } from "react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Real auth state from Redux (no more MOCK_USER) ─────────────
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const isLoggedIn = Boolean(user && token);

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

  // First letter of the user's name for the avatar badge.
  // Falls back to "?" if name is somehow missing, rather than crashing.
  const initial = user?.full_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          transparent
            ? "bg-transparent border-b border-transparent"
            : "bg-arch-cream/95 backdrop-blur-sm border-b border-stone-200"
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={smartArchLogo} alt="SmartArch" className="h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 font-sans text-lg rounded-sm
                  transition-colors duration-150
                  ${
                    location.pathname === link.href
                      ? "text-stone-900 bg-stone-100"
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
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-sm">
                  <div className="w-5 h-5 bg-bronze-DEFAULT rounded-full flex items-center justify-center">
                    <span className="font-mono text-[9px] text-white font-medium">
                      {initial}
                    </span>
                  </div>
                  <span
                    className="font-sans text-md text-stone-700"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    {user.full_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-stone-500 hover:text-red-600"
                >
                  <LogOut size={14} />
                  <span
                    className="text-lg"
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
                  className="btn-ghost text-lg"
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
            className="md:hidden p-2 text-stone-600 hover:text-stone-900"
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
