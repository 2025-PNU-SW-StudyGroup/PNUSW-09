package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.service.InterviewService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Interview> getInterview(@PathVariable Long id) {
        return interviewService.findById(id);
    }

    @PostMapping
    public Interview createInterview(@RequestBody Interview interview) {
        return interviewService.save(interview);
    }

    @PutMapping("/{id}")
    public Interview updateInterview(@PathVariable Long id, @RequestBody Interview interview) {
        interview.setId(id);
        return interviewService.save(interview);
    }

    @DeleteMapping("/{id}")
    public void deleteInterview(@PathVariable Long id) {
        interviewService.deleteById(id);
    }

    // 면접 완료 처리
    @PutMapping("/{id}/complete")
    public Interview completeInterview(@PathVariable Long id) {
        return interviewService.completeInterview(id);
    }

    // 특정 면접의 대화 조회
    @GetMapping("/{id}/conversations")
    public List<Conversation> getInterviewConversations(@PathVariable Long id) {
        return interviewService.findConversationsByInterviewId(id);
    }
} 