package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.PreReport;
import studyGroup.interviewAI.service.PreReportService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pre-reports")
public class PreReportController {
    private final PreReportService preReportService;

    public PreReportController(PreReportService preReportService) {
        this.preReportService = preReportService;
    }

    @GetMapping
    public List<PreReport> getPreReports() {
        return preReportService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<PreReport> getPreReport(@PathVariable Long id) {
        return preReportService.findById(id);
    }

    @PostMapping
    public PreReport createPreReport(@RequestBody PreReport preReport) {
        return preReportService.save(preReport);
    }

    @DeleteMapping("/{id}")
    public void deletePreReport(@PathVariable Long id) {
        preReportService.deleteById(id);
    }
} 