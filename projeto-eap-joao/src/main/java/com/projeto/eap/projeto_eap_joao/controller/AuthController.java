package com.projeto.eap.projeto_eap_joao.controller;

import com.projeto.eap.projeto_eap_joao.dto.LoginRequest;
import com.projeto.eap.projeto_eap_joao.dto.LoginResponse;
import com.projeto.eap.projeto_eap_joao.dto.RegisterRequest;
import com.projeto.eap.projeto_eap_joao.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") @RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest dto) {
       authService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest dto) {
        LoginResponse response = authService.loginUser(dto);
        return ResponseEntity.ok(response);
    }
}