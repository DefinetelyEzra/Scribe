import { create } from 'zustand';
import type { ModuleId, ArmiesParams, ScaleParams } from '@types/modules';

interface AppState {
  activeModule: ModuleId;
  armies: ArmiesParams;
  scale: ScaleParams;
  setActiveModule: (id: ModuleId) => void;
  setArmiesParam: <K extends keyof ArmiesParams>(key: K, value: ArmiesParams[K]) => void;
  setScaleParam: <K extends keyof ScaleParams>(key: K, value: ScaleParams[K]) => void;
}

const DEFAULT_ARMIES: ArmiesParams = {
  count: 300,
  formation: 'infantry-block',
  factionB: false,
  factionBCount: 200,
  gap: 'medium',
  style: 'spirit',
  casualties: 0,
  colorA: '#7B9FE0',
  colorB: '#E07B9F',
  showLabels: false,
};

const DEFAULT_SCALE: ScaleParams = {
  value: 10,
  unit: 'meters',
  displayMode: 'height',
  referenceIds: ['person', 'castle_tower'],
  style: 'spirit',
  showScaleBar: true,
  showLabels: true,
};

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'armies',
  armies: DEFAULT_ARMIES,
  scale: DEFAULT_SCALE,
  setActiveModule: (id) => set({ activeModule: id }),
  setArmiesParam: (key, value) =>
    set((state) => ({ armies: { ...state.armies, [key]: value } })),
  setScaleParam: (key, value) =>
    set((state) => ({ scale: { ...state.scale, [key]: value } })),
}));
