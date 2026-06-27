package com.sharedphoto.backend.service;

import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.model.EventParticipant;
import com.sharedphoto.backend.model.User;
import com.sharedphoto.backend.repository.EventParticipantRepository;
import com.sharedphoto.backend.repository.EventRepository;
import com.sharedphoto.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventParticipantRepository participantRepository;

    @Transactional
    public Event createEvent(String eventName, String hostPhone, String hostName) {
        // 1. Get or Create User
        User host = userRepository.findByPhoneNumber(hostPhone)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhoneNumber(hostPhone);
                    newUser.setName(hostName);
                    return userRepository.save(newUser);
                });

        // 2. Create Event
        Event event = new Event();
        event.setName(eventName);
        event.setHost(host);
        event.setJoinCode(generateJoinCode());
        event = eventRepository.save(event);

        // 3. Add Host as Participant
        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(host);
        participant.setRole(EventParticipant.Role.HOST);
        participantRepository.save(participant);

        return event;
    }

    @Transactional
    public Event joinEvent(String joinCode, String guestPhone, String guestName) {
        Event event = eventRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new RuntimeException("Invalid Join Code"));

        User guest = userRepository.findByPhoneNumber(guestPhone)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhoneNumber(guestPhone);
                    newUser.setName(guestName);
                    return userRepository.save(newUser);
                });
        
        Optional<EventParticipant> existing = participantRepository.findByEventIdAndUserId(event.getId(), guest.getId());
        if (existing.isEmpty()) {
            EventParticipant participant = new EventParticipant();
            participant.setEvent(event);
            participant.setUser(guest);
            participant.setRole(EventParticipant.Role.GUEST);
            participantRepository.save(participant);
        }

        return event;
    }

    private String generateJoinCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
