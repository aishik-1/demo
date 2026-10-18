import React, { useState } from 'react';
import { CLUB_PROJECTS } from '../../data/mockData';
import { VerticalType, ClubProject } from '../../types';
import { Github, ExternalLink, Star, GitFork, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface ProjectsSectionProps {
  onOpenProjectDetail?: (project: ClubProject) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProjectDetail }) => {
  const [filter, setFilter] = useState<'all' | VerticalType>('all');

  const filteredProjects = filter === 'all'
    ? CLUB_PROJECTS
    : CLUB_PROJECTS.filter((p) => p.vertical === filter);

  return (
    <section id="projects" className="relative min-h-screen flex items-center py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase font-bold">
            05 // INCUBATOR & REPOSITORIES
          </span>
          <div className="h-[1px] w-16 bg-cyan-500/40" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase">
              PRODUCTION SOFTWARE & HARDWARE
            </h2>
            <p className="text-slate-400 text-sm max-w-xl font-light mt-2">
              Every project is maintained by student teams, audited for performance, and deployed live.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'balgo', 'beuild', 'bhack', 'bdev'] as const).map((key) => {
              const label =
                key === 'all'
                  ? 'ALL'
                  : key === 'balgo'
                  ? 'B/ALGO'
                  : (key as string) === 'build' || key === 'beuild'
                  ? 'B/UILD'
                  : key === 'bhack'
                  ? 'B/Hack'
                  : 'B/DEV';
              return (
                <button
                  key={key}
                  onClick={() => {
                    audioManager.playClick();
                    setFilter(key as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border ${
                    filter === key
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-white/10 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400 uppercase">
                    {project.vertical}
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    project.status === 'deployed'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  }`}>
                    {project.status === 'deployed' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {project.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-300 font-light leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-white/5 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>BUILD COMPLETION</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Contributors & Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {/* Contributors Avatars */}
                  <div className="flex items-center -space-x-2">
                    {project.contributors.map((c, i) => (
                      <img
                        key={i}
                        src={c.avatar}
                        alt={c.name}
                        title={`${c.name} (${c.role})`}
                        className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                      <span>{project.stars}</span>
                    </div>

                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
