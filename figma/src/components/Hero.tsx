import { ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';

export function Hero() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
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
      
      {/* Decorative elements */}
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
              onClick={() => setShowAuthModal(true)}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
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

      <style>{`
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
    </section>
  );
}