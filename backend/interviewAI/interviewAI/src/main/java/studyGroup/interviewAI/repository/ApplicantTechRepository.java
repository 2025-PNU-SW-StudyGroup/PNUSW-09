package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.ApplicantTech;

import java.util.List;

public interface ApplicantTechRepository extends JpaRepository<ApplicantTech, Long> {
    // 특정 지원자의 기술스택 조회
    List<ApplicantTech> findByApplicantId(Long applicantId);
    
    // 특정 기술스택을 가진 지원자들 조회
    List<ApplicantTech> findByTechStackId(Long techStackId);
} 