package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.ProjectHistory;

import java.util.List;

public interface ProjectHistoryRepository extends JpaRepository<ProjectHistory, Long> {
    // 특정 지원자의 프로젝트 조회
    List<ProjectHistory> findByApplicantId(Long applicantId);
} 