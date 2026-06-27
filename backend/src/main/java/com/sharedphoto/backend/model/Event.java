package com.sharedphoto.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    private User host;
    
    @Column(nullable = false, unique = true, length = 6)
    private String joinCode;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
