package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Experience;
import studyGroup.interviewAI.repository.ExperienceRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ExperienceService {
    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    public List<Experience> findAll() {
        return experienceRepository.findAll();
    }

    public Optional<Experience> findById(Long id) {
        return experienceRepository.findById(id);
    }

    public Experience save(Experience experience) {
        return experienceRepository.save(experience);
    }

    public void deleteById(Long id) {
        experienceRepository.deleteById(id);
    }
} 