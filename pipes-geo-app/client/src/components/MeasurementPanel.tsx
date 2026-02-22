import React, { useMemo } from "react";
import { Pipe, LatLng } from "../types";
import { calculateDistance, formatDistance } from "../utils/distance";

interface MeasurementPanelProps {
  selectedPipes: Pipe[];
  onClose: () => void;
  onClearSelection: () => void;
}

/**
 * CHALLENGE: Implement the measurement feature
 * 
 * The distance calculation utility is provided in utils/distance.ts
 * 
 * TODO for candidate:
 * 1. Use calculateDistance() to compute individual pipe lengths
 * 2. Calculate and display total length of all selected pipes
 * 3. BONUS: Implement connected route calculation (see below)
 * 4. BONUS: Memoize expensive calculations for performance
 */

/**
 * Calculate the length of a single pipe
 * @param pipe - Pipe object with startPoint and endPoint
 * @returns Length in meters
 * 
 * CANDIDATE TODO: Use the provided calculateDistance utility
 */
function calculatePipeLength(pipe: Pipe): number {
  // TODO: Use calculateDistance(pipe.startPoint, pipe.endPoint)
  return 0;
}

const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  selectedPipes,
  onClose,
  onClearSelection,
}) => {
  /**
   * CANDIDATE TODO: Calculate measurements for all selected pipes
   * 
   * Requirements:
   * 1. Map over selectedPipes to create measurements array
   * 2. Each measurement should have: { id, name, length }
   * 3. Use calculatePipeLength() for each pipe
   * 4. Calculate totalLength by summing all lengths
   * 5. BONUS: Use useMemo to avoid recalculating on every render
   */
  const measurements = selectedPipes.map((pipe) => ({
    id: pipe.id,
    name: pipe.name,
    length: calculatePipeLength(pipe), // TODO: This returns 0 until you implement calculatePipeLength
  }));

  // TODO: Calculate total length
  const totalLength = 0; // Replace with sum of all measurements

  /**
   * BONUS CHALLENGE: Connected Route Calculation
   * 
   * CANDIDATE TODO (Optional):
   * 1. Find the optimal order to visit all pipes
   * 2. Calculate gaps between pipe endpoints
   * 3. Sum total route distance (pipes + gaps)
   * 
   * This is a simplified Traveling Salesman Problem.
   * A greedy nearest-neighbor approach is acceptable.
   */
  const calculateConnectedRoute = (): {
    pipeLength: number;
    gapLength: number;
    totalRoute: number;
  } => {
    // TODO: Implement connected route calculation
    return {
      pipeLength: totalLength,
      gapLength: 0,
      totalRoute: totalLength,
    };
  };

  const routeData = calculateConnectedRoute();

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 20,
        width: 320,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          📏 Measurements
        </span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
            color: "#666",
          }}
          aria-label="Close measurement panel"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 12, fontSize: 13 }}>
        {selectedPipes.length === 0 ? (
          <div style={{ color: "#999", textAlign: "center", padding: "20px 0" }}>
            Click on pipes to select them
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <strong>Selected Pipes:</strong> {selectedPipes.length}
            </div>

            {/* Individual Measurements */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Individual Lengths:
              </div>
              <div
                style={{
                  maxHeight: 150,
                  overflowY: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  padding: 6,
                  background: "#fafafa",
                }}
              >
                {measurements.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: "4px 0",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#555" }}>{m.name}</span>
                    <span style={{ fontWeight: 600 }}>
                      {formatDistance(m.length)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Length */}
            <div
              style={{
                padding: 8,
                background: "#e3f2fd",
                borderRadius: 3,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Total Pipe Length:</span>
                <span style={{ fontWeight: 700, color: "#1565C0" }}>
                  {formatDistance(totalLength)}
                </span>
              </div>
            </div>

            {/* BONUS: Connected Route */}
            {selectedPipes.length > 1 && (
              <div
                style={{
                  padding: 8,
                  background: "#fff3e0",
                  borderRadius: 3,
                  marginBottom: 12,
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Connected Route (Bonus):
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Route Distance:</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatDistance(routeData.totalRoute)}
                  </span>
                </div>
                {routeData.gapLength > 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#666",
                      marginTop: 2,
                    }}
                  >
                    (includes {formatDistance(routeData.gapLength)} between pipes)
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <button
              onClick={onClearSelection}
              style={{
                width: "100%",
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: 3,
                background: "white",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Clear Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MeasurementPanel;
