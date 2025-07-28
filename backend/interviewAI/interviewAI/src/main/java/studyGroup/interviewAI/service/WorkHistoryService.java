package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.repository.WorkHistoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class WorkHistoryService {
    private final WorkHistoryRepository workHistoryRepository;

    public WorkHistoryService(WorkHistoryRepository workHistoryRepository) {
        this.workHistoryRepository = workHistoryRepository;
    }

    public List<WorkHistory> findAll() {
        return workHistoryRepository.findAll();
    }

    public Optional<WorkHistory> findById(Long id) {
        return workHistoryRepository.findById(id);
    }

    public WorkHistory save(WorkHistory workHistory) {
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