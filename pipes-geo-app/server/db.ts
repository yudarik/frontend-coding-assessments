import Database from "better-sqlite3";

export interface PipeRow {
  id: number;
  name: string;
  start: [number, number]; // [lat, lng]
  end: [number, number]; // [lat, lng]
  color: string;
  tags: string; // JSON-serialized string[]
}

const db = new Database("pipes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS pipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    color TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]'
  )
`);

const insert = db.prepare(`
  INSERT INTO pipes (name, start, end, color, tags)
  VALUES (@name, @start, @end, @color, @tags)
`);

// Helper function to serialize coordinates for database storage
const serializeCoord = (coord: [number, number]): string => JSON.stringify(coord);

// Helper function to deserialize coordinates from database
const deserializeCoord = (coord: string): [number, number] => JSON.parse(coord);

// Helper function to convert PipeRow from DB format to application format
const deserializePipeRow = (row: any): PipeRow => ({
  ...row,
  start: deserializeCoord(row.start),
  end: deserializeCoord(row.end),
});

// Pipe generator function that creates connected pipes
export const generateConnectedPipes = (count: number = 100000): void => {
  const colors = [
    "#2196F3", // Blue - Water
    "#FF9800", // Orange - Gas
    "#795548", // Brown - Sewage
    "#F44336", // Red - Electric
    "#9C27B0", // Purple - Fiber
    "#4CAF50", // Green - Data
    "#00BCD4", // Cyan - Cooling
    "#FFC107", // Amber - Steam
  ];

  const tagsByColor: { [key: string]: string[] } = {
    "#2196F3": ["water", "main"],
    "#FF9800": ["gas", "primary"],
    "#795548": ["sewage"],
    "#F44336": ["electric", "primary"],
    "#9C27B0": ["fiber", "main"],
    "#4CAF50": ["data", "network"],
    "#00BCD4": ["cooling", "hvac"],
    "#FFC107": ["steam", "heating"],
  };

  const pipeTypes = [
    "Water Line",
    "Gas Pipeline",
    "Sewage Line",
    "Electric Conduit",
    "Fiber Optic Run",
    "Data Cable",
    "Cooling Pipe",
    "Steam Line",
  ];

  // Tel Aviv boundaries (land area only, excluding Mediterranean Sea)
  const TEL_AVIV_BOUNDS = {
    minLat: 32.0,      // Southern boundary
    maxLat: 32.15,     // Northern boundary
    minLng: 34.76,     // Western boundary (coastline - avoid sea)
    maxLng: 34.85,     // Eastern boundary
  };

  // Helper function to clamp coordinates within Tel Aviv bounds
  const clampToBounds = (point: [number, number]): [number, number] => {
    return [
      Math.max(TEL_AVIV_BOUNDS.minLat, Math.min(TEL_AVIV_BOUNDS.maxLat, point[0])),
      Math.max(TEL_AVIV_BOUNDS.minLng, Math.min(TEL_AVIV_BOUNDS.maxLng, point[1])),
    ];
  };

  // Starting point (Tel Aviv center)
  let currentPoint: [number, number] = [32.0853, 34.7818];
  let currentColor = colors[0];
  let chainLength = 0;
  const maxChainLength = Math.floor(Math.random() * 20) + 10; // 10-30 pipes per chain

  console.log(`Generating ${count} connected pipes...`);
  const batchSize = 1000;
  
  for (let i = 0; i < count; i++) {
    // Change color when starting a new chain
    if (chainLength === 0) {
      currentColor = colors[Math.floor(Math.random() * colors.length)];
    }

    // Generate end point (small random offset from current point)
    const latOffset = (Math.random() - 0.5) * 0.01; // ~1km max
    const lngOffset = (Math.random() - 0.5) * 0.01;
    let endPoint: [number, number] = [
      currentPoint[0] + latOffset,
      currentPoint[1] + lngOffset,
    ];
    
    // Clamp end point to stay within Tel Aviv bounds
    // endPoint = clampToBounds(endPoint);

    const pipeType = pipeTypes[colors.indexOf(currentColor)];
    const tags = tagsByColor[currentColor] || ["utility"];

    const pipe = {
      name: `${pipeType} ${i + 1}`,
      start: serializeCoord(currentPoint),
      end: serializeCoord(endPoint),
      color: currentColor,
      tags: JSON.stringify(tags),
    };

    insert.run(pipe);

    // Move to the next point (end becomes start)
    currentPoint = endPoint;
    chainLength++;

    // Decide if we should start a new chain
    if (chainLength >= maxChainLength) {
      chainLength = 0;
      // Optionally jump to a new area (20% chance)
      if (Math.random() < 0.2) {
        let newPoint: [number, number] = [
          32.0853 + (Math.random() - 0.5) * 0.1,
          34.7818 + (Math.random() - 0.5) * 0.1,
        ];
        // Clamp new starting point to stay within Tel Aviv bounds
        currentPoint = clampToBounds(newPoint);
      }
    }

    // Progress logging
    if ((i + 1) % batchSize === 0) {
      console.log(`Generated ${i + 1}/${count} pipes...`);
    }
  }

  console.log(`Successfully generated ${count} pipes!`);
};

export const clearAllPipes = (): void => {
  db.prepare("DELETE FROM pipes").run();
  console.log("All pipes cleared from database");
};

export const getPipeCount = (): number => {
  const result = db.prepare("SELECT COUNT(*) as count FROM pipes").get() as { count: number };
  return result.count;
};

export const getAllPipes = (limit?: number): PipeRow[] => {
  let query = "SELECT * FROM pipes";
  if (limit !== undefined && limit > 0) {
    query += ` LIMIT ${limit}`;
  }
  const rows = db.prepare(query).all();
  return rows.map(deserializePipeRow);
};

export const getPipesByTag = (tag: string): PipeRow[] => {
  const rows = db
    .prepare("SELECT * FROM pipes WHERE tags LIKE ?")
    .all(`%"${tag}"%`);
  return rows.map(deserializePipeRow);
};

export const insertPipe = (pipe: Omit<PipeRow, "id">): PipeRow => {
  const dbPipe = {
    name: pipe.name,
    start: serializeCoord(pipe.start),
    end: serializeCoord(pipe.end),
    color: pipe.color,
    tags: pipe.tags,
  };
  const result = insert.run(dbPipe);
  const row = db
    .prepare("SELECT * FROM pipes WHERE id = ?")
    .get(result.lastInsertRowid);
  return deserializePipeRow(row);
};

export default db;
