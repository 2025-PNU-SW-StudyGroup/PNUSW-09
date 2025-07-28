package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, String> test() {
        return Map.of(
            "status", "success",
            "message", "API 연결 성공!",
            "timestamp", java.time.LocalDateTime.now().toString()
        );
    }
} 