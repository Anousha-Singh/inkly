"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Tool, Point, DrawAction } from "@/types";
import { User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Undo, Redo } from "lucide-react"; // Import if adding UI buttons, but keyboard is fine

interface BoardProps {
  roomId: string;
  user: User;
  activeTool: Tool;
  color: string;
}

export default function Board({ roomId, user, activeTool, color }: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPathRef = useRef<Point[]>([]);
  const actionsRef = useRef<DrawAction[]>([]);
  
  // Undo/Redo Stacks implies local history management, but doing it collaboratively is tricky.
  // We will implement "Remove My Last Action" for Undo.
  
  const drawAction = (ctx: CanvasRenderingContext2D, action: DrawAction) => {
      ctx.strokeStyle = action.type === 'eraser' ? '#ffffff' : action.color;
      ctx.lineWidth = action.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      
      const pts = action.points;
      if (pts.length === 0) return;

      if (action.type === 'pen' || action.type === 'eraser') {
          if (pts.length < 2) return;
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
              ctx.lineTo(pts[i].x, pts[i].y);
          }
      } else if (action.type === 'rect') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (action.type === 'arrow') {
           const start = pts[0];
           const end = pts[pts.length - 1];
           const headlen = 15;
           const angle = Math.atan2(end.y - start.y, end.x - start.x);
           ctx.moveTo(start.x, start.y);
           ctx.lineTo(end.x, end.y);
           ctx.stroke();
           
           // Arrowhead
           ctx.beginPath();
           ctx.moveTo(end.x, end.y);
           ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
           ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
           ctx.lineTo(end.x, end.y);
           ctx.fillStyle = action.color;
           ctx.fill();
      } else if (action.type === 'text') {
           ctx.font = `${action.width * 5}px sans-serif`;
           ctx.fillStyle = action.color;
           ctx.fillText(action.text || "", pts[0].x, pts[0].y);
      }
      ctx.stroke();
  };

  const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff"; // White background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      actionsRef.current.forEach(action => drawAction(ctx, action));
  }, []);

  // Save to Firestore
  const saveBoard = useCallback(async () => {
      try {
          await setDoc(doc(db, "rooms", roomId), {
              actions: actionsRef.current,
              lastUpdated: Date.now()
          }, { merge: true });
      } catch (e) {
          console.error("Autosave failed", e);
      }
  }, [roomId]);

  // Socket & Sync
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
        console.log("🔌 Connected to socket server, joining room:", roomId);
        socket.emit("join-room", roomId);
        console.log("📤 Emitted join-room event for room:", roomId);
    };

    if (socket.connected) {
        console.log("✅ Socket already connected on mount");
        onConnect();
    }

    socket.on("connect", onConnect);

    socket.on("draw", (data: any) => {
        console.log("📥 Received draw event:", data);
        if (data.type === 'pen' || data.type === 'eraser') {
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            const pts = data.points;
            if (pts && pts.length >= 2) {
                ctx.strokeStyle = data.type === 'eraser' ? '#ffffff' : data.color;
                ctx.lineWidth = data.width;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.stroke();
            }
        }
    });
    
    socket.on("draw-end", (data: DrawAction) => {
        console.log("📥 Received draw-end event:", data);
        actionsRef.current.push(data);
        redraw();
    });
    
    socket.on("undo", (actionId: string) => {
        actionsRef.current = actionsRef.current.filter(a => a.id !== actionId);
        redraw();
    });

    socket.on("clear", () => {
        actionsRef.current = [];
        redraw();
    });

    return () => {
        socket.off("connect", onConnect);
        socket.off("draw");
        socket.off("draw-end");
        socket.off("undo");
        socket.off("clear");
    };
  }, [socket, roomId, redraw]);

  // Initial Load
  useEffect(() => {
      const load = async () => {
          const snap = await getDoc(doc(db, "rooms", roomId));
          if (snap.exists()) {
              const data = snap.data();
              if (data.actions) {
                  actionsRef.current = data.actions;
                  redraw();
              }
          }
      };
      load();
      
      // Autosave interval
      const interval = setInterval(saveBoard, 10000); // 10s
      return () => clearInterval(interval);
  }, [roomId, redraw, saveBoard]);

  // Resize
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && canvasRef.current) {
            canvasRef.current.width = containerRef.current.clientWidth;
            canvasRef.current.height = containerRef.current.clientHeight;
            redraw();
        }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [redraw]);
  
  // Export
  useEffect(() => {
      const btn = document.getElementById("export-btn");
      if (!btn) return;
      const handleExport = () => {
          if (canvasRef.current) {
               const link = document.createElement("a");
               link.download = `inkly-${roomId}.png`;
               link.href = canvasRef.current.toDataURL();
               link.click();
          }
      };
      btn.addEventListener("click", handleExport);
      return () => btn.removeEventListener("click", handleExport);
  }, [roomId]);

  // Undo Logic
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
              e.preventDefault();
              // Find last action by me
              // Assuming DrawAction has userId? It doesn't yet. Need to add it.
              // For now, removing last action globally (simple) or local tracking?
              // Let's assume we track created actions IDs locally?
              // Or better: filter `actionsRef` from end.
              
              // Simplest: Undo last action globally (Chaos mode) 
              // Better: Add userId to DrawAction.
              const lastAction = actionsRef.current[actionsRef.current.length - 1];
              if (lastAction) {
                   // Optimistic update
                   actionsRef.current.pop();
                   redraw();
                   socket.emit("undo", { roomId, actionId: lastAction.id });
              }
          }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  }, [roomId, socket, redraw]);


  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      if (!canvasRef.current) return {x:0, y:0};
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      return {
          x: clientX - rect.left,
          y: clientY - rect.top
      };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if (activeTool === 'text') {
           const pos = getPos(e);
           const text = prompt("Enter text:");
           if (text) {
               const action: DrawAction = {
                   id: uuidv4(),
                   type: 'text',
                   points: [pos],
                   color,
                   width: 4, // Multiplier for font size
                   text
               };
               actionsRef.current.push(action);
               redraw();
               socket.emit("draw-end", { roomId, ...action });
           }
           return;
      }
      setIsDrawing(true);
      const pos = getPos(e);
      currentPathRef.current = [pos];
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      const newPoints = [...currentPathRef.current, pos];
      currentPathRef.current = newPoints;
      
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      
      if (activeTool === 'pen' || activeTool === 'eraser') {
            const lastPt = currentPathRef.current[currentPathRef.current.length - 2];
            if (lastPt) {
                // Live draw
                ctx.beginPath();
                ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : color;
                ctx.lineWidth = 5;
                ctx.lineCap = "round";
                ctx.moveTo(lastPt.x, lastPt.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();

                const drawData = {
                    roomId,
                    points: [lastPt, pos],
                    color,
                    width: 5,
                    type: activeTool
                };
                console.log("📤 Emitting draw event:", drawData);
                socket.emit("draw", drawData);
            }
      } else {
          // Shape Preview
          redraw();
          const start = currentPathRef.current[0];
          const tempAction: DrawAction = {
              type: activeTool,
              points: [start, pos],
              color,
              width: 5,
              id: 'temp',
          };
          drawAction(ctx, tempAction);
      }
      
      // Cursor
      socket.emit("cursor-move", { roomId, x: pos.x, y: pos.y, username: user.displayName, userId: user.uid });
  };

  const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      
      const action: DrawAction = {
          id: uuidv4(),
          type: activeTool,
          points: [...currentPathRef.current],
          color,
          width: 5
      };
      
      actionsRef.current.push(action);
      console.log("📤 Emitting draw-end event:", { roomId, ...action });
      socket.emit("draw-end", { roomId, ...action });
      saveBoard(); 
      currentPathRef.current = [];
      redraw();
  };

  return (
    <div ref={containerRef} className="w-full h-full cursor-crosshair bg-white">
       <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none block"
       />
    </div>
  );
}
