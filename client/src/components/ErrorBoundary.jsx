import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-surface border border-error/20 p-8 rounded-2xl shadow-xl">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-serif text-text mb-4">Oops, something went wrong.</h1>
            <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6 text-left">
              <p className="text-error font-mono text-sm break-words">
                {this.state.error?.message || this.state.error?.toString() || "We're sorry, but an unexpected error occurred."}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-amber text-bg font-mono font-bold rounded-lg hover:bg-amber-hover transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
