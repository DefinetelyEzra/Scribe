import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors in the visualization tree so a bad param combination
 * cannot white-screen the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Scribe] Renderer error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 text-zinc-500 bg-zinc-950">
            <span className="text-2xl">⚠</span>
            <p className="text-sm">Renderer error — try adjusting the parameters.</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="px-3 py-1.5 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
