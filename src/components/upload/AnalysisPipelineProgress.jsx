import { CheckCircle2, Loader2, Circle } from "lucide-react";

const STEPS = [
  { id: 1, label: "Saving file",            sub: "Storing your floor plan securely" },
  { id: 2, label: "PDF conversion",         sub: "Converting to high-res image" },
  { id: 3, label: "YOLOv8 detection",       sub: "Identifying rooms, doors & windows" },
  { id: 4, label: "OCR extraction",         sub: "Reading text & dimensions" },
  { id: 5, label: "Area calculation",       sub: "Computing floor areas" },
  { id: 6, label: "Saving results",         sub: "Persisting to database" },
  { id: 7, label: "Generating share link",  sub: "Creating client chatbot URL" },
];

export default function AnalysisPipelineProgress({ currentStep = 0, done = false }) {
  return (
    <div className="bg-white border border-stone-200 rounded-md p-6 space-y-1">
      <p className="label-mono text-bronze-DEFAULT mb-4">Analysis pipeline</p>

      {STEPS.map((step, i) => {
        const isComplete = done || currentStep > step.id;
        const isActive   = !done && currentStep === step.id;
        const isPending  = !done && currentStep < step.id;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-300
              ${isActive ? "bg-amber-50 border border-amber-100" : ""}
              ${isComplete ? "opacity-60" : ""}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-5">
              {isComplete ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : isActive ? (
                <Loader2 size={16} className="text-bronze-DEFAULT animate-spin" />
              ) : (
                <Circle size={16} className="text-stone-300" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={`font-sans text-md leading-none
                ${isActive ? "text-stone-800 font-medium" : "text-stone-500"}`}>
                {step.label}
              </p>
              {isActive && (
                <p className="font-mono text-sm text-stone-400 mt-1">{step.sub}</p>
              )}
            </div>

            {/* Step number */}
            <span className="font-mono text-sm text-stone-300 flex-shrink-0">
              {String(step.id).padStart(2, "0")}
            </span>
          </div>
        );
      })}

      {done && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="font-mono text-xs text-emerald-600">
            Analysis complete — generating results…
          </span>
        </div>
      )}
    </div>
  );
}
