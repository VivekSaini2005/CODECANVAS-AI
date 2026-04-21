import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Zap, BrainCircuit, Users, Target, CheckCircle2, ArrowRight, Github, Layers, ShieldCheck, PenTool, TrendingUp, LayoutDashboard } from 'lucide-react';
import homepageImg from '../images/homepage.png';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden w-full bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 dark:from-[#080b12] dark:via-[#0b0f1a] dark:to-[#0f172a] border-b border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto z-10 relative flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start opacity-0" style={{ animation: "fade-in-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/20 text-[#625df5] dark:text-indigo-300 text-sm font-semibold mb-6 shadow-sm hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              CodeCanvas AI is now live
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6 drop-shadow-sm">
              Master DSA with <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#625df5] to-[#45b7f1] filter drop-shadow-md">Logic</span>, Not Just Code
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-10">
              CodeCanvas AI helps you visualize, strategize, and track your coding journey with AI-powered guidance and unified progress tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-[#625df5] to-[#45b7f1] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group ring-2 ring-transparent focus:ring-indigo-500/50">
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/problems" className="px-8 py-4 bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 font-bold border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Explore Problems
              </Link>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none relative opacity-0" style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}>
            <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden p-2 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-2xl shadow-indigo-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#625df5]/20 to-[#45b7f1]/20 -z-10 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img 
                src={homepageImg} 
                alt="CodeCanvas AI Homepage Preview" 
                className="w-full h-auto rounded-xl md:rounded-[1.5rem] object-cover border border-gray-100 dark:border-white/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
              />
              {/* Floating UI Elements */}
              <div className="absolute top-6 left-6 md:top-10 md:-left-6 bg-white/95 dark:bg-[#121622]/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                   <Target size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Test Passed</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">All cases valid</div>
                </div>
              </div>
              <div className="absolute bottom-6 right-4 md:bottom-10 md:-right-4 bg-white/95 dark:bg-[#121622]/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                   <BrainCircuit size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">AI Hint</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">Use a Hash Map</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Inline CSS for simple fade-in animation */}
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#625df5] to-[#45b7f1]">CodeCanvas AI</span>?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to accelerate your problem-solving abilities and ace technical interviews.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Layers, title: "Unified DSA Sheets", desc: "Track progress across Striver, Blind 75, and more in one place.", color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/20" },
              { icon: ShieldCheck, title: "No Duplicate Problems", desc: "Avoid solving the same problem multiple times.", color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
              { icon: BrainCircuit, title: "AI-Powered Guidance", desc: "Get hints and guidance without revealing full solutions.", color: "from-purple-500 to-fuchsia-500", shadow: "shadow-purple-500/20" },
              { icon: PenTool, title: "Whiteboard Thinking", desc: "Visualize your logic before coding.", color: "from-rose-500 to-red-500", shadow: "shadow-rose-500/20" },
              { icon: TrendingUp, title: "Progress Tracking", desc: "See your real progress across all sheets.", color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
              { icon: LayoutDashboard, title: "Clean Dashboard", desc: "Minimal and focused UI for productivity.", color: "from-cyan-500 to-sky-500", shadow: "shadow-cyan-500/20" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-[#121622] p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-md hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <feature.icon size={26} className="text-white relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#625df5] dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-indigo-50/30 dark:bg-[#0b0f1a] relative overflow-hidden">
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Works</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A seamless workflow to take you from reading the problem to an optimized solution.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-center gap-10 md:gap-6 relative">
            {/* Connecting line (Desktop) */}
            <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#625df5]/10 via-[#625df5]/40 to-[#625df5]/10 z-0"></div>
            
            {/* Connecting line (Mobile) */}
            <div className="md:hidden absolute top-[10%] bottom-[10%] left-[2.5rem] w-0.5 bg-gradient-to-b from-[#625df5]/10 via-[#625df5]/40 to-[#625df5]/10 z-0"></div>
            
            {[
              { step: "01", title: "Pick a Problem", desc: "Browse from unified sheets." },
              { step: "02", title: "Think & Visualize", desc: "Use whiteboard before coding." },
              { step: "03", title: "Track Progress", desc: "Automatically synced across sheets." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex-1 flex flex-row md:flex-col items-center md:text-center gap-6 w-full group">
                <div className="w-20 h-20 shrink-0 rounded-2xl bg-white dark:bg-[#121622] text-[#625df5] dark:text-indigo-400 font-extrabold text-2xl flex items-center justify-center shadow-xl border border-gray-100 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#625df5] group-hover:text-white dark:group-hover:text-white transition-all duration-300 relative">
                  {item.step}
                  <div className="absolute inset-0 rounded-2xl ring-4 ring-[#625df5]/20 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                </div>
                <div className="flex flex-col flex-1 pb-4 border-b border-gray-100 md:border-transparent dark:border-white/5">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-base text-gray-600 dark:text-gray-400 max-w-[250px] md:mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 relative">
        {/* Subtle background divider line */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "1000+", label: "Problems" },
              { value: "5+", label: "DSA Sheets" },
              { value: "Unified", label: "Progress Tracking" },
              { value: "AI Guided", label: "Learning" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-[#121622] border border-gray-100 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-extrabold text-[#625df5] dark:text-indigo-400 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400 font-medium tracking-wide text-sm md:text-base uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 mb-6">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl p-8 md:p-16 text-center">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-[#625df5] to-[#45b7f1] z-0"></div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm">
              Stop Memorizing Code. <br className="hidden md:block"/> Start Understanding Logic.
            </h2>
            <p className="text-lg md:text-xl text-indigo-50 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join CodeCanvas AI and transform your problem-solving skills.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-[#625df5] hover:bg-gray-50 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2 group ring-2 ring-transparent">
                Start Learning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg border border-white/20 flex items-center justify-center gap-2">
                Go to Dashboard
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/80 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-emerald-300" /> Free to get started</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-emerald-300" /> No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0b0f1a] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
          
          {/* Left: Brand & Description */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#625df5] to-[#45b7f1] flex items-center justify-center shadow-md">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CodeCanvas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#625df5] to-[#45b7f1]">AI</span></span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Elevate your competitive programming skills. Practice, get AI-driven hints, and track your progress seamlessly in one modern workspace.
            </p>
          </div>
          
          {/* Right: Quick Links */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
            <div className="flex flex-col gap-3">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Platform</h4>
              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-[#625df5] dark:hover:text-indigo-400 transition-colors text-sm font-medium">Home</Link>
              <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-[#625df5] dark:hover:text-indigo-400 transition-colors text-sm font-medium">Dashboard</Link>
              <Link to="/problems" className="text-gray-500 dark:text-gray-400 hover:text-[#625df5] dark:hover:text-indigo-400 transition-colors text-sm font-medium">Problems</Link>
              <Link to="/sheets" className="text-gray-500 dark:text-gray-400 hover:text-[#625df5] dark:hover:text-indigo-400 transition-colors text-sm font-medium">Sheets</Link>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright & Author */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} CodeCanvas AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built by</span>
            <a href="https://github.com/VivekSaini2005" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-[#625df5] dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors group">
              Vivek Saini <Github size={14} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
