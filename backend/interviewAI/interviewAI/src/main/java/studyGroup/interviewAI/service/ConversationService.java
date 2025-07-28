package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.repository.ConversationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public List<Conversation> findAll() {
        return conversationRepository.findAll();
    }

    public Optional<Conversation> findById(Long id) {
        return conversationRepository.findById(id);
    }

    public Conversation save(Conversation conversation) {
        return conversationRepository.save(conversation);
    }

    public void deleteById(Long id) {
        conversationRepository.deleteById(id);
    }
} 