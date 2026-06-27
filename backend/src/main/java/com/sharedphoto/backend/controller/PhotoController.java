package com.sharedphoto.backend.controller;

import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.model.Photo;
import com.sharedphoto.backend.model.User;
import com.sharedphoto.backend.repository.EventRepository;
import com.sharedphoto.backend.repository.PhotoRepository;
import com.sharedphoto.backend.repository.UserRepository;
import com.sharedphoto.backend.security.JwtUtil;
import com.sharedphoto.backend.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final StorageService storageService;
    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<Photo> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("eventId") UUID eventId,
            HttpServletRequest request) {
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Extract uploader from JWT token
        String authHeader = request.getHeader("Authorization");
        User uploader;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String phoneNumber = jwtUtil.getPhoneNumberFromToken(token);
            uploader = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new RuntimeException("User not found for token"));
        } else {
            throw new RuntimeException("Authorization token required for upload");
        }

        // 1. Store the file locally (this will be AWS S3 later)
        String fileUrl = storageService.store(file, eventId);

        // 2. Save photo metadata to database
        Photo photo = new Photo();
        photo.setEvent(event);
        photo.setUploader(uploader);
        photo.setStorageUrl(fileUrl);
        photo = photoRepository.save(photo);

        return ResponseEntity.ok(photo);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Photo>> getPhotosForEvent(@PathVariable UUID eventId) {
        List<Photo> photos = photoRepository.findByEventIdAndIsHiddenFalseOrderByUploadedAtDesc(eventId);
        return ResponseEntity.ok(photos);
    }
}

