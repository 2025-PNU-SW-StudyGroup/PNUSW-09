package studyGroup.interviewAI.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import studyGroup.interviewAI.entity.Experience;
import studyGroup.interviewAI.entity.Position;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.service.ExperienceService;
import studyGroup.interviewAI.service.PositionService;
import studyGroup.interviewAI.service.TechStackService;

import java.util.List;

@Component
public class DataInitializer {
    
    private final TechStackService techStackService;
    private final ExperienceService experienceService;
    private final PositionService positionService;

    public DataInitializer(TechStackService techStackService, ExperienceService experienceService, PositionService positionService) {
        this.techStackService = techStackService;
        this.experienceService = experienceService;
        this.positionService = positionService;
    }

    @PostConstruct
    public void initializeData() {
        initTechStacks();
        initExperiences();
        initPositions();
    }

    private void initTechStacks() {
        // 기존 데이터가 있는지 확인
        List<TechStack> existingTechStacks = techStackService.findAll();
        if (!existingTechStacks.isEmpty()) {
            System.out.println("기술스택 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        // 초기 기술스택 데이터 생성
        String[] initialTechStacks = {
            "Java", "Spring Boot", "Spring Framework", "Spring Security", "Spring Data JPA",
            "JavaScript", "TypeScript", "React", "Vue.js", "Angular",
            "Node.js", "Express.js", "Nest.js",
            "Python", "Django", "Flask", "FastAPI",
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle",
            "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD",
            "AWS", "Azure", "Google Cloud Platform",
            "Git", "GitHub", "GitLab", "Bitbucket",
            "HTML", "CSS", "SCSS", "Bootstrap", "Tailwind CSS",
            "JPA", "Hibernate", "MyBatis",
            "Gradle", "Maven", "npm", "Webpack",
            "JUnit", "Mockito", "Jest", "Cypress",
            "Elasticsearch", "Kafka", "RabbitMQ",
            "Linux", "Ubuntu", "CentOS",
            "Nginx", "Apache", "Tomcat"
        };

        for (String techName : initialTechStacks) {
            TechStack techStack = new TechStack();
            techStack.setTitle(techName);
            techStackService.save(techStack);
        }

        System.out.println("✅ 초기 기술스택 데이터 " + initialTechStacks.length + "개가 생성되었습니다.");
    }

    private void initExperiences() {
        // 기존 데이터가 있는지 확인
        List<Experience> existingExperiences = experienceService.findAll();
        if (!existingExperiences.isEmpty()) {
            System.out.println("경험 레벨 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        // 초기 경험 레벨 데이터 생성
        String[] initialExperiences = {
            "1~2년",
            "3~4년", 
            "5~6년",
            "7년 이상"
        };

        for (String expTitle : initialExperiences) {
            Experience experience = new Experience();
            experience.setTitle(expTitle);
            experienceService.save(experience);
        }

        System.out.println("✅ 초기 경험 레벨 데이터 " + initialExperiences.length + "개가 생성되었습니다.");
    }

    private void initPositions() {
        // 기존 데이터가 있는지 확인
        List<Position> existingPositions = positionService.findAll();
        if (!existingPositions.isEmpty()) {
            System.out.println("포지션 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        // 초기 포지션 데이터 생성
        String[] initialPositions = {
            "프론트엔드 개발자",
            "백엔드 개발자", 
            "풀스택 엔지니어",
            "모바일 개발자",
            "DevOps 엔지니어",
            "데이터 엔지니어",
            "UI/UX 디자이너",
            "제품 매니저"
        };

        for (String positionTitle : initialPositions) {
            Position position = new Position();
            position.setTitle(positionTitle);
            positionService.save(position);
        }

        System.out.println("✅ 초기 포지션 데이터 " + initialPositions.length + "개가 생성되었습니다.");
    }
} 