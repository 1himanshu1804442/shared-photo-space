package com.sharedphoto.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharedphoto.backend.dto.CreateEventRequest;
import com.sharedphoto.backend.dto.JoinEventRequest;
import com.sharedphoto.backend.model.Event;
import com.sharedphoto.backend.model.User;
import com.sharedphoto.backend.security.JwtUtil;
import com.sharedphoto.backend.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @MockBean
    private JwtUtil jwtUtil;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testCreateEvent() throws Exception {
        CreateEventRequest request = new CreateEventRequest();
        request.setName("Goa Trip");
        request.setHostName("John Doe");
        request.setHostPhoneNumber("1234567890");

        Event mockEvent = new Event();
        mockEvent.setId(UUID.randomUUID());
        mockEvent.setName("Goa Trip");
        mockEvent.setJoinCode("123456");
        
        Mockito.when(eventService.createEvent(anyString(), anyString(), anyString())).thenReturn(mockEvent);
        Mockito.when(jwtUtil.generateToken(anyString())).thenReturn("mock-jwt-token");

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.event.name").value("Goa Trip"))
                .andExpect(jsonPath("$.event.joinCode").value("123456"));
    }

    @Test
    public void testJoinEvent() throws Exception {
        JoinEventRequest request = new JoinEventRequest();
        request.setName("Jane Doe");
        request.setPhoneNumber("0987654321");

        Event mockEvent = new Event();
        mockEvent.setId(UUID.randomUUID());
        mockEvent.setName("Goa Trip");
        mockEvent.setJoinCode("123456");

        Mockito.when(eventService.joinEvent(anyString(), anyString(), anyString())).thenReturn(mockEvent);
        Mockito.when(jwtUtil.generateToken(anyString())).thenReturn("mock-jwt-token-guest");

        mockMvc.perform(post("/api/events/123456/join")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token-guest"))
                .andExpect(jsonPath("$.event.joinCode").value("123456"));
    }
}
