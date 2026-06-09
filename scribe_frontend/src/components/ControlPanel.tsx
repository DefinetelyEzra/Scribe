import type { FC, ReactNode } from 'react';

interface ControlPanelProps {
  children: ReactNode;
}

/** Scrollable left-side panel that hosts a module's controls. */
export const ControlPanel: FC<ControlPanelProps> = ({ children }) => {
  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto bg-zinc-950 border-r border-zinc-800">
      {children}
    </aside>
  );
};
