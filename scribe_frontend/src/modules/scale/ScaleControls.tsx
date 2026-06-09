import type { FC } from 'react';
import { useAppStore } from '@store/appStore';
import type { ScaleParams } from '@types/modules';
import { Slider } from '@components/ui/Slider';
import { Select } from '@components/ui/Select';
import { Toggle } from '@components/ui/Toggle';
import { HEIGHT_REFS } from './scale.utils';

const UNIT_OPTIONS = [
  { value: 'meters',          label: 'Meters' },
  { value: 'feet',            label: 'Feet' },
  { value: 'miles',           label: 'Miles' },
  { value: 'km',              label: 'Kilometers' },
  { value: 'leagues',         label: 'Leagues' },
  { value: 'days-walking',    label: 'Days (walking)' },
  { value: 'days-horseback',  label: 'Days (horseback)' },
  { value: 'days-ship',       label: 'Days (by ship)' },
];

const MODE_OPTIONS = [
  { value: 'height',     label: 'Height comparison' },
  { value: 'horizontal', label: 'Horizontal distance' },
  { value: 'travel',     label: 'Travel time' },
];

const STYLE_OPTIONS = [
  { value: 'spirit',   label: 'Spirit' },
  { value: 'tactical', label: 'Tactical' },
  { value: 'sketch',   label: 'Sketch' },
  { value: 'ink',      label: 'Ink' },
];

const HEIGHT_REF_OPTIONS = Object.entries(HEIGHT_REFS).map(([id, ref]) => ({
  id,
  label: `${ref.label} (${ref.value} m)`,
}));

export const ScaleControls: FC = () => {
  const scale = useAppStore((s) => s.scale);
  const set = useAppStore((s) => s.setScaleParam);

  function update<K extends keyof ScaleParams>(key: K, value: ScaleParams[K]): void {
    set(key, value);
  }

  function toggleRef(id: string): void {
    const current = scale.referenceIds;
    const next = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id];
    update('referenceIds', next);
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Measurement
        </h3>
        <div className="flex flex-col gap-4">
          <Slider
            label="Value"
            value={scale.value}
            min={0.1}
            max={10000}
            step={0.1}
            onChange={(v) => update('value', v)}
          />
          <Select
            label="Unit"
            value={scale.unit}
            options={UNIT_OPTIONS}
            onChange={(v) => update('unit', v as ScaleParams['unit'])}
          />
          <Select
            label="Display mode"
            value={scale.displayMode}
            options={MODE_OPTIONS}
            onChange={(v) => update('displayMode', v as ScaleParams['displayMode'])}
          />
        </div>
      </section>

      {scale.displayMode === 'height' && (
        <>
          <div className="border-t border-zinc-800" />
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Reference figures
            </h3>
            <div className="flex flex-col gap-2">
              {HEIGHT_REF_OPTIONS.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300 hover:text-zinc-100"
                >
                  <input
                    type="checkbox"
                    checked={scale.referenceIds.includes(id)}
                    onChange={() => toggleRef(id)}
                    className="w-3.5 h-3.5 accent-blue-400 cursor-pointer"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="border-t border-zinc-800" />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Display
        </h3>
        <div className="flex flex-col gap-4">
          <Select
            label="Style"
            value={scale.style}
            options={STYLE_OPTIONS}
            onChange={(v) => update('style', v as ScaleParams['style'])}
          />
          <Toggle
            label="Scale bar"
            value={scale.showScaleBar}
            onChange={(v) => update('showScaleBar', v)}
          />
          <Toggle
            label="Labels"
            value={scale.showLabels}
            onChange={(v) => update('showLabels', v)}
          />
        </div>
      </section>
    </div>
  );
};
