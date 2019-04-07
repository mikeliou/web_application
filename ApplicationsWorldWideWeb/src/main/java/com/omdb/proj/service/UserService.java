package com.omdb.proj.service;

import com.omdb.proj.controller.resource.LoginResource;
import com.omdb.proj.controller.resource.SignUpResource;
import com.omdb.proj.controller.resource.UserActionsResponse;
import com.omdb.proj.domain.User;
import com.omdb.proj.domain.UserRepository;
import com.omdb.proj.service.utils.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserActionsResponse login(LoginResource resource) {
        if (StringUtils.isEmpty(resource.getEmail()) || StringUtils.isEmpty(resource.getPassword())) {
            return UserActionsResponse.error("Form is invalid. Some information is missing");
        }

        // check if user exists
        // find user by username and password -> if exists return the userkey, if not return error message
        if (userRepository.existsByEmail(resource.getEmail())) {
            String hashedPassword = PasswordUtil.HASH(resource.getPassword());

            return userRepository.findByEmailAndPassword(resource.getEmail(), hashedPassword)
                    .map(u -> UserActionsResponse.ok(u.getUserkey()))
                    .orElse(UserActionsResponse.error("User credentials are not valid"));
        } else {
            return UserActionsResponse.error("User does not exist");
        }
    }

    public UserActionsResponse signup(SignUpResource resource) {
        // sign up validations
        if (!isFormValid(resource)) {
            return UserActionsResponse.error("Form is invalid. Some information is missing");
        }

        if (userRepository.existsByEmail(resource.getEmail())) {
            return UserActionsResponse.error("Email already exists");
        }

        if (!resource.getPassword().equals(resource.getConfirmPassword())) {
            return UserActionsResponse.error("Password and ConfirmPassword must be the same");
        }

        if (resource.getPassword().contains(resource.getEmail())) {
            return UserActionsResponse.error("Password must not contain the email");
        }

        // persist new user
        UUID userkey = UUID.randomUUID();
        String hashedPassword = PasswordUtil.HASH(resource.getPassword());

        User user = new User(resource.getEmail(), hashedPassword, resource.getFirstname(), resource.getLastname(), userkey);
        userRepository.save(user);

        return UserActionsResponse.ok(userkey);
    }

    private boolean isFormValid(SignUpResource resource) {
        return !(StringUtils.isEmpty(resource.getFirstname())
                || StringUtils.isEmpty(resource.getLastname())
                || StringUtils.isEmpty(resource.getEmail())
                || StringUtils.isEmpty(resource.getPassword())
                || StringUtils.isEmpty(resource.getConfirmPassword()));
    }

}
