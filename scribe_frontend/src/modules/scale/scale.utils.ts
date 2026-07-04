import type { UnitType, TerrainModifier } from '@types/modules';

export interface HeightRef {
  value: number;   // metres
  label: string;
  glyph: string;
}

export interface DistanceRef {
  value: number;   // kilometres
  label: string;
}

/** Heights of common reference objects, in metres. */
export const HEIGHT_REFS: Record<string, HeightRef> = {
  person:       { value: 1.8,  label: 'Adult person',    glyph: '⬦' },
  horse:        { value: 2.4,  label: 'Mounted horse',   glyph: '▲' },
  cottage:      { value: 5.5,  label: 'Cottage roof',    glyph: '⌂' },
  oak_tree:     { value: 20,   label: 'Mature oak',      glyph: '✶' },
  castle_tower: { value: 30,   label: 'Castle tower',    glyph: '⬡' },
  cathedral:    { value: 90,   label: 'Cathedral nave',  glyph: '✚' },
  city_wall:    { value: 120,  label: 'Great city wall', glyph: '■' },
};

/** Common distance references, in kilometres. */
export const DISTANCE_REFS: Record<string, DistanceRef> = {
  stone_throw:   { value: 0.05,  label: "Stone's throw"   },
  bowshot:       { value: 0.2,   label: 'Bowshot range'   },
  village_edge:  { value: 1,     label: 'Village boundary'},
  castle_walls:  { value: 2.5,   label: 'Castle perimeter'},
  hour_walk:     { value: 5,     label: '1 hour on foot'  },
  city_walls:    { value: 8,     label: 'Walled city edge'},
  day_walk:      { value: 30,    label: 'Day march'       },
  day_horse:     { value: 60,    label: 'Day on horse'    },
  town_to_city:  { value: 100,   label: 'Town to capital' },
};

/** Conversion factors from each unit type to metres. */
export const TO_METERS: Record<string, number> = {
  meters:          1,
  feet:            0.3048,
  miles:           1609.34,
  km:              1000,
  leagues:         4828,
  'days-walking':  30000,    // 30 km/day → metres
  'days-horseback': 60000,
  'days-ship':     150000,
};

export const TRAVEL_SPEED_KM_PER_DAY: Record<string, number> = {
  'days-walking':    30,
  'days-horseback':  60,
  'days-ship':       150,
};

/** Converts the user-supplied value and unit to metres. */
export function toMeters(value: number, unit: UnitType): number {
  return value * (TO_METERS[unit] ?? 1);
}

/** Returns a human-readable string for a metre value. */
export function formatMeters(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  if (m >= 1)    return `${m.toFixed(1)} m`;
  return `${(m * 100).toFixed(0)} cm`;
}

/**
 * Returns the number of days to travel a given distance.
 * terrainModifier: 0.5 = road (faster), 1 = normal, 2 = rough (slower).
 * Returns null for non-travel units.
 */
export function travelDays(
  valueMeters: number,
  unit: UnitType,
  terrainModifier: TerrainModifier = 1,
): number | null {
  const speed = TRAVEL_SPEED_KM_PER_DAY[unit];
  if (!speed) return null;
  return (valueMeters / 1000 / speed) * terrainModifier;
}

export const HEIGHT_REF_IDS = Object.keys(HEIGHT_REFS).sort(
  (a, b) => HEIGHT_REFS[a].value - HEIGHT_REFS[b].value,
);

export const DISTANCE_REF_IDS = Object.keys(DISTANCE_REFS).sort(
  (a, b) => DISTANCE_REFS[a].value - DISTANCE_REFS[b].value,
);
