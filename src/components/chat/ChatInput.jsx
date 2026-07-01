import { useState, useRef } from "react";
import { Send, Mic } from "lucide-react";

export default function ChatInput({ onSend, disabled = false, placeholder = "Ask about the floor plan…" }) {
  const [value, setValue] = useState("");
  const textareaRef       = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="bg-white border border-stone-200 rounded-md p-3
                    focus-within:border-bronze-DEFAULT focus-within:ring-1
                    focus-within:ring-bronze-DEFAULT/20 transition-all duration-200
                    shadow-warm-sm">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent font-sans text-sm text-stone-800
                     outline-none placeholder:text-stone-400 leading-relaxed
                     disabled:opacity-50 min-h-[40px] py-2"
        />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            disabled
            className="p-2 text-stone-300 rounded-sm hover:bg-stone-100 transition-colors
                       disabled:cursor-not-allowed"
            title="Voice input (coming soon)"
          >
            <Mic size={15} />
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="p-2 bg-stone-900 text-arch-cream rounded-sm
                       hover:bg-bronze-DEFAULT disabled:opacity-30
                       disabled:cursor-not-allowed transition-all duration-200
                       active:scale-95"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
      <p className="font-mono text-[10px] text-stone-300 mt-1 pl-0.5">
        Enter ↵ to send · Shift+Enter for new line
      </p>
    </div>
  );
}
