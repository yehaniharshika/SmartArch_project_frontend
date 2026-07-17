import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
          {/*
            Renders **bold**, *italic*, bullet/numbered lists, and headers
            from the AI's markdown response instead of showing raw
            asterisks. Custom `components` map keeps every element using
            plain <p>/<span>-level styling so it doesn't fight the bubble's
            own font-size/line-height/color — no @tailwindcss/typography
            plugin required.
          */}
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                h1: ({ children }) => (
                  <p className="font-semibold text-base mb-1">{children}</p>
                ),
                h2: ({ children }) => (
                  <p className="font-semibold text-base mb-1">{children}</p>
                ),
                h3: ({ children }) => (
                  <p className="font-semibold mb-1">{children}</p>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code
                    className={`px-1 py-0.5 rounded-sm font-mono text-xs ${
                      isUser ? "bg-white/10" : "bg-stone-900/5"
                    }`}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <p className="font-mono text-[10px] text-stone-400 px-1">{message.time}</p>
      </div>
    </div>
  );
}