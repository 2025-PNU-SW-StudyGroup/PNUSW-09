package studyGroup.interviewAI.entity;

import jakarta.persistence.*;

@Entity
public class Manager {
    @Id
    private Long id;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}