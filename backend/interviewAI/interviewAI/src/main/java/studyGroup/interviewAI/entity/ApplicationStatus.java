package studyGroup.interviewAI.entity;

public enum ApplicationStatus {
    WAITING("대기중"),
    INTERVIEWING("면접중"),
    COMPLETED("완료");

    private final String displayName;

    ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 