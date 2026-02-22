# Bonus Infrastructure Challenges

## Overview
These are **optional advanced challenges** for senior candidates who excel in the code review and feature implementation phases. These challenges assess architectural thinking, DevOps knowledge, testing practices, and scalability considerations.

Choose **one or more** based on the candidate's background and time remaining (15-30 minutes each).

---

## Challenge 1: Testing Infrastructure Setup

### Objective
Set up a comprehensive testing framework for the application.

### Requirements

1. **Unit Testing Setup**
   - Configure Jest + React Testing Library
   - Add test scripts to `package.json`
   - Create example tests for at least 2 components

2. **Component Tests to Write**
   - `PipeContext`: Test state updates and context value memoization
   - `MapView`: Test tag filtering UI interactions
   - `TableView`: Test pipe rendering and empty states
   - Custom hooks: Test `useDebounce` if implemented

3. **Integration Tests**
   - Test the full filter flow: tag selection → context update → map + table update
   - Test API integration with mock fetch

4. **Test Coverage**
   - Configure coverage reporting
   - Aim for >70% coverage on core business logic

### Deliverables
```bash
# Should be able to run:
npm test
npm run test:coverage
npm run test:watch
```

### Example Test Structure
```typescript
// PipeContext.test.tsx
describe('PipeContext', () => {
  it('should update pipes without re-creating context value unnecessarily', () => {
    // Test memoization
  });
  
  it('should filter pipes by selected tag', () => {
    // Test filtering logic
  });
});
```

### Evaluation Criteria
- ✅ Tests are meaningful and cover edge cases
- ✅ Proper use of testing library patterns (render, screen, userEvent)
- ✅ Mocks are used appropriately (fetch, Leaflet)
- ✅ Tests are fast and isolated

---

## Challenge 2: Performance Optimization & Monitoring

### Objective
Implement performance optimizations and monitoring for handling 100K+ pipes.

### Requirements

1. **Virtual Scrolling**
   - Implement virtual scrolling in `TableView` using `react-window` or `react-virtual`
   - Should smoothly handle 100K rows

2. **Map Clustering**
   - Add marker clustering for the map view using `react-leaflet-cluster`
   - Pipes should cluster at lower zoom levels
   - Clicking a cluster should zoom in

3. **Performance Monitoring**
   - Add React DevTools Profiler instrumentation
   - Log render times for key components
   - Identify and fix unnecessary re-renders

4. **Lazy Loading**
   - Implement code splitting for map components
   - Add loading states with Suspense
   - Lazy load Leaflet CSS

5. **Web Workers (Advanced)**
   - Move pipe filtering logic to a Web Worker
   - Handle large dataset filtering off the main thread

### Example Implementation
```typescript
// Virtual scrolling in TableView
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const pipe = filteredPipes[index];
  return (
    <div style={style}>
      {/* Pipe row content */}
    </div>
  );
};

<FixedSizeList
  height={600}
  itemCount={filteredPipes.length}
  itemSize={35}
  width="100%"
>
  {Row}
</FixedSizeList>
```

### Evaluation Criteria
- ✅ Measurable performance improvements (use Chrome DevTools)
- ✅ Smooth scrolling and interactions with 100K pipes
- ✅ Proper use of performance optimization techniques
- ✅ No degradation in functionality

---

## Challenge 3: CI/CD Pipeline Setup

### Objective
Set up a complete CI/CD pipeline with GitHub Actions.

### Requirements

1. **Continuous Integration**
   - Create `.github/workflows/ci.yml`
   - Run on pull requests and main branch
   - Steps:
     - Install dependencies (with caching)
     - Lint code (ESLint + Prettier)
     - Type check (TypeScript)
     - Run tests with coverage
     - Build client and server

2. **Code Quality Gates**
   - Fail CI if coverage drops below 70%
   - Fail CI if TypeScript errors exist
   - Fail CI if linting errors exist

3. **Continuous Deployment**
   - Deploy to a staging environment on merge to `main`
   - Options: Vercel, Netlify, Railway, or Docker + Cloud Run

4. **Docker Setup**
   - Create `Dockerfile` for client (multi-stage build)
   - Create `Dockerfile` for server
   - Create `docker-compose.yml` for local development

### Example GitHub Actions Workflow
```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci
      
      - name: Lint
        run: |
          cd client && npm run lint
          cd ../server && npm run lint
      
      - name: Type check
        run: |
          cd client && npm run type-check
          cd ../server && npm run type-check
      
      - name: Test
        run: cd client && npm run test:coverage
      
      - name: Build
        run: |
          cd client && npm run build
          cd ../server && npm run build
```

### Evaluation Criteria
- ✅ Pipeline runs successfully
- ✅ Proper caching for faster builds
- ✅ Clear failure messages
- ✅ Deployment automation works

---

## Challenge 4: API Improvements & Backend Optimization

### Objective
Enhance the API with pagination, caching, and better query capabilities.

### Requirements

1. **Pagination**
   - Add cursor-based pagination to `/pipes` endpoint
   - Return metadata: `{ data: [], cursor: string, hasMore: boolean }`
   - Client should implement infinite scroll

2. **Advanced Filtering**
   - Support multiple tags: `/pipes?tags=water,gas`
   - Support bounding box queries: `/pipes?bbox=32.0,34.7,32.1,34.8`
   - Support sorting: `/pipes?sort=name&order=asc`

3. **Response Caching**
   - Add Redis or in-memory caching for common queries
   - Set appropriate `Cache-Control` headers
   - Implement cache invalidation on POST

4. **Database Indexing**
   - Add indexes on frequently queried fields (tags, coordinates)
   - Analyze query performance with `EXPLAIN QUERY PLAN`
   - Document performance improvements

5. **API Documentation**
   - Add OpenAPI/Swagger documentation
   - Document all endpoints, parameters, and responses
   - Add example requests and responses

### Example Enhanced Endpoint
```typescript
// GET /pipes?tags=water,gas&limit=50&cursor=abc123&bbox=32.0,34.7,32.1,34.8

interface PaginatedResponse {
  data: Pipe[];
  pagination: {
    cursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

app.get("/pipes", (req, res) => {
  const { tags, limit = 50, cursor, bbox } = req.query;
  
  // Parse tags
  const tagList = tags ? (tags as string).split(',') : [];
  
  // Parse bounding box
  const bounds = bbox ? (bbox as string).split(',').map(Number) : null;
  
  // Build query with filters
  let query = buildPipeQuery({ tagList, bounds, cursor, limit });
  
  // Execute and return paginated response
  const result = executePaginatedQuery(query);
  res.json(result);
});
```

### Evaluation Criteria
- ✅ Backward compatible with existing API
- ✅ Efficient queries (use EXPLAIN to verify)
- ✅ Proper error handling and validation
- ✅ Clear API documentation

---

## Challenge 5: Monitoring & Observability

### Objective
Add production-ready monitoring and error tracking.

### Requirements

1. **Error Tracking**
   - Integrate Sentry or similar service
   - Capture frontend errors with source maps
   - Capture backend errors with stack traces
   - Add custom error boundaries with reporting

2. **Performance Monitoring**
   - Add Web Vitals tracking (LCP, FID, CLS)
   - Monitor API response times
   - Track slow queries in the database
   - Set up alerts for performance degradation

3. **Logging**
   - Structured logging with Winston or Pino
   - Log levels: error, warn, info, debug
   - Include request IDs for tracing
   - Log rotation and retention policy

4. **Health Checks**
   - Add `/health` endpoint
   - Check database connectivity
   - Check memory usage
   - Return proper HTTP status codes

5. **Metrics Dashboard**
   - Set up Grafana or similar dashboard
   - Track: request rate, error rate, response time, active users
   - Set up alerts for anomalies

### Example Health Check
```typescript
app.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      memory: checkMemory(),
    }
  };
  
  const isHealthy = Object.values(health.checks).every(c => c.status === "ok");
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### Evaluation Criteria
- ✅ Errors are captured with useful context
- ✅ Performance metrics are actionable
- ✅ Logs are structured and searchable
- ✅ Health checks are comprehensive

---

## Challenge 6: Security Hardening

### Objective
Implement security best practices for production deployment.

### Requirements

1. **Input Validation**
   - Add Zod or Joi schema validation
   - Validate all API inputs
   - Sanitize user inputs to prevent injection
   - Add rate limiting

2. **Authentication & Authorization**
   - Add JWT-based authentication
   - Protect write endpoints (POST /pipes)
   - Implement role-based access control (admin, viewer)
   - Add API key support for programmatic access

3. **Security Headers**
   - Add Helmet.js middleware
   - Configure CSP (Content Security Policy)
   - Set CORS properly (no `*` in production)
   - Add HTTPS redirect

4. **Database Security**
   - Use parameterized queries (already done)
   - Add database connection encryption
   - Implement backup strategy
   - Add audit logging for mutations

5. **Dependency Security**
   - Add `npm audit` to CI pipeline
   - Configure Dependabot for automated updates
   - Document security update process

### Example Validation
```typescript
import { z } from 'zod';

const CreatePipeSchema = z.object({
  name: z.string().min(1).max(100),
  startPoint: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  endPoint: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  tags: z.array(z.string()).max(10),
});

app.post("/pipes", (req, res) => {
  const result = CreatePipeSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  // Proceed with validated data
});
```

### Evaluation Criteria
- ✅ No security vulnerabilities in dependencies
- ✅ Proper input validation on all endpoints
- ✅ Authentication works correctly
- ✅ Security headers are properly configured

---

## Challenge 7: Accessibility (a11y) Improvements

### Objective
Make the application fully accessible according to WCAG 2.1 AA standards.

### Requirements

1. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Visible focus indicators
   - Logical tab order
   - Keyboard shortcuts documented

2. **Screen Reader Support**
   - Proper ARIA labels and roles
   - Live regions for dynamic content
   - Alt text for visual elements
   - Semantic HTML

3. **Visual Accessibility**
   - Color contrast meets WCAG AA (4.5:1 for text)
   - Don't rely solely on color to convey information
   - Resizable text up to 200%
   - No content loss at 400% zoom

4. **Accessibility Testing**
   - Add axe-core to test suite
   - Run Lighthouse accessibility audit (score >90)
   - Test with actual screen readers (NVDA, VoiceOver)

5. **Documentation**
   - Create accessibility statement
   - Document keyboard shortcuts
   - Provide alternative text descriptions for map

### Example Improvements
```typescript
// Add ARIA labels to filter buttons
<button
  onClick={() => handleTagClick(tag)}
  aria-pressed={activeTag === tag}
  aria-label={`Filter by ${tag} pipes`}
>
  {tag}
</button>

// Add live region for search results
<div role="status" aria-live="polite" aria-atomic="true">
  {filteredPipes.length > 0 
    ? `Found ${filteredPipes.length} pipes matching "${searchTerm}"`
    : "No pipes found"
  }
</div>

// Add skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Evaluation Criteria
- ✅ Passes automated accessibility tests
- ✅ Fully keyboard navigable
- ✅ Works with screen readers
- ✅ Meets WCAG 2.1 AA standards

---

## Choosing the Right Challenge

**For Backend-focused candidates:**
- Challenge 4: API Improvements
- Challenge 5: Monitoring & Observability
- Challenge 6: Security Hardening

**For Frontend-focused candidates:**
- Challenge 2: Performance Optimization
- Challenge 7: Accessibility
- Challenge 1: Testing Infrastructure

**For DevOps/Full-stack candidates:**
- Challenge 3: CI/CD Pipeline
- Challenge 5: Monitoring & Observability
- Challenge 6: Security Hardening

**For Architects/Tech Leads:**
- Any combination, focusing on design decisions and trade-offs

---

## Discussion Points

After completing a challenge, discuss:

1. **Trade-offs**: What compromises did you make? Why?
2. **Scalability**: How would this solution scale to 10M pipes?
3. **Maintenance**: How would you maintain this over time?
4. **Team Impact**: How would you roll this out to a team?
5. **Alternatives**: What other approaches did you consider?

---

## Evaluation Rubric

| Level | Criteria |
|-------|----------|
| **Exceptional** | Complete implementation, considers edge cases, production-ready, great documentation |
| **Strong** | Working solution, good practices, minor gaps in edge cases or docs |
| **Adequate** | Basic implementation works, some best practices missing |
| **Needs Improvement** | Incomplete or with significant issues |

---

## Notes for Interviewers

- **Time Management**: These are 15-30 minute challenges; don't expect perfection
- **Depth over Breadth**: Better to do one challenge well than multiple poorly
- **Real-world Thinking**: Look for production-readiness mindset
- **Communication**: Candidate should explain their approach before coding
- **Flexibility**: If candidate suggests a different approach, explore it

Good luck! 🚀
