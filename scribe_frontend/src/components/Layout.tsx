import type { FC, ReactNode } from 'react';
import { ModuleSelector } from './ModuleSelector';
import { useSyncToUrl } from '@store/urlSync';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Root application shell.
 * Renders the module nav sidebar on the left, page content on the right.
 * Also activates URL sync so params are always reflected in the address bar.
 */
export const Layout: FC<LayoutProps> = ({ children }) => {
  useSyncToUrl();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <ModuleSelector />
      <main className="flex flex-1 min-w-0 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};
