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
  lineWidth: number;
  opacity: number;
  isDarkMode: boolean;
  showGrid: boolean;
}

export default function Board({ roomId, user, activeTool, color, lineWidth, opacity, isDarkMode, showGrid }: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPathRef = useRef<Point[]>([]);
  const actionsRef = useRef<DrawAction[]>([]);
  
  const drawAction = (ctx: CanvasRenderingContext2D, action: DrawAction) => {
      if (action.type === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
      } else {
          ctx.globalCompositeOperation = 'source-over';
      }
      
      ctx.globalAlpha = action.opacity ?? 1;
      ctx.strokeStyle = action.color;
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
      } else if (action.type === 'circle') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          const rx = Math.abs(end.x - start.x) / 2;
          const ry = Math.abs(end.y - start.y) / 2;
          const cx = Math.min(start.x, end.x) + rx;
          const cy = Math.min(start.y, end.y) + ry;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
      } else if (action.type === 'diamond') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          const cx = (start.x + end.x) / 2;
          const cy = (start.y + end.y) / 2;
          ctx.beginPath();
          ctx.moveTo(cx, start.y); // top
          ctx.lineTo(end.x, cy);   // right
          ctx.lineTo(cx, end.y);   // bottom
          ctx.lineTo(start.x, cy); // left
          ctx.closePath();
          ctx.stroke();
      } else if (action.type === 'line') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
      } else if (action.type === 'triangle') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          ctx.beginPath();
          ctx.moveTo((start.x + end.x) / 2, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.lineTo(start.x, end.y);
          ctx.closePath();
          ctx.stroke();
      } else if (action.type === 'star') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          const cx = (start.x + end.x) / 2;
          const cy = (start.y + end.y) / 2;
          const outerRadius = Math.min(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / 2;
          const innerRadius = outerRadius / 2.5;
          const spikes = 5;
          let rot = Math.PI / 2 * 3;
          let x = cx;
          let y = cy;
          let step = Math.PI / spikes;

          ctx.beginPath();
          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
              x = cx + Math.cos(rot) * outerRadius;
              y = cy + Math.sin(rot) * outerRadius;
              ctx.lineTo(x, y);
              rot += step;

              x = cx + Math.cos(rot) * innerRadius;
              y = cy + Math.sin(rot) * innerRadius;
              ctx.lineTo(x, y);
              rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
          ctx.stroke();
      } else if (action.type === 'hexagon') {
          const start = pts[0];
          const end = pts[pts.length - 1];
          const cx = (start.x + end.x) / 2;
          const cy = (start.y + end.y) / 2;
          const rx = Math.abs(end.x - start.x) / 2;
          const ry = Math.abs(end.y - start.y) / 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
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
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
  };

  const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    actionsRef.current.forEach(action => drawAction(ctx, action));
}, [drawAction]);

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
                if (data.type === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                }
                ctx.globalAlpha = data.opacity ?? 1;
                ctx.strokeStyle = data.color;
                ctx.lineWidth = data.width;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
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
                    opacity: 1, // Text is always opaque for now
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
                if (activeTool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                }
                ctx.globalAlpha = activeTool === 'eraser' ? 1 : opacity;
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = "round";
                ctx.moveTo(lastPt.x, lastPt.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';

                const drawData = {
                    roomId,
                    points: [lastPt, pos],
                    color,
                    width: lineWidth,
                    opacity: activeTool === 'eraser' ? 1 : opacity,
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
              width: lineWidth,
              opacity, // Shapes always use the current opacity
              id: 'temp',
          };
          drawAction(ctx, tempAction);
      }
  };

  const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      
      const action: DrawAction = {
          id: uuidv4(),
          type: activeTool,
          points: [...currentPathRef.current],
          color,
          width: lineWidth,
          opacity: activeTool === 'eraser' ? 1 : opacity,
      };
      
      actionsRef.current.push(action);
      console.log("📤 Emitting draw-end event:", { roomId, ...action });
      socket.emit("draw-end", { roomId, ...action });
      saveBoard(); 
      currentPathRef.current = [];
      redraw();
  };

  const cursorRef = useRef<HTMLDivElement>(null);
  const lastEmitRef = useRef<number>(0);

  const updateCursor = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.x}px`;
        cursorRef.current.style.top = `${pos.y}px`;
    }
    
    // Throttle cursor-move event
    const now = Date.now();
    if (now - lastEmitRef.current > 50) { // 20fps
        socket?.emit("cursor-move", { roomId, x: pos.x, y: pos.y, username: user.displayName, userId: user.uid });
        lastEmitRef.current = now;
    }
  };

  return (
    <div 
        ref={containerRef} 
        className={`w-full h-full cursor-none transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}
        style={showGrid ? {
            backgroundImage: `
              linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
        } : {}}
        onMouseMove={(e) => {
            updateCursor(e);
            draw(e);
        }}
        onMouseEnter={() => {
            if (cursorRef.current) cursorRef.current.style.display = 'flex';
        }}
        onMouseLeave={() => {
            if (cursorRef.current) cursorRef.current.style.display = 'none';
            stopDrawing();
        }}
        onTouchMove={(e) => {
            updateCursor(e);
            draw(e);
        }}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
    >
       {/* Brush Cursor Preview - Uses direct DOM update for performance */}
       {activeTool !== 'text' && (
           <div 
              ref={cursorRef}
              className="pointer-events-none absolute z-[60] border border-gray-400 rounded-full items-center justify-center transition-[width,height] duration-75 hidden"
              style={{
                  width: activeTool === 'pen' || activeTool === 'eraser' ? lineWidth : 12,
                  height: activeTool === 'pen' || activeTool === 'eraser' ? lineWidth : 12,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: activeTool === 'eraser' 
                    ? (isDarkMode ? '#0f172a' : '#ffffff') 
                    : (activeTool === 'pen' ? color : 'transparent'),
                  opacity: activeTool === 'pen' ? opacity : 1,
                  border: activeTool === 'pen' || activeTool === 'eraser' ? '1px solid #9ca3af' : `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
                  boxShadow: isDarkMode ? '0 0 0 1px rgba(255,255,255,0.2)' : '0 0 0 1px rgba(0,0,0,0.1)'
              }}
           >
               {(activeTool !== 'pen' && activeTool !== 'eraser') && (
                   <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
               )}
           </div>
       )}

       <canvas 
          ref={canvasRef}
          className="touch-none block w-full h-full"
       />
    </div>
  );
}
