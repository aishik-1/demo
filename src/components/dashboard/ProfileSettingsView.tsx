import React, { useState } from 'react';
import { User, VerticalType } from '../../types';
import {
  User as UserIcon,
  Github,
  Mail,
  Award,
  Sparkles,
  Save,
  Volume2,
  CheckCircle2,
  Flame,
  Code2,
  Bot,
  Trophy,
  GitFork
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface ProfileSettingsViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [year, setYear] = useState(user.year);
  const [github, setGithub] = useState(user.github);
  const [vertical, setVertical] = useState<VerticalType>(user.vertical);
  const [cfHandle, setCfHandle] = useState(user.codeforcesHandle || '');
  const [cfRating, setCfRating] = useState(user.codeforcesRating || 1800);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playSuccess();
    const updated: User = {
      ...user,
      name,
      handle,
      email,
      bio,
      year,
      github,
      vertical,
      codeforcesHandle: cfHandle,
      codeforcesRating: Number(cfRating),
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
          BUILDER PROFILE & PREFERENCES
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Update your public guild identity, vertical squad enrollment, and development links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover object-top border border-cyan-500/40"
            />
            <div>
              <h3 className="text-lg font-heading font-bold text-white uppercase">
                {name}
              </h3>
              <p className="text-xs font-mono text-cyan-400">{handle}</p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 mt-1 inline-block">
                {user.role} • Joined {user.joinedDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                GUILD HANDLE
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                ACADEMIC YEAR / PROGRAM
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Vertical Squad Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">
              PRIMARY GUILD VERTICAL
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'balgo', label: 'B/ALGO: Competitive Prog', icon: <Code2 className="w-3.5 h-3.5" /> },
                { id: 'beuild', label: 'Be/UILD: Robotics & HW', icon: <Bot className="w-3.5 h-3.5" /> },
                { id: 'bhack', label: 'B/Hack: Hackathons', icon: <Trophy className="w-3.5 h-3.5" /> },
                { id: 'bdev', label: 'B/DEV: Open Source & Web', icon: <GitFork className="w-3.5 h-3.5" /> },
              ].map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setVertical(v.id as VerticalType)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono border transition-all ${
                    vertical === v.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {v.icon}
                  <span className="truncate">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
              BIOGRAPHY & TECHNICAL FOCUS
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                GITHUB PROFILE URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                CODEFORCES HANDLE
              </label>
              <input
                type="text"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                placeholder="e.g. kaitanaka_sys"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE PROFILE CHANGES</span>
            </button>
          </div>
        </div>
      </form>

      {/* Audio Engine Testing */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
          <Volume2 className="w-4 h-4" />
          <span>PROCEDURAL AUDIO PREFERENCES</span>
        </div>
        <p className="text-xs text-slate-300 font-light">
          B/Stack utilizes browser Web Audio oscillators for ambient cosmic drone and UI feedback without external media files.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => audioManager.playSuccess()}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
          >
            Test Chime Fanfare
          </button>
          <button
            type="button"
            onClick={() => audioManager.playClick()}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
          >
            Test Cyber Click
          </button>
        </div>
      </div>
    </div>
  );
};
