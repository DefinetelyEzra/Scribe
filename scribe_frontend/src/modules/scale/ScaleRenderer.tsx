import { useRef, useState, useEffect } from 'react';
import type { FC, ReactElement } from 'react';
import { useAppStore } from '@store/appStore';
import type { UnitType } from '@types/modules';
import {
  HEIGHT_REFS,
  DISTANCE_REFS,
  DISTANCE_REF_IDS,
  toMeters,
  formatMeters,
  travelDays,
} from './scale.utils';
import { THEME_COLORS } from '@renderer/glyphs';

const PADDING = 40;
const BAR_WIDTH = 48;
const BAR_GAP = 32;

/** Renders the height-comparison mode: vertical bars scaled to each item's real height. */
function HeightScene({
  valueMeters,
  referenceIds,
  colorA,
  labelColor,
  hasGlow,
  width,
  height,
  showScaleBar,
  showLabels,
}: {
  valueMeters: number;
  referenceIds: string[];
  colorA: string;
  labelColor: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showScaleBar: boolean;
  showLabels: boolean;
}): ReactElement {
  const activeRefs = referenceIds
    .map((id) => ({ id, ref: HEIGHT_REFS[id] }))
    .filter((r) => r.ref != null);

  const allHeights = [valueMeters, ...activeRefs.map((r) => r.ref.value)];
  const maxH = Math.max(...allHeights, 1);

  const groundY = height - PADDING;
  const availH = groundY - PADDING;

  const items = [
    { id: 'input', label: formatMeters(valueMeters), height: valueMeters, isInput: true },
    ...activeRefs.map((r) => ({
      id: r.id,
      label: r.ref.label,
      height: r.ref.value,
      isInput: false,
    })),
  ];

  const totalWidth = items.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP + PADDING * 2;
  const svgWidth = Math.max(width, totalWidth);

  const glowFilter = hasGlow
    ? { filter: `drop-shadow(0 0 6px ${colorA})` }
    : {};

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${height}`}
      width={svgWidth}
      height={height}
      aria-label="Height comparison visualization"
      role="img"
    >
      {/* Ground line */}
      <line
        x1={PADDING / 2}
        y1={groundY}
        x2={svgWidth - PADDING / 2}
        y2={groundY}
        stroke={labelColor}
        strokeWidth={1}
        opacity={0.3}
      />

      {items.map((item, i) => {
        const barH = (item.height / maxH) * availH;
        const x = PADDING + i * (BAR_WIDTH + BAR_GAP);
        const y = groundY - barH;
        const color = item.isInput ? colorA : `${colorA}99`;

        return (
          <g key={item.id}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={Math.max(barH, 2)}
              fill={color}
              rx={2}
              style={item.isInput ? glowFilter : {}}
            />
            {showLabels && (
              <>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={labelColor}
                >
                  {formatMeters(item.height)}
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={groundY + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill={labelColor}
                  opacity={0.7}
                >
                  {item.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {showScaleBar && (
        <g>
          {/* 1-person scale indicator on right edge */}
          <line
            x1={svgWidth - PADDING / 2 - 8}
            y1={groundY}
            x2={svgWidth - PADDING / 2 - 8}
            y2={groundY - (1.8 / maxH) * availH}
            stroke={labelColor}
            strokeWidth={2}
            strokeDasharray="3 2"
            opacity={0.5}
          />
          <text
            x={svgWidth - PADDING / 2 - 14}
            y={groundY - (1.8 / maxH) * availH / 2}
            textAnchor="end"
            fontSize={8}
            fill={labelColor}
            opacity={0.6}
          >
            1.8 m
          </text>
        </g>
      )}
    </svg>
  );
}

/** Renders the horizontal-distance mode: a line with reference tick marks. */
function HorizontalScene({
  valueKm,
  labelColor,
  colorA,
  hasGlow,
  width,
  height,
  showLabels,
}: {
  valueKm: number;
  labelColor: string;
  colorA: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}): ReactElement {
  const lineY = height / 2;
  const lineX1 = PADDING;
  const lineX2 = width - PADDING;
  const lineLen = lineX2 - lineX1;

  const activeDist = DISTANCE_REF_IDS
    .map((id) => ({ id, ref: DISTANCE_REFS[id] }))
    .filter((r) => r.ref.value <= valueKm);

  const glowStyle = hasGlow
    ? { filter: `drop-shadow(0 0 4px ${colorA})` }
    : {};

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-label="Distance comparison visualization"
      role="img"
    >
      {/* Main distance line */}
      <line
        x1={lineX1}
        y1={lineY}
        x2={lineX2}
        y2={lineY}
        stroke={colorA}
        strokeWidth={3}
        strokeLinecap="round"
        style={glowStyle}
      />

      {/* Start and end caps */}
      <line x1={lineX1} y1={lineY - 8} x2={lineX1} y2={lineY + 8} stroke={colorA} strokeWidth={2} />
      <line x1={lineX2} y1={lineY - 8} x2={lineX2} y2={lineY + 8} stroke={colorA} strokeWidth={2} />

      {showLabels && (
        <text x={(lineX1 + lineX2) / 2} y={lineY - 16} textAnchor="middle" fontSize={11} fill={labelColor}>
          {valueKm >= 1 ? `${valueKm.toFixed(1)} km` : `${(valueKm * 1000).toFixed(0)} m`}
        </text>
      )}

      {/* Reference ticks */}
      {activeDist.map(({ id, ref }) => {
        const x = lineX1 + (ref.value / valueKm) * lineLen;
        return (
          <g key={id}>
            <line
              x1={x}
              y1={lineY - 5}
              x2={x}
              y2={lineY + 5}
              stroke={labelColor}
              strokeWidth={1}
              opacity={0.6}
            />
            {showLabels && (
              <text
                x={x}
                y={lineY + 20}
                textAnchor="middle"
                fontSize={8}
                fill={labelColor}
                opacity={0.7}
              >
                {ref.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Renders the travel-time mode: a bar divided into day segments. */
function TravelScene({
  valueMeters,
  unit,
  labelColor,
  colorA,
  hasGlow,
  width,
  height,
  showLabels,
}: {
  valueMeters: number;
  unit: UnitType;
  labelColor: string;
  colorA: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}): ReactElement {
  const days = travelDays(valueMeters, unit);
  const lineY = height / 2;
  const barX = PADDING;
  const barW = width - PADDING * 2;
  const barH = 16;

  const glowStyle = hasGlow ? { filter: `drop-shadow(0 0 4px ${colorA})` } : {};

  const dayCount = days != null ? Math.ceil(days) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-label="Travel time visualization"
      role="img"
    >
      {/* Total bar */}
      <rect
        x={barX}
        y={lineY - barH / 2}
        width={barW}
        height={barH}
        fill={colorA}
        opacity={0.15}
        rx={4}
      />
      <rect
        x={barX}
        y={lineY - barH / 2}
        width={barW}
        height={barH}
        fill="none"
        stroke={colorA}
        strokeWidth={1.5}
        rx={4}
        style={glowStyle}
      />

      {/* Day segment ticks */}
      {dayCount != null &&
        Array.from({ length: dayCount - 1 }, (_, i) => i + 1).map((d) => {
          const x = barX + (d / dayCount) * barW;
          return (
            <g key={d}>
              <line
                x1={x}
                y1={lineY - barH / 2}
                x2={x}
                y2={lineY + barH / 2}
                stroke={colorA}
                strokeWidth={1}
                opacity={0.4}
              />
            </g>
          );
        })}

      {showLabels && days != null && (
        <text
          x={barX + barW / 2}
          y={lineY - barH / 2 - 10}
          textAnchor="middle"
          fontSize={11}
          fill={labelColor}
        >
          {days.toFixed(1)} days
        </text>
      )}

      {dayCount != null &&
        showLabels &&
        Array.from({ length: dayCount }, (_, i) => {
          const x = barX + ((i + 0.5) / dayCount) * barW;
          return (
            <text
              key={i}
              x={x}
              y={lineY + 2}
              textAnchor="middle"
              fontSize={8}
              fill={labelColor}
            >
              {i + 1}
            </text>
          );
        })}
    </svg>
  );
}

export const ScaleRenderer: FC = () => {
  const scale = useAppStore((s) => s.scale);
  const { value, unit, displayMode, referenceIds, style, showScaleBar, showLabels } = scale;

  const themeColors = THEME_COLORS[style];
  const valueMeters = toMeters(value, unit);
  const valueKm = valueMeters / 1000;

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

  const sceneProps = {
    colorA: themeColors.colorA,
    labelColor: themeColors.label,
    hasGlow: themeColors.hasGlow,
    width: dims.width,
    height: dims.height,
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
          {...sceneProps}
          valueMeters={valueMeters}
          referenceIds={referenceIds}
          showScaleBar={showScaleBar}
        />
      )}
      {displayMode === 'horizontal' && (
        <HorizontalScene {...sceneProps} valueKm={valueKm} />
      )}
      {displayMode === 'travel' && (
        <TravelScene {...sceneProps} valueMeters={valueMeters} unit={unit} />
      )}
    </div>
  );
};
