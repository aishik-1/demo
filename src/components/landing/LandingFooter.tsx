import React from 'react';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Instagram, Code2 } from 'lucide-react';
import { audioManager } from '../../utils/audio';
import { BStackLogo } from '../common/BStackLogo';

interface LandingFooterProps {
  onScrollToTop: () => void;
  onOpenAuth: (mode: 'signup' | 'signin') => void;
  onEnterDashboard: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onScrollToTop,
  onOpenAuth,
  onEnterDashboard,
}) => {
  return (
    <footer id="contact" className="relative border-t border-white/[0.08] pt-12 sm:pt-16 pb-10 sm:pb-12 px-6 sm:px-12 max-w-7xl mx-auto z-10">
      {/* 1. Big Contact Header (Exact match to 00:17 in video) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 sm:pb-12 border-b border-white/[0.08]">
        <div className="space-y-3">
          <p className="text-xs font-body tracking-[0.25em] uppercase text-cyan-400 font-semibold">
            GET IN TOUCH // BOSSCODER SCHOOL OF TECHNOLOGY
          </p>
          <a
            href="mailto:hello@bstack.tech"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-normal text-white hover:text-cyan-300 transition-colors tracking-tight block"
          >
            hello@bstack.tech
          </a>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onOpenAuth('signup');
          }}
          className="liquid-pill liquid-pill-hover px-8 py-4 rounded-full text-xs font-body font-semibold tracking-wider text-white transition-all flex items-center gap-2 self-start md:self-center cursor-pointer"
        >
          <span>Join Guild</span>
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* 2. Four Column Information Grid (Exact match to 00:18 in video) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 py-10 sm:py-12 text-xs font-body">
        {/* Brand & Subtitle */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <BStackLogo className="w-6 h-6 text-white" />
            <h4 className="text-2xl font-editorial text-white tracking-wide">b/stack</h4>
          </div>
          <p className="text-sm font-editorial italic text-slate-400">
            Tech club of Bosscoder School of Technology.
          </p>
          <div className="pt-2">
            <span className="text-xs text-slate-300 font-body block font-medium">
              Tech Club Head — Aishik Roy
            </span>
            <span className="text-[11px] text-slate-500 font-body block mt-0.5">
              Leading student engineers across algorithms, hardware, and systems.
            </span>
          </div>
        </div>

        {/* Location & Organization */}
        <div className="space-y-3">
          <span className="text-slate-500 uppercase tracking-wider text-[11px] block font-semibold">
            Organization
          </span>
          <p className="text-slate-300 leading-relaxed font-light">
            Tech club of <br />
            <strong className="text-white font-normal">Bosscoder School of Technology</strong>
          </p>
          <p className="text-slate-500 text-[11px]">
            Lab 402, Engineering Center
          </p>
        </div>

        {/* Guild Tracks (Verticals) */}
        <div className="space-y-2.5">
          <span className="text-slate-500 uppercase tracking-wider text-[11px] block font-semibold">
            Club Verticals
          </span>
          <p className="text-slate-300 font-mono text-xs">
            <strong className="text-white">B/ALGO</strong> — Competitive programming
          </p>
          <p className="text-slate-300 font-mono text-xs">
            <strong className="text-white">Be/UILD</strong> — Robotics and Hardwar
          </p>
          <p className="text-slate-300 font-mono text-xs">
            <strong className="text-white">B/Hack</strong> — Hackathon and etc
          </p>
          <p className="text-slate-300 font-mono text-xs">
            <strong className="text-white">B/DEV</strong> — Open source and web development a nd all
          </p>
        </div>

        {/* Social Accounts (Aishik Roy & B/Stack) */}
        <div className="space-y-2.5">
          <span className="text-slate-500 uppercase tracking-wider text-[11px] block font-semibold">
            Social & Profiles
          </span>
          <a
            href="https://linkedin.com/in/aishik-roy"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Linkedin className="w-3 h-3 text-sky-400" />
            <span>LinkedIn (Aishik Roy)</span>
          </a>
          <a
            href="https://github.com/aishik-1"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3 h-3 text-slate-300" />
            <span>GitHub (aishik-1)</span>
          </a>
          <a
            href="https://leetcode.com/u/aishik-roy"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-3 h-3 text-amber-400" />
            <span>LeetCode (aishik-roy)</span>
          </a>
          <a
            href="https://instagram.com/aishik.roy"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Instagram className="w-3 h-3 text-pink-400" />
            <span>Instagram (@aishik.roy)</span>
          </a>
        </div>
      </div>

      {/* 3. Bottom Legal & Back to top (Exact match to 00:19 in video) */}
      <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-slate-500 mt-8 sm:mt-10">
        <div className="flex items-center gap-6">
          <button onClick={() => onScrollToTop()} className="hover:text-slate-300 transition-colors">
            Back to Top
          </button>
          <a href="mailto:hello@bstack.tech" className="hover:text-slate-300 transition-colors">
            Contact
          </a>
        </div>

        <p className="text-center sm:text-right">
          © 2026 B/Stack — Tech club of Bosscoder School of Technology. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
