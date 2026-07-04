import type { FC } from 'react';
import { HEIGHT_REFS, formatMeters } from './scale.utils';

const PADDING   = 40;
const BAR_WIDTH = 48;
const BAR_GAP   = 32;

interface HeightSceneProps {
  valueMeters: number;
  referenceIds: string[];
  colorA: string;
  labelColor: string;
  hasGlow: boolean;
  width: number;
  height: number;
  showScaleBar: boolean;
  showLabels: boolean;
}

const HeightScene: FC<HeightSceneProps> = ({
  valueMeters,
  referenceIds,
  colorA,
  labelColor,
  hasGlow,
  width,
  height,
  showScaleBar,
  showLabels,
}) => {
  const activeRefs = referenceIds
    .map((id) => ({ id, ref: HEIGHT_REFS[id] }))
    .filter((r) => r.ref != null);

  const allHeights = [valueMeters, ...activeRefs.map((r) => r.ref.value)];
  const maxH = Math.max(...allHeights, 1);

  const groundY = height - PADDING;
  const availH  = groundY - PADDING;

  const items = [
    { id: 'input', label: formatMeters(valueMeters), height: valueMeters, isInput: true },
    ...activeRefs.map((r) => ({
      id:      r.id,
      label:   r.ref.label,
      height:  r.ref.value,
      isInput: false,
    })),
  ];

  const totalWidth = items.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP + PADDING * 2;
  const svgWidth   = Math.max(width, totalWidth);

  const glowStyle = hasGlow ? { filter: `drop-shadow(0 0 6px ${colorA})` } : {};

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
        const barH = Math.max((item.height / maxH) * availH, 2);
        const x    = PADDING + i * (BAR_WIDTH + BAR_GAP);
        const y    = groundY - barH;
        const color = item.isInput ? colorA : `${colorA}99`;

        return (
          <g key={item.id}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barH}
              fill={color}
              rx={2}
              style={item.isInput ? glowStyle : {}}
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
            y={groundY - ((1.8 / maxH) * availH) / 2}
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
};

export default HeightScene;
