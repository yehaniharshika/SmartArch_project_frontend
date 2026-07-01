export default function StatCard({ label, value, unit = "", sub = "", icon: Icon, accent = false }) {
  return (
    <div className={`rounded-md p-5 border transition-all duration-200 hover:shadow-warm-md group
      ${accent
        ? "bg-stone-900 border-stone-700 text-arch-cream"
        : "bg-white border-stone-200"
      }`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`label-mono ${accent ? "text-stone-400" : "text-stone-400"}`} style={{ fontFamily: "'Saira', sans-serif" }}>
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors
            ${accent
              ? "bg-stone-700 text-stone-300 group-hover:bg-bronze-DEFAULT group-hover:text-white"
              : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
            }`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className={`font-display text-3xl leading-none font-light
          ${accent ? "text-arch-cream" : "text-stone-900"}`}>
          {value}
        </span>
        {unit && (
          <span className={`font-mono text-xs mb-0.5 ${accent ? "text-stone-400" : "text-stone-500"}`}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <p className={`font-mono text-xs mt-2 ${accent ? "text-stone-400" : "text-stone-400"}`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
