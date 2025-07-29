package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.Position;
import studyGroup.interviewAI.repository.WorkHistoryRepository;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.PositionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class WorkHistoryService {
    private final WorkHistoryRepository workHistoryRepository;
    private final ApplicantRepository applicantRepository;
    private final PositionRepository positionRepository;

    public WorkHistoryService(WorkHistoryRepository workHistoryRepository,
                            ApplicantRepository applicantRepository,
                            PositionRepository positionRepository) {
        this.workHistoryRepository = workHistoryRepository;
        this.applicantRepository = applicantRepository;
        this.positionRepository = positionRepository;
    }

    public List<WorkHistory> findAll() {
        return workHistoryRepository.findAll();
    }

    public Optional<WorkHistory> findById(Long id) {
        return workHistoryRepository.findById(id);
    }

    public WorkHistory save(WorkHistory workHistory) {
        // Applicant 관계 설정
        if (workHistory.getApplicant() != null && workHistory.getApplicant().getId() != null) {
            Applicant applicant = applicantRepository.findByIdWithPositionAndExperience(workHistory.getApplicant().getId())
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + workHistory.getApplicant().getId()));
            workHistory.setApplicant(applicant);
        }
        
        // Position 관계 설정
        if (workHistory.getPosition() != null && workHistory.getPosition().getId() != null) {
            Position position = positionRepository.findById(workHistory.getPosition().getId())
                .orElseThrow(() -> new RuntimeException("Position not found: " + workHistory.getPosition().getId()));
            workHistory.setPosition(position);
        }
        
        return workHistoryRepository.save(workHistory);
    }

    public void deleteById(Long id) {
        workHistoryRepository.deleteById(id);
    }

    // 특정 지원자의 경력 조회
    public List<WorkHistory> findByApplicantId(Long applicantId) {
        return workHistoryRepository.findByApplicantId(applicantId);
    }
} 