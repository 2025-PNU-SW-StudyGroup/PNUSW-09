package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.service.InterviewService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllInterviews() {
        List<Interview> interviews = interviewService.findAll();
        return interviews.stream().map(this::buildInterviewResponse).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{interviewId}")
    public Map<String, Object> getInterview(@PathVariable Long interviewId) {
        Optional<Interview> interviewOpt = interviewService.findById(interviewId);
        if (interviewOpt.isEmpty()) {
            throw new RuntimeException("Interview not found with id: " + interviewId);
        }
        return buildInterviewResponse(interviewOpt.get());
    }

    @PostMapping
    public Map<String, Object> createInterview(@RequestBody Interview interview) {
        Interview savedInterview = interviewService.save(interview);
        return buildInterviewResponse(savedInterview);
    }

    @PutMapping("/{interviewId}")
    public Map<String, Object> updateInterview(@PathVariable Long interviewId, @RequestBody Interview interview) {
        interview.setId(interviewId);
        Interview savedInterview = interviewService.save(interview);
        return buildInterviewResponse(savedInterview);
    }

    @DeleteMapping("/{interviewId}")
    public void deleteInterview(@PathVariable Long interviewId) {
        interviewService.deleteById(interviewId);
    }

    // 면접 완료 처리
    @PutMapping("/{interviewId}/complete")
    public Map<String, Object> completeInterview(@PathVariable Long interviewId) {
        Interview completedInterview = interviewService.completeInterview(interviewId);
        return buildInterviewResponse(completedInterview);
    }



    // 인터뷰 시작 (지원자 ID로 새 면접 생성)
    @PostMapping("/start")
    public Map<String, Object> startInterview(@RequestBody Map<String, Object> requestData) {
        Long applicantId = Long.valueOf(requestData.get("applicantId").toString());
        Interview interview = interviewService.startInterviewWithManager(applicantId, 0L); // 매니저 ID는 고정으로 0
        
        // 순환 참조 방지를 위한 커스텀 응답
        Map<String, Object> response = new HashMap<>();
        response.put("id", interview.getId());
        response.put("doneAt", interview.getDoneAt());
        response.put("managerId", interview.getManager().getId());
        response.put("applicantId", interview.getApplicant().getId());
        response.put("applicantName", interview.getApplicant().getUsername());
        
        return response;
    }

    // 인터뷰에 대화 추가
    @PostMapping("/{interviewId}/conversations")
    public Map<String, Object> addConversation(@PathVariable Long interviewId, @RequestBody Map<String, Object> requestData) {
        String content = (String) requestData.get("content");
        Boolean isManager = (Boolean) requestData.get("isManager");
        Conversation conversation = interviewService.addConversation(interviewId, content, isManager);
        
        // 순환 참조 방지를 위한 커스텀 응답
        Map<String, Object> response = new HashMap<>();
        response.put("id", conversation.getId());
        response.put("content", conversation.getContent());
        response.put("isManager", conversation.getIsManager());
        response.put("interviewId", conversation.getInterview().getId());
        return response;
    }

    // 특정 면접의 대화 조회
    @GetMapping("/{interviewId}/conversations")
    public List<Map<String, Object>> getInterviewConversations(@PathVariable Long interviewId) {
        List<Conversation> conversations = interviewService.findConversationsByInterviewId(interviewId);
        return conversations.stream().map(conv -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", conv.getId());
            response.put("content", conv.getContent());
            response.put("isManager", conv.getIsManager());
            return response;
        }).collect(java.util.stream.Collectors.toList());
    }

    // Interview 응답 데이터 구성 헬퍼 메소드
    private Map<String, Object> buildInterviewResponse(Interview interview) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", interview.getId());
        response.put("doneAt", interview.getDoneAt());
        response.put("managerId", interview.getManager().getId());
        response.put("applicantId", interview.getApplicant().getId());
        response.put("applicantName", interview.getApplicant().getUsername());
        return response;
    }
} 