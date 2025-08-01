from typing import List, Literal

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

from question_generator import QuestionGenerator

app = FastAPI()


class Message(BaseModel):
    speaker: Literal["candidate", "interviewer"]  # "candidate" 또는 "interviewer"
    content: str


class ConversationLog(BaseModel):
    messages: List[Message]


@app.post("/conversation")
async def process_conversation(conversation: ConversationLog):
    """
    대화 로그를 받아서 처리하는 endpoint
    추후 LLM을 통해 인터뷰 질문을 생성할 예정
    """
    print(f"받은 대화 개수: {len(conversation.messages)}")
    for i, msg in enumerate(conversation.messages):
        print(f"{i+1}. {msg.speaker}: {msg.content}")

    question_generator = QuestionGenerator()
    questions = question_generator.generate_questions(conversation.messages)
    print(questions)

    return {
        "status": "OK",
        "message_count": len(conversation.messages),
        "questions": questions,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
