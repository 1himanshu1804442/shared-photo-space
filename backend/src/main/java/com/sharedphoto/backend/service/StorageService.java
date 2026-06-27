package com.sharedphoto.backend.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

public interface StorageService {
    /**
     * Stores a file and returns the public URL to access it.
     */
    String store(MultipartFile file, UUID eventId);
}
