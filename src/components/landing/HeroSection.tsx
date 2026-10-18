import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { audioManager } from '../../utils/audio';
import { HeroNetworkGraph } from './HeroNetworkGraph';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onOpenAuth }) => {
  return (
    <section className="relative min-h-[82vh] sm:min-h-[86vh] flex flex-col justify-between pt-24 sm:pt-32 pb-4 sm:pb-8 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 overflow-visible">
      {/* Dynamic Atlassian Teamwork Graph Constellation Network Background */}
      <HeroNetworkGraph />

      {/* Top Main Heading with masked text popping up effect */}
      <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-5 pointer-events-auto">
        <div className="space-y-1">
          <div className="overflow-hidden py-0.5">
            <motion.h1
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[5.5rem] font-editorial font-normal tracking-tight text-white leading-[1.08] sm:leading-[1.05] break-words"
            >
              The Tech Club
            </motion.h1>
          </div>

          <div className="overflow-hidden py-0.5">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-[4.8rem] font-editorial italic font-normal text-slate-100 tracking-tight leading-[1.1] sm:leading-[1.08] break-words"
            >
              where the centre of innovation<span className="text-cyan-400 not-italic">.</span>
            </motion.h2>
          </div>
        </div>

        <motion.p
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 font-body font-light max-w-xl leading-relaxed pt-1"
        >
          The official tech collective of <strong className="text-white font-medium">Bosscoder School of Technology</strong>. A student-led community specializing in competitive programming, autonomous robotics, distributed systems, and applied AI.
        </motion.p>

        {/* Liquid Glass Pills with light blue translucent sheen */}
        <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenAuth('signup');
            }}
            className="liquid-pill liquid-pill-hover px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-body font-semibold tracking-wide text-white transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <span>Apply to Guild</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-300" />
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onExploreClick();
            }}
            className="liquid-pill liquid-pill-hover px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-body text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center w-full sm:w-auto"
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator (exact match to video) */}
      <div className="relative z-10 pt-8 sm:pt-12 flex items-center justify-between">
        <button
          onClick={onExploreClick}
          className="flex items-center gap-2.5 text-xs font-body tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Scroll</span>
          <div className="relative w-3.5 h-3.5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-slate-600/60 border-t-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-cyan-400 transition-colors" />
          </div>
        </button>

        <span className="text-[11px] font-body text-slate-500 uppercase tracking-widest hidden sm:inline">
          Bosscoder School of Technology // 2026
        </span>
      </div>
    </section>
  );
};
