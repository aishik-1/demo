import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Github,
  Globe,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2,
  Lock,
  Layers,
} from 'lucide-react';
import { GoogleLogo } from '../common/GoogleLogo';
import { audioManager } from '../../utils/audio';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'vercel' | 'google-oauth'>('github');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    audioManager.playClick();
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitCommandsAll = `# 1. Initialize local Git repository (if not done)
git init

# 2. Stage all project files
git add .

# 3. Commit the changes
git commit -m "feat: B/Stack Tech Club with Google OAuth & role-based dashboard access"

# 4. Set branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c1017] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 text-left overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-heading text-white">
                  Push to GitHub &amp; Deploy to Vercel
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
                  Step-by-Step Guide
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Complete deployment pipeline for B/Stack Tech Club
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-4 pb-3 border-b border-white/5 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setActiveTab('github');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-white text-neutral-950 font-bold shadow-md'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>1. Push to GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setActiveTab('vercel');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-white text-neutral-950 font-bold shadow-md'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Deploy on Vercel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setActiveTab('google-oauth');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'google-oauth'
                ? 'bg-white text-neutral-950 font-bold shadow-md'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <GoogleLogo className="w-3.5 h-3.5" />
            <span>3. Google OAuth Setup</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* TAB 1: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-neutral-300 space-y-1">
                <span className="font-semibold text-cyan-300 text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Terminal Commands to Push All Files to GitHub</span>
                </span>
                <p className="text-[11px] text-neutral-400">
                  Open your terminal or use Git Bash in this project root folder, create a new repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/new</a>, and run:
                </p>
              </div>

              {/* Combined Command Box */}
              <div className="relative rounded-2xl bg-[#06080e] border border-white/10 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => copyToClipboard(gitCommandsAll, 'git-all')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedKey === 'git-all' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy All Commands</span>
                    </>
                  )}
                </button>
                <pre className="whitespace-pre leading-relaxed select-all">
                  {gitCommandsAll}
                </pre>
              </div>

              {/* Step by step cards */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <strong className="text-white block font-medium">Create a GitHub Repository</strong>
                    <span className="text-neutral-400 text-[11px]">
                      Visit <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">github.com/new</a> and create a repository named <code className="text-white bg-white/10 px-1 py-0.5 rounded">bstack-tech-club</code> (keep it public or private, do not initialize with README since you already have files).
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <strong className="text-white block font-medium">Commit &amp; Push</strong>
                    <span className="text-neutral-400 text-[11px]">
                      Replace <code className="text-cyan-300">YOUR_GITHUB_USERNAME</code> and <code className="text-cyan-300">YOUR_REPOSITORY_NAME</code> with your actual GitHub info and run the commands above.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-neutral-300 space-y-1">
                <span className="font-semibold text-sky-300 text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Deploying to Vercel in 60 Seconds</span>
                </span>
                <p className="text-[11px] text-neutral-400">
                  This project includes pre-configured <code className="text-cyan-300 font-mono">vercel.json</code> with SPA client routing rewrites and full production asset optimization.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <strong className="text-white block font-medium">Import Project on Vercel</strong>
                    <span className="text-neutral-400 text-[11px]">
                      Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">vercel.com/new</a>, select your GitHub account, and click <strong>Import</strong> next to your repository.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1 space-y-1">
                    <strong className="text-white block font-medium">Configure Build Settings</strong>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300 pt-1">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-neutral-500 block text-[10px]">Framework Preset</span>
                        <strong className="text-cyan-300">Vite</strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-neutral-500 block text-[10px]">Build Command</span>
                        <strong className="text-emerald-300">npm run build</strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-neutral-500 block text-[10px]">Output Directory</span>
                        <strong className="text-amber-300">dist</strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-neutral-500 block text-[10px]">Install Command</span>
                        <strong className="text-purple-300">npm install</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <strong className="text-white block font-medium">Add Environment Variables on Vercel</strong>
                    <span className="text-neutral-400 text-[11px] block">
                      In the Vercel project setup under <strong>Environment Variables</strong>, add:
                    </span>
                    <div className="p-2.5 rounded bg-black/50 border border-white/10 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                      <code>VITE_GOOGLE_CLIENT_ID</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('VITE_GOOGLE_CLIENT_ID', 'env-var')}
                        className="text-neutral-400 hover:text-white"
                      >
                        {copiedKey === 'env-var' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="flex-1 space-y-1">
                    <strong className="text-white block font-medium">Click Deploy!</strong>
                    <span className="text-neutral-400 text-[11px] block">
                      Vercel will build and deploy your site in ~30 seconds and provide you with a live URL (e.g. <code className="text-cyan-300">https://your-bstack-app.vercel.app</code>).
                    </span>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-[11px] text-emerald-200 mt-2">
                      <strong>Real-Time Cloud Sync Enabled:</strong> Firebase Firestore is wired into the app via <code className="text-white font-mono">firebase-applet-config.json</code>. When you edit, add, or delete events from the dashboard, changes save to Google Cloud Firestore in real time, so all public visitors on Vercel see updates instantly without needing to redeploy!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE OAUTH */}
          {activeTab === 'google-oauth' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-neutral-300 space-y-1">
                <span className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Connect Google OAuth for your Vercel URL</span>
                </span>
                <p className="text-[11px] text-neutral-400">
                  Google OAuth requires your live Vercel domain to be added to authorized origins so Google allows login popups.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <strong className="text-white block font-medium">Open Google Cloud Console</strong>
                    <span className="text-neutral-400 text-[11px]">
                      Visit <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Google Cloud Console &rarr; APIs &amp; Services &rarr; Credentials</a>.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <strong className="text-white block font-medium">Edit your OAuth 2.0 Client ID</strong>
                    <span className="text-neutral-400 text-[11px] block">
                      Under <strong>Authorized JavaScript origins</strong>, add both:
                    </span>
                    <ul className="space-y-1 font-mono text-[11px] text-cyan-300 list-disc list-inside">
                      <li><code>https://your-bstack-app.vercel.app</code></li>
                      <li><code>http://localhost:3000</code></li>
                    </ul>
                    <span className="text-neutral-400 text-[11px] block pt-1">
                      Under <strong>Authorized redirect URIs</strong>, add the exact same URLs.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex-1">
                    <strong className="text-white block font-medium">Role-Based Dashboard Access Enforced</strong>
                    <span className="text-neutral-400 text-[11px]">
                      Once deployed, users signing in with Google OAuth will only be granted Dashboard access if their email matches <code className="text-emerald-300 font-mono">ziyadparkar.official@gmail.com</code>, <code className="text-emerald-300 font-mono">aishik.roy1234@gmail.com</code>, or <code className="text-emerald-300 font-mono">propriyansh71@gmail.com</code>. Any other email is blocked with the 403 Forbidden Access screen!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-neutral-400">
            Authorized Emails: <strong className="text-cyan-300 font-mono">ziyadparkar.official@gmail.com, aishik.roy1234@gmail.com, propriyansh71@gmail.com</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
