import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { FigurePosition, ThemeName } from '@types/modules';
import { GLYPHS, THEME_COLORS } from '@renderer/glyphs';

interface CanvasRendererProps {
  figures: FigurePosition[];
  theme: ThemeName;
  colorA: string;
  colorB: string;
  width: number;
  height: number;
}

const FONT_SIZE = 7;
const PADDING = 24;
const CASUALTY_COLOR = '#666666';
const CASUALTY_ALPHA = 0.25;
const GLOW_BLUR = 8;

/**
 * Renders 2 000+ figures to an HTML5 Canvas.
 * Applies ctx.shadowBlur for the spirit theme glow effect.
 * Draws casualties → faction A → faction B to avoid state resets between layers.
 */
export const CanvasRenderer: FC<CanvasRendererProps> = ({
  figures,
  theme,
  colorA,
  colorB,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hasGlow } = THEME_COLORS[theme];
  const glyph = GLYPHS.person;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || figures.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Compute bounding box without spread to handle up to 100k figures safely
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const f of figures) {
      if (f.x < minX) minX = f.x;
      if (f.x > maxX) maxX = f.x;
      if (f.y < minY) minY = f.y;
      if (f.y > maxY) maxY = f.y;
    }

    const rangeX = Math.max(maxX - minX, 1);
    const rangeY = Math.max(maxY - minY, 1);
    const availW = width - PADDING * 2;
    const availH = height - PADDING * 2;
    const scale = Math.min(availW / rangeX, availH / rangeY);

    const offsetX = (width - rangeX * scale) / 2;
    const offsetY = (height - rangeY * scale) / 2;

    const px = (x: number) => (x - minX) * scale + offsetX;
    const py = (y: number) => (y - minY) * scale + offsetY;

    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Layer 1: casualties
    ctx.shadowBlur = 0;
    ctx.globalAlpha = CASUALTY_ALPHA;
    ctx.fillStyle = CASUALTY_COLOR;
    for (const f of figures) {
      if (f.casualty) ctx.fillText(glyph, px(f.x), py(f.y));
    }

    ctx.globalAlpha = 1;

    // Layer 2: faction A
    ctx.fillStyle = colorA;
    ctx.shadowBlur = hasGlow ? GLOW_BLUR : 0;
    ctx.shadowColor = colorA;
    for (const f of figures) {
      if (!f.casualty && f.faction === 'a') ctx.fillText(glyph, px(f.x), py(f.y));
    }

    // Layer 3: faction B
    ctx.fillStyle = colorB;
    ctx.shadowColor = colorB;
    for (const f of figures) {
      if (!f.casualty && f.faction === 'b') ctx.fillText(glyph, px(f.x), py(f.y));
    }

    // Reset shadow so it doesn't bleed into other draws
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }, [figures, theme, colorA, colorB, width, height, hasGlow, glyph]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label="Formation visualization"
      role="img"
    />
  );
};
