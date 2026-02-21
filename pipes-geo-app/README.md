# Pipes Geo Viewer — Interview Code Review Exercise

A React + Express.js geo-spatial pipes visualization app. Split-screen layout: interactive map (top) and data table (bottom). Pipes can be filtered by tag; both views update accordingly.

This codebase is **intentionally flawed** for use in a Phase 2 code review interview session. The candidate is given this code, asked to review it live, explain what's wrong, and refactor key parts.

---

## Setup

### Server (runs on port 4000)

```bash
cd server
npm install
npm run dev
```

### Client (runs on port 5173)

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## What's Wrong — Interviewer Reference

> **Do not share this section with the candidate.**

### Flaw 1 — Unstable `useEffect` dependency (`PipeMap.tsx`)

**Where:** `PipeMap.tsx` — the `useEffect` with `[{ tag: "all" }]` as its dependency array.

**Problem:** The dependency is an object literal. In JavaScript, `{} !== {}` — a new object is created on every render, so React sees the dependency as always-changed and re-runs the effect on every render cycle.

**Fix:** Depend on the primitive value: `[selectedTag]` or `[]` if the effect doesn't actually need to react to a prop.

---

### Flaw 2 — Duplicated filter state (`MapView.tsx`, `TableView.tsx`)

**Where:** Both components have their own `useState<string | null>(null)` for `activeTag`, independent of `context.state.selectedTag`.

**Problem:** Three sources of truth exist for a single piece of UI state. A tag click in MapView doesn't update TableView's local state (and vice versa), so the map and table go out of sync. Context is updated but never read back for filtering.

**Fix:** Remove local `activeTag` state from both components. Read from and write to `context.state.selectedTag` only. Compute `filteredPipes` from `state.selectedTag`.

---

### Flaw 3 — `useMemo` misuse (`PipeMap.tsx`)

**Where:** Two problems in the same file:
- `useMemo` wraps a trivial string interpolation (`"Showing N pipes"`) — this is essentially free and gains nothing.
- The GeoJSON `FeatureCollection` build (an O(n) allocation-heavy transform) runs inline on every render with no memoization at all.

**Problem:** The memoization effort is completely inverted. Expensive work is unmemoized; trivial work is memoized.

**Fix:** Remove `useMemo` from the label. Wrap the GeoJSON transform: `useMemo(() => ({ type: "FeatureCollection", features: pipes.map(...) }), [pipes])`.

---

### Flaw 4 — Direct DOM mutation mixed with React state (`PipeMap.tsx`)

**Where:** `MapCenterController` calls `map.flyTo(...)` inside a `useEffect`.

**Problem:** This bypasses React's rendering model. The Leaflet viewport state now lives outside of React entirely. There's no cleanup if the component unmounts during the animation, and it can race with parent re-renders that reset the map's center prop.

**Fix:** Control the viewport declaratively. Pass a `center` prop that React manages, or use `useMapEvents` to respond to data changes through react-leaflet's API rather than the raw Leaflet instance.

---

### Flaw 5 — Context causes full-tree re-renders (`PipeContext.tsx`, `App.tsx`)

**Where:** `PipeProvider` creates a new `value` object literal on every render (no `useMemo`). `PipeProvider` wraps the entire application in `App.tsx`.

**Problem:** Every `setPipes`, `setLoading`, or `setSelectedTag` call triggers a re-render of every context consumer — `AppShell`, `MapView`, `TableView`, `PipeMap`, and `MapCenterController`. This amplifies the fetch-in-render bug (flaw 8) into a request flood.

**Fix (minimal):** `const value = useMemo(() => ({ state, setPipes, setSelectedTag, setLoading }), [state, setPipes, setSelectedTag, setLoading])`.

**Fix (better):** Split into separate contexts — `PipesContext` (data) and `FilterContext` (UI state) — so a filter change doesn't re-render components that only care about pipe data.

---

### Flaw 6 — Missing error boundary around map (`App.tsx`, `PipeMap.tsx`)

**Where:** Neither `App.tsx` nor `PipeMap.tsx` wrap the Leaflet `MapContainer` with an `ErrorBoundary`.

**Problem:** `react-leaflet` can throw during mount (missing CSS, tile load failure, NaN coordinates from a bad API response). Without a boundary, a single bad pipe record crashes the entire application to a blank screen.

**Fix:** Wrap `<MapView>` in a class-based `ErrorBoundary` (or use `react-error-boundary`) with a fallback UI. `ErrorBoundary` must be a class component or use the `react-error-boundary` package — `try/catch` and functional components cannot catch render errors.

---

### Flaw 7 — Loose TypeScript types (`types.ts`, `server/index.ts`)

**Where:**
- `types.ts`: `tags: any[]` (should be `string[]`), `ApiResponse = any` (should be `Pipe[]`), `MapEventHandler = (event: any) => void`.
- `server/index.ts`: `const body: any = req.body`.

**Problem:** TypeScript gives zero protection on the API boundary. `ApiResponse = any` means every consumer of the fetch result is silently untyped. `tags: any[]` means `.join()`, `.includes()`, and other string operations on tags are unchecked.

**Fix:** `tags: string[]`, `type ApiResponse = Pipe[]`, use `LeafletMouseEvent` (from `leaflet`) for map event handlers. On the server, define a `CreatePipeDto` interface and validate the body against it.

---

### Flaw 8 — API call inside render body (`TableView.tsx`)

**Where:** `fetch(...)` is called directly in `TableView`'s render function — not inside a `useEffect`, not in a custom hook.

**Problem:** The fetch fires on every render. Combined with flaw 5 (context re-renders), this creates a request flood: every `setPipes` call from the fetch response triggers a re-render, which fires another fetch, which calls `setPipes` again. There's also no `AbortController`, so stale responses can overwrite fresh data.

**Fix (minimum):** Move the fetch into `useEffect(() => { ... }, [])` with an `AbortController` for cleanup.

**Fix (recommended):** Extract into a `usePipes()` custom hook that encapsulates the fetch lifecycle. Better still, use TanStack Query or SWR for caching, deduplication, and loading/error states.

---

## Flaw Quick-Reference Table

| # | Flaw | File | Symptom |
|---|------|------|---------|
| 1 | Unstable `useEffect` dep | `PipeMap.tsx` | Console logs on every render |
| 2 | Duplicated filter state | `MapView.tsx`, `TableView.tsx` | Map and table desync on filter |
| 3 | `useMemo` misuse | `PipeMap.tsx` | GeoJSON rebuilt every render |
| 4 | Imperative DOM mutation | `PipeMap.tsx` | Viewport state outside React |
| 5 | Context re-renders | `PipeContext.tsx`, `App.tsx` | Full tree re-renders on any change |
| 6 | Missing error boundary | `App.tsx`, `PipeMap.tsx` | Map crash = blank screen |
| 7 | Loose `any` types | `types.ts`, `server/index.ts` | No TypeScript protection on API data |
| 8 | Fetch in render body | `TableView.tsx` | Network tab floods with requests |

# Pipes Geo Viewer

A React + Express.js geo-spatial pipes visualization application. The app features a split-screen layout with an interactive map (top) and data table (bottom). Pipes can be filtered by tag, and both views update accordingly.

## Project Overview

This application visualizes underground utility pipes (water, gas, sewage, electric, etc.) on a map of Tel Aviv. Users can:

- View pipes on an interactive map with different colors representing different utility types
- Browse pipe data in a table format
- Filter pipes by tags (water, gas, sewage, etc.)
- Switch between viewing 100 pipes or 100,000 pipes

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm

### Server Setup (runs on port 4000)

```bash
cd server
npm install
npm run dev
```

### Client Setup (runs on port 5173)

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Generating Pipe Data

The server includes a script to generate synthetic pipe data:

```bash
cd server
npm run generate-pipes [count]
```

Examples:
- `npm run generate-pipes 100` - Generate 100 pipes
- `npm run generate-pipes 100000` - Generate 100,000 pipes

All generated pipes are constrained to Tel Aviv's street area.

## Project Structure

```
pipes-geo-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context for state management
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   └── package.json
│
└── server/                 # Express backend
    ├── db.ts              # Database operations
    ├── index.ts           # API server
    ├── generate-pipes.ts  # Pipe generation script
    └── package.json
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- React Router
- Leaflet & React-Leaflet (for maps)
- Vite (build tool)

### Backend
- Node.js
- Express
- better-sqlite3 (database)
- TypeScript

## API Endpoints

- `GET /pipes` - Fetch all pipes
- `GET /pipes?limit=100` - Fetch pipes with limit
- `GET /pipes?tag=water` - Fetch pipes filtered by tag
- `POST /pipes` - Create a new pipe

## Features

- **Interactive Map**: Visualize pipes on OpenStreetMap tiles
- **Data Table**: Browse pipe details in tabular format
- **Tag Filtering**: Filter pipes by utility type
- **Performance Modes**: Switch between 100 and 100K pipes
- **Responsive Layout**: Split-screen design with resizable panels

## Development

The application uses TypeScript for type safety and Vite for fast development builds. Hot module replacement is enabled for both frontend and backend during development.

## License

This project is for interview purposes.
