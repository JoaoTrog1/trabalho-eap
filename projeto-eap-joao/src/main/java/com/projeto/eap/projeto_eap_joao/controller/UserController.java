package com.projeto.eap.projeto_eap_joao.controller;

import com.projeto.eap.projeto_eap_joao.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/users") @RequiredArgsConstructor
public class UserController {

    private final UserService userService;

}
