package com.omdb.proj.controller;

import com.omdb.proj.controller.resource.LoginResource;
import com.omdb.proj.controller.resource.SignUpResource;
import com.omdb.proj.controller.resource.UserActionsResponse;
import com.omdb.proj.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("login")
    public ResponseEntity<UserActionsResponse> login(@RequestBody LoginResource resource) {
        UserActionsResponse response = userService.login(resource);

        if (response.isHasError()){
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("signup")
    public ResponseEntity<UserActionsResponse> signup(@RequestBody SignUpResource resource) {
        UserActionsResponse response = userService.signup(resource);

        if (response.isHasError()){
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

}
