import React from "react";
import { Link, useLocation } from "react-router-dom";
import { usePipeContext } from "../context/PipeContext";

const Navigation: React.FC = () => {
  const location = useLocation();
  const { state, setMeasurementMode, clearPipeSelection } = usePipeContext();
  
  const isActive = (path: string) => location.pathname === path;

  const handleMeasurementToggle = () => {
    if (state.measurementMode) {
      clearPipeSelection();
    }
    setMeasurementMode(!state.measurementMode);
  };
  
  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: active ? "#1565C0" : "#666",
    backgroundColor: active ? "#E3F2FD" : "transparent",
    borderRadius: "4px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s ease",
  });

  return (
    <nav
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px 16px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: 600, marginRight: "16px", color: "#333" }}>
        View:
      </span>
      <Link to="/pipes/100" style={linkStyle(isActive("/pipes/100"))}>
        100 Pipes
      </Link>
      <Link to="/pipes/10000" style={linkStyle(isActive("/pipes/10000"))}>
        10k Pipes
      </Link>
      <Link to="/pipes/100000" style={linkStyle(isActive("/pipes/100000"))}>
        100K Pipes
      </Link>

      {/* Measurement Mode Toggle */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={handleMeasurementToggle}
          style={{
            padding: "8px 16px",
            border: "1px solid #1565C0",
            borderRadius: "4px",
            backgroundColor: state.measurementMode ? "#1565C0" : "white",
            color: state.measurementMode ? "white" : "#1565C0",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s ease",
          }}
          aria-pressed={state.measurementMode}
          aria-label="Toggle measurement mode"
        >
          📏 {state.measurementMode ? "Exit Measurement" : "Measure"}
        </button>
        {state.measurementMode && (
          <span style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>
            Click pipes on the map to select them
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
