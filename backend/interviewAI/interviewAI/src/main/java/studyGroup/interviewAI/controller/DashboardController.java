package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.service.DashboardService;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
} 