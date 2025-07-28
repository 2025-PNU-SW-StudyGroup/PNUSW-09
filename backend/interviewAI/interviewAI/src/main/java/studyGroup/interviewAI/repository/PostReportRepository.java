package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyGroup.interviewAI.entity.PostReport;

import java.util.Optional;

public interface PostReportRepository extends JpaRepository<PostReport, Long> {
    // 특정 면접의 평가 조회
    Optional<PostReport> findByInterviewId(Long interviewId);
    
    // 평균 점수 계산
    @Query("SELECT AVG(p.score) FROM PostReport p WHERE p.score IS NOT NULL")
    Double findAverageScore();
} 