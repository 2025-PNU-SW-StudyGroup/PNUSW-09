package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
} 