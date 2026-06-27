package com.sharedphoto.backend.controller;

import com.sharedphoto.backend.dto.CreateEventRequest;
import com.sharedphoto.backend.dto.JoinEventRequest;
import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharedphoto.backend.dto.AuthResponse;
import com.sharedphoto.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<AuthResponse> createEvent(@RequestBody CreateEventRequest request) {
        Event event = eventService.createEvent(
                request.getName(), 
                request.getHostPhoneNumber(), 
                request.getHostName()
        );
        String token = jwtUtil.generateToken(request.getHostPhoneNumber());
        return ResponseEntity.ok(new AuthResponse(token, event));
    }

    @PostMapping("/{joinCode}/join")
    public ResponseEntity<AuthResponse> joinEvent(@PathVariable String joinCode, @RequestBody JoinEventRequest request) {
        Event event = eventService.joinEvent(
                joinCode, 
                request.getPhoneNumber(), 
                request.getName()
        );
        String token = jwtUtil.generateToken(request.getPhoneNumber());
        return ResponseEntity.ok(new AuthResponse(token, event));
    }
}
