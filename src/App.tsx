/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ClubEvent, ClubProject, AttendanceRecord, ClubNotification, VerticalType } from './types';
import {
  INITIAL_USER,
  CLUB_EVENTS,
  CLUB_PROJECTS,
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

// 3D Aurora Wave Scene
import { HeroScene } from './components/3d/HeroScene';

// Landing Page Sections (Pulsewave & Liquid Glass style)
import { LandingNavbar } from './components/landing/LandingNavbar';
import { HeroSection } from './components/landing/HeroSection';
import { MarqueeBanner } from './components/landing/MarqueeBanner';
import { LeadershipSection } from './components/landing/LeadershipSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { EventsPreviewSection } from './components/landing/EventsPreviewSection';
import { LandingFooter } from './components/landing/LandingFooter';
import { MembersDirectoryPage } from './components/members/MembersDirectoryPage';
import { WelcomeLoadingOverlay } from './components/landing/WelcomeLoadingOverlay';

// Auth Modal & Security Modals
import { AuthModal } from './components/auth/AuthModal';
import { UnauthorizedAccessModal } from './components/modals/UnauthorizedAccessModal';
import { DeployGuideModal } from './components/modals/DeployGuideModal';

// Member Dashboard (Focused Upcoming Events Editor)
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { UpcomingEventsEditor } from './components/dashboard/UpcomingEventsEditor';

import {
  getSavedSessionUser,
  saveSessionUser,
  parseGoogleOAuthHash,
  processGoogleUserProfile,
  isAuthorizedEditor,
  syncAllowedEmailsFromServer,
  verifyEmailAuthorization,
} from './utils/authStorage';
import {
  getStoredEvents,
  saveStoredEvents,
  syncEventsFromServer,
  subscribeToEvents,
  createCloudEvent,
  updateCloudEvent,
  deleteCloudEvent,
  resetCloudEvents,
} from './utils/eventStorage';


export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'members' | 'dashboard'>('landing');
  const [activeSection, setActiveSection] = useState('hero');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Welcome Loading Page Effect (Teamwork Graph 60 FPS effect)
  const [showWelcomeLoader, setShowWelcomeLoader] = useState(true);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalMethod, setAuthModalMethod] = useState<'google' | 'phone'>('google');


  // Core Data State (persisted with versioned storage, cross-tab sync, & server fallback)
  const [events, setEvents] = useState<ClubEvent[]>(getStoredEvents);
  const [projects, setProjects] = useState<ClubProject[]>(CLUB_PROJECTS);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_HISTORY);
  const [notifications, setNotifications] = useState<ClubNotification[]>(INITIAL_NOTIFICATIONS);

  // Modal State
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInEvent, setCheckInEvent] = useState<ClubEvent | null>(null);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  // Security & Deploy Modals
  const [unauthorizedModalOpen, setUnauthorizedModalOpen] = useState(false);
  const [unauthorizedAttemptEmail, setUnauthorizedAttemptEmail] = useState('');
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);

  // Sync events across tabs & from server database on mount
  useEffect(() => {
    // 1. Subscribe to instant cross-tab / cross-window updates
    const unsubscribe = subscribeToEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });

    // 2. Sync allowed emails & events from backend if available
    syncAllowedEmailsFromServer().catch(() => {});
    syncEventsFromServer().then((serverEvents) => {
      if (serverEvents && serverEvents.length > 0) {
        setEvents(serverEvents);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Check for saved session or incoming Google OAuth callback on mount
  useEffect(() => {
    // 1. Check for Google OAuth redirect callback in URL hash
    const { accessToken } = parseGoogleOAuthHash();
    if (accessToken) {
      window.history.replaceState(null, '', window.location.pathname);
      sessionStorage.removeItem('bstack_google_oauth_in_progress');

      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then(async (profile) => {
          if (profile && profile.email) {
            await verifyEmailAuthorization(profile.email);
            const result = processGoogleUserProfile(profile);
            if (result.success && result.user) {
              setCurrentUser(result.user);
              setIsAuthenticated(true);
              setCurrentView('dashboard');
            } else {
              setUnauthorizedAttemptEmail(profile.email);
              setUnauthorizedModalOpen(true);
            }
          }
        })
        .catch((err) => {
          console.error('Failed to fetch Google profile with token:', err);
        });
      return;
    }

    // 2. Check for active saved session
    const saved = getSavedSessionUser();
    if (saved) {
      if (isAuthorizedEditor(saved.email)) {
        setCurrentUser(saved);
        setIsAuthenticated(true);
      } else {
        saveSessionUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Scroll listener to update 3D scene state according to landing page section
  useEffect(() => {
    if (currentView !== 'landing') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Section ranges matching the shifted layout
      if (scrollY < vh * 0.7) {
        setActiveSection('hero');
        setActiveSectionIndex(0); // Monolith floating
      } else if (scrollY < vh * 1.8) {
        setActiveSection('events');
        setActiveSectionIndex(1); // Singularity vortex
      } else if (scrollY < vh * 3.0) {
        setActiveSection('verticals');
        setActiveSectionIndex(2); // Energy field
      } else {
        setActiveSection('leadership');
        setActiveSectionIndex(3); // 3D Delta Prism B/Stack emblem
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Open dedicated Members Directory webpage
  const handleOpenMembersDirectory = () => {
    setCurrentView('members');
    if (window.location.pathname !== '/members') {
      window.history.pushState(null, '', '/members');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Main Website
  const handleBackToHome = () => {
    setCurrentView('landing');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync route with URL on mount & browser back/forward buttons
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/members' || hash === '#/members' || hash === '#members') {
        setCurrentView('members');
      } else if (path === '/' || path === '') {
        if (currentView === 'members') {
          setCurrentView('landing');
        }
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [currentView]);

  // Navigate to landing anchor or dedicated webpage
  const handleNavigateSection = (sectionId: string) => {
    // When clicking Members Directory, immediately shift to the dedicated webpage of members
    if (sectionId === 'members') {
      handleOpenMembersDirectory();
      return;
    }

    if (currentView !== 'landing') {
      setCurrentView('landing');
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auth Handlers
  const handleOpenAuth = (mode: 'signin' | 'signup', method: 'google' | 'phone' = 'google') => {
    setAuthModalMode(mode);
    setAuthModalMethod(method);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = async (user: User) => {
    saveSessionUser(user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    const authorized = isAuthorizedEditor(user.email) || (await verifyEmailAuthorization(user.email));
    if (authorized) {
      setCurrentView('dashboard');
    } else {
      setUnauthorizedAttemptEmail(user.email);
      setUnauthorizedModalOpen(true);
    }
  };

  // Guarded dashboard navigation - strictly permits authorized emails only
  const handleEnterDashboard = async () => {
    if (!isAuthenticated || !currentUser) {
      handleOpenAuth('signin', 'google');
      return;
    }

    const authorized = isAuthorizedEditor(currentUser.email) || (await verifyEmailAuthorization(currentUser.email));
    if (!authorized) {
      setUnauthorizedAttemptEmail(currentUser.email);
      setUnauthorizedModalOpen(true);
      return;
    }

    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    saveSessionUser(null);
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  // Event CRUD operations persisted across tabs, localStorage, server database, and Firestore Cloud
  const handleCreateEvent = async (newEvent: ClubEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    await createCloudEvent(newEvent);
  };

  const handleUpdateEvent = async (updatedEvent: ClubEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    await updateCloudEvent(updatedEvent);
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    await deleteCloudEvent(eventId);
  };

  const handleResetEvents = async () => {
    const defaultEvents = await resetCloudEvents();
    setEvents(defaultEvents);
  };

  // Admin broadcast notification handler
  const handleBroadcastNotification = (notification: ClubNotification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // Admin update check-in code handler
  const handleUpdateEventCode = (eventId: string, newCode: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, checkinCode: newCode } : e))
    );
    fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkinCode: newCode }),
    }).catch(() => {});
  };

  // Check-in Verification
  const handleVerifyAttendance = (eventId: string, eventTitle: string, xpEarned: number) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      eventId,
      eventTitle,
      eventDate: new Date().toISOString().split('T')[0],
      vertical: currentUser.vertical,
      status: 'present',
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      xpEarned,
    };

    setAttendanceHistory((prev) => [newRecord, ...prev]);

    // Update user stats
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      attendanceRate: Math.min(100, prev.attendanceRate + 1),
    }));

    // Update event attendanceVerified flag
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, attendanceVerified: true } : e))
    );

    // Add notification
    const newNotif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'Lab Attendance Verified',
      message: `Checked into "${eventTitle}". +${xpEarned} XP awarded!`,
      timestamp: 'Just now',
      read: false,
      type: 'achievement',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // RSVP update handler
  const handleUpdateRSVP = (eventId: string, status: 'attending' | 'maybe' | 'none') => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const delta = status === 'attending' && e.rsvpStatus !== 'attending' ? 1 :
                        status !== 'attending' && e.rsvpStatus === 'attending' ? -1 : 0;
          return {
            ...e,
            rsvpStatus: status,
            attendeesCount: Math.max(0, e.attendeesCount + delta),
          };
        }
        return e;
      })
    );
  };

  // Add new project handler
  const handleCreateProject = (newProject: ClubProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      projectsCount: prev.projectsCount + 1,
      xp: prev.xp + 250,
    }));

    const newNotif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'Repository Registered',
      message: `"${newProject.title}" has been registered into the incubator. +250 XP awarded!`,
      timestamp: 'Just now',
      read: false,
      type: 'project',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100">
      {/* View 1: Liquid Glass Pulsewave Landing Page */}
      {currentView === 'landing' ? (
        <div className="relative overflow-x-hidden bg-[#030305]">
          {/* Smooth Aurora Fluid Wave in background */}
          <HeroScene />

          {/* Floating Pill Top Navigation */}
          <LandingNavbar
            onOpenAuth={handleOpenAuth}
            onGoogleLogin={() => handleOpenAuth('signin', 'google')}
            onEnterDashboard={handleEnterDashboard}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
            activeSection={activeSection}
            onNavigateSection={handleNavigateSection}
            onReplayWelcome={() => setShowWelcomeLoader(true)}
          />

          {/* Landing Content Sections */}
          <main className="relative z-10">
            {/* 1. Hero Section ("The Tech Club / where the centre of innovation") */}
            <HeroSection
              onExploreClick={() => handleNavigateSection('events')}
              onOpenAuth={handleOpenAuth}
              onReplayWelcome={() => setShowWelcomeLoader(true)}
            />

            {/* Infinite Marquee Banner */}
            <MarqueeBanner />

            {/* 2. Upcoming Events Section (replacing projects section) */}
            <EventsPreviewSection
              onOpenAuth={handleOpenAuth}
              onEnterCalendar={handleEnterDashboard}
              isAuthenticated={isAuthenticated}
              events={events}
            />

            {/* 3. Club Verticals */}
            <ServicesSection />

            {/* 4. Tech Club Head - Aishik Roy */}
            <LeadershipSection onOpenMembersDirectory={handleOpenMembersDirectory} />
          </main>

          {/* Landing Footer (00:17 - 00:19 in video) */}
          <LandingFooter
            onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onOpenAuth={handleOpenAuth}
            onEnterDashboard={handleEnterDashboard}
          />
        </div>
      ) : currentView === 'members' ? (
        /* View 2: Dedicated Webpage for Members Directory */
        <MembersDirectoryPage
          onBackToHome={handleBackToHome}
          onOpenAuth={handleOpenAuth}
          onEnterDashboard={handleEnterDashboard}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        /* View 3: Focused Upcoming Events Editor Dashboard */
        <DashboardLayout
          user={currentUser}
          onExitToLanding={() => setCurrentView('landing')}
          onLogout={handleLogout}
          onSwitchAccount={() => handleOpenAuth('signin', 'google')}
          onOpenDeployGuide={() => setDeployGuideOpen(true)}
        >
          <UpcomingEventsEditor
            user={currentUser}
            events={events}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onResetEvents={handleResetEvents}
            onViewWebsite={() => {
              setCurrentView('landing');
              setTimeout(() => {
                const el = document.getElementById('events');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 120);
            }}
          />
        </DashboardLayout>
      )}


      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        initialMethod={authModalMethod}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Unauthorized 403 Forbidden Access Screen */}
      <UnauthorizedAccessModal
        isOpen={unauthorizedModalOpen}
        attemptedEmail={unauthorizedAttemptEmail}
        onClose={() => setUnauthorizedModalOpen(false)}
        onSwitchAccount={() => {
          setUnauthorizedModalOpen(false);
          handleOpenAuth('signin', 'google');
        }}
        onReturnHome={() => {
          setUnauthorizedModalOpen(false);
          setCurrentView('landing');
        }}
      />

      {/* GitHub & Vercel Deployment Pipeline Guide Modal */}
      <DeployGuideModal
        isOpen={deployGuideOpen}
        onClose={() => setDeployGuideOpen(false)}
      />

      {/* Teamwork Graph 60 FPS Welcome Loading Page Overlay */}
      <WelcomeLoadingOverlay
        isOpen={showWelcomeLoader}
        onComplete={() => setShowWelcomeLoader(false)}
        onSkip={() => setShowWelcomeLoader(false)}
      />
    </div>
  );
}
