import json
from typing import Any


def dumps(value: Any) -> str:
    return json.dumps(value or [])


def loads(value: str):
    if not value:
        return []
    return json.loads(value)
