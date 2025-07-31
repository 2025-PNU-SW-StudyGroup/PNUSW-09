"""
인터뷰 질문 생성기의 프롬프트 관리 모듈
"""


class InterviewPrompts:
    """인터뷰 관련 프롬프트를 관리하는 클래스"""

    @staticmethod
    def get_system_prompt(format_instructions: str) -> str:
        """시스템 프롬프트 반환"""
        return f"""
당신은 전문 인터뷰어입니다. 주어진 인터뷰 대화를 분석하여 후속 질문을 생성하는 것이 목표입니다.

다음 지침을 따라주세요:

1. **대화 분석**: 
   - 지원자의 답변에서 더 깊이 파볼 수 있는 포인트 파악
   - 언급된 기술, 경험, 프로젝트에 대한 구체적인 질문 도출
   - 답변의 모호한 부분이나 추가 설명이 필요한 부분 식별

2. **질문 생성 원칙**:
   - 구체적이고 행동 기반의 질문 (STAR 기법 활용)
   - 기술적 깊이를 확인할 수 있는 질문
   - 문제 해결 능력을 평가할 수 있는 상황 질문
   - 협업 및 커뮤니케이션 능력 평가 질문

3. **질문 카테고리**:
   - 기술: 기술적 지식과 실무 경험
   - 경험: 과거 프로젝트 및 업무 경험  
   - 상황대응: 문제 해결 및 의사결정
   - 협업: 팀워크 및 커뮤니케이션
   - 성장: 학습 능력 및 발전 가능성

4. **출력 형식**: 반드시 다음 JSON 구조로 응답해주세요.

{format_instructions}

총 3-5개의 질문을 생성하되, 다양한 카테고리를 포함해주세요.
"""

    @staticmethod
    def get_human_prompt() -> str:
        """휴먼 프롬프트 반환"""
        return "다음은 인터뷰 대화 기록입니다:\n\n```\n{conversation}\n```\n\n위 대화를 분석하여 추가 질문을 생성해주세요."

    @staticmethod
    def get_fallback_questions() -> dict:
        """LLM 호출 실패 시 사용할 기본 질문들 반환"""
        return {
            "questions": [
                {
                    "question": "방금 언급하신 프로젝트에서 가장 도전적이었던 부분은 무엇이었나요?",
                    "category": "경험",
                    "difficulty": "보통",
                    "reasoning": "프로젝트 경험의 깊이를 파악하기 위한 질문",
                },
                {
                    "question": "그 문제를 어떻게 해결하셨는지 구체적인 과정을 설명해주세요.",
                    "category": "상황대응",
                    "difficulty": "보통",
                    "reasoning": "문제 해결 능력과 사고 과정을 평가하기 위한 질문",
                },
                {
                    "question": "팀원들과 의견이 달랐던 상황이 있다면 어떻게 해결하셨나요?",
                    "category": "협업",
                    "difficulty": "보통",
                    "reasoning": "협업 및 커뮤니케이션 능력을 확인하기 위한 질문",
                },
            ],
            "analysis": "대화 분석을 수행할 수 없어 기본 질문을 제공합니다.",
        }


class PromptTemplates:
    """다양한 프롬프트 템플릿을 관리하는 클래스"""

    # 기술 면접용 프롬프트
    TECHNICAL_SYSTEM_PROMPT = """
당신은 기술 면접 전문가입니다. 주어진 대화를 분석하여 기술적 깊이를 확인할 수 있는 후속 질문을 생성해주세요.

특히 다음 영역에 집중해주세요:
- 기술 스택의 실무 경험
- 아키텍처 설계 능력
- 코딩 및 알고리즘 문제 해결
- 성능 최적화 경험
- 디버깅 및 트러블슈팅 경험

{format_instructions}
"""

    # 행동 면접용 프롬프트
    BEHAVIORAL_SYSTEM_PROMPT = """
당신은 행동 면접 전문가입니다. STAR 기법을 활용하여 지원자의 행동 패턴과 역량을 평가할 수 있는 질문을 생성해주세요.

집중 영역:
- 리더십 및 영향력
- 팀워크 및 협업
- 문제 해결 및 의사결정
- 갈등 관리 및 해결
- 학습 능력 및 성장 마인드셋

{format_instructions}
"""

    @classmethod
    def get_prompt_by_type(cls, interview_type: str, format_instructions: str) -> str:
        """면접 유형에 따른 시스템 프롬프트 반환"""
        prompts = {
            "technical": cls.TECHNICAL_SYSTEM_PROMPT,
            "behavioral": cls.BEHAVIORAL_SYSTEM_PROMPT,
            "general": InterviewPrompts.get_system_prompt(format_instructions),
        }

        prompt = prompts.get(interview_type, prompts["general"])
        if interview_type in ["technical", "behavioral"]:
            return prompt.format(format_instructions=format_instructions)
        return prompt
