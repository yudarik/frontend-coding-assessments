import React, { useState } from "react";
import { usePipeContext } from "../context/PipeContext";
import { ApiResponse, Pipe } from "../types";

const API_BASE = "http://localhost:4000";

const TableView: React.FC = () => {
  const { state, setPipes, setLoading, setSelectedTag } = usePipeContext();

  // Fetching data directly in the render body — this fires on every render.
  // Because PipeContext re-renders all consumers on every state change (flaw 5),
  // this fetch executes repeatedly: once when pipes load, once when loading
  // flips to false, and once for each filter change. Each call sets pipes
  // via setPipes, which triggers another render and another fetch.
  // There is also no AbortController, so in-flight requests from stale renders
  // are never cancelled — the last response to arrive wins regardless of order.
  // fetch(`${API_BASE}/pipes`)
  //   .then((res) => res.json())
  //   .then((data: ApiResponse) => {
  //     setPipes(data);
  //   })
  //   .catch(() => {
  //     // error silently swallowed
  //   });

  // A second local copy of the active filter — TableView manages its own
  // selectedTag independently of MapView's copy and of context.state.selectedTag.
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "all" ? null : e.target.value;
    setActiveTag(val);
    setSelectedTag(val);
  };

  const allTags = Array.from(
    new Set(state.pipes.flatMap((p) => p.tags as string[]))
  ).sort();

  // Filtering uses local `activeTag` rather than `state.selectedTag`.
  // A tag change in MapView updates context but this component keeps showing
  // its own unaffected rows.
  const filteredPipes: Pipe[] = activeTag
    ? state.pipes.filter((p) => (p.tags as string[]).includes(activeTag))
    : state.pipes;

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <label htmlFor="tag-filter" style={{ fontWeight: 600, fontSize: 13 }}>
          Filter by tag:
        </label>
        <select
          id="tag-filter"
          onChange={handleTagChange}
          value={activeTag ?? "all"}
          style={{ fontSize: 12, padding: "2px 6px" }}
        >
          <option value="all">All</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {state.loading && (
          <span style={{ fontSize: 12, color: "#888" }}>Loading…</span>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Start</th>
            <th style={thStyle}>End</th>
            <th style={thStyle}>Color</th>
            <th style={thStyle}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredPipes.map((pipe) => (
            <tr key={pipe.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{pipe.name}</td>
              <td style={tdStyle}>
                {pipe.startPoint.lat.toFixed(4)},{" "}
                {pipe.startPoint.lng.toFixed(4)}
              </td>
              <td style={tdStyle}>
                {pipe.endPoint.lat.toFixed(4)}, {pipe.endPoint.lng.toFixed(4)}
              </td>
              <td style={tdStyle}>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: pipe.color,
                    marginRight: 6,
                    verticalAlign: "middle",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}
                />
                {pipe.color}
              </td>
              <td style={tdStyle}>{(pipe.tags as string[]).join(", ")}</td>
            </tr>
          ))}
          {filteredPipes.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, color: "#999", textAlign: "center", padding: 20 }}>
                No pipes match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "6px 10px",
  borderBottom: "2px solid #ccc",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "5px 10px",
};

export default TableView;
