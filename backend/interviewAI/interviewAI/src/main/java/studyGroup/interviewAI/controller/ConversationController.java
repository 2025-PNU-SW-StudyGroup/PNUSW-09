package studyGroup.interviewAI.controller;

import org.springframework.web.bind.annotation.*;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.service.ConversationService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllConversations() {
        List<Conversation> conversations = conversationService.findAll();
        return conversations.stream().map(this::buildConversationResponse).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getConversation(@PathVariable Long id) {
        Optional<Conversation> conversationOpt = conversationService.findById(id);
        if (conversationOpt.isEmpty()) {
            throw new RuntimeException("Conversation not found with id: " + id);
        }
        return buildConversationResponse(conversationOpt.get());
    }

    @PostMapping
    public Map<String, Object> createConversation(@RequestBody Conversation conversation) {
        Conversation savedConversation = conversationService.save(conversation);
        return buildConversationResponse(savedConversation);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateConversation(@PathVariable Long id, @RequestBody Conversation conversation) {
        conversation.setId(id);
        Conversation savedConversation = conversationService.save(conversation);
        return buildConversationResponse(savedConversation);
    }

    @DeleteMapping("/{id}")
    public void deleteConversation(@PathVariable Long id) {
        conversationService.deleteById(id);
    }

    // 특정 면접의 대화 조회 (UI 배치 정보 포함)
    @GetMapping("/interview/{interviewId}/with-ui-info")
    public List<Map<String, Object>> getConversationsWithUIInfo(@PathVariable Long interviewId) {
        List<Conversation> conversations = conversationService.findByInterviewId(interviewId);
        return conversations.stream().map(conv -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", conv.getId());
            response.put("content", conv.getContent());
            response.put("isManager", conv.getIsManager());
            response.put("interviewId", conv.getInterview().getId());
            return response;
        }).collect(java.util.stream.Collectors.toList());
    }

    // Conversation 응답 데이터 구성 헬퍼 메소드
    private Map<String, Object> buildConversationResponse(Conversation conversation) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", conversation.getId());
        response.put("content", conversation.getContent());
        response.put("isManager", conversation.getIsManager());
        response.put("interviewId", conversation.getInterview().getId());
        return response;
    }
} 