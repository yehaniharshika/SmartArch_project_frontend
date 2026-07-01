import { useState, useRef, useEffect } from "react";
import { Bot, Ruler, DoorOpen, Square, LayoutGrid, Palette, HelpCircle } from "lucide-react";
import ChatBubble    from "../components/chat/ChatBubble.jsx";
import ChatInput     from "../components/chat/ChatInput.jsx";
import SuggestionCard from "../components/chat/SuggestionCard.jsx";
import Badge         from "../components/ui/Badge.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

// ── Mock floor plan data ───────────────────────────────────────────────────
const MOCK_PLAN = {
  original_filename: "villa_ground_floor.pdf",
  total_floor_area_sqm: 215.4,
  wall_count: 18,
  door_count: 8,
  window_count: 12,
  room_count: 6,
  gpt_summary: "Ground floor of a residential villa spanning 215 m². Features open-plan living and dining areas, three bedrooms, two bathrooms, kitchen, utility room, and double garage.",
  gpt_room_list: ["Living Room","Dining Room","Kitchen","Bedroom 1","Bedroom 2","Bedroom 3","Bathroom 1","Bathroom 2","Utility Room","Garage"],
};

const SUGGESTIONS = [
  { icon: Ruler,      text: "What is the total floor area of the plan?" },
  { icon: DoorOpen,   text: "How many doors are in the floor plan?" },
  { icon: Square,     text: "What is the width of the largest window?" },
  { icon: LayoutGrid, text: "What rooms are on this floor?" },
  { icon: Palette,    text: "What colour palette suits this home?" },
  { icon: HelpCircle, text: "Is the bathroom door position ideal?" },
];

const MOCK_RESPONSES = { /* ... unchanged ... */ };

function getResponse(query) { /* ... unchanged ... */ }
function now() { /* ... unchanged ... */ }

const INITIAL_MESSAGES = [ /* ... unchanged ... */ ];

export default function ChatPage() {
  const [messages, setMessages]   = useState(INITIAL_MESSAGES);
  const [thinking, setThinking]   = useState(false);
  const [showInfo, setShowInfo]   = useState(true);
  const bottomRef                 = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = (text) => { /* ... unchanged ... */ };
  const handleSuggestion = (s) => handleSend(s.text);

  return (
    <div className="min-h-screen bg-arch-cream flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border-b border-stone-700 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bronze-DEFAULT rounded-sm flex items-center justify-center">
              <span className="font-display text-white text-sm font-light">S</span>
            </div>
            <div>
              <p 
                className="font-sans text-sm font-medium text-arch-cream leading-none"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                SmartArch-Client Chat
              </p>
              <p 
                className="font-mono text-[10px] text-stone-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs"
              >
                {MOCK_PLAN.original_filename}
              </p>
            </div>
          </div>
          <Badge label="AI powered" variant="bronze" dot />
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex gap-6 px-4 sm:px-6 py-6">

        {/* ── Chat panel ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-5 pb-2">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {thinking && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-sm bg-arch-parchment border border-stone-200
                                flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-stone-600" />
                </div>
                <div className="bg-arch-parchment border border-stone-200 rounded-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                           style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p 
                className="label-mono"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                Suggested questions
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard
                    key={s.text}
                    suggestion={s.text}
                    onClick={() => handleSend(s.text)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            disabled={thinking}
            placeholder="Ask about dimensions, rooms, areas, design…"
          />

          <p className="font-mono text-[10px] text-stone-400 text-center">
            Powered by GPT-4o · SmartArch AI
          </p>
        </div>

        {/* ── Right sidebar — Plan info ────────────────────────────── */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">

          {/* Plan summary */}
          <div className="card p-4 space-y-4">
            <p 
              className="label-mono"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Floor Plan
            </p>
            <div className="space-y-0.5">
              <p 
                className="font-sans text-sm text-stone-800 font-medium truncate"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                {MOCK_PLAN.original_filename}
              </p>
              <Badge label="analysed" variant="success" dot />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Walls",   MOCK_PLAN.wall_count],
                ["Doors",   MOCK_PLAN.door_count],
                ["Windows", MOCK_PLAN.window_count],
                ["Rooms",   MOCK_PLAN.room_count],
              ].map(([l, v]) => (
                <div key={l} className="bg-stone-50 rounded-sm px-2 py-1.5 text-center border border-stone-100">
                  <p className="font-mono text-md font-medium text-stone-700">{v}</p>
                  <p className="font-mono text-[10px] text-stone-400">{l}</p>
                </div>
              ))}
            </div>

            {/* Total area */}
            <div className="bg-stone-900 rounded-sm px-3 py-2.5 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-400">Total area</span>
              <div className="flex items-end gap-1">
                <span 
                  className="font-display text-xl text-arch-cream leading-none"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  {MOCK_PLAN.total_floor_area_sqm.toFixed(1)}
                </span>
                <span className="font-mono text-md text-stone-500 mb-0.5">m²</span>
              </div>
            </div>
          </div>

          {/* Rooms list */}
          <div className="card p-4 space-y-3">
            <p 
              className="label-mono"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Rooms detected
            </p>
            <div className="space-y-1">
              {MOCK_PLAN.gpt_room_list.map((room) => (
                <div key={room} className="flex items-center gap-2 py-1 border-b border-stone-100 last:border-0">
                  <div className="w-1.5 h-1.5 bg-bronze-DEFAULT/60 rounded-full flex-shrink-0" />
                  <span 
                    className="font-sans text-sm text-stone-600"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    {room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick questions */}
          <div className="card p-4 space-y-3">
            <p 
              className="label-mono"
              style={{ fontFamily: "'Saira', sans-serif" }}
            >
              Quick questions
            </p>
            <div className="space-y-1.5">
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSend(s.text)}
                  className="w-full text-left px-3 py-2 rounded-sm bg-stone-50
                             hover:bg-stone-100 border border-stone-200 hover:border-stone-300
                             font-sans text-xs text-stone-600 hover:text-stone-800
                             transition-all duration-150 leading-relaxed"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}