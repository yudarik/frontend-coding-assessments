# Interview Challenges Summary

This repository contains **three interview challenges** for senior front-end engineer candidates.

---

## Phase 1: Code Review (30-45 minutes)

**Document:** Main `README.md` + `SOLUTION-1-SUMMARY.md`

**Objective:** Review intentionally flawed code and identify issues

**8 Flaws to Find:**
1. Unstable useEffect dependency (object literal)
2. Duplicated filter state (map/table out of sync)
3. useMemo misuse (trivial computation memoized, expensive one not)
4. Direct DOM mutation without cleanup
5. Context re-renders (no memoization)
6. Missing error boundary
7. Loose TypeScript types (`any`)
8. API call without AbortController

**Format:** Live code review, explain issues, suggest fixes

---

## Phase 2: Feature Implementation

Choose **ONE** of these two challenges:

### Option A: Search & Highlighting Feature (30-45 minutes)

**Document:** `INTERVIEW-FEATURE-CHALLENGE.md`

**Objective:** Add search functionality to find and highlight pipes

**Requirements:**
- Search input with debouncing
- Filter map and table by pipe name
- Visual highlighting of matching pipes
- State management via context
- Works with existing tag filters

**Tests:**
- React patterns (hooks, context, memoization)
- State management
- TypeScript
- Performance awareness
- UX considerations

**Bonus Challenges:**
- Search history
- Regex support
- Keyboard shortcuts
- URL state persistence

---

### Option B: Measurement Feature (30-40 minutes) ⭐ RECOMMENDED

**Document:** `MEASUREMENT-CHALLENGE.md`

**Objective:** Implement pipe distance calculations

**What's Provided:**
- ✅ Complete UI scaffolding
- ✅ State management ready
- ✅ Haversine formula utility (`utils/distance.ts`)
- ✅ Click handlers and selection logic

**What Candidate Implements:**
- Use `calculateDistance()` utility to calculate pipe lengths
- Sum total length using array operations
- Display measurements correctly
- **Bonus:** Add `useMemo` for performance
- **Bonus:** Connected route calculation (TSP-like)

**Why This is Better:**
- Focuses on React patterns, not math
- Clear, achievable scope
- Tests practical skills
- Less time on formulas, more on architecture

**Tests:**
- Using utilities effectively
- Array operations (map, reduce)
- React hooks (useMemo)
- TypeScript
- Problem decomposition

---

## Phase 3: Infrastructure Challenge (15-30 minutes)

**Document:** `BONUS-INFRASTRUCTURE-CHALLENGES.md`

**Objective:** Demonstrate architectural/DevOps knowledge

**7 Challenge Options:**

1. **Testing Infrastructure** - Jest, React Testing Library, coverage
2. **Performance Optimization** - Virtual scrolling, clustering, Web Workers
3. **CI/CD Pipeline** - GitHub Actions, Docker, deployment
4. **API Improvements** - Pagination, caching, advanced queries
5. **Monitoring & Observability** - Error tracking, logging, metrics
6. **Security Hardening** - Input validation, auth, security headers
7. **Accessibility** - WCAG 2.1 AA, keyboard nav, screen readers

**Choose based on candidate's background:**
- Backend-focused: #4, #5, #6
- Frontend-focused: #2, #7, #1
- DevOps/Full-stack: #3, #5, #6
- Architects: Any combination

---

## Recommended Interview Flow

### Total Time: 90-120 minutes

**Part 1: Code Review (30-45 min)**
- Give candidate the codebase
- Ask them to review and identify issues
- Discuss each flaw and potential fixes
- Evaluate: attention to detail, React knowledge, best practices

**Part 2: Feature Implementation (30-45 min)**
- Choose Measurement Feature (recommended) or Search Feature
- Candidate implements the feature
- Test the implementation
- Evaluate: coding skills, problem-solving, React patterns

**Part 3: Discussion & Bonus (15-30 min)**
- Discuss implementation decisions
- Ask "what if" questions (scale, testing, etc.)
- If time permits: Infrastructure challenge
- Evaluate: architectural thinking, depth of knowledge

---

## Setup Before Interview

1. **Ensure app runs:**
   ```bash
   cd server && npm install && npm run dev
   cd client && npm install && npm run dev
   ```

2. **Generate test data:**
   ```bash
   cd server
   npm run generate-pipes-100      # For quick testing
   npm run generate-pipes-10k      # For performance testing
   ```

3. **Have documents ready:**
   - `README.md` - Project overview
   - `MEASUREMENT-CHALLENGE.md` - Feature challenge instructions
   - `BONUS-INFRASTRUCTURE-CHALLENGES.md` - Optional advanced challenges

4. **Test measurement UI:**
   - Click "📏 Measure" button
   - Verify pipes are clickable
   - Check panel appears (will show 0m until implemented)

---

## Evaluation Criteria

### Code Review Phase
- **Identification:** Can they spot the 8 flaws?
- **Explanation:** Do they understand why each is a problem?
- **Solutions:** Can they suggest proper fixes?
- **Depth:** Do they understand React internals?

### Feature Implementation Phase
- **Functionality:** Does it work as specified?
- **Code Quality:** Clean, readable, maintainable?
- **React Patterns:** Proper hooks usage, no anti-patterns?
- **TypeScript:** Strong typing, no `any`?
- **Performance:** Appropriate optimizations?

### Infrastructure Phase (Optional)
- **Completeness:** Working solution?
- **Best Practices:** Production-ready approach?
- **Trade-offs:** Can they explain decisions?
- **Scalability:** Thinking beyond the immediate problem?

---

## Scoring Guide

| Level | Score | Criteria |
|-------|-------|----------|
| **Senior** | 80%+ | Finds most flaws, implements feature cleanly, shows depth |
| **Mid-Senior** | 65-79% | Finds key flaws, working implementation, some gaps |
| **Mid** | 50-64% | Misses some flaws, basic implementation, needs guidance |
| **Junior** | <50% | Struggles with review or implementation |

---

## Files Overview

```
pipes-geo-app/
├── README.md                              # Project overview + code review
├── SOLUTION-1-SUMMARY.md                  # Solution to code review
├── INTERVIEW-FEATURE-CHALLENGE.md         # Search feature challenge
├── MEASUREMENT-CHALLENGE.md               # Measurement feature challenge ⭐
├── MEASUREMENT-SETUP.md                   # Setup guide for measurement
├── BONUS-INFRASTRUCTURE-CHALLENGES.md     # 7 advanced challenges
└── INTERVIEW-CHALLENGES-SUMMARY.md        # This file

client/src/
├── components/
│   ├── MeasurementPanel.tsx              # Main challenge file
│   ├── Navigation.tsx                     # Measure toggle
│   ├── MapView.tsx                        # Panel integration
│   └── PipeMap.tsx                        # Click handlers
├── utils/
│   └── distance.ts                        # Haversine utility (provided)
└── context/
    └── PipeContext.tsx                    # State management
```

---

## Tips for Interviewers

1. **Be flexible** - If candidate proposes different approach, explore it
2. **Provide hints** - Don't let them get stuck for >5 minutes
3. **Focus on thinking** - Process matters more than perfect code
4. **Ask follow-ups** - "How would you test this?" "What if we had 1M pipes?"
5. **Watch for red flags** - Prop drilling, missing cleanup, infinite loops
6. **Time management** - Keep phases moving, don't let one consume all time

---

## Quick Decision Matrix

**Use Measurement Challenge if candidate:**
- ✅ Strong React background
- ✅ Limited time (30-40 min)
- ✅ Focus on practical implementation
- ✅ You want to test hooks/memoization

**Use Search Challenge if candidate:**
- ✅ More time available (45 min)
- ✅ Want to test debouncing/async patterns
- ✅ Focus on UX/interaction design
- ✅ Want to see URL state management

**Both are excellent!** Measurement is slightly more focused and time-efficient.

---

Good luck with your interviews! 🚀
