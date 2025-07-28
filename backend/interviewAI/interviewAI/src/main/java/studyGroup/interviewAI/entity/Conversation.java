package studyGroup.interviewAI.entity;

import jakarta.persistence.*;

@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Boolean isManager;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Interview getInterview() {
        return interview;
    }
    public void setInterview(Interview interview) {
        this.interview = interview;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public Boolean getIsManager() {
        return isManager;
    }
    public void setIsManager(Boolean isManager) {
        this.isManager = isManager;
    }
}