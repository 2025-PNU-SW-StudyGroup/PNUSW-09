package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyGroup.interviewAI.entity.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
} 