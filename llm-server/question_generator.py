import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from prompts import InterviewPrompts, PromptTemplates

# .env 파일에서 환경 변수 로드
load_dotenv()


class InterviewQuestion(BaseModel):
    """인터뷰 질문 모델"""

    question: str = Field(description="생성된 인터뷰 질문")
    category: str = Field(description="질문 카테고리 (기술, 경험, 상황대응 등)")
    difficulty: str = Field(description="질문 난이도 (쉬움, 보통, 어려움)")
    reasoning: str = Field(description="이 질문을 추천하는 이유")


class QuestionGenerationResult(BaseModel):
    """질문 생성 결과 모델"""

    questions: List[InterviewQuestion] = Field(description="생성된 질문들")
    analysis: str = Field(description="대화 분석 내용")


class QuestionGenerator:
    def __init__(
        self, model_name: str = "gpt-3.5-turbo", interview_type: str = "general"
    ):
        """
        질문 생성기 초기화

        Args:
            model_name: 사용할 LLM 모델명
            interview_type: 인터뷰 타입 ("general", "technical", "behavioral")
        """
        self.llm = ChatOpenAI(
            model=model_name,
        )
        self.interview_type = interview_type

        self.parser = JsonOutputParser(pydantic_object=QuestionGenerationResult)

        # 인터뷰 타입에 따른 시스템 프롬프트 선택
        system_prompt = PromptTemplates.get_prompt_by_type(
            interview_type, self.parser.get_format_instructions()
        )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", InterviewPrompts.get_human_prompt()),
            ]
        )

        # 체인 구성
        self.chain = self.prompt | self.llm | self.parser

    def generate_questions(
        self, conversation_messages: List[Dict[str, str]]
    ) -> QuestionGenerationResult:
        """
        대화 로그를 바탕으로 인터뷰 질문 생성

        Args:
            conversation_messages: 대화 메시지 리스트
                                 [{"speaker": "interviewer/candidate", "content": "내용"}, ...]

        Returns:
            QuestionGenerationResult: 생성된 질문들과 분석 내용
        """
        # 대화를 읽기 쉬운 형태로 변환
        conversation_text = self._format_conversation(conversation_messages)

        try:
            # LLM을 통한 질문 생성
            result = self.chain.invoke({"conversation": conversation_text})
            return QuestionGenerationResult(**result)

        except Exception as e:
            # 에러 발생 시 기본 질문 반환
            print(f"질문 생성 중 오류 발생: {e}")
            fallback_data = InterviewPrompts.get_fallback_questions()
            return QuestionGenerationResult(**fallback_data)

    def _format_conversation(self, messages: List[Dict[str, str]]) -> str:
        """대화 메시지를 텍스트로 포맷팅"""
        formatted_lines = []

        for msg in messages:
            speaker_label = "면접관" if msg["speaker"] == "interviewer" else "지원자"
            formatted_lines.append(f"{speaker_label}: {msg['content']}")

        return "\n".join(formatted_lines)
