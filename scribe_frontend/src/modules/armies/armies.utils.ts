import type { FormationType, FigurePosition, GapSize } from '@types/modules';

/** Spacing units to apply between two factions based on gap setting. */
const GAP_UNITS: Record<GapSize, number> = {
  narrow: 2,
  medium: 5,
  wide: 10,
};

/**
 * Computes grid positions for a single formation.
 * Returns positions centered around (0, 0) in abstract grid units.
 * The renderer maps grid units to pixels based on available space.
 */
export function computeFormation(
  count: number,
  formation: FormationType,
): { x: number; y: number }[] {
  if (count <= 0) return [];

  switch (formation) {
    case 'infantry-block':
      return infantryBlock(count);
    case 'cavalry-wedge':
      return cavalryWedge(count);
    case 'skirmish-line':
      return skirmishLine(count);
    case 'siege-arc':
      return siegeArc(count);
    case 'phalanx':
      return phalanx(count);
    case 'column-march':
      return columnMarch(count);
  }
}

/** Rectangular grid, ~1.5 : 1 width-to-height ratio. */
function infantryBlock(count: number): { x: number; y: number }[] {
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const halfCols = (cols - 1) / 2;
  const halfRows = (rows - 1) / 2;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    positions.push({
      x: (i % cols) - halfCols,
      y: Math.floor(i / cols) - halfRows,
    });
  }
  return positions;
}

/**
 * V-shape pointing forward: row 0 = 1 figure, row n = 2n+1 figures.
 * Classic cavalry charge formation.
 */
function cavalryWedge(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  let placed = 0;
  let row = 0;

  while (placed < count) {
    const rowWidth = 2 * row + 1;
    for (let j = 0; j < rowWidth && placed < count; j++) {
      positions.push({ x: j - row, y: row });
      placed++;
    }
    row++;
  }

  const maxRow = row - 1;
  return positions.map((p) => ({ ...p, y: p.y - maxRow / 2 }));
}

/** Two loose rows with double spacing and a half-column stagger between rows. */
function skirmishLine(count: number): { x: number; y: number }[] {
  const perRow = Math.ceil(count / 2);
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    positions.push({
      x: col * 2 + row * 0.5 - perRow,
      y: row * 2.5 - 1.25,
    });
  }
  return positions;
}

/**
 * Semicircular arc facing inward (siege configuration).
 * Multiple rings grow outward as count increases.
 */
function siegeArc(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  let placed = 0;
  let ring = 0;

  while (placed < count) {
    const radius = (ring + 1) * 4;
    // Pack figures along the arc at ~1.5 grid-unit intervals
    const ringCapacity = Math.max(3, Math.floor((Math.PI * radius) / 1.5));
    const toPlace = Math.min(ringCapacity, count - placed);

    for (let j = 0; j < toPlace; j++) {
      // Arc spans π to 0 (left to right, opening downward)
      const angle = Math.PI - (Math.PI * j) / Math.max(toPlace - 1, 1);
      positions.push({
        x: radius * Math.cos(angle),
        y: -radius * Math.sin(angle) * 0.6,
      });
      placed++;
    }
    ring++;
  }
  return positions;
}

/** Tight rectangular grid with 2:3 width-to-depth ratio — emphasises layered ranks. */
function phalanx(count: number): { x: number; y: number }[] {
  const cols = Math.ceil(Math.sqrt(count * 0.7));
  const rows = Math.ceil(count / cols);
  const halfCols = (cols - 1) / 2;
  const halfRows = (rows - 1) / 2;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    positions.push({
      x: (i % cols) - halfCols,
      y: Math.floor(i / cols) - halfRows,
    });
  }
  return positions;
}

/** Narrow 6-wide column — army on the march. */
function columnMarch(count: number): { x: number; y: number }[] {
  const cols = 6;
  const rows = Math.ceil(count / cols);
  const halfCols = (cols - 1) / 2;
  const halfRows = (rows - 1) / 2;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    positions.push({
      x: (i % cols) - halfCols,
      y: Math.floor(i / cols) - halfRows,
    });
  }
  return positions;
}

/**
 * Builds the combined figure list for two factions side-by-side,
 * offset by the gap setting so they don't overlap.
 */
export function computeDualFormation(
  countA: number,
  countB: number,
  formation: FormationType,
  gap: GapSize,
): FigurePosition[] {
  const posA = computeFormation(countA, formation);
  const posB = computeFormation(countB, formation);

  const maxXA = posA.length > 0 ? Math.max(...posA.map((p) => p.x)) : 0;
  const minXB = posB.length > 0 ? Math.min(...posB.map((p) => p.x)) : 0;
  const offsetX = maxXA - minXB + GAP_UNITS[gap];

  return [
    ...posA.map((p) => ({ ...p, faction: 'a' as const, casualty: false })),
    ...posB.map((p) => ({ x: p.x + offsetX, y: p.y, faction: 'b' as const, casualty: false })),
  ];
}

/**
 * Marks the trailing figures (by index) as casualties.
 * Trailing figures are typically on the exposed edges of a formation.
 */
export function applyCasualties(
  figures: FigurePosition[],
  casualtyPct: number,
): FigurePosition[] {
  if (casualtyPct <= 0) return figures;
  const n = Math.floor(figures.length * (casualtyPct / 100));
  const threshold = figures.length - n;
  return figures.map((f, i) => ({ ...f, casualty: i >= threshold }));
}

/** Computes the axis-aligned bounding box of a position array. */
export function getBoundingBox(positions: { x: number; y: number }[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (positions.length === 0)
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of positions) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}
