export default function Badge({ label, variant = "info", dot = false }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50  text-amber-700  border-amber-200",
    error:   "bg-red-50    text-red-700    border-red-200",
    info:    "bg-stone-100 text-stone-600  border-stone-200",
    bronze:  "bg-amber-50  text-amber-800  border-amber-200",
  };
  const dots = {
    success: "bg-emerald-500",
    pending: "bg-amber-500",
    error:   "bg-red-500",
    info:    "bg-stone-400",
    bronze:  "bg-amber-600",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
      font-mono text-xs rounded-sm border ${variants[variant] || variants.info}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.info}`} />
      )}
      {label}
    </span>
  );
}
