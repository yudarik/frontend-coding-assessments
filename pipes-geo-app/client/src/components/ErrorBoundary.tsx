import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 20,
            background: "#fff3cd",
            border: "1px solid #ffc107",
            color: "#856404",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>⚠️ Map Error</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            The map failed to load. This could be due to invalid coordinates or a
            Leaflet initialization error.
          </p>
          {this.state.error && (
            <details style={{ marginTop: 10, fontSize: 12 }}>
              <summary style={{ cursor: "pointer" }}>Error details</summary>
              <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
