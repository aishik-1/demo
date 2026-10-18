import React from 'react';
import { User } from '../../types';
import {
  Calendar,
  LogOut,
  Users,
  ExternalLink,
  ShieldCheck,
  Radio,
  ArrowUpRight,
  Github,
} from 'lucide-react';
import { audioManager } from '../../utils/audio';
import { BStackLogo } from '../common/BStackLogo';

export type DashboardTab = 'events';

interface DashboardLayoutProps {
  user: User;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  onExitToLanding: () => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onOpenDeployGuide?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onExitToLanding,
  onLogout,
  onSwitchAccount,
  onOpenDeployGuide,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased">
      {/* Sleek Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#050a18]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Dashboard Purpose */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={() => {
              audioManager.playClick();
              onExitToLanding();
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Return to B/Stack Homepage"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 transition-colors p-1">
              <BStackLogo className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <span className="font-heading font-black tracking-widest text-sm text-white group-hover:text-cyan-300 transition-colors">
                B/STACK
              </span>
              <p className="text-[10px] font-mono text-cyan-400 tracking-wider hidden sm:block">
                EVENTS EDITOR PORTAL
              </p>
            </div>
          </button>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* Active Mode Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Front-Page Upcoming Events Editor</span>
          </div>
        </div>

        {/* Right: User Status, Website Link, Switch Account & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* GitHub & Vercel Deploy Guide */}
          {onOpenDeployGuide && (
            <button
              onClick={() => {
                audioManager.playClick();
                onOpenDeployGuide();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Push to GitHub & Deploy to Vercel"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Push to GitHub / Vercel</span>
              <span className="sm:hidden">Deploy</span>
            </button>
          )}

          {/* View Website (Front Page) */}
          <button
            onClick={() => {
              audioManager.playClick();
              onExitToLanding();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="View Live Front Page"
          >
            <span className="hidden sm:inline">View Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Switch Account */}
          <button
            onClick={() => {
              audioManager.playClick();
              onSwitchAccount();
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Switch Account / Sign In with another email"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Switch Account</span>
          </button>

          {/* User Avatar Chip */}
          <div
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10"
            title={`Logged in as ${user.name} (${user.email})`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover object-top border border-cyan-400/40"
            />
            <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => {
              audioManager.playClick();
              onLogout();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Events Editor View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 md:p-10">
        {children}
      </main>
    </div>
  );
};
