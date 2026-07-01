export default function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
}) {
  return (
    <div className={`space-y-3 ${center ? "text-center" : ""}`}>
      {eyebrow && <p className="label-mono text-lg font-bold">{eyebrow}</p>}
      <h2 className="font-display text-display-lg text-stone-900" style={{ fontFamily: "'Saira', sans-serif", fontWeight: "500" }}>
        {title}
      </h2>
      {description && (
        <p
          className={`font-sans text-base text-stone-500 leading-relaxed
          ${center ? "max-w-xl mx-auto" : "max-w-lg"}`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
