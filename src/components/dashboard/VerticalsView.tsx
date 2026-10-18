import React, { useState } from 'react';
import { VerticalType } from '../../types';
import { VERTICALS_DATA } from '../../data/mockData';
import {
  Code2,
  Bot,
  Trophy,
  GitFork,
  Play,
  RotateCcw,
  Pause,
  ExternalLink,
  Users,
  Award,
  Layers
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

export const VerticalsView: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalType>('balgo');

  // Competitive Programming Contest Timer state
  const [timerSeconds, setTimerSeconds] = useState(7200); // 2 hours
  const [timerRunning, setTimerRunning] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const info = VERTICALS_DATA[activeVertical];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
            CLUB VERTICALS WORKSPACES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Specialized toolkits, telemetry, hardware benches, and contest environments for B/ALGO, Be/UILD, B/Hack, and B/DEV.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2">
          {(['balgo', 'beuild', 'bhack', 'bdev'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                audioManager.playClick();
                setActiveVertical(v);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                activeVertical === v
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{VERTICALS_DATA[v]?.shortName || v.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Vertical Banner with Related Picture */}
      {info && (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 liquid-glass p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 uppercase tracking-wider">
                  {info.shortName}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Official Guild Track
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-editorial font-normal text-white">
                {info.shortName} — {info.name}
              </h2>

              <p className="text-sm font-editorial italic text-slate-300">
                "{info.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {info.description}
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {info.metrics.map((m, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block truncate">
                      {m.label}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white block mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Picture */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 shadow-2xl group">
                <img
                  src={info.image}
                  alt={`${info.shortName} - ${info.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-xs font-mono">
                    <span className="text-white font-bold">{info.leads.join(' • ')}</span>
                    <span className="text-cyan-300">{info.memberCount} Builders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Specialized Tool Area per Vertical */}

      {/* 1. Competitive Programming (B/ALGO) */}
      {activeVertical === 'balgo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Contest Mock Timer */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase">
                <span>ICPC MOCK PRACTICE TIMER</span>
                <span>DIV 1 SIMULATOR</span>
              </div>

              <div className="text-center py-6">
                <div className="text-5xl sm:text-6xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  {formatTimer(timerSeconds)}
                </div>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  Remaining in current mock session
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setTimerRunning(!timerRunning);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerRunning ? 'PAUSE' : 'START TIMER'}</span>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClick();
                    setTimerRunning(false);
                    setTimerSeconds(7200);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 font-mono text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* Problem of the Week */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                  WEEKLY CHALLENGE
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold">
                  DIFFICULTY: 2200 (HARD)
                </span>
              </div>

              <h3 className="text-lg font-heading font-black text-white">
                "Subtree Centroid Invariants under Dynamic Heavy-Light Decompositions"
              </h3>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Given a tree with N nodes and Q point updates and path queries, compute the number of centroid shifts modulo 998244353. Time limit: 2.0s. Memory limit: 256MB.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
                <span className="text-slate-400">14 B/Stack members solved</span>
                <a
                  href="https://codeforces.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Submit on Codeforces Gym</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              B/STACK CODEFORCES RATING LADDER
            </h3>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'Aishik Roy (Head)', handle: 'aishik_algo', rating: 2250, tier: 'Master' },
                { rank: 2, name: 'Alex Chen', handle: 'chen_grandmaster', rating: 2420, tier: 'Grandmaster' },
                { rank: 3, name: 'Dara Campbell', handle: 'darac_sys', rating: 2310, tier: 'Master' },
                { rank: 4, name: 'Rohan Mehta', handle: 'rohan_tree', rating: 2180, tier: 'Candidate Master' },
                { rank: 5, name: 'Kai Tanaka', handle: 'kaitanaka_sys', rating: 1845, tier: 'Expert' },
              ].map((row) => (
                <div
                  key={row.rank}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-slate-400 font-bold">#{row.rank}</span>
                    <span className="font-heading font-bold text-white">{row.name}</span>
                    <span className="text-slate-400">(@{row.handle})</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-bold">{row.rating}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300 text-[10px]">
                      {row.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Robotics & Hardware (B/UILD) */}
      {activeVertical === 'beuild' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">ROVER BATTERY BUS</span>
              <div className="text-3xl font-mono font-bold text-emerald-400">24.6 V</div>
              <p className="text-[11px] text-slate-400 font-mono">6S LiPo Pack // 92% Health</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">JETSON ORIN CORE</span>
              <div className="text-3xl font-mono font-bold text-cyan-400">42.4°C</div>
              <p className="text-[11px] text-slate-400 font-mono">12-core ARM // 64GB Unified</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">LIVOX LIDAR SLAM</span>
              <div className="text-3xl font-mono font-bold text-sky-400">20.0 FPS</div>
              <p className="text-[11px] text-slate-400 font-mono">Point-cloud sync: OK (0.2% drift)</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              HARDWARE BENCH & 3D PRINTER QUEUE (LAB 402)
            </h3>
            <div className="space-y-2.5">
              {[
                { tool: 'Bambu Lab X1-Carbon #1', job: 'Rocker-Bogie Steering Knuckle (PA-CF)', user: 'Priya Sharma', eta: '42 min remaining' },
                { tool: 'Bambu Lab X1-Carbon #2', job: 'Livox Mid-360 Vibration Mount', user: 'Vikram Patel', eta: '1h 15m remaining' },
                { tool: 'Weller Soldering Station A', job: 'Custom 4-Layer Motor ESC Assembly', user: 'Kai Tanaka', eta: 'In Use' },
              ].map((bench, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-white block">{bench.tool}</span>
                    <span className="text-[11px] text-slate-400">{bench.job}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-300 block">{bench.user}</span>
                    <span className="text-[10px] text-slate-500">{bench.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Hackathons & Rapid Prototyping (B/Hack) */}
      {activeVertical === 'bhack' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              UPCOMING TARGET HACKATHONS & BOUNTY MISSIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'ETHGlobal Bangkok 2026', dates: 'Nov 14-16', prize: '$500,000 Pool', focus: 'Account abstraction & ZK Rollups', status: 'Roster Finalized (4 Teams)' },
                { title: 'CalHacks 13.0', dates: 'Nov 22-24', prize: '$120,000 Pool', focus: 'Autonomous AI Agent Workflows', status: 'Recruiting 1 Frontend Dev' },
                { title: 'Solana Radar Hackathon', dates: 'Dec 02-08', prize: '$250,000 Pool', focus: 'High-frequency state compression', status: 'Registration Open' },
              ].map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-white text-sm">{h.title}</span>
                    <span className="text-emerald-400">{h.prize}</span>
                  </div>
                  <p className="text-slate-400">{h.dates} • {h.focus}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-cyan-300">{h.status}</span>
                    <button className="text-slate-300 hover:text-white underline cursor-pointer">Join Squad</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Open Source & Web Development (B/DEV) */}
      {activeVertical === 'bdev' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              GOOD FIRST ISSUES & WEB SYSTEMS (B/STACK REPOS)
            </h3>
            <div className="space-y-2.5">
              {[
                { repo: 'kademlia-core', issue: '#54: Implement iterative node lookup timeout backoff', tags: ['Rust', 'Tokio', 'P2P'], xp: '+200 XP' },
                { repo: 'algoforge-engine', issue: '#29: Add eBPF seccomp filter for memory limit isolation', tags: ['eBPF', 'Linux', 'Security'], xp: '+350 XP' },
                { repo: 'bstack-web-platform', issue: '#18: Optimize reactive state hydration for member portal', tags: ['React', 'TypeScript', 'Web'], xp: '+180 XP' },
              ].map((issue, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-cyan-400 font-bold block">{issue.repo}</span>
                    <span className="text-slate-200">{issue.issue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">{issue.xp}</span>
                    <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">Claim</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
