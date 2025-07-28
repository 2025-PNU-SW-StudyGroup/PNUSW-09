package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
} 