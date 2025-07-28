package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Manager;
import studyGroup.interviewAI.service.ManagerService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {
    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public List<Manager> getManagers() {
        return managerService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Manager> getManager(@PathVariable Long id) {
        return managerService.findById(id);
    }

    @PostMapping
    public Manager createManager(@RequestBody Manager manager) {
        return managerService.save(manager);
    }

    @DeleteMapping("/{id}")
    public void deleteManager(@PathVariable Long id) {
        managerService.deleteById(id);
    }
} 