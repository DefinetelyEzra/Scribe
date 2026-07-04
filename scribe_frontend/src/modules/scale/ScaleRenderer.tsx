import { useRef, useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAppStore } from '@store/appStore';
import { toMeters } from './scale.utils';
import { THEME_COLORS } from '@renderer/glyphs';
import HeightScene     from './HeightScene';
import HorizontalScene from './HorizontalScene';
import TravelScene     from './TravelScene';

export const ScaleRenderer: FC = () => {
  const scale = useAppStore((s) => s.scale);
  const {
    value, unit, displayMode,
    referenceIds, style,
    showScaleBar, showLabels,
    terrainModifier,
  } = scale;

  const themeColors  = THEME_COLORS[style];
  const valueMeters  = toMeters(value, unit);
  const valueKm      = valueMeters / 1000;

  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 720, height: 500 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    if (width > 0) setDims({ width: Math.floor(width), height: Math.floor(height) });

    const ro = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      setDims({ width: Math.floor(w), height: Math.floor(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const common = {
    colorA:     themeColors.colorA,
    labelColor: themeColors.label,
    hasGlow:    themeColors.hasGlow,
    width:      dims.width,
    height:     dims.height,
    showLabels,
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden"
      data-theme={style}
      style={{ backgroundColor: themeColors.bg }}
      id="scribe-preview"
    >
      {displayMode === 'height' && (
        <HeightScene
          {...common}
          valueMeters={valueMeters}
          referenceIds={referenceIds}
          showScaleBar={showScaleBar}
        />
      )}
      {displayMode === 'horizontal' && (
        <HorizontalScene {...common} valueKm={valueKm} />
      )}
      {displayMode === 'travel' && (
        <TravelScene
          {...common}
          valueMeters={valueMeters}
          unit={unit}
          terrainModifier={terrainModifier}
        />
      )}
    </div>
  );
};
