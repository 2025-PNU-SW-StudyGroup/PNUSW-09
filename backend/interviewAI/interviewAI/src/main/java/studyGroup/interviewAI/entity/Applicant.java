package studyGroup.interviewAI.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Applicant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String location;
    private String resumeFilePath;
    private String githubUrl;
    private String portfolioUrl;
    private String portfolioFilePath;
    private LocalDateTime applyAt;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @ManyToOne
    @JoinColumn(name = "experience_id", nullable = false)
    private Experience experience;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getResumeFilePath() {
        return resumeFilePath;
    }
    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
    }
    public String getGithubUrl() {
        return githubUrl;
    }
    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }
    public String getPortfolioUrl() {
        return portfolioUrl;
    }
    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }
    public String getPortfolioFilePath() {
        return portfolioFilePath;
    }
    public void setPortfolioFilePath(String portfolioFilePath) {
        this.portfolioFilePath = portfolioFilePath;
    }
    public LocalDateTime getApplyAt() {
        return applyAt;
    }
    public void setApplyAt(LocalDateTime applyAt) {
        this.applyAt = applyAt;
    }
    public Position getPosition() {
        return position;
    }
    public void setPosition(Position position) {
        this.position = position;
    }
    public Experience getExperience() {
        return experience;
    }
    public void setExperience(Experience experience) {
        this.experience = experience;
    }
}