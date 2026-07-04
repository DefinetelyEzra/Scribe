import type { ModuleId } from '@types/modules';

export interface ModuleMeta {
  id: ModuleId;
  name: string;
  description: string;
}

export const MODULE_LIST: ModuleMeta[] = [
  {
    id: 'armies',
    name: 'Armies & Formations',
    description: 'Visualize combatants and spatial formations',
  },
  {
    id: 'scale',
    name: 'Scale & Distance',
    description: 'See measurements in immediate human context',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Map events along a narrative time axis',
  },
];
