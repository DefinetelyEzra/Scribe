import { useRef, useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAppStore } from '@store/appStore';
import {
  computeFormation,
  computeDualFormation,
  applyCasualties,
} from './armies.utils';
import { SvgRenderer } from '@renderer/SvgRenderer';
import { CanvasRenderer } from '@renderer/CanvasRenderer';
import { THEME_COLORS } from '@renderer/glyphs';
import type { FigurePosition } from '@types/modules';

/** Figures below this threshold use the SVG renderer; above it use Canvas. */
const SVG_THRESHOLD = 2000;

/**
 * Computes the figure list for the current armies params.
 * Combines both factions if factionB is enabled, then applies casualties.
 */
function buildFigures(
  armies: ReturnType<typeof useAppStore.getState>['armies'],
): FigurePosition[] {
  const { count, formation, factionB, factionBCount, gap, casualties } = armies;

  let figures: FigurePosition[];
  if (factionB) {
    figures = computeDualFormation(count, factionBCount, formation, gap);
  } else {
    figures = computeFormation(count, formation).map((p) => ({
      ...p,
      faction: 'a' as const,
      casualty: false,
    }));
  }
  return applyCasualties(figures, casualties);
}

export const ArmiesRenderer: FC = () => {
  const armies = useAppStore((s) => s.armies);
  const { style, colorA, colorB, count, factionB, factionBCount, showLabels } = armies;

  const themeColors = THEME_COLORS[style];
  const totalCount = factionB ? count + factionBCount : count;
  const useCanvas = totalCount > SVG_THRESHOLD;

  const figures = buildFigures(armies);

  // Track container dimensions for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 720, height: 500 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden"
      data-theme={style}
      style={{ backgroundColor: themeColors.bg }}
      id="scribe-preview"
    >
      {useCanvas ? (
        <CanvasRenderer
          figures={figures}
          theme={style}
          colorA={colorA}
          colorB={colorB}
          width={dims.width}
          height={dims.height}
        />
      ) : (
        <SvgRenderer
          figures={figures}
          theme={style}
          colorA={colorA}
          colorB={colorB}
          width={dims.width}
          height={dims.height}
        />
      )}

      {showLabels && (
        <div
          className="absolute bottom-4 left-4 text-xs font-mono leading-relaxed pointer-events-none"
          style={{ color: themeColors.label }}
        >
          <div>{totalCount.toLocaleString()} figures</div>
          {factionB && (
            <div>
              A: {count.toLocaleString()} · B: {factionBCount.toLocaleString()}
            </div>
          )}
          <div>
            Frontage ≈ {Math.ceil(Math.sqrt(count * 1.5))} m
          </div>
        </div>
      )}
    </div>
  );
};
