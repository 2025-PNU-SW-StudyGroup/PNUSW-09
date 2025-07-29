package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.repository.ProjectHistoryRepository;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.TechStackRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProjectHistoryService {
    private final ProjectHistoryRepository projectHistoryRepository;
    private final ApplicantRepository applicantRepository;
    private final TechStackRepository techStackRepository;

    public ProjectHistoryService(ProjectHistoryRepository projectHistoryRepository,
                               ApplicantRepository applicantRepository,
                               TechStackRepository techStackRepository) {
        this.projectHistoryRepository = projectHistoryRepository;
        this.applicantRepository = applicantRepository;
        this.techStackRepository = techStackRepository;
    }

    public List<ProjectHistory> findAll() {
        return projectHistoryRepository.findAll();
    }

    public Optional<ProjectHistory> findById(Long id) {
        return projectHistoryRepository.findById(id);
    }

    public ProjectHistory save(ProjectHistory projectHistory) {
        // Applicant 관계 설정
        if (projectHistory.getApplicant() != null && projectHistory.getApplicant().getId() != null) {
            Applicant applicant = applicantRepository.findByIdWithPositionAndExperience(projectHistory.getApplicant().getId())
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + projectHistory.getApplicant().getId()));
            projectHistory.setApplicant(applicant);
        }
        
        // TechStack 관계 설정
        if (projectHistory.getTechStack() != null && projectHistory.getTechStack().getId() != null) {
            TechStack techStack = techStackRepository.findById(projectHistory.getTechStack().getId())
                .orElseThrow(() -> new RuntimeException("TechStack not found: " + projectHistory.getTechStack().getId()));
            projectHistory.setTechStack(techStack);
        }
        
        return projectHistoryRepository.save(projectHistory);
    }

    public void deleteById(Long id) {
        projectHistoryRepository.deleteById(id);
    }

    // 특정 지원자의 프로젝트 조회
    public List<ProjectHistory> findByApplicantId(Long applicantId) {
        return projectHistoryRepository.findByApplicantId(applicantId);
    }

    // 여러 기술스택을 포함한 프로젝트 생성
    public ProjectHistory saveWithMultipleTechStacks(Map<String, Object> requestData) {
        // 프로젝트 기본 정보 생성
        ProjectHistory project = new ProjectHistory();
        project.setTitle((String) requestData.get("title"));
        project.setDescription((String) requestData.get("description"));
        
        // 지원자 설정
        if (requestData.get("applicant") != null) {
            Map<String, Object> applicantData = (Map<String, Object>) requestData.get("applicant");
            Long applicantId = Long.valueOf(applicantData.get("id").toString());
            Applicant applicant = applicantRepository.findByIdWithPositionAndExperience(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + applicantId));
            project.setApplicant(applicant);
        }
        
        // 주요 기술스택 설정 (첫 번째 기술스택을 주요 기술스택으로)
        if (requestData.get("techStackIds") != null) {
            List<Object> techStackIds = (List<Object>) requestData.get("techStackIds");
            if (!techStackIds.isEmpty()) {
                Long mainTechStackId = Long.valueOf(techStackIds.get(0).toString());
                TechStack mainTechStack = techStackRepository.findById(mainTechStackId)
                    .orElseThrow(() -> new RuntimeException("TechStack not found: " + mainTechStackId));
                project.setTechStack(mainTechStack);
            }
        }
        
        // 프로젝트 저장
        ProjectHistory savedProject = projectHistoryRepository.save(project);
        
        // 추가 기술스택들은 description에 포함 (임시 방안)
        if (requestData.get("techStackIds") != null) {
            List<Object> techStackIds = (List<Object>) requestData.get("techStackIds");
            if (techStackIds.size() > 1) {
                StringBuilder techStacksDesc = new StringBuilder(savedProject.getDescription());
                techStacksDesc.append(" (사용 기술: ");
                
                for (int i = 0; i < techStackIds.size(); i++) {
                    Long techStackId = Long.valueOf(techStackIds.get(i).toString());
                    TechStack techStack = techStackRepository.findById(techStackId)
                        .orElse(null);
                    if (techStack != null) {
                        if (i > 0) techStacksDesc.append(", ");
                        techStacksDesc.append(techStack.getTitle());
                    }
                }
                techStacksDesc.append(")");
                
                savedProject.setDescription(techStacksDesc.toString());
                projectHistoryRepository.save(savedProject);
            }
        }
        
        return savedProject;
    }
} 