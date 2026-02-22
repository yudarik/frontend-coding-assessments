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
