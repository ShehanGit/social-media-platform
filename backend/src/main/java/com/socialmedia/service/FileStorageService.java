package com.socialmedia.service;

import com.socialmedia.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    private final StorageProperties storageProperties;

    public String storeFile(MultipartFile file) {
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        Path targetLocation = getStoragePath().resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path targetLocation = getStoragePath().resolve(fileName);
            Files.deleteIfExists(targetLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file " + fileName, ex);
        }
    }

    private Path getStoragePath() {
        Path storagePath = Paths.get(storageProperties.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(storagePath);
            return storagePath;
        } catch (IOException ex) {
            throw new FileStorageException("Could not create storage directory", ex);
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = StringUtils.getFilenameExtension(originalFileName);
        return UUID.randomUUID() + "." + extension;
    }
}

