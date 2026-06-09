import { useEffect } from 'react';
import { useAppStore } from './appStore';
import type { ArmiesParams, ScaleParams } from '@types/modules';

function bool(s: string | null, fallback: boolean): boolean {
  if (s === null) return fallback;
  return s === 'true';
}

export function serializeArmies(p: ArmiesParams): string {
  return new URLSearchParams({
    count: String(p.count),
    formation: p.formation,
    factionB: String(p.factionB),
    factionBCount: String(p.factionBCount),
    gap: p.gap,
    style: p.style,
    casualties: String(p.casualties),
    colorA: p.colorA.replace('#', ''),
    colorB: p.colorB.replace('#', ''),
    labels: String(p.showLabels),
  }).toString();
}

export function serializeScale(p: ScaleParams): string {
  return new URLSearchParams({
    value: String(p.value),
    unit: p.unit,
    mode: p.displayMode,
    refs: p.referenceIds.join(','),
    style: p.style,
    scaleBar: String(p.showScaleBar),
    labels: String(p.showLabels),
  }).toString();
}

export function parseArmiesFromUrl(search: string, defaults: ArmiesParams): ArmiesParams {
  const p = new URLSearchParams(search);
  return {
    count: Number(p.get('count') ?? defaults.count),
    formation: (p.get('formation') as ArmiesParams['formation']) ?? defaults.formation,
    factionB: bool(p.get('factionB'), defaults.factionB),
    factionBCount: Number(p.get('factionBCount') ?? defaults.factionBCount),
    gap: (p.get('gap') as ArmiesParams['gap']) ?? defaults.gap,
    style: (p.get('style') as ArmiesParams['style']) ?? defaults.style,
    casualties: Number(p.get('casualties') ?? defaults.casualties),
    colorA: p.get('colorA') ? `#${p.get('colorA')}` : defaults.colorA,
    colorB: p.get('colorB') ? `#${p.get('colorB')}` : defaults.colorB,
    showLabels: bool(p.get('labels'), defaults.showLabels),
  };
}

export function parseScaleFromUrl(search: string, defaults: ScaleParams): ScaleParams {
  const p = new URLSearchParams(search);
  const refsStr = p.get('refs');
  return {
    value: Number(p.get('value') ?? defaults.value),
    unit: (p.get('unit') as ScaleParams['unit']) ?? defaults.unit,
    displayMode: (p.get('mode') as ScaleParams['displayMode']) ?? defaults.displayMode,
    referenceIds: refsStr ? refsStr.split(',') : defaults.referenceIds,
    style: (p.get('style') as ScaleParams['style']) ?? defaults.style,
    showScaleBar: bool(p.get('scaleBar'), defaults.showScaleBar),
    showLabels: bool(p.get('labels'), defaults.showLabels),
  };
}

/** Reflects the active module's params into the URL search string on every change. */
export function useSyncToUrl(): void {
  const armies = useAppStore((s) => s.armies);
  const scale = useAppStore((s) => s.scale);
  const activeModule = useAppStore((s) => s.activeModule);

  useEffect(() => {
    const search =
      activeModule === 'armies' ? serializeArmies(armies) : serializeScale(scale);
    const url = new URL(window.location.href);
    url.search = search;
    window.history.replaceState(null, '', url.toString());
  }, [armies, scale, activeModule]);
}
