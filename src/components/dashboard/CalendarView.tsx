import React, { useState } from 'react';
import { User, ClubEvent, VerticalType, AttendanceRecord } from '../../types';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  QrCode,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  CalendarPlus,
  ExternalLink
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface CalendarViewProps {
  user?: User;
  events: ClubEvent[];
  attendanceHistory: AttendanceRecord[];
  onOpenCheckIn: (event: ClubEvent) => void;
  onUpdateRSVP: (eventId: string, status: 'attending' | 'maybe' | 'none') => void;
  onOpenCreateEvent?: () => void;
  onViewWebsite?: () => void;
  onResetEvents?: () => void;
  onOpenAccessManager?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  user,
  events,
  attendanceHistory,
  onOpenCheckIn,
  onUpdateRSVP,
  onOpenCreateEvent,
  onViewWebsite,
  onResetEvents,
  onOpenAccessManager,
}) => {
  const [selectedVertical, setSelectedVertical] = useState<'all' | VerticalType>('all');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(events[0] || null);

  const filteredEvents = selectedVertical === 'all'
    ? events
    : events.filter((e) => e.vertical === selectedVertical || e.vertical === 'all');

  // Days of current month (October 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventsForDay = (day: number) => {
    const dayStr = `2026-10-${day.toString().padStart(2, '0')}`;
    return events.filter((e) => e.date === dayStr);
  };

  const handleRSVPChange = (eventId: string, status: 'attending' | 'maybe' | 'none') => {
    audioManager.playClick();
    onUpdateRSVP(eventId, status);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({ ...selectedEvent, rsvpStatus: status });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Welcome Header with Live Metrics & Permission Badges */}
      {user && (
        <PersonalizedWelcome
          user={user}
          events={events}
          onOpenCreateEvent={onOpenCreateEvent || (() => {})}
          onViewWebsite={onViewWebsite || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
          onResetEvents={onResetEvents}
          onOpenAccessManager={onOpenAccessManager}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
            CLUB EVENT CALENDAR & ATTENDANCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            RSVP for upcoming technical workshops, track your attendance, and verify lab check-ins.
          </p>
        </div>

        {/* Vertical Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'balgo', 'beuild', 'bhack', 'bdev'] as const).map((v) => {
            const label =
              v === 'all'
                ? 'ALL'
                : v === 'balgo'
                ? 'B/ALGO'
                : v === 'beuild'
                ? 'Be/UILD'
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                  selectedVertical === v
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Calendar Month Grid + Event Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Month Calendar View */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-heading font-bold text-white tracking-wider">
                  OCTOBER 2026
                </h3>
              </div>
              <div className="text-xs font-mono text-cyan-300">
                {filteredEvents.length} SPRINTS SCHEDULED
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-slate-400 mb-2">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {/* Offset for Oct 1 (Thursday in 2026) -> 4 blanks */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`blank-${i}`} className="h-16 rounded-xl bg-white/[0.01]" />
              ))}

              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedEvent && selectedEvent.date === `2026-10-${day.toString().padStart(2, '0')}`;
                const isToday = day === 16;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        audioManager.playClick();
                        setSelectedEvent(dayEvents[0]);
                      }
                    }}
                    className={`h-16 rounded-xl p-1.5 flex flex-col justify-between text-left transition-all border ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : dayEvents.length > 0
                        ? 'bg-slate-900/90 border-white/15 hover:border-cyan-500/50 cursor-pointer'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <span className={`text-[11px] font-mono font-bold ${
                      isToday ? 'text-cyan-400 underline' : 'text-slate-300'
                    }`}>
                      {day}
                    </span>

                    {/* Event dots/tags */}
                    {dayEvents.length > 0 && (
                      <div className="space-y-0.5">
                        {dayEvents.map((e) => (
                          <div
                            key={e.id}
                            className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 truncate"
                          >
                            {e.title.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events List View */}
          <div className="space-y-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              ALL UPCOMING GATHERINGS
            </h3>

            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedEvent(evt);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                        {evt.vertical}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {evt.date} • {evt.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-heading font-bold text-white">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {evt.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.rsvpStatus === 'attending' && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        Attending
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCheckIn(evt);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold font-mono text-[11px] uppercase"
                    >
                      Check In
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Inspector & RSVP Card */}
        <div className="lg:col-span-5 space-y-6">
          {selectedEvent ? (
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/15 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 uppercase font-bold">
                    {selectedEvent.vertical.toUpperCase()} TRACK
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Cap: {selectedEvent.attendeesCount} / {selectedEvent.maxCapacity || '∞'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase">
                  {selectedEvent.title}
                </h3>
              </div>

              {/* Info Badges */}
              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{selectedEvent.date} ({selectedEvent.time})</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{selectedEvent.location}</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Host: {selectedEvent.host}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  DESCRIPTION
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Agenda if available */}
              {selectedEvent.agenda && (
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    TIMELINE / AGENDA
                  </h4>
                  <div className="space-y-1.5">
                    {selectedEvent.agenda.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-300 font-mono flex items-start gap-2 bg-white/[0.02] p-2 rounded-lg"
                      >
                        <span className="text-cyan-400">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RSVP Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  YOUR RSVP STATUS:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRSVPChange(selectedEvent.id, 'attending')}
                    className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                      selectedEvent.rsvpStatus === 'attending'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Attending
                  </button>

                  <button
                    onClick={() => handleRSVPChange(selectedEvent.id, 'maybe')}
                    className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                      selectedEvent.rsvpStatus === 'maybe'
                        ? 'bg-amber-950/80 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Maybe
                  </button>

                  <button
                    onClick={() => handleRSVPChange(selectedEvent.id, 'none')}
                    className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                      selectedEvent.rsvpStatus === 'none'
                        ? 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Decline
                  </button>
                </div>

                {/* Verify Attendance Button */}
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onOpenCheckIn(selectedEvent);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 mt-4"
                >
                  <QrCode className="w-4 h-4" />
                  <span>CHECK IN WITH CODE ({selectedEvent.checkinCode})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center text-slate-400 text-xs font-mono">
              Select an event to view full details and mark attendance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
