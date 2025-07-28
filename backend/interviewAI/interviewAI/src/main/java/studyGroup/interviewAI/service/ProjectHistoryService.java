package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.ProjectHistory;
import studyGroup.interviewAI.repository.ProjectHistoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectHistoryService {
    private final ProjectHistoryRepository projectHistoryRepository;

    public ProjectHistoryService(ProjectHistoryRepository projectHistoryRepository) {
        this.projectHistoryRepository = projectHistoryRepository;
    }

    public List<ProjectHistory> findAll() {
        return projectHistoryRepository.findAll();
    }

    public Optional<ProjectHistory> findById(Long id) {
        return projectHistoryRepository.findById(id);
    }

    public ProjectHistory save(ProjectHistory projectHistory) {
        return projectHistoryRepository.save(projectHistory);
    }

    public void deleteById(Long id) {
        projectHistoryRepository.deleteById(id);
    }
} 