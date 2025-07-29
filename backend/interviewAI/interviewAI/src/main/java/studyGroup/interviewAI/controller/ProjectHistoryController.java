package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.service.ProjectHistoryService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/project-histories")
public class ProjectHistoryController {
    private final ProjectHistoryService projectHistoryService;

    public ProjectHistoryController(ProjectHistoryService projectHistoryService) {
        this.projectHistoryService = projectHistoryService;
    }

    @GetMapping
    public List<ProjectHistory> getAllProjectHistories() {
        return projectHistoryService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ProjectHistory> getProjectHistory(@PathVariable Long id) {
        return projectHistoryService.findById(id);
    }

    // 여러 기술스택을 포함한 프로젝트 생성 (메인 엔드포인트)
    @PostMapping
    public ProjectHistory createProjectWithTechStacks(@RequestBody Map<String, Object> requestData) {
        return projectHistoryService.saveWithMultipleTechStacks(requestData);
    }

    @PutMapping("/{id}")
    public ProjectHistory updateProjectHistory(@PathVariable Long id, @RequestBody ProjectHistory projectHistory) {
        projectHistory.setId(id);
        return projectHistoryService.save(projectHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteProjectHistory(@PathVariable Long id) {
        projectHistoryService.deleteById(id);
    }

    // 특정 지원자의 프로젝트 조회
    @GetMapping("/applicant/{applicantId}")
    public List<ProjectHistory> getProjectHistoriesByApplicant(@PathVariable Long applicantId) {
        return projectHistoryService.findByApplicantId(applicantId);
    }
} 