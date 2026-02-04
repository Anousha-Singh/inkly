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
import { Tool } from "@/types";

export default function Room() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  
  const onlineUsers = usePresence(roomId, user);

  useEffect(() => {
    if (!loading && !user) {
        router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading Space...</div>;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden relative">
      <ProfileMenu user={user} />
      <Header roomId={roomId} user={user} onlineUsers={onlineUsers} />
      <div className="flex-1 relative w-full h-full">
         <CursorOverlay roomId={roomId} />
         <ConnectionStatus />
         <Board 
            roomId={roomId} 
            user={user} 
            activeTool={activeTool} 
            color={color}
            lineWidth={lineWidth}
         />
         <Toolbar 
            activeTool={activeTool} 
            onToolChange={setActiveTool} 
            color={color} 
            onColorChange={setColor}
            lineWidth={lineWidth}
            onLineWidthChange={setLineWidth}
         />
      </div>
    </div>
  );
}
