package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.service.WorkHistoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/work-histories")
public class WorkHistoryController {
    private final WorkHistoryService workHistoryService;

    public WorkHistoryController(WorkHistoryService workHistoryService) {
        this.workHistoryService = workHistoryService;
    }

    @GetMapping
    public List<WorkHistory> getWorkHistories() {
        return workHistoryService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<WorkHistory> getWorkHistory(@PathVariable Long id) {
        return workHistoryService.findById(id);
    }

    @PostMapping
    public WorkHistory createWorkHistory(@RequestBody WorkHistory workHistory) {
        return workHistoryService.save(workHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkHistory(@PathVariable Long id) {
        workHistoryService.deleteById(id);
    }
} 