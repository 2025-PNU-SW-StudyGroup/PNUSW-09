package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.TechStack;

public interface TechStackRepository extends JpaRepository<TechStack, Long> {
} 