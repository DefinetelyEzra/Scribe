import type { FC, ChangeEvent } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  /** When true, maps slider position logarithmically so small values have finer control. */
  logarithmic?: boolean;
  onChange: (value: number) => void;
}

const LOG_STEPS = 1000;

function valueToLog(value: number, min: number, max: number): number {
  if (min <= 0) return value;
  return Math.round(
    ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * LOG_STEPS,
  );
}

function logToValue(logVal: number, min: number, max: number): number {
  return Math.round(
    Math.exp(Math.log(min) + (logVal / LOG_STEPS) * (Math.log(max) - Math.log(min))),
  );
}

export const Slider: FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  logarithmic = false,
  onChange,
}) => {
  function handleRange(e: ChangeEvent<HTMLInputElement>): void {
    const raw = Number(e.target.value);
    onChange(logarithmic ? logToValue(raw, min, max) : raw);
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>): void {
    const n = Number(e.target.value);
    if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  }

  const sliderValue = logarithmic ? valueToLog(value, min, max) : value;
  const sliderMin   = logarithmic ? 0 : min;
  const sliderMax   = logarithmic ? LOG_STEPS : max;
  const sliderStep  = logarithmic ? 1 : step;

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
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={sliderValue}
        onChange={handleRange}
        aria-label={label}
        aria-valuetext={display}
        className="w-full h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-400"
      />
    </div>
  );
};
