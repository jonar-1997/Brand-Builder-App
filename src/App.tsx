/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { MasterProductCard } from './components/MasterProductCard';
import { MediumCard } from './components/MediumCard';
import { ConsistencyInspectorModal } from './components/ConsistencyInspectorModal';
import { ZoomModal } from './components/ZoomModal';
import { CampaignKitModal } from './components/CampaignKitModal';
import { AddMediumModal } from './components/AddMediumModal';
import { DEFAULT_MEDIUMS, PRODUCT_PRESETS } from './data/presets';
import { MediumOption, GeneratedMedium, ColorItem } from './types';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Plus,
  SlidersHorizontal,
  PackageCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Initial product state loaded from first preset (Lumina Serum)
  const initialPreset = PRODUCT_PRESETS[0];

  const [productName, setProductName] = useState(initialPreset.name);
  const [category, setCategory] = useState(initialPreset.category);
  const [tagline, setTagline] = useState(initialPreset.tagline);
  const [description, setDescription] = useState(initialPreset.description);
  const [visualAnchor, setVisualAnchor] = useState(initialPreset.visualAnchor);
  const [materials, setMaterials] = useState(initialPreset.materials);
  const [styleVibe, setStyleVibe] = useState(initialPreset.styleVibe);
  const [colors, setColors] = useState<ColorItem[]>(initialPreset.colors);

  // Master product state
  const [masterImageUrl, setMasterImageUrl] = useState<string | null>(null);
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);
  const [masterPromptUsed, setMasterPromptUsed] = useState<string | null>(null);

  // Mediums state
  const [mediums, setMediums] = useState<MediumOption[]>(DEFAULT_MEDIUMS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [generatedMediums, setGeneratedMediums] = useState<Record<string, GeneratedMedium>>({});
  const [generatingStatus, setGeneratingStatus] = useState<Record<string, boolean>>({});
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);
  const [compareMedium, setCompareMedium] = useState<GeneratedMedium | null>(null);
  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [isAddMediumOpen, setIsAddMediumOpen] = useState(false);
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);

  // Auto-enrich specs with AI assistant
  const handleEnhance = async () => {
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/enhance-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription: description,
          category,
          brandVibe: styleVibe,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to enhance product');
      }

      const data = await res.json();
      if (data.tagline) setTagline(data.tagline);
      if (data.visualAnchorDescription) setVisualAnchor(data.visualAnchorDescription);
      if (data.colorPalette && Array.isArray(data.colorPalette)) {
        setColors(data.colorPalette);
      }
      if (data.brandVoice) setStyleVibe(data.brandVoice);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error enriching product details.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Master Anchor Shot
  const handleGenerateMaster = async () => {
    setIsGeneratingMaster(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription: description,
          visualAnchor,
          colorPalette: colors,
          materials,
          styleVibe,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate master product shot');
      }

      const data = await res.json();
      setMasterImageUrl(data.imageUrl);
      setMasterPromptUsed(data.promptUsed);
      if (data.isFallback) {
        setIsFallbackNotice(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating master image with Nano-Banana.');
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // Generate Single Medium Shot
  const handleGenerateMedium = async (medium: MediumOption, referenceImage?: string | null) => {
    setGeneratingStatus((prev) => ({ ...prev, [medium.id]: true }));
    setErrorMessage(null);

    const refImageToUse = referenceImage !== undefined ? referenceImage : masterImageUrl;

    try {
      const res = await fetch('/api/generate-medium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediumId: medium.id,
          mediumName: medium.name,
          aspectRatio: medium.aspectRatio,
          productName,
          productDescription: description,
          visualAnchor,
          tagline,
          referenceImageBase64: refImageToUse,
          customMediumPrompt: medium.defaultPrompt,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to generate image for ${medium.name}`);
      }

      const data = await res.json();
      if (data.isFallback) {
        setIsFallbackNotice(true);
      }
      setGeneratedMediums((prev) => ({
        ...prev,
        [medium.id]: {
          mediumId: medium.id,
          mediumName: medium.name,
          imageUrl: data.imageUrl,
          aspectRatio: data.aspectRatio,
          promptUsed: data.promptUsed,
          modelUsed: data.modelUsed,
          timestamp: data.timestamp,
        },
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || `Failed to render ${medium.name} with Nano-Banana.`);
    } finally {
      setGeneratingStatus((prev) => ({ ...prev, [medium.id]: false }));
    }
  };

  // Generate Complete Brand Campaign across all mediums
  const handleGenerateAllMediums = async () => {
    setIsBatchGenerating(true);
    setErrorMessage(null);

    let activeMasterUrl = masterImageUrl;

    // Step 1: If master image doesn't exist yet, synthesize it first!
    if (!activeMasterUrl) {
      setIsGeneratingMaster(true);
      try {
        const masterRes = await fetch('/api/generate-master', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName,
            productDescription: description,
            visualAnchor,
            colorPalette: colors,
            materials,
            styleVibe,
          }),
        });

        if (!masterRes.ok) {
          const errData = await masterRes.json();
          throw new Error(errData.error || 'Failed to synthesize master product anchor');
        }

        const masterData = await masterRes.json();
        setMasterImageUrl(masterData.imageUrl);
        setMasterPromptUsed(masterData.promptUsed);
        activeMasterUrl = masterData.imageUrl;
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Failed to generate master product anchor');
        setIsGeneratingMaster(false);
        setIsBatchGenerating(false);
        return;
      } finally {
        setIsGeneratingMaster(false);
      }
    }

    // Step 2: Now generate each medium using the master anchor for strict consistency
    const targetMediums = mediums.filter((m) =>
      activeCategory === 'all' ? true : m.category === activeCategory
    );

    for (const m of targetMediums) {
      await handleGenerateMedium(m, activeMasterUrl);
    }

    setIsBatchGenerating(false);
  };

  const handleAddCustomMedium = (newMedium: MediumOption) => {
    setMediums((prev) => [newMedium, ...prev]);
  };

  const filteredMediums = mediums.filter((m) =>
    activeCategory === 'all' ? true : m.category === activeCategory
  );

  const completedCount = Object.keys(generatedMediums).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-rose-950/40"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Free Tier / Declined Paid Key Notification Banner */}
        {isFallbackNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Brand Studio High-Definition Simulator Active: </span>
                <span>
                  Preserving exact product geometry, colors, and zero-people ad framing across all mediums. If you wish to use Nano-Banana neural generation in the future, you can attach a paid key in Settings &gt; Secrets.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsFallbackNotice(false)}
              className="text-amber-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-amber-950/40"
            >
              ×
            </button>
          </div>
        )}

        {/* Hero Banner / Value Proposition */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nano-Banana Generative Imaging System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Describe Your Product.{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                Imagine It Across Billboards, Newsprint & Social.
              </span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Brand Builder establishes a rigorous physical visual anchor, then renders your exact
              product across diverse real-world advertising mediums with unwavering consistency.
              Zero humans in any frame—pure commercial still life and architecture.
            </p>

            {/* Quick Guarantees Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Product Consistency Maintained</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>No People Anywhere (Strictly Inanimate)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Nano-Banana (gemini-3.1-flash-lite-image)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 & Master Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Product Identity (7 cols) */}
          <div className="lg:col-span-7">
            <ProductForm
              productName={productName}
              setProductName={setProductName}
              category={category}
              setCategory={setCategory}
              tagline={tagline}
              setTagline={setTagline}
              description={description}
              setDescription={setDescription}
              visualAnchor={visualAnchor}
              setVisualAnchor={setVisualAnchor}
              materials={materials}
              setMaterials={setMaterials}
              styleVibe={styleVibe}
              setStyleVibe={setStyleVibe}
              colors={colors}
              setColors={setColors}
              onEnhance={handleEnhance}
              isEnhancing={isEnhancing}
              onGenerateMaster={handleGenerateMaster}
              isGeneratingMaster={isGeneratingMaster}
              hasMasterImage={Boolean(masterImageUrl)}
            />
          </div>

          {/* Right Card: Master Product Anchor (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <MasterProductCard
              productName={productName}
              tagline={tagline}
              category={category}
              imageUrl={masterImageUrl}
              isGenerating={isGeneratingMaster}
              promptUsed={masterPromptUsed}
              onOpenZoom={(url, title) => setZoomImage({ url, title })}
            />
          </div>
        </div>

        {/* Section 2: Imagine Across Mediums */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  2. Imagine Across Advertising Mediums
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Visualizing "{productName}" across physical billboards, newspapers, social feeds, and more.
              </p>
            </div>

            {/* Campaign Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddMediumOpen(true)}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Custom Medium</span>
              </button>

              {completedCount > 0 && (
                <button
                  onClick={() => setIsKitModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Campaign Kit ({completedCount})</span>
                </button>
              )}

              <button
                onClick={handleGenerateAllMediums}
                disabled={isBatchGenerating || isGeneratingMaster}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isBatchGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                    <span>Rendering Mediums...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Imagine All Mediums</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80 text-xs">
              {[
                { id: 'all', label: 'All Mediums' },
                { id: 'outdoor', label: 'Outdoor / Billboards' },
                { id: 'print', label: 'Print & Newspapers' },
                { id: 'digital', label: 'Social & Digital' },
                { id: 'retail', label: 'Retail & Unboxing' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeCategory === tab.id
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-500 flex items-center gap-2">
              <span>{filteredMediums.length} Mediums Available</span>
              <span>•</span>
              <span className="text-amber-400/90 font-medium">{completedCount} Rendered</span>
            </div>
          </div>

          {/* Mediums Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMediums.map((medium) => (
              <MediumCard
                key={medium.id}
                medium={medium}
                generatedData={generatedMediums[medium.id]}
                isGenerating={Boolean(generatingStatus[medium.id])}
                onGenerate={() => handleGenerateMedium(medium)}
                onOpenZoom={(url, title) => setZoomImage({ url, title })}
                onOpenCompare={(item) => setCompareMedium(item)}
                hasMasterAnchor={Boolean(masterImageUrl)}
                productName={productName}
                tagline={tagline}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ZoomModal
        isOpen={Boolean(zoomImage)}
        onClose={() => setZoomImage(null)}
        imageUrl={zoomImage?.url || null}
        title={zoomImage?.title || 'Inspect Image'}
      />

      <ConsistencyInspectorModal
        isOpen={Boolean(compareMedium)}
        onClose={() => setCompareMedium(null)}
        masterImageUrl={masterImageUrl}
        productName={productName}
        tagline={tagline}
        selectedMedium={compareMedium}
      />

      <CampaignKitModal
        isOpen={isKitModalOpen}
        onClose={() => setIsKitModalOpen(false)}
        productName={productName}
        category={category}
        tagline={tagline}
        description={description}
        visualAnchor={visualAnchor}
        materials={materials}
        styleVibe={styleVibe}
        colors={colors}
        masterImageUrl={masterImageUrl}
        generatedMediums={generatedMediums}
      />

      <AddMediumModal
        isOpen={isAddMediumOpen}
        onClose={() => setIsAddMediumOpen(false)}
        onAddMedium={handleAddCustomMedium}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Brand Builder</span>
            <span>—</span>
            <span>Multi-Medium Advertising Visualizer</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>Model: Nano-Banana (gemini-3.1-flash-lite-image)</span>
            <span>•</span>
            <span className="text-emerald-400">100% Inanimate Constraint Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
