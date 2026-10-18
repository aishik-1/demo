import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface TechAppDef {
  id: string;
  name: string;
  // Desktop resting coordinates (percentages 0-100)
  deskX: number;
  deskY: number;
  // Mobile resting coordinates (percentages 0-100)
  mobX: number;
  mobY: number;
  // Float orbit parameters
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
  // Icon vector
  icon: React.ReactNode;
}

interface LiveNode {
  id: string;
  name: string;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
  element: HTMLElement | null;
}

export const HeroNetworkGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<LiveNode[]>([]);
  const elementsMapRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 16 Official Tech Apps in Uniform 48px Squircle Badges
  const techApps: TechAppDef[] = [
    // --- TOP HORIZON ARCH (Desktop: y: 8%-12% above headline) ---
    {
      id: 'python',
      name: 'Python',
      deskX: 20,
      deskY: 9,
      mobX: 12,
      mobY: 6,
      freqX: 0.8,
      freqY: 1.0,
      phaseX: 1.2,
      phaseY: 0.5,
      ampX: 6,
      ampY: 7,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M11.91 0c-3.17 0-5.38.35-6.68 1.05C3.76 1.84 3.73 3 3.73 4.88v2.41h7.02v.88H3.73C1.66 8.17 0 9.87 0 11.95c0 2.07 1.66 3.78 3.73 3.78h1.61v-2.31c0-2.07 1.74-3.77 3.82-3.77h7.02V8.17h-7.02V4.88c0-1.88 1.54-3.32 3.42-3.32h5.33c1.88 0 3.42 1.44 3.42 3.32v3.29h2.32c2.07 0 3.73-1.71 3.73-3.78 0-2.08-1.66-3.78-3.73-3.78H18.9V1.5c-1.3-.7-3.51-1.05-6.68-1.05zm-2.83 2.1c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05-1.05-.47-1.05-1.05.47-1.05 1.05-1.05z" fill="#3776ab" />
          <path d="M20.27 8.17h-1.61v2.31c0 2.07-1.74 3.77-3.82 3.77H7.82v1.48h7.02v3.29c0 1.88-1.54 3.32-3.42 3.32H6.09c-1.88 0-3.42-1.44-3.42-3.32v-3.29H.35c-2.07 0-3.73 1.71-3.73 3.78 0 2.08 1.66 3.78 3.73 3.78h4.51c1.3.7 3.51 1.05 6.68 1.05 3.17 0 5.38-.35 6.68-1.05 1.47-.79 1.5-1.95 1.5-3.83v-2.41h-7.02v-.88h7.02c2.07 0 3.73-1.7 3.73-3.78 0-2.08-1.66-3.78-3.73-3.78zm-5.36 13.7c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05z" fill="#ffd43b" />
        </svg>
      ),
    },
    {
      id: 'terminal',
      name: 'Terminal',
      deskX: 36,
      deskY: 11,
      mobX: 38,
      mobY: 7,
      freqX: 1.0,
      freqY: 0.8,
      phaseX: 2.1,
      phaseY: 1.4,
      ampX: 7,
      ampY: 6,
      icon: <Terminal className="w-6 h-6 text-emerald-400 stroke-[2.2]" />,
    },
    {
      id: 'gsoc',
      name: 'Google Summer of Code',
      deskX: 52,
      deskY: 8,
      mobX: 64,
      mobY: 6,
      freqX: 0.9,
      freqY: 1.1,
      phaseX: 0.4,
      phaseY: 3.1,
      ampX: 6,
      ampY: 7,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#f59e0b] stroke-[2]">
          <circle cx="12" cy="12" r="4.5" fill="#f59e0b" fillOpacity="0.3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'icpc',
      name: 'ICPC',
      deskX: 68,
      deskY: 10,
      mobX: 88,
      mobY: 7,
      freqX: 1.1,
      freqY: 0.9,
      phaseX: 3.3,
      phaseY: 1.8,
      ampX: 7,
      ampY: 7,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <circle cx="7" cy="8" r="3" fill="#ef4444" />
          <circle cx="17" cy="8" r="3" fill="#3b82f6" />
          <circle cx="12" cy="17" r="3.2" fill="#eab308" />
          <line x1="7" y1="8" x2="17" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <line x1="7" y1="8" x2="12" y2="17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <line x1="17" y1="8" x2="12" y2="17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      deskX: 84,
      deskY: 11,
      mobX: 86,
      mobY: 68,
      freqX: 1.0,
      freqY: 1.2,
      phaseX: 0.1,
      phaseY: 2.4,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#ffa116]">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.737c.725.074 1.455-.021 2.146-.279.69-.258 1.314-.672 1.829-1.213l3.65-3.9 1.708-1.824a1.376 1.376 0 0 0 .39-.966 1.377 1.377 0 0 0-.406-.974l-2.094-2.094a1.377 1.377 0 0 0-1.948 0l-3.4 3.4a3.09 3.09 0 0 1-2.186.906 3.09 3.09 0 0 1-2.186-.906 3.09 3.09 0 0 1 0-4.372l4.98-4.98a1.374 1.374 0 0 0-.97-2.348z" />
        </svg>
      ),
    },

    // --- RIGHT CANVAS CONSTELLATION (Desktop: x: 56%-94%, y: 18%-86%) ---
    {
      id: 'codeforces',
      name: 'Codeforces',
      deskX: 60,
      deskY: 22,
      mobX: 14,
      mobY: 72,
      freqX: 1.2,
      freqY: 0.8,
      phaseX: 2.2,
      phaseY: 1.1,
      ampX: 6,
      ampY: 7,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="2" y="10" width="5" height="12" rx="1.5" fill="#ffd000" />
          <rect x="9.5" y="4" width="5" height="18" rx="1.5" fill="#2168d8" />
          <rect x="17" y="14" width="5" height="8" rx="1.5" fill="#e02424" />
        </svg>
      ),
    },
    {
      id: 'vscode',
      name: 'VS Code',
      deskX: 74,
      deskY: 21,
      mobX: 38,
      mobY: 70,
      freqX: 0.8,
      freqY: 1.2,
      phaseX: 1.4,
      phaseY: 3.2,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#007acc]">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.26a.998.998 0 0 0-.005 1.515l3.525 3.226-3.525 3.226a.998.998 0 0 0 .005 1.515l1.322 1.202a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352z" />
        </svg>
      ),
    },
    {
      id: 'figma',
      name: 'Figma',
      deskX: 90,
      deskY: 24,
      mobX: 62,
      mobY: 72,
      freqX: 1.1,
      freqY: 0.9,
      phaseX: 0.5,
      phaseY: 1.7,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 38 57" className="w-5 h-7">
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
          <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
          <path d="M0 9.5a9.5 9.5 0 0 0 9.5 9.5H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
          <path d="M0 28.5a9.5 9.5 0 0 0 9.5 9.5H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
        </svg>
      ),
    },
    {
      id: 'github',
      name: 'GitHub',
      deskX: 64,
      deskY: 36,
      mobX: 12,
      mobY: 82,
      freqX: 0.9,
      freqY: 1.0,
      phaseX: 3.4,
      phaseY: 2.1,
      ampX: 8,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'slack',
      name: 'Slack',
      deskX: 78,
      deskY: 35,
      mobX: 38,
      mobY: 82,
      freqX: 1.2,
      freqY: 0.8,
      phaseX: 1.1,
      phaseY: 1.9,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </svg>
      ),
    },
    {
      id: 'discord',
      name: 'Discord',
      deskX: 92,
      deskY: 38,
      mobX: 62,
      mobY: 82,
      freqX: 0.7,
      freqY: 1.3,
      phaseX: 2.9,
      phaseY: 0.7,
      ampX: 8,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      deskX: 70,
      deskY: 50,
      mobX: 86,
      mobY: 82,
      freqX: 1.0,
      freqY: 1.1,
      phaseX: 1.6,
      phaseY: 0.9,
      ampX: 8,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 87.3 78" className="w-6 h-6">
          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47" />
          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
          <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
        </svg>
      ),
    },
    {
      id: 'docker',
      name: 'Docker',
      deskX: 84,
      deskY: 51,
      mobX: 18,
      mobY: 92,
      freqX: 1.1,
      freqY: 0.8,
      phaseX: 0.3,
      phaseY: 2.7,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0db7ed]">
          <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.135a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m8.848 5.43h2.118a.186.186 0 0 0 .186-.185V11.72a.186.186 0 0 0-.186-.185h-2.118a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.954 0h2.118a.186.186 0 0 0 .186-.185V11.72a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V11.72a.185.185 0 0 0-.185-.185H8.1a.186.186 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.186.186 0 0 0 .185-.185V11.72a.186.186 0 0 0-.185-.185H5.135a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185M23.95 12.44a4.9 4.9 0 0 0-3.32-3.136.18.18 0 0 0-.214.086 4.3 4.3 0 0 1-.95 1.144.185.185 0 0 1-.252-.022 7.7 7.7 0 0 0-2.023-1.392.185.185 0 0 0-.236.06l-.916 1.348a.184.184 0 0 1-.225.068 14.1 14.1 0 0 0-4.045-.589H1.47a.186.186 0 0 0-.185.186c-.033 1.344.246 2.68.817 3.9A9.77 9.77 0 0 0 7.85 19.33a14.36 14.36 0 0 0 8.077 1.258 13.7 13.7 0 0 0 5.412-2.122 10.9 10.9 0 0 0 2.505-3.037.185.185 0 0 0 .025-.102c.004-.03-.002-.061-.018-.088l-.001-.001z" />
        </svg>
      ),
    },
    {
      id: 'intellij',
      name: 'IntelliJ IDEA',
      deskX: 65,
      deskY: 66,
      mobX: 42,
      mobY: 92,
      freqX: 1.2,
      freqY: 0.9,
      phaseX: 1.9,
      phaseY: 0.8,
      ampX: 7,
      ampY: 8,
      icon: (
        <div className="w-full h-full rounded-lg bg-gradient-to-tr from-[#fe315d] via-[#f97a12] to-[#087cfa] flex items-center justify-center shadow-sm">
          <span className="font-mono font-black text-white text-[12px] tracking-tight">IJ</span>
        </div>
      ),
    },
    {
      id: 'notion',
      name: 'Notion',
      deskX: 79,
      deskY: 68,
      mobX: 66,
      mobY: 92,
      freqX: 0.8,
      freqY: 1.0,
      phaseX: 3.0,
      phaseY: 1.4,
      ampX: 7,
      ampY: 8,
      icon: (
        <div className="w-full h-full rounded-lg bg-white flex items-center justify-center shadow-sm">
          <span className="font-serif font-black text-slate-900 text-lg leading-none">N</span>
        </div>
      ),
    },
    {
      id: 'postman',
      name: 'Postman',
      deskX: 90,
      deskY: 74,
      mobX: 88,
      mobY: 92,
      freqX: 1.0,
      freqY: 1.1,
      phaseX: 2.1,
      phaseY: 0.6,
      ampX: 7,
      ampY: 8,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#ff6c37]">
          <path d="M13.52 0C6.06 0 0 6.06 0 13.52c0 3.75 1.54 7.15 4.02 9.58l.78-.78C2.56 20.1 1.1 16.98 1.1 13.52 1.1 6.66 6.66 1.1 13.52 1.1c6.86 0 12.42 5.56 12.42 12.42 0 6.86-5.56 12.42-12.42 12.42-3.46 0-6.58-1.46-8.8-3.7l-.78.78c2.43 2.48 5.83 4.02 9.58 4.02C20.98 27.04 27.04 20.98 27.04 13.52 27.04 6.06 20.98 0 13.52 0z" />
        </svg>
      ),
    },
  ];

  // Interconnected line pairs between apps
  const connections: [string, string][] = [
    // Top Horizon Arch
    ['python', 'terminal'],
    ['terminal', 'gsoc'],
    ['gsoc', 'icpc'],
    ['icpc', 'leetcode'],

    // Bridge from Top Arch to Right Constellation
    ['leetcode', 'figma'],
    ['icpc', 'vscode'],
    ['gsoc', 'codeforces'],

    // Right Constellation Mesh
    ['codeforces', 'vscode'],
    ['vscode', 'figma'],
    ['codeforces', 'github'],
    ['vscode', 'slack'],
    ['github', 'slack'],
    ['figma', 'discord'],
    ['slack', 'discord'],
    ['github', 'gdrive'],
    ['slack', 'gdrive'],
    ['slack', 'docker'],
    ['discord', 'docker'],
    ['gdrive', 'intellij'],
    ['gdrive', 'notion'],
    ['docker', 'notion'],
    ['docker', 'postman'],
    ['intellij', 'notion'],
    ['notion', 'postman'],
  ];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId: number;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const updateDimensions = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const mobileMode = window.innerWidth < 1024;
      setIsMobile(mobileMode);

      nodesRef.current = techApps.map((app) => {
        const px = mobileMode ? app.mobX : app.deskX;
        const py = mobileMode ? app.mobY : app.deskY;
        const baseX = (px / 100) * width;
        const baseY = (py / 100) * height;
        const el = elementsMapRef.current[app.id] || null;
        const size = mobileMode ? 38 : 48;

        return {
          id: app.id,
          name: app.name,
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          width: el ? el.offsetWidth : size,
          height: el ? el.offsetHeight : size,
          freqX: app.freqX,
          freqY: app.freqY,
          phaseX: app.phaseX,
          phaseY: app.phaseY,
          ampX: mobileMode ? app.ampX * 0.5 : app.ampX,
          ampY: mobileMode ? app.ampY * 0.5 : app.ampY,
          element: el,
        };
      });
    };

    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Mouse repulsion strictly active on desktop screens (>=1024px)
      if (window.innerWidth < 1024) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Continuous 60fps/120fps Animation Loop
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      const timeSec = currentTime * 0.001;

      const nodes = nodesRef.current;
      const nodeMap: Record<string, LiveNode> = {};
      const mobileMode = window.innerWidth < 1024;

      // 1. Update Physics Coordinates for all 16 App Badges
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        nodeMap[node.id] = node;

        // Smooth sine/cosine orbit drift
        const driftX = Math.sin(timeSec * node.freqX + node.phaseX) * node.ampX;
        const driftY = Math.cos(timeSec * node.freqY + node.phaseY) * node.ampY;
        const targetX = node.baseX + driftX;
        const targetY = node.baseY + driftY;

        // Spring restitution toward home orbit
        const springK = 3.4;
        const fx = (targetX - node.x) * springK;
        const fy = (targetY - node.y) * springK;

        node.vx += fx * dt;
        node.vy += fy * dt;

        // Cursor repulsion on desktop
        if (mouse.active && !mobileMode) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const repelRadius = 150;

          if (distSq < repelRadius * repelRadius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const repelStrength = (1 - dist / repelRadius) * 230;
            const nx = dx / dist;
            const ny = dy / dist;

            node.vx += nx * repelStrength * dt;
            node.vy += ny * repelStrength * dt;
          }
        }

        // Damping / Friction
        const damping = 0.88;
        node.vx *= damping;
        node.vy *= damping;

        node.x += node.vx * 60 * dt;
        node.y += node.vy * 60 * dt;

        // Apply hardware-accelerated translate3d directly
        if (node.element) {
          node.element.style.transform = `translate3d(${node.x - node.width / 2}px, ${node.y - node.height / 2}px, 0)`;
        }
      }

      // 2. Dynamically Draw SVG / Canvas Dashed Lines Pinpointed to App Coordinates
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = mobileMode
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.1;

      for (let j = 0; j < connections.length; j++) {
        const [idA, idB] = connections[j];
        const a = nodeMap[idA];
        const b = nodeMap[idB];
        if (!a || !b) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Vertex Junction Dots
      ctx.setLineDash([]);
      ctx.fillStyle = mobileMode
        ? 'rgba(255, 255, 255, 0.16)'
        : 'rgba(255, 255, 255, 0.28)';
      for (let k = 0; k < nodes.length; k++) {
        const n = nodes[k];
        ctx.beginPath();
        ctx.arc(n.x, n.y, mobileMode ? 1.8 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Dynamic connecting lines canvas anchored to live node coordinates */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 16 Razor-Sharp Tech App Badges: 48px × 48px, rounded-2xl, bg-zinc-900/80 */}
      {techApps.map((app) => (
        <div
          key={app.id}
          ref={(el) => {
            elementsMapRef.current[app.id] = el;
          }}
          onClick={() => audioManager.playClick()}
          title={app.name}
          className={`absolute top-0 left-0 will-change-transform pointer-events-auto cursor-pointer transition-all duration-200 ${
            isMobile
              ? 'w-[38px] h-[38px] p-2 rounded-xl bg-zinc-900/80 border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center'
              : 'w-[48px] h-[48px] p-2.5 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-white/15 shadow-[0_8px_25px_rgba(0,0,0,0.65)] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-115 flex items-center justify-center'
          }`}
        >
          {app.icon}
        </div>
      ))}
    </div>
  );
};
