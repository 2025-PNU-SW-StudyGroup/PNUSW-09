package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.repository.TechStackRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TechStackService {
    private final TechStackRepository techStackRepository;

    public TechStackService(TechStackRepository techStackRepository) {
        this.techStackRepository = techStackRepository;
    }

    public List<TechStack> findAll() {
        return techStackRepository.findAll();
    }

    public Optional<TechStack> findById(Long id) {
        return techStackRepository.findById(id);
    }

    public TechStack save(TechStack techStack) {
        return techStackRepository.save(techStack);
    }

    public void deleteById(Long id) {
        techStackRepository.deleteById(id);
    }
} 