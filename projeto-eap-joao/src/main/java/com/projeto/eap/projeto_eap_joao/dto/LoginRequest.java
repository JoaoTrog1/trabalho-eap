package com.projeto.eap.projeto_eap_joao.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Informe seu nome de usuário")
        String username,
        @NotBlank(message = "Informe sua senha")
        String password
) {}
