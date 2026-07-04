import type { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { GiCrossedSwords } from 'react-icons/gi';
import { TbRulerMeasure, TbTimeline } from 'react-icons/tb';
import type { ModuleId } from '@types/modules';
import { useAppStore } from '@store/appStore';

interface ModuleNavItem {
  id: ModuleId;
  label: string;
  path: string;
  shortcut: string;
  Icon: FC<{ size?: number; className?: string }>;
}

const MODULES: ModuleNavItem[] = [
  { id: 'armies',   label: 'Armies',   path: '/armies',   shortcut: '1', Icon: GiCrossedSwords },
  { id: 'scale',    label: 'Scale',    path: '/scale',    shortcut: '2', Icon: TbRulerMeasure  },
  { id: 'timeline', label: 'Timeline', path: '/timeline', shortcut: '3', Icon: TbTimeline      },
];

export const ModuleSelector: FC = () => {
  const setActiveModule = useAppStore((s) => s.setActiveModule);

  return (
    <nav
      aria-label="Modules"
      className="flex flex-col items-center gap-1 py-4 w-16 bg-zinc-950 border-r border-zinc-800"
    >
      {MODULES.map(({ id, label, path, shortcut, Icon }) => (
        <div key={id} className="relative group/tip">
          <Link
            to={path}
            aria-label={`${label} (${shortcut})`}
            onClick={() => setActiveModule(id)}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-lg text-zinc-500 transition-colors hover:text-zinc-100 hover:bg-zinc-800 [&.active]:text-blue-400 [&.active]:bg-zinc-800/60"
          >
            <Icon size={18} />
          </Link>

          {/* Styled tooltip — appears to the right of the sidebar icon */}
          <div
            role="tooltip"
            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
                       whitespace-nowrap rounded bg-zinc-800 border border-zinc-700 px-2 py-1
                       text-xs text-zinc-200 shadow-lg
                       opacity-0 scale-95 transition-all duration-150
                       group-hover/tip:opacity-100 group-hover/tip:scale-100"
          >
            {label}
            <span className="ml-2 text-zinc-500 font-mono">{shortcut}</span>
          </div>
        </div>
      ))}
    </nav>
  );
};
