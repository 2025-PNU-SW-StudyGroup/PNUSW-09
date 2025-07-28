package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.PostReport;
import studyGroup.interviewAI.repository.PostReportRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PostReportService {
    private final PostReportRepository postReportRepository;

    public PostReportService(PostReportRepository postReportRepository) {
        this.postReportRepository = postReportRepository;
    }

    public List<PostReport> findAll() {
        return postReportRepository.findAll();
    }

    public Optional<PostReport> findById(Long id) {
        return postReportRepository.findById(id);
    }

    public PostReport save(PostReport postReport) {
        return postReportRepository.save(postReport);
    }

    public void deleteById(Long id) {
        postReportRepository.deleteById(id);
    }
} 