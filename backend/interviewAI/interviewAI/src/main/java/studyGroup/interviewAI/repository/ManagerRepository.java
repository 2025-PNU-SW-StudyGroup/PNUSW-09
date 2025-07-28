package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Manager;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
} 