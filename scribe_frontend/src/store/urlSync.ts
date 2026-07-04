import { useEffect, useRef } from 'react';
import { useAppStore } from './appStore';
import type { ArmiesParams, ScaleParams, TimelineParams } from '@types/modules';

export function serializeArmies(p: ArmiesParams): string {
  return new URLSearchParams({
    count:         String(p.count),
    formation:     p.formation,
    factionB:      String(p.factionB),
    factionBCount: String(p.factionBCount),
    nameA:         p.factionAName,
    nameB:         p.factionBName,
    gap:           p.gap,
    style:         p.style,
    casualties:    String(p.casualties),
    colorA:        p.colorA.replace('#', ''),
    colorB:        p.colorB.replace('#', ''),
    labels:        String(p.showLabels),
  }).toString();
}

export function serializeScale(p: ScaleParams): string {
  return new URLSearchParams({
    value:    String(p.value),
    unit:     p.unit,
    mode:     p.displayMode,
    refs:     p.referenceIds.join(','),
    style:    p.style,
    scaleBar: String(p.showScaleBar),
    labels:   String(p.showLabels),
    terrain:  String(p.terrainModifier),
  }).toString();
}

export function serializeTimeline(p: TimelineParams): string {
  return new URLSearchParams({
    events: encodeURIComponent(JSON.stringify(p.events)),
    style:  p.style,
    labels: String(p.showLabels),
  }).toString();
}

/**
 * Reflects the active module's params into the URL search string on every change.
 * Debounced to 120 ms to avoid hammering history during slider drags.
 */
export function useSyncToUrl(): void {
  const armies       = useAppStore((s) => s.armies);
  const scale        = useAppStore((s) => s.scale);
  const timeline     = useAppStore((s) => s.timeline);
  const activeModule = useAppStore((s) => s.activeModule);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const search =
        activeModule === 'armies'   ? serializeArmies(armies) :
        activeModule === 'scale'    ? serializeScale(scale)   :
        serializeTimeline(timeline);

      const url = new URL(window.location.href);
      url.search = search;
      window.history.replaceState(null, '', url.toString());
    }, 120);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [armies, scale, timeline, activeModule]);
}
