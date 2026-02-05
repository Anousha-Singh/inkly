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
    <div className="fixed top-6 right-6 z-40 pointer-events-none flex items-center gap-3">
      {/* Board Info */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-200/50 px-5 py-3 rounded-2xl pointer-events-auto flex items-center gap-3 hover:shadow-xl transition-shadow duration-300">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg select-none shadow-md">
          I
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-sm leading-tight">Inkly Board</h1>
          <p className="text-xs text-gray-400 font-mono select-all">#{roomId.slice(0, 8)}</p>
        </div>
      </div>

      {/* Actions & Presence */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-200/50 px-3 py-2.5 rounded-2xl pointer-events-auto flex items-center gap-2 hover:shadow-xl transition-shadow duration-300">
        {/* Presence Avatars */}
        <div className="flex -space-x-2 mr-2 pl-1 items-center">
          {onlineUsers.slice(0, 4).map((u, idx) => (
            <div
              key={u.uid}
              className="relative group"
              style={{ zIndex: 10 - idx }}
            >
              <img
                src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`}
                className="w-9 h-9 rounded-full border-2 border-white ring-2 ring-gray-100 bg-gray-100 transition-transform duration-200 group-hover:scale-110 group-hover:z-50"
                title={u.displayName}
                alt={u.displayName}
              />
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          ))}
          {onlineUsers.length > 4 && (
            <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs text-indigo-700 font-bold shadow-sm">
              +{onlineUsers.length - 4}
            </div>
          )}
          {onlineUsers.length === 0 && (
            <div className="text-xs text-gray-400 px-2">No one online</div>
          )}
        </div>

        <div className="h-7 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`group relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
            isDarkMode ? 'hover:bg-amber-500/10 text-amber-500' : 'hover:bg-indigo-50 text-gray-500 hover:text-indigo-600'
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={copyLink}
          className="group relative p-2.5 hover:bg-indigo-50 rounded-xl text-gray-500 hover:text-indigo-600 transition-all duration-200 hover:scale-105"
          title="Share Board"
        >
          {copied ? (
            <Check size={20} className="text-green-600" />
          ) : (
            <Share2 size={20} />
          )}
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            {copied ? "Link copied!" : "Share board"}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-gray-900"></div>
          </span>
        </button>

        {/* Export Button */}
        <button
          className="group relative p-2.5 hover:bg-purple-50 rounded-xl text-gray-500 hover:text-purple-600 transition-all duration-200 hover:scale-105"
          title="Export as PNG"
          id="export-btn"
        >
          <Download size={20} />
          
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
