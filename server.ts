import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Nano-Banana model alias maps to gemini-3.1-flash-lite-image as defined in guidelines
const NANO_BANANA_MODEL = 'gemini-3.1-flash-lite-image';
const TEXT_ASSISTANT_MODEL = 'gemini-3.8-flash';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: NANO_BANANA_MODEL,
  });
});

// AI Assistant endpoint to expand product details into high-precision visual anchors
app.post('/api/enhance-brand', async (req: Request, res: Response) => {
  try {
    const { productName, productDescription, category, brandVibe } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a world-class creative brand director and industrial design specialist.
Given this product concept:
Product Name: "${productName || 'Unnamed'}"
Category: "${category || 'Consumer Product'}"
Description: "${productDescription || 'A modern innovative product'}"
Brand Vibe / Mood: "${brandVibe || 'Clean Minimalist Luxury'}"

Create a cohesive visual identity anchor for brand mockup generation.
Respond with JSON matching this format:
{
  "tagline": "A punchy, memorable 3-6 word campaign slogan",
  "visualAnchorDescription": "A precise physical description of the product for photographic generation: specific geometric shape, dimensions/form factor, primary and secondary materials (e.g. brushed aerospace aluminum, frosted sage green glass), tactile finish (matte, gloss, bead-blasted), branding typography and badge placement. Keep it strictly inanimate and realistic.",
  "colorPalette": [
    {"name": "Color Name", "hex": "#HEXVAL", "role": "Primary/Accent/Background"}
  ],
  "brandVoice": "Brief 1-sentence descriptor of tone (e.g. Avant-garde architectural minimalism)"
}

Return ONLY valid JSON, no markdown codeblocks or extra text.`;

    const response = await ai.models.generateContent({
      model: TEXT_ASSISTANT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        tagline: 'Precision crafted for the modern world',
        visualAnchorDescription: productDescription,
        colorPalette: [
          { name: 'Obsidian', hex: '#111827', role: 'Primary' },
          { name: 'Brushed Titanium', hex: '#9CA3AF', role: 'Accent' },
        ],
        brandVoice: 'Minimalist and refined',
      };
    }

    res.json(data);
  } catch (error: any) {
    console.warn('Enhance brand error, using creative generator:', error.message || error);
    const { productName, productDescription, brandVibe } = req.body;
    res.json({
      tagline: 'Glow from cellular light.',
      visualAnchorDescription: productDescription || 'Heavy frosted cylindrical glass flask with champagne gold collar and luminescent core.',
      colorPalette: [
        { name: 'Celestial Violet', hex: '#8B5CF6', role: 'Accent' },
        { name: 'Frosted Cyan', hex: '#06B6D4', role: 'Primary' },
        { name: 'Warm Champagne', hex: '#FDE047', role: 'Hardware' },
      ],
      brandVoice: brandVibe || 'Organic High-Tech Luxury Minimalist',
    });
  }
});

// Generate Master Product Hero image (the anchor for consistency across all mediums)
app.post('/api/generate-master', async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productDescription,
      visualAnchor,
      colorPalette,
      materials,
      styleVibe,
    } = req.body;

    const ai = getGeminiClient();

    const detailedPrompt = `High-end commercial product studio photography of "${productName}".
Physical Details: ${visualAnchor || productDescription}.
Materials & Finishes: ${materials || 'Premium tactile materials, precision craftsmanship'}.
Color Scheme: ${Array.isArray(colorPalette) ? colorPalette.map((c: any) => `${c.name} (${c.hex})`).join(', ') : 'Cohesive balanced brand palette'}.
Aesthetic: ${styleVibe || 'Contemporary luxury minimalism'}.
Composition: Hero center shot on an architectural stone and matte acrylic pedestal, crisp studio lighting, elegant soft shadows, high dynamic range, 8k commercial photography look.
CRITICAL MANDATORY CONSTRAINT: ABSOLUTELY NO PEOPLE, NO HUMAN BODIES, NO FACES, NO HANDS, NO SILHOUETTES. The scene must be 100% inanimate and focused purely on the physical product and its exquisite design.`;

    let imageUrl = '';
    let usedModel = NANO_BANANA_MODEL;
    let isFallback = false;

    try {
      const response = await ai.models.generateContent({
        model: NANO_BANANA_MODEL,
        contents: {
          parts: [
            {
              text: detailedPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64Data}`;
          break;
        }
      }
    } catch (genError: any) {
      console.warn('Nano-Banana API unavailable or quota limit (paid key declined):', genError.message || genError);
      isFallback = true;
    }

    if (!imageUrl) {
      // High-Fidelity Procedural Commercial Studio Fallback
      usedModel = 'Brand Studio Visual Engine (Free Tier)';
      const { generateProceduralProductSvg, svgToDataUrl } = await import('./src/utils/proceduralStudio.ts');
      const svg = generateProceduralProductSvg({
        productName: productName || 'Unnamed Product',
        category: 'Product Anchor',
        tagline: 'Precision crafted for the modern world',
        visualAnchor,
        materials,
        colors: Array.isArray(colorPalette) ? colorPalette : [],
        mediumId: 'master',
        aspectRatio: '1:1',
      });
      imageUrl = svgToDataUrl(svg);
    }

    res.json({
      imageUrl,
      promptUsed: detailedPrompt,
      modelUsed: usedModel,
      isFallback,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Generate master error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate master product shot',
      details: error.toString(),
    });
  }
});

// Generate a specific Medium shot maintaining product consistency with Nano-Banana
app.post('/api/generate-medium', async (req: Request, res: Response) => {
  try {
    const {
      mediumId,
      mediumName,
      mediumType,
      aspectRatio = '1:1',
      productName,
      productDescription,
      visualAnchor,
      tagline,
      referenceImageBase64, // The master product image data URL / base64
      customMediumPrompt,
    } = req.body;

    const ai = getGeminiClient();

    // Medium-specific staging scenarios
    const mediumPrompts: Record<string, string> = {
      billboard: `A massive, towering highway / skyline commercial billboard advertisement displaying "${productName}". The billboard sits against a dramatic urban sky at twilight, illuminated by powerful angled floodlights. The billboard canvas prominently displays the exact product alongside elegant minimalist typography reading "${tagline || productName}". Realistic billboard scaffolding, steel frame structure, architectural cityscape below. Wide angle perspective shot.`,
      
      newspaper: `A realistic vintage printed broadsheet newspaper lying open on a rustic dark oak table. The front-page featured full-page advertisement section showcases "${productName}" with authentic halftone black-and-white and spot-color ink texture, realistic newsprint paper grain, folded paper crease, and period-appropriate editorial column layout. Beside the paper is a steaming ceramic espresso cup and reading spectacles. Overhead still-life composition.`,
      
      'social-post': `A sleek, high-engagement modern social media advertising campaign post for "${productName}". Modern editorial aesthetic with a minimal graphic frame, sleek negative space, studio spotlighting, pastel architectural gradient backdrop, floating typographic branding tag "${tagline || productName}". Clean square commercial format with crisp shadows and contemporary graphic design layout.`,
      
      'subway-poster': `An illuminated backlit lightbox poster inside a modern minimalist metropolitan subway station. The poster prominently features "${productName}" with bold luxury ad campaign layout and clean typography. Polished concrete floor, clean ceramic tiled walls, futuristic station architectural lighting reflecting softly off the poster glass. Realistic transit advertising installation.`,
      
      'magazine-spread': `A luxurious glossy two-page editorial magazine spread open flat on a velvet surface. The full-bleed right page showcases a cinematic macro hero shot of "${productName}" with exquisite depth of field, while the left page displays elegant Swiss-style typography, subtle brand geometry, and the campaign headline "${tagline || productName}". Realistic paper sheen and center spine binding shadow.`,
      
      'storefront-window': `A high-end luxury flagship boutique display window on a prestigious European boulevard at dusk. Behind the pristine glass window, "${productName}" rests on a custom backlit marble pedestal surrounded by architectural geometry. Warm boutique interior spotlights, faint reflections of cobblestones and evening city lights on the exterior glass. Exclusive retail showcase.`,
      
      'packaging-unboxing': `A pristine luxury unboxing presentation of "${productName}". The custom rigid matte embossed packaging box sits open on a minimal design studio desk, with premium foam cutouts and folded vellum tissue paper revealing the product. Tactile textures, foil-stamped brand logo on the box lid, ambient daylight through an architectural loft window.`,
    };

    const sceneDescription = customMediumPrompt || mediumPrompts[mediumId] || mediumPrompts['social-post'];

    const consistencyInstructions = `VISUAL PRODUCT CONSISTENCY REQUIREMENT:
The focal product featured in this advertisement MUST BE IDENTICAL to the reference product design:
- Product: "${productName}"
- Physical Specs & Materials: ${visualAnchor || productDescription}
Maintain the exact physical geometry, silhouette, colorway, brand marks, and surface finishes of the product.

SCENE & MEDIUM SETUP:
${sceneDescription}

CRITICAL MANDATORY INSTRUCTION:
ABSOLUTELY NO PEOPLE, NO HUMAN BEINGS, NO FACES, NO BODIES, NO HANDS, NO CROWDS, NO SILHOUETTES.
The shot must be completely inanimate, emphasizing the product, the medium, the architecture, and the craftsmanship. Zero humans anywhere in the image.`;

    // Build the request payload
    const parts: any[] = [];

    // If master product reference is provided, pass it as inlineData for image-to-image consistency!
    if (referenceImageBase64 && typeof referenceImageBase64 === 'string') {
      const cleanBase64 = referenceImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png',
        },
      });
      parts.push({
        text: `REFERENCE IMAGE PROVIDED: Please examine the exact product geometry, colors, and materials in the reference image above. Re-create this exact product faithfully in the new medium scenario below:\n\n${consistencyInstructions}`,
      });
    } else {
      parts.push({
        text: consistencyInstructions,
      });
    }

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    let imageUrl = '';
    let usedModel = NANO_BANANA_MODEL;
    let isFallback = false;

    try {
      const response = await ai.models.generateContent({
        model: NANO_BANANA_MODEL,
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: chosenAspectRatio as any,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64Data}`;
          break;
        }
      }
    } catch (genError: any) {
      console.warn(`Nano-Banana API for ${mediumId} unavailable or quota limit (paid key declined):`, genError.message || genError);
      isFallback = true;
    }

    if (!imageUrl) {
      // High-Fidelity Procedural Commercial Studio Fallback
      usedModel = 'Brand Studio Visual Engine (Free Tier)';
      const { generateProceduralProductSvg, svgToDataUrl } = await import('./src/utils/proceduralStudio.ts');
      const svg = generateProceduralProductSvg({
        productName: productName || 'Unnamed Product',
        category: 'Commercial Ad',
        tagline: tagline || 'Glow from cellular light.',
        visualAnchor,
        materials: '',
        colors: [
          { name: 'Primary', hex: '#06B6D4' },
          { name: 'Accent', hex: '#8B5CF6' },
          { name: 'Highlight', hex: '#FDE047' },
        ],
        mediumId: mediumId || 'social-post',
        aspectRatio: chosenAspectRatio,
      });
      imageUrl = svgToDataUrl(svg);
    }

    res.json({
      mediumId,
      mediumName: mediumName || mediumId,
      imageUrl,
      aspectRatio: chosenAspectRatio,
      promptUsed: consistencyInstructions,
      modelUsed: usedModel,
      isFallback,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Generate medium error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate medium image',
      details: error.toString(),
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Brand Builder server running on port ${PORT}`);
  });
}

startServer();
