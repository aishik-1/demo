import React, { useState } from 'react';
import { User, ClubEvent, VerticalType } from '../../types';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import {
  Calendar,
  Plus,
  ArrowUpRight,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  QrCode,
  Tag,
  ShieldCheck,
  X,
  Save,
  Radio,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  BookOpen,
  Globe,
  Copy,
  Check,
  Download,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { audioManager } from '../../utils/audio';
import { hasEventEditAccess } from '../../utils/permissions';
import {
  AUTHORIZED_EMAILS,
  getAllowedEmails,
  addAllowedEmail,
  removeAllowedEmail,
} from '../../utils/authStorage';
import { generateMockDataTsCode, EVENTS_STORAGE_KEY, EVENTS_VERSION_KEY } from '../../utils/eventStorage';

interface UpcomingEventsEditorProps {
  user: User;
  events: ClubEvent[];
  onCreateEvent: (newEvent: ClubEvent) => void;
  onUpdateEvent: (updatedEvent: ClubEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewWebsite: () => void;
  onResetEvents?: () => void;
}

export const UpcomingEventsEditor: React.FC<UpcomingEventsEditorProps> = ({
  user,
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onViewWebsite,
  onResetEvents,
}) => {
  const canEdit = hasEventEditAccess(user);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<'all' | VerticalType>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<ClubEvent | null>(null);
  const [showAccessListModal, setShowAccessListModal] = useState(false);
  const [showVercelSyncModal, setShowVercelSyncModal] = useState(false);
  const [copiedMockDataCode, setCopiedMockDataCode] = useState(false);
  const [copiedGitCommand, setCopiedGitCommand] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Access Manager Whitelist state
  const [allowedEmailsList, setAllowedEmailsList] = useState<string[]>(() => {
    return Array.from(new Set([...AUTHORIZED_EMAILS, ...getAllowedEmails()])).map((e) => e.toLowerCase());
  });
  const [newAllowedEmailInput, setNewAllowedEmailInput] = useState('');

  // Fetch latest authorized emails list from server database on mount (safe for static Vercel)
  React.useEffect(() => {
    fetch('/api/authorized-editors')
      .then(async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data?.success && Array.isArray(data.authorized_editors)) {
          setAllowedEmailsList(
            Array.from(new Set([...AUTHORIZED_EMAILS, ...data.authorized_editors])).map((e) => e.toLowerCase())
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleAddAllowedEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newAllowedEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      triggerToast('Please enter a valid email address.');
      return;
    }
    if (allowedEmailsList.includes(clean)) {
      triggerToast(`${clean} is already on the approved whitelist.`);
      return;
    }
    addAllowedEmail(clean);
    setAllowedEmailsList((prev) => [...prev, clean]);
    setNewAllowedEmailInput('');
    triggerToast(`Added ${clean} to approved dashboard access list!`);
    audioManager.playSuccess();
  };

  const handleRemoveAllowedEmail = (emailToRemove: string) => {
    const clean = emailToRemove.trim().toLowerCase();
    if (
      clean === 'ziyadparkar01@gmail.com' ||
      clean === 'aishik.roy1234@gmail.com' ||
      clean === 'propriyansh71@gmail.com'
    ) {
      triggerToast('Cannot remove primary lead administrator.');
      audioManager.playAlert();
      return;
    }
    removeAllowedEmail(clean);
    setAllowedEmailsList((prev) => prev.filter((e) => e !== clean));
    triggerToast(`Removed ${clean} from approved whitelist.`);
    audioManager.playClick();
  };

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState<VerticalType | 'all'>('balgo');
  const [date, setDate] = useState('2026-10-24');
  const [time, setTime] = useState('18:00 - 20:30 IST');
  const [duration, setDuration] = useState('2.5 hrs');
  const [location, setLocation] = useState('Turing Lab 402 / Virtual Sandbox');
  const [locationType, setLocationType] = useState<'physical' | 'virtual' | 'hybrid'>('hybrid');
  const [host, setHost] = useState(user.name || 'Ziyad Parkar');
  const [hostAvatar, setHostAvatar] = useState(user.avatar || '');
  const [checkinCode, setCheckinCode] = useState('BSTACK26');
  const [maxCapacity, setMaxCapacity] = useState('60');
  const [tagsInput, setTagsInput] = useState('Competitive Programming, ICPC, Algorithms');
  const [agendaInput, setAgendaInput] = useState('Introduction & problem breakdown\nLive code walk-throughs\nHands-on implementation round\nQ&A and review');
  const [prereqsInput, setPrereqsInput] = useState('Basic data structures\nLaptop with C++ / Python / Go');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    if (!canEdit) {
      triggerToast('Restricted: You need Organizer privileges to create events.');
      audioManager.playAlert();
      return;
    }
    audioManager.playClick();
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setVertical('balgo');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('18:00 - 20:00 IST');
    setDuration('2 hrs');
    setLocation('Bosscoder Innovation Central / Virtual Sandbox');
    setLocationType('hybrid');
    setHost(user.name);
    setHostAvatar(user.avatar);
    setCheckinCode(`BSTK${Math.floor(10 + Math.random() * 89)}`);
    setMaxCapacity('60');
    setTagsInput('Hands-on, Engineering, Tech Club');
    setAgendaInput('Welcome & architecture overview\nHands-on deep dive sprint\nTeam code review & Q&A');
    setPrereqsInput('Bring your laptop & enthusiasm');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (event: ClubEvent) => {
    if (!canEdit) {
      triggerToast('Restricted: You need Organizer privileges to edit events.');
      audioManager.playAlert();
      return;
    }
    audioManager.playClick();
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setVertical(event.vertical);
    setDate(event.date);
    setTime(event.time);
    setDuration(event.duration);
    setLocation(event.location);
    setLocationType(event.locationType);
    setHost(event.host);
    setHostAvatar(event.hostAvatar || user.avatar);
    setCheckinCode(event.checkinCode);
    setMaxCapacity(String(event.maxCapacity || 50));
    setTagsInput(event.tags?.join(', ') || '');
    setAgendaInput(event.agenda?.join('\n') || '');
    setPrereqsInput(event.prerequisites?.join('\n') || '');
    setIsModalOpen(true);
  };

  // Save event (Create or Update)
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerToast('Event title is required.');
      return;
    }

    const tags = tagsInput
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const agenda = agendaInput
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    const prerequisites = prereqsInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (editingEventId) {
      // Update existing
      const existing = events.find((e) => e.id === editingEventId);
      const updated: ClubEvent = {
        ...existing,
        id: editingEventId,
        title: title.trim(),
        description: description.trim(),
        vertical,
        date,
        time,
        duration,
        location,
        locationType,
        host,
        hostAvatar,
        checkinCode: checkinCode.trim().toUpperCase(),
        maxCapacity: Number(maxCapacity) || 60,
        attendeesCount: existing?.attendeesCount || 0,
        tags,
        agenda,
        prerequisites,
      };

      onUpdateEvent(updated);
      audioManager.playSuccess();
      triggerToast(`Event "${updated.title}" successfully updated on the front page!`);
    } else {
      // Create new
      const newEvent: ClubEvent = {
        id: `evt-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        vertical,
        date,
        time,
        duration,
        location,
        locationType,
        host,
        hostAvatar,
        checkinCode: checkinCode.trim().toUpperCase(),
        maxCapacity: Number(maxCapacity) || 60,
        attendeesCount: 0,
        rsvpStatus: 'none',
        attendanceVerified: false,
        tags,
        agenda,
        prerequisites,
      };

      onCreateEvent(newEvent);
      audioManager.playSuccess();
      triggerToast(`New event "${newEvent.title}" published live to the front page!`);
    }

    setIsModalOpen(false);
  };

  // Prompt Delete modal (no window.confirm, safe for iframe sandboxes)
  const handlePromptDelete = (event: ClubEvent) => {
    audioManager.playClick();
    setEventToDelete(event);
  };

  // Execute deletion
  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    const deletedTitle = eventToDelete.title;
    audioManager.playClick();
    onDeleteEvent(eventToDelete.id);
    setEventToDelete(null);
    triggerToast(`Event "${deletedTitle}" removed from front page & dashboard.`);
  };

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesVertical = selectedVertical === 'all' || e.vertical === selectedVertical || e.vertical === 'all';
    const matchesSearch =
      !searchQuery.trim() ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVertical && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 text-xs font-mono shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Personalized Welcome Header (Imported per user spec) */}
      <PersonalizedWelcome
        user={user}
        events={events}
        onOpenCreateEvent={handleOpenCreateModal}
        onViewWebsite={onViewWebsite}
        onResetEvents={onResetEvents}
        onOpenAccessManager={() => setShowAccessListModal(true)}
      />

      {/* 2. Front-Page & Firebase Cloud Sync Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-blue-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-heading text-white uppercase tracking-wider">
                Firebase Firestore Cloud Sync: Active
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-mono">
                Real-time Vercel &amp; Front-Page
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Any changes made here publish instantly to <strong>Firebase Cloud</strong> and reflect in real-time on your live Vercel site (<code className="text-cyan-300 font-mono">/#events</code>) for all visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setShowVercelSyncModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cloud &amp; Vercel Sync</span>
          </button>

          <button
            type="button"
            onClick={onViewWebsite}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View on Front Page</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search upcoming events by title, host, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Track Filter Pills & Create Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'balgo', 'beuild', 'bhack', 'bdev'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                audioManager.playClick();
                setSelectedVertical(v);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer border ${
                selectedVertical === v
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                  : 'bg-[#070a11] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {v === 'all' ? 'All Tracks' : v === 'balgo' ? 'B/ALGO' : v === 'beuild' ? 'B/UILD' : v === 'bhack' ? 'B/HACK' : 'B/DEV'}
            </button>
          ))}

          {canEdit && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-auto sm:ml-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Events Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Showing <strong className="text-white">{filteredEvents.length}</strong> upcoming events
          </span>
          <span className="text-cyan-400">Live Website Sync Active</span>
        </div>

        {events.length === 0 ? (
          <div className="p-12 sm:p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Calendar className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                ALL EVENTS REMOVED
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                No Upcoming Events
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-light">
                All events have been deleted. The live website's front page is currently displaying the <strong>"No Upcoming Events"</strong> placeholder card.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>

              {onResetEvents && (
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onResetEvents();
                    triggerToast('Default club events restored successfully!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-mono inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Restore Default Events</span>
                </button>
              )}
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No events match your filter</h3>
            <p className="text-xs text-slate-400">Try adjusting your filters or click "Add Event" to create one.</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedVertical('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-mono"
              >
                Clear Filters
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                {/* Event Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[10px] font-mono font-semibold uppercase">
                      {event.vertical === 'all' ? 'All Squads' : event.vertical.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{event.date} · {event.time} ({event.duration})</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{event.location}</span>
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                      {event.locationType}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-white group-hover:text-cyan-200 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Host, Attendees, Check-in Code */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {event.hostAvatar ? (
                        <img
                          src={event.hostAvatar}
                          alt={event.host}
                          className="w-5 h-5 rounded-full object-cover border border-cyan-500/30"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[9px] flex items-center justify-center text-cyan-300 font-bold">
                          {event.host.charAt(0)}
                        </div>
                      )}
                      <span className="text-slate-300">{event.host}</span>
                    </div>

                    <div className="flex items-center gap-1 text-cyan-300">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{event.attendeesCount || 0} / {event.maxCapacity || 60} RSVPs</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-[11px] text-cyan-300">
                      <QrCode className="w-3 h-3 text-cyan-400" />
                      <span>Code: <strong className="font-mono text-white">{event.checkinCode}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Event Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={onViewWebsite}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="View live card on front page"
                  >
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(event)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handlePromptDelete(event)}
                    className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Delete event from front page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. CREATE / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">
                  {editingEventId ? 'Edit Upcoming Event' : 'Create Upcoming Event'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  This event will be published immediately to the website's front page.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4 pt-4 text-xs">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ICPC Regional Sprint & Advanced Segment Trees"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white text-sm placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Vertical & Location Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Specialization Track / Vertical
                  </label>
                  <select
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="balgo">B/ALGO (Competitive Programming)</option>
                    <option value="beuild">B/UILD (Systems & Robotics)</option>
                    <option value="bhack">B/HACK (Hackathons & Prototypes)</option>
                    <option value="bdev">B/DEV (Distributed Systems & Web)</option>
                    <option value="all">ALL GUILDS (Club-wide Gathering)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Format Mode
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="hybrid">Hybrid (Physical Lab + Virtual Stream)</option>
                    <option value="physical">Physical Lab Only</option>
                    <option value="virtual">Virtual / Online Discord Stage</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="18:00 - 20:30 IST"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2.5 hrs"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location & Host */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Turing Lab 402 / Discord Stage"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Host Name
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="e.g. Aishik Roy / Ziyad Parkar"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkin Code & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Lab Check-in Attendance Code
                  </label>
                  <input
                    type="text"
                    value={checkinCode}
                    onChange={(e) => setCheckinCode(e.target.value.toUpperCase())}
                    placeholder="TREE99"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-cyan-300 font-mono tracking-wider uppercase focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Max Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="60"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive workshop overview describing learning outcomes and agenda..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a11] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Agenda & Prerequisites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Agenda Points (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={agendaInput}
                    onChange={(e) => setAgendaInput(e.target.value)}
                    placeholder="Segment tree basics&#10;Lazy propagation&#10;Live contest solve"
                    className="w-full px-3 py-2 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono text-[11px] placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Algorithms, ICPC, Data Structures"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/10 text-white font-mono text-[11px] placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEventId ? 'Save & Update Live Site' : 'Publish to Front Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ACCESS LIST MODAL */}
      {showAccessListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Approved Event Editors
                </h3>
              </div>
              <button
                onClick={() => setShowAccessListModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-3">
              Only authorized Google &amp; guild email accounts below are permitted to access the Dashboard and publish events:
            </p>

            {/* Add Email input */}
            <form onSubmit={handleAddAllowedEmail} className="flex gap-2 mb-3">
              <input
                type="email"
                value={newAllowedEmailInput}
                onChange={(e) => setNewAllowedEmailInput(e.target.value)}
                placeholder="Add new email to whitelist..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                Add Email
              </button>
            </form>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {allowedEmailsList.map((email) => {
                const isPrimary =
                  email === 'ziyadparkar.official@gmail.com' ||
                  email === 'aishik.roy1234@gmail.com' ||
                  email === 'propriyansh71@gmail.com';
                return (
                  <div
                    key={email}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-200 truncate">{email}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPrimary ? (
                        <span className="text-[10px] text-cyan-400 font-medium px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40">
                          Primary Admin
                        </span>
                      ) : (
                        <>
                          <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                            Approved
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllowedEmail(email)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove from whitelist"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {allowedEmailsList.length} authorized addresses
              </span>
              <button
                onClick={() => setShowAccessListModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. IN-APP DELETE CONFIRMATION MODAL (Safe for iframe sandboxes) */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0c1017] border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Delete Event?
                </h3>
                <p className="text-xs text-rose-300 font-mono">
                  Live front-page removal
                </p>
              </div>
              <button
                onClick={() => setEventToDelete(null)}
                className="ml-auto p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[10px] font-mono uppercase">
                  {eventToDelete.vertical.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {eventToDelete.date} · {eventToDelete.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                "{eventToDelete.title}"
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              Are you sure you want to permanently delete this event? It will be removed immediately from both the front page of the website and the dashboard schedule.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-950/50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Event</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. VERCEL & GIT DEPLOYMENT SYNC MODAL */}
      {showVercelSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0c1017] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Firebase Cloud Sync &amp; Vercel Deployment
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Real-time cloud synchronization between Dashboard, Vercel, and Public Visitors
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVercelSyncModal(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sync Status Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 mb-5 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 mt-1" />
              <div className="space-y-1 text-xs">
                <strong className="text-white block font-medium flex items-center gap-2">
                  <span>Firebase Firestore Cloud Sync: Connected</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">LIVE</span>
                </strong>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  Every edit, new event, or deletion you make is sent directly to <strong>Google Cloud Firestore</strong> in real time. Any visitor loading your Vercel deployment sees the updated events immediately without requiring Git commits or redeploying!
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              {/* Option 1: 1-Click Copy Code */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Option A: 1-Click Copy to mockData.ts (Recommended)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                    Permanent for all users
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Click the button below to copy the exact TypeScript array for your current events. Simply paste it into <code className="text-cyan-300">src/data/mockData.ts</code> and push to GitHub so Vercel redeploys with your updated schedule for every public visitor!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const code = generateMockDataTsCode(events);
                    navigator.clipboard.writeText(code);
                    audioManager.playSuccess();
                    setCopiedMockDataCode(true);
                    triggerToast('Copied CLUB_EVENTS code to clipboard! Paste into src/data/mockData.ts.');
                    setTimeout(() => setCopiedMockDataCode(false), 3000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedMockDataCode ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy CLUB_EVENTS Code for mockData.ts</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Download events.json */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Option B: Download events.json</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Backup / Migration</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Save all current events as a JSON file to share with team members or import onto other devices.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playClick();
                    const json = JSON.stringify(events, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `bstack-events-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    triggerToast('Downloaded events.json file.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download bstack-events.json</span>
                </button>
              </div>

              {/* Git Command Helper */}
              <div className="p-4 rounded-2xl bg-[#06080e] border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Git Push Command to Trigger Vercel Redeploy</span>
                </span>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-400 flex items-center justify-between gap-2 overflow-x-auto">
                  <code className="select-all">git add src/data/mockData.ts && git commit -m "update events" && git push</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('git add src/data/mockData.ts && git commit -m "update events" && git push');
                      audioManager.playClick();
                      setCopiedGitCommand(true);
                      triggerToast('Copied Git command to clipboard!');
                      setTimeout(() => setCopiedGitCommand(false), 2500);
                    }}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer shrink-0"
                  >
                    {copiedGitCommand ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Force Cache Reset Helper */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-neutral-400 text-[11px]">
                  Want to clear browser cache and reload fresh from code?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playClick();
                    try {
                      localStorage.removeItem(EVENTS_STORAGE_KEY);
                      localStorage.removeItem(EVENTS_VERSION_KEY);
                      localStorage.removeItem('bstack_events');
                    } catch {}
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" />
                  <span>Clear Cache &amp; Reload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
