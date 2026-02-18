"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { ref, push, onChildAdded, off, serverTimestamp } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  photoURL: string | null;
  timestamp: number;
}

interface RoomChatProps {
  roomId: string;
  user: User;
  isDarkMode: boolean;
}

export default function RoomChat({ roomId, user, isDarkMode }: RoomChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync so the onChildAdded closure always has the latest value
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Subscribe to chat messages once on mount
  useEffect(() => {
    if (!roomId) return;
    const chatRef = ref(rtdb, `rooms/${roomId}/chat`);

    const unsub = onChildAdded(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const msg: ChatMessage = {
        id: snapshot.key ?? Math.random().toString(),
        text: data.text,
        userId: data.userId,
        displayName: data.displayName ?? "Anonymous",
        photoURL: data.photoURL ?? null,
        timestamp: data.timestamp ?? Date.now(),
      };
      setMessages((prev) => [...prev, msg]);

      // Increment unread badge only when panel is closed
      if (!isOpenRef.current) {
        setUnreadCount((c) => c + 1);
      }
    });

    return () => {
      off(chatRef);
    };
  }, [roomId]);

  // Auto-scroll to bottom when new messages arrive and user is already at bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setIsAtBottom(atBottom);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");

    const chatRef = ref(rtdb, `rooms/${roomId}/chat`);
    await push(chatRef, {
      text,
      userId: user.uid,
      displayName: user.displayName ?? "Anonymous",
      photoURL: user.photoURL ?? null,
      timestamp: Date.now(),
      serverTimestamp: serverTimestamp(),
    });
  }, [inputText, roomId, user]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const avatarUrl = (msg: ChatMessage) =>
    msg.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.userId}`;

  // ── Styles ──────────────────────────────────────────────────────────────────
  const dark = isDarkMode;

  const panelBg = dark
    ? "bg-slate-900/95 border-slate-700/60"
    : "bg-white/95 border-gray-200/70";

  const headerBg = dark
    ? "bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-slate-700/60"
    : "bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-200/70";

  const inputBg = dark
    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400";

  const msgBubbleSelf = "bg-gradient-to-br from-indigo-500 to-purple-600 text-white";
  const msgBubbleOther = dark
    ? "bg-slate-700 text-slate-100"
    : "bg-gray-100 text-gray-800";

  const metaText = dark ? "text-slate-400" : "text-gray-400";

  return (
    <>
      {/* ── Floating Chat Panel ──────────────────────────────────────────── */}
      <div
        className={`fixed bottom-20 right-5 z-50 flex flex-col rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300 ease-in-out ${panelBg} ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ width: 340, height: 480 }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${headerBg} flex-shrink-0`}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <MessageCircle size={14} className="text-white" />
            </div>
            <div>
              <p className={`text-xs font-bold ${dark ? "text-white" : "text-gray-800"}`}>
                Room Chat
              </p>
              <p className={`text-[10px] ${metaText}`}>
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1.5 rounded-lg transition-all duration-150 hover:scale-110 ${
              dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"
            }`}
            aria-label="Close chat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  dark ? "bg-slate-700" : "bg-gray-100"
                }`}
              >
                <MessageCircle size={22} className={dark ? "text-slate-400" : "text-gray-400"} />
              </div>
              <p className={`text-xs text-center ${metaText}`}>
                No messages yet.
                <br />
                Say hello to your team! 👋
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isSelf = msg.userId === user.uid;
            const prevMsg = messages[idx - 1];
            const showAvatar = !isSelf && prevMsg?.userId !== msg.userId;
            const showName = !isSelf && prevMsg?.userId !== msg.userId;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar (other users only) */}
                {!isSelf && (
                  <div className="w-6 h-6 flex-shrink-0">
                    {showAvatar ? (
                      <img
                        src={avatarUrl(msg)}
                        alt={msg.displayName}
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      />
                    ) : (
                      <div className="w-6 h-6" />
                    )}
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 max-w-[72%] ${isSelf ? "items-end" : "items-start"}`}>
                  {showName && (
                    <span className={`text-[10px] font-medium px-1 ${metaText}`}>
                      {msg.displayName}
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug shadow-sm ${
                      isSelf
                        ? `${msgBubbleSelf} rounded-br-sm`
                        : `${msgBubbleOther} rounded-bl-sm`
                    }`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] px-1 ${metaText}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom hint */}
        {!isAtBottom && (
          <button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setIsAtBottom(true);
            }}
            className="absolute bottom-16 right-4 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors z-10"
            aria-label="Scroll to latest"
          >
            <ChevronDown size={14} />
          </button>
        )}

        {/* Input */}
        <div
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t ${
            dark ? "border-slate-700/60" : "border-gray-200/70"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            maxLength={500}
            className={`flex-1 text-sm px-3 py-2 rounded-xl border outline-none transition-colors duration-150 ${inputBg}`}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
              inputText.trim()
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md hover:scale-105 hover:shadow-indigo-300/40 hover:shadow-lg"
                : dark
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* ── FAB Toggle Button ────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-indigo-400/40"
            : dark
            ? "bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-700"
            : "bg-white text-indigo-600 border border-gray-200 hover:bg-indigo-50"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title={isOpen ? "Close chat" : "Room chat"}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <MessageCircle size={22} />
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
