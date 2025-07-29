package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.PreReport;
import studyGroup.interviewAI.service.PreReportService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pre-reports")
public class PreReportController {
    private final PreReportService preReportService;

    public PreReportController(PreReportService preReportService) {
        this.preReportService = preReportService;
    }

    @GetMapping
    public List<PreReport> getAllPreReports() {
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

    @PutMapping("/{id}")
    public PreReport updatePreReport(@PathVariable Long id, @RequestBody PreReport preReport) {
        preReport.setId(id);
        return preReportService.save(preReport);
    }

    @DeleteMapping("/{id}")
    public void deletePreReport(@PathVariable Long id) {
        preReportService.deleteById(id);
    }

    // 지원자별 Pre-Report 데이터 (유일한 커스텀 엔드포인트)
    @GetMapping("/applicant/{applicantId}")
    public Map<String, Object> getApplicantPreReports(@PathVariable Long applicantId) {
        return preReportService.getApplicantPreReportData(applicantId);
    }
} 