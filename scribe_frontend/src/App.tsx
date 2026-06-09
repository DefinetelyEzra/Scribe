import type { ComponentType, ReactElement } from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { Layout } from '@components/Layout';
import { ControlPanel } from '@components/ControlPanel';
import { PreviewCanvas } from '@components/PreviewCanvas';
import { ExportBar } from '@components/ExportBar';
import { ArmiesControls, ArmiesRenderer } from '@modules/armies';
import { ScaleControls, ScaleRenderer } from '@modules/scale';
import './App.css';
import '@styles/themes.css';

/** Module page template: controls on the left, preview + export bar on the right. */
function ModulePage({
  Controls,
  Renderer,
}: {
  Controls: ComponentType;
  Renderer: ComponentType;
}): ReactElement {
  return (
    <>
      <ControlPanel>
        <Controls />
      </ControlPanel>
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PreviewCanvas>
          <Renderer />
        </PreviewCanvas>
        <ExportBar />
      </div>
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/armies' });
  },
});

const armiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/armies',
  component: () => (
    <ModulePage Controls={ArmiesControls} Renderer={ArmiesRenderer} />
  ),
});

const scaleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scale',
  component: () => (
    <ModulePage Controls={ScaleControls} Renderer={ScaleRenderer} />
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, armiesRoute, scaleRoute]);

const router = createRouter({ routeTree });

// Register the router for full type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}
