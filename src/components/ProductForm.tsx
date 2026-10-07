import React, { useState } from 'react';
import { ProductPreset, ColorItem } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';
import { Sparkles, Wand2, Palette, Box, Tag, RefreshCw } from 'lucide-react';

interface ProductFormProps {
  productName: string;
  setProductName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  tagline: string;
  setTagline: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  visualAnchor: string;
  setVisualAnchor: (val: string) => void;
  materials: string;
  setMaterials: (val: string) => void;
  styleVibe: string;
  setStyleVibe: (val: string) => void;
  colors: ColorItem[];
  setColors: (colors: ColorItem[]) => void;
  onEnhance: () => Promise<void>;
  isEnhancing: boolean;
  onGenerateMaster: () => void;
  isGeneratingMaster: boolean;
  hasMasterImage: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  productName,
  setProductName,
  category,
  setCategory,
  tagline,
  setTagline,
  description,
  setDescription,
  visualAnchor,
  setVisualAnchor,
  materials,
  setMaterials,
  styleVibe,
  setStyleVibe,
  colors,
  setColors,
  onEnhance,
  isEnhancing,
  onGenerateMaster,
  isGeneratingMaster,
  hasMasterImage,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('lumina-serum');
  const [newColorHex, setNewColorHex] = useState<string>('#E11D48');
  const [newColorName, setNewColorName] = useState<string>('Crimson');

  const applyPreset = (preset: ProductPreset) => {
    setSelectedPresetId(preset.id);
    setProductName(preset.name);
    setCategory(preset.category);
    setTagline(preset.tagline);
    setDescription(preset.description);
    setVisualAnchor(preset.visualAnchor);
    setMaterials(preset.materials);
    setStyleVibe(preset.styleVibe);
    setColors(preset.colors);
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">1. Define Your Product Identity</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Craft the physical anchor. Nano-Banana preserves these exact specs across all ad mediums.
          </p>
        </div>

        <button
          onClick={onEnhance}
          disabled={isEnhancing}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-xs font-medium text-amber-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Auto-enrich industrial design specs and campaign slogan"
        >
          {isEnhancing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{isEnhancing ? 'Enriching...' : 'AI Enhance Specs'}</span>
        </button>
      </div>

      {/* Preset Pills */}
      <div className="mb-5">
        <label className="text-xs font-medium text-zinc-400 mb-2 block">
          Quick Preset Inventions:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRODUCT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-zinc-200 truncate">{preset.name.split(' ')[0]}</div>
                <div className="text-[10px] text-zinc-500 truncate">{preset.category}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {/* Name and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Lumina Bioluminescent Serum"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Product Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Luxury Skincare / Consumer Tech"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
            <span>Campaign Tagline / Slogan</span>
            <span className="text-[10px] text-zinc-500">Rendered on billboard, paper, & ad layouts</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Glow from cellular light."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 pl-8"
            />
            <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Visual Anchor (The consistency engine) */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Consistency Anchor (Physical Specs & Geometry)
            </span>
            <span className="text-[10px] text-zinc-400">Strictly enforced across all shots</span>
          </label>
          <textarea
            rows={3}
            value={visualAnchor}
            onChange={(e) => setVisualAnchor(e.target.value)}
            placeholder="Describe the exact silhouette, shape, materials, logo placement, and finishes..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Materials and Style Vibe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Materials & Finishes</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="e.g. Frosted glass, brushed titanium, matte ceramic"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Brand Aesthetic Vibe</label>
            <input
              type="text"
              value={styleVibe}
              onChange={(e) => setStyleVibe(e.target.value)}
              placeholder="e.g. Minimalist Luxury, High-Tech Industrial, Organic Heritage"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Brand Color Palette
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {colors.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <span
                  className="w-3 h-3 rounded-full border border-white/20 inline-block shadow-inner"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-medium text-[11px]">{c.name}</span>
                <span className="font-mono text-[10px] text-zinc-500">{c.hex}</span>
                <button
                  type="button"
                  onClick={() => removeColor(idx)}
                  className="text-zinc-500 hover:text-red-400 ml-1 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name (e.g. Rose Gold)"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 flex-1 focus:outline-none focus:border-amber-500/60"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700"
            >
              Add Color
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <button
          onClick={onGenerateMaster}
          disabled={isGeneratingMaster}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isGeneratingMaster ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Generating Master Product Anchor with Nano-Banana...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>{hasMasterImage ? 'Regenerate Master Product Anchor' : 'Generate Master Product Anchor'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
