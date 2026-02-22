# Measurement Feature Challenge

## Objective
Implement the pipe measurement feature. The UI is built, state management is ready, and the distance calculation utility is provided. Focus on using React patterns effectively.

## Time: 30-40 minutes

---

## What's Already Done ✅

- ✅ Measurement mode toggle and UI
- ✅ MeasurementPanel component with styling
- ✅ State management (context, selection, etc.)
- ✅ **Distance calculation utility** (`utils/distance.ts`)
- ✅ Pipe click handlers and visual highlighting

## What You Need to Implement 🎯

### 1. Core: Calculate Pipe Lengths (Required)

In `client/src/components/MeasurementPanel.tsx`:

**Step 1:** Implement `calculatePipeLength()` function
```typescript
function calculatePipeLength(pipe: Pipe): number {
  // TODO: Use the provided calculateDistance utility
  // calculateDistance(point1, point2) returns meters
  return 0;
}
```

**Step 2:** Calculate total length
```typescript
// TODO: Sum all measurement lengths
const totalLength = 0; // Replace this
```

**Hint:** The `calculateDistance` function is already imported from `utils/distance.ts`

### 2. Bonus: Performance Optimization (Optional)

Use `useMemo` to avoid recalculating measurements on every render:

```typescript
const measurements = useMemo(() => {
  return selectedPipes.map((pipe) => ({
    id: pipe.id,
    name: pipe.name,
    length: calculatePipeLength(pipe),
  }));
}, [selectedPipes]);
```

### 3. Bonus: Connected Route Calculation (Advanced)

Implement the `calculateConnectedRoute()` function to find the optimal path visiting all selected pipes:

**Goal:** Calculate total distance including gaps between pipes (like a maintenance route)

**Approach:**
- Use a greedy nearest-neighbor algorithm
- Start at first pipe's endpoint
- Find closest unvisited pipe endpoint
- Sum pipe lengths + gap distances

---

## How to Test

1. **Start the app:**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

2. **Test the feature:**
   - Click "📏 Measure" button
   - Click 2-3 pipes on the map (they turn gold)
   - Check MeasurementPanel shows correct lengths
   - Verify total is sum of individual lengths

3. **Expected results:**
   - Tel Aviv pipes are typically 50-500 meters
   - Total should equal sum of individuals
   - Format: "1.23 km" or "345 m"

---

## Acceptance Criteria

### Must Have ✓
- [ ] `calculatePipeLength()` uses `calculateDistance()` correctly
- [ ] Individual pipe lengths display in panel
- [ ] Total length calculation is correct
- [ ] No TypeScript errors
- [ ] Measurements update when selection changes

### Nice to Have ⭐
- [ ] Use `useMemo` for performance optimization
- [ ] Connected route calculation (bonus)
- [ ] Handle edge cases (0 pipes, 1 pipe, etc.)

---

## Provided Utilities

### `calculateDistance(point1, point2)`
Located in `utils/distance.ts` - already imported

**Parameters:**
- `point1: LatLng` - `{lat: number, lng: number}`
- `point2: LatLng` - `{lat: number, lng: number}`

**Returns:** `number` - Distance in meters

**Example:**
```typescript
const distance = calculateDistance(
  { lat: 32.0853, lng: 34.7818 },
  { lat: 32.0900, lng: 34.7850 }
);
// Returns: ~450 meters
```

### `formatDistance(meters)`
Also in `utils/distance.ts` - already imported

**Parameters:**
- `meters: number` - Distance in meters

**Returns:** `string` - Formatted as "X.XX km" or "XXX m"

---

## Implementation Hints

<details>
<summary>Hint 1: Calculate Pipe Length</summary>

```typescript
function calculatePipeLength(pipe: Pipe): number {
  return calculateDistance(pipe.startPoint, pipe.endPoint);
}
```

Simple! Just pass the two endpoints to the utility function.
</details>

<details>
<summary>Hint 2: Calculate Total Length</summary>

```typescript
const totalLength = measurements.reduce((sum, m) => sum + m.length, 0);
```

Use `Array.reduce()` to sum all the lengths.
</details>

<details>
<summary>Hint 3: Memoization</summary>

```typescript
const measurements = useMemo(() => {
  return selectedPipes.map((pipe) => ({
    id: pipe.id,
    name: pipe.name,
    length: calculatePipeLength(pipe),
  }));
}, [selectedPipes]); // Only recalculate when selectedPipes changes
```

Don't forget to import `useMemo` from React!
</details>

<details>
<summary>Hint 4: Connected Route (Bonus)</summary>

Greedy nearest-neighbor approach:

```typescript
function calculateConnectedRoute() {
  if (selectedPipes.length === 0) return { pipeLength: 0, gapLength: 0, totalRoute: 0 };
  
  let totalPipeLength = 0;
  let totalGapLength = 0;
  
  // Calculate all pipe lengths
  selectedPipes.forEach(pipe => {
    totalPipeLength += calculatePipeLength(pipe);
  });
  
  // Calculate gaps between pipes (simplified)
  for (let i = 0; i < selectedPipes.length - 1; i++) {
    const currentEnd = selectedPipes[i].endPoint;
    const nextStart = selectedPipes[i + 1].startPoint;
    totalGapLength += calculateDistance(currentEnd, nextStart);
  }
  
  return {
    pipeLength: totalPipeLength,
    gapLength: totalGapLength,
    totalRoute: totalPipeLength + totalGapLength,
  };
}
```

For a more optimal solution, implement a proper nearest-neighbor algorithm.
</details>

---

## Evaluation

| Criteria | Weight | What We're Looking For |
|----------|--------|------------------------|
| **Correctness** | 40% | Calculations are accurate |
| **React Patterns** | 30% | Proper use of hooks, memoization |
| **Code Quality** | 20% | Clean, readable, well-structured |
| **Bonus Features** | 10% | Connected route, optimizations |

**Pass:** 70%+ (Core functionality working correctly)

---

## Discussion Questions

After implementing, be ready to discuss:

1. **Why use `useMemo` here?** What's the performance benefit?
2. **How would you test this feature?** What test cases matter?
3. **What if we had 10,000 selected pipes?** How would you optimize?
4. **Alternative approaches?** Any other ways to structure this?
5. **Edge cases?** What could go wrong?

---

## Key Focus Areas

This challenge tests:
- ✅ **Using utilities effectively** - Don't reinvent the wheel
- ✅ **Array operations** - map, reduce, filter
- ✅ **React hooks** - useMemo for performance
- ✅ **TypeScript** - Working with typed data
- ✅ **Problem decomposition** - Breaking down the problem

**Not testing:**
- ❌ Mathematical formula derivation
- ❌ Complex algorithms (unless bonus)
- ❌ UI/UX design (already done)

---

## Quick Start Checklist

1. [ ] Open `client/src/components/MeasurementPanel.tsx`
2. [ ] Find the `calculatePipeLength()` function
3. [ ] Implement using `calculateDistance()`
4. [ ] Calculate `totalLength` using `reduce()`
5. [ ] Test by selecting pipes in the UI
6. [ ] Add `useMemo` if time permits
7. [ ] Bonus: Implement connected route

Good luck! 🚀
