import React, { useState } from 'react';
import { MediumOption } from '../types';
import { X, Plus, Sparkles, Layers } from 'lucide-react';

interface AddMediumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedium: (medium: MediumOption) => void;
}

export const AddMediumModal: React.FC<AddMediumModalProps> = ({ isOpen, onClose, onAddMedium }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '3:4' | '9:16'>('16:9');
  const [category, setCategory] = useState<'outdoor' | 'print' | 'digital' | 'retail'>('outdoor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMedium: MediumOption = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `Custom brand placement in a ${name.toLowerCase()} commercial environment.`,
      aspectRatio,
      category,
      icon: 'Layers',
    };

    onAddMedium(newMedium);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Add Custom Medium</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Medium Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Airport Terminal Wall Mural / Coffee Cup Sleeve"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/60 text-xs"
              >
                <option value="16:9">16:9 (Landscape / Billboard)</option>
                <option value="1:1">1:1 (Square / Social)</option>
                <option value="4:3">4:3 (Standard / Newspaper)</option>
                <option value="3:4">3:4 (Vertical / Poster)</option>
                <option value="9:16">9:16 (Tall / Story / Pillar)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/60 text-xs"
              >
                <option value="outdoor">Outdoor / Urban</option>
                <option value="print">Print / Editorial</option>
                <option value="digital">Digital / Screen</option>
                <option value="retail">Retail / Packaging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Scene & Environment Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the environment (e.g. An illuminated LED display fixture in an airport transit lounge, sleek terrazzo flooring, zero people)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 text-xs leading-relaxed"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Zero-people constraint will automatically be enforced for this medium.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold transition-colors"
            >
              Add Medium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
