package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Manager;
import studyGroup.interviewAI.repository.ManagerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ManagerService {
    private final ManagerRepository managerRepository;

    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    public List<Manager> findAll() {
        return managerRepository.findAll();
    }

    public Optional<Manager> findById(Long id) {
        return managerRepository.findById(id);
    }

    public Manager save(Manager manager) {
        return managerRepository.save(manager);
    }

    public void deleteById(Long id) {
        managerRepository.deleteById(id);
    }
} 