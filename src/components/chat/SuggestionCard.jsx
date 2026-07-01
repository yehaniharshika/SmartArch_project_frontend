import { ArrowUpRight } from "lucide-react";

export default function SuggestionCard({ suggestion, onClick }) {
  return (
    <button
      onClick={() => onClick?.(suggestion)}
      className="group flex items-start gap-2 w-full text-left
                 px-3.5 py-3 rounded-md border border-stone-200 bg-white
                 hover:border-bronze-DEFAULT hover:bg-stone-50
                 transition-all duration-200 hover:shadow-warm-sm"
    >
      <p className="text-md text-stone-600 group-hover:text-stone-800
                    flex-1 leading-relaxed transition-colors" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                        
        {suggestion}
      </p>
      <ArrowUpRight
        size={13}
        className="flex-shrink-0 text-stone-300 group-hover:text-bronze-DEFAULT
                   transition-colors mt-0.5"
      />
    </button>
  );
}
