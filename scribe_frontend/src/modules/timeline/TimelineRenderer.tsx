import { useRef, useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAppStore } from '@store/appStore';
import { THEME_COLORS } from '@renderer/glyphs';
import { computeLayout, yearToX, EVENT_TYPE_CONFIG } from './timeline.utils';

const PADDING     = 48;
const LINE_Y_FRAC = 0.5;  // timeline line sits at vertical midpoint
const TICK_H      = 12;
const LABEL_GAP   = 8;
const YEAR_FONT   = 8;
const LABEL_FONT  = 10;

export const TimelineRenderer: FC = () => {
  const { events, style, showLabels } = useAppStore((s) => s.timeline);
  const themeColors = THEME_COLORS[style];

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

  const { width, height } = dims;
  const lineY   = Math.floor(height * LINE_Y_FRAC);
  const lineX1  = PADDING;
  const lineX2  = width - PADDING;
  const lineLen = lineX2 - lineX1;

  const layout = computeLayout(events);
  const { colorA, colorB, label: labelColor, hasGlow, bg } = themeColors;

  const glowLine = hasGlow ? { filter: `drop-shadow(0 0 4px ${colorA})` } : {};

  // Colours cycle between factionA and a mid-tone for alternating event types
  function markerColor(type: string, index: number): string {
    if (type === 'battle') return colorB;
    if (type === 'era')    return colorA;
    return index % 2 === 0 ? colorA : `${colorA}bb`;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden"
      data-theme={style}
      style={{ backgroundColor: bg }}
      id="scribe-preview"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-label="Timeline visualization"
        role="img"
      >
        {/* Main timeline line */}
        <line
          x1={lineX1}
          y1={lineY}
          x2={lineX2}
          y2={lineY}
          stroke={colorA}
          strokeWidth={2}
          strokeLinecap="round"
          style={glowLine}
        />

        {/* End caps */}
        <line x1={lineX1} y1={lineY - 6} x2={lineX1} y2={lineY + 6} stroke={colorA} strokeWidth={2} />
        <line x1={lineX2} y1={lineY - 6} x2={lineX2} y2={lineY + 6} stroke={colorA} strokeWidth={2} />

        {/* Start / end year labels */}
        {showLabels && (
          <>
            <text x={lineX1} y={lineY + 20} textAnchor="middle" fontSize={YEAR_FONT} fill={labelColor} opacity={0.5}>
              {layout.startYear}
            </text>
            <text x={lineX2} y={lineY + 20} textAnchor="middle" fontSize={YEAR_FONT} fill={labelColor} opacity={0.5}>
              {layout.endYear}
            </text>
          </>
        )}

        {/* Era bands — drawn behind markers */}
        {layout.sorted
          .filter((e) => e.type === 'era')
          .map((era, i, eras) => {
            const x1 = yearToX(era.year, layout, lineX1, lineLen);
            const nextEra = eras[i + 1];
            const x2 = nextEra
              ? yearToX(nextEra.year, layout, lineX1, lineLen)
              : lineX2;
            return (
              <rect
                key={era.id}
                x={x1}
                y={lineY - 24}
                width={Math.max(x2 - x1, 4)}
                height={48}
                fill={colorA}
                opacity={i % 2 === 0 ? 0.06 : 0.03}
                rx={2}
              />
            );
          })}

        {/* Event markers */}
        {layout.sorted.map((event, i) => {
          const cfg    = EVENT_TYPE_CONFIG[event.type];
          const x      = yearToX(event.year, layout, lineX1, lineLen);
          const color  = markerColor(event.type, i);
          const above  = cfg.above;
          const tickY1 = above ? lineY - TICK_H : lineY;
          const tickY2 = above ? lineY : lineY + TICK_H;
          const labelY = above
            ? lineY - TICK_H - LABEL_GAP - cfg.markerSize / 2
            : lineY + TICK_H + LABEL_GAP + cfg.markerSize / 2;

          const glowMarker = hasGlow ? { filter: `drop-shadow(0 0 3px ${color})` } : {};

          return (
            <g key={event.id}>
              {/* Tick */}
              <line
                x1={x} y1={tickY1}
                x2={x} y2={tickY2}
                stroke={color}
                strokeWidth={1.5}
                opacity={0.7}
              />
              {/* Marker dot */}
              <circle
                cx={x}
                cy={above ? tickY1 : tickY2}
                r={cfg.markerSize / 2}
                fill={color}
                style={glowMarker}
              />

              {showLabels && (
                <>
                  <text
                    x={x}
                    y={labelY}
                    textAnchor="middle"
                    fontSize={LABEL_FONT}
                    fontWeight={cfg.bold ? 600 : 400}
                    fill={labelColor}
                  >
                    {event.label}
                  </text>
                  <text
                    x={x}
                    y={labelY + (above ? -12 : 12)}
                    textAnchor="middle"
                    fontSize={YEAR_FONT}
                    fill={labelColor}
                    opacity={0.5}
                  >
                    {event.year}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Empty state */}
        {events.length === 0 && (
          <text
            x={width / 2}
            y={lineY - 24}
            textAnchor="middle"
            fontSize={12}
            fill={labelColor}
            opacity={0.4}
          >
            Add events using the controls panel
          </text>
        )}
      </svg>
    </div>
  );
};
