package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.ApplicationStatus;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.entity.WorkHistory;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.entity.ApplicantTech;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.ApplicantTechRepository;
import studyGroup.interviewAI.repository.WorkHistoryRepository;
import studyGroup.interviewAI.repository.ProjectHistoryRepository;
import studyGroup.interviewAI.repository.TechStackRepository;
import studyGroup.interviewAI.repository.PositionRepository;
import studyGroup.interviewAI.repository.ExperienceRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicantService {
    private final ApplicantRepository applicantRepository;
    private final ApplicantTechRepository applicantTechRepository;
    private final WorkHistoryRepository workHistoryRepository;
    private final ProjectHistoryRepository projectHistoryRepository;
    private final TechStackRepository techStackRepository;
    private final PositionRepository positionRepository;
    private final ExperienceRepository experienceRepository;

    public ApplicantService(ApplicantRepository applicantRepository,
                          ApplicantTechRepository applicantTechRepository,
                          WorkHistoryRepository workHistoryRepository,
                          ProjectHistoryRepository projectHistoryRepository,
                          TechStackRepository techStackRepository,
                          PositionRepository positionRepository,
                          ExperienceRepository experienceRepository) {
        this.applicantRepository = applicantRepository;
        this.applicantTechRepository = applicantTechRepository;
        this.workHistoryRepository = workHistoryRepository;
        this.projectHistoryRepository = projectHistoryRepository;
        this.techStackRepository = techStackRepository;
        this.positionRepository = positionRepository;
        this.experienceRepository = experienceRepository;
    }

    public List<Applicant> findAll() {
        return applicantRepository.findAllWithAllRelations();
    }

    public Optional<Applicant> findById(Long id) {
        return applicantRepository.findByIdWithAllRelations(id);
    }

    public Applicant save(Applicant applicant) {
        if (applicant.getApplyAt() == null) {
            applicant.setApplyAt(LocalDateTime.now());
        }
        return applicantRepository.save(applicant);
    }

    // 통합 지원자 등록 (기술스택 포함)
    public Applicant saveWithTechStacks(Applicant applicant, List<Long> techStackIds) {
        // Position과 Experience 엔티티 완전 로드
        if (applicant.getPosition() != null && applicant.getPosition().getId() != null) {
            studyGroup.interviewAI.entity.Position position = positionRepository.findById(applicant.getPosition().getId())
                .orElseThrow(() -> new RuntimeException("Position not found: " + applicant.getPosition().getId()));
            applicant.setPosition(position);
        }
        
        if (applicant.getExperience() != null && applicant.getExperience().getId() != null) {
            studyGroup.interviewAI.entity.Experience experience = experienceRepository.findById(applicant.getExperience().getId())
                .orElseThrow(() -> new RuntimeException("Experience not found: " + applicant.getExperience().getId()));
            applicant.setExperience(experience);
        }
        
        // 1. 지원자 저장
        if (applicant.getApplyAt() == null) {
            applicant.setApplyAt(LocalDateTime.now());
        }
        Applicant savedApplicant = applicantRepository.save(applicant);
        
        // 2. 기술스택 연결
        if (techStackIds != null && !techStackIds.isEmpty()) {
            List<ApplicantTech> applicantTechs = techStackIds.stream()
                .map(techStackId -> {
                    ApplicantTech applicantTech = new ApplicantTech();
                    applicantTech.setApplicant(savedApplicant);
                    
                    // TechStack 조회 및 설정
                    TechStack techStack = techStackRepository.findById(techStackId)
                        .orElseThrow(() -> new RuntimeException("TechStack not found: " + techStackId));
                    applicantTech.setTechStack(techStack);
                    
                    return applicantTech;
                })
                .collect(Collectors.toList());
            
            applicantTechRepository.saveAll(applicantTechs);
        }
        
        // 3. 완전한 정보로 다시 조회해서 반환
        return applicantRepository.findByIdWithPositionAndExperience(savedApplicant.getId())
            .orElse(savedApplicant);
    }

    public void deleteById(Long id) {
        applicantRepository.deleteById(id);
    }

    // 지원자의 기술 스택 조회
    public List<TechStack> findTechStacksByApplicantId(Long applicantId) {
        return applicantTechRepository.findByApplicantId(applicantId)
                .stream()
                .map(applicantTech -> applicantTech.getTechStack())
                .collect(Collectors.toList());
    }

    // 지원자의 경력 이력 조회
    public List<WorkHistory> findWorkHistoriesByApplicantId(Long applicantId) {
        return workHistoryRepository.findByApplicantId(applicantId);
    }

    // 지원자의 프로젝트 이력 조회
    public List<ProjectHistory> findProjectHistoriesByApplicantId(Long applicantId) {
        return projectHistoryRepository.findByApplicantId(applicantId);
    }

    // 지원자 상태 업데이트
    public Applicant updateStatus(Long id, ApplicationStatus status) {
        Optional<Applicant> applicantOpt = applicantRepository.findByIdWithAllRelations(id);
        if (applicantOpt.isPresent()) {
            Applicant applicant = applicantOpt.get();
            applicant.setStatus(status);
            applicantRepository.save(applicant);
            // 저장 후 다시 모든 관계를 포함하여 조회
            return applicantRepository.findByIdWithAllRelations(id).orElse(applicant);
        } else {
            throw new RuntimeException("지원자를 찾을 수 없습니다: " + id);
        }
    }
} 