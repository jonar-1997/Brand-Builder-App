import React from 'react';
import { GeneratedMedium, ColorItem } from '../types';
import { X, Download, FileJson, CheckCircle2, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface CampaignKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  category: string;
  tagline: string;
  description: string;
  visualAnchor: string;
  materials: string;
  styleVibe: string;
  colors: ColorItem[];
  masterImageUrl: string | null;
  generatedMediums: Record<string, GeneratedMedium>;
}

export const CampaignKitModal: React.FC<CampaignKitModalProps> = ({
  isOpen,
  onClose,
  productName,
  category,
  tagline,
  description,
  visualAnchor,
  materials,
  styleVibe,
  colors,
  masterImageUrl,
  generatedMediums,
}) => {
  if (!isOpen) return null;

  const allMediumList = Object.values(generatedMediums);

  const exportJSON = () => {
    const data = {
      product: {
        name: productName,
        category,
        tagline,
        description,
        visualAnchor,
        materials,
        styleVibe,
        colorPalette: colors,
      },
      metadata: {
        model: 'gemini-3.1-flash-lite-image (Nano-Banana)',
        generatedAt: new Date().toISOString(),
        consistencyEnforced: true,
        zeroPeopleEnforced: true,
      },
      campaignShots: [
        ...(masterImageUrl
          ? [
              {
                id: 'master-anchor',
                name: 'Master Product Anchor',
                aspectRatio: '1:1',
                imageUrl: masterImageUrl,
              },
            ]
          : []),
        ...allMediumList.map((m) => ({
          id: m.mediumId,
          name: m.mediumName,
          aspectRatio: m.aspectRatio,
          imageUrl: m.imageUrl,
          promptUsed: m.promptUsed,
        })),
      ],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-brand-campaign-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Brand Campaign Kit & Asset Export</h2>
              <p className="text-xs text-zinc-400">Complete multi-medium campaign package for {productName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON Kit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity Brief Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">{productName}</h3>
                <p className="text-xs text-amber-400 font-medium">{tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                  {category}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  {styleVibe}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{visualAnchor || description}</p>

            <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Palette:</span>
                <div className="flex items-center gap-1.5">
                  {colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]"
                    >
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.hex }} />
                      <span className="text-zinc-300">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero People Enforced
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> Nano-Banana Engine
                </span>
              </div>
            </div>
          </div>

          {/* Media Assets Gallery */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Generated Campaign Assets ({1 + allMediumList.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {masterImageUrl && (
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 group relative">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                    <img
                      src={masterImageUrl}
                      alt="Master Anchor"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white truncate">Master Anchor</span>
                    <span className="text-zinc-500 font-mono text-[9px]">1:1</span>
                  </div>
                </div>
              )}

              {allMediumList.map((m) => (
                <div key={m.mediumId} className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 group relative">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                    <img
                      src={m.imageUrl}
                      alt={m.mediumName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white truncate">{m.mediumName}</span>
                    <span className="text-zinc-500 font-mono text-[9px]">{m.aspectRatio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-400">
          <span>{allMediumList.length} Campaign Mediums Generated</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
