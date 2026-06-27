package com.sharedphoto.backend.repository;

import com.sharedphoto.backend.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, UUID> {
    List<Photo> findByEventIdAndIsHiddenFalseOrderByUploadedAtDesc(UUID eventId);
}
