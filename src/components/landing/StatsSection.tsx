import React from 'react';
import { Terminal, Award, GitPullRequest, DollarSign, Users, Flame } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      label: 'ACTIVE BUILDERS',
      value: '120+',
      detail: 'Across 5 specialized engineering guilds',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
    },
    {
      label: 'HACKATHONS WON',
      value: '24',
      detail: 'ETHGlobal, MLH Prime, CalHacks & more',
      icon: <Award className="w-4 h-4 text-amber-400" />,
    },
    {
      label: 'PRIZES & BOUNTIES',
      value: '$340K+',
      detail: 'Awarded to student teams in grants & prizes',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    },
    {
      label: 'UPSTREAM KERNEL PRS',
      value: '14',
      detail: 'Directly merged into Linux & open source cores',
      icon: <GitPullRequest className="w-4 h-4 text-sky-400" />,
    },
    {
      label: 'WEEKLY LAB ATTENDANCE',
      value: '94%',
      detail: 'Consistent physical attendance in hardware lab',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
    },
    {
      label: 'COMPUTE CLUSTER',
      value: '8x H100',
      detail: 'Private dedicated NVLink GPU training cluster',
      icon: <Terminal className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            03 // IMPACT TELEMETRY
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        {/* Video Typography Replicate */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
            WE PRIORITIZE PRODUCTION REPOS & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
              VERIFIABLE CODE
            </span>
          </h2>
          <p className="text-slate-400 text-sm font-light mt-3">
            Every metric below represents verifiable code in git logs, hardware prototypes tested on the field, and algorithmic submissions passing automated judges.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-white/10 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                  {stat.label}
                </span>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  {stat.icon}
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                {stat.value}
              </div>

              <p className="text-xs text-slate-400 mt-2 font-light">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
