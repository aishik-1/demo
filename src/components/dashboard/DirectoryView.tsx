import React, { useState } from 'react';
import { User, VerticalType, ClubRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import {
  Users,
  Search,
  Award,
  Github,
  Linkedin,
  Flame,
  CheckCircle2,
  X,
  ExternalLink,
  Code2,
  Crown
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface DirectoryViewProps {
  currentUser: User;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ currentUser }) => {
  const [search, setSearch] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<'all' | VerticalType>('all');
  const [selectedRole, setSelectedRole] = useState<'all' | ClubRole>('all');
  const [inspectUser, setInspectUser] = useState<User | null>(null);

  // Combine currentUser and demo users without duplicate IDs
  const allMembers = [
    currentUser,
    ...DEMO_USERS.filter((u) => u.id !== currentUser.id),
  ];

  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.handle.toLowerCase().includes(search.toLowerCase()) ||
      m.bio.toLowerCase().includes(search.toLowerCase());
    const matchesVertical = selectedVertical === 'all' || m.vertical === selectedVertical;
    const matchesRole = selectedRole === 'all' || m.role === selectedRole;
    return matchesSearch && matchesVertical && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
            MEMBER DIRECTORY & PROFILES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Connect with guild leads, core system architects, and squad peers across all engineering verticals.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 self-start sm:self-auto">
          {allMembers.length} ACTIVE BUILDERS REGISTERED
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle, skills..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(['all', 'balgo', 'beuild', 'bhack', 'bdev'] as const).map((v) => {
            const label =
              v === 'all'
                ? 'ALL'
                : v === 'balgo'
                ? 'B/ALGO'
                : v === 'beuild'
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

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => {
              audioManager.playClick();
              setInspectUser(member);
            }}
            className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ objectPosition: 'center 30%' }}
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:border-cyan-400 transition-colors"
                />
                <div className="overflow-hidden">
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">{member.handle}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{member.year}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                  {member.vertical === 'balgo' ? 'B/ALGO' : member.vertical === 'beuild' ? 'Be/UILD' : member.vertical === 'bhack' ? 'B/Hack' : 'B/DEV'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  {member.role}
                </span>
                {(member.isAdmin || member.role === 'Admin' || member.role === 'Lead') && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-bold">
                    <Crown className="w-2.5 h-2.5 fill-amber-400" />
                    ADMIN
                  </span>
                )}
                {member.codeforcesRating && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    CF {member.codeforcesRating}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-2 mb-4">
                {member.bio}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {member.streakWeeks}w
              </span>

              <span>{member.attendanceRate}% Attendance</span>

              <span className="text-cyan-400 font-semibold">{member.xp} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Member Details Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setInspectUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={inspectUser.avatar}
                alt={inspectUser.name}
                style={{ objectPosition: 'center 30%' }}
                className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/50"
              />
              <div>
                <h3 className="text-xl font-heading font-black text-white uppercase">
                  {inspectUser.name}
                </h3>
                <p className="text-xs font-mono text-cyan-400">{inspectUser.handle}</p>
                <p className="text-xs text-slate-400 font-light">{inspectUser.email}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 uppercase block mb-1">BIO & SPECIALTY</span>
                <p className="text-slate-200 font-light text-xs leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-white/5">
                  {inspectUser.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">ATTENDANCE RECORD</span>
                  <span className="text-base font-bold text-white">{inspectUser.attendanceRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">ACTIVE STREAK</span>
                  <span className="text-base font-bold text-amber-300">{inspectUser.streakWeeks} Weeks</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase block mb-2">VERIFIED HONORS</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectUser.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5 text-[11px]"
                    >
                      <Award className="w-3 h-3 text-cyan-400" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Joined: {inspectUser.joinedDate}</span>
                <a
                  href={inspectUser.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
