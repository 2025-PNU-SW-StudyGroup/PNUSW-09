package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyGroup.interviewAI.entity.WorkHistory;

import java.util.List;
import java.util.Optional;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
    
    // 특정 지원자의 경력 조회
    List<WorkHistory> findByApplicantId(Long applicantId);
    
    // 관계 엔티티와 함께 조회
    @Query("SELECT w FROM WorkHistory w " +
           "JOIN FETCH w.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH w.position")
    List<WorkHistory> findAllWithRelations();
    
    // ID로 관계 엔티티와 함께 조회
    @Query("SELECT w FROM WorkHistory w " +
           "JOIN FETCH w.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH w.position " +
           "WHERE w.id = :id")
    Optional<WorkHistory> findByIdWithRelations(Long id);
    
    // 특정 지원자의 경력을 관계 엔티티와 함께 조회
    @Query("SELECT w FROM WorkHistory w " +
           "JOIN FETCH w.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH w.position " +
           "WHERE a.id = :applicantId")
    List<WorkHistory> findByApplicantIdWithRelations(Long applicantId);
} 