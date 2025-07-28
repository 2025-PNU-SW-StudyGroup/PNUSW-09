package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.PreReport;
import studyGroup.interviewAI.repository.PreReportRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PreReportService {
    private final PreReportRepository preReportRepository;

    public PreReportService(PreReportRepository preReportRepository) {
        this.preReportRepository = preReportRepository;
    }

    public List<PreReport> findAll() {
        return preReportRepository.findAll();
    }

    public Optional<PreReport> findById(Long id) {
        return preReportRepository.findById(id);
    }

    public PreReport save(PreReport preReport) {
        return preReportRepository.save(preReport);
    }

    public void deleteById(Long id) {
        preReportRepository.deleteById(id);
    }
} 