import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { PipeProvider, usePipeContext } from "./context/PipeContext";
import MapView from "./components/MapView";
import TableView from "./components/TableView";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";

const API_BASE = "/api";

const AppShell: React.FC = () => {
  const { setPipes, setLoading, state } = usePipeContext();
  const { limit } = useParams<{ limit: string }>();

  useEffect(() => {
    const abortController = new AbortController();
    
    setLoading(true);
    const url = limit ? `${API_BASE}/pipes?limit=${limit}` : `${API_BASE}/pipes`;
    
    fetch(url, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        setPipes(data);
        setLoading(false);
      })
      .catch((err) => {
        // Don't update state if the request was aborted
        if (err.name !== 'AbortError') {
          setLoading(false);
        }
      });

    // Cleanup: abort the fetch if component unmounts or limit changes
    return () => {
      abortController.abort();
    };
  }, [limit, setPipes, setLoading]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <header
        style={{
          padding: "10px 16px",
          background: "#1565C0",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>⧖</span>
        Pipes Geo Viewer
      </header>

      <Navigation />

      {/* Top half — map, wrapped in ErrorBoundary to prevent crashes */}
      <div style={{ flex: 1, minHeight: 0, borderBottom: "2px solid #ccc" }}>
        <ErrorBoundary>
          <MapView />
        </ErrorBoundary>
      </div>

      {/* Bottom half — table */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <TableView />
      </div>
    </div>
  );
};

// PipeProvider wraps the entire application tree.
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PipeProvider>
        <Routes>
          <Route path="/pipes/:limit" element={<AppShell />} />
          <Route path="/" element={<Navigate to="/pipes/100" replace />} />
        </Routes>
      </PipeProvider>
    </BrowserRouter>
  );
};

export default App;
