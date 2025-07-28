package studyGroup.interviewAI.entity;

import jakarta.persistence.*;

@Entity
public class ProjectHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    private String title;
    private String description;

    @ManyToOne
    @JoinColumn(name = "tech_stack_id", nullable = false)
    private TechStack techStack;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Applicant getApplicant() {
        return applicant;
    }
    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public TechStack getTechStack() {
        return techStack;
    }
    public void setTechStack(TechStack techStack) {
        this.techStack = techStack;
    }
}