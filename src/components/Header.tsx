import React from 'react';
import { Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  hasKey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasKey = true }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Brand Builder</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Nano-Banana
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Multi-Medium Campaign Visualizer • Strict Product Consistency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero People Enforced</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">gemini-3.1-flash-lite-image</span>
          </div>
        </div>
      </div>
    </header>
  );
};
