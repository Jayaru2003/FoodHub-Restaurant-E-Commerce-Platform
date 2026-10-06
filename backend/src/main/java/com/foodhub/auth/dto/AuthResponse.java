package com.foodhub.auth.dto;

import com.foodhub.entity.Role;
import com.foodhub.entity.User;

public class AuthResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final Role role;
    private final String message;

    private AuthResponse(User user, String message) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.message = message;
    }

    public static AuthResponse from(User user, String message) {
        return new AuthResponse(user, message);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}
