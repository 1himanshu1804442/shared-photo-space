package com.sharedphoto.backend.repository;

import com.sharedphoto.backend.model.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, UUID> {
    List<EventParticipant> findByEventId(UUID eventId);
    Optional<EventParticipant> findByEventIdAndUserId(UUID eventId, UUID userId);
}
