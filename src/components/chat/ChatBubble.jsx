import { Bot, User } from "lucide-react";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5
        ${isUser
          ? "bg-stone-900 text-arch-cream"
          : "bg-arch-parchment border border-stone-200 text-stone-600"
        }`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-1 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`relative px-4 py-3 rounded-md text-sm leading-relaxed
          ${isUser
            ? "bg-stone-900 text-arch-cream"
            : "bg-arch-parchment border border-stone-200 text-stone-800"
          }`}>
          {message.content}
        </div>
        <p className="font-mono text-[10px] text-stone-400 px-1">{message.time}</p>
      </div>
    </div>
  );
}
