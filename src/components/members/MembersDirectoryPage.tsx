import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Users,
  Code2,
  Bot,
  Trophy,
  GitFork,
  Award,
  Github,
  Linkedin,
  Instagram,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { AISHIK_ROY, CLUB_MEMBERS } from '../../data/clubMembers';
import { User, VerticalType } from '../../types';
import { BStackLogo } from '../common/BStackLogo';
import { audioManager } from '../../utils/audio';

interface MembersDirectoryPageProps {
  onBackToHome: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onEnterDashboard?: () => void;
  isAuthenticated?: boolean;
}

interface MemberCardTheme {
  accentColor: string;
  categoryTag: string;
  verticalLabel: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
}

const MEMBER_THEMES: Record<string, MemberCardTheme> = {
  'usr-aishik-head': {
    accentColor: '#38bdf8', // Sky / Cyan
    categoryTag: 'TECH CLUB HEAD',
    verticalLabel: 'HEAD OF TECH CLUB // B/ALGO',
    bgGradient: 'from-cyan-600/35 via-blue-950/40 to-slate-950',
    borderColor: 'border-cyan-400/40 group-hover:border-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  },
  'usr-ziyad-parkar': {
    accentColor: '#f59e0b', // Amber / Gold
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // LEAD & CORE MEMBER',
    bgGradient: 'from-amber-600/35 via-amber-950/40 to-slate-950',
    borderColor: 'border-amber-400/40 group-hover:border-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  'usr-priyansh-singh': {
    accentColor: '#8b5cf6', // Violet
    categoryTag: 'B/HACK',
    verticalLabel: 'B/HACK // RAPID PROTOTYPING & SPRINT',
    bgGradient: 'from-violet-600/35 via-purple-950/40 to-slate-950',
    borderColor: 'border-violet-400/40 group-hover:border-violet-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  },
  'usr-harshit-vyas': {
    accentColor: '#f59e0b', // Amber / Gold
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO CORE // CODEMASTER',
    bgGradient: 'from-amber-600/35 via-amber-950/40 to-slate-950',
    borderColor: 'border-amber-400/40 group-hover:border-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  'usr-ranjan-kumar-sahu': {
    accentColor: '#10b981', // Emerald / Green
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // ROBOTICS & HARDWARE',
    bgGradient: 'from-emerald-600/35 via-emerald-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  'usr-akash-sekh': {
    accentColor: '#10b981', // Emerald / Green
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // ROBOTICS & FIRMWARE',
    bgGradient: 'from-emerald-600/35 via-emerald-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  'usr-vinay-khandia': {
    accentColor: '#059669', // Emerald
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // HARDWARE & EMBEDDED',
    bgGradient: 'from-emerald-600/35 via-teal-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  'usr-seemakurthi-koushitha': {
    accentColor: '#eab308', // Yellow
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // PROBLEM SOLVER',
    bgGradient: 'from-amber-600/35 via-yellow-950/40 to-slate-950',
    borderColor: 'border-yellow-400/40 group-hover:border-yellow-400',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  },
  'usr-vanshika-gupta': {
    accentColor: '#f59e0b', // Amber
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // COMPETITIVE PROGRAMMER',
    bgGradient: 'from-amber-600/35 via-orange-950/40 to-slate-950',
    borderColor: 'border-amber-400/40 group-hover:border-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  'usr-aarman': {
    accentColor: '#10b981', // Emerald
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // CAD & MECHANICS',
    bgGradient: 'from-emerald-600/35 via-teal-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  'usr-arnav': {
    accentColor: '#059669', // Emerald
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // CIRCUITS & SENSORS',
    bgGradient: 'from-emerald-600/35 via-emerald-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  'usr-trideep-chakraborty': {
    accentColor: '#8b5cf6', // Violet
    categoryTag: 'B/HACK',
    verticalLabel: 'B/HACK // WEB3 & PROTOCOLS',
    bgGradient: 'from-purple-600/35 via-purple-950/40 to-slate-950',
    borderColor: 'border-purple-400/40 group-hover:border-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  },
  'usr-arsh-shukla': {
    accentColor: '#eab308', // Yellow
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // ALGORITHMIC OPTIMIZATION',
    bgGradient: 'from-yellow-600/35 via-yellow-950/40 to-slate-950',
    borderColor: 'border-yellow-400/40 group-hover:border-yellow-400',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  },
};

const DEFAULT_THEME: MemberCardTheme = {
  accentColor: '#06b6d4',
  categoryTag: 'B/DEV',
  verticalLabel: 'B/DEV // CORE SYSTEMS',
  bgGradient: 'from-cyan-600/35 via-cyan-950/40 to-slate-950',
  borderColor: 'border-cyan-400/40 group-hover:border-cyan-400',
  badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
};

export const MembersDirectoryPage: React.FC<MembersDirectoryPageProps> = ({
  onBackToHome,
  onOpenAuth,
  onEnterDashboard,
  isAuthenticated = false,
}) => {
  // Combine all official members (Head Aishik Roy + all active core members)
  const allMembers: User[] = useMemo(() => {
    return [AISHIK_ROY, ...CLUB_MEMBERS.filter((m) => m.id !== AISHIK_ROY.id)];
  }, []);

  // Infinite moving marquee members track
  const marqueeMembers = useMemo(() => [...allMembers, ...allMembers], [allMembers]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<'all' | VerticalType>('all');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'xp' | 'name'>('recommended');

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll when profile modal is open
  useEffect(() => {
    if (selectedMember) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedMember]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((m) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          m.name.toLowerCase().includes(query) ||
          m.handle.toLowerCase().includes(query) ||
          m.bio.toLowerCase().includes(query) ||
          m.badges.some((b) => b.toLowerCase().includes(query)) ||
          m.year.toLowerCase().includes(query);

        const matchesVertical =
          selectedVertical === 'all' ||
          m.vertical === selectedVertical ||
          (selectedVertical === 'beuild' && (m.vertical as string) === 'build');

        return matchesSearch && matchesVertical;
      })
      .sort((a, b) => {
        if (sortBy === 'xp') {
          return b.xp - a.xp;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Recommended: Head first, then by XP
        if (a.id === AISHIK_ROY.id) return -1;
        if (b.id === AISHIK_ROY.id) return 1;
        return b.xp - a.xp;
      });
  }, [allMembers, searchQuery, selectedVertical, sortBy]);

  const verticalCounts = useMemo(() => {
    return {
      all: allMembers.length,
      balgo: allMembers.filter((m) => m.vertical === 'balgo').length,
      beuild: allMembers.filter((m) => m.vertical === 'beuild' || (m.vertical as string) === 'build').length,
      bhack: allMembers.filter((m) => m.vertical === 'bhack').length,
      bdev: allMembers.filter((m) => m.vertical === 'bdev').length,
    };
  }, [allMembers]);

  const activeTheme = selectedMember
    ? MEMBER_THEMES[selectedMember.id] || DEFAULT_THEME
    : DEFAULT_THEME;

  return (
    <div className="relative min-h-screen bg-[#030305] text-slate-100 overflow-x-hidden">
      {/* 
        Top Fixed Navigation Bar specifically for Members Directory Webpage 
      */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-10 py-3 sm:py-5 backdrop-blur-2xl bg-black/40 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand + Back to Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioManager.playClick();
                onBackToHome();
              }}
              className="liquid-glass liquid-glass-hover px-3 sm:px-4 py-2 rounded-full flex items-center gap-2.5 group cursor-pointer border border-white/10 hover:border-cyan-400/40 transition-all"
              title="Return to B/Stack Home"
            >
              <BStackLogo className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm font-bold tracking-wider text-white">
                B<span className="text-cyan-400">/</span>Stack
              </span>
            </button>

            <span className="hidden sm:inline-block text-slate-600 font-mono text-xs">/</span>

            {/* Back button */}
            <button
              onClick={() => {
                audioManager.playClick();
                onBackToHome();
              }}
              className="liquid-pill liquid-pill-hover px-3.5 py-1.5 rounded-full text-xs font-body text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Back to Home</span>
            </button>
          </div>

          {/* Center Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-slate-400">Directory</span>
            <span className="text-cyan-400">●</span>
            <span className="text-white font-semibold">{filteredMembers.length} Members</span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  audioManager.playClick();
                  if (onEnterDashboard) onEnterDashboard();
                }}
                className="liquid-pill liquid-pill-hover px-4 py-2 rounded-full text-xs font-body font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            ) : (
              <button
                onClick={() => {
                  audioManager.playClick();
                  if (onOpenAuth) onOpenAuth('signup');
                }}
                className="liquid-pill liquid-pill-hover px-4 py-2 rounded-full text-xs font-body font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply to Guild</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-12">
        {/*
          ======================================================================
          PAGE HERO HEADER with masked text popping up effect
          ======================================================================
        */}
        <div className="space-y-5 max-w-4xl">
          <div className="overflow-hidden py-0.5">
            <motion.div
              initial={{ y: '105%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-400 font-bold">
                OFFICIAL GUILD ROSTER // BOSSCODER SCHOOL OF TECHNOLOGY
              </span>
            </motion.div>
          </div>

          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-normal tracking-tight text-white leading-tight"
            >
              Members Directory
            </motion.h1>
          </div>

          <div className="overflow-hidden py-1">
            <motion.p
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              className="text-lg sm:text-2xl md:text-3xl font-editorial italic font-normal text-slate-300"
            >
              the builders, algorithms engineers, and systems architects
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="text-xs sm:text-sm text-slate-400 font-body font-light max-w-2xl leading-relaxed"
          >
            The dedicated collective driving Bosscoder School of Technology's technical excellence. Explore profiles, competitive achievements, robotics prototypes, and open-source contributions.
          </motion.p>

          {/* Quick Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <div className="liquid-pill px-4 py-2 rounded-full text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>13 Active Engineers &amp; Leads</span>
            </div>
            <div className="liquid-pill px-4 py-2 rounded-full text-xs font-mono text-amber-300 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>420+ Weekly Algo Solves</span>
            </div>
            <div className="liquid-pill px-4 py-2 rounded-full text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>12 Hardware Prototypes</span>
            </div>
            <div className="liquid-pill px-4 py-2 rounded-full text-xs font-mono text-purple-300 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>24 Hackathons Won</span>
            </div>
          </motion.div>
        </div>

        {/*
          ======================================================================
          INFINITE MOVING MEMBERS SHOWCASE (Continuous right-to-left marquee)
          ======================================================================
        */}
        <div className="space-y-4 pt-6 pb-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-400 font-bold">
                ACTIVE ENGINEERS &amp; LEADS // MOVING MARQUEE
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
              Hover to pause • Click to inspect bio
            </span>
          </div>

          <div className="w-full -mx-4 sm:-mx-8 md:-mx-12 px-4 sm:px-8 md:px-12 overflow-hidden select-none py-3">
            <div className="animate-marquee-slow flex items-center gap-6 cursor-pointer">
              {marqueeMembers.map((member, idx) => {
                const theme = MEMBER_THEMES[member.id] || DEFAULT_THEME;

                return (
                  <div
                    key={`marquee-${member.id}-${idx}`}
                    onClick={() => {
                      audioManager.playClick();
                      setSelectedMember(member);
                    }}
                    onMouseEnter={() => {
                      audioManager.playClick();
                    }}
                    className="relative flex-shrink-0 w-64 sm:w-72 aspect-[9/13] rounded-3xl overflow-hidden group transition-all duration-300 border border-white/10 hover:border-white/40 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
                  >
                    {/* Vivid background color tint matching vertical */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${theme.bgGradient} transition-opacity duration-300`}
                    />

                    {/* Member Portrait */}
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          member.id === 'usr-ziyad-parkar'
                            ? '/src/assets/images/ziyad.jpg'
                            : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';
                      }}
                      style={{ objectPosition: 'center 30%' }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient scrim for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badge: Related Vertical */}
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <span
                        style={{ color: theme.accentColor }}
                        className="text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15"
                      >
                        {member.vertical === 'balgo'
                          ? 'B/ALGO'
                          : member.vertical === 'beuild' || (member.vertical as string) === 'build'
                          ? 'B/UILD'
                          : member.vertical === 'bhack'
                          ? 'B/HACK'
                          : 'B/DEV'}
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 z-10 pointer-events-none">
                      <p
                        style={{ color: theme.accentColor }}
                        className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold truncate"
                      >
                        {theme.verticalLabel}
                      </p>

                      <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide uppercase leading-tight truncate drop-shadow-md">
                        {member.name}
                      </h3>

                      <p className="text-xs font-body text-slate-300 font-light truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/*
          ======================================================================
          INTERACTIVE SEARCH & TRACK FILTER BAR
          ======================================================================
        */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member by name, handle, skill, or role..."
                className="w-full pl-11 pr-10 py-3 rounded-full liquid-glass border border-white/10 text-xs sm:text-sm font-body text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Sort:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="liquid-pill px-3.5 py-2 pr-8 rounded-full text-xs font-mono text-white bg-transparent border border-white/10 focus:outline-none focus:border-cyan-400/50 cursor-pointer appearance-none"
                >
                  <option value="recommended" className="bg-slate-900 text-white">Recommended (Leads First)</option>
                  <option value="xp" className="bg-slate-900 text-white">Highest XP</option>
                  <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vertical Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedVertical === 'all'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-white/30'
              }`}
            >
              All Guilds ({verticalCounts.all})
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical('balgo');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedVertical === 'balgo'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-amber-400/30'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>B/ALGO ({verticalCounts.balgo})</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical('beuild');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedVertical === 'beuild'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-emerald-400/30'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>B/UILD ({verticalCounts.beuild})</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical('bhack');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedVertical === 'bhack'
                  ? 'bg-purple-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-purple-400/30'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>B/HACK ({verticalCounts.bhack})</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical('bdev');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedVertical === 'bdev'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-cyan-400/30'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>B/DEV ({verticalCounts.bdev})</span>
            </button>
          </div>
        </div>

        {/*
          ======================================================================
          MEMBERS GRID (Clean liquid-glass cards matching video aesthetic)
          ======================================================================
        */}
        {filteredMembers.length === 0 ? (
          <div className="liquid-glass p-12 sm:p-16 rounded-[2.5rem] border border-white/10 text-center space-y-4 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-2xl font-editorial text-white">No Members Found</h3>
            <p className="text-xs text-slate-400 font-body">
              No engineers matched &ldquo;{searchQuery}&rdquo;. Try searching by name, handle, or switching guild filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedVertical('all');
              }}
              className="px-5 py-2 rounded-full liquid-pill text-xs font-mono text-cyan-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredMembers.map((member, idx) => {
              const theme = MEMBER_THEMES[member.id] || DEFAULT_THEME;
              const isHead = member.id === AISHIK_ROY.id;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4) }}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedMember(member);
                  }}
                  className={`group relative rounded-[2rem] sm:rounded-[2.4rem] p-3.5 overflow-hidden liquid-glass border ${theme.borderColor} transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col justify-between`}
                >
                  {/* Subtle dynamic glow aura */}
                  <div
                    className={`absolute -inset-1 rounded-[2.6rem] bg-gradient-to-b ${theme.bgGradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Top: Image Section */}
                  <div>
                    <div className="relative aspect-[4/5] rounded-[1.6rem] sm:rounded-[1.9rem] overflow-hidden mb-4 bg-slate-900 border border-white/10">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Calming dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {/* Vertical Category Tag */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`liquid-pill px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${theme.badgeBg}`}
                        >
                          {theme.categoryTag}
                        </span>
                      </div>

                      {/* Head Star Badge */}
                      {isHead && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}

                      {/* Bottom Image Overlay: Name & Handle */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] font-mono tracking-widest text-slate-300 block uppercase">
                          {member.handle}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-editorial font-normal text-white group-hover:text-cyan-200 transition-colors">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="px-1.5 space-y-3">
                      <p className="text-xs font-editorial italic text-slate-300 line-clamp-1">
                        {member.year}
                      </p>

                      <p className="text-[11px] sm:text-xs font-body font-light text-slate-400 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>

                      {/* Badges preview */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.badges.slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/10 text-slate-300 truncate max-w-[140px]"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="pt-4 mt-3 border-t border-white/[0.08] px-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{member.xp} XP</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                      <span>View Bio</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="pt-16 pb-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-body text-slate-400">
          <div className="flex items-center gap-3">
            <BStackLogo className="w-5 h-5 text-white" />
            <span>Bosscoder School of Technology &bull; B/Stack Tech Guild</span>
          </div>

          <button
            onClick={() => {
              audioManager.playClick();
              onBackToHome();
            }}
            className="liquid-pill liquid-pill-hover px-5 py-2.5 rounded-full text-xs font-body text-white flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Return to Main Website</span>
          </button>
        </div>
      </main>

      {/*
        ========================================================================
        INTERACTIVE PROFILE POPUP DIALOGUE
        ========================================================================
      */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
            />

            {/* Profile Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-2xl liquid-glass rounded-[2.5rem] p-6 sm:p-9 border ${activeTheme.borderColor} shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col justify-between`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full liquid-pill flex items-center justify-center text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer z-20"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-6">
                {/* Top Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Portrait with themed border */}
                  <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-xl bg-slate-900">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className={`liquid-pill px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${activeTheme.badgeBg}`}>
                        {activeTheme.verticalLabel}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
                      {selectedMember.name}
                    </h2>

                    <p className="text-xs font-mono text-cyan-400">
                      {selectedMember.handle}
                    </p>

                    <p className="text-sm font-editorial italic text-slate-300">
                      {selectedMember.year}
                    </p>

                    {/* Social Handles */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                      {selectedMember.github && (
                        <a
                          href={selectedMember.github}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full liquid-pill flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 transition-all"
                          title="GitHub Profile"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full liquid-pill flex items-center justify-center text-sky-400 hover:text-white hover:scale-110 transition-all"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {selectedMember.instagram && (
                        <a
                          href={selectedMember.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full liquid-pill flex items-center justify-center text-pink-400 hover:text-white hover:scale-110 transition-all"
                          title="Instagram Profile"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Narrative Bio */}
                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Engineer Biography
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-body font-light leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl liquid-glass border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">XP Score</span>
                    <span className="text-lg font-mono font-bold text-amber-300">{selectedMember.xp}</span>
                  </div>
                  <div className="p-3 rounded-xl liquid-glass border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Streak</span>
                    <span className="text-lg font-mono font-bold text-cyan-300">{selectedMember.streakWeeks} wks</span>
                  </div>
                  <div className="p-3 rounded-xl liquid-glass border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Attendance</span>
                    <span className="text-lg font-mono font-bold text-emerald-300">{selectedMember.attendanceRate}%</span>
                  </div>
                  <div className="p-3 rounded-xl liquid-glass border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Projects</span>
                    <span className="text-lg font-mono font-bold text-purple-300">{selectedMember.projectsCount}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Guild Badges &amp; Credentials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.badges.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] border border-white/10 text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Joined: {selectedMember.joinedDate}
                </span>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-full liquid-pill hover:bg-white/10 text-xs font-body text-white transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
