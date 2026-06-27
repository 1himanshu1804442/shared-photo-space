package com.sharedphoto.backend.controller;

import com.sharedphoto.backend.dto.CreateEventRequest;
import com.sharedphoto.backend.dto.JoinEventRequest;
import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody CreateEventRequest request) {
        Event event = eventService.createEvent(
                request.getName(), 
                request.getHostPhoneNumber(), 
                request.getHostName()
        );
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{joinCode}/join")
    public ResponseEntity<Event> joinEvent(@PathVariable String joinCode, @RequestBody JoinEventRequest request) {
        Event event = eventService.joinEvent(
                joinCode, 
                request.getPhoneNumber(), 
                request.getName()
        );
        return ResponseEntity.ok(event);
    }
}
