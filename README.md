# Counselor Student Action Center

A full-stack tool that helps school counselors triage their caseload — surfacing which students need attention, why, and what to do first.

**Frontend** is deployed on Vercel → [counselor-action-center.vercel.app](https://counselor-action-center.vercel.app/student/stu_002)
**Backend** is deployed on an AWS EC2 instance served via Nginx reverse proxy.

---

## Setup & Run

**Prerequisites:** Node.js 18+

```bash
# Clone
git clone https://github.com/your-username/counselor-action-center
cd counselor-action-center

# Backend
cd backend
npm install
npm run dev        # runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

---

## API Contract

### GET `/students/:id/action-center`
Returns full student profile with tasks, messages, urgency score, momentum, attention debt, follow-through rate, insight, and next best action.

```json
{
  "student": { "id": "stu_001", "name": "Maya Patel", "grade": 11, "gpa": 3.2, "enrollmentStatus": "at_risk" },
  "urgency": { "score": 95, "level": "CRITICAL" },
  "momentum": { "level": "STALLED", "averageDriftDays": 14, "frozenTaskCount": 2 },
  "attentionDebt": { "daysSinceLastAction": 3, "level": "CURRENT", "message": null },
  "followThrough": { "rate": 20, "label": "Low", "interpretation": "Maya completes 20% of tasks — may signal disengagement" },
  "insight": { "summary": "...", "signals": ["..."] },
  "nextBestAction": { "action": "Schedule counselor meeting within 48 hours", "reason": "..." },
  "tasks": [...],
  "messages": [...]
}
```

### PATCH `/tasks/:taskId/status`
Updates a task's status and returns the recalculated urgency score.

```json
// Request
{ "status": "completed" }

// Response
{ "success": true, "taskId": "tsk_001", "updatedStatus": "completed", "newUrgencyScore": 55, "newUrgencyLevel": "MEDIUM" }
```

### GET `/counselor/:counselorId/triage`
Returns all students ranked by urgency score, with momentum, attention debt, and follow-through per student.

```json
{
  "counselorId": "csl_001",
  "totalStudents": 3,
  "criticalCount": 2,
  "attentionDebtCount": 1,
  "students": [
    {
      "id": "stu_003", "name": "Carlos Rivera", "urgencyScore": 110, "urgencyLevel": "CRITICAL",
      "momentum": { "level": "STALLED" },
      "attentionDebt": { "daysSinceLastAction": 2, "level": "CURRENT" },
      "followThroughRate": 25,
      "topSignals": ["Credit recovery overdue", "Unread parent message"],
      "nextBestAction": "Immediate intervention required"
    }
  ]
}
```

**Error responses** always include `requestId` and `error` fields. Status codes: `404` student/task not found, `400` invalid input.

---

## Architecture

```
Route → Controller → Service → Data
```

Three clear layers. Each has one job:

- **Route** — defines URL and HTTP method only
- **Controller** — parses request, calls service, returns response
- **Service** — all business logic lives here, no HTTP knowledge
- **Data** — raw in-memory arrays, no logic

The backend has six services:

| Service | Responsibility |
|---|---|
| `urgency.service` | Weighted scoring across tasks, messages, enrollment status |
| `insight.service` | Cross-signal pattern detection → human-readable summary |
| `nextBestAction.service` | Priority-ordered rule chain → one recommended action |
| `taskDrift.service` | Measures how long each task has been frozen in its current status |
| `attentionDebt.service` | Infers last counselor touch date, flags neglected students |
| `followThrough.service` | Calculates task completion rate per student |

`actionCenter.service` and `triage.service` orchestrate all six — controllers never touch business logic directly.

The frontend uses **TanStack Query** for all server state. No Redux. Two pages: `TriagePage` (who needs me first) and `ActionCenterPage` (deep dive per student).

---

## Performance Decisions & Tradeoffs

**Urgency recomputed on every request, not cached**
With mutable in-memory data, a cached score goes stale the moment a task is patched. Recomputation is O(n) on tasks + messages per student — negligible at this scale. At production scale, the right move is event-driven: recalculate and cache only when a student's data changes.

**PATCH returns the new urgency score**
Avoids a second GET from the frontend after a task update. The urgency badge updates on a single round-trip. Tradeoff: the task controller now depends on the urgency service — acceptable here, would be an event in a larger system.

**No database**
All data lives in module-level mutable arrays. Simple, fast, resets on server restart. The service layer is the only thing that touches data — swapping in a real database requires zero changes to controllers or business logic.

**React Query over Redux**
The app has two pages and three data fetches. React Query handles loading states, caching, and mutation invalidation with no boilerplate. Redux would add complexity with zero benefit at this scale.

**No date libraries**
All drift and debt calculations use plain `Date` objects. No dependency overhead for what amounts to subtraction.

---

## Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

> SCREENSHOT OUTPUTS >>>>> STORED INSIDE docs folder

![Test Output](./docs/backend-test.png)
![Test Output](./docs/frontend-test.png)

---

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── data/
│   │   ├── middleware/
│   │   └── types/
│   └── tests/
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── api/
    │   └── types/
    └── tests/
```