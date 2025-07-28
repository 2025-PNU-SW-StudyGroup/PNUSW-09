package studyGroup.interviewAI.entity;

import jakarta.persistence.*;

@Entity
public class PreReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne
    @JoinColumn(name = "work_history_id")
    private WorkHistory workHistory;

    @ManyToOne
    @JoinColumn(name = "project_history_id")
    private ProjectHistory projectHistory;

    private String description;

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
    public WorkHistory getWorkHistory() {
        return workHistory;
    }
    public void setWorkHistory(WorkHistory workHistory) {
        this.workHistory = workHistory;
    }
    public ProjectHistory getProjectHistory() {
        return projectHistory;
    }
    public void setProjectHistory(ProjectHistory projectHistory) {
        this.projectHistory = projectHistory;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}