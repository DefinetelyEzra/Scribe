import { useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ModuleSelector } from './ModuleSelector';
import { useSyncToUrl } from '@store/urlSync';
import { useAppStore } from '@store/appStore';

interface LayoutProps {
  children: ReactNode;
}

const MODULE_SHORTCUTS: Record<string, string> = {
  '1': '/armies',
  '2': '/scale',
  '3': '/timeline',
};

const MODULE_IDS: Record<string, 'armies' | 'scale' | 'timeline'> = {
  '1': 'armies',
  '2': 'scale',
  '3': 'timeline',
};

/**
 * Root application shell.
 * Renders the module nav sidebar on the left, page content on the right.
 * Also activates URL sync and global keyboard shortcuts.
 */
export const Layout: FC<LayoutProps> = ({ children }) => {
  useSyncToUrl();
  const navigate = useNavigate();
  const setActiveModule = useAppStore((s) => s.setActiveModule);

  useEffect(() => {
    function handleKey(e: KeyboardEvent): void {
      // Ignore shortcuts when focus is in an input field
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const path = MODULE_SHORTCUTS[e.key];
      if (path) {
        setActiveModule(MODULE_IDS[e.key]);
        void navigate({ to: path });
        return;
      }

      // E — trigger PNG export
      if (e.key === 'e' || e.key === 'E') {
        const btn = document.querySelector<HTMLButtonElement>('[data-export="png"]');
        btn?.click();
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, setActiveModule]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 min-w-[640px]">
      <ModuleSelector />
      <main className="flex flex-1 min-w-0 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};
