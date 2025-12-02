from typing import Literal

from pydantic import BaseModel, Field

TaskStatus = Literal["pending", "in-progress", "paused", "completed"]
PomodoroPhase = Literal["focus", "short-break", "long-break"]


class Timer(BaseModel):
    phase: PomodoroPhase
    cycle: int = Field(ge=0)
    elapsedSeconds: int = Field(ge=0)
    durationSeconds: int = Field(gt=0)


class Task(BaseModel):
    id: str
    name: str
    status: TaskStatus
    timer: Timer
