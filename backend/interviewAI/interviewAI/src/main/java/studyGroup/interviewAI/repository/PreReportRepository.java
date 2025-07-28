package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.PreReport;

import java.util.List;

public interface PreReportRepository extends JpaRepository<PreReport, Long> {
    // 특정 지원자의 사전평가 조회
    List<PreReport> findByApplicantId(Long applicantId);
} 