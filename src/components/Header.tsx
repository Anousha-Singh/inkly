import { User } from "firebase/auth";
import { Download, Share2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  roomId: string;
  user: User;
  onlineUsers: any[];
}

export default function Header({ roomId, user, onlineUsers }: HeaderProps) {
  const router = useRouter();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Invite link copied!");
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md shadow-sm border border-gray-200 px-5 py-3 rounded-2xl pointer-events-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg select-none">I</div>
        <div>
            <h1 className="font-bold text-gray-800 text-sm leading-tight">Inkly Board</h1>
            <p className="text-xs text-gray-400 font-mono select-all">#{roomId.slice(0, 6)}</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md shadow-sm border border-gray-200 px-3 py-2 rounded-2xl pointer-events-auto flex items-center gap-2">
         {/* Presence Avatars */}
         <div className="flex -space-x-2 mr-4 pl-2 items-center">
             {onlineUsers.slice(0, 5).map((u) => (
                <img 
                    key={u.uid} 
                    src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} 
                    className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-100 bg-gray-100" 
                    title={u.displayName} 
                    alt={u.displayName}
                />
             ))}
             {onlineUsers.length > 5 && (
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                     +{onlineUsers.length - 5}
                 </div>
             )}
         </div>

         <div className="h-6 w-px bg-gray-200 mx-1"></div>

         <button onClick={copyLink} className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-gray-500 transition" title="Share Board">
            <Share2 size={20} />
         </button>
         <button className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-gray-500 transition" title="Export as PNG" id="export-btn">
            <Download size={20} />
         </button>
          <button onClick={() => router.push('/')} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition ml-2" title="Leave Board">
            <LogOut size={20} />
         </button>
      </div>
    </div>
  )
}
