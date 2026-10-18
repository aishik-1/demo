import React from 'react';
import { ArrowUpRight, Code, Shield, Terminal, Zap } from 'lucide-react';

interface ManifestoSectionProps {
  onExploreVerticals: () => void;
  onOpenAuth: () => void;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({
  onExploreVerticals,
  onOpenAuth,
}) => {
  return (
    <section id="manifesto" className="relative min-h-screen flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header Tag */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            01 // MANIFESTO
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        {/* 2-Column Asymmetric Hashgraph Ventures Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Huge Headline & Core Thesis */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase leading-[0.98]">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
                WITH CONVICTION
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              B/Stack is an elite student engineering collective at the intersection of low-level systems,
              autonomous robotics, competitive algorithms, and frontier neural models.
            </p>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              We reject tutorial hell and resume padding. We write custom memory allocators, design brushless
              motor drivers, qualify for ICPC World Finals, and deploy production software used by thousands.
              Every member is a builder with skin in the game.
            </p>

            {/* Guild Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>FIRST-PRINCIPLES</span>
                </div>
                <p className="text-xs text-slate-300">No framework lock-in. Understand the silicon, network, and math.</p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>SHIP IN 36 HOURS</span>
                </div>
                <p className="text-xs text-slate-300">From zero to functional deployed hardware & software without excuses.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Permanent Advantage & Action */}
          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-cyan-400 font-semibold mb-2">
                UNRIVALED TALENT PIPELINE
              </p>
              <h3 className="text-2xl sm:text-4xl font-heading font-extrabold uppercase text-white tracking-tight">
                EARLY ACCESS // <br />
                PERMANENT ADVANTAGE
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              B/Stack operates at the apex of student technology. Backed by dedicated lab space, our own 8x H100 GPU compute
              cluster, CNC & PCB fabrication workbenches, and direct alumni networks at Jane Street, Google DeepMind, OpenAI,
              and premier early-stage venture firms.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Whether you are an incoming freshman who just solved your first 500 LeetCode problems or an advanced systems
              researcher debugging kernel drivers, B/Stack is your home ground.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreVerticals}
                className="group flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <span>EXPLORE GUILD VERTICALS</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenAuth}
                className="text-xs font-mono tracking-wider text-slate-300 hover:text-white uppercase transition-colors px-4 py-3"
              >
                APPLY FOR MEMBERSHIP →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
