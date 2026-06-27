package com.sharedphoto.backend.dto;

import lombok.Data;

@Data
public class CreateEventRequest {
    private String name;
    private String hostPhoneNumber; // For MVP, we pass phone to mock auth
    private String hostName;
}
