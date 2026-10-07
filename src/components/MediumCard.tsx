import React, { useState } from 'react';
import { MediumOption, GeneratedMedium } from '../types';
import {
  Sparkles,
  Maximize2,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Heart,
  MessageCircle,
  Bookmark,
  Share2
} from 'lucide-react';

interface MediumCardProps {
  medium: MediumOption;
  generatedData?: GeneratedMedium;
  isGenerating: boolean;
  onGenerate: () => void;
  onOpenZoom: (url: string, title: string) => void;
  onOpenCompare: (medium: GeneratedMedium) => void;
  hasMasterAnchor: boolean;
  productName: string;
  tagline: string;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  medium,
  generatedData,
  isGenerating,
  onGenerate,
  onOpenZoom,
  onOpenCompare,
  hasMasterAnchor,
  productName,
  tagline,
}) => {
  const [frameMockup, setFrameMockup] = useState<boolean>(true);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const handleDownload = () => {
    if (!generatedData?.imageUrl) return;
    const a = document.createElement('a');
    a.href = generatedData.imageUrl;
    a.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-${medium.id}.png`;
    a.click();
  };

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (medium.aspectRatio) {
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between group transition-all hover:border-zinc-700/80">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="font-semibold text-white text-sm tracking-tight">{medium.name}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
              {medium.aspectRatio}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {medium.category}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
          {medium.description}
        </p>

        {/* Media Frame Container */}
        <div className={`relative ${getAspectRatioClass()} w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-inner flex items-center justify-center`}>
          {generatedData?.imageUrl ? (
            <div className="w-full h-full relative group/img overflow-hidden">
              {/* Realistic Mockup Frame Overlays */}
              {frameMockup && medium.id === 'billboard' && (
                <div className="absolute inset-0 pointer-events-none z-10 border-8 border-zinc-800/90 shadow-2xl flex flex-col justify-between">
                  <div className="w-full h-3 bg-zinc-900 flex justify-around items-center px-4 border-b border-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200/80 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200/80 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200/80 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200/80 shadow-sm" />
                  </div>
                  <div className="bg-zinc-900/95 py-0.5 px-3 flex justify-between items-center text-[9px] font-mono text-zinc-400 border-t border-zinc-700">
                    <span>CLEAR CHANNEL // CITY PRIME</span>
                    <span>14x48 HIGHWAY MONUMENT</span>
                  </div>
                </div>
              )}

              {frameMockup && medium.id === 'newspaper' && (
                <div className="absolute inset-0 pointer-events-none z-10 border-4 border-amber-950/20 bg-amber-50/5 mix-blend-multiply flex flex-col justify-between">
                  <div className="bg-amber-100/90 text-zinc-900 px-3 py-1 border-b border-zinc-400 font-serif text-[10px] flex justify-between items-center tracking-wider">
                    <span className="font-bold">THE FINANCIAL CHRONICLE</span>
                    <span className="text-[8px] font-mono">EDITION NO. 48,291</span>
                  </div>
                  <div className="h-full pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />
                  <div className="bg-amber-100/90 text-zinc-800 px-3 py-0.5 border-t border-zinc-400 font-serif text-[8px] flex justify-between">
                    <span>FULL PAGE ADVERTISEMENT</span>
                    <span>NEWSPRINT ARCHIVE</span>
                  </div>
                </div>
              )}

              {frameMockup && medium.id === 'social-post' && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded-full border border-zinc-800/80 text-[10px] text-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-bold text-zinc-950">
                        {productName[0] || 'B'}
                      </div>
                      <span className="font-semibold truncate max-w-[90px]">{productName.toLowerCase().replace(/\s+/g, '')}</span>
                      <span className="text-amber-400 text-[10px]">✓</span>
                    </div>
                    <span className="text-[9px] text-zinc-400">Sponsored</span>
                  </div>
                  <div className="bg-zinc-950/80 backdrop-blur-md p-2 rounded-xl border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                    <div className="flex items-center gap-3">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <MessageCircle className="w-3.5 h-3.5" />
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {frameMockup && medium.id === 'subway-poster' && (
                <div className="absolute inset-0 pointer-events-none z-10 border-[6px] border-zinc-700/80 rounded shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] flex flex-col justify-between">
                  <div className="bg-zinc-900/90 text-[8px] font-mono text-zinc-400 px-2 py-0.5 border-b border-zinc-700 flex justify-between">
                    <span>PLATFORM 4 • CONCOURSE LIGHTBOX</span>
                    <span>TRANSIT MEDIA</span>
                  </div>
                </div>
              )}

              {frameMockup && medium.id === 'magazine-spread' && (
                <div className="absolute inset-0 pointer-events-none z-10 flex">
                  {/* Center spine gutter shadow */}
                  <div className="w-full h-full border border-zinc-700/50 flex">
                    <div className="w-1/2 h-full border-r border-zinc-900/60 shadow-[inset_-8px_0_12px_rgba(0,0,0,0.5)]" />
                    <div className="w-1/2 h-full shadow-[inset_8px_0_12px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
              )}

              <img
                src={generatedData.imageUrl}
                alt={`${productName} on ${medium.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />

              {/* Hover actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3 z-20">
                <button
                  onClick={() => onOpenZoom(generatedData.imageUrl, `${productName} — ${medium.name}`)}
                  className="p-1.5 rounded-lg bg-zinc-900/95 text-white hover:bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1 shadow-lg"
                  title="Zoom full image"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenCompare(generatedData)}
                    className="p-1.5 rounded-lg bg-zinc-900/95 text-white hover:bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1 shadow-lg"
                    title="Compare consistency against Master Anchor"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compare</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-zinc-900/95 text-white hover:bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1 shadow-lg"
                    title="Download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-950/90">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center" />
                <Sparkles className="w-5 h-5 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <p className="text-xs font-semibold text-white mb-1">Nano-Banana Generating...</p>
              <p className="text-[11px] text-zinc-400 max-w-[200px] leading-tight">
                Maintaining exact product geometry and zero human presence in {medium.name}.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-500 bg-zinc-950/40">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2 text-zinc-400">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-zinc-400 mb-0.5">Ready to Imagine</p>
              <p className="text-[10px] text-zinc-600 max-w-[190px]">
                {hasMasterAnchor
                  ? 'Master product will be mapped into this medium with full consistency.'
                  : 'Generate the master anchor or generate directly.'}
              </p>
            </div>
          )}
        </div>

        {/* Consistency & Human constraints indicators */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Zero People</span>
          </div>
          {generatedData?.imageUrl ? (
            <div className="flex items-center gap-1 text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span>Consistent Anchor</span>
            </div>
          ) : (
            <span className="text-zinc-500">Nano-Banana Ready</span>
          )}
        </div>

        {/* Frame mockup toggle if generated */}
        {generatedData?.imageUrl && (
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-zinc-400">Mockup Frame Styling</span>
            <button
              onClick={() => setFrameMockup(!frameMockup)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                frameMockup
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {frameMockup ? 'Framed Mockup' : 'Raw Image'}
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Synthesizing...</span>
            </>
          ) : generatedData?.imageUrl ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Re-imagine {medium.name}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Imagine in {medium.name}</span>
            </>
          )}
        </button>

        {generatedData?.promptUsed && (
          <div className="mt-2">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors w-full text-center"
            >
              {showPrompt ? '▲ Hide Prompt' : '▼ Inspect Prompt Specs'}
            </button>
            {showPrompt && (
              <div className="mt-1.5 p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-mono leading-tight max-h-28 overflow-y-auto">
                {generatedData.promptUsed}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
