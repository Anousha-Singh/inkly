"use client";
import { User } from "firebase/auth";
import { Download, Share2, Check, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  roomId: string;
  user: User;
  onlineUsers: any[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Header({ roomId, user, onlineUsers, isDarkMode, setIsDarkMode }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-40 pointer-events-none flex items-center gap-2">
      {/* Board Info */}
      <div className={`backdrop-blur-xl shadow-lg border px-3 py-2 rounded-xl pointer-events-auto flex items-center gap-2 hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-700/50 shadow-slate-950/20' : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm select-none shadow-md">
          I
        </div>
        <div>
          <h1 className={`font-bold text-xs leading-tight ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Inkly Board</h1>
          <p className={`text-[10px] font-mono select-all ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>#{roomId}</p>
        </div>
      </div>

      {/* Actions & Presence */}
      <div className={`backdrop-blur-xl shadow-lg border px-2 py-2 rounded-xl pointer-events-auto flex items-center gap-1.5 hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-700/50 shadow-slate-950/20' : 'bg-white/90 border-gray-200/50'
      }`}>
        {/* Presence Avatars */}
        <div className="flex -space-x-1.5 mr-1.5 pl-0.5 items-center">
          {onlineUsers.slice(0, 4).map((u, idx) => (
            <div
              key={u.uid}
              className="relative group"
              style={{ zIndex: 10 - idx }}
            >
              <img
                src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`}
                className={`w-7 h-7 rounded-full border-2 ring-1 bg-gray-100 transition-transform duration-200 group-hover:scale-110 group-hover:z-50 ${
                  isDarkMode ? 'border-slate-800 ring-slate-900' : 'border-white ring-gray-100'
                }`}
                title={u.displayName}
                alt={u.displayName}
              />
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
            </div>
          ))}
          {onlineUsers.length > 4 && (
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-sm ${
              isDarkMode ? 'border-slate-800 bg-slate-800 text-indigo-400' : 'border-white bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700'
            }`}>
              +{onlineUsers.length - 4}
            </div>
          )}
          {onlineUsers.length === 0 && (
            <div className={`text-[10px] px-1.5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>No one online</div>
          )}
        </div>

        <div className={`h-6 w-px bg-gradient-to-b from-transparent to-transparent mx-0.5 ${isDarkMode ? 'via-slate-700' : 'via-gray-300'}`}></div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`group relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            isDarkMode ? 'hover:bg-amber-500/10 text-amber-500' : 'hover:bg-indigo-50 text-gray-500 hover:text-indigo-600'
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={copyLink}
          className="group relative p-2 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-all duration-200 hover:scale-105"
          title="Share Board"
        >
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Share2 size={16} />
          )}
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            {copied ? "Link copied!" : "Share board"}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
          </span>
        </button>

        {/* Export Button */}
        <button
          className="group relative p-2 hover:bg-purple-50 rounded-lg text-gray-500 hover:text-purple-600 transition-all duration-200 hover:scale-105"
          title="Export as PNG"
          id="export-btn"
        >
          <Download size={16} />
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            Export PNG
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
          </span>
        </button>
      </div>
    </div>
  );
}
