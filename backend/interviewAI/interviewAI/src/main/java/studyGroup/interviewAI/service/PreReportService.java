package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.PreReport;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.repository.PreReportRepository;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.WorkHistoryRepository;
import studyGroup.interviewAI.repository.ProjectHistoryRepository;
import studyGroup.interviewAI.repository.TechStackRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@Service
public class PreReportService {
    private final PreReportRepository preReportRepository;
    private final ApplicantRepository applicantRepository;
    private final WorkHistoryRepository workHistoryRepository;
    private final ProjectHistoryRepository projectHistoryRepository;
    private final TechStackRepository techStackRepository;

    public PreReportService(PreReportRepository preReportRepository,
                          ApplicantRepository applicantRepository,
                          WorkHistoryRepository workHistoryRepository,
                          ProjectHistoryRepository projectHistoryRepository,
                          TechStackRepository techStackRepository) {
        this.preReportRepository = preReportRepository;
        this.applicantRepository = applicantRepository;
        this.workHistoryRepository = workHistoryRepository;
        this.projectHistoryRepository = projectHistoryRepository;
        this.techStackRepository = techStackRepository;
    }

    public List<PreReport> findAll() {
        return preReportRepository.findAll();
    }

    public Optional<PreReport> findById(Long id) {
        return preReportRepository.findById(id);
    }

    public PreReport save(PreReport preReport) {
        // Applicant 관계 설정
        if (preReport.getApplicant() != null && preReport.getApplicant().getId() != null) {
            Applicant applicant = applicantRepository.findByIdWithPositionAndExperience(preReport.getApplicant().getId())
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + preReport.getApplicant().getId()));
            preReport.setApplicant(applicant);
        }
        
        return preReportRepository.save(preReport);
    }

    public void deleteById(Long id) {
        preReportRepository.deleteById(id);
    }

    // 지원자별 Pre-Report 데이터 조회
    public Map<String, Object> getApplicantPreReportData(Long applicantId) {
        Map<String, Object> result = new HashMap<>();
        
        // WorkHistory 조회
        List<WorkHistory> workHistories = workHistoryRepository.findByApplicantId(applicantId);
        
        // ProjectHistory 조회 및 기술스택 파싱
        List<ProjectHistory> projectHistories = projectHistoryRepository.findByApplicantId(applicantId);
        List<Map<String, Object>> enhancedProjectHistories = new ArrayList<>();
        
        for (ProjectHistory project : projectHistories) {
            Map<String, Object> projectData = new HashMap<>();
            projectData.put("id", project.getId());
            projectData.put("title", project.getTitle());
            projectData.put("description", project.getDescription());
            projectData.put("applicant", project.getApplicant());
            
            // 모든 기술스택 파싱 (TechStack 객체로)
            List<TechStack> techStacks = new ArrayList<>();
            if (project.getTechStack() != null) {
                techStacks.add(project.getTechStack());
            }
            
            // "사용 기술: React, TypeScript, Node.js" 형태에서 파싱
            String description = project.getDescription();
            if (description != null && description.contains("사용 기술:")) {
                Pattern pattern = Pattern.compile("사용 기술: ([^)]+)");
                Matcher matcher = pattern.matcher(description);
                if (matcher.find()) {
                    String techStacksStr = matcher.group(1);
                    String[] techStackTitles = techStacksStr.split(", ");
                    
                    // 모든 TechStack 조회해서 title 매칭
                    List<TechStack> allTechStacks = techStackRepository.findAll();
                    for (String title : techStackTitles) {
                        for (TechStack techStack : allTechStacks) {
                            if (techStack.getTitle().equals(title.trim()) && 
                                !techStacks.contains(techStack)) {
                                techStacks.add(techStack);
                                break;
                            }
                        }
                    }
                }
            }
            
            projectData.put("techStacks", techStacks); // TechStack 객체 배열
            enhancedProjectHistories.add(projectData);
        }
        
        // PreReport 조회 (description만)
        List<PreReport> preReports = preReportRepository.findByApplicantId(applicantId);
        List<String> preReportDescriptions = new ArrayList<>();
        for (PreReport report : preReports) {
            preReportDescriptions.add(report.getDescription());
        }
        
        result.put("workHistories", workHistories);
        result.put("projectHistories", enhancedProjectHistories);
        result.put("final-descriptions", preReportDescriptions);
        
        return result;
    }
} 