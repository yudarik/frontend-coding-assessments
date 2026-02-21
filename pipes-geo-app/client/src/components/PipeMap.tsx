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
    // Directly calling an imperative Leaflet method inside a React effect.
    // This sidesteps React's rendering model — if the component unmounts
    // while the animation is in progress there's no cleanup, and the
    // viewport state lives outside of React entirely.

    map.flyTo(
      [first.startPoint.lat, first.startPoint.lng],
      13,
      { animate: true, duration: 0.8 }
    );
  }, [pipes, map, { tag: "all" }]);

  return null;
};

const PipeMap: React.FC<Props> = ({ pipes }) => {
  // Memoizing a string interpolation — this is essentially free to compute
  // on every render and gains nothing from memoization.
  const statusLabel = useMemo(
    () => `Showing ${pipes.length} pipe${pipes.length !== 1 ? "s" : ""}`,
    [pipes.length]
  );

  // This effect re-runs on every render because the dependency array contains
  // a freshly-created object literal. Objects are compared by reference in
  // JavaScript, so `{ tag: "all" } !== { tag: "all" }` every time.
  useEffect(() => {
    console.log("Pipe filter updated, recalculating bounds...");
  }, [{ tag: "all" }]); // eslint-disable-line react-hooks/exhaustive-deps

  // Building the full GeoJSON FeatureCollection on every render.
  // This O(n) transformation allocates new objects for every feature on
  // every render cycle — the exact kind of work that should be wrapped in
  // useMemo with a `[pipes]` dependency.
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
