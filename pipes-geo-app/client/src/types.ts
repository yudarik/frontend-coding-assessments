import { LeafletMouseEvent } from "leaflet";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Pipe {
  id: number;
  name: string;
  startPoint: LatLng;
  endPoint: LatLng;
  color: string;
  tags: string[];
}

export type ApiResponse = Pipe[];

export type MapEventHandler = (event: LeafletMouseEvent) => void;

export type PipeStatus = "active" | "inactive";

// DTO for creating a new pipe
export interface CreatePipeDto {
  name: string;
  startPoint: LatLng;
  endPoint: LatLng;
  color?: string;
  tags?: string[];
}
