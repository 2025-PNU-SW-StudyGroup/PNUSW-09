package studyGroup.interviewAI.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = false)
    private Manager manager;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    private LocalDateTime doneAt;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Manager getManager() {
        return manager;
    }
    public void setManager(Manager manager) {
        this.manager = manager;
    }
    public Applicant getApplicant() {
        return applicant;
    }
    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }
    public LocalDateTime getDoneAt() {
        return doneAt;
    }
    public void setDoneAt(LocalDateTime doneAt) {
        this.doneAt = doneAt;
    }
}