export interface ColorItem {
  name: string;
  hex: string;
  role?: string;
}

export interface MediumOption {
  id: string;
  name: string;
  description: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
  category: 'outdoor' | 'print' | 'digital' | 'retail';
  icon: string;
  defaultPrompt?: string;
}

export interface GeneratedMedium {
  mediumId: string;
  mediumName: string;
  imageUrl: string;
  aspectRatio: string;
  promptUsed: string;
  modelUsed: string;
  timestamp: number;
}

export interface ProductPreset {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  visualAnchor: string;
  materials: string;
  styleVibe: string;
  colors: ColorItem[];
}
