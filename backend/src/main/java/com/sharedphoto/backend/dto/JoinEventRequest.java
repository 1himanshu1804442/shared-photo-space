package com.sharedphoto.backend.dto;

import lombok.Data;

@Data
public class JoinEventRequest {
    private String phoneNumber; // Mock auth for guest
    private String name;
}
