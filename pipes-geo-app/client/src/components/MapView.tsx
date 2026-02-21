import React from "react";
import { usePipeContext } from "../context/PipeContext";
import PipeMap from "./PipeMap";

const MapView: React.FC = () => {
  const { state, setSelectedTag } = usePipeContext();

  const allTags = Array.from(
    new Set(state.pipes.flatMap((p) => p.tags))
  ).sort();

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // Use context state as single source of truth
  const filteredPipes = state.selectedTag
    ? state.pipes.filter((p) => p.tags.includes(state.selectedTag))
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
            background: state.selectedTag === null ? "#1565C0" : "#fff",
            color: state.selectedTag === null ? "#fff" : "#333",
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
              background: state.selectedTag === tag ? "#1565C0" : "#fff",
              color: state.selectedTag === tag ? "#fff" : "#333",
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
