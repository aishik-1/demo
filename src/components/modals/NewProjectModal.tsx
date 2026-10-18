import React, { useState } from 'react';
import { ClubProject, VerticalType, User } from '../../types';
import { X, FolderGit2, Plus, Sparkles } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface NewProjectModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onCreateProject: (project: ClubProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState<VerticalType>(currentUser.vertical || 'bdev');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('Rust, Linux, eBPF');
  const [status, setStatus] = useState<ClubProject['status']>('in-progress');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playSuccess();

    const techTags = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: ClubProject = {
      id: `prj-${Date.now()}`,
      title,
      description,
      vertical,
      status,
      repoUrl: repoUrl || 'https://github.com/bstack-org',
      demoUrl: demoUrl || undefined,
      stars: 1,
      forks: 0,
      contributors: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'Core Architect',
        },
      ],
      techStack: techTags.length > 0 ? techTags : ['C++', 'Python'],
      progress: status === 'deployed' ? 100 : status === 'testing' ? 85 : 45,
      lastUpdated: 'Just now',
      openIssuesCount: 1,
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
              REGISTER NEW REPOSITORY
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Incubate a club software or hardware project
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
              PROJECT TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AeroTelemetry ROS2 Node"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
              DESCRIPTION & ARCHITECTURE
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What problem does this project solve? What is the architecture?"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                VERTICAL TRACK
              </label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value as VerticalType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="balgo">B/ALGO: Competitive prog</option>
                <option value="build">B/UILD: Robotics and Hardware</option>
                <option value="bhack">B/Hack: Hackathon and etc</option>
                <option value="bdev">B/DEV: Open source and web dev</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                CURRENT STAGE
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClubProject['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="ideation">Ideation & Specs</option>
                <option value="in-progress">In Active Dev</option>
                <option value="testing">Testing & Benchmark</option>
                <option value="deployed">Deployed & Live</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
              TECH STACK (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Rust, Tokio, eBPF, React"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                GITHUB REPO URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                LIVE DEMO URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>INCUBATE PROJECT (+250 XP)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
