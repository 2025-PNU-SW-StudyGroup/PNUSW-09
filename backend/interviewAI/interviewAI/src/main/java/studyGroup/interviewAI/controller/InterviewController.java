package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.service.InterviewService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<Interview> getInterviews() {
        return interviewService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Interview> getInterview(@PathVariable Long id) {
        return interviewService.findById(id);
    }

    @PostMapping
    public Interview createInterview(@RequestBody Interview interview) {
        return interviewService.save(interview);
    }

    @DeleteMapping("/{id}")
    public void deleteInterview(@PathVariable Long id) {
        interviewService.deleteById(id);
    }
} 