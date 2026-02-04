"use client";
import { useSocket } from "@/hooks/useSocket";

export default function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className={`fixed bottom-4 left-4 px-3 py-1 rounded-full text-xs font-mono font-bold z-50 ${
        isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white animate-pulse"
    }`}>
      {isConnected ? "Connected" : "Disconnected - Reconnecting..."}
    </div>
  );
}
