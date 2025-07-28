package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.WorkHistory;

import java.util.List;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
    // 특정 지원자의 경력 조회
    List<WorkHistory> findByApplicantId(Long applicantId);
} 