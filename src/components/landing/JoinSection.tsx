import React from 'react';
import { ArrowRight, UserPlus, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface JoinSectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onEnterDashboard: () => void;
  isAuthenticated: boolean;
}

export const JoinSection: React.FC<JoinSectionProps> = ({
  onOpenAuth,
  onEnterDashboard,
  isAuthenticated,
}) => {
  return (
    <section id="join" className="relative min-h-[75vh] flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            07 // THE PORTAL GATEWAY
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            BECOME PART OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
              B/STACK GUILD
            </span>
          </h2>
          <p className="text-slate-400 text-sm font-light mt-3">
            Membership is open to students committed to real engineering. Access our private hardware lab, 8x H100 GPU compute, mentor network, and club project incubators.
          </p>
        </div>

        {/* 2 Big Cards: Sign Up vs Sign In */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Sign Up */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800/60">
                NEW RECRUITS
              </span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-white uppercase mb-3">
              CREATE BUILDER PROFILE
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-8">
              Register your student handle, choose your guild track (CP, Robotics, Systems, Hackathons, or AI), link your GitHub and start logging projects.
            </p>

            <button
              onClick={() => {
                audioManager.playClick();
                onOpenAuth('signup');
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] flex items-center justify-center gap-2"
            >
              <span>APPLY & REGISTER ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Sign In / Member Dashboard */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200">
                <LogIn className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase px-2.5 py-1 rounded bg-slate-900 border border-white/10">
                REGISTERED MEMBERS
              </span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-white uppercase mb-3">
              MEMBER PORTAL LOGIN
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-8">
              Access your internal dashboard, view your event attendance percentage, submit project PRs, and collaborate with vertical squads.
            </p>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onEnterDashboard();
                }}
                className="w-full py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>OPEN MEMBER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onOpenAuth('signin');
                }}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/15 font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <span>SIGN IN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
