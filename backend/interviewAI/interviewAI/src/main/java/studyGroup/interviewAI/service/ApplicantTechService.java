package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.ApplicantTech;
import studyGroup.interviewAI.repository.ApplicantTechRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicantTechService {
    private final ApplicantTechRepository applicantTechRepository;

    public ApplicantTechService(ApplicantTechRepository applicantTechRepository) {
        this.applicantTechRepository = applicantTechRepository;
    }

    public List<ApplicantTech> findAll() {
        return applicantTechRepository.findAll();
    }

    public Optional<ApplicantTech> findById(Long id) {
        return applicantTechRepository.findById(id);
    }

    public ApplicantTech save(ApplicantTech applicantTech) {
        return applicantTechRepository.save(applicantTech);
    }

    // 배치 저장: 여러 기술스택 한 번에 저장
    public List<ApplicantTech> saveAll(List<ApplicantTech> applicantTechs) {
        return applicantTechRepository.saveAll(applicantTechs);
    }

    public void deleteById(Long id) {
        applicantTechRepository.deleteById(id);
    }

    // 특정 지원자의 기술스택 조회
    public List<ApplicantTech> findByApplicantId(Long applicantId) {
        return applicantTechRepository.findByApplicantId(applicantId);
    }
} 