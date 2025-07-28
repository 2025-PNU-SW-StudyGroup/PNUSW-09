package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.service.ProjectHistoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/project-histories")
public class ProjectHistoryController {
    private final ProjectHistoryService projectHistoryService;

    public ProjectHistoryController(ProjectHistoryService projectHistoryService) {
        this.projectHistoryService = projectHistoryService;
    }

    @GetMapping
    public List<ProjectHistory> getProjectHistories() {
        return projectHistoryService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ProjectHistory> getProjectHistory(@PathVariable Long id) {
        return projectHistoryService.findById(id);
    }

    @PostMapping
    public ProjectHistory createProjectHistory(@RequestBody ProjectHistory projectHistory) {
        return projectHistoryService.save(projectHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteProjectHistory(@PathVariable Long id) {
        projectHistoryService.deleteById(id);
    }
} 