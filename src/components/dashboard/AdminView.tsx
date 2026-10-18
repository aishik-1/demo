import React, { useState, useEffect } from 'react';
import { User, ClubEvent, ClubProject, ClubNotification, ClubRole, VerticalType } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Crown,
  Users,
  QrCode,
  Bell,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Lock,
  Flame,
  Radio,
  Send,
  RefreshCw,
  Copy,
  Check,
  UserPlus,
  Shield,
  Key,
  Calendar,
  Clock,
  MapPin,
  Save,
  X,
} from 'lucide-react';
import { audioManager } from '../../utils/audio';
import {
  ADMIN_EMAILS,
  ADMIN_DEFAULT_PASSCODE,
  AUTHORIZED_EMAILS,
  UNAUTHORIZED_EDITOR_MESSAGE,
  isAuthorizedEditor,
  getStoredGoogleClientId,
  setStoredGoogleClientId,
  getAllowedEmails,
  addAllowedEmail,
  addAllowedEmailsBulk,
  removeAllowedEmail,
  getClubSecurityKey,
  setClubSecurityKey,
} from '../../utils/authStorage';

interface AdminViewProps {
  currentUser: User;
  events: ClubEvent[];
  projects: ClubProject[];
  notifications: ClubNotification[];
  onBroadcastNotification: (notification: ClubNotification) => void;
  onUpdateEventCode: (eventId: string, newCode: string) => void;
  onUpdateEvent?: (updatedEvent: ClubEvent) => void;
  onCreateEvent?: (newEvent: ClubEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  initialSubTab?: 'events-editor' | 'overview' | 'access-control' | 'attendance' | 'announcements' | 'oauth';
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  events,
  projects,
  notifications,
  onBroadcastNotification,
  onUpdateEventCode,
  onUpdateEvent,
  onCreateEvent,
  onDeleteEvent,
  initialSubTab = 'events-editor',
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'events-editor' | 'overview' | 'access-control' | 'attendance' | 'announcements' | 'oauth'>(initialSubTab);

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementType, setAnnouncementType] = useState<'announcement' | 'event' | 'achievement'>('announcement');
  const [announcementSent, setAnnouncementSent] = useState(false);

  // Check-in code management state
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [newCheckinCode, setNewCheckinCode] = useState('');
  const [codeUpdatedToast, setCodeUpdatedToast] = useState(false);

  // Google OAuth Client ID management in Admin
  const [adminClientId, setAdminClientId] = useState(getStoredGoogleClientId());
  const [clientIdSaved, setClientIdSaved] = useState(false);

  // Message Central Mobile Verification Key state
  const [adminMcCustomerId, setAdminMcCustomerId] = useState('');
  const [adminMcKey, setAdminMcKey] = useState('');
  const [mcKeySaved, setMcKeySaved] = useState(false);
  const [mcConfigured, setMcConfigured] = useState(false);

  // Access Control & Security Key state
  const [allowedEmailsList, setAllowedEmailsList] = useState<string[]>([]);
  const [newSingleEmail, setNewSingleEmail] = useState('');
  const [bulkEmailsInput, setBulkEmailsInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [clubSecurityKeyInput, setClubSecurityKeyInput] = useState(getClubSecurityKey());
  const [securityKeyCopied, setSecurityKeyCopied] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);
  const [whitelistSearch, setWhitelistSearch] = useState('');

  // Event Editing State
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  // Event form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVertical, setFormVertical] = useState<VerticalType | 'all'>('all');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formDuration, setFormDuration] = useState('2 hrs');
  const [formLocation, setFormLocation] = useState('');
  const [formLocationType, setFormLocationType] = useState<'physical' | 'virtual' | 'hybrid'>('physical');
  const [formHost, setFormHost] = useState(currentUser.name || 'Aishik Roy');
  const [formCheckinCode, setFormCheckinCode] = useState('');
  const [formMaxCapacity, setFormMaxCapacity] = useState('60');
  const [formTags, setFormTags] = useState('Algorithms, ICPC, Hands-on');

  // Sync allowed emails on mount
  useEffect(() => {
    setAllowedEmailsList(getAllowedEmails());
    setClubSecurityKeyInput(getClubSecurityKey());

    fetch('/api/authorized-editors')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.authorized_editors)) {
          setAllowedEmailsList(
            Array.from(new Set([...getAllowedEmails(), ...data.authorized_editors])).map((e: string) => e.toLowerCase())
          );
        }
      })
      .catch(() => {});

    fetch('/api/otp/config-status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.configured) {
          setMcConfigured(true);
          if (data.customerId) {
            setAdminMcCustomerId(data.customerId);
          }
        }
      })
      .catch(() => {});

    fetch('/api/auth/google-config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientId && data.configured) {
          setAdminClientId(data.clientId);
        } else {
          setAdminClientId('');
        }
      })
      .catch(() => {});
  }, []);

  const triggerToast = (msg: string) => {
    setSecurityToast(msg);
    setTimeout(() => setSecurityToast(null), 3500);
  };

  // Handle Save Message Central Mobile Verification Key
  const handleSaveMcCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClick();
    if (!adminMcCustomerId.trim() && !adminMcKey.trim()) {
      triggerToast('Please provide Customer ID or Key.');
      return;
    }

    fetch('/api/otp/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: adminMcCustomerId.trim(),
        key: adminMcKey.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMcKeySaved(true);
          setMcConfigured(true);
          triggerToast('Mobile Verification Key successfully saved and active!');
          setTimeout(() => setMcKeySaved(false), 3000);
        }
      })
      .catch(() => {
        triggerToast('Failed to save mobile verification key.');
      });
  };

  // Open edit modal for an event
  const handleOpenEditEvent = (evt: ClubEvent) => {
    audioManager.playClick();
    setEditingEvent(evt);
    setIsCreatingNewEvent(false);

    setFormTitle(evt.title);
    setFormDesc(evt.description);
    setFormVertical(evt.vertical);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormDuration(evt.duration);
    setFormLocation(evt.location);
    setFormLocationType(evt.locationType);
    setFormHost(evt.host);
    setFormCheckinCode(evt.checkinCode);
    setFormMaxCapacity(evt.maxCapacity ? String(evt.maxCapacity) : '60');
    setFormTags(evt.tags ? evt.tags.join(', ') : '');
  };

  // Open create new event modal
  const handleOpenCreateEvent = () => {
    audioManager.playClick();
    setEditingEvent(null);
    setIsCreatingNewEvent(true);

    const today = new Date().toISOString().split('T')[0];
    setFormTitle('');
    setFormDesc('');
    setFormVertical('balgo');
    setFormDate(today);
    setFormTime('18:00 - 20:30 IST');
    setFormDuration('2.5 hrs');
    setFormLocation('Turing Lab 402, Bosscoder Campus');
    setFormLocationType('physical');
    setFormHost(currentUser.name || 'Aishik Roy');
    setFormCheckinCode(`LAB${Math.floor(100 + Math.random() * 900)}`);
    setFormMaxCapacity('60');
    setFormTags('Systems, Coding, Workshop');
  };

  // Save edited or created event
  const handleSaveEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClick();

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isCreatingNewEvent) {
      const newEvt: ClubEvent = {
        id: `evt-${Date.now()}`,
        title: formTitle.trim() || 'New Tech Club Session',
        description: formDesc.trim() || 'Technical session for Bosscoder tech club members.',
        vertical: formVertical,
        date: formDate || new Date().toISOString().split('T')[0],
        time: formTime || '18:00 IST',
        duration: formDuration || '2 hrs',
        location: formLocation || 'Lab 402, Campus',
        locationType: formLocationType,
        host: formHost || currentUser.name,
        attendeesCount: 0,
        maxCapacity: Number(formMaxCapacity) || 60,
        rsvpStatus: 'none',
        checkinCode: formCheckinCode.toUpperCase() || 'BSTACK26',
        tags: tagsArray.length > 0 ? tagsArray : ['Workshop'],
      };

      if (onCreateEvent) {
        onCreateEvent(newEvt);
      }
      setIsCreatingNewEvent(false);
      triggerToast(`Created upcoming event: "${newEvt.title}"`);
    } else if (editingEvent) {
      const updated: ClubEvent = {
        ...editingEvent,
        title: formTitle.trim(),
        description: formDesc.trim(),
        vertical: formVertical,
        date: formDate,
        time: formTime,
        duration: formDuration,
        location: formLocation,
        locationType: formLocationType,
        host: formHost,
        maxCapacity: Number(formMaxCapacity) || 60,
        checkinCode: formCheckinCode.toUpperCase(),
        tags: tagsArray,
      };

      if (onUpdateEvent) {
        onUpdateEvent(updated);
      }
      setEditingEvent(null);
      triggerToast(`Saved changes to "${updated.title}"!`);
    }
  };

  // Delete event
  const handleDeleteEventClick = (eventId: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the upcoming events schedule?`)) {
      audioManager.playClick();
      if (onDeleteEvent) {
        onDeleteEvent(eventId);
      }
      if (editingEvent?.id === eventId) {
        setEditingEvent(null);
      }
      triggerToast(`Removed "${title}" from upcoming events.`);
    }
  };

  // Handle single email addition
  const handleAddSingleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSingleEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      triggerToast('Please enter a valid email address.');
      return;
    }

    audioManager.playClick();
    addAllowedEmail(clean);
    setAllowedEmailsList(getAllowedEmails());
    setNewSingleEmail('');
    triggerToast(`Added "${clean}" to authorized Tech Club members!`);
  };

  // Handle bulk emails addition
  const handleBulkAddEmails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkEmailsInput.trim()) return;

    audioManager.playClick();
    const count = addAllowedEmailsBulk(bulkEmailsInput);
    setAllowedEmailsList(getAllowedEmails());
    setBulkEmailsInput('');
    setShowBulkInput(false);
    triggerToast(`Successfully authorized ${count} new Tech Club member emails!`);
  };

  // Handle email removal
  const handleRemoveEmail = (email: string) => {
    audioManager.playClick();
    if (['ziyadparkar01@gmail.com', 'aishik.roy1234@gmail.com', 'propriyansh71@gmail.com'].includes(email.toLowerCase())) {
      triggerToast('Cannot remove primary Club Administrator.');
      return;
    }

    removeAllowedEmail(email);
    setAllowedEmailsList(getAllowedEmails());
    triggerToast(`Removed "${email}" from authorized list.`);
  };

  // Handle update club security key
  const handleSaveSecurityKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = clubSecurityKeyInput.trim();
    if (!cleanKey) return;

    audioManager.playClick();
    setClubSecurityKey(cleanKey);
    triggerToast(`Club Security Key updated to "${cleanKey}"!`);
  };

  // Handle copy security key
  const handleCopySecurityKey = () => {
    audioManager.playClick();
    navigator.clipboard.writeText(clubSecurityKeyInput);
    setSecurityKeyCopied(true);
    setTimeout(() => setSecurityKeyCopied(false), 2000);
    triggerToast('Club Security Key copied to clipboard!');
  };

  // Handle send announcement
  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    audioManager.playClick();
    const newNotif: ClubNotification = {
      id: `admin-notif-${Date.now()}`,
      title: announcementTitle.trim(),
      message: announcementMsg.trim(),
      timestamp: 'Just now (Broadcasted by Admin)',
      read: false,
      type: announcementType,
    };

    onBroadcastNotification(newNotif);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setAnnouncementSent(true);
    setTimeout(() => setAnnouncementSent(false), 3000);
  };

  // Handle update check-in code
  const handleUpdateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !newCheckinCode.trim()) return;

    audioManager.playClick();
    onUpdateEventCode(selectedEventId, newCheckinCode.trim().toUpperCase());
    setCodeUpdatedToast(true);
    setTimeout(() => setCodeUpdatedToast(false), 3000);
  };

  // Handle save OAuth Client ID
  const handleSaveOAuthClientId = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClick();
    const trimmed = adminClientId.trim();
    setStoredGoogleClientId(trimmed);
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 3000);

    fetch('/api/auth/google-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: trimmed }),
    }).catch(() => {});
  };

  // Handle clear OAuth Client ID
  const handleClearOAuthClientId = () => {
    audioManager.playClick();
    setAdminClientId('');
    setStoredGoogleClientId('');
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 3000);

    fetch('/api/auth/google-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: '' }),
    }).catch(() => {});
    triggerToast('Google OAuth Client ID cleared successfully.');
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://...run.app';

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
    evt.description.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
    evt.location.toLowerCase().includes(eventSearchQuery.toLowerCase())
  );

  const filteredWhitelist = allowedEmailsList.filter((e) =>
    e.toLowerCase().includes(whitelistSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Club Operations Header Banner - Equality for all members */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#091124] to-[#060c1c] border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLUB OPERATIONS // ALL MEMBERS EQUAL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight uppercase">
              Club Operations &amp; Events Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Logged in as <strong className="text-white font-mono">{currentUser.name}</strong> ({currentUser.email}).
              Every member has equal access to collaborate, schedule club events, manage check-in codes, update roster keys, and broadcast announcements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <span className="text-slate-500 block text-[10px]">UPCOMING SESSIONS</span>
              <span className="text-cyan-400 font-bold">{events.length} Scheduled</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <span className="text-slate-500 block text-[10px]">COLLABORATION</span>
              <span className="text-emerald-400 font-bold">ALL MEMBERS</span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10 text-xs font-mono">
          {[
            { id: 'events-editor', label: 'Edit & Schedule Events', icon: Calendar, highlight: true },
            { id: 'attendance', label: 'Attendance & Lab PINs', icon: QrCode },
            { id: 'announcements', label: 'Broadcast Announcements', icon: Bell },
            { id: 'oauth', label: 'OAuth & Mobile SMS Settings', icon: KeyRound },
            { id: 'access-control', label: 'Club Security Key & Whitelist', icon: ShieldCheck },
            { id: 'overview', label: 'Operations Overview', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioManager.playClick();
                  setActiveAdminSubTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow font-semibold'
                    : (tab as any).highlight
                    ? 'bg-cyan-500/10 text-cyan-300/80 hover:text-cyan-200 border border-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast notification banner */}
      {securityToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{securityToast}</span>
        </div>
      )}

      {/* View 1: Edit Upcoming Events (Primary Requested Feature) */}
      {activeAdminSubTab === 'events-editor' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
            <div>
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Upcoming Club Events &amp; Workshops</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Edit session schedules, venue details, and check-in passcodes for student engineers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search filter */}
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Filter events..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Add New Event Button */}
              <button
                type="button"
                onClick={handleOpenCreateEvent}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* Events List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 uppercase font-bold">
                      {evt.vertical === 'all' ? 'All Verticals' : evt.vertical.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      PIN: {evt.checkinCode}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-white leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.location} ({evt.locationType})</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-[11px] font-mono text-slate-400">
                    Host: <strong className="text-white">{evt.host}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditEvent(evt)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEventClick(evt.id, evt.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-slate-400">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">No events match your search query.</p>
            </div>
          )}

          {/* Modal / Inline Editor for Upcoming Event */}
          {(editingEvent || isCreatingNewEvent) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="relative w-full max-w-xl bg-[#0e121d] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setIsCreatingNewEvent(false);
                  }}
                  className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{isCreatingNewEvent ? 'Create Upcoming Event' : `Edit "${editingEvent?.title}"`}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure dates, locations, verticals, and check-in codes.
                  </p>
                </div>

                <form onSubmit={handleSaveEventSubmit} className="space-y-3.5 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      placeholder="e.g. ICPC Asia-West Regional BootCamp"
                      className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      required
                      placeholder="Detailed session agenda and prerequisites..."
                      className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white font-sans text-xs focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Time</label>
                      <input
                        type="text"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        required
                        placeholder="18:00 - 20:30 IST"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        required
                        placeholder="Turing Lab 402, Campus"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Location Type</label>
                      <select
                        value={formLocationType}
                        onChange={(e) => setFormLocationType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="physical">Physical Lab</option>
                        <option value="virtual">Virtual / Discord</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Vertical Track</label>
                      <select
                        value={formVertical}
                        onChange={(e) => setFormVertical(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="all">All Squads</option>
                        <option value="balgo">B/ALGO</option>
                        <option value="beuild">Be/UILD</option>
                        <option value="bhack">B/Hack</option>
                        <option value="bdev">B/DEV</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Check-in PIN</label>
                      <input
                        type="text"
                        value={formCheckinCode}
                        onChange={(e) => setFormCheckinCode(e.target.value.toUpperCase())}
                        required
                        placeholder="BSTACK26"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-amber-500/40 text-amber-300 uppercase font-bold text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Max Capacity</label>
                      <input
                        type="number"
                        value={formMaxCapacity}
                        onChange={(e) => setFormMaxCapacity(e.target.value)}
                        placeholder="60"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Host &amp; Session Tags</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formHost}
                        onChange={(e) => setFormHost(e.target.value)}
                        placeholder="Host name (e.g. Aishik Roy)"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Tags (comma-separated)"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvent(null);
                        setIsCreatingNewEvent(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isCreatingNewEvent ? 'Create Event' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 2: Console Overview */}
      {activeAdminSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Admin Stat 1: Whitelist */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>AUTHORIZED TECH CLUB USERS</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-heading font-black text-white">
              {allowedEmailsList.length}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Only these approved emails or Security Key holders can login
            </p>
          </div>

          {/* Admin Stat 2: Security Key */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>ACTIVE SECURITY KEY</span>
              <Key className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-heading font-mono font-bold text-amber-300 truncate">
              {clubSecurityKeyInput}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Passcode for new members to self-authorize entry
            </p>
          </div>

          {/* Admin Stat 3: Scheduled Labs */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SCHEDULED LAB SESSIONS</span>
              <QrCode className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-heading font-black text-cyan-300">
              {events.length}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Live check-in PINs ready for attendance verification
            </p>
          </div>

          {/* Whitelist Quick Action Card */}
          <div className="md:col-span-3 p-6 rounded-2xl bg-[#0e1322] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-300 font-heading font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Tech Club Member Access Control Active</span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                You can manage exactly which users and email addresses are allowed to log in via the <strong>Access Whitelist &amp; Security Key</strong> tab. You can paste lists of emails anytime to instantly grant access.
              </p>
            </div>
            <button
              onClick={() => {
                audioManager.playClick();
                setActiveAdminSubTab('access-control');
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition-colors cursor-pointer shrink-0"
            >
              Manage Allowed Emails &rarr;
            </button>
          </div>
        </div>
      )}

      {/* View 3: Access Whitelist & Security Key Management */}
      {activeAdminSubTab === 'access-control' && (
        <div className="space-y-6">
          {/* Top Grid: Security Key Config + Add Email */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Box 1: Club Security Key Controller */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Club Security Key</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecurityKey}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/50 cursor-pointer"
                >
                  {securityKeyCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{securityKeyCopied ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This is the private passcode shared with verified Tech Club members. If a user tries to register or log in with an email not yet in the whitelist below, entering this Security Key will verify them and authorize their account.
              </p>

              <form onSubmit={handleSaveSecurityKey} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Active Security Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clubSecurityKeyInput}
                      onChange={(e) => setClubSecurityKeyInput(e.target.value.toUpperCase())}
                      placeholder="e.g. BSTACK-SECURE-2026"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-[#06080e] border border-amber-500/40 text-amber-300 uppercase font-bold focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const randomKey = `BSTACK-${Math.floor(1000 + Math.random() * 9000)}`;
                        setClubSecurityKeyInput(randomKey);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Save Security Key
                </button>
              </form>
            </div>

            {/* Box 2: Add Authorized Email(s) */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>Authorize Member Email</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkInput(!showBulkInput)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  {showBulkInput ? 'Single Email Form' : 'Bulk Paste Emails'}
                </button>
              </div>

              {!showBulkInput ? (
                /* Single Email Add */
                <form onSubmit={handleAddSingleEmail} className="space-y-3 font-mono text-xs">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Pre-approve a member by email so they can log in immediately via Google or create an account without needing the Security Key.
                  </p>
                  <div>
                    <label className="block text-slate-400 mb-1">Member Email Address</label>
                    <input
                      type="email"
                      value={newSingleEmail}
                      onChange={(e) => setNewSingleEmail(e.target.value)}
                      placeholder="e.g. member@bosscoder.ac.in"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#06080e] border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Authorize This Email</span>
                  </button>
                </form>
              ) : (
                /* Bulk Email Add */
                <form onSubmit={handleBulkAddEmails} className="space-y-3 font-mono text-xs">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Paste a list of email addresses below (separated by commas, spaces, or newlines) to authorize them all at once:
                  </p>
                  <textarea
                    rows={4}
                    value={bulkEmailsInput}
                    onChange={(e) => setBulkEmailsInput(e.target.value)}
                    placeholder="student1@bosscoder.ac.in&#10;student2@gmail.com&#10;student3@bosscoder.ac.in"
                    className="w-full px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize All Pasted Emails</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Whitelisted Roster Table */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Authorized Tech Club Members Roster ({allowedEmailsList.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only users with these email addresses are permitted to log in or register.
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={whitelistSearch}
                  onChange={(e) => setWhitelistSearch(e.target.value)}
                  placeholder="Search allowed emails..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredWhitelist.map((email) => {
                const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
                return (
                  <div
                    key={email}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 flex items-center justify-between gap-2 group transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-medium text-slate-200 truncate block">
                          {email}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                        isAdmin
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                          : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/30'
                      }`}>
                        {isAdmin ? '👑 Guild Admin / Lead' : '✓ Tech Club Member'}
                      </span>
                    </div>

                    {!isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0 opacity-70 group-hover:opacity-100"
                        title="Remove member from whitelist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* View 4: Attendance & Check-in PIN Management */}
      {activeAdminSubTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Update Live Lab Check-in Code</span>
            </div>
            <p className="text-xs text-slate-400">
              Set or regenerate the daily verification PIN that student members must enter to record their lab attendance.
            </p>

            {codeUpdatedToast && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verification code updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdateCode} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1.5">Select Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#06070a] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.date} - PIN: {evt.checkinCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5">New 4-8 Char Passcode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCheckinCode}
                    onChange={(e) => setNewCheckinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BSTACK26 or LAB402"
                    required
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#06070a] border border-white/10 text-white uppercase focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const randomCode = `LAB${Math.floor(100 + Math.random() * 900)}`;
                      setNewCheckinCode(randomCode);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
                  >
                    Random
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                Apply New Check-in Code
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-heading font-bold text-sm">
                Active Verification PINs
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {events.length} Sessions
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <h5 className="text-xs font-bold text-white truncate">{evt.title}</h5>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {evt.date} • {evt.time}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">CODE</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {evt.checkinCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 5: Broadcast Announcements */}
      {activeAdminSubTab === 'announcements' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Broadcast Club Notification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch an instant alert to all registered student engineers and core members.
            </p>
          </div>

          {announcementSent && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Announcement dispatched club-wide!</span>
            </div>
          )}

          <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1.5">Notification Title</label>
              <input
                type="text"
                placeholder="e.g. ICPC Regional BootCamp Announced"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#06070a] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5">Announcement Content</label>
              <textarea
                placeholder="Write the message to be received by all members..."
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl bg-[#06070a] border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'announcement', label: 'Announcement' },
                  { id: 'event', label: 'Event Notice' },
                  { id: 'achievement', label: 'Award / Perk' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setAnnouncementType(cat.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      announcementType === cat.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-[#06070a] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Now to All Members</span>
            </button>
          </form>
        </div>
      )}

      {/* View 6: Google OAuth & Security Settings */}
      {activeAdminSubTab === 'oauth' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <KeyRound className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Google OAuth 2.0 Web Client Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Direct Google Sign-In connects users directly to Google's official accounts site.
                </p>
              </div>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              adminClientId && adminClientId.includes('.apps.googleusercontent.com')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {adminClientId && adminClientId.includes('.apps.googleusercontent.com') ? 'Key Configured' : 'Awaiting New Key'}
            </span>
          </div>

          {clientIdSaved && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google OAuth Client ID settings updated and active across the guild!</span>
            </div>
          )}

          <form onSubmit={handleSaveOAuthClientId} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1.5">Google OAuth Client ID</label>
              <input
                type="text"
                value={adminClientId}
                onChange={(e) => setAdminClientId(e.target.value)}
                placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
                className="w-full px-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Obtained from Google Cloud Console &rarr; APIs &amp; Services &rarr; Credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
              <div className="text-[11px] text-slate-300 font-bold">Authorized Redirect URIs</div>
              <p className="text-[11px] text-slate-400">
                Make sure to add this URL to Authorized JavaScript Origins and Authorized Redirect URIs in your Google Cloud Console:
              </p>
              <div className="p-2 rounded-lg bg-black/60 border border-white/10 text-cyan-300 text-[11px] font-mono break-all select-all">
                {currentOrigin}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                Save Google OAuth Client ID
              </button>
              {adminClientId && (
                <button
                  type="button"
                  onClick={handleClearOAuthClientId}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold transition-colors cursor-pointer"
                >
                  Clear Key
                </button>
              )}
            </div>
          </form>

          {/* Section 2: Message Central Mobile Verification Key */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Key className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Message Central Mobile Verification Key
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real mobile SMS delivery gateway for 2-factor OTP verification.
                  </p>
                </div>
              </div>

              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                mcConfigured
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}>
                {mcConfigured ? 'LIVE GATEWAY ACTIVE' : 'TEST/FALLBACK MODE'}
              </span>
            </div>

            {mcKeySaved && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Message Central Mobile Verification Key saved and active!</span>
              </div>
            )}

            <form onSubmit={handleSaveMcCredentials} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1.5">Customer ID</label>
                  <input
                    type="text"
                    value={adminMcCustomerId}
                    onChange={(e) => setAdminMcCustomerId(e.target.value)}
                    placeholder="e.g. C-XXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5">CPaaS Key / Auth Token</label>
                  <input
                    type="password"
                    value={adminMcKey}
                    onChange={(e) => setAdminMcKey(e.target.value)}
                    placeholder="API Password or Token"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                Save Mobile Verification Key
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
