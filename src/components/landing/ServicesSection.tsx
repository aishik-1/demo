import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Code2, Bot, Trophy, GitFork, CheckCircle2, Terminal } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface VerticalRow {
  number: string;
  code: string;
  title: string;
  tagline: string;
  handwrittenDescription: string;
  handwrittenAccentColor: string;
  description: string;
  metrics: string;
  image: string;
  icon: React.ReactNode;
  tags: string[];
  lead: string;
  focus: string[];
}

export const ServicesSection: React.FC = () => {
  const [selectedVertical, setSelectedVertical] = useState<VerticalRow | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVertical(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll when modal is active
  useEffect(() => {
    if (selectedVertical) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedVertical]);

  const verticals: VerticalRow[] = [
    {
      number: '01',
      code: 'B/ALGO',
      title: 'Competitive Programming',
      tagline: 'ICPC World Finals, Codeforces Div 1 & Extreme Problem Solving',
      handwrittenDescription:
        'We don’t just solve problems — we push dynamic programming, segment trees, and graph algorithms down to sub-millisecond solves. Under strict ICPC World Finals contest simulations, our engineers optimize judge runtimes and conquer Codeforces Div 1 with pure algorithmic craft.',
      handwrittenAccentColor: 'text-amber-200',
      description:
        'Systematic algorithmic training on dynamic programming, segment trees with lazy propagation, max-flow min-cut duality, graph algorithms, and string automata. Spearheaded by Lead Ziyad Parkar.',
      metrics: '420+ Problems Solved Weekly • 6 Grandmasters & Masters',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      tags: ['ICPC World Finals', 'Codeforces Div 1', 'C++20', 'Segment Trees', 'Max-Flow'],
      lead: 'Ziyad Parkar',
      focus: [
        'Weekly live contest simulation under ICPC rules',
        'Advanced data structures: Fenwick, Treaps, and Centroid Decomposition',
        'Mathematical number theory, combinatorics & FFT convolution',
        'Sub-millisecond judge runtime optimization',
      ],
    },
    {
      number: '02',
      code: 'B/UILD',
      title: 'Robotics & Hardware Systems',
      tagline: 'Autonomous Rovers, ROS2, PCB Design & Firmware',
      handwrittenDescription:
        'From custom 4-layer PCBs and brushless motor firmware to autonomous rovers mapping rough terrain with LiDAR SLAM and ROS2 Humble. We design, solder, and stress-test physical machines that think and navigate in real-world space.',
      handwrittenAccentColor: 'text-emerald-200',
      description:
        'Bridging silicon, sensors, and physical actuation. Our hardware engineers design custom rover chassis, brushless motor controllers, LiDAR SLAM, RTOS kernels, and embedded sensor suites.',
      metrics: '12 Hardware Prototypes • University Rover Challenge Team',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80',
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      tags: ['ROS2 Humble', 'Autonomous Rover', 'STM32', 'Livox LiDAR', 'KiCAD PCB'],
      lead: 'Ranjan Kumar Sahu & Akash Sekh',
      focus: [
        'Autonomous ground vehicle navigation & obstacle mapping',
        'Custom 4-layer PCB design and microcontroller routing',
        'CAN bus & serial sensor multiplexing in real-time',
        'Computer vision with Jetson Orin tensor cores',
      ],
    },
    {
      number: '03',
      code: 'B/HACK',
      title: 'Hackathons & Rapid Sprints',
      tagline: '36-Hour Sprint Culture, Rapid MVPs, Cryptographic Solvers & Web3',
      handwrittenDescription:
        '36-hour caffeine sprints where wild ideas transform into deployed zero-to-one software. We assemble elite strike squads for ETHGlobal, CalHacks, and MLH — engineering winning MVPs, zero-knowledge proofs, and web3 protocols that capture 1st place trophies.',
      handwrittenAccentColor: 'text-purple-200',
      description:
        'The frontline strike division. We assemble high-leverage teams to build and ship winning products at collegiate and global hackathons (ETHGlobal, MLH Prime, CalHacks), transforming novel ideas into deployed software in 36 hours.',
      metrics: '24 Global & National Hackathons Won • $340,000+ Prize Track',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
      icon: <Trophy className="w-5 h-5 text-purple-400" />,
      tags: ['ETHGlobal', '36hr Sprints', 'Rapid MVPs', 'Solidity', 'Zero-Knowledge'],
      lead: 'Priyansh Singh & Seemakurthi Koushitha',
      focus: [
        'Zero-knowledge proof architectures (Circom, Snarkjs)',
        'Next.js 15, Tailwind, and WebGL high-velocity prototyping',
        'Smart contract security audits and gas reduction',
        'Winning pitch strategy and live demo engineering',
      ],
    },
    {
      number: '04',
      code: 'B/DEV',
      title: 'Open Source & Distributed Systems',
      tagline: 'Full-Stack Web Platforms, Linux Kernel Modules & Distributed Systems',
      handwrittenDescription:
        'Writing upstream Linux kernel modules, eBPF telemetry, and high-concurrency microservices in Rust Tokio and Go. We engineer rock-solid distributed systems, open-source toolkits, and platforms built for massive scale.',
      handwrittenAccentColor: 'text-cyan-200',
      description:
        'From modern ultra-responsive web applications to low-level operating system internals. We write code for upstream Linux, contribute to open-source toolkits, maintain full-stack web platforms, and build high-throughput systems.',
      metrics: '14 Upstream Kernel Patches • 52k+ Combined GitHub Stars',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
      icon: <GitFork className="w-5 h-5 text-sky-400" />,
      tags: ['Linux Kernel', 'Rust Tokio', 'Distributed DHT', 'TypeScript', 'eBPF'],
      lead: 'Core Engineering Guild',
      focus: [
        'eBPF kernel observability and packet filtering',
        'Decentralized storage and peer-to-peer protocols',
        'High-concurrency microservices in Go & Rust',
        'Open-source ecosystem maintainership and documentation',
      ],
    },
  ];

  return (
    <section id="verticals" className="relative py-12 sm:py-16 z-10 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Section Editorial Header */}
      <div className="mb-8 sm:mb-14 space-y-2.5 sm:space-y-3 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] sm:text-xs font-body tracking-[0.25em] uppercase text-cyan-400 font-semibold"
        >
          SPECIALIZED TRACKS // BOSSCODER TECH CLUB
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="text-3xl sm:text-5xl md:text-7xl font-editorial font-normal tracking-tight text-white leading-tight"
        >
          Club Verticals
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-xl sm:text-3xl md:text-5xl font-editorial italic font-normal text-slate-300 tracking-tight"
        >
          B/ALGO, B/UILD, B/Hack &amp; B/DEV
        </motion.h3>
      </div>

      {/*
        ========================================================================
        CURVED SHOWCASE WITH POPPING OUT TEXT & IMAGE ANIMATION
        ========================================================================
      */}
      <div className="space-y-12 sm:space-y-20">
        {verticals.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center"
            >
              {/*
                Image Column (alternates left/right exactly like reference)
              */}
              <div
                className={`lg:col-span-7 relative group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <div
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedVertical(item);
                  }}
                  className="relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden liquid-glass p-2.5 sm:p-3 border border-white/10 aspect-[16/10] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] group-hover:border-cyan-400/40 transition-all duration-500 cursor-pointer"
                >
                  {/* Outer glow aura on hover */}
                  <div className="absolute -inset-1 rounded-[2.8rem] sm:rounded-[4rem] bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

                  <img
                    src={item.image}
                    alt={`${item.code} - ${item.title}`}
                    className="w-full h-full object-cover rounded-[2rem] sm:rounded-[3rem] transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Calm cinematic dark gradient overlay */}
                  <div className="absolute inset-2.5 sm:inset-3 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {/* Floating Track Badge inside frame */}
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 liquid-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 backdrop-blur-xl z-20">
                    <span className="p-1 rounded-full bg-cyan-400/20 text-cyan-300">
                      {item.icon}
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider text-white">
                      {item.code}
                    </span>
                  </div>

                  {/* Circular "OPEN" button popping out */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioManager.playClick();
                      setSelectedVertical(item);
                    }}
                    className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-950 flex flex-col items-center justify-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/40 group/btn transition-transform hover:scale-110 active:scale-95 z-20"
                    title={`Open ${item.code} Details`}
                  >
                    <span className="text-[10px] font-body uppercase font-black tracking-widest text-slate-950">
                      OPEN
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-900 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/*
                Text Column: Clear, Glitch-Free, Rich Typography with Handwritten Description
              */}
              <div className={`lg:col-span-5 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                {/* 1. Number & Track Code */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="text-base font-mono text-cyan-400 font-bold tracking-wider">
                    {item.number}
                  </span>
                  <span className="h-[1px] w-8 bg-cyan-400/40" />
                  <span className="text-xs font-mono tracking-widest text-slate-300 uppercase font-bold">
                    {item.code} // GUILD TRACK
                  </span>
                </motion.div>

                {/* 2. Big Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal tracking-tight text-white leading-[1.08]"
                >
                  {item.title}
                </motion.h3>

                {/* 3. Italic Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="text-base sm:text-lg text-slate-300 font-editorial italic font-normal leading-snug"
                >
                  {item.tagline}
                </motion.p>

                {/* 4. Handwriting Description - Authentic human engineering notebook note */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
                  className="relative pl-4 sm:pl-5 border-l-2 border-cyan-400/30 my-3 py-1"
                >
                  <p
                    className={`text-lg sm:text-xl lg:text-[22px] font-handwriting ${item.handwrittenAccentColor} tracking-wide font-normal leading-[1.65] select-none`}
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                  >
                    {item.handwrittenDescription}
                  </p>
                </motion.div>

                {/* 5. Tech Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                  className="pt-1 flex flex-wrap gap-2"
                >
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* 6. Metrics Pill & Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  className="pt-2 flex items-center gap-3 flex-wrap"
                >
                  <span className="liquid-pill px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 inline-block font-semibold">
                    {item.metrics}
                  </span>

                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setSelectedVertical(item);
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                  >
                    <span>Curriculum &amp; Lead</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/*
        ========================================================================
        INTERACTIVE VERTICAL DEEP-DIVE MODAL (Opened via "OPEN" pill or card)
        ========================================================================
      */}
      <AnimatePresence>
        {selectedVertical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVertical(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl liquid-glass rounded-[2.5rem] p-6 sm:p-10 border border-white/20 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVertical(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full liquid-pill flex items-center justify-center text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer z-20"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">
                      {selectedVertical.icon}
                    </span>
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      {selectedVertical.number} // {selectedVertical.code}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
                    {selectedVertical.title}
                  </h3>

                  <p className="text-base sm:text-lg text-slate-300 font-editorial italic font-normal">
                    {selectedVertical.tagline}
                  </p>
                </div>

                {/* Handwritten Description Highlight inside Modal */}
                <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-5 pl-6 border-l-4 border-l-cyan-400">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                    Guild Notes &amp; Mission:
                  </span>
                  <p className={`text-xl sm:text-2xl font-handwriting ${selectedVertical.handwrittenAccentColor} tracking-wide leading-relaxed`}>
                    &ldquo;{selectedVertical.handwrittenDescription}&rdquo;
                  </p>
                </div>

                {/* Hero Photo inside modal */}
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-white/10">
                  <img
                    src={selectedVertical.image}
                    alt={selectedVertical.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-mono text-cyan-300 font-semibold">
                      Track Lead: {selectedVertical.lead}
                    </span>
                  </div>
                </div>

                {/* Narrative */}
                <p className="text-sm text-slate-300 font-body leading-relaxed font-light">
                  {selectedVertical.description}
                </p>

                {/* Focus Areas */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Core Engineering Focus &amp; Curriculum
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedVertical.focus.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300 font-body"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Core Tooling &amp; Protocols
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVertical.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/50 border border-cyan-500/30 text-cyan-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {selectedVertical.metrics}
                </span>

                <button
                  onClick={() => setSelectedVertical(null)}
                  className="px-5 py-2 rounded-full liquid-pill hover:bg-white/10 text-xs font-body text-white transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
