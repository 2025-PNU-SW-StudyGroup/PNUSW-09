package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyGroup.interviewAI.entity.PreReport;

import java.util.List;
import java.util.Optional;

public interface PreReportRepository extends JpaRepository<PreReport, Long> {
    
    // 특정 지원자의 Pre-Report 조회
    List<PreReport> findByApplicantId(Long applicantId);
    
    // 관계 엔티티와 함께 조회
    @Query("SELECT p FROM PreReport p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience")
    List<PreReport> findAllWithRelations();
    
    // ID로 관계 엔티티와 함께 조회
    @Query("SELECT p FROM PreReport p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "WHERE p.id = :id")
    Optional<PreReport> findByIdWithRelations(Long id);
    
    // 특정 지원자의 Pre-Report를 관계 엔티티와 함께 조회
    @Query("SELECT p FROM PreReport p " +
           "JOIN FETCH p.applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "WHERE a.id = :applicantId")
    List<PreReport> findByApplicantIdWithRelations(Long applicantId);
} 