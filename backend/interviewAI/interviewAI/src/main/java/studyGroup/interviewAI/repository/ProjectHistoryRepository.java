package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyGroup.interviewAI.entity.ProjectHistory;

import java.util.List;
import java.util.Optional;

public interface ProjectHistoryRepository extends JpaRepository<ProjectHistory, Long> {
    
    // 특정 지원자의 프로젝트 조회
    List<ProjectHistory> findByApplicantId(Long applicantId);
    
    // 관계 엔티티와 함께 조회
    @Query("SELECT p FROM ProjectHistory p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH p.techStack")
    List<ProjectHistory> findAllWithRelations();
    
    // ID로 관계 엔티티와 함께 조회
    @Query("SELECT p FROM ProjectHistory p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH p.techStack " +
           "WHERE p.id = :id")
    Optional<ProjectHistory> findByIdWithRelations(Long id);
    
    // 특정 지원자의 프로젝트를 관계 엔티티와 함께 조회
    @Query("SELECT p FROM ProjectHistory p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "JOIN FETCH p.techStack " +
           "WHERE a.id = :applicantId")
    List<ProjectHistory> findByApplicantIdWithRelations(Long applicantId);
} 