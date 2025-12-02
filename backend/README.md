# Backend (Python / FastAPI)

SQLite + FastAPI backend that persists tasks in a `tasks` table and exposes simple CRUD endpoints to mirror the NgRx task state used by the Angular app.

## Setup

```bash
cd backend
uv venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
uv pip install -r requirements.txt
# run from the repo root so the package imports resolve (venv lives in backend/)
cd ..
uvicorn backend.main:app --reload --reload-dir backend
# If you prefer to stay in backend/, set PYTHONPATH to the repo root:
# PYTHONPATH=.. uvicorn backend.main:app --reload --reload-dir backend
```

The SQLite database is stored at `backend/tasks.db` and will be created automatically.

## Endpoints

- `GET /tasks/list` — returns all tasks in the NgRx-compatible shape.
- `POST /task` — creates a task (expects the NgRx task payload).
- `PUT /task` — updates an existing task (expects the NgRx task payload).

Status values are mapped to integers in the database:

| status string | db value |
| --- | --- |
| pending | 0 |
| in-progress | 1 |
| paused | 2 |
| completed | 3 |

### Example payload (POST/PUT)

```json
{
  "id": "task-123",
  "name": "Write docs",
  "status": "in-progress",
  "timer": {
    "phase": "focus",
    "cycle": 1,
    "elapsedSeconds": 120,
    "durationSeconds": 1500
  }
}
```
