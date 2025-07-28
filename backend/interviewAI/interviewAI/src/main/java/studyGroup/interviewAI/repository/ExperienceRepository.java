package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
} 