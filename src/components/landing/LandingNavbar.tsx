import React, { useState } from 'react';
import { ArrowUpRight, LogIn, Menu, X, Users, LogOut, Sparkles } from 'lucide-react';
import { BStackLogo } from '../common/BStackLogo';
import { audioManager } from '../../utils/audio';
import { User } from '../../types';

interface LandingNavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onGoogleLogin?: () => void;
  onEnterDashboard: () => void;
  isAuthenticated: boolean;
  currentUser?: User | null;
  onLogout?: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onOpenDeployGuide?: () => void;
  onReplayWelcome?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAuth,
  onGoogleLogin,
  onEnterDashboard,
  isAuthenticated,
  currentUser,
  onLogout,
  activeSection,
  onNavigateSection,
  onOpenDeployGuide,
  onReplayWelcome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      setScrollRotation((window.scrollY * 0.28) % 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Exactly the 4 horizontal sections requested by user:
  const navLinks = [
    { id: 'events', label: 'Events' },
    { id: 'verticals', label: 'Verticals' },
    { id: 'leadership', label: 'Tech Club Head' },
    { id: 'members', label: 'Members Directory' },
  ];

  const handleNav = (id: string) => {
    audioManager.playClick();
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-10 py-3 sm:py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Minimalist Brand Wordmark */}
        <button
          onClick={() => handleNav('hero')}
          className="liquid-glass liquid-glass-hover px-3 sm:px-4 py-2 rounded-full flex items-center gap-2.5 group cursor-pointer border border-white/10 hover:border-cyan-400/30 backdrop-blur-2xl transition-all shrink-0"
          title="B/Stack - Tech Club of Bosscoder School of Technology"
        >
          <div
            className="flex items-center justify-center will-change-transform"
            style={{ transform: `rotate(${scrollRotation}deg)` }}
          >
            <BStackLogo className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-body text-sm font-bold tracking-wider text-white group-hover:text-cyan-200 transition-colors">
            B<span className="text-cyan-400">/</span>Stack
          </span>
        </button>

        {/* Zone 2: Professional Minimalist Horizontal Nav Links (Desktop / Tablet) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 px-5 py-2 rounded-full liquid-glass border border-white/10 backdrop-blur-2xl shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`relative py-1 text-xs sm:text-[13px] font-body transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white font-normal'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Authentication Actions & Switch Account */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onReplayWelcome && (
            <button
              onClick={() => {
                audioManager.playClick();
                onReplayWelcome();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-full liquid-glass border border-white/10 hover:border-cyan-400/40 text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              title="Replay B/Stack 60 FPS Welcome Intro"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline text-[11px] font-mono">Intro</span>
            </button>
          )}

          {isAuthenticated ? (
            <>
              {/* Switch Account */}
              <button
                onClick={() => {
                  audioManager.playClick();
                  onOpenAuth('signin');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full liquid-glass border border-white/10 hover:border-cyan-400/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="Switch Account / Sign In with another email"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Switch Account</span>
              </button>

              {/* User Avatar Chip */}
              {currentUser && (
                <div
                  onClick={() => {
                    audioManager.playClick();
                    onEnterDashboard();
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full liquid-glass border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all"
                  title={`Logged in as ${currentUser.name} (${currentUser.email})`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover object-top border border-cyan-400/40"
                  />
                  <span className="text-xs font-semibold text-white max-w-[95px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              )}

              {/* Enter Dashboard */}
              <button
                onClick={() => {
                  audioManager.playClick();
                  onEnterDashboard();
                }}
                className="rounded-full bg-white hover:bg-neutral-100 text-neutral-950 px-3.5 sm:px-4.5 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-body font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-950 shrink-0 stroke-[2.2]" />
              </button>
            </>
          ) : (
            <>
              {/* EXACT WHITE BACKGROUND SIGN IN PILL */}
              <button
                onClick={() => {
                  audioManager.playClick();
                  onOpenAuth('signin');
                }}
                className="rounded-full bg-white hover:bg-neutral-100 text-neutral-950 px-3.5 sm:px-4.5 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-body font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                title="Sign In to B/Stack"
              >
                <LogIn className="w-3.5 h-3.5 text-neutral-950 shrink-0 stroke-[2.2]" />
                <span>Sign In</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-950 shrink-0 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => {
              audioManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full liquid-glass border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-cyan-400" />
            ) : (
              <Menu className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mx-auto max-w-sm liquid-glass rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-body transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-200 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setMobileMenuOpen(false);
                      onEnterDashboard();
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-white text-neutral-950 font-body font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                  >
                    <span>Enter Dashboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-950" />
                  </button>

                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-body font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Account / Sign In Other</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        audioManager.playClick();
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2 px-4 rounded-full bg-rose-950/30 border border-rose-800/30 text-rose-300 font-body text-xs flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-white text-neutral-950 font-body font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-neutral-950" />
                    <span>Sign In</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-950" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
