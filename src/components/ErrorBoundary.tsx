import React from "react";
import { Ticket } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-xl border-2 border-dashed border-accent text-accent rotate-[-4deg]">
            <Ticket size={34} />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-bold mb-2">
            Something broke
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            This page lost its place in line
          </h2>
          <p className="text-ink-muted font-medium mb-7 max-w-md">
            An unexpected error occurred. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="h-11 px-6 rounded-lg bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] font-mono text-xs uppercase tracking-[0.14em] font-bold hover:bg-accent-hover transition-colors"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
