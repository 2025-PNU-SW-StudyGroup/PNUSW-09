package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import studyGroup.interviewAI.entity.Interview;
import studyGroup.interviewAI.entity.Conversation;
import studyGroup.interviewAI.entity.Manager;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.repository.InterviewRepository;
import studyGroup.interviewAI.repository.ConversationRepository;
import studyGroup.interviewAI.repository.ManagerRepository;
import studyGroup.interviewAI.repository.ApplicantRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final ConversationRepository conversationRepository;
    private final ManagerRepository managerRepository;
    private final ApplicantRepository applicantRepository;

    public InterviewService(InterviewRepository interviewRepository,
                          ConversationRepository conversationRepository,
                          ManagerRepository managerRepository,
                          ApplicantRepository applicantRepository) {
        this.interviewRepository = interviewRepository;
        this.conversationRepository = conversationRepository;
        this.managerRepository = managerRepository;
        this.applicantRepository = applicantRepository;
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

    // 매니저와 함께 인터뷰 시작
    public Interview startInterviewWithManager(Long applicantId, Long managerId) {
        // 지원자 존재 확인
        Optional<Applicant> applicantOpt = applicantRepository.findById(applicantId);
        if (applicantOpt.isEmpty()) {
            throw new RuntimeException("Applicant not found with id: " + applicantId);
        }

        // 매니저 존재 확인 또는 생성
        Manager manager = managerRepository.findById(managerId).orElseGet(() -> {
            Manager newManager = new Manager();
            newManager.setId(managerId);
            return managerRepository.save(newManager);
        });

        // 새 인터뷰 생성
        Interview interview = new Interview();
        interview.setApplicant(applicantOpt.get());
        interview.setManager(manager);
        // doneAt은 null로 두어 진행 중임을 표시

        return interviewRepository.save(interview);
    }

    // 인터뷰에 대화 추가
    public Conversation addConversation(Long interviewId, String content, Boolean isManager) {
        // 인터뷰 존재 확인
        Optional<Interview> interviewOpt = interviewRepository.findById(interviewId);
        if (interviewOpt.isEmpty()) {
            throw new RuntimeException("Interview not found with id: " + interviewId);
        }

        // 새 대화 생성
        Conversation conversation = new Conversation();
        conversation.setInterview(interviewOpt.get());
        conversation.setContent(content);
        conversation.setIsManager(isManager != null ? isManager : false);

        return conversationRepository.save(conversation);
    }
} 