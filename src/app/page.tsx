"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { 
  PenTool, 
  ArrowRight, 
  Users, 
  Zap, 
  Shield, 
  Sparkles, 
  Menu, 
  X,
  Play,
  Cloud,
  MessageSquare
} from "lucide-react";

export default function Home() {
  const { user, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [joinId, setJoinId] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const createRoom = () => {
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    router.push(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (joinId.trim()) {
      router.push(`/room/${joinId}`);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with your team. See cursors, edits, and changes as they happen in real-time.',
      color: 'bg-blue-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No lag, no delays. Experience buttery smooth performance even with complex boards and multiple users.',
      color: 'bg-yellow-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security keeps your ideas safe. Control access with granular permissions.',
      color: 'bg-green-600',
    },
    {
      icon: Sparkles,
      title: 'Smart Tools',
      description: 'Intuitive drawing tools, shapes, and text. Everything you need to bring your ideas to life.',
      color: 'bg-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Live Cursors',
      description: 'See where your teammates are working. Real-time cursor tracking for seamless collaboration.',
      color: 'bg-indigo-600',
    },
    {
      icon: Cloud,
      title: 'Auto-Save',
      description: 'Never lose your work. Changes are automatically saved to the cloud as you draw.',
      color: 'bg-cyan-600',
    },
  ];

  // Logged-in user dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 tracking-tight">Inkly</span>
              </div>
              
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <div className="relative group">
                    <img 
                      src={user.photoURL} 
                      alt="Avatar" 
                      className="w-9 h-9 rounded-full border-2 border-white shadow-md" 
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <button 
                  onClick={logout} 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-24">
          <div className="w-full max-w-2xl">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Dashboard</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                Welcome back, <span className="text-blue-600">{user.displayName?.split(' ')[0]}</span>
              </h1>
              <p className="text-lg text-gray-600">Ready to bring your ideas to life?</p>
            </div>

            {/* Action Cards */}
            <div className="grid gap-6 mb-8">
              {/* Create New Board */}
              <button
                onClick={createRoom}
                className="group relative w-full py-10 text-left bg-white border border-gray-200 rounded-2xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-400 shadow-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 px-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create New Board</h2>
                        <p className="text-gray-500">Start with a fresh, infinite canvas</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Join Existing Board */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  Join Existing Board
                </h2>
                <p className="text-gray-500 text-sm mb-6 ml-11">Enter a 6-digit room code to collaborate with others in real-time</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                    placeholder="Enter 6-digit Code (e.g. 123456)"
                    className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    onClick={joinRoom}
                    disabled={!joinId.trim()}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-1">∞</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unlimited Boards</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-1">Sync</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Collab</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Inkly</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </a>
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:block">
              <button
                onClick={signInWithGoogle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign in with Google
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  How it Works
                </a>
                <button
                  onClick={signInWithGoogle}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 mt-2"
                >
                  Sign in with Google
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-blue-50 -z-10" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-gray-700">Now with real-time collaboration</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 text-gray-900 leading-tight px-2">
              Your ideas,{' '}
              <span className="text-blue-600">
                beautifully
              </span>
              <br />
              brought to life
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              The collaborative whiteboard that empowers teams to brainstorm, design, and create together in real-time. 
              Simple, powerful, and infinitely creative.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <button
                onClick={signInWithGoogle}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#features"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-blue-600">
                  10k+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Active Teams</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-blue-600">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-blue-600">
                  4.9/5
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-gray-900">
              Everything you need to{' '}
              <span className="text-blue-600">
                collaborate
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Powerful features that make teamwork effortless and creativity boundless
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-transparent"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-24 text-center">
            <div className="bg-blue-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                  Ready to transform your workflow?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
                  Join thousands of teams already collaborating on Inkly
                </p>
                <button 
                  onClick={signInWithGoogle}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  Start Creating for Free
                </button>
                <p className="text-xs sm:text-sm text-blue-100 mt-3 sm:mt-4">
                  No credit card required • Free forever plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Inkly</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 Inkly. Real-time collaborative whiteboard.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
