import React from 'react';
import { Linkedin, Github, Instagram, Code2, ArrowUpRight, Award, Sparkles, Terminal } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface LeadershipSectionProps {
  onOpenMembersDirectory?: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onOpenMembersDirectory }) => {
  const socialProfiles = [
    {
      name: 'LinkedIn',
      handle: 'aishik-roy',
      url: 'https://www.linkedin.com/in/aishik-roy-0abb47302/',
      icon: <Linkedin className="w-4 h-4 text-sky-400" />,
      detail: 'Professional network & updates',
    },
    {
      name: 'GitHub',
      handle: 'aishik-1',
      url: 'https://github.com/aishik-1',
      icon: <Github className="w-4 h-4 text-slate-200" />,
      detail: 'Open source repos & commits',
    },
    {
      name: 'LeetCode',
      handle: 'aishik-roy',
      url: 'https://leetcode.com/u/aishikroy/',
      icon: <Code2 className="w-4 h-4 text-amber-400" />,
      detail: 'Competitive algorithmic track',
    },
    {
      name: 'Instagram',
      handle: '@aishik.roy',
      url: 'https://instagram.com/aishikroyxx',
      icon: <Instagram className="w-4 h-4 text-pink-400" />,
      detail: 'Behind-the-scenes & community',
    },
  ];

  return (
    <section id="leadership" className="relative py-12 sm:py-16 z-10 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-editorial font-normal tracking-tight text-white leading-tight">
            Tech Club Head
          </h2>
          <h3 className="text-2xl sm:text-4xl md:text-6xl font-editorial italic font-normal text-slate-200 tracking-tight">
            Aishik Roy
          </h3>
        </div>

        {onOpenMembersDirectory && (
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenMembersDirectory();
            }}
            className="liquid-pill liquid-pill-hover px-5 py-3 rounded-full text-xs font-mono font-semibold text-white flex items-center gap-2 cursor-pointer border border-cyan-400/30 hover:border-cyan-400 self-start sm:self-auto transition-all shrink-0"
          >
            <span>Explore Members Directory</span>
            <span className="text-cyan-300">&rarr;</span>
          </button>
        )}
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Liquid Glass Editorial Profile Card */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-[2.5rem] overflow-hidden liquid-glass p-3 border border-white/10 shadow-2xl">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img
                src="https://cdn.phototourl.com/member/2026-10-16-7e467a5a-0568-4824-83a8-92660a7bea8b.jpg"
                alt="Aishik Roy - Tech Club Head"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="text-[10px] font-body uppercase tracking-widest text-cyan-400 font-semibold">
                  TECH CLUB HEAD
                </span>
                <h4 className="text-2xl font-editorial text-white font-normal">
                  Aishik Roy
                </h4>
                <p className="text-xs text-slate-300 font-body">
                  Bosscoder School of Technology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bio & Social Pillars */}
        <div className="lg:col-span-7 space-y-8 lg:pl-6">
          <div className="space-y-4">
            <p className="text-xl sm:text-2xl font-editorial italic font-normal text-slate-200 leading-relaxed">
              "Building a culture where curiosity meets extreme engineering execution."
            </p>

            <p className="text-sm sm:text-base text-slate-400 font-body font-light leading-relaxed">
              As Head of the Tech Club at Bosscoder School of Technology, Aishik Roy spearheads initiatives
              spanning competitive programming mastery, hardware and robotics prototyping, hackathon squads,
              and open-source toolkits.
            </p>
          </div>

          {/* Social Profiles (Liquid Glass Pills) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {socialProfiles.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => audioManager.playClick()}
                className="liquid-glass liquid-glass-hover p-4 rounded-2xl flex items-center justify-between group cursor-pointer border border-white/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl liquid-pill flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs font-body font-semibold text-white group-hover:text-cyan-300 transition-colors block">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-body text-slate-400 block">
                      {item.handle}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full liquid-pill flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/[0.08]">
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-editorial text-white">500+</span>
              <p className="text-[11px] sm:text-xs font-body text-slate-400 mt-0.5">Problems Solved</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-editorial text-white">12+</span>
              <p className="text-[11px] sm:text-xs font-body text-slate-400 mt-0.5">Hackathons Led</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-editorial text-white">100%</span>
              <p className="text-[11px] sm:text-xs font-body text-slate-400 mt-0.5">Club Commitment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
