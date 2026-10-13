import React from 'react';
import { Shield, Radio, HeartPulse, Activity } from 'lucide-react';

interface ResQLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const ResQLogo: React.FC<ResQLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerSizes = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Ultra-Modern Geometric 3D Shield & Rescue Pulse Badge */}
      <div className="relative group flex items-center justify-center">
        {/* Glow Halo */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300 animate-pulse" />

        {/* Outer Shield Frame */}
        <div className={`${containerSizes[size]} relative z-10 bg-slate-950 p-0.5 border border-red-500/50 shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
          {/* Internal Gradient Canvas */}
          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center relative shadow-inner">
            
            {/* Geometric Cross Base Layer */}
            <div className="absolute w-full h-2.5 bg-white/20 blur-[1px]" />
            <div className="absolute h-full w-2.5 bg-white/20 blur-[1px]" />

            {/* Shield Core */}
            <Shield className={`${iconSizes[size]} text-white drop-shadow-md z-10`} />

            {/* Center Heart Pulse overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <Activity className="w-3.5 h-3.5 text-yellow-300 drop-shadow-lg animate-pulse" />
            </div>

            {/* Live GPS Beacon Dot */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-yellow-300 border-2 border-slate-950 animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-slate-950" />
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight ${titleSizes[size]} leading-none flex items-center gap-1`}>
          <span className="text-slate-900 dark:text-white font-black tracking-tight">Res</span>
          <span className="relative inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 font-black">
            Q
            <Radio className="w-3 h-3 text-amber-500 absolute -right-3.5 top-0 animate-pulse" />
          </span>
          <span className="ml-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white tracking-widest leading-none shadow-xs border border-white/20">
            24/7
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-tight mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI DISASTER RESCUE GRID</span>
          </span>
        )}
      </div>
    </div>
  );
};

