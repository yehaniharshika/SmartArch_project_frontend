/**
 * SmartArch — Validators
 */

export const validators = {
  email: (v) => {
    if (!v) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    return null;
  },
  password: (v) => {
    if (!v) return "Password is required.";
    if (v.length < 6) return "Password must be at least 6 characters.";
    return null;
  },
  name: (v) => {
    if (!v || v.trim().length < 2) return "Name must be at least 2 characters.";
    return null;
  },
  required: (label) => (v) => {
    if (!v || !String(v).trim()) return `${label} is required.`;
    return null;
  },
};

/** Run multiple validators on a form object. Returns { field: errorMsg } */
export function validateForm(fields, rules) {
  const errors = {};
  for (const [field, validators] of Object.entries(rules)) {
    for (const validate of validators) {
      const err = validate(fields[field]);
      if (err) { errors[field] = err; break; }
    }
  }
  return errors;
}

/** Password strength: 0-4 */
export function passwordStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 6)  s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9!@#$%^&*]/.test(pwd)) s++;
  return s;
}

export const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
export const STRENGTH_COLORS = [
  "",
  "text-red-500",
  "text-amber-500",
  "text-emerald-500",
  "text-emerald-600",
];
export const STRENGTH_BAR_COLORS = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-emerald-500",
];
