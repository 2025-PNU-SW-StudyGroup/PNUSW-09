package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.entity.PostReport;
import studyGroup.interviewAI.entity.ApplicationStatus;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.InterviewRepository;
import studyGroup.interviewAI.repository.PostReportRepository;
import studyGroup.interviewAI.repository.ApplicantTechRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ApplicantRepository applicantRepository;
    private final InterviewRepository interviewRepository;
    private final PostReportRepository postReportRepository;
    private final ApplicantTechRepository applicantTechRepository;

    public DashboardService(ApplicantRepository applicantRepository,
                          InterviewRepository interviewRepository,
                          PostReportRepository postReportRepository,
                          ApplicantTechRepository applicantTechRepository) {
        this.applicantRepository = applicantRepository;
        this.interviewRepository = interviewRepository;
        this.postReportRepository = postReportRepository;
        this.applicantTechRepository = applicantTechRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 전체 지원자 수
        long totalApplicants = applicantRepository.count();
        
        // 지원자 상태별 카운트
        long waitingApplicants = applicantRepository.countByStatus(ApplicationStatus.WAITING);
        long interviewingApplicants = applicantRepository.countByStatus(ApplicationStatus.INTERVIEWING);
        long completedApplicants = applicantRepository.countByStatus(ApplicationStatus.COMPLETED);
        
        // 평균 점수
        Double averageScore = postReportRepository.findAverageScore();
        
        stats.put("totalApplicants", totalApplicants);
        stats.put("pendingApplicants", waitingApplicants);
        stats.put("interviewingApplicants", interviewingApplicants);
        stats.put("completedApplicants", completedApplicants);
        stats.put("averageScore", averageScore != null ? averageScore : 0.0);
        
        return stats;
    }

    // 메인 화면용 완전한 대시보드 데이터
    public Map<String, Object> getMainDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // 1. 통계 정보
        dashboardData.put("stats", getDashboardStats());
        
        // 2. 지원자 목록 (상세 정보 포함)
        List<Applicant> applicants = applicantRepository.findAllWithPositionAndExperience();
        
        List<Map<String, Object>> applicantDetails = applicants.stream()
            .map(applicant -> {
                Map<String, Object> detail = new HashMap<>();
                
                // 기본 지원자 정보
                detail.put("id", applicant.getId());
                detail.put("username", applicant.getUsername());
                detail.put("email", applicant.getEmail());
                detail.put("location", applicant.getLocation());
                detail.put("githubUrl", applicant.getGithubUrl());
                detail.put("portfolioUrl", applicant.getPortfolioUrl());
                detail.put("applyAt", applicant.getApplyAt());
                
                // 포지션과 경력
                detail.put("position", Map.of(
                    "id", applicant.getPosition().getId(),
                    "title", applicant.getPosition().getTitle()
                ));
                detail.put("experience", Map.of(
                    "id", applicant.getExperience().getId(),
                    "title", applicant.getExperience().getTitle()
                ));
                
                // 기술 스택
                List<TechStack> techStacks = applicantTechRepository.findByApplicantId(applicant.getId())
                    .stream()
                    .map(applicantTech -> applicantTech.getTechStack())
                    .collect(Collectors.toList());
                detail.put("techStacks", techStacks);
                
                // 면접 상태와 점수
                List<Interview> interviews = interviewRepository.findByApplicantId(applicant.getId());
                if (interviews.isEmpty()) {
                    detail.put("status", "pending");
                    detail.put("score", null);
                } else {
                    Interview interview = interviews.get(0); // 최신 면접
                    if (interview.getDoneAt() == null) {
                        detail.put("status", "pending");
                        detail.put("score", null);
                    } else {
                        detail.put("status", "completed");
                        // 점수 조회
                        PostReport postReport = postReportRepository.findByInterviewId(interview.getId())
                            .orElse(null);
                        detail.put("score", postReport != null ? postReport.getScore() : null);
                    }
                }
                
                return detail;
            })
            .collect(Collectors.toList());
        
        dashboardData.put("applicants", applicantDetails);
        
        return dashboardData;
    }
} 