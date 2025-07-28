package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Applicant;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
} 