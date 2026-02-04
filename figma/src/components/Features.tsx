import { Users, Zap, Shield, Sparkles, MessageSquare, Cloud } from 'lucide-react';

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
    description: 'AI-powered suggestions, smart shapes, and auto-formatting help you create professional diagrams faster.',
    color: 'bg-purple-600',
  },
  {
    icon: MessageSquare,
    title: 'Built-in Chat',
    description: 'Discuss ideas without leaving your board. Comment, mention teammates, and keep conversations contextual.',
    color: 'bg-indigo-600',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Access your boards from anywhere. Changes sync instantly across all your devices.',
    color: 'bg-cyan-600',
  },
];

export function Features() {
  return (
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
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
  );
}