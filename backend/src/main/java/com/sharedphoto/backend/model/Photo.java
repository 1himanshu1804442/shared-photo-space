package com.sharedphoto.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Data
@NoArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @Column(nullable = false)
    private String storageUrl;

    @Column(nullable = false)
    private boolean isHidden = false;
    
    private String aiTags; // JSON or comma-separated for now
    
    private Double locationLat;
    private Double locationLong;

    @Column(updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    private LocalDateTime capturedAt;
}
