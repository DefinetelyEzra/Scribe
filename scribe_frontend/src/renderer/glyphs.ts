import type { ThemeName } from '@types/modules';

/** Unicode glyphs used as figure silhouettes in SVG and Canvas rendering. */
export const GLYPHS = {
  person: '⬦',    // default figure
  cavalry: '▲',   // cavalry / special unit
  dot: '•',       // compact figure for high-density rendering
  fallen: '×',    // casualty / fallen figure
  cottage: '⌂',   // cottage height reference
  tree: '✶',      // tree height reference
  tower: '⬡',     // castle tower reference
  cathedral: '✚', // cathedral reference
  wall: '■',      // city wall reference
} as const;

/** Maps a scale reference ID to the appropriate glyph character. */
export function glyphForRef(refId: string): string {
  const map: Record<string, string> = {
    person: GLYPHS.person,
    horse: GLYPHS.cavalry,
    cottage: GLYPHS.cottage,
    oak_tree: GLYPHS.tree,
    castle_tower: GLYPHS.tower,
    cathedral: GLYPHS.cathedral,
    city_wall: GLYPHS.wall,
  };
  return map[refId] ?? GLYPHS.dot;
}

export interface ThemeColors {
  bg: string;
  colorA: string;
  colorB: string;
  neutral: string;
  label: string;
  hasGlow: boolean;
}

export const THEME_COLORS: Record<ThemeName, ThemeColors> = {
  spirit: {
    bg: '#0d1117',
    colorA: '#7B9FE0',
    colorB: '#E07B9F',
    neutral: '#9FC8E8',
    label: '#c9d1d9',
    hasGlow: true,
  },
  tactical: {
    bg: '#1a1f1a',
    colorA: '#6e9e6e',
    colorB: '#9e6e6e',
    neutral: '#8fb88f',
    label: '#b0b8b0',
    hasGlow: false,
  },
  sketch: {
    bg: '#f5f0e8',
    colorA: '#4a3c2c',
    colorB: '#2c3c4a',
    neutral: '#6a5848',
    label: '#3a3228',
    hasGlow: false,
  },
  ink: {
    bg: '#ffffff',
    colorA: '#1a1a2e',
    colorB: '#2e1a1a',
    neutral: '#2a2a3a',
    label: '#444444',
    hasGlow: false,
  },
};
