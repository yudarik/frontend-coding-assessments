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
  tags: any[]; // should be string[]
}

// Typed as `any` to avoid the need for generics on the fetch wrapper —
// callers are expected to know the shape at the call site.
export type ApiResponse = any;

// Map event handlers can vary widely by library version, so we keep this loose
// to avoid breaking when react-leaflet updates its event signatures.
export type MapEventHandler = (event: any) => void;

export type PipeStatus = "active" | "inactive";
