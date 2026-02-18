"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Keyboard } from "lucide-react";

interface KeyboardShortcutsProps {
  isDarkMode: boolean;
}

const SHORTCUTS = [
  {
    category: "Tools",
    items: [
      { keys: ["P"], description: "Pen tool" },
      { keys: ["E"], description: "Eraser tool" },
      { keys: ["T"], description: "Text tool" },
      { keys: ["H"], description: "Pan / Hand tool" },
      { keys: ["S"], description: "Shapes menu" },
      { keys: ["R"], description: "Rectangle" },
      { keys: ["C"], description: "Circle" },
      { keys: ["L"], description: "Line" },
      { keys: ["A"], description: "Arrow" },
    ],
  },
  {
    category: "Canvas",
    items: [
      { keys: ["Ctrl", "Z"], description: "Undo last stroke" },
      { keys: ["Ctrl", "Scroll"], description: "Zoom in / out" },
      { keys: ["Scroll"], description: "Pan canvas" },
      { keys: ["Middle click", "drag"], description: "Pan canvas" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["?"], description: "Toggle this panel" },
      { keys: ["Esc"], description: "Close any open panel" },
    ],
  },
];

export default function KeyboardShortcuts({ isDarkMode }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") setIsOpen((v) => !v);
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const dark = isDarkMode;

  const overlayBg = "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm";
  const panelBg = dark
    ? "bg-slate-900/95 border-slate-700/60"
    : "bg-white/95 border-gray-200/70";
  const catText = dark ? "text-indigo-400" : "text-indigo-600";
  const descText = dark ? "text-slate-300" : "text-gray-700";
  const keyBg = dark
    ? "bg-slate-700 border-slate-600 text-slate-200"
    : "bg-gray-100 border-gray-300 text-gray-700";
  const divider = dark ? "border-slate-700/60" : "border-gray-100";

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="Keyboard Shortcuts (?)"
        aria-label="Keyboard Shortcuts"
        className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110 active:scale-95 ${
          dark
            ? "text-slate-300 hover:bg-slate-800 hover:text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
        }`}
      >
        <Keyboard size={16} />
      </button>

      {isOpen && mounted && createPortal(
        <div
          className={overlayBg}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${panelBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Keyboard size={15} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    Keyboard Shortcuts
                  </h2>
                  <p className={`text-[10px] ${dark ? "text-slate-400" : "text-gray-400"}`}>
                    Press <kbd className={`px-1 py-0.5 rounded text-[9px] font-mono border ${keyBg}`}>?</kbd> to toggle
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                  dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {SHORTCUTS.map((section) => (
                <div key={section.category}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${catText}`}>
                    {section.category}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <div
                        key={`${section.category}-${item.description}-${item.keys.join("-")}`}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-colors ${
                          dark ? "hover:bg-slate-800" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className={`text-sm ${descText}`}>{item.description}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((k, i) => (
                            <span key={k} className="flex items-center gap-1">
                              <kbd className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border shadow-sm ${keyBg}`}>
                                {k}
                              </kbd>
                              {i < item.keys.length - 1 && (
                                <span className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`px-5 py-3 border-t ${divider}`}>
              <p className={`text-[10px] text-center ${dark ? "text-slate-500" : "text-gray-400"}`}>
                More shortcuts coming soon ✨
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
