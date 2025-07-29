package studyGroup.interviewAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.service.ApplicantService;
import studyGroup.interviewAI.service.FileUploadService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantController {
    private final ApplicantService applicantService;
    private final FileUploadService fileUploadService;

    public ApplicantController(ApplicantService applicantService, FileUploadService fileUploadService) {
        this.applicantService = applicantService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Applicant> getApplicant(@PathVariable Long id) {
        return applicantService.findById(id);
    }

    // 지원자 상세 정보 (모든 관련 정보 포함)
    @GetMapping("/{id}/details")
    public Map<String, Object> getApplicantDetails(@PathVariable Long id) {
        Map<String, Object> details = new HashMap<>();
        
        // 기본 지원자 정보
        Optional<Applicant> applicantOpt = applicantService.findById(id);
        if (applicantOpt.isEmpty()) {
            throw new RuntimeException("Applicant not found with id: " + id);
        }
        
        Applicant applicant = applicantOpt.get();
        details.put("applicant", applicant);
        
        // 기술 스택
        List<TechStack> techStacks = applicantService.findTechStacksByApplicantId(id);
        details.put("techStacks", techStacks);
        
        // 경력 이력
        List<WorkHistory> workHistories = applicantService.findWorkHistoriesByApplicantId(id);
        details.put("workHistories", workHistories);
        
        // 프로젝트 이력
        List<ProjectHistory> projectHistories = applicantService.findProjectHistoriesByApplicantId(id);
        details.put("projectHistories", projectHistories);
        
        return details;
    }

    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant) {
        return applicantService.save(applicant);
    }

    // 통합 지원자 등록 (기술스택 포함)
    @PostMapping("/register")
    public Applicant registerApplicant(@RequestBody Map<String, Object> requestData) {
        // 지원자 정보 추출
        Applicant applicant = new Applicant();
        applicant.setUsername((String) requestData.get("username"));
        applicant.setEmail((String) requestData.get("email"));
        applicant.setLocation((String) requestData.get("location"));
        applicant.setResumeFilePath((String) requestData.get("resumeFilePath"));
        applicant.setGithubUrl((String) requestData.get("githubUrl"));
        applicant.setPortfolioUrl((String) requestData.get("portfolioUrl"));
        applicant.setPortfolioFilePath((String) requestData.get("portfolioFilePath"));
        
        // Position 설정
        if (requestData.get("position") != null) {
            Map<String, Object> positionData = (Map<String, Object>) requestData.get("position");
            studyGroup.interviewAI.entity.Position position = new studyGroup.interviewAI.entity.Position();
            position.setId(Long.valueOf(positionData.get("id").toString()));
            applicant.setPosition(position);
        }
        
        // Experience 설정
        if (requestData.get("experience") != null) {
            Map<String, Object> experienceData = (Map<String, Object>) requestData.get("experience");
            studyGroup.interviewAI.entity.Experience experience = new studyGroup.interviewAI.entity.Experience();
            experience.setId(Long.valueOf(experienceData.get("id").toString()));
            applicant.setExperience(experience);
        }
        
        // 기술스택 ID 목록 추출
        List<Long> techStackIds = null;
        if (requestData.get("techStackIds") != null) {
            techStackIds = ((List<Object>) requestData.get("techStackIds"))
                .stream()
                .map(id -> Long.valueOf(id.toString()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        return applicantService.saveWithTechStacks(applicant, techStackIds);
    }

    @PutMapping("/{id}")
    public Applicant updateApplicant(@PathVariable Long id, @RequestBody Applicant applicant) {
        applicant.setId(id);
        return applicantService.save(applicant);
    }

    @DeleteMapping("/{id}")
    public void deleteApplicant(@PathVariable Long id) {
        applicantService.deleteById(id);
    }

    // 지원자의 기술 스택 조회
    @GetMapping("/{id}/tech-stacks")
    public List<TechStack> getApplicantTechStacks(@PathVariable Long id) {
        return applicantService.findTechStacksByApplicantId(id);
    }

    // 지원자의 경력 이력 조회
    @GetMapping("/{id}/work-histories")
    public List<WorkHistory> getApplicantWorkHistories(@PathVariable Long id) {
        return applicantService.findWorkHistoriesByApplicantId(id);
    }

    // 지원자의 프로젝트 이력 조회
    @GetMapping("/{id}/project-histories")
    public List<ProjectHistory> getApplicantProjectHistories(@PathVariable Long id) {
        return applicantService.findProjectHistoriesByApplicantId(id);
    }

    // 이력서 파일 업로드
    @PostMapping("/{id}/upload-resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileUploadService.uploadResumeFile(file);
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 