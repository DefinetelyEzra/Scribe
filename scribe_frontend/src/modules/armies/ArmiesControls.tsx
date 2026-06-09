import type { FC } from 'react';
import { useAppStore } from '@store/appStore';
import type { ArmiesParams } from '@types/modules';
import { Slider } from '@components/ui/Slider';
import { Select } from '@components/ui/Select';
import { Toggle } from '@components/ui/Toggle';
import { ColorPicker } from '@components/ui/ColorPicker';

const FORMATION_OPTIONS = [
  { value: 'infantry-block',  label: 'Infantry Block' },
  { value: 'cavalry-wedge',   label: 'Cavalry Wedge' },
  { value: 'skirmish-line',   label: 'Skirmish Line' },
  { value: 'siege-arc',       label: 'Siege Arc' },
  { value: 'phalanx',         label: 'Phalanx' },
  { value: 'column-march',    label: 'Column March' },
];

const GAP_OPTIONS = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'medium', label: 'Medium' },
  { value: 'wide',   label: 'Wide' },
];

const STYLE_OPTIONS = [
  { value: 'spirit',   label: 'Spirit' },
  { value: 'tactical', label: 'Tactical' },
  { value: 'sketch',   label: 'Sketch' },
  { value: 'ink',      label: 'Ink' },
];

export const ArmiesControls: FC = () => {
  const armies = useAppStore((s) => s.armies);
  const set = useAppStore((s) => s.setArmiesParam);

  function update<K extends keyof ArmiesParams>(key: K, value: ArmiesParams[K]): void {
    set(key, value);
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Faction A
        </h3>
        <div className="flex flex-col gap-4">
          <Slider
            label="Count"
            value={armies.count}
            min={1}
            max={50000}
            step={1}
            onChange={(v) => update('count', v)}
          />
          <Select
            label="Formation"
            value={armies.formation}
            options={FORMATION_OPTIONS}
            onChange={(v) => update('formation', v as ArmiesParams['formation'])}
          />
          <ColorPicker
            label="Color"
            value={armies.colorA}
            onChange={(v) => update('colorA', v)}
          />
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Faction B
          </h3>
          <Toggle
            label=""
            value={armies.factionB}
            onChange={(v) => update('factionB', v)}
          />
        </div>
        {armies.factionB && (
          <div className="flex flex-col gap-4">
            <Slider
              label="Count"
              value={armies.factionBCount}
              min={1}
              max={50000}
              step={1}
              onChange={(v) => update('factionBCount', v)}
            />
            <Select
              label="Gap"
              value={armies.gap}
              options={GAP_OPTIONS}
              onChange={(v) => update('gap', v as ArmiesParams['gap'])}
            />
            <ColorPicker
              label="Color"
              value={armies.colorB}
              onChange={(v) => update('colorB', v)}
            />
          </div>
        )}
      </section>

      <div className="border-t border-zinc-800" />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Display
        </h3>
        <div className="flex flex-col gap-4">
          <Slider
            label="Casualties"
            value={armies.casualties}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(v) => update('casualties', v)}
          />
          <Select
            label="Style"
            value={armies.style}
            options={STYLE_OPTIONS}
            onChange={(v) => update('style', v as ArmiesParams['style'])}
          />
          <Toggle
            label="Show labels"
            value={armies.showLabels}
            onChange={(v) => update('showLabels', v)}
          />
        </div>
      </section>
    </div>
  );
};
