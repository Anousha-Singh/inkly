"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/hooks/usePresence";
import Board from "@/components/Board";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import CursorOverlay from "@/components/CursorOverlay";
import ConnectionStatus from "@/components/ConnectionStatus";
import ProfileMenu from "@/components/ProfileMenu";
import RoomChat from "@/components/RoomChat";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ZoomControls from "@/components/ZoomControls";
import ReactionEmojis from "@/components/ReactionEmojis";
import { Tool } from "@/types";
import { PenTool } from "lucide-react";

export default function Room() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  const onlineUsers = usePresence(roomId, user);

  // Tool keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const map: Record<string, Tool> = {
        p: "pen", e: "eraser", t: "text", h: "pan",
        r: "rect", c: "circle", l: "line", a: "arrow",
      };
      if (map[e.key.toLowerCase()]) setActiveTool(map[e.key.toLowerCase()]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
        router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center animate-bounce shadow-xl shadow-blue-200">
                <PenTool className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-xl font-bold text-gray-900">Preparing your space</h2>
                <p className="text-sm text-gray-500 animate-pulse">Hang tight, we're setting things up...</p>
            </div>
        </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden relative ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <ProfileMenu user={user} />
      <Header 
        roomId={roomId} 
        user={user} 
        onlineUsers={onlineUsers} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      <div className="flex-1 relative w-full h-full">
         <CursorOverlay roomId={roomId} pan={pan} zoom={zoom} currentUserId={user.uid} />
         <Board 
            roomId={roomId} 
            user={user} 
            activeTool={activeTool} 
            color={color}
            lineWidth={lineWidth}
            opacity={opacity}
            isDarkMode={isDarkMode}
            showGrid={showGrid}
            pan={pan}
            setPan={setPan}
            zoom={zoom}
            setZoom={setZoom}
         />
         <Toolbar 
            activeTool={activeTool} 
            onToolChange={setActiveTool} 
            color={color} 
            onColorChange={setColor}
            lineWidth={lineWidth}
            onLineWidthChange={setLineWidth}
            opacity={opacity}
            onOpacityChange={setOpacity}
            isDarkMode={isDarkMode}
            showGrid={showGrid}
            onShowGridChange={setShowGrid}
         />
         <RoomChat roomId={roomId} user={user} isDarkMode={isDarkMode} />
          <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-900/90 border-slate-800" 
              : "bg-white/90 border-gray-100"
          }`}>
            <ConnectionStatus />
            <div className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-800" : "bg-gray-200"}`} />
            <KeyboardShortcuts isDarkMode={isDarkMode} />
            <div className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-800" : "bg-gray-200"}`} />
            <ZoomControls zoom={zoom} setZoom={setZoom} setPan={setPan} isDarkMode={isDarkMode} />
          </div>
         <ReactionEmojis roomId={roomId} user={user} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
