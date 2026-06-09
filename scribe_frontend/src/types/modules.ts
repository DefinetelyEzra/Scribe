import type { ReactNode } from 'react';

export type ThemeName = 'spirit' | 'tactical' | 'sketch' | 'ink';
export type ModuleId = 'armies' | 'scale';
export type FormationType =
  | 'infantry-block'
  | 'cavalry-wedge'
  | 'skirmish-line'
  | 'siege-arc'
  | 'phalanx'
  | 'column-march';
export type UnitType =
  | 'meters'
  | 'feet'
  | 'miles'
  | 'km'
  | 'leagues'
  | 'days-walking'
  | 'days-horseback'
  | 'days-ship';
export type ScaleDisplayMode = 'height' | 'horizontal' | 'travel';
export type GapSize = 'narrow' | 'medium' | 'wide';

export interface ArmiesParams {
  count: number;
  formation: FormationType;
  factionB: boolean;
  factionBCount: number;
  gap: GapSize;
  style: ThemeName;
  casualties: number;
  colorA: string;
  colorB: string;
  showLabels: boolean;
}

export interface ScaleParams {
  value: number;
  unit: UnitType;
  displayMode: ScaleDisplayMode;
  referenceIds: string[];
  style: ThemeName;
  showScaleBar: boolean;
  showLabels: boolean;
}

export interface ModuleControl {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'toggle' | 'color';
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface ScribeModule {
  id: ModuleId;
  name: string;
  description: string;
  controls: ModuleControl[];
  render: (params: Record<string, unknown>, theme: ThemeName) => ReactNode;
}

/** A single positioned figure in a formation visualization. */
export interface FigurePosition {
  x: number;
  y: number;
  faction: 'a' | 'b';
  casualty: boolean;
}
