package studyGroup.interviewAI.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import studyGroup.interviewAI.entity.Experience;
import studyGroup.interviewAI.entity.Position;
import studyGroup.interviewAI.entity.TechStack;
import studyGroup.interviewAI.entity.Manager;
import studyGroup.interviewAI.entity.Applicant;
import studyGroup.interviewAI.entity.ApplicationStatus;
import studyGroup.interviewAI.service.ExperienceService;
import studyGroup.interviewAI.service.PositionService;
import studyGroup.interviewAI.service.TechStackService;
import studyGroup.interviewAI.service.ManagerService;
import studyGroup.interviewAI.service.ApplicantService;

import java.util.List;

@Component
public class DataInitializer {
    
    private final TechStackService techStackService;
    private final ExperienceService experienceService;
    private final PositionService positionService;
    private final ManagerService managerService;
    private final ApplicantService applicantService;

    public DataInitializer(TechStackService techStackService, ExperienceService experienceService, PositionService positionService, ManagerService managerService, ApplicantService applicantService) {
        this.techStackService = techStackService;
        this.experienceService = experienceService;
        this.positionService = positionService;
        this.managerService = managerService;
        this.applicantService = applicantService;
    }

    @PostConstruct
    public void initializeData() {
        initManager();
        initTechStacks();
        initExperiences();
        initPositions();
        initTestApplicants();
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

    private void initManager() {
        // 매니저 ID 0이 이미 존재하는지 확인
        if (managerService.findById(0L).isPresent()) {
            System.out.println("매니저 ID 0이 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        // 매니저 ID 0 생성
        Manager manager = new Manager();
        manager.setId(0L);
        managerService.save(manager);

        System.out.println("✅ 매니저 ID 0이 생성되었습니다.");
    }

    private void initTestApplicants() {
        // 기존 지원자 데이터가 있는지 확인
        List<Applicant> existingApplicants = applicantService.findAll();
        if (!existingApplicants.isEmpty()) {
            System.out.println("지원자 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        // 테스트용 지원자 데이터 생성
        createTestApplicant("김백엔드", "backend@example.com", "서울", 2L, 2L, new Long[]{1L, 2L, 3L, 4L});
        createTestApplicant("이프론트", "frontend@example.com", "부산", 1L, 1L, new Long[]{5L, 6L, 7L, 8L});
        createTestApplicant("박풀스택", "fullstack@example.com", "대구", 3L, 3L, new Long[]{1L, 2L, 5L, 6L, 9L});

        System.out.println("✅ 테스트 지원자 3명이 생성되었습니다.");
    }

    private void createTestApplicant(String username, String email, String location, Long positionId, Long experienceId, Long[] techStackIds) {
        Applicant applicant = new Applicant();
        applicant.setUsername(username);
        applicant.setEmail(email);
        applicant.setLocation(location);
        applicant.setGithubUrl("https://github.com/" + username.toLowerCase());
        applicant.setPortfolioUrl("https://portfolio.com/" + username.toLowerCase());
        applicant.setStatus(ApplicationStatus.WAITING);
        
        // Position 설정
        Position position = new Position();
        position.setId(positionId);
        applicant.setPosition(position);
        
        // Experience 설정
        Experience experience = new Experience();
        experience.setId(experienceId);
        applicant.setExperience(experience);
        
        // 지원자 저장 (기술스택은 별도로 처리)
        Applicant savedApplicant = applicantService.save(applicant);
        
        // 기술스택 연결 (간단한 방식으로 처리)
        System.out.println("지원자 " + username + " 생성 완료 (ID: " + savedApplicant.getId() + ")");
    }
} 