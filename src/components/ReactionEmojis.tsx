"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { ref, push, onChildAdded, off } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Smile } from "lucide-react";

interface ReactionPayload {
  id: string;
  emoji: string;
  userId: string;
  displayName: string;
  x: number;
  y: number;
  timestamp: number;
}

interface ActiveReaction extends ReactionPayload {
  phase: "in" | "hold" | "out";
}

interface ReactionEmojisProps {
  roomId: string;
  user: User;
  isDarkMode: boolean;
}

const EMOJIS = ["👍", "❤️", "🔥", "🎉", "😂", "👀", "✨", "💡", "🚀", "👏"];
const HOLD_MS   = 2800;  // how long it stays fully visible
const FADE_MS   = 700;   // fade-out duration

export default function ReactionEmojis({ roomId, user, isDarkMode }: ReactionEmojisProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reactions, setReactions] = useState<ActiveReaction[]>([]);
  const timerMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const mountTime = useRef<number>(Date.now());
  const dark = isDarkMode;

  useEffect(() => {
    if (!roomId) return;
    const reactionsRef = ref(rtdb, `rooms/${roomId}/reactions`);

    const unsub = onChildAdded(reactionsRef, (snapshot) => {
      const data = snapshot.val() as Omit<ReactionPayload, "id"> | null;
      if (!data) return;
      if (data.timestamp < mountTime.current) return;

      const id = snapshot.key ?? Math.random().toString();
      const reaction: ActiveReaction = { ...data, id, phase: "in" };

      setReactions((prev) => [...prev, reaction]);

      // After pop-in animation finishes → hold
      const holdTimer = setTimeout(() => {
        setReactions((prev) =>
          prev.map((r) => (r.id === id ? { ...r, phase: "hold" } : r))
        );

        // After hold → fade out
        const fadeTimer = setTimeout(() => {
          setReactions((prev) =>
            prev.map((r) => (r.id === id ? { ...r, phase: "out" } : r))
          );

          // Remove from DOM after fade completes
          const removeTimer = setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== id));
          }, FADE_MS);
          timerMap.current.set(id + "_rm", removeTimer);
        }, HOLD_MS);
        timerMap.current.set(id + "_fade", fadeTimer);
      }, 400); // pop-in keyframe duration
      timerMap.current.set(id, holdTimer);
    });

    return () => {
      off(reactionsRef);
      timerMap.current.forEach((t) => clearTimeout(t));
      timerMap.current.clear();
    };
  }, [roomId]);

  const sendReaction = useCallback(
    async (emoji: string) => {
      setPickerOpen(false);
      const reactionsRef = ref(rtdb, `rooms/${roomId}/reactions`);
      await push(reactionsRef, {
        emoji,
        userId: user.uid,
        displayName: user.displayName ?? "Someone",
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 60,
        timestamp: Date.now(),
      });
    },
    [roomId, user]
  );

  const btnBase = `w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all duration-150 hover:scale-125 active:scale-95 cursor-pointer select-none`;

  return (
    <>
      {/* CSS keyframes */}
      <style>{`
        @keyframes rxPop {
          0%   { opacity: 0;   transform: translate(-50%, -20%) scale(0.3) rotate(-10deg); }
          50%  { opacity: 1;   transform: translate(-50%, -65%) scale(1.1) rotate(5deg); }
          80%  { opacity: 1;   transform: translate(-50%, -45%) scale(0.95) rotate(-2deg); }
          100% { opacity: 1;   transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        }
        @keyframes rxOut {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(0.6); filter: blur(4px); }
        }
        .rx-in {
          animation: rxPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .rx-hold {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        .rx-out {
          animation: rxOut ${FADE_MS}ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>

      {/* Floating reactions overlay */}
      <div className="fixed inset-0 pointer-events-none z-[60]" aria-hidden>
        {reactions.map((r) => (
          <div
            key={r.id}
            className={`absolute flex flex-col items-center gap-1 rx-${r.phase}`}
            style={{
              left: `${r.x}vw`,
              top:  `${r.y}vh`,
            }}
          >
            <span
              className="text-4xl leading-none"
              style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.3))" }}
            >
              {r.emoji}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap backdrop-blur-sm ${
                dark
                  ? "bg-slate-800/80 text-slate-200"
                  : "bg-white/80 text-gray-700"
              }`}
            >
              {r.displayName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Picker panel */}
      {pickerOpen && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={() => setPickerOpen(false)}
          />
          <div
            className={`fixed z-[56] rounded-2xl border shadow-2xl backdrop-blur-xl p-3 grid grid-cols-5 gap-1.5 ${
              dark
                ? "bg-slate-900/95 border-slate-700/60"
                : "bg-white/95 border-gray-200/70"
            }`}
            style={{ bottom: "8.5rem", right: "1.25rem" }}
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className={btnBase}
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => setPickerOpen((v) => !v)}
        title="Send a reaction"
        aria-label="Send reaction emoji"
        className={`fixed bottom-20 right-5 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-200 hover:scale-110 active:scale-95 ${
          pickerOpen
            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-transparent shadow-orange-300/40"
            : dark
            ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
            : "bg-white border-gray-200 text-yellow-500 hover:bg-yellow-50 hover:border-yellow-200"
        }`}
      >
        <Smile size={22} />
      </button>
    </>
  );
}
