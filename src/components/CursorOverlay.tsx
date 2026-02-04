"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { MousePointer2 } from "lucide-react";

interface Cursor {
  x: number;
  y: number;
  username: string;
  userId: string;
  color: string;
  lastUpdate?: number;
}

export default function CursorOverlay({ roomId }: { roomId: string }) {
  const { socket } = useSocket();
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});

  useEffect(() => {
    if (!socket) return;
    
    const onCursorMove = (data: any) => {
        // data: { roomId, x, y, username, userId }
        setCursors(prev => ({
            ...prev,
            [data.userId]: { ...data, lastUpdate: Date.now() }
        }));
    };

    socket.on("cursor-move", onCursorMove);
    
    // Cleanup inactive cursors
    const interval = setInterval(() => {
        const now = Date.now();
        setCursors(prev => {
            const next = { ...prev };
            let changed = false;
            Object.entries(next).forEach(([key, val]) => {
                if (val.lastUpdate && now - val.lastUpdate > 3000) {
                    delete next[key];
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, 1000);

    return () => {
        socket.off("cursor-move", onCursorMove);
        clearInterval(interval);
    };
  }, [socket]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
       {Object.values(cursors).map((cursor) => (
          <div 
             key={cursor.userId} 
             className="absolute top-0 left-0 transition-transform duration-100 ease-linear"
             style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          >
             <MousePointer2 className="w-5 h-5 text-pink-500 fill-pink-500" />
             <div className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full ml-4 shadow-md whitespace-nowrap">
                {cursor.username || 'Anonymous'}
             </div>
          </div>
       ))}
    </div>
  );
}
