from typing import List
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import TaskRecord
from .schemas import Task
from .status_mapping import status_int_to_str, status_str_to_int

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pomodoro Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def record_to_task(record: TaskRecord) -> Task:
    try:
        status = status_int_to_str(record.status)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return Task(
        id=record.id,
        name=record.name,
        status=status,
        timer={
            "phase": record.phase,
            "cycle": record.cycle,
            "elapsedSeconds": record.elapsed_seconds,
            "durationSeconds": record.duration_seconds,
        },
    )


def create_or_update_record(db: Session, task: Task, record: TaskRecord | None = None) -> TaskRecord:
    try:
        status_value = status_str_to_int(task.status)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    if record is None:
        record = TaskRecord(
            id=task.id.strip() or f"task-{uuid4().hex}",
            name=task.name.strip(),
            status=status_value,
            phase=task.timer.phase,
            cycle=task.timer.cycle,
            elapsed_seconds=task.timer.elapsedSeconds,
            duration_seconds=task.timer.durationSeconds,
        )
        db.add(record)
    else:
        record.name = task.name.strip()
        record.status = status_value
        record.phase = task.timer.phase
        record.cycle = task.timer.cycle
        record.elapsed_seconds = task.timer.elapsedSeconds
        record.duration_seconds = task.timer.durationSeconds

    db.commit()
    db.refresh(record)
    return record


@app.get("/tasks/list", response_model=List[Task])
def list_tasks(db: Session = Depends(get_db)):
    records = db.query(TaskRecord).all()
    return [record_to_task(record) for record in records]


@app.post("/task", response_model=Task, status_code=201)
def create_task(task: Task, db: Session = Depends(get_db)):
    if db.query(TaskRecord).filter(TaskRecord.id == task.id).first():
        raise HTTPException(status_code=409, detail="Task already exists")

    record = create_or_update_record(db, task)
    return record_to_task(record)


@app.put("/task", response_model=Task)
def update_task(task: Task, db: Session = Depends(get_db)):
    record = db.query(TaskRecord).filter(TaskRecord.id == task.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Task not found")

    record = create_or_update_record(db, task, record)
    return record_to_task(record)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
