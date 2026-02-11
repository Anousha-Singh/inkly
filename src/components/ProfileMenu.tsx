"use client";
import { User } from "firebase/auth";
import { Menu, X, LogOut, User as UserIcon, Mail, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface ProfileMenuProps {
  user: User;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(parseInt(timestamp)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 group p-2 bg-white/90 backdrop-blur-xl shadow-lg border border-gray-200/50 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-xl hover:scale-105"
      >
        {isOpen ? (
          <X size={18} className="text-gray-700 transition-transform duration-300" />
        ) : (
          <Menu size={18} className="text-gray-700 transition-transform duration-300" />
        )}
      </button>

      {/* Sidebar Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-8 pt-24">
            <div className="flex items-center gap-4">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                alt={user.displayName || "User"}
                className="w-16 h-16 rounded-2xl border-4 border-white/30 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-xl mb-1 truncate">
                  {user.displayName || "Anonymous"}
                </h2>
                <p className="text-white/80 text-sm truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account Details
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <UserIcon size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Display Name</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Calendar size={18} className="text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(user.metadata.creationTime || null)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">User ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {user.uid}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 group"
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              Sign Out
            </button>
            
            <p className="text-center text-xs text-gray-400">
              Powered by <span className="font-semibold text-indigo-600">Inkly</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
