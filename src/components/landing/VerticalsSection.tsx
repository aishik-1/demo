import React, { useState } from 'react';
import { VERTICALS_DATA } from '../../data/mockData';
import { VerticalType } from '../../types';
import { Code2, Bot, Trophy, GitFork, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface VerticalsSectionProps {
  onSelectVertical: (vertical: VerticalType) => void;
  onOpenAuth: (mode: 'signup') => void;
}

export const VerticalsSection: React.FC<VerticalsSectionProps> = ({
  onSelectVertical,
  onOpenAuth,
}) => {
  const [selectedVertical, setSelectedVertical] = useState<VerticalType>('balgo');

  const verticalKeys: VerticalType[] = ['balgo', 'beuild', 'bhack', 'bdev'];

  const getVerticalIcon = (v: VerticalType) => {
    switch (v) {
      case 'balgo':
        return <Code2 className="w-4 h-4" />;
      case 'beuild':
        return <Bot className="w-4 h-4" />;
      case 'bhack':
        return <Trophy className="w-4 h-4" />;
      case 'bdev':
        return <GitFork className="w-4 h-4" />;
    }
  };

  const currentInfo = VERTICALS_DATA[selectedVertical];

  return (
    <section id="verticals" className="relative min-h-screen flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            02 // CLUB VERTICALS
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase">
              FIVE SPECIALIZED GUILDS
            </h2>
            <p className="text-slate-400 text-sm max-w-xl font-light mt-2">
              Every member chooses a primary vertical to spearhead. We cross-collaborate across hardware, algorithms, and models to ship multi-disciplinary breakthroughs.
            </p>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap gap-2.5 pb-6">
          {verticalKeys.map((key) => {
            const vData = VERTICALS_DATA[key];
            const isActive = selectedVertical === key;
            return (
              <button
                key={key}
                onClick={() => {
                  audioManager.playClick();
                  setSelectedVertical(key);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all duration-200 border ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                  {getVerticalIcon(key)}
                </span>
                <span>{vData.shortName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-mono text-slate-300">
                  {vData.memberCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vertical Display Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Light Glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
            style={{ backgroundColor: currentInfo.color }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold"
                  style={{ backgroundColor: currentInfo.color }}
                >
                  {getVerticalIcon(selectedVertical)}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                    {currentInfo.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300 tracking-wider">
                    {currentInfo.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                {currentInfo.description}
              </p>

              {/* Current Focus Banner */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
                <div className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                  CURRENT RESEARCH & SPRINT FOCUS:
                </div>
                <p className="text-xs text-slate-200 font-mono leading-relaxed">
                  {currentInfo.currentFocus}
                </p>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  VERIFIED MILESTONES:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentInfo.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Metrics & Track Registration */}
            <div className="lg:col-span-5 space-y-6 lg:pl-6 lg:border-l lg:border-white/10">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                TRACK TELEMETRY
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentInfo.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-400 font-mono">{metric.label}</span>
                    <span className="text-base font-mono font-bold text-white tracking-wider">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="text-xs font-mono text-slate-400 mb-1">TRACK LEADERSHIP:</div>
                <div className="text-sm font-heading font-semibold text-white">
                  {currentInfo.leads.join(' & ')}
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2"
              >
                <span>JOIN {currentInfo.shortName.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
