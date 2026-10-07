import React, { useState } from 'react';
import { Sparkles, Maximize2, Download, Info, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

interface MasterProductCardProps {
  productName: string;
  tagline: string;
  category: string;
  imageUrl: string | null;
  isGenerating: boolean;
  promptUsed: string | null;
  onOpenZoom: (url: string, title: string) => void;
}

export const MasterProductCard: React.FC<MasterProductCardProps> = ({
  productName,
  tagline,
  category,
  imageUrl,
  isGenerating,
  promptUsed,
  onOpenZoom,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-master-anchor.png`;
    a.click();
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-base font-semibold text-white">Master Product Anchor</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
            Anchor Shot (1:1)
          </span>
        </div>

        {/* Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 group">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <button
                  onClick={() => onOpenZoom(imageUrl, `${productName} — Master Product Anchor`)}
                  className="p-2 rounded-lg bg-zinc-900/90 text-white hover:bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-zinc-900/90 text-white hover:bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </>
          ) : isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950/90">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Synthesizing Product Core</h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                Nano-Banana is rendering the high-fidelity inanimate studio product anchor...
              </p>
              <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero Humans Constraint Enforced</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 bg-zinc-950/40">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-amber-400/60">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="text-sm font-medium text-zinc-300 mb-1">No Master Anchor Yet</p>
              <p className="text-xs text-zinc-500 max-w-xs mb-3">
                Click "Generate Master Product Anchor" or "Generate All Mediums" to establish the visual reference.
              </p>
              <div className="text-[11px] text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                Every subsequent medium uses this shot for 100% product consistency.
              </div>
            </div>
          )}
        </div>

        {/* Product Identity details */}
        <div className="mt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm">{productName || 'Product Name'}</h3>
              <p className="text-xs text-amber-400/90 font-medium">{tagline || 'Brand Tagline'}</p>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-medium">
              {category || 'Product'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Consistency Reference for Billboard, Newspaper & Social</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-400/90">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Verified: 100% Inanimate (No People)</span>
          </div>
        </div>
      </div>

      {promptUsed && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors"
          >
            <Info className="w-3 h-3 text-amber-400" />
            <span>{showPrompt ? 'Hide Nano-Banana Prompt' : 'View Nano-Banana Prompt'}</span>
          </button>
          {showPrompt && (
            <div className="mt-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 font-mono leading-relaxed max-h-36 overflow-y-auto">
              {promptUsed}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
