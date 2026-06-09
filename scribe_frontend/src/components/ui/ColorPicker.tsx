import type { FC, ChangeEvent } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange }) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-zinc-300">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full border border-zinc-600"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
        <input
          type="color"
          value={value}
          onChange={handleChange}
          aria-label={`${label} color`}
          className="w-8 h-8 bg-transparent border-0 cursor-pointer p-0 rounded"
        />
        <span className="text-xs font-mono text-zinc-400">{value.toUpperCase()}</span>
      </div>
    </div>
  );
};
