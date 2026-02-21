import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Pipe } from "../types";

interface Props {
  pipes: Pipe[];
}

const MapCenterController: React.FC<{ pipes: Pipe[] }> = ({ pipes }) => {
  const map = useMap();

  useEffect(() => {
    if (pipes.length === 0) return;
    const first = pipes[0];
    
    // Use flyTo but with proper cleanup
    map.flyTo(
      [first.startPoint.lat, first.startPoint.lng],
      13,
      { animate: true, duration: 0.8 }
    );

    // Cleanup: stop any ongoing animations if component unmounts
    return () => {
      map.stop();
    };
  }, [pipes, map]); // Fixed: removed unstable object literal dependency

  return null;
};

const PipeMap: React.FC<Props> = ({ pipes }) => {
  // Simple string interpolation - no need for useMemo
  const statusLabel = `Showing ${pipes.length} pipe${pipes.length !== 1 ? "s" : ""}`;

  // Fixed: removed unstable dependency, effect only runs once on mount
  useEffect(() => {
    console.log("Pipe map mounted, ready to display pipes");
  }, []);

  // Fixed: Memoize the expensive GeoJSON transformation
  const geoJsonFeatures = useMemo(() => ({
    type: "FeatureCollection" as const,
    features: pipes.map((pipe) => ({
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [pipe.startPoint.lng, pipe.startPoint.lat],
          [pipe.endPoint.lng, pipe.endPoint.lat],
        ],
      },
      properties: {
        id: pipe.id,
        name: pipe.name,
        color: pipe.color,
        tags: pipe.tags,
      },
    })),
  }), [pipes]);

  // geoJsonFeatures is computed above but currently unused by the Polyline
  // rendering below — it would feed a GeoJSON layer in a production implementation.
  void geoJsonFeatures;

  const defaultCenter: [number, number] = [32.0853, 34.7818];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ padding: "4px 8px", fontSize: 12, color: "#666", background: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
        {statusLabel}
      </div>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "calc(100% - 25px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <MapCenterController pipes={pipes} />
        {pipes.map((pipe) => (
          <Polyline
            key={pipe.id}
            positions={[
              [pipe.startPoint.lat, pipe.startPoint.lng],
              [pipe.endPoint.lat, pipe.endPoint.lng],
            ]}
            pathOptions={{ color: pipe.color, weight: 4, opacity: 0.85 }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default PipeMap;
