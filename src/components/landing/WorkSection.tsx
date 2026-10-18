import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface WorkItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  link: string;
}

export const WorkSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);

  const projects: WorkItem[] = [
    {
      id: 'p1',
      number: '01',
      title: 'Hyperion Rover',
      subtitle: 'Autonomous Ground Vehicle',
      description: 'A 6-wheel rocker-bogie exploration chassis with Livox LiDAR SLAM, stereo perception, and real-time obstacle avoidance on ROS2.',
      category: 'B/UILD — Robotics & Hardware Systems',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      tags: ['B/UILD', 'C++20', 'ROS2 Humble', 'Jetson Orin', 'LiDAR'],
      link: 'https://github.com/bstack-org/hyperion-rover',
    },
    {
      id: 'p2',
      number: '02',
      title: 'AlgoForge Judge',
      subtitle: 'ICPC Sandbox Engine',
      description: 'Sub-millisecond isolated code execution sandbox with Linux cgroups-v2, memory isolation, and automated algorithmic test verification.',
      category: 'B/ALGO — Competitive Programming',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      tags: ['B/ALGO', 'Rust', 'eBPF', 'cgroups-v2', 'gRPC'],
      link: 'https://github.com/bstack-org/algoforge-engine',
    },
    {
      id: 'p3',
      number: '03',
      title: 'Kademlia Core',
      subtitle: 'P2P Distributed Hash Table',
      description: 'Memory-safe decentralized distributed key-value storage engine in Rust with XOR metric routing and NAT traversal.',
      category: 'B/DEV — Open Source & Distributed Systems',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      tags: ['B/DEV', 'Rust', 'Tokio', 'P2P', 'Networking'],
      link: 'https://github.com/bstack-org/kademlia-core',
    },
    {
      id: 'p4',
      number: '04',
      title: 'ZK-Elect',
      subtitle: 'Verifiable Cryptographic Voting',
      description: 'Zero-knowledge voting protocol ensuring 100% ballot secrecy and Sybil prevention through cryptographic signatures. Built during a 36-hour sprint.',
      category: 'B/HACK — Rapid Prototyping & Sprints',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      tags: ['B/HACK', 'Circom', 'Solidity', 'Next.js', 'ZK-Snarks'],
      link: 'https://github.com/bstack-org/zk-elect',
    },
  ];

  return (
    <section id="work" className="relative py-28 z-10 overflow-hidden">
      {/* 1. Infinite Marquee Banner (Exact video match 00:03 - 00:05) */}
      <div className="py-8 border-y border-white/[0.06] mb-20 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-editorial tracking-tight uppercase text-white/90">
          <span>THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span className="font-editorial italic font-normal text-cyan-300">THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span>THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span className="font-editorial italic font-normal text-slate-300">THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span>THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span className="font-editorial italic font-normal text-cyan-300">THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span>THE CENTRE OF INNOVATION OF BOSSCODER</span>
          <span className="font-editorial italic font-normal text-slate-300">THE CENTRE OF INNOVATION OF BOSSCODER</span>
        </div>
      </div>

      {/* 2. Selected Work Curved Showcase Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 space-y-16 sm:space-y-24">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center"
          >
            {/* Visual Frame with Rounded Capsule Cutout */}
            <div className={`lg:col-span-7 relative group ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-[2rem] sm:rounded-[3.2rem] overflow-hidden liquid-glass p-2 border border-white/10 aspect-[16/10]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-[2.2rem] sm:rounded-[2.8rem] transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle calm vignette overlay */}
                <div className="absolute inset-2 rounded-[2.2rem] sm:rounded-[2.8rem] bg-gradient-to-tr from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Floating "OPEN" pill badge (matches 00:06 in video) */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => audioManager.playClick()}
                  className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 rounded-full liquid-pill flex flex-col items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-2xl border border-white/20"
                >
                  <span className="text-[10px] font-body uppercase font-bold tracking-wider">OPEN</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            </div>

            {/* Editorial Content Column */}
            <div className={`lg:col-span-5 space-y-5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-editorial text-slate-400 tracking-wider">
                  {project.number}
                </span>
                <span className="h-[1px] w-8 bg-white/20" />
                <span className="text-xs font-body tracking-widest text-cyan-400 uppercase">
                  {project.category}
                </span>
              </div>

              <h3 className="text-4xl sm:text-5xl font-editorial font-normal tracking-tight text-white leading-tight">
                {project.title}
              </h3>

              <p className="text-base sm:text-lg text-slate-300 font-editorial italic font-normal text-slate-200">
                {project.subtitle}
              </p>

              <p className="text-sm text-slate-400 font-body font-light leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((t, i) => (
                  <span
                    key={i}
                    className="liquid-pill px-3 py-1 rounded-full text-xs font-body text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
