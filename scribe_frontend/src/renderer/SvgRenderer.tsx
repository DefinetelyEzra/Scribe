import type { FC, ReactElement } from 'react';
import type { FigurePosition, ThemeName } from '@types/modules';
import { GLYPHS, THEME_COLORS } from '@renderer/glyphs';

interface SvgRendererProps {
  figures: FigurePosition[];
  theme: ThemeName;
  colorA: string;
  colorB: string;
  width: number;
  height: number;
}

const MAX_FONT = 9;
const MIN_FONT = 2;
const PADDING = 28;
// Cap grid spacing so figures form a tight visual cluster rather than scattered dots
const MAX_CELL_SIZE = 16;
const CASUALTY_COLOR = '#888888';
const CASUALTY_OPACITY = 0.5;

interface Scaled extends FigurePosition {
  px: number;
  py: number;
}

interface ScaleResult {
  scaled: Scaled[];
  cellSize: number;
}

/** Translates grid-unit positions into pixel positions that fit within the given viewport. */
function scaleToView(
  figures: FigurePosition[],
  width: number,
  height: number,
): ScaleResult {
  if (figures.length === 0) return { scaled: [], cellSize: MAX_CELL_SIZE };

  // Manually compute bbox to avoid spread-operator stack overflow at high counts
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
  // Cap cell size so formations look dense rather than spread across the whole canvas
  const cellSize = Math.min(MAX_CELL_SIZE, Math.min(availW / rangeX, availH / rangeY));

  const usedW = rangeX * cellSize;
  const usedH = rangeY * cellSize;
  const offsetX = (width - usedW) / 2;
  const offsetY = (height - usedH) / 2;

  const scaled = figures.map((f) => ({
    ...f,
    px: (f.x - minX) * cellSize + offsetX,
    py: (f.y - minY) * cellSize + offsetY,
  }));

  return { scaled, cellSize };
}

/** SVG filter definition for a colored glow effect applied to a figure group. */
function GlowFilter({ id, color }: { id: string; color: string }): ReactElement {
  return (
    <filter id={id} x="-150%" y="-150%" width="400%" height="400%">
      {/* Blur the alpha mask of the source to create the glow spread */}
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
      <feFlood floodColor={color} floodOpacity="0.7" result="glowColor" />
      <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/**
 * Renders up to 2 000 figures as SVG text glyphs.
 * Spirit theme applies per-faction glow filters; other themes render flat.
 */
export const SvgRenderer: FC<SvgRendererProps> = ({
  figures,
  theme,
  colorA,
  colorB,
  width,
  height,
}) => {
  const { hasGlow } = THEME_COLORS[theme];
  const { scaled, cellSize } = scaleToView(figures, width, height);
  const fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, cellSize * 0.75));

  const casualties = scaled.filter((f) => f.casualty);
  const factionA   = scaled.filter((f) => !f.casualty && f.faction === 'a');
  const factionB   = scaled.filter((f) => !f.casualty && f.faction === 'b');

  const textProps = {
    fontSize,
    textAnchor: 'middle' as const,
    dominantBaseline: 'middle' as const,
    style: { userSelect: 'none' as const },
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-label="Formation visualization"
      role="img"
      overflow="hidden"
    >
      {hasGlow && (
        <defs>
          <GlowFilter id="glow-a" color={colorA} />
          <GlowFilter id="glow-b" color={colorB} />
        </defs>
      )}

      {/* Casualties — distinct × glyph, dimmed */}
      {casualties.length > 0 && (
        <g fill={CASUALTY_COLOR} opacity={CASUALTY_OPACITY}>
          {casualties.map((f, i) => (
            <text key={i} x={f.px} y={f.py} {...textProps}>
              {GLYPHS.fallen}
            </text>
          ))}
        </g>
      )}

      {/* Faction A */}
      <g fill={colorA} filter={hasGlow ? 'url(#glow-a)' : undefined}>
        {factionA.map((f, i) => (
          <text key={i} x={f.px} y={f.py} {...textProps}>
            {GLYPHS.person}
          </text>
        ))}
      </g>

      {/* Faction B */}
      {factionB.length > 0 && (
        <g fill={colorB} filter={hasGlow ? 'url(#glow-b)' : undefined}>
          {factionB.map((f, i) => (
            <text key={i} x={f.px} y={f.py} {...textProps}>
              {GLYPHS.person}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
};
