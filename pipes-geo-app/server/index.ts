import express, { Request, Response } from "express";
import cors from "cors";
import { getAllPipes, getPipesByTag, insertPipe, PipeRow } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

// GET /pipes?tag=water&limit=100
app.get("/pipes", (req: Request, res: Response) => {
  const { tag, limit } = req.query;
  const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
  
  try {
    const pipes = tag ? getPipesByTag(tag as string) : getAllPipes(parsedLimit);
    const result = pipes.map((p: PipeRow) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      tags: JSON.parse(p.tags),
      startPoint: { lat: p.start[0], lng: p.start[1] },
      endPoint: { lat: p.end[0], lng: p.end[1] },
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pipes" });
  }
});

// POST /pipes
interface CreatePipeDto {
  name: string;
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
  color?: string;
  tags?: string[];
}

app.post("/pipes", (req: Request, res: Response) => {
  const body = req.body as CreatePipeDto;
  
  // Validate required fields
  if (!body.name || !body.startPoint || !body.endPoint) {
    res.status(400).json({ error: "Missing required fields: name, startPoint, endPoint" });
    return;
  }
  
  try {
    const inserted = insertPipe({
      name: body.name,
      start: [body.startPoint.lat, body.startPoint.lng],
      end: [body.endPoint.lat, body.endPoint.lng],
      color: body.color ?? "#607D8B",
      tags: JSON.stringify(body.tags ?? []),
    });
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: "Invalid pipe data" });
  }
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Pipes API listening on http://localhost:${PORT}`);
});
