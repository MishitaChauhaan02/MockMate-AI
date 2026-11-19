from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict


class QuestionResponse(BaseModel):
    id: int
    question_text: str
    category: str
    difficulty: str
    expected_concepts: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuestionBrief(BaseModel):
    id: int
    question_text: str
    category: str
    difficulty: str

    model_config = ConfigDict(from_attributes=True)
