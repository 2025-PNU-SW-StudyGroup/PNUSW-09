package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.service.TechStackService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tech-stacks")
public class TechStackController {
    private final TechStackService techStackService;

    public TechStackController(TechStackService techStackService) {
        this.techStackService = techStackService;
    }

    @GetMapping
    public List<TechStack> getAllTechStacks() {
        return techStackService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<TechStack> getTechStack(@PathVariable Long id) {
        return techStackService.findById(id);
    }

    @PostMapping
    public TechStack createTechStack(@RequestBody TechStack techStack) {
        return techStackService.save(techStack);
    }

    @PutMapping("/{id}")
    public TechStack updateTechStack(@PathVariable Long id, @RequestBody TechStack techStack) {
        techStack.setId(id);
        return techStackService.save(techStack);
    }

    @DeleteMapping("/{id}")
    public void deleteTechStack(@PathVariable Long id) {
        techStackService.deleteById(id);
    }
} 