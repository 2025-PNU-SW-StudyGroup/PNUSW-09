package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Interview;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    // 완료된 면접 수 조회
    long countByDoneAtIsNotNull();
    
    // 대기 중인 면접 수 조회  
    long countByDoneAtIsNull();
    
    // 특정 지원자의 면접 조회
    List<Interview> findByApplicantId(Long applicantId);
} 