package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Experience;
import studyGroup.interviewAI.service.ExperienceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {
    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping
    public List<Experience> getExperiences() {
        return experienceService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Experience> getExperience(@PathVariable Long id) {
        return experienceService.findById(id);
    }

    @PostMapping
    public Experience createExperience(@RequestBody Experience experience) {
        return experienceService.save(experience);
    }

    @DeleteMapping("/{id}")
    public void deleteExperience(@PathVariable Long id) {
        experienceService.deleteById(id);
    }
} 