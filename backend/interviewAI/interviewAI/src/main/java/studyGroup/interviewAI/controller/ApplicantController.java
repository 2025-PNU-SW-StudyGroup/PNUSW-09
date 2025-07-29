package studyGroup.interviewAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.ApplicationStatus;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.service.ApplicantService;
import studyGroup.interviewAI.service.FileUploadService;

import java.io.IOException;
import java.time.LocalDateTime;
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
    public List<Map<String, Object>> getAllApplicants() {
        List<Applicant> applicants = applicantService.findAll();
        return applicants.stream().map(this::buildApplicantResponse).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getApplicant(@PathVariable Long id) {
        Optional<Applicant> applicantOpt = applicantService.findById(id);
        if (applicantOpt.isEmpty()) {
            throw new RuntimeException("Applicant not found with id: " + id);
        }
        return buildApplicantResponse(applicantOpt.get());
    }
    
    // 지원자 응답 데이터 구성 헬퍼 메소드
    private Map<String, Object> buildApplicantResponse(Applicant applicant) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", applicant.getId());
        response.put("username", applicant.getUsername());
        response.put("email", applicant.getEmail());
        response.put("location", applicant.getLocation());
        response.put("resumeFilePath", applicant.getResumeFilePath());
        response.put("githubUrl", applicant.getGithubUrl());
        response.put("portfolioUrl", applicant.getPortfolioUrl());
        response.put("portfolioFilePath", applicant.getPortfolioFilePath());
        response.put("applyAt", applicant.getApplyAt());
        response.put("status", applicant.getStatus());
        response.put("position", applicant.getPosition());
        response.put("experience", applicant.getExperience());
        
        // 기술스택 이름들 추출
        List<String> techStackNames = (applicant.getApplicantTechs() != null) ?
            applicant.getApplicantTechs().stream()
                .map(at -> at.getTechStack().getTitle())
                .collect(java.util.stream.Collectors.toList()) 
            : new java.util.ArrayList<>();
        response.put("techStackNames", techStackNames);
        
        return response;
    }

    // 지원자 상세 정보 (모든 관련 정보 포함)
    @GetMapping("/{id}/details")
    public Map<String, Object> getApplicantDetails(@PathVariable Long id) {
        Optional<Applicant> applicantOpt = applicantService.findById(id);
        if (applicantOpt.isEmpty()) {
            throw new RuntimeException("Applicant not found with id: " + id);
        }
        
        Applicant applicant = applicantOpt.get();
        
        // 기본 지원자 정보 (기술스택 이름 포함)
        Map<String, Object> details = buildApplicantResponse(applicant);
        
        // 경력 이력
        List<WorkHistory> workHistories = applicantService.findWorkHistoriesByApplicantId(id);
        details.put("workHistories", workHistories);
        
        // 프로젝트 이력
        List<ProjectHistory> projectHistories = applicantService.findProjectHistoriesByApplicantId(id);
        details.put("projectHistories", projectHistories);
        
        return details;
    }

    @PostMapping
    public Map<String, Object> createApplicant(@RequestBody Applicant applicant) {
        Applicant savedApplicant = applicantService.save(applicant);
        // 저장 후 모든 관계를 포함하여 다시 조회
        Optional<Applicant> fullApplicant = applicantService.findById(savedApplicant.getId());
        return buildApplicantResponse(fullApplicant.orElse(savedApplicant));
    }

    // 통합 지원자 등록 (기술스택 포함)
    @PostMapping("/register")
    public Map<String, Object> registerApplicant(@RequestBody Map<String, Object> requestData) {
        // 지원자 정보 추출
        Applicant applicant = new Applicant();
        applicant.setUsername((String) requestData.get("username"));
        applicant.setEmail((String) requestData.get("email"));
        applicant.setLocation((String) requestData.get("location"));
        applicant.setResumeFilePath((String) requestData.get("resumeFilePath"));
        applicant.setGithubUrl((String) requestData.get("githubUrl"));
        applicant.setPortfolioUrl((String) requestData.get("portfolioUrl"));
        applicant.setPortfolioFilePath((String) requestData.get("portfolioFilePath"));
        applicant.setApplyAt(LocalDateTime.now());
        applicant.setStatus(ApplicationStatus.WAITING);
        
        // Position 설정 (ID로 받기)
        if (requestData.get("positionId") != null) {
            studyGroup.interviewAI.entity.Position position = new studyGroup.interviewAI.entity.Position();
            position.setId(Long.valueOf(requestData.get("positionId").toString()));
            applicant.setPosition(position);
        }
        
        // Experience 설정 (ID로 받기)
        if (requestData.get("experienceId") != null) {
            studyGroup.interviewAI.entity.Experience experience = new studyGroup.interviewAI.entity.Experience();
            experience.setId(Long.valueOf(requestData.get("experienceId").toString()));
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
        
        Applicant savedApplicant = applicantService.saveWithTechStacks(applicant, techStackIds);
        
        // 저장 후 모든 관계를 포함하여 다시 조회 (실패 시 기본 응답)
        try {
            Optional<Applicant> fullApplicant = applicantService.findById(savedApplicant.getId());
            if (fullApplicant.isPresent()) {
                return buildApplicantResponse(fullApplicant.get());
            }
        } catch (Exception e) {
            // 조회 실패 시 로그 남기고 기본 응답 생성
            System.err.println("지원자 재조회 실패: " + e.getMessage());
        }
        
        // 기본 응답 (기술스택 정보 없이)
        return buildApplicantResponse(savedApplicant);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateApplicant(@PathVariable Long id, @RequestBody Applicant applicant) {
        applicant.setId(id);
        Applicant savedApplicant = applicantService.save(applicant);
        // 저장 후 모든 관계를 포함하여 다시 조회
        Optional<Applicant> fullApplicant = applicantService.findById(savedApplicant.getId());
        return buildApplicantResponse(fullApplicant.orElse(savedApplicant));
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

    // 지원자 상태 업데이트
    @PutMapping("/{id}/status")
    public Map<String, Object> updateApplicantStatus(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        String statusStr = (String) requestData.get("status");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr);
        Applicant updatedApplicant = applicantService.updateStatus(id, status);
        return buildApplicantResponse(updatedApplicant);
    }

    // 이력서 파일 업로드
    @PostMapping("/upload-resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileUploadService.uploadResumeFile(file);
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 포트폴리오 파일 업로드
    @PostMapping("/upload-portfolio")
    public ResponseEntity<String> uploadPortfolio(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileUploadService.uploadPortfolioFile(file);
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 