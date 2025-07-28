package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.repository.InterviewRepository;
import studyGroup.interviewAI.repository.ConversationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final ConversationRepository conversationRepository;

    public InterviewService(InterviewRepository interviewRepository,
                          ConversationRepository conversationRepository) {
        this.interviewRepository = interviewRepository;
        this.conversationRepository = conversationRepository;
    }

    public List<Interview> findAll() {
        return interviewRepository.findAll();
    }

    public Optional<Interview> findById(Long id) {
        return interviewRepository.findById(id);
    }

    public Interview save(Interview interview) {
        return interviewRepository.save(interview);
    }

    public void deleteById(Long id) {
        interviewRepository.deleteById(id);
    }

    // 면접 완료 처리
    public Interview completeInterview(Long interviewId) {
        Optional<Interview> interviewOpt = interviewRepository.findById(interviewId);
        if (interviewOpt.isPresent()) {
            Interview interview = interviewOpt.get();
            interview.setDoneAt(LocalDateTime.now());
            return interviewRepository.save(interview);
        }
        throw new RuntimeException("Interview not found with id: " + interviewId);
    }

    // 특정 면접의 대화 조회
    public List<Conversation> findConversationsByInterviewId(Long interviewId) {
        return conversationRepository.findByInterviewIdOrderById(interviewId);
    }

    // 특정 지원자의 면접 조회
    public List<Interview> findByApplicantId(Long applicantId) {
        return interviewRepository.findByApplicantId(applicantId);
    }
} 