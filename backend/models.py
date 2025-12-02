from sqlalchemy import Column, Integer, String

from .database import Base


class TaskRecord(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(Integer, nullable=False)
    phase = Column(String, nullable=False)
    cycle = Column(Integer, nullable=False)
    elapsed_seconds = Column(Integer, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
