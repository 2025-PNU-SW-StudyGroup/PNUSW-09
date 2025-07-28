package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.PostReport;
import studyGroup.interviewAI.service.PostReportService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/post-reports")
public class PostReportController {
    private final PostReportService postReportService;

    public PostReportController(PostReportService postReportService) {
        this.postReportService = postReportService;
    }

    @GetMapping
    public List<PostReport> getPostReports() {
        return postReportService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<PostReport> getPostReport(@PathVariable Long id) {
        return postReportService.findById(id);
    }

    @PostMapping
    public PostReport createPostReport(@RequestBody PostReport postReport) {
        return postReportService.save(postReport);
    }

    @DeleteMapping("/{id}")
    public void deletePostReport(@PathVariable Long id) {
        postReportService.deleteById(id);
    }
} 