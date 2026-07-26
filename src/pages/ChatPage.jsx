import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bot,
  Ruler,
  DoorOpen,
  Square,
  LayoutGrid,
  Palette,
  HelpCircle,
} from "lucide-react";
import ChatBubble from "../components/chat/ChatBubble.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";
import SuggestionCard from "../components/chat/SuggestionCard.jsx";
import Badge from "../components/ui/Badge.jsx";
import { usePlanByToken } from "../hooks/usePlans.js";
import {
  sendChatMessage,
  addUserMessage,
  addBotMessage,
  resetChat,
} from "../reducers/ChatSlice.js";
import SmartArchLogo from "../assets/SmartArch-logo.png";

const SUGGESTIONS = [
  { icon: Ruler, text: "What is the total floor area of the plan?" },
  { icon: DoorOpen, text: "How many doors are in the floor plan?" },
  { icon: Square, text: "What is the width of the largest window?" },
  { icon: LayoutGrid, text: "What rooms are on this floor?" },
  { icon: Palette, text: "What colour palette suits this home?" },
  { icon: HelpCircle, text: "Is the bathroom door position ideal?" },
];

export default function ChatPage() {
  const { token } = useParams();
  const dispatch = useDispatch();

  const {
    plan,
    loading: planLoading,
    error: planError,
  } = usePlanByToken(token);
  const { messages, status } = useSelector((s) => s.chat);
  const thinking = status === "sending";

  const bottomRef = useRef(null);
  const welcomedRef = useRef(false);

  useEffect(() => {
    dispatch(resetChat());
    welcomedRef.current = false;
  }, [token, dispatch]);

  useEffect(() => {
    if (plan && !welcomedRef.current) {
      welcomedRef.current = true;
      const name =
        plan.project_name || plan.original_filename || "your floor plan";
      dispatch(
        addBotMessage(
          `Hi! I'm the SmartArch assistant for **${name}**. Ask me anything about room dimensions, areas, doors, windows, or design suggestions.`,
        ),
      );
    }
  }, [plan, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = (text) => {
    const question = text.trim();
    if (!question || !token) return;
    dispatch(addUserMessage(question));
    dispatch(sendChatMessage({ shareToken: token, question }));
  };

  const handleSuggestion = (s) => handleSend(s.text);

  if (planLoading) {
    return (
      <div className="h-screen bg-arch-cream flex items-center justify-center">
        <p className="font-mono text-xs text-stone-400">Loading floor plan…</p>
      </div>
    );
  }

  if (planError || !plan) {
    return (
      <div className="h-screen bg-arch-cream flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p
            className="text-sm text-red-700"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {planError || "This chat link is invalid or has expired."}
          </p>
          <p className="text-xs text-stone-400">
            Please ask your architect for a new link.
          </p>
        </div>
      </div>
    );
  }

  const rooms = plan.rooms ?? [];
  const wallCount = plan.wall_count ?? 0;
  const doorCount = plan.door_count ?? 0;
  const windowCount = plan.window_count ?? 0;
  const roomCount = plan.room_count ?? rooms.length;
  const totalSqm = plan.total_area_sqm ?? 0;
  const planName = plan.project_name || plan.original_filename || "Floor Plan";

  return (
    <div className="h-screen bg-arch-cream flex flex-col overflow-hidden">
      <div className="bg-stone-900 border-b border-stone-700 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bronze-DEFAULT rounded-sm flex items-center justify-center">
              <img
                src={SmartArchLogo}
                alt="SmartArch Logo"
                className="w-16 h-10"
              />
            </div>
            <div>
              <p
                className="font-sans text-sm font-medium text-arch-cream leading-none"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                SmartArch-Client Chat
              </p>
              <p className="font-mono text-[10px] text-stone-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                {planName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout — fills remaining height, itself never scrolls */}
      <div className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto flex gap-6 px-4 sm:px-6 py-6 overflow-hidden">
        {/* Chat panel */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-5 pb-2 pr-1">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {thinking && (
              <div className="flex gap-3 animate-fade-in">
                <div
                  className="w-8 h-8 rounded-sm bg-arch-parchment border border-stone-200
                                flex items-center justify-center flex-shrink-0"
                >
                  <Bot size={14} className="text-stone-600" />
                </div>
                <div className="bg-arch-parchment border border-stone-200 rounded-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — fixed, doesn't scroll away */}
          {messages.length <= 1 && (
            <div className="space-y-2 flex-shrink-0">
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
                    onClick={() => handleSuggestion(s)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input — always fixed at the bottom of the chat panel */}
          <div className="flex-shrink-0">
            <ChatInput
              onSend={handleSend}
              disabled={thinking}
              placeholder="Ask about dimensions, rooms, areas, design…"
            />
            <p className="font-mono text-[10px] text-stone-400 text-center mt-2">
              Powered by Gemini · SmartArch AI
            </p>
          </div>
        </div>

        {/* Right sidebar — scrolls independently if content overflows */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0 min-h-0 overflow-y-auto no-scrollbar space-y-4">
          <div className="card p-4 space-y-4 flex-shrink-0">
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
                {planName}
              </p>
              <Badge label={plan.status || "ready"} variant="success" dot />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["Walls", wallCount],
                ["Doors", doorCount],
                ["Windows", windowCount],
                ["Rooms", roomCount],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="bg-stone-50 rounded-sm px-2 py-1.5 text-center border border-stone-100"
                >
                  <p className="font-mono text-md font-medium text-stone-700">
                    {v}
                  </p>
                  <p className="font-mono text-[10px] text-stone-400">{l}</p>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 rounded-sm px-3 py-2.5 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-400">
                Total area
              </span>
              <div className="flex items-end gap-1">
                <span
                  className="font-display text-xl text-arch-cream leading-none"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  {Number(totalSqm).toFixed(1)}
                </span>
                <span className="font-mono text-md text-stone-500 mb-0.5">
                  m²
                </span>
              </div>
            </div>
          </div>

          {rooms.length > 0 && (
            <div className="card p-4 space-y-3 flex-shrink-0">
              <p
                className="label-mono"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                Rooms detected
              </p>
              <div className="space-y-1">
                {rooms.map((room, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1 border-b border-stone-100 last:border-0"
                  >
                    <div className="w-1.5 h-1.5 bg-bronze-DEFAULT/60 rounded-full flex-shrink-0" />
                    <span
                      className="font-sans text-sm text-stone-600"
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {room.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
