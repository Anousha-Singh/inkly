"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { user, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [joinId, setJoinId] = useState("");

  const createRoom = () => {
    const roomId = uuidv4();
    router.push(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (joinId.trim()) {
      router.push(`/room/${joinId}`);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center max-w-md w-full mx-4">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">Inkly</h1>
          <p className="text-indigo-100 mb-8 text-lg">Real-time Collaborative Whiteboard</p>
          <button
            onClick={signInWithGoogle}
            className="w-full px-6 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 hover:scale-[1.02] transition-all duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 text-white">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
                {user.photoURL && (
                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-400" />
                )}
                <div>
                    <h1 className="text-xl font-bold">Hello, {user.displayName?.split(' ')[0]}</h1>
                    <p className="text-xs text-indigo-200">Ready to create?</p>
                </div>
            </div>
            <button onClick={logout} className="px-3 py-1 text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-full transition">Log Out</button>
        </div>

        <div className="space-y-6">
          <button
            onClick={createRoom}
            className="group relative w-full py-5 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 overflow-hidden"
          >
             <span className="relative z-10 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create New Board
             </span>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-sm text-indigo-200/50 uppercase tracking-widest font-semibold">or join existing</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="Paste Room ID here..."
              className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-indigo-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={joinRoom}
              disabled={!joinId.trim()}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition border border-white/5"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
