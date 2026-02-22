# Interview Feature Challenge: Pipe Search & Highlighting

## Overview
This is a **30-45 minute coding challenge** for senior front-end engineer candidates. After completing the code review phase, candidates will implement a new feature that demonstrates their ability to work with existing codebases, handle state management, and implement user-facing features.

---

## Feature Requirements

### User Story
**As a utility manager**, I want to **search for pipes by name** so that I can **quickly locate and highlight specific infrastructure on the map**.

### Acceptance Criteria

1. **Search Input Component**
   - Add a search input field in the top navigation bar (next to the 100/100K toggle)
   - Input should have placeholder text: "Search pipes by name..."
   - Search should be case-insensitive
   - Search should filter as the user types (debounced by 300ms)

2. **Search Results Display**
   - Show the count of matching pipes (e.g., "Found 5 pipes matching 'water'")
   - If no matches, display "No pipes found"
   - Clear search button (X icon) should appear when text is entered

3. **Map Highlighting**
   - Matching pipes on the map should be highlighted with:
     - Increased line weight (from 4 to 6)
     - Higher opacity (from 0.85 to 1.0)
     - Optional: Add a subtle glow/shadow effect
   - Non-matching pipes should be dimmed (opacity: 0.3)

4. **Table Integration**
   - The table view should show only the matching pipes
   - Search should work in combination with tag filters
   - Highlight matching text in the pipe name column (bold or background color)

5. **State Management**
   - Search term should be stored in the global context
   - Search should persist when switching between 100/100K pipe modes
   - Clearing the search should restore the previous filter state

---

## Technical Considerations

### What We're Evaluating

1. **Code Organization**
   - Clean component structure
   - Proper separation of concerns
   - Reusable utility functions

2. **React Best Practices**
   - Proper use of hooks (useState, useEffect, useMemo, useCallback)
   - Avoiding unnecessary re-renders
   - Correct dependency arrays

3. **TypeScript Usage**
   - Proper typing of new state and functions
   - Avoiding `any` types
   - Type-safe context updates

4. **Performance Awareness**
   - Debouncing search input
   - Memoizing filtered results
   - Efficient string matching (consider using `.includes()` or regex)

5. **User Experience**
   - Smooth interactions
   - Clear visual feedback
   - Intuitive behavior

---

## Implementation Hints

### 1. Context Updates
Add `searchTerm` to the `AppState` interface in `PipeContext.tsx`:

```typescript
interface AppState {
  pipes: Pipe[];
  selectedTag: string | null;
  loading: boolean;
  searchTerm: string; // Add this
}
```

### 2. Debounced Search Hook
Consider creating a custom `useDebounce` hook or using a debounced effect:

```typescript
const [searchInput, setSearchInput] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchInput);
  }, 300);
  return () => clearTimeout(timer);
}, [searchInput]);
```

### 3. Combined Filtering Logic
Filter pipes by both tag AND search term:

```typescript
const filteredPipes = useMemo(() => {
  let result = state.pipes;
  
  // Filter by tag
  if (state.selectedTag) {
    result = result.filter(p => p.tags.includes(state.selectedTag));
  }
  
  // Filter by search term
  if (state.searchTerm) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }
  
  return result;
}, [state.pipes, state.selectedTag, state.searchTerm]);
```

### 4. Conditional Styling in PipeMap
Pass a prop to determine if a pipe matches the search:

```typescript
<Polyline
  key={pipe.id}
  positions={[...]}
  pathOptions={{
    color: pipe.color,
    weight: isHighlighted ? 6 : 4,
    opacity: isHighlighted ? 1.0 : (hasSearch ? 0.3 : 0.85)
  }}
/>
```

---

## Bonus Points

Candidates who finish early can tackle these enhancements:

1. **Search History**
   - Store last 5 searches in localStorage
   - Show dropdown with recent searches

2. **Regex Support**
   - Allow advanced users to search with regex patterns
   - Show error message for invalid regex

3. **Keyboard Shortcuts**
   - `Ctrl/Cmd + K` to focus search
   - `Escape` to clear search
   - Arrow keys to navigate results

4. **Search Performance**
   - For 100K pipes, implement virtual scrolling in table
   - Consider using a search index or Web Worker for large datasets

5. **URL State**
   - Add search term to URL query params
   - Allow deep linking to search results

---

## Expected Outcome

By the end of this challenge, candidates should have:

- ✅ A working search input in the navigation
- ✅ Real-time filtered results in both map and table
- ✅ Visual highlighting of matching pipes
- ✅ Proper state management with context
- ✅ Clean, readable, type-safe code

**Time Allocation:**
- Planning & questions: 5 minutes
- Implementation: 30 minutes
- Testing & refinement: 10 minutes

---

## Evaluation Rubric

| Criteria | Weight | What to Look For |
|----------|--------|------------------|
| **Functionality** | 30% | Feature works as specified, handles edge cases |
| **Code Quality** | 25% | Clean, readable, well-organized code |
| **React Patterns** | 20% | Proper hooks usage, avoiding anti-patterns |
| **TypeScript** | 15% | Strong typing, no `any` types |
| **UX/UI** | 10% | Smooth interactions, clear feedback |

**Scoring:**
- **Senior Level (80%+)**: Clean implementation, proper patterns, handles edge cases
- **Mid Level (60-79%)**: Working feature with some anti-patterns or missing edge cases
- **Junior Level (<60%)**: Incomplete or with significant issues

---

## Discussion Points After Implementation

Use these questions to assess deeper understanding:

1. "How would you optimize this for 1 million pipes?"
2. "What accessibility improvements would you add?"
3. "How would you test this feature?"
4. "What would you do differently if you had more time?"
5. "How would you handle search across multiple fields (tags, color, coordinates)?"

---

## Notes for Interviewers

- **Setup Time**: Ensure the candidate has the app running before starting the timer
- **Hints**: Offer hints if stuck for >5 minutes on a specific issue
- **Focus**: Prioritize working code over perfect code; refactoring can be discussed
- **Flexibility**: If the candidate proposes a different approach, allow it and discuss trade-offs
- **Red Flags**: Watch for prop drilling, missing cleanup, infinite loops, or ignoring existing patterns

Good luck! 🚀
