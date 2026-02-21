import React, { useState } from "react";
import { usePipeContext } from "../context/PipeContext";
import PipeMap from "./PipeMap";

const MapView: React.FC = () => {
  const { state, setSelectedTag } = usePipeContext();

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(state.pipes.flatMap((p) => p.tags as string[]))
  ).sort();

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setSelectedTag(tag);
  };

  const filteredPipes = activeTag
    ? state.pipes.filter((p) => (p.tags as string[]).includes(activeTag))
    : state.pipes;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "6px 10px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexShrink: 0,
          background: "#fff",
        }}
      >
        <span style={{ fontSize: 12, color: "#555", marginRight: 4 }}>Filter:</span>
        <button
          onClick={() => handleTagClick(null)}
          style={{
            padding: "2px 10px",
            fontSize: 12,
            cursor: "pointer",
            border: "1px solid #bbb",
            borderRadius: 3,
            background: activeTag === null ? "#1565C0" : "#fff",
            color: activeTag === null ? "#fff" : "#333",
          }}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              padding: "2px 10px",
              fontSize: 12,
              cursor: "pointer",
              border: "1px solid #bbb",
              borderRadius: 3,
              background: activeTag === tag ? "#1565C0" : "#fff",
              color: activeTag === tag ? "#fff" : "#333",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PipeMap pipes={filteredPipes} />
      </div>
    </div>
  );
};

export default MapView;
