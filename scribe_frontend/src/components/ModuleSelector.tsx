import type { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { GiCrossedSwords } from 'react-icons/gi';
import { TbRulerMeasure } from 'react-icons/tb';
import type { ModuleId } from '@types/modules';

interface ModuleNavItem {
  id: ModuleId;
  label: string;
  path: string;
  Icon: FC<{ size?: number; className?: string }>;
}

const MODULES: ModuleNavItem[] = [
  { id: 'armies', label: 'Armies', path: '/armies', Icon: GiCrossedSwords },
  { id: 'scale',  label: 'Scale',  path: '/scale',  Icon: TbRulerMeasure },
];

export const ModuleSelector: FC = () => {
  return (
    <nav
      aria-label="Modules"
      className="flex flex-col items-center gap-1 py-4 w-16 bg-zinc-950 border-r border-zinc-800"
    >
      {MODULES.map(({ id, label, path, Icon }) => (
        <Link
          key={id}
          to={path}
          aria-label={label}
          title={label}
          className="group flex flex-col items-center justify-center w-10 h-10 rounded-lg text-zinc-500 transition-colors hover:text-zinc-100 hover:bg-zinc-800 [&.active]:text-blue-400 [&.active]:bg-zinc-800/60"
        >
          <Icon size={18} />
        </Link>
      ))}
    </nav>
  );
};
