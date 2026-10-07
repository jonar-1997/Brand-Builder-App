import React, { useState } from 'react';
import { GeneratedMedium } from '../types';
import { X, ShieldCheck, CheckCircle2, Sparkles, Layers, Sliders, ArrowRightLeft } from 'lucide-react';

interface ConsistencyInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterImageUrl: string | null;
  productName: string;
  tagline: string;
  selectedMedium: GeneratedMedium | null;
}

export const ConsistencyInspectorModal: React.FC<ConsistencyInspectorModalProps> = ({
  isOpen,
  onClose,
  masterImageUrl,
  productName,
  tagline,
  selectedMedium,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');

  if (!isOpen || !selectedMedium) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Brand Consistency Inspector</h2>
              <p className="text-xs text-zinc-400">
                Verifying product fidelity between Master Studio Anchor and {selectedMedium.mediumName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700 text-xs">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-zinc-900 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'slider'
                    ? 'bg-zinc-900 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Overlay Diff
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparison Area */}
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Master Shot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Master Product Anchor (Baseline Reference)
                  </span>
                  <span className="text-zinc-400 font-mono text-[10px]">1:1 Studio</span>
                </div>
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner">
                  {masterImageUrl ? (
                    <img
                      src={masterImageUrl}
                      alt="Master product anchor"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                      No master image generated
                    </div>
                  )}
                </div>
              </div>

              {/* Medium Shot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {selectedMedium.mediumName} (Nano-Banana)
                  </span>
                  <span className="text-zinc-400 font-mono text-[10px]">
                    {selectedMedium.aspectRatio} Context
                  </span>
                </div>
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner">
                  <img
                    src={selectedMedium.imageUrl}
                    alt={selectedMedium.mediumName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Left: Master Anchor</span>
                <span>Drag slider to compare alignment</span>
                <span>Right: {selectedMedium.mediumName}</span>
              </div>
              <div className="relative aspect-video max-h-[420px] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 select-none">
                {/* Background Image (Medium) */}
                <img
                  src={selectedMedium.imageUrl}
                  alt={selectedMedium.mediumName}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground Image (Master) clipped */}
                {masterImageUrl && (
                  <div
                    className="absolute inset-0 overflow-hidden border-r-2 border-amber-400"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={masterImageUrl}
                      alt="Master anchor"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                    />
                  </div>
                )}

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg text-xs">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          )}

          {/* Verification Criteria Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Physical Consistency</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Identical form factor, silhouette geometry, material textures, and brand label placement preserved.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Zero People Enforced</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Strict negative human prompts enforced in Nano-Banana. Zero human bodies, hands, faces, or silhouettes.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Nano-Banana Synthesis</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Rendered via <span className="font-mono text-zinc-300">gemini-3.1-flash-lite-image</span> with image reference injection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px]">Model: gemini-3.1-flash-lite-image</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
