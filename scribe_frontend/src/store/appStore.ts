import { create } from 'zustand';
import type {
  ModuleId,
  ArmiesParams,
  ScaleParams,
  TimelineParams,
  TimelineEvent,
  TerrainModifier,
} from '@types/modules';

interface AppState {
  activeModule: ModuleId;
  armies: ArmiesParams;
  scale: ScaleParams;
  timeline: TimelineParams;
  setActiveModule: (id: ModuleId) => void;
  setArmiesParam: <K extends keyof ArmiesParams>(key: K, value: ArmiesParams[K]) => void;
  setScaleParam: <K extends keyof ScaleParams>(key: K, value: ScaleParams[K]) => void;
  setTimelineParam: <K extends keyof TimelineParams>(key: K, value: TimelineParams[K]) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  removeTimelineEvent: (id: string) => void;
}

export const DEFAULT_ARMIES: ArmiesParams = {
  count: 300,
  formation: 'infantry-block',
  factionB: false,
  factionBCount: 200,
  factionAName: 'A',
  factionBName: 'B',
  gap: 'medium',
  style: 'spirit',
  casualties: 0,
  colorA: '#7B9FE0',
  colorB: '#E07B9F',
  showLabels: false,
};

export const DEFAULT_SCALE: ScaleParams = {
  value: 10,
  unit: 'meters',
  displayMode: 'height',
  referenceIds: ['person', 'castle_tower'],
  style: 'spirit',
  showScaleBar: true,
  showLabels: true,
  terrainModifier: 1,
};

export const DEFAULT_TIMELINE: TimelineParams = {
  events: [
    { id: '1', label: 'Kingdom founded', year: 0,   type: 'event'  },
    { id: '2', label: 'Age of Heroes',   year: 50,  type: 'era'    },
    { id: '3', label: 'Battle of the Vale', year: 120, type: 'battle' },
    { id: '4', label: 'The Dark Age',    year: 200, type: 'era'    },
    { id: '5', label: 'Great Plague',    year: 280, type: 'event'  },
    { id: '6', label: 'Reunification',   year: 350, type: 'event'  },
  ],
  style: 'spirit',
  showLabels: true,
};

/**
 * Reads the current URL path and query string to initialise state on first load,
 * so that shared/bookmarked URLs restore correctly.
 */
function parseInitialState(): Pick<AppState, 'activeModule' | 'armies' | 'scale' | 'timeline'> {
  const path = window.location.pathname;
  const p = new URLSearchParams(window.location.search);

  const activeModule: ModuleId =
    path.includes('scale')    ? 'scale'    :
    path.includes('timeline') ? 'timeline' :
    'armies';

  // Detect OS light-mode preference for theme default
  const prefersLight =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  const defaultTheme = prefersLight ? 'ink' : 'spirit';

  const armies: ArmiesParams =
    activeModule === 'armies'
      ? {
          count:         Number(p.get('count')        ?? DEFAULT_ARMIES.count),
          formation:     (p.get('formation')          as ArmiesParams['formation'])  ?? DEFAULT_ARMIES.formation,
          factionB:      p.get('factionB')  === 'true',
          factionBCount: Number(p.get('factionBCount') ?? DEFAULT_ARMIES.factionBCount),
          factionAName:  p.get('nameA')               ?? DEFAULT_ARMIES.factionAName,
          factionBName:  p.get('nameB')               ?? DEFAULT_ARMIES.factionBName,
          gap:           (p.get('gap')                as ArmiesParams['gap'])         ?? DEFAULT_ARMIES.gap,
          style:         (p.get('style')              as ArmiesParams['style'])       ?? defaultTheme,
          casualties:    Number(p.get('casualties')   ?? DEFAULT_ARMIES.casualties),
          colorA:        p.get('colorA') ? `#${p.get('colorA')}` : DEFAULT_ARMIES.colorA,
          colorB:        p.get('colorB') ? `#${p.get('colorB')}` : DEFAULT_ARMIES.colorB,
          showLabels:    p.get('labels') === 'true',
        }
      : { ...DEFAULT_ARMIES, style: defaultTheme };

  const scale: ScaleParams =
    activeModule === 'scale'
      ? {
          value:           Number(p.get('value') ?? DEFAULT_SCALE.value),
          unit:            (p.get('unit')  as ScaleParams['unit'])        ?? DEFAULT_SCALE.unit,
          displayMode:     (p.get('mode')  as ScaleParams['displayMode']) ?? DEFAULT_SCALE.displayMode,
          referenceIds:    p.get('refs') ? p.get('refs')!.split(',') : DEFAULT_SCALE.referenceIds,
          style:           (p.get('style') as ScaleParams['style'])       ?? defaultTheme,
          showScaleBar:    p.get('scaleBar') !== 'false',
          showLabels:      p.get('labels')   !== 'false',
          terrainModifier: (Number(p.get('terrain') ?? 1)) as TerrainModifier,
        }
      : { ...DEFAULT_SCALE, style: defaultTheme };

  return { activeModule, armies, scale, timeline: DEFAULT_TIMELINE };
}

const init = parseInitialState();

export const useAppStore = create<AppState>((set) => ({
  ...init,
  setActiveModule: (id) => set({ activeModule: id }),
  setArmiesParam: (key, value) =>
    set((state) => ({ armies: { ...state.armies, [key]: value } })),
  setScaleParam: (key, value) =>
    set((state) => ({ scale: { ...state.scale, [key]: value } })),
  setTimelineParam: (key, value) =>
    set((state) => ({ timeline: { ...state.timeline, [key]: value } })),
  addTimelineEvent: (event) =>
    set((state) => ({
      timeline: { ...state.timeline, events: [...state.timeline.events, event] },
    })),
  removeTimelineEvent: (id) =>
    set((state) => ({
      timeline: { ...state.timeline, events: state.timeline.events.filter((e) => e.id !== id) },
    })),
}));
