# Measurement Feature - Setup Guide

## Overview

This document explains the measurement feature scaffolding that has been added to the pipes-geo-app for interview challenges.

## What's Been Added

### 1. **MeasurementPanel Component** (`client/src/components/MeasurementPanel.tsx`)
- Displays selected pipes and their measurements
- Contains empty functions for candidates to implement:
  - `calculateDistance()` - Haversine formula
  - `calculatePipeLength()` - Individual pipe length
  - `calculateConnectedRoute()` - Bonus challenge
- Fully styled and ready to use

### 2. **Context Updates** (`client/src/context/PipeContext.tsx`)
Added state management for:
- `measurementMode: boolean` - Toggle measurement mode
- `selectedPipeIds: number[]` - Track selected pipes
- `setMeasurementMode()` - Enable/disable measurement mode
- `togglePipeSelection()` - Select/deselect pipes
- `clearPipeSelection()` - Clear all selections

### 3. **Navigation Updates** (`client/src/components/Navigation.tsx`)
- "📏 Measure" toggle button
- Shows hint text when in measurement mode
- Clears selection when exiting measurement mode

### 4. **MapView Updates** (`client/src/components/MapView.tsx`)
- Displays MeasurementPanel when measurement mode is active
- Passes selected pipes to the panel
- Handles panel close and clear actions

### 5. **PipeMap Updates** (`client/src/components/PipeMap.tsx`)
- Pipes are clickable in measurement mode
- Selected pipes highlight in gold (#FFD700) with thicker lines
- Click handler toggles pipe selection

### 6. **Styling** (`client/src/index.css`)
- Cursor pointer for clickable pipes
- Crosshair cursor for measurement mode

## How It Works

### User Flow:
1. Click "📏 Measure" button in navigation
2. Click on pipes in the map to select them
3. MeasurementPanel appears showing selected pipes
4. Panel displays measurements (once implemented by candidate)
5. Click "Clear Selection" or close panel to reset
6. Click "Exit Measurement" to leave measurement mode

### State Flow:
```
Navigation → setMeasurementMode(true)
  ↓
PipeMap → handlePipeClick → togglePipeSelection(pipeId)
  ↓
Context → selectedPipeIds updated
  ↓
MapView → filters selectedPipes
  ↓
MeasurementPanel → displays measurements
```

## What Candidates Need to Implement

See `MEASUREMENT-CHALLENGE.md` for detailed instructions.

**Core Tasks:**
1. Use the provided `calculateDistance()` utility to implement `calculatePipeLength()`
2. Calculate total length using array reduce
3. Ensure measurements display correctly

**Bonus:**
4. Add `useMemo` for performance optimization
5. Implement connected route calculation

**Note:** The Haversine formula is provided in `utils/distance.ts` so candidates can focus on React patterns, state management, and problem-solving rather than mathematical formulas.

## Testing the Scaffolding

You can test that the UI works without implementing the calculations:

```bash
# Start server
cd server && npm run dev

# Start client (in another terminal)
cd client && npm run dev
```

**Expected behavior:**
- ✅ Measure button toggles on/off
- ✅ Clicking pipes selects/deselects them (gold highlight)
- ✅ MeasurementPanel appears with selected pipes
- ✅ Panel shows "0 m" for all distances (until implemented)
- ✅ Clear selection works
- ✅ Exit measurement mode clears everything

## Files Modified

```
client/src/
├── components/
│   ├── MeasurementPanel.tsx    (NEW - main challenge file)
│   ├── Navigation.tsx           (MODIFIED - added measure button)
│   ├── MapView.tsx              (MODIFIED - added panel display)
│   └── PipeMap.tsx              (MODIFIED - added click handlers)
├── context/
│   └── PipeContext.tsx          (MODIFIED - added measurement state)
├── utils/
│   └── distance.ts              (NEW - Haversine formula utility)
└── index.css                    (MODIFIED - added cursor styles)
```

## Interview Usage

1. **Before Interview:**
   - Ensure app is running
   - Test that measurement mode UI works
   - Have `MEASUREMENT-CHALLENGE.md` ready

2. **During Interview:**
   - Show the candidate the UI working
   - Give them `MEASUREMENT-CHALLENGE.md`
   - Point them to `MeasurementPanel.tsx`
   - Let them implement the calculations

3. **Time Allocation:**
   - 5 min: Understand requirements
   - 25 min: Implement core features
   - 10 min: Test and refine
   - Optional: Bonus challenge if time permits

## Notes

- All UI/UX is complete - candidates focus on algorithms
- TypeScript types are already defined
- No need to modify state management
- Haversine formula is the key challenge
- Connected route is intentionally harder (bonus)

---

**Ready to use!** The scaffolding is complete and candidates can start coding immediately.
