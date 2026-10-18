import React from 'react';

export const MarqueeBanner: React.FC = () => {
  return (
    <div className="py-4 sm:py-5 border-y border-white/[0.06] my-3 sm:my-5 overflow-hidden select-none z-10 relative">
      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial tracking-tight uppercase text-white/90">
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
  );
};
