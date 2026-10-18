import React, { useState } from 'react';
import { DEMO_USERS } from '../../data/mockData';
import { User } from '../../types';
import { Github, Linkedin, ExternalLink, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { audioManager } from '../../utils/audio';

export const TeamSection: React.FC = () => {
  const leads = DEMO_USERS.filter((u) => u.role === 'Lead' || u.role === 'Core Member');
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(0);

  const currentLead = leads[selectedLeadIndex];

  const handleNext = () => {
    audioManager.playClick();
    setSelectedLeadIndex((prev) => (prev + 1) % leads.length);
  };

  const handlePrev = () => {
    audioManager.playClick();
    setSelectedLeadIndex((prev) => (prev - 1 + leads.length) % leads.length);
  };

  return (
    <section id="team" className="relative min-h-screen flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            04 // GUILD LEADERSHIP
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        {/* Video Typography & Copy Replication */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[0.98]">
              EXPERIENCE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                YOU CAN BUILD ON
              </span>
            </h2>

            <p className="text-base text-slate-300 font-light leading-relaxed">
              No career theorists. No buzzwords. We've been the engineers who couldn't sleep, the builders who shipped
              at 4 AM and broke production, then rebuilt it stronger.
            </p>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Every lead in this guild carries real world experience across ICPC World Finals, NeurIPS papers, ETHGlobal hackathons,
              autonomous racing, and upstream Linux kernel patches.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                EXPLORE LEAD ARCHITECTS:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick avatar thumbnail strip */}
            <div className="flex items-center gap-3 pt-2">
              {leads.map((lead, idx) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedLeadIndex(idx);
                  }}
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    idx === selectedLeadIndex
                      ? 'border-cyan-400 scale-105 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    style={{ objectPosition: 'center 30%' }}
                    className="w-12 h-12 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Holographic Builder Card (Matching 00:16 Dara Campbell card) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl backdrop-blur-xl">
              {/* Glow badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 tracking-widest uppercase">
                  LEAD ENGINEER // {currentLead.vertical.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedLeadIndex + 1} / {leads.length}
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={currentLead.avatar}
                  alt={currentLead.name}
                  style={{ objectPosition: 'center 30%' }}
                  className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/40 shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
                    {currentLead.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">{currentLead.handle}</p>
                  <p className="text-xs text-slate-400 font-light mt-0.5">{currentLead.year}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                {currentLead.bio}
              </p>

              {/* Badges / Accolades */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  PROVEN BATTLE HONORS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentLead.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5"
                    >
                      <Award className="w-3 h-3 text-cyan-400" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Links & Stats */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span>{currentLead.xp} XP</span>
                  <span>•</span>
                  <span>{currentLead.projectsCount} Repos</span>
                  {currentLead.codeforcesRating && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400">CF {currentLead.codeforcesRating}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentLead.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
