import React, { useState } from 'react';
import { ClubProject, VerticalType } from '../../types';
import {
  FolderGit2,
  Plus,
  Github,
  ExternalLink,
  Star,
  GitFork,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Kanban,
  LayoutGrid,
  Users
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface ProjectsViewProps {
  projects: ClubProject[];
  onOpenNewProject: () => void;
  onUpdateProjectProgress: (projectId: string, newProgress: number) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenNewProject,
  onUpdateProjectProgress,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('grid');
  const [selectedVertical, setSelectedVertical] = useState<'all' | VerticalType>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesVertical = selectedVertical === 'all' || p.vertical === selectedVertical;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesVertical && matchesSearch;
  });

  const columns: { status: ClubProject['status']; label: string }[] = [
    { status: 'ideation', label: 'IDEATION & ARCHITECTURE' },
    { status: 'in-progress', label: 'IN ACTIVE DEVELOPMENT' },
    { status: 'testing', label: 'TESTING & AUDIT' },
    { status: 'deployed', label: 'DEPLOYED & LIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
            PROJECTS INCUBATOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Student-engineered systems, robotics firmware, competitive judges, and open source repositories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View switcher */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-1">
            <button
              onClick={() => {
                audioManager.playClick();
                setViewMode('grid');
              }}
              className={`p-2 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                setViewMode('kanban');
              }}
              className={`p-2 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'kanban' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenNewProject();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>INCUBATE NEW REPO</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repos, tech stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Vertical Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {(['all', 'balgo', 'beuild', 'bhack', 'bdev'] as const).map((v) => {
            const label =
              v === 'all'
                ? 'ALL'
                : v === 'balgo'
                ? 'B/ALGO'
                : (v as string) === 'build' || v === 'beuild'
                ? 'B/UILD'
                : v === 'bhack'
                ? 'B/Hack'
                : 'B/DEV';
            return (
              <button
                key={v}
                onClick={() => {
                  audioManager.playClick();
                  setSelectedVertical(v as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border ${
                  selectedVertical === v
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode 1: Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase font-bold">
                    {project.vertical === 'balgo'
                      ? 'B/ALGO'
                      : (project.vertical as string) === 'build' || project.vertical === 'beuild'
                      ? 'B/UILD'
                      : project.vertical === 'bhack'
                      ? 'B/Hack'
                      : 'B/DEV'}
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    project.status === 'deployed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {project.status === 'deployed' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {project.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-white group-hover:text-cyan-300 transition-colors mb-2">
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
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Progress bar with interactive click */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>BUILD PROGRESS</span>
                    <span className="text-cyan-300 font-bold">{project.progress}%</span>
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
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 transition-colors"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode 2: Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.status);
            return (
              <div key={col.status} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[250px]">
                  {colProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 uppercase">
                          {p.vertical}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.progress}%
                        </span>
                      </div>

                      <h4 className="text-xs font-heading font-bold text-white">
                        {p.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 font-light line-clamp-2">
                        {p.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                        <span>{p.techStack[0]}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span>{p.stars}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="py-8 text-center text-[11px] font-mono text-slate-500">
                      No repositories in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
