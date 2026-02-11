"use client";
import { useEffect, useState } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { MousePointer2 } from "lucide-react";

interface Cursor {
  x: number;
  y: number;
  username: string;
  userId: string;
  color: string;
  lastUpdate?: number;
}

export default function CursorOverlay({ roomId, pan, zoom, currentUserId }: { roomId: string, pan: { x: number, y: number }, zoom: number, currentUserId: string }) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});

  useEffect(() => {
    if (!roomId) return;
    
    const cursorsRef = ref(rtdb, `rooms/${roomId}/cursors`);
    
    const unsubscribe = onValue(cursorsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setCursors(data);
        } else {
            setCursors({});
        }
    });
    
    // Cleanup inactive cursors (local only)
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
        unsubscribe();
        clearInterval(interval);
    };
  }, [roomId]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
       {Object.values(cursors)
         .filter((cursor) => cursor.userId !== currentUserId)
         .map((cursor) => (
          <div 
             key={cursor.userId} 
             className="absolute top-0 left-0 transition-transform duration-100 ease-linear"
             style={{ transform: `translate(${(cursor.x + pan.x) * zoom}px, ${(cursor.y + pan.y) * zoom}px)` }}
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
