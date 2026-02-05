import { useEffect, useState } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Wifi, WifiOff } from "lucide-react";

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
    <div className={`fixed bottom-8 left-6 z-40 px-4 py-2.5 rounded-2xl text-xs font-medium backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
        isConnected 
          ? "bg-green-500/90 text-white border-green-400/50" 
          : "bg-red-500/90 text-white border-red-400/50 animate-pulse"
    }`}>
      {isConnected ? (
        <>
          <Wifi size={16} className="animate-pulse" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Reconnecting...</span>
        </>
      )}
    </div>
  );
}
