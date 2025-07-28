package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.repository.ApplicantRepository;
import studyGroup.interviewAI.repository.InterviewRepository;
import studyGroup.interviewAI.repository.PostReportRepository;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    private final ApplicantRepository applicantRepository;
    private final InterviewRepository interviewRepository;
    private final PostReportRepository postReportRepository;

    public DashboardService(ApplicantRepository applicantRepository,
                          InterviewRepository interviewRepository,
                          PostReportRepository postReportRepository) {
        this.applicantRepository = applicantRepository;
        this.interviewRepository = interviewRepository;
        this.postReportRepository = postReportRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 전체 지원자 수
        long totalApplicants = applicantRepository.count();
        
        // 완료된 면접 수
        long completedInterviews = interviewRepository.countByDoneAtIsNotNull();
        
        // 대기 중인 면접 수
        long pendingInterviews = interviewRepository.countByDoneAtIsNull();
        
        // 평균 점수
        Double averageScore = postReportRepository.findAverageScore();
        
        stats.put("totalApplicants", totalApplicants);
        stats.put("completedInterviews", completedInterviews);
        stats.put("pendingInterviews", pendingInterviews);
        stats.put("averageScore", averageScore != null ? averageScore : 0.0);
        
        return stats;
    }
} 