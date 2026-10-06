package com.foodhub.config;

import com.foodhub.entity.Role;
import com.foodhub.entity.User;
import com.foodhub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Component
public class AdminAccountInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public AdminAccountInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword,
            @Value("${app.admin.name}") String adminName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail.trim().toLowerCase(Locale.ROOT);
        this.adminPassword = adminPassword;
        this.adminName = adminName.trim();
    }

    @Override
    @Transactional
    public void run(String... args) {
        User admin = userRepository.findByEmail(adminEmail).orElseGet(User::new);
        boolean isNew = admin.getId() == null;

        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        userRepository.saveAndFlush(admin);

        logger.info("{} configured admin account for {}", isNew ? "Created" : "Updated", adminEmail);
    }
}
