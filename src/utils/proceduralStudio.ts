import { ColorItem } from '../types';

interface GenerateVisualOptions {
  productName: string;
  category: string;
  tagline: string;
  visualAnchor: string;
  materials: string;
  colors: ColorItem[];
  mediumId?: string; // 'master', 'billboard', 'newspaper', 'social-post', etc.
  aspectRatio?: string;
}

export function generateProceduralProductSvg(options: GenerateVisualOptions): string {
  const {
    productName,
    category,
    tagline,
    colors,
    mediumId = 'master',
    aspectRatio = '1:1',
  } = options;

  const primaryColor = colors[0]?.hex || '#06B6D4';
  const accentColor = colors[1]?.hex || '#8B5CF6';
  const tertiaryColor = colors[2]?.hex || '#FDE047';

  let width = 1000;
  let height = 1000;

  if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  } else if (aspectRatio === '4:3') {
    width = 1024;
    height = 768;
  } else if (aspectRatio === '3:4') {
    width = 768;
    height = 1024;
  } else if (aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  // 1. MASTER PRODUCT HERO SHOT (Studio Still Life)
  if (mediumId === 'master' || mediumId === 'packaging-unboxing') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <radialGradient id="studioBg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#18181b" />
          <stop offset="50%" stop-color="#09090b" />
          <stop offset="100%" stop-color="#020203" />
        </radialGradient>
        <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3f3f46" />
          <stop offset="25%" stop-color="#27272a" />
          <stop offset="100%" stop-color="#18181b" />
        </linearGradient>
        <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.9" />
          <stop offset="60%" stop-color="${accentColor}" stop-opacity="0.8" />
          <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.95" />
        </linearGradient>
        <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
          <stop offset="20%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="80%" stop-color="#ffffff" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25" />
        </linearGradient>
        <linearGradient id="metalCollar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${tertiaryColor}" />
          <stop offset="35%" stop-color="#ffffff" />
          <stop offset="70%" stop-color="${tertiaryColor}" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
        <radialGradient id="coreAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.6" />
          <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="30" stdDeviation="25" flood-color="#000" flood-opacity="0.9" />
        </filter>
      </defs>

      <!-- Background Studio Environment -->
      <rect width="${width}" height="${height}" fill="url(#studioBg)" />

      <!-- Ambient Lighting Cones -->
      <ellipse cx="${width / 2}" cy="150" rx="350" ry="120" fill="#ffffff" opacity="0.03" />
      <ellipse cx="${width / 2}" cy="500" rx="420" ry="320" fill="url(#coreAura)" />

      <!-- Stone/Acrylic Studio Pedestal -->
      <g filter="url(#softShadow)">
        <ellipse cx="${width / 2}" cy="780" rx="280" ry="55" fill="url(#pedestalGrad)" />
        <path d="M ${width / 2 - 280} 780 C ${width / 2 - 280} 830, ${width / 2 + 280} 830, ${width / 2 + 280} 780 L ${width / 2 + 280} 860 C ${width / 2 + 280} 910, ${width / 2 - 280} 910, ${width / 2 - 280} 860 Z" fill="#18181b" />
        <ellipse cx="${width / 2}" cy="860" rx="280" ry="50" fill="#09090b" opacity="0.7" />
        <ellipse cx="${width / 2}" cy="780" rx="275" ry="50" fill="none" stroke="#52525b" stroke-width="2" opacity="0.4" />
      </g>

      <!-- Contact Shadow of Product -->
      <ellipse cx="${width / 2}" cy="755" rx="110" ry="22" fill="#000000" opacity="0.8" />

      <!-- Product Vessel (Cylindrical Frosted Flask / Device) -->
      <g id="productGroup" filter="url(#softShadow)">
        <!-- Core Bioluminescent Fluid / Tech Interior -->
        <rect x="${width / 2 - 80}" y="420" width="160" height="310" rx="30" fill="url(#bodyGlow)" filter="url(#glow)" />

        <!-- Frosted Glass Outer Vessel -->
        <rect x="${width / 2 - 85}" y="410" width="170" height="330" rx="35" fill="none" stroke="#a1a1aa" stroke-width="2.5" opacity="0.5" />
        <rect x="${width / 2 - 85}" y="410" width="170" height="330" rx="35" fill="url(#glassReflection)" />

        <!-- Vertical Specular Highlight -->
        <rect x="${width / 2 - 70}" y="430" width="14" height="290" rx="7" fill="#ffffff" opacity="0.4" />
        <rect x="${width / 2 + 55}" y="430" width="6" height="290" rx="3" fill="#ffffff" opacity="0.2" />

        <!-- Product Branding Typography on Bottle Body -->
        <g opacity="0.85">
          <text x="${width / 2}" y="530" font-family="system-ui, sans-serif" font-size="15" font-weight="700" letter-spacing="4" fill="#ffffff" text-anchor="middle">${productName.toUpperCase()}</text>
          <line x1="${width / 2 - 40}" y1="545" x2="${width / 2 + 40}" y2="545" stroke="#ffffff" stroke-width="1" opacity="0.4" />
          <text x="${width / 2}" y="565" font-family="system-ui, sans-serif" font-size="10" font-weight="500" letter-spacing="2" fill="#e4e4e7" text-anchor="middle">${category.toUpperCase()}</text>
          <text x="${width / 2}" y="670" font-family="system-ui, sans-serif" font-size="9" font-weight="400" letter-spacing="3" fill="#a1a1aa" text-anchor="middle">50 ML • 1.7 FL. OZ.</text>
        </g>

        <!-- Metallic Collar / Ring -->
        <rect x="${width / 2 - 50}" y="375" width="100" height="40" rx="6" fill="url(#metalCollar)" stroke="#d97706" stroke-width="1" />
        <ellipse cx="${width / 2}" cy="375" rx="50" ry="10" fill="#fef3c7" opacity="0.6" />

        <!-- Dropper Pipette Pip / Dispenser Crown -->
        <path d="M ${width / 2 - 32} 375 C ${width / 2 - 32} 310, ${width / 2 + 32} 310, ${width / 2 + 32} 375 Z" fill="#27272a" />
        <path d="M ${width / 2 - 30} 375 C ${width / 2 - 30} 315, ${width / 2 - 15} 315, ${width / 2 - 15} 375 Z" fill="#ffffff" opacity="0.25" />
      </g>

      <!-- Clean Minimalist Studio Text Overlay -->
      <text x="60" y="80" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="4" fill="#71717a">STUDIO ANCHOR REF // 01</text>
      <text x="60" y="105" font-family="system-ui, sans-serif" font-size="20" font-weight="800" letter-spacing="1" fill="#ffffff">${productName}</text>
      <text x="60" y="130" font-family="system-ui, sans-serif" font-size="13" font-weight="400" fill="#a1a1aa">${tagline}</text>

      <text x="${width - 60}" y="80" font-family="system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="#10b981" text-anchor="end">● ZERO PEOPLE • INANIMATE</text>
      <text x="${width - 60}" y="100" font-family="system-ui, sans-serif" font-size="10" font-weight="500" letter-spacing="1" fill="#71717a" text-anchor="end">NANO-BANANA ENGINE MOCKUP</text>
    </svg>`;
  }

  // 2. HIGHWAY BILLBOARD MEDIUM (16:9 Monumental Architecture & Skyline)
  if (mediumId === 'billboard') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="40%" stop-color="#1e1b4b" />
          <stop offset="70%" stop-color="#311042" />
          <stop offset="90%" stop-color="#831843" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>
        <linearGradient id="billboardCanvas" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#09090b" />
          <stop offset="50%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>
        <linearGradient id="spotlightBeam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="productGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="${accentColor}" />
        </linearGradient>
      </defs>

      <!-- Dramatic Twilight Sky -->
      <rect width="${width}" height="${height}" fill="url(#twilightSky)" />

      <!-- Distant City Skyline Silhouettes -->
      <g fill="#09090b" opacity="0.95">
        <rect x="50" y="520" width="80" height="200" />
        <rect x="110" y="480" width="70" height="240" />
        <rect x="160" y="440" width="90" height="280" />
        <polygon points="205,390 195,440 215,440" />
        <rect x="230" y="500" width="60" height="220" />
        <rect x="980" y="470" width="70" height="250" />
        <rect x="1040" y="430" width="85" height="290" />
        <polygon points="1082,370 1072,430 1092,430" />
        <rect x="1115" y="510" width="60" height="210" />
        <rect x="1165" y="490" width="80" height="230" />
      </g>

      <!-- Skyline Windows twinkle -->
      <g fill="#fef08a" opacity="0.3">
        <circle cx="130" cy="510" r="1.5" /><circle cx="150" cy="530" r="1.5" />
        <circle cx="180" cy="460" r="1.5" /><circle cx="200" cy="480" r="1.5" />
        <circle cx="1060" cy="450" r="1.5" /><circle cx="1080" cy="470" r="1.5" />
      </g>

      <!-- Highway Road Surface at base (Empty, No Cars, No People) -->
      <rect x="0" y="660" width="${width}" height="60" fill="#030712" />
      <line x1="0" y1="690" x2="${width}" y2="690" stroke="#fef08a" stroke-width="3" stroke-dasharray="25 25" opacity="0.4" />

      <!-- Billboard Steel Support Pillars -->
      <rect x="${width / 2 - 15}" y="380" width="30" height="300" fill="#27272a" />
      <line x1="${width / 2 - 70}" y1="520" x2="${width / 2 + 70}" y2="440" stroke="#3f3f46" stroke-width="4" />
      <line x1="${width / 2 + 70}" y1="520" x2="${width / 2 - 70}" y2="440" stroke="#3f3f46" stroke-width="4" />

      <!-- Massive Billboard Canvas Frame -->
      <g id="billboardStructure">
        <!-- Outer Steel Frame -->
        <rect x="140" y="80" width="1000" height="380" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="8" />

        <!-- Inner Printed Canvas -->
        <rect x="150" y="90" width="980" height="360" rx="3" fill="url(#billboardCanvas)" />

        <!-- Ambient Backdrop Gradient inside Canvas -->
        <rect x="150" y="90" width="980" height="360" rx="3" fill="${primaryColor}" opacity="0.15" />
        <circle cx="900" cy="270" r="240" fill="${accentColor}" opacity="0.2" />

        <!-- Spotlights on Top of Billboard -->
        <g id="spotlights">
          <rect x="250" y="60" width="14" height="20" fill="#52525b" />
          <circle cx="257" cy="62" r="7" fill="#ffffff" />
          <polygon points="257,62 180,260 350,260" fill="url(#spotlightBeam)" />

          <rect x="520" y="60" width="14" height="20" fill="#52525b" />
          <circle cx="527" cy="62" r="7" fill="#ffffff" />
          <polygon points="527,62 440,260 620,260" fill="url(#spotlightBeam)" />

          <rect x="780" y="60" width="14" height="20" fill="#52525b" />
          <circle cx="787" cy="62" r="7" fill="#ffffff" />
          <polygon points="787,62 700,260 880,260" fill="url(#spotlightBeam)" />

          <rect x="1000" y="60" width="14" height="20" fill="#52525b" />
          <circle cx="1007" cy="62" r="7" fill="#ffffff" />
          <polygon points="1007,62 920,260 1100,260" fill="url(#spotlightBeam)" />
        </g>

        <!-- EXACT PRODUCT RE-RENDERED ON BILLBOARD CANVAS (Product Consistency!) -->
        <g transform="translate(860, 130) scale(0.65)">
          <!-- Product Aura -->
          <ellipse cx="100" cy="230" rx="140" ry="160" fill="${primaryColor}" opacity="0.4" />
          <!-- Product Body -->
          <rect x="30" y="110" width="140" height="250" rx="25" fill="url(#productGlow)" />
          <rect x="30" y="110" width="140" height="250" rx="25" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5" />
          <rect x="42" y="125" width="12" height="220" rx="6" fill="#ffffff" opacity="0.5" />
          <!-- Typography on bottle -->
          <text x="100" y="200" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="#ffffff" text-anchor="middle">${productName.toUpperCase().slice(0, 10)}</text>
          <!-- Metallic Collar & Crown -->
          <rect x="55" y="80" width="90" height="30" rx="5" fill="${tertiaryColor}" />
          <path d="M 75 80 C 75 30, 125 30, 125 80 Z" fill="#27272a" />
          <ellipse cx="100" cy="380" rx="90" ry="16" fill="#000000" opacity="0.7" />
        </g>

        <!-- Billboard Ad Copy & Typography -->
        <g transform="translate(200, 150)">
          <text x="0" y="40" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="${tertiaryColor}">NEW REVOLUTIONARY FORMULA</text>
          <text x="0" y="105" font-family="system-ui, sans-serif" font-size="52" font-weight="900" letter-spacing="-1" fill="#ffffff">${productName}</text>
          <text x="0" y="160" font-family="system-ui, sans-serif" font-size="24" font-weight="500" fill="#cbd5e1">"${tagline}"</text>
          
          <rect x="0" y="200" width="220" height="42" rx="8" fill="#ffffff" />
          <text x="110" y="227" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="#09090b" text-anchor="middle">AVAILABLE WORLDWIDE</text>
        </g>

        <!-- Billboard Infrastructure Trim -->
        <text x="${width / 2}" y="450" font-family="monospace" font-size="9" fill="#71717a" text-anchor="middle">HIGHWAY CLEAR MEDIA • 14' X 48' DIGITAL MONUMENT</text>
      </g>
    </svg>`;
  }

  // 3. BROADSHEET NEWSPAPER MEDIUM (4:3 Folded Vintage Press on Oak Table)
  if (mediumId === 'newspaper') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="oakTable" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#271911" />
          <stop offset="50%" stop-color="#18110b" />
          <stop offset="100%" stop-color="#0f0a06" />
        </linearGradient>
        <linearGradient id="newsprintPaper" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e2d9c8" />
          <stop offset="48%" stop-color="#ede4d4" />
          <stop offset="50%" stop-color="#c8bea8" /> <!-- Fold crease -->
          <stop offset="52%" stop-color="#f2eae0" />
          <stop offset="100%" stop-color="#ddd2bf" />
        </linearGradient>
        <pattern id="halftoneDots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.6" fill="#1c1917" />
        </pattern>
        <filter id="paperShadow">
          <feDropShadow dx="8" dy="14" stdDeviation="18" flood-color="#000" flood-opacity="0.8" />
        </filter>
      </defs>

      <!-- Dark Oak Table Background -->
      <rect width="${width}" height="${height}" fill="url(#oakTable)" />

      <!-- Morning Window Warm Sunlight Stream -->
      <polygon points="0,0 600,0 300,768 0,768" fill="#fffbeb" opacity="0.04" />

      <!-- Ceramic Espresso Cup Still Life (Inanimate) -->
      <g transform="translate(860, 160)">
        <ellipse cx="60" cy="70" rx="45" ry="35" fill="#000000" opacity="0.5" />
        <!-- Saucer -->
        <ellipse cx="55" cy="60" rx="42" ry="30" fill="#fafaf9" stroke="#d6d3d1" stroke-width="2" />
        <ellipse cx="55" cy="60" rx="28" ry="18" fill="#f5f5f4" />
        <!-- Cup -->
        <circle cx="55" cy="55" r="22" fill="#fafaf9" stroke="#e7e5e4" stroke-width="2" />
        <!-- Espresso Crema -->
        <circle cx="55" cy="55" r="18" fill="#451a03" />
        <ellipse cx="52" cy="52" rx="10" ry="7" fill="#78350f" opacity="0.8" />
      </g>

      <!-- Folded Broadsheet Newspaper Spread -->
      <g filter="url(#paperShadow)" transform="translate(60, 40)">
        <!-- Paper Page -->
        <rect x="0" y="0" width="880" height="680" rx="2" fill="url(#newsprintPaper)" />

        <!-- Masthead Banner -->
        <g id="newspaperHeader" transform="translate(40, 30)">
          <line x1="0" y1="0" x2="800" y2="0" stroke="#1c1917" stroke-width="2" />
          <text x="400" y="32" font-family="'Times New Roman', Georgia, serif" font-size="34" font-weight="900" letter-spacing="4" fill="#0c0a09" text-anchor="middle">THE FINANCIAL CHRONICLE</text>
          <text x="400" y="50" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="400" letter-spacing="2" fill="#44403c" text-anchor="middle">VOL. CLIV • ISSUE 48,291 • INTERNATIONAL BUSINESS &amp; INNOVATION ARCHIVE</text>
          <line x1="0" y1="58" x2="800" y2="58" stroke="#1c1917" stroke-width="2" />
          <line x1="0" y1="62" x2="800" y2="62" stroke="#1c1917" stroke-width="0.8" />
        </g>

        <!-- Center Paper Crease Shadow -->
        <line x1="440" y1="20" x2="440" y2="670" stroke="#78716c" stroke-width="1.5" opacity="0.4" />

        <!-- Left Page Editorial Columns (Dummy Typeset) -->
        <g transform="translate(40, 110)">
          <text x="0" y="20" font-family="'Times New Roman', serif" font-size="18" font-weight="bold" fill="#1c1917">GLOBAL MARKETS EMBRACE NEW INDUSTRIAL PARADIGM</text>
          <text x="0" y="40" font-family="'Times New Roman', serif" font-size="11" font-style="italic" fill="#57534e">By Senior Economics Desk • London &amp; New York</text>

          <!-- Text lines simulation -->
          <g fill="#44403c" opacity="0.85">
            <rect x="0" y="60" width="170" height="3" /><rect x="0" y="68" width="165" height="3" /><rect x="0" y="76" width="172" height="3" />
            <rect x="0" y="84" width="160" height="3" /><rect x="0" y="92" width="168" height="3" /><rect x="0" y="100" width="155" height="3" />
            <rect x="0" y="108" width="170" height="3" /><rect x="0" y="116" width="164" height="3" />

            <rect x="195" y="60" width="170" height="3" /><rect x="195" y="68" width="168" height="3" /><rect x="195" y="76" width="162" height="3" />
            <rect x="195" y="84" width="170" height="3" /><rect x="195" y="92" width="158" height="3" /><rect x="195" y="100" width="165" height="3" />
            <rect x="195" y="108" width="172" height="3" /><rect x="195" y="116" width="160" height="3" />
          </g>
        </g>

        <!-- Right Page FEATURED FULL PAGE ADVERTISEMENT (The Product!) -->
        <g id="newspaperAdBox" transform="translate(460, 105)">
          <rect x="0" y="0" width="380" height="540" fill="none" stroke="#1c1917" stroke-width="2.5" />
          <rect x="4" y="4" width="372" height="532" fill="none" stroke="#1c1917" stroke-width="0.8" />

          <!-- Ad Header -->
          <text x="190" y="32" font-family="'Times New Roman', serif" font-size="10" font-weight="700" letter-spacing="3" fill="#44403c" text-anchor="middle">SPECIAL COMMERCIAL PRESENTATION</text>
          <text x="190" y="65" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="900" letter-spacing="1" fill="#0c0a09" text-anchor="middle">${productName.toUpperCase()}</text>
          <text x="190" y="90" font-family="'Times New Roman', serif" font-size="13" font-style="italic" fill="#292524" text-anchor="middle">"${tagline}"</text>

          <!-- Authentic Halftone Product Engraving Frame -->
          <g transform="translate(190, 240)">
            <!-- Halftone engraving background -->
            <ellipse cx="0" cy="50" rx="130" ry="140" fill="url(#halftoneDots)" opacity="0.4" />

            <!-- Product Bottle silhouette with ink press lines -->
            <rect x="-45" y="-70" width="90" height="180" rx="18" fill="#1c1917" />
            <rect x="-40" y="-65" width="80" height="170" rx="15" fill="#f5f5f4" />
            <rect x="-35" y="-60" width="70" height="160" rx="12" fill="url(#halftoneDots)" />

            <!-- Brand typography on ink press bottle -->
            <rect x="-30" y="-10" width="60" height="35" fill="#ffffff" stroke="#1c1917" stroke-width="1" />
            <text x="0" y="7" font-family="'Times New Roman', serif" font-size="9" font-weight="bold" fill="#000" text-anchor="middle">${productName.slice(0, 8)}</text>
            <text x="0" y="18" font-family="sans-serif" font-size="6" fill="#444" text-anchor="middle">EXTRAIT</text>

            <!-- Bottle Metal Collar and Cap in ink print -->
            <rect x="-28" y="-95" width="56" height="25" rx="3" fill="#1c1917" />
            <path d="M -18 -95 C -18 -125, 18 -125, 18 -95 Z" fill="#292524" stroke="#000" stroke-width="1" />

            <!-- Shadow underneath -->
            <ellipse cx="0" cy="120" rx="65" ry="12" fill="#000" opacity="0.6" />
          </g>

          <!-- Bottom Ad Description & Stockists -->
          <text x="190" y="450" font-family="'Times New Roman', serif" font-size="11" font-weight="500" fill="#292524" text-anchor="middle">Engineered without compromise. Inanimate industrial perfection.</text>
          <text x="190" y="475" font-family="'Times New Roman', serif" font-size="9" letter-spacing="2" fill="#78716c" text-anchor="middle">AT SELECT STOCKISTS ACROSS LONDON, PARIS &amp; TOKYO</text>
        </g>
      </g>
    </svg>`;
  }

  // 4. SOCIAL MEDIA FEED POST MEDIUM (1:1 Clean Editorial Digital Campaign)
  if (mediumId === 'social-post') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="socialBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="podiumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="50%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
        <radialGradient id="productAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.8" />
          <stop offset="70%" stop-color="${accentColor}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background Gradient Studio Canvas -->
      <rect width="${width}" height="${height}" fill="url(#socialBg)" />

      <!-- Abstract Architectural Shapes & Studio Lights -->
      <circle cx="200" cy="250" r="180" fill="${primaryColor}" opacity="0.15" />
      <circle cx="800" cy="350" r="220" fill="${accentColor}" opacity="0.2" />

      <!-- Minimalist Grid Lines overlay -->
      <g stroke="#334155" stroke-width="1" opacity="0.2">
        <line x1="100" y1="0" x2="100" y2="${height}" />
        <line x1="900" y1="0" x2="900" y2="${height}" />
        <line x1="0" y1="120" x2="${width}" y2="120" />
        <line x1="0" y1="880" x2="${width}" y2="880" />
      </g>

      <!-- Cylinder Podium Platform -->
      <ellipse cx="${width / 2}" cy="730" rx="220" ry="45" fill="url(#podiumGrad)" />
      <path d="M ${width / 2 - 220} 730 C ${width / 2 - 220} 780, ${width / 2 + 220} 780, ${width / 2 + 220} 730 L ${width / 2 + 220} 800 C ${width / 2 + 220} 850, ${width / 2 - 220} 850, ${width / 2 - 220} 800 Z" fill="#0f172a" />
      <ellipse cx="${width / 2}" cy="730" rx="215" ry="40" fill="none" stroke="#94a3b8" stroke-width="2" opacity="0.4" />

      <!-- Product Center Aura -->
      <ellipse cx="${width / 2}" cy="500" rx="260" ry="260" fill="url(#productAura)" filter="url(#neonGlow)" />

      <!-- Contact Shadow -->
      <ellipse cx="${width / 2}" cy="710" rx="90" ry="18" fill="#000000" opacity="0.8" />

      <!-- THE CONSISTENT PRODUCT (Exact silhouette, geometry, & colors) -->
      <g id="productInSocial">
        <rect x="${width / 2 - 70}" y="390" width="140" height="290" rx="28" fill="${primaryColor}" opacity="0.9" filter="url(#neonGlow)" />
        <rect x="${width / 2 - 75}" y="380" width="150" height="310" rx="32" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.6" />
        
        <!-- Highlight stripe -->
        <rect x="${width / 2 - 60}" y="400" width="12" height="270" rx="6" fill="#ffffff" opacity="0.45" />

        <!-- Branding -->
        <text x="${width / 2}" y="510" font-family="system-ui, sans-serif" font-size="14" font-weight="800" letter-spacing="4" fill="#ffffff" text-anchor="middle">${productName.toUpperCase()}</text>
        <text x="${width / 2}" y="535" font-family="system-ui, sans-serif" font-size="9" font-weight="600" letter-spacing="2" fill="#cbd5e1" text-anchor="middle">${category.toUpperCase()}</text>

        <!-- Collar & Cap -->
        <rect x="${width / 2 - 42}" y="348" width="84" height="35" rx="5" fill="${tertiaryColor}" stroke="#b45309" stroke-width="1" />
        <path d="M ${width / 2 - 28} 348 C ${width / 2 - 28} 290, ${width / 2 + 28} 290, ${width / 2 + 28} 348 Z" fill="#1e293b" />
      </g>

      <!-- Sleek Editorial Floating Typography Badge -->
      <g transform="translate(140, 160)">
        <rect x="0" y="0" width="140" height="32" rx="16" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.2" />
        <text x="70" y="21" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#ffffff" text-anchor="middle">NEW LAUNCH</text>
        
        <text x="0" y="75" font-family="system-ui, sans-serif" font-size="32" font-weight="900" letter-spacing="-0.5" fill="#ffffff">${productName}</text>
        <text x="0" y="105" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">"${tagline}"</text>
      </g>

      <!-- Floating Call to Action Tag -->
      <g transform="translate(${width - 260}, ${height - 180})">
        <rect x="0" y="0" width="160" height="42" rx="21" fill="#ffffff" />
        <text x="80" y="26" font-family="system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="1" fill="#0f172a" text-anchor="middle">SHOP NOW →</text>
      </g>
    </svg>`;
  }

  // 5. DEFAULT / OTHER MEDIUMS (Subway Poster, Magazine Spread, Storefront Window)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="ambientBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b" />
        <stop offset="100%" stop-color="#09090b" />
      </linearGradient>
      <linearGradient id="podium" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#3f3f46" />
        <stop offset="100%" stop-color="#18181b" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#ambientBg)" />
    <ellipse cx="${width / 2}" cy="${height * 0.75}" rx="${width * 0.35}" ry="${height * 0.08}" fill="url(#podium)" />
    <ellipse cx="${width / 2}" cy="${height * 0.5}" rx="${width * 0.25}" ry="${height * 0.25}" fill="${primaryColor}" opacity="0.3" />

    <!-- Product -->
    <rect x="${width / 2 - 60}" y="${height * 0.35}" width="120" height="240" rx="24" fill="${primaryColor}" />
    <rect x="${width / 2 - 60}" y="${height * 0.35}" width="120" height="240" rx="24" fill="none" stroke="#fff" stroke-width="2" opacity="0.5" />
    <text x="${width / 2}" y="${height * 0.48}" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">${productName}</text>
    <rect x="${width / 2 - 35}" y="${height * 0.35 - 30}" width="70" height="30" rx="4" fill="${tertiaryColor}" />
    <path d="M ${width / 2 - 25} ${height * 0.35 - 30} C ${width / 2 - 25} ${height * 0.35 - 75}, ${width / 2 + 25} ${height * 0.35 - 75}, ${width / 2 + 25} ${height * 0.35 - 30} Z" fill="#27272a" />

    <!-- Typography -->
    <text x="50" y="60" font-family="sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#a1a1aa">${mediumId.toUpperCase()} SIMULATION</text>
    <text x="50" y="90" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">${productName}</text>
    <text x="50" y="115" font-family="sans-serif" font-size="14" fill="#a1a1aa">"${tagline}"</text>
  </svg>`;
}

export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
