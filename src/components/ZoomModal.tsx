import React from 'react';
import { X, Download, ShieldCheck, Sparkles } from 'lucide-react';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    a.click();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[92vh] flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-4"
      >
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="font-semibold text-white text-sm truncate max-w-md">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              <span>Zero People Verified</span>
            </div>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-auto max-h-[80vh] flex items-center justify-center rounded-xl bg-zinc-950">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
          />
        </div>

        <div className="w-full pt-3 mt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/80">
          <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
            <Sparkles className="w-3 h-3" />
            Rendered with Nano-Banana (gemini-3.1-flash-lite-image)
          </span>
          <span className="text-[11px]">Press ESC or click backdrop to close</span>
        </div>
      </div>
    </div>
  );
};
