package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.ProjectHistory;

public interface ProjectHistoryRepository extends JpaRepository<ProjectHistory, Long> {
} 