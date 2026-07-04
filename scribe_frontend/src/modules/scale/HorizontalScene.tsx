import type { FC } from 'react';
import { DISTANCE_REFS, DISTANCE_REF_IDS } from './scale.utils';

const PADDING = 40;

interface HorizontalSceneProps {
  valueKm: number;
  labelColor: string;
  colorA: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showLabels: boolean;
}

const HorizontalScene: FC<HorizontalSceneProps> = ({
  valueKm,
  labelColor,
  colorA,
  hasGlow,
  width,
  height,
  showLabels,
}) => {
  const lineY  = height / 2;
  const lineX1 = PADDING;
  const lineX2 = width - PADDING;
  const lineLen = lineX2 - lineX1;

  const displayValue =
    valueKm >= 1
      ? `${valueKm.toFixed(1)} km`
      : `${(valueKm * 1000).toFixed(0)} m`;

  const activeDist = DISTANCE_REF_IDS
    .map((id) => ({ id, ref: DISTANCE_REFS[id] }))
    .filter((r) => r.ref.value <= valueKm);

  const glowStyle = hasGlow ? { filter: `drop-shadow(0 0 4px ${colorA})` } : {};

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

      {/* End caps */}
      <line x1={lineX1} y1={lineY - 8} x2={lineX1} y2={lineY + 8} stroke={colorA} strokeWidth={2} />
      <line x1={lineX2} y1={lineY - 8} x2={lineX2} y2={lineY + 8} stroke={colorA} strokeWidth={2} />

      {showLabels && (
        <text
          x={(lineX1 + lineX2) / 2}
          y={lineY - 16}
          textAnchor="middle"
          fontSize={11}
          fill={labelColor}
        >
          {displayValue}
        </text>
      )}

      {activeDist.map(({ id, ref }) => {
        const x = lineX1 + (ref.value / valueKm) * lineLen;
        return (
          <g key={id}>
            <line
              x1={x} y1={lineY - 5}
              x2={x} y2={lineY + 5}
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
};

export default HorizontalScene;
