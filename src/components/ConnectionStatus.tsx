import { useEffect, useState } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const connectedRef = ref(rtdb, ".info/connected");
    const unsubscribe = onValue(connectedRef, (snap) => {
        setIsConnected(snap.val() === true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative group flex items-center">
      {/* Dot */}
      <div
        className={`w-2 h-2 rounded-full shadow-md transition-colors duration-500 ${
          isConnected
            ? "bg-green-500 shadow-green-400/60"
            : "bg-red-500 shadow-red-400/60 animate-pulse"
        }`}
      />

      {/* Tooltip on hover — opens upward */}
      <div className="absolute bottom-full left-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-medium whitespace-nowrap shadow-lg">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
          {isConnected ? "Connected" : "Reconnecting…"}
        </div>
      </div>
    </div>
  );
}
