package studyGroup.interviewAI.entity;

import jakarta.persistence.*;

@Entity
public class ApplicantTech {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne
    @JoinColumn(name = "tech_stack_id")
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
    public TechStack getTechStack() {
        return techStack;
    }
    public void setTechStack(TechStack techStack) {
        this.techStack = techStack;
    }
}