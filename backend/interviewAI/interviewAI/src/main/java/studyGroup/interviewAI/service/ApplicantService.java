package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.repository.ApplicantRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicantService {
    private final ApplicantRepository applicantRepository;

    public ApplicantService(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    public List<Applicant> findAll() {
        return applicantRepository.findAll();
    }

    public Optional<Applicant> findById(Long id) {
        return applicantRepository.findById(id);
    }

    public Applicant save(Applicant applicant) {
        return applicantRepository.save(applicant);
    }

    public void deleteById(Long id) {
        applicantRepository.deleteById(id);
    }
} 