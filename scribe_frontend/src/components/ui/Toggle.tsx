import type { FC } from 'react';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ label, value, onChange }) => {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label || 'Toggle'}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
          value ? 'bg-blue-500' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-4.5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};
