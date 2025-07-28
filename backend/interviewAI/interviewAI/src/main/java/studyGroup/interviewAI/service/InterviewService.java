package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.repository.InterviewRepository;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepository;

    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    public List<Interview> findAll() {
        return interviewRepository.findAll();
    }

    public Optional<Interview> findById(Long id) {
        return interviewRepository.findById(id);
    }

    public Interview save(Interview interview) {
        return interviewRepository.save(interview);
    }

    public void deleteById(Long id) {
        interviewRepository.deleteById(id);
    }
} 