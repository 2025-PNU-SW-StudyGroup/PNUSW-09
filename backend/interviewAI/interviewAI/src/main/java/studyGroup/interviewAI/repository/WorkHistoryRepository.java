package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.WorkHistory;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
} 