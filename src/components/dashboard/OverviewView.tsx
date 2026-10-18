import React from 'react';
import { User, ClubEvent, ClubProject, AttendanceRecord } from '../../types';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import {
  Calendar,
  Flame,
  FolderGit2,
  Trophy,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  QrCode,
  Sparkles,
  GitPullRequest,
  Key,
  Crown
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface OverviewViewProps {
  user: User;
  events: ClubEvent[];
  projects: ClubProject[];
  attendanceHistory: AttendanceRecord[];
  onOpenCheckIn: (event?: ClubEvent) => void;
  onNavigateTab: (tab: 'calendar' | 'projects' | 'verticals' | 'directory' | 'admin') => void;
  onViewWebsite?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  events,
  projects,
  attendanceHistory,
  onOpenCheckIn,
  onNavigateTab,
  onViewWebsite,
}) => {
  const nextEvent = events[0];
  const userProjects = projects.filter((p) =>
    p.contributors.some((c) => c.name.toLowerCase().includes(user.name.toLowerCase()))
  );
  const displayProjects = userProjects.length > 0 ? userProjects : projects.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Welcome Header with Live Permission Badges & Event Metrics */}
      <PersonalizedWelcome
        user={user}
        events={events}
        onOpenCreateEvent={() => onNavigateTab('admin')}
        onViewWebsite={onViewWebsite || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        onOpenAccessManager={() => onNavigateTab('admin')}
      />

      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 uppercase">
              {user.role} // {user.vertical === 'balgo' ? 'B/ALGO' : user.vertical === 'beuild' ? 'Be/UILD' : user.vertical === 'bhack' ? 'B/Hack' : 'B/DEV'} SQUAD
            </span>
            <span className="text-xs font-mono text-slate-400">
              ID: {user.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
            WELCOME BACK, {user.name.split(' ')[0]}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
            You are currently on a <strong className="text-amber-400 font-mono">{user.streakWeeks}-week attendance streak</strong>.
            Your vertical squad has 2 sprints scheduled this week.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {(user.isAdmin || user.role === 'Admin' || user.role === 'Lead') && (
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigateTab('admin');
              }}
              className="px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>ADMIN CONSOLE</span>
            </button>
          )}

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenCheckIn(nextEvent);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>VERIFY LAB ATTENDANCE</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Attendance Rate */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ATTENDANCE RATE</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-white">
              {user.attendanceRate}%
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${user.attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Attendance Streak */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ATTENDANCE STREAK</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-amber-300">
              {user.streakWeeks} WEEKS
            </span>
            <span className="text-xs font-mono text-amber-400">
              🔥 Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Unbroken since start of semester
          </p>
        </div>

        {/* Metric 3: Active Projects */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>INCUBATED REPOS</span>
            <FolderGit2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-white">
              {user.projectsCount}
            </span>
            <span className="text-xs font-mono text-sky-400">
              1 Shipped
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            3 in active development
          </p>
        </div>

        {/* Metric 4: Guild Experience XP */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>GUILD XP & RANK</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-heading font-black text-purple-300">
              {user.xp}
            </span>
            <span className="text-xs font-mono text-purple-400">
              Rank: Top 5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Tier: Senior Architect
          </p>
        </div>
      </div>

      {/* 2-Column Split: Next Event Card + Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Next Event Countdown & Attendance History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Event Spotlight Card */}
          {nextEvent && (
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 tracking-wider uppercase font-bold">
                  NEXT LAB GATHERING
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  Code: <code className="font-bold underline">{nextEvent.checkinCode}</code>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase mb-2">
                {nextEvent.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-light mb-6">
                {nextEvent.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300 mb-6">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{nextEvent.date}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{nextEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{nextEvent.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="text-xs font-mono text-slate-400">
                  Host: <span className="text-white font-semibold">{nextEvent.host}</span>
                </div>

                <button
                  onClick={() => {
                    audioManager.playClick();
                    onOpenCheckIn(nextEvent);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFY ATTENDANCE</span>
                </button>
              </div>
            </div>
          )}

          {/* Past Attendance Verification Log */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                RECENT VERIFIED ATTENDANCE
              </h3>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Full Log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {attendanceHistory.slice(0, 4).map((att) => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-heading font-semibold text-white">
                      {att.eventTitle}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {att.eventDate} • {att.vertical.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      +{att.xpEarned} XP
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Projects Quick View & Lab Utilities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Projects Snapshot */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                ACTIVE REPOSITORIES
              </h3>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({projects.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {displayProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-white">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300">
                      {p.vertical}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-light line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Lab Credentials & Hardware Utilities */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
              <Key className="w-4 h-4" />
              <span>LAB ACCESS & RESOURCES</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Lab 402 Keypad:</span>
                <span className="text-cyan-300 font-bold">#4028*</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">8x H100 Cluster SSH:</span>
                <span className="text-slate-300 truncate font-mono text-[11px]">
                  ssh builder@gpu.bstack.tech
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Discord Stage:</span>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>discord.gg/bstack</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
