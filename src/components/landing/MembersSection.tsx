import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CLUB_MEMBERS, HARSHIT_VYAS } from '../../data/clubMembers';
import { User } from '../../types';
import { Github, Linkedin, X, Sparkles, Award, Users } from 'lucide-react';
import { audioManager } from '../../utils/audio';

// Visual color themes matching the vivid Dribbble cards in the video
interface MemberCardTheme {
  accentColor: string;
  categoryTag: string;
  verticalLabel: string;
  bgGradient: string;
  borderColor: string;
}

const MEMBER_THEMES: Record<string, MemberCardTheme> = {
  'usr-ziyad-parkar': {
    accentColor: '#f59e0b', // Amber / Gold
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // LEAD & CORE MEMBER',
    bgGradient: 'from-amber-600/35 via-amber-950/40 to-slate-950',
    borderColor: 'border-amber-400/40 group-hover:border-amber-400',
  },
  'usr-priyansh-singh': {
    accentColor: '#8b5cf6', // Violet
    categoryTag: 'B/HACK',
    verticalLabel: 'B/HACK // RAPID PROTOTYPING & SPRINT',
    bgGradient: 'from-violet-600/35 via-purple-950/40 to-slate-950',
    borderColor: 'border-violet-400/40 group-hover:border-violet-400',
  },
  'usr-harshit-vyas': {
    accentColor: '#f59e0b', // Amber / Gold
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO CORE // CODEMASTER',
    bgGradient: 'from-amber-600/35 via-amber-950/40 to-slate-950',
    borderColor: 'border-amber-400/40 group-hover:border-amber-400',
  },
  'usr-ranjan-kumar-sahu': {
    accentColor: '#10b981', // Emerald / Green
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // ROBOTICS & HARDWARE',
    bgGradient: 'from-emerald-600/35 via-emerald-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
  },
  'usr-akash-sekh': {
    accentColor: '#10b981', // Emerald / Green
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // ROBOTICS & FIRMWARE',
    bgGradient: 'from-emerald-600/35 via-emerald-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
  },
  'usr-vinay-khandia': {
    accentColor: '#059669', // Emerald
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // HARDWARE & EMBEDDED',
    bgGradient: 'from-emerald-600/35 via-teal-950/40 to-slate-950',
    borderColor: 'border-emerald-400/40 group-hover:border-emerald-400',
  },
  'usr-seemakurthi-koushitha': {
    accentColor: '#06b6d4', // Cyan
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // ALGORITHMS & ICPC',
    bgGradient: 'from-cyan-600/35 via-cyan-950/40 to-slate-950',
    borderColor: 'border-cyan-400/40 group-hover:border-cyan-400',
  },
  'usr-vanshika-gupta': {
    accentColor: '#38bdf8', // Sky Blue
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // DATA STRUCTURES',
    bgGradient: 'from-sky-600/35 via-blue-950/40 to-slate-950',
    borderColor: 'border-sky-400/40 group-hover:border-sky-400',
  },
  'usr-aarman': {
    accentColor: '#f97316', // Orange
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // PROTOTYPING & HARDWARE',
    bgGradient: 'from-orange-600/35 via-orange-950/40 to-slate-950',
    borderColor: 'border-orange-400/40 group-hover:border-orange-400',
  },
  'usr-arnav': {
    accentColor: '#ea580c', // Deep Orange
    categoryTag: 'B/UILD',
    verticalLabel: 'B/UILD // IOT & ROBOTICS',
    bgGradient: 'from-orange-600/35 via-orange-950/40 to-slate-950',
    borderColor: 'border-orange-400/40 group-hover:border-orange-400',
  },
  'usr-trideep-chakraborty': {
    accentColor: '#a855f7', // Purple
    categoryTag: 'B/HACK',
    verticalLabel: 'B/HACK // WEB3 & PROTOCOLS',
    bgGradient: 'from-purple-600/35 via-purple-950/40 to-slate-950',
    borderColor: 'border-purple-400/40 group-hover:border-purple-400',
  },
  'usr-arsh-shukla': {
    accentColor: '#eab308', // Yellow
    categoryTag: 'B/ALGO',
    verticalLabel: 'B/ALGO // ALGORITHMIC OPTIMIZATION',
    bgGradient: 'from-yellow-600/35 via-yellow-950/40 to-slate-950',
    borderColor: 'border-yellow-400/40 group-hover:border-yellow-400',
  },
};

const DEFAULT_THEME: MemberCardTheme = {
  accentColor: '#06b6d4',
  categoryTag: 'B/STACK',
  verticalLabel: 'B/STACK // CORE MEMBER',
  bgGradient: 'from-cyan-600/35 via-cyan-950/40 to-slate-950',
  borderColor: 'border-cyan-400/40 group-hover:border-cyan-400',
};

interface MembersSectionProps {
  onOpenMembersPage?: () => void;
}

export const MembersSection: React.FC<MembersSectionProps> = ({ onOpenMembersPage }) => {
  // Modal pop-up state
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close pop-up on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background scroll to prevent overlapping when dialogue box is open
  useEffect(() => {
    if (selectedMember) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedMember]);

  const openMemberPopup = (member: User) => {
    audioManager.playClick();
    setSelectedMember(member);
  };

  const closeMemberPopup = () => {
    audioManager.playClick();
    setSelectedMember(null);
  };

  // Duplicate members to create seamless infinite loop from right to left
  const marqueeMembers = [...CLUB_MEMBERS, ...CLUB_MEMBERS];

  const popupTheme = selectedMember
    ? MEMBER_THEMES[selectedMember.id] || DEFAULT_THEME
    : DEFAULT_THEME;

  return (
    <section id="members" className="relative py-16 sm:py-24 z-10 overflow-hidden">
      {/* Editorial Header */}
      <div className="px-4 sm:px-8 md:px-12 max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-[11px] sm:text-xs font-body tracking-[0.25em] uppercase text-cyan-400 font-semibold">
            COMMUNITY // BOSSCODER TECH GUILD
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-editorial font-normal tracking-tight text-white leading-tight">
            Tech Club Members
          </h2>
          <p className="text-lg sm:text-2xl md:text-3xl font-editorial italic font-normal text-slate-300">
            the builders, algorithms engineers, and creators
          </p>
        </div>

        {onOpenMembersPage && (
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenMembersPage();
            }}
            className="liquid-pill liquid-pill-hover px-5 py-3 rounded-full text-xs font-mono font-semibold text-white flex items-center gap-2 cursor-pointer border border-cyan-400/30 hover:border-cyan-400 self-start sm:self-auto transition-all shrink-0"
          >
            <span>Open Members Directory Webpage</span>
            <span className="text-cyan-300">&rarr;</span>
          </button>
        )}
      </div>

      {/* 
        ========================================================================
        INFINITE RIGHT-TO-LEFT MOVING CARDS (Matching Video 00:00 - 00:06)
        - Continuously glides from right to left smoothly
        - Pauses animation when cursor is over the track
        - Clicking / hovering any card opens the exact video pop-up
        ========================================================================
      */}
      <div className="w-full overflow-hidden select-none py-4">
        <div className="animate-marquee-slow flex items-center gap-6 cursor-pointer">
          {marqueeMembers.map((member, idx) => {
            const theme = MEMBER_THEMES[member.id] || DEFAULT_THEME;

            return (
              <div
                key={`${member.id}-${idx}`}
                onClick={() => openMemberPopup(member)}
                onMouseEnter={() => {
                  // Hover feedback
                  audioManager.playClick();
                }}
                className="relative flex-shrink-0 w-64 sm:w-72 md:w-80 aspect-[9/13] rounded-3xl overflow-hidden group transition-all duration-300 border border-white/10 hover:border-white/40 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
              >
                {/* Vivid background color tint matching the video */}
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

                {/* Gradient scrim for high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                {/* Top Badge: Related Vertical */}
                <div className="absolute top-4 left-4 pointer-events-none">
                  <span
                    style={{ color: theme.accentColor }}
                    className="text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15"
                  >
                    {member.vertical === 'balgo'
                      ? 'B/ALGO'
                      : member.vertical === 'beuild'
                      ? 'B/UILD'
                      : member.vertical === 'bhack'
                      ? 'B/HACK'
                      : 'B/DEV'}
                  </span>
                </div>

                {/* Bottom Info Overlay (Exact text structure from video cards) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5 z-10 pointer-events-none">
                  {/* Small category / tag in colored uppercase */}
                  <p
                    style={{ color: theme.accentColor }}
                    className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold truncate"
                  >
                    {theme.verticalLabel}
                  </p>

                  {/* Member Name in Bold All-Caps */}
                  <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-wide uppercase leading-tight truncate drop-shadow-md">
                    {member.name}
                  </h3>

                  {/* Related Vertical & Role */}
                  <p className="text-xs font-body text-slate-300 font-light truncate">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onOpenMembersPage && (
        <div className="px-4 sm:px-8 max-w-7xl mx-auto pt-6 flex justify-center">
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenMembersPage();
            }}
            className="liquid-glass liquid-glass-hover px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-body font-semibold text-white flex items-center gap-2.5 cursor-pointer border border-white/20 hover:border-cyan-400/50 transition-all shadow-xl"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Explore All 13 Core Members in Dedicated Webpage</span>
            <span className="text-cyan-300 font-mono">&rarr;</span>
          </button>
        </div>
      )}

      {/* 
        ========================================================================
        DETAIL POP-UP MODAL (Exact match of Video 00:07 - 00:12)
        - Rendered in a portal to prevent header/navbar clipping & stacking traps
        - object-top prevents portrait heads/faces from cutting off at top
        - Optimized for mobile, tablet, and desktop viewports
        ========================================================================
      */}
      {selectedMember && mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            onClick={closeMemberPopup}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-black/90 backdrop-blur-xl overflow-y-auto overscroll-contain animate-in fade-in duration-300"
          >
            {/* Card Container (stops propagation so clicking inside won't close) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#121316] border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 my-auto max-h-[92dvh] sm:max-h-[90vh] flex flex-col md:grid md:grid-cols-12"
            >
              {/* Close button in top-right */}
              <button
                onClick={closeMemberPopup}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/25 shadow-xl hover:scale-105 active:scale-95"
                title="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Full Portrait Photo */}
              <div className="md:col-span-5 relative bg-black/80 overflow-hidden flex items-center justify-center h-80 xs:h-[370px] sm:h-[440px] md:h-full w-full shrink-0 select-none">
                {/* Ambient blurred backdrop so letterboxing in contain mode blends seamlessly */}
                <img
                  src={selectedMember.avatar}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                />

                {/* Main Member Portrait */}
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      selectedMember.id === 'usr-ziyad-parkar'
                        ? '/src/assets/images/ziyad.jpg'
                        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';
                  }}
                  style={{
                    objectPosition: 'center 32%',
                  }}
                  className="relative z-10 w-full h-full object-cover transition-all duration-300"
                />

                {/* Subtle bottom vignette */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Column: Member Details (Scrollable to prevent overlapping) */}
              <div className="md:col-span-7 p-5 sm:p-8 md:p-10 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto md:max-h-[90vh] space-y-4 sm:space-y-6">
                <div>
                  {/* Category in small white/accent tracking-widest text */}
                  <p
                    style={{ color: popupTheme.accentColor }}
                    className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase font-bold mb-1.5"
                  >
                    {popupTheme.verticalLabel}
                  </p>

                  {/* Member Name in Large Bold Editorial Display */}
                  <h3 className="text-2xl sm:text-4xl md:text-5xl font-editorial font-bold text-white tracking-tight uppercase leading-[1.1] mb-1.5">
                    {selectedMember.name}
                  </h3>

                  {/* Vertical & Role line (Position of $450.00 in video) */}
                  <p className="text-sm sm:text-base font-editorial text-slate-300 tracking-wide mb-3 sm:mb-4">
                    {selectedMember.role} • {selectedMember.year}
                  </p>

                  {/* Clean descriptive bio paragraph */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 font-body font-light leading-relaxed mb-4 sm:mb-6">
                    {selectedMember.bio}
                  </p>

                  {/* Badges strip (only name, role, vertical, and badges - NO XP, NO STREAK) */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {selectedMember.badges.map((badge, idx) => {
                      const isCodemaster = badge === 'Codemaster';
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-body flex items-center gap-1.5 border transition-all ${
                            isCodemaster
                              ? 'border-amber-400/60 bg-amber-400/15 text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                              : 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          {isCodemaster ? (
                            <Sparkles className="w-3 h-3 text-amber-300" />
                          ) : (
                            <Award className="w-3 h-3 text-cyan-400" />
                          )}
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Buttons (Matching ADD TO CART and BUY buttons in video 00:08) */}
                <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {/* Primary Solid Button */}
                  {selectedMember.github && (
                    <a
                      href={selectedMember.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => audioManager.playClick()}
                      className="px-5 py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Github className="w-4 h-4 text-slate-950" />
                      VIEW GITHUB
                    </a>
                  )}

                  {/* Secondary Outlined Button */}
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => audioManager.playClick()}
                      className="px-5 py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs uppercase tracking-wider border border-white/20 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4 text-sky-400" />
                      LINKEDIN
                    </a>
                  )}

                  {/* Handle display */}
                  <span className="sm:ml-auto text-center sm:text-right text-xs font-mono text-cyan-400 font-medium pt-1 sm:pt-0">
                    {selectedMember.handle}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
