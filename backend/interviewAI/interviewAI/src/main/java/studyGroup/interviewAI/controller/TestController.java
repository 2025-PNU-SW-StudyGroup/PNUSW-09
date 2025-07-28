package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping
    public String test() {
        return "API is working!";
    }
    
    @PostMapping
    public String testPost(@RequestBody String body) {
        return "POST is working! Received: " + body;
    }
} 