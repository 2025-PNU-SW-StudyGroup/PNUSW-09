package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Conversation;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    // 특정 면접의 대화 조회
    List<Conversation> findByInterviewIdOrderById(Long interviewId);
} 