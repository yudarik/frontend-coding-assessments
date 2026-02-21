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

    map.flyTo(
      [first.startPoint.lat, first.startPoint.lng],
      13,
      { animate: true, duration: 0.8 }
    );
  }, [pipes, map, { tag: "all" }]);

  return null;
};

const PipeMap: React.FC<Props> = ({ pipes }) => {
  const statusLabel = useMemo(
    () => `Showing ${pipes.length} pipe${pipes.length !== 1 ? "s" : ""}`,
    [pipes.length]
  );

  useEffect(() => {
    console.log("Pipe filter updated, recalculating bounds...");
  }, [{ tag: "all" }]);

  const geoJsonFeatures = {
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
  };

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
