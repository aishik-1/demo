import React from 'react';
import { User, ClubEvent } from '../../types/dashboard';
import {
  Calendar,
  Plus,
  ArrowUpRight,
  Users,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
} from 'lucide-react';
import { hasEventEditAccess } from '../../utils/permissions';

interface PersonalizedWelcomeProps {
  user: User;
  events: ClubEvent[];
  onOpenCreateEvent: () => void;
  onViewWebsite: () => void;
  onResetEvents?: () => void;
  onOpenAccessManager?: () => void;
}

export const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({
  user,
  events,
  onOpenCreateEvent,
  onViewWebsite,
  onResetEvents,
  onOpenAccessManager,
}) => {
  const canEdit = hasEventEditAccess(user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const nextUpcomingEvent = events.length > 0 ? events[0] : null;
  const totalBuilders = events.reduce((acc, evt) => acc + (evt.attendeesCount || 0), 0);

  return (
    <section className="border-b border-white/10 pb-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* User Identity & Greeting */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-medium">B/Stack {user.role}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">{user.email}</span>
                <span aria-hidden="true">·</span>
                {canEdit ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Write Access
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Read-Only Access
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-0.5">
                {getGreeting()}, {user.name}
              </h1>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light leading-relaxed">
            {canEdit
              ? 'You have organizer privileges to create, edit, reorder, and publish events directly to the live B/Stack website.'
              : 'You are signed in with Attendee access. Upcoming events can only be edited by authorized Club Leads and Core Organizers.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onOpenAccessManager && (
            <button
              onClick={onOpenAccessManager}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Access List</span>
            </button>
          )}

          {events.length === 0 && onResetEvents && (
            <button
              onClick={onResetEvents}
              className="px-3.5 py-2 text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restore Defaults</span>
            </button>
          )}

          <button
            onClick={onViewWebsite}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View on Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {canEdit ? (
            <button
              onClick={onOpenCreateEvent}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 text-xs font-medium text-slate-500 bg-white/[0.03] border border-white/5 rounded-lg flex items-center gap-1.5 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Create Restricted (Read-Only)</span>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Published Events</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white font-mono tabular-nums">
              {events.length}
            </span>
            <span className="text-xs text-slate-400">live on site</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Next Gathering</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="truncate">
            <span className="text-sm font-medium text-white truncate block">
              {nextUpcomingEvent ? nextUpcomingEvent.title : 'None scheduled'}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums truncate block">
              {nextUpcomingEvent ? `${nextUpcomingEvent.date} · ${nextUpcomingEvent.time}` : 'All caught up'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total RSVP Builders</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white font-mono tabular-nums">
              {totalBuilders}
            </span>
            <span className="text-xs text-slate-400">registered</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Your Permission Level</span>
            {canEdit ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <div className="truncate">
            <span className={`text-sm font-semibold truncate block ${canEdit ? 'text-emerald-300' : 'text-amber-300'}`}>
              {canEdit ? 'Organizer (Full Access)' : 'Attendee (Read-Only)'}
            </span>
            <span className="text-xs text-slate-400 truncate block">
              {canEdit ? 'Can edit & delete events' : 'Requires Lead role to edit'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
