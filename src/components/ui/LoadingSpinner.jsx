export default function LoadingSpinner({ size = "md", label = "" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-stone-200`} />
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent
                      border-t-bronze-DEFAULT absolute inset-0 animate-spin`}
        />
      </div>
      {label && (
        <p className="font-mono text-xs text-stone-500">{label}</p>
      )}
    </div>
  );
}
