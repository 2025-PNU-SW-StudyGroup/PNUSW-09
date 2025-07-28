package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.ApplicantTech;
import studyGroup.interviewAI.service.ApplicantTechService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applicant-techs")
public class ApplicantTechController {
    private final ApplicantTechService applicantTechService;

    public ApplicantTechController(ApplicantTechService applicantTechService) {
        this.applicantTechService = applicantTechService;
    }

    @GetMapping
    public List<ApplicantTech> getAllApplicantTechs() {
        return applicantTechService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ApplicantTech> getApplicantTech(@PathVariable Long id) {
        return applicantTechService.findById(id);
    }

    @PostMapping
    public ApplicantTech createApplicantTech(@RequestBody ApplicantTech applicantTech) {
        return applicantTechService.save(applicantTech);
    }

    // 배치 등록: 여러 기술스택 한 번에 등록
    @PostMapping("/batch")
    public List<ApplicantTech> createApplicantTechsBatch(@RequestBody List<ApplicantTech> applicantTechs) {
        return applicantTechService.saveAll(applicantTechs);
    }

    @DeleteMapping("/{id}")
    public void deleteApplicantTech(@PathVariable Long id) {
        applicantTechService.deleteById(id);
    }
} 