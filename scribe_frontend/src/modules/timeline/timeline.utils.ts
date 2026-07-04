import type { TimelineEvent, TimelineEventType } from '@types/modules';

export interface TimelineLayout {
  startYear: number;
  endYear: number;
  span: number;
  sorted: TimelineEvent[];
}

/** Computes the year range and sorted event list from a raw event array. */
export function computeLayout(events: TimelineEvent[]): TimelineLayout {
  if (events.length === 0) {
    return { startYear: 0, endYear: 100, span: 100, sorted: [] };
  }

  const sorted = [...events].sort((a, b) => a.year - b.year);
  const minY   = sorted[0].year;
  const maxY   = sorted[sorted.length - 1].year;
  const margin = Math.max(Math.ceil((maxY - minY) * 0.08), 5);

  return {
    startYear: minY - margin,
    endYear:   maxY + margin,
    span:      maxY - minY + margin * 2,
    sorted,
  };
}

/** Returns the x pixel position for a given year within the layout. */
export function yearToX(
  year: number,
  layout: TimelineLayout,
  lineX1: number,
  lineLen: number,
): number {
  return lineX1 + ((year - layout.startYear) / layout.span) * lineLen;
}

/** Visual config per event type. */
export const EVENT_TYPE_CONFIG: Record<
  TimelineEventType,
  { label: string; markerSize: number; above: boolean; bold: boolean }
> = {
  era:    { label: 'Era',    markerSize: 8,  above: true,  bold: true  },
  battle: { label: 'Battle', markerSize: 10, above: false, bold: true  },
  event:  { label: 'Event',  markerSize: 6,  above: true,  bold: false },
  birth:  { label: 'Birth',  markerSize: 4,  above: false, bold: false },
  death:  { label: 'Death',  markerSize: 4,  above: true,  bold: false },
};

/** Generates a unique id for new events. */
export function newEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
