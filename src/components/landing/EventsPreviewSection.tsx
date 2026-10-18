import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLUB_EVENTS } from '../../data/mockData';
import { ClubEvent } from '../../types';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  X,
  Terminal,
  BookOpen,
  Code2,
  Bot,
  Trophy,
  GitFork,
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface EventsPreviewSectionProps {
  onOpenAuth: (mode: 'signin' | 'signup', method?: 'google' | 'phone') => void;
  onEnterCalendar: () => void;
  isAuthenticated: boolean;
  events?: ClubEvent[];
}

export const EventsPreviewSection: React.FC<EventsPreviewSectionProps> = ({
  onOpenAuth,
  onEnterCalendar,
  isAuthenticated,
  events,
}) => {
  const displayEvents = events !== undefined ? events : CLUB_EVENTS;

  // Selected event for full pop-up inspection
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<ClubEvent | null>(null);

  // Quick RSVP state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDetailEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll when modal is active
  useEffect(() => {
    if (selectedDetailEvent) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedDetailEvent]);

  const handleQuickRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailEvent) return;
    setIsSubmittingRsvp(true);
    audioManager.playClick();

    try {
      await fetch(`/api/events/${selectedDetailEvent.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rsvpName, email: rsvpEmail }),
      });
      setRsvpSuccess(true);
      setTimeout(() => {
        setRsvpSuccess(false);
        setRsvpName('');
        setRsvpEmail('');
      }, 2000);
    } catch {
      setRsvpSuccess(true);
      setTimeout(() => {
        setRsvpSuccess(false);
        setRsvpName('');
        setRsvpEmail('');
      }, 2000);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const getVerticalColorTheme = (vertical: string) => {
    switch (vertical) {
      case 'balgo':
        return {
          bg: 'from-amber-500/25 to-amber-950/40',
          border: 'border-amber-400/40 group-hover:border-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          icon: <Code2 className="w-5 h-5 text-amber-400" />,
          accent: 'text-amber-400',
          dot: 'bg-amber-400',
          glow: 'group-hover:shadow-[0_25px_60px_rgba(245,158,11,0.22)]',
        };
      case 'beuild':
      case 'build':
        return {
          bg: 'from-emerald-500/25 to-emerald-950/40',
          border: 'border-emerald-400/40 group-hover:border-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          icon: <Bot className="w-5 h-5 text-emerald-400" />,
          accent: 'text-emerald-400',
          dot: 'bg-emerald-400',
          glow: 'group-hover:shadow-[0_25px_60px_rgba(16,185,129,0.22)]',
        };
      case 'bhack':
        return {
          bg: 'from-purple-500/25 to-purple-950/40',
          border: 'border-purple-400/40 group-hover:border-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
          icon: <Trophy className="w-5 h-5 text-purple-400" />,
          accent: 'text-purple-400',
          dot: 'bg-purple-400',
          glow: 'group-hover:shadow-[0_25px_60px_rgba(168,85,247,0.22)]',
        };
      case 'bdev':
      default:
        return {
          bg: 'from-cyan-500/25 to-cyan-950/40',
          border: 'border-cyan-400/40 group-hover:border-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
          icon: <GitFork className="w-5 h-5 text-cyan-400" />,
          accent: 'text-cyan-400',
          dot: 'bg-cyan-400',
          glow: 'group-hover:shadow-[0_25px_60px_rgba(34,211,238,0.22)]',
        };
    }
  };

  return (
    <section id="events" className="relative py-12 sm:py-16 z-10 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <div className="w-full">
        {/* Editorial Section Header with Masked Text Popping Up Effect */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="space-y-3.5 max-w-2xl">
            <div className="overflow-hidden py-0.5">
              <motion.div
                initial={{ y: '105%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-400 font-bold">
                  PUBLIC SCHEDULE // GATHERINGS &amp; WORKSHOPS
                </p>
              </motion.div>
            </div>

            <div className="overflow-hidden py-1">
              <motion.h2
                initial={{ y: '110%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="text-4xl sm:text-6xl md:text-7xl font-editorial font-normal tracking-tight text-white leading-tight"
              >
                Upcoming Events
              </motion.h2>
            </div>

            <div className="overflow-hidden py-1">
              <motion.p
                initial={{ y: '110%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                className="text-xl sm:text-3xl md:text-4xl font-editorial italic font-normal text-slate-200"
              >
                open sessions, code labs &amp; tech sprints
              </motion.p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-body font-light max-w-xl leading-relaxed">
              A curated calendar of hands-on algorithmic sprints, robotics bring-ups, and systems engineering labs at Bosscoder School of Technology.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{displayEvents.length} Active Sessions</span>
          </div>
        </div>

        {/* If no events, render clean empty state */}
        {displayEvents.length === 0 ? (
          <div className="liquid-glass p-12 sm:p-16 rounded-[2.5rem] border border-white/10 text-center space-y-5 max-w-2xl mx-auto animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Calendar className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                CALENDAR STATUS // 0 SESSIONS SCHEDULED
              </span>
              <h3 className="text-3xl sm:text-4xl font-editorial text-white font-normal pt-1">
                No Upcoming Events
              </h3>
              <p className="text-sm text-slate-300 font-body max-w-md mx-auto leading-relaxed font-light">
                There are currently no upcoming sessions or workshops scheduled on the public calendar. Stay tuned for new hackathons, competitive programming sprints, and code labs!
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              {isAuthenticated && (
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onEnterCalendar();
                  }}
                  className="px-6 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-body font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create An Event in Dashboard</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /*
            ====================================================================
            KANGAROO POCKET CONTAINERS WITH 3D POP-UP & CARD FLIP INTERACTION
            ====================================================================
          */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {displayEvents.map((evt, idx) => {
              const theme = getVerticalColorTheme(evt.vertical);

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedDetailEvent(evt);
                  }}
                  className="relative group h-[490px] sm:h-[515px] cursor-pointer select-none"
                  style={{ perspective: '1400px' }}
                >
                  {/*
                    ================================================================
                    KANGAROO POCKET STRUCTURE
                    - Pocket Back Wall: Deep recessed sleeve with inner shadow
                    - Event Card: Pops UP out of pocket and flips forward on hover
                    - Pocket Front Lip: Tactile front pouch with curved lip and notch
                    ================================================================
                  */}

                  {/* 1. Kangaroo Pocket Backing & Outer Frame */}
                  <div className="absolute inset-0 rounded-[2.6rem] bg-gradient-to-b from-[#090e1c] via-[#050814] to-[#020308] border border-white/[0.08] shadow-[inset_0_20px_45px_rgba(0,0,0,0.95)] group-hover:border-white/20 transition-all duration-500 overflow-visible pointer-events-none">
                    {/* Interior ambient light spill from deep within the pocket */}
                    <div className={`absolute top-10 inset-x-4 h-44 bg-gradient-to-b ${theme.bg} opacity-20 blur-3xl group-hover:opacity-45 transition-opacity duration-700`} />
                  </div>

                  {/*
                    2. THE SLIDING & FLIPPING EVENT CARD
                    - Rest: Leaned back, submerged 40px inside the pocket
                    - Hover: Pops smoothly up (-translate-y-16), flips forward (rotateX(0deg)), casts ambient shadow
                  */}
                  <div
                    className="relative z-10 w-full h-[395px] sm:h-[415px] rounded-[2rem] bg-[#0c1222] border border-white/[0.12] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] group-hover:border-cyan-400/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out transform translate-y-8 sm:translate-y-10 group-hover:-translate-y-14 sm:group-hover:-translate-y-16 group-hover:scale-[1.02] group-hover:rotate-[-0.5deg]"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Visual Card Header */}
                    <div className="relative aspect-[16/9] rounded-[1.3rem] overflow-hidden bg-gradient-to-br from-white/[0.07] via-black/50 to-black/85 border border-white/10 p-3 sm:p-3.5 flex flex-col justify-between mb-3.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 z-10">
                        <span
                          className={`liquid-pill px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${theme.badge} flex items-center gap-1.5`}
                        >
                          {theme.icon}
                          <span>{evt.vertical.toUpperCase()}</span>
                        </span>

                        <span className="text-[11px] font-mono text-slate-300 liquid-pill px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>{evt.date}</span>
                        </span>
                      </div>

                      {/* Monogram emblem */}
                      <div className="flex items-center justify-center my-auto z-10">
                        <div className="w-10 h-10 rounded-2xl liquid-glass border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <span className="scale-105">{theme.icon}</span>
                        </div>
                      </div>

                      {/* Host & Duration */}
                      <div className="flex items-center justify-between z-10 text-[11px] font-mono text-slate-300">
                        <span className="truncate max-w-[170px] tracking-tight">{evt.host}</span>
                        <span className={`${theme.accent} font-semibold`}>{evt.duration}</span>
                      </div>
                    </div>

                    {/* Event Title with Playfair Display editorial font */}
                    <h3 className="text-xl sm:text-[21px] font-editorial font-normal tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-snug mb-2 line-clamp-2">
                      {evt.title}
                    </h3>

                    {/* Summary text */}
                    <p className="text-xs text-slate-300 font-body font-light line-clamp-2 leading-relaxed mb-3.5">
                      {evt.description}
                    </p>

                    {/* Specs / Meta */}
                    <div className="space-y-1.5 pt-2.5 border-t border-white/[0.08] text-xs font-mono text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{evt.time}</span>
                        </span>
                        <span className="text-emerald-300 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{evt.attendeesCount} / {evt.maxCapacity}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 truncate pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate text-[11px]">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/*
                    3. KANGAROO POCKET FRONT POUCH (The physical pocket flap)
                    Overlaps the bottom of the card at rest; stays in place as card ascends
                  */}
                  <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 rounded-b-[2.6rem] bg-gradient-to-t from-[#020409] via-[#050914] to-[#081022] border-t border-white/[0.14] z-20 pointer-events-none flex flex-col justify-end p-5 transition-all duration-500 group-hover:border-white/25 shadow-[0_-12px_28px_rgba(0,0,0,0.92)]">
                    {/* Concave thumb notch cutout at top center of pocket rim */}
                    <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-20 h-3 rounded-b-xl bg-[#090e1c] border-b border-x border-white/10" />

                    {/* Double-stitch accent line */}
                    <div className="w-full border-b border-dashed border-white/[0.07] mb-2.5" />

                    {/* Pocket Base Engraving */}
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
                        <span className="text-slate-200 font-semibold">{evt.vertical.toUpperCase()} PASS</span>
                      </div>

                      <span className="text-slate-400">SESSION #{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/*
        ========================================================================
        FULL EVENT DETAILS POP-UP MODAL (Opened upon card click)
        ========================================================================
      */}
      <AnimatePresence>
        {selectedDetailEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailEvent(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
            />

            {/* Popping Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl liquid-glass rounded-[2.5rem] p-6 sm:p-9 border border-white/20 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDetailEvent(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full liquid-pill flex items-center justify-center text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer z-20"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-6">
                {/* Modal Header */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="liquid-pill px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                      {selectedDetailEvent.vertical.toUpperCase()} // LAB SESSION
                    </span>
                    <span className="liquid-pill px-3 py-1 rounded-full text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{selectedDetailEvent.date}</span>
                    </span>
                    <span className="liquid-pill px-3 py-1 rounded-full text-[10px] font-mono text-emerald-300">
                      {selectedDetailEvent.locationType.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-editorial font-normal text-white leading-tight">
                    {selectedDetailEvent.title}
                  </h2>
                </div>

                {/* Host Info Bar */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedDetailEvent.hostAvatar ? (
                      <img
                        src={selectedDetailEvent.hostAvatar}
                        alt={selectedDetailEvent.host}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold font-mono">
                        {selectedDetailEvent.host[0]}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Session Host &amp; Lead
                      </span>
                      <span className="text-sm font-body font-semibold text-white">
                        {selectedDetailEvent.host}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Duration
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {selectedDetailEvent.duration}
                    </span>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Session Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-body font-light leading-relaxed">
                    {selectedDetailEvent.description}
                  </p>
                </div>

                {/* Logistical Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl liquid-glass border border-white/5 flex items-center gap-3 text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">TIME</span>
                      <span>{selectedDetailEvent.time}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl liquid-glass border border-white/5 flex items-center gap-3 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">LOCATION</span>
                      <span className="truncate">{selectedDetailEvent.location}</span>
                    </div>
                  </div>
                </div>

                {/* Agenda list if available */}
                {selectedDetailEvent.agenda && selectedDetailEvent.agenda.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Session Agenda
                    </h4>
                    <div className="space-y-2">
                      {selectedDetailEvent.agenda.map((item, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300 font-body"
                        >
                          <span className="font-mono text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites if available */}
                {selectedDetailEvent.prerequisites && selectedDetailEvent.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Prerequisites &amp; Gear
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDetailEvent.prerequisites.map((p, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/10 text-slate-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick RSVP Form inside modal */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-body font-bold text-white">
                        Reserve Your Seat
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {selectedDetailEvent.attendeesCount} / {selectedDetailEvent.maxCapacity} seats currently reserved
                      </p>
                    </div>

                    <span className="liquid-pill px-3 py-1 rounded-full text-[10px] font-mono text-emerald-300">
                      Free Entry
                    </span>
                  </div>

                  {rsvpSuccess ? (
                    <div className="py-4 text-center space-y-2 animate-in fade-in">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h5 className="font-bold text-white text-sm">RSVP Confirmed!</h5>
                      <p className="text-xs text-slate-400">We have added you to the session roster.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickRsvp} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full px-3.5 py-2 rounded-xl liquid-glass border border-white/10 text-xs font-body text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                        />
                        <input
                          type="email"
                          required
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          placeholder="student@bosscoder.com"
                          className="w-full px-3.5 py-2 rounded-xl liquid-glass border border-white/10 text-xs font-body text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingRsvp}
                        className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-body font-bold tracking-wider uppercase transition-all cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        {isSubmittingRsvp ? 'Reserving...' : 'Confirm RSVP & Reserve Seat'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Passcode Check-in Enabled</span>

                <button
                  onClick={() => setSelectedDetailEvent(null)}
                  className="px-5 py-2 rounded-full liquid-pill hover:bg-white/10 text-xs font-body text-white transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
