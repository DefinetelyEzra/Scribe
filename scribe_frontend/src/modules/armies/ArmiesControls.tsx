import type { FC, ChangeEvent } from 'react';
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
  { value: 'wide',   label: 'Wide'   },
];

const STYLE_OPTIONS = [
  { value: 'spirit',   label: 'Spirit'   },
  { value: 'tactical', label: 'Tactical' },
  { value: 'sketch',   label: 'Sketch'   },
  { value: 'ink',      label: 'Ink'      },
];

interface NameInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const NameInput: FC<NameInputProps> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-sm text-zinc-300 shrink-0">{label}</label>
    <input
      type="text"
      value={value}
      maxLength={24}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="w-36 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
    />
  </div>
);

export const ArmiesControls: FC = () => {
  const armies = useAppStore((s) => s.armies);
  const set    = useAppStore((s) => s.setArmiesParam);

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
          {/* Logarithmic scale gives fine control at low counts and still reaches 50 000 */}
          <Slider
            label="Count"
            value={armies.count}
            min={1}
            max={50000}
            step={1}
            logarithmic
            onChange={(v) => update('count', v)}
          />
          <NameInput
            label="Name"
            value={armies.factionAName}
            onChange={(v) => update('factionAName', v)}
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

        {/* Animated expand/collapse */}
        <div
          className={`flex flex-col gap-4 overflow-hidden transition-all duration-200 ${
            armies.factionB ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Slider
            label="Count"
            value={armies.factionBCount}
            min={1}
            max={50000}
            step={1}
            logarithmic
            onChange={(v) => update('factionBCount', v)}
          />
          <NameInput
            label="Name"
            value={armies.factionBName}
            onChange={(v) => update('factionBName', v)}
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
