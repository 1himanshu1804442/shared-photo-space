package com.sharedphoto.backend.controller;

import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.model.Photo;
import com.sharedphoto.backend.model.User;
import com.sharedphoto.backend.repository.EventRepository;
import com.sharedphoto.backend.repository.PhotoRepository;
import com.sharedphoto.backend.repository.UserRepository;
import com.sharedphoto.backend.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/upload")
    public ResponseEntity<Photo> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("eventId") UUID eventId,
            @RequestParam("uploaderId") UUID uploaderId) {
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
