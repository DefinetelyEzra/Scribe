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

const FONT_SIZE = 9;
const PADDING = 28;
const CASUALTY_COLOR = '#666666';
const CASUALTY_OPACITY = 0.3;

interface Scaled extends FigurePosition {
  px: number;
  py: number;
}

/** Translates grid-unit positions into pixel positions that fit within the given viewport. */
function scaleToView(
  figures: FigurePosition[],
  width: number,
  height: number,
): Scaled[] {
  if (figures.length === 0) return [];

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
  const scale = Math.min(availW / rangeX, availH / rangeY);

  const offsetX = (width - rangeX * scale) / 2;
  const offsetY = (height - rangeY * scale) / 2;

  return figures.map((f) => ({
    ...f,
    px: (f.x - minX) * scale + offsetX,
    py: (f.y - minY) * scale + offsetY,
  }));
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
  const scaled = scaleToView(figures, width, height);
  const glyph = GLYPHS.person;

  const casualties = scaled.filter((f) => f.casualty);
  const factionA = scaled.filter((f) => !f.casualty && f.faction === 'a');
  const factionB = scaled.filter((f) => !f.casualty && f.faction === 'b');

  const textProps = {
    fontSize: FONT_SIZE,
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

      {/* Casualties — flat grey, dimmed */}
      {casualties.length > 0 && (
        <g fill={CASUALTY_COLOR} opacity={CASUALTY_OPACITY}>
          {casualties.map((f, i) => (
            <text key={i} x={f.px} y={f.py} {...textProps}>
              {glyph}
            </text>
          ))}
        </g>
      )}

      {/* Faction A */}
      <g fill={colorA} filter={hasGlow ? 'url(#glow-a)' : undefined}>
        {factionA.map((f, i) => (
          <text key={i} x={f.px} y={f.py} {...textProps}>
            {glyph}
          </text>
        ))}
      </g>

      {/* Faction B */}
      {factionB.length > 0 && (
        <g fill={colorB} filter={hasGlow ? 'url(#glow-b)' : undefined}>
          {factionB.map((f, i) => (
            <text key={i} x={f.px} y={f.py} {...textProps}>
              {glyph}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
};
