import type { FC } from 'react';
import type { UnitType, TerrainModifier } from '@types/modules';
import { travelDays } from './scale.utils';

const PADDING  = 40;
const BAR_H    = 20;
// Minimum bar width as a fraction of total available width so it's always visible
const MIN_BAR_FRAC = 0.05;

interface TravelSceneProps {
  valueMeters: number;
  unit: UnitType;
  terrainModifier: TerrainModifier;
  labelColor: string;
  colorA: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}

const TravelScene: FC<TravelSceneProps> = ({
  valueMeters,
  unit,
  terrainModifier,
  labelColor,
  colorA,
  hasGlow,
  width,
  height,
  showLabels,
}) => {
  const days     = travelDays(valueMeters, unit, terrainModifier);
  const lineY    = height / 2;
  const availW   = width - PADDING * 2;
  const barX     = PADDING;
  const glowStyle = hasGlow ? { filter: `drop-shadow(0 0 4px ${colorA})` } : {};

  // When the unit isn't a travel type, show an explanatory note
  if (days === null) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img">
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontSize={12}
          fill={labelColor}
          opacity={0.5}
        >
          Switch to a travel unit (days walking / horseback / ship)
        </text>
      </svg>
    );
  }

  const dayCount   = Math.ceil(days);
  const isSubDay   = days < 1;
  // Clamp bar to a minimum visible fraction of the available width
  const barW       = Math.max(availW * MIN_BAR_FRAC, availW);

  const TERRAIN_LABELS: Record<number, string> = {
    0.5: ' · Road',
    1:   '',
    2:   ' · Rough terrain',
  };
  const terrainNote = TERRAIN_LABELS[terrainModifier] ?? '';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-label="Travel time visualization"
      role="img"
    >
      {/* Bar background */}
      <rect
        x={barX}
        y={lineY - BAR_H / 2}
        width={barW}
        height={BAR_H}
        fill={colorA}
        opacity={0.15}
        rx={4}
      />
      {/* Bar outline */}
      <rect
        x={barX}
        y={lineY - BAR_H / 2}
        width={barW}
        height={BAR_H}
        fill="none"
        stroke={colorA}
        strokeWidth={1.5}
        rx={4}
        style={glowStyle}
      />

      {/* Day segment dividers — only when more than 1 day */}
      {!isSubDay &&
        Array.from({ length: dayCount - 1 }, (_, i) => i + 1).map((d) => {
          const x = barX + (d / dayCount) * barW;
          return (
            <line
              key={d}
              x1={x} y1={lineY - BAR_H / 2}
              x2={x} y2={lineY + BAR_H / 2}
              stroke={colorA}
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}

      {showLabels && (
        <>
          {/* Total duration label */}
          <text
            x={barX + barW / 2}
            y={lineY - BAR_H / 2 - 10}
            textAnchor="middle"
            fontSize={11}
            fill={labelColor}
          >
            {isSubDay
              ? `< 1 day${terrainNote}`
              : `${days.toFixed(1)} days${terrainNote}`}
          </text>

          {/* Per-segment numbers, skipped if too small */}
          {!isSubDay &&
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
        </>
      )}
    </svg>
  );
};

export default TravelScene;
