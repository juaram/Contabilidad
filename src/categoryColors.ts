import type { CSSProperties } from 'react';

export const DEFAULT_CATEGORY_BG = '#d7e2ff';
export const DEFAULT_CATEGORY_TEXT = '#001b3f';

const TAILWIND_BG_HEX: Record<string, string> = {
  'bg-primary-fixed': '#d7e2ff',
  'bg-secondary-fixed': '#8df7c1',
  'bg-tertiary-fixed': '#ffdad6',
  'bg-primary-container': '#002d62',
  'bg-secondary-container': '#8af5be',
  'bg-error-container': '#ffdad6',
  'bg-surface-variant': '#e5e2e1',
  'bg-inverse-surface': '#313030',
};

const TAILWIND_TEXT_HEX: Record<string, string> = {
  'text-on-primary-fixed': '#001b3f',
  'text-on-secondary-fixed': '#002113',
  'text-on-tertiary-fixed': '#410003',
  'text-on-primary-container': '#7796d1',
  'text-on-secondary-container': '#00714b',
  'text-on-error-container': '#93000a',
  'text-on-surface-variant': '#43474f',
  'text-inverse-on-surface': '#f3f0ef',
};

export const isHexColor = (value: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());

export function categoryBackgroundColor(bgClassOrHex: string): string {
  if (isHexColor(bgClassOrHex)) return bgClassOrHex.trim();
  return TAILWIND_BG_HEX[bgClassOrHex] ?? DEFAULT_CATEGORY_BG;
}

export function contrastTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_CATEGORY_TEXT;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.55 ? '#1c1b1b' : '#ffffff';
}

export function categoryTextColor(bgClassOrHex: string, textClassOrHex: string): string {
  if (isHexColor(textClassOrHex)) return textClassOrHex.trim();
  const mapped = TAILWIND_TEXT_HEX[textClassOrHex];
  if (mapped) return mapped;
  return contrastTextColor(categoryBackgroundColor(bgClassOrHex));
}

export function categoryColorStyle(bgClassOrHex: string, textClassOrHex: string): CSSProperties {
  return {
    backgroundColor: categoryBackgroundColor(bgClassOrHex),
    color: categoryTextColor(bgClassOrHex, textClassOrHex),
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let value = hex.trim().replace(/^#/, '');
  if (value.length === 3) {
    value = value.split('').map((ch) => ch + ch).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  const int = parseInt(value, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
