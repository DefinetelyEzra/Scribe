import type { FC, ChangeEvent } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const Slider: FC<SliderProps> = ({ label, value, min, max, step, unit, onChange }) => {
  function handleRange(e: ChangeEvent<HTMLInputElement>): void {
    onChange(Number(e.target.value));
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>): void {
    const n = Number(e.target.value);
    if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  }

  const display = unit ? `${value}${unit}` : String(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-zinc-300">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInput}
          aria-label={`${label} value`}
          className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-right text-zinc-200 focus:outline-none focus:border-zinc-500"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleRange}
        aria-label={label}
        aria-valuetext={display}
        className="w-full h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-400"
      />
    </div>
  );
};
