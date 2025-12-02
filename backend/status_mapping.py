from typing import Dict

STATUS_TO_INT: Dict[str, int] = {
    "pending": 0,
    "in-progress": 1,
    "paused": 2,
    "completed": 3,
}

INT_TO_STATUS: Dict[int, str] = {v: k for k, v in STATUS_TO_INT.items()}


def status_str_to_int(status: str) -> int:
    try:
        return STATUS_TO_INT[status]
    except KeyError:
        raise ValueError(f"Unsupported status '{status}'")


def status_int_to_str(value: int) -> str:
    try:
        return INT_TO_STATUS[value]
    except KeyError:
        raise ValueError(f"Unsupported status code '{value}'")
