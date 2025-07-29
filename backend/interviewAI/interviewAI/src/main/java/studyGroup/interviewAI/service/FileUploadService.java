package studyGroup.interviewAI.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import studyGroup.interviewAI.entity.FileUpload;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class FileUploadService {

    public String uploadResumeFile(MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        String uploadDir = "uploads/resumes/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // 파일명 생성 (중복 방지를 위해 타임스탬프 추가)
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String newFileName = "resume_" + timestamp + fileExtension;
        
        // 파일 저장
        Path filePath = uploadPath.resolve(newFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // 파일 경로 반환
        return uploadDir + newFileName;
    }

    public String uploadPortfolioFile(MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        String uploadDir = "uploads/portfolios/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // 파일명 생성 (중복 방지를 위해 타임스탬프 추가)
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String newFileName = "portfolio_" + timestamp + fileExtension;
        
        // 파일 저장
        Path filePath = uploadPath.resolve(newFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // 파일 경로 반환
        return uploadDir + newFileName;
    }
    
    // 파일 확장자 추출
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex);
    }
} 