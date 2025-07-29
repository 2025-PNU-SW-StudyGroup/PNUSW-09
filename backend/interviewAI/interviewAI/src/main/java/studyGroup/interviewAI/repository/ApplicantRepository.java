package studyGroup.interviewAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyGroup.interviewAI.entity.Applicant;

import java.util.List;
import java.util.Optional;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    
    // 연관 엔티티와 함께 조회
    @Query("SELECT a FROM Applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience")
    List<Applicant> findAllWithPositionAndExperience();
    
    // ID로 연관 엔티티와 함께 조회
    @Query("SELECT a FROM Applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "WHERE a.id = :id")
    Optional<Applicant> findByIdWithPositionAndExperience(Long id);
    
    // 모든 연관 엔티티와 기술스택까지 함께 조회
    @Query("SELECT DISTINCT a FROM Applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "LEFT JOIN FETCH a.applicantTechs at " +
           "LEFT JOIN FETCH at.techStack")
    List<Applicant> findAllWithAllRelations();
    
    // ID로 모든 연관 엔티티와 기술스택까지 함께 조회
    @Query("SELECT DISTINCT a FROM Applicant a " +
           "JOIN FETCH a.position " +
           "JOIN FETCH a.experience " +
           "LEFT JOIN FETCH a.applicantTechs at " +
           "LEFT JOIN FETCH at.techStack " +
           "WHERE a.id = :id")
    Optional<Applicant> findByIdWithAllRelations(Long id);
} 