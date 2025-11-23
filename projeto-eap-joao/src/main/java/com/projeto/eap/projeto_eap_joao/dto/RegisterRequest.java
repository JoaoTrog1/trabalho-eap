package com.projeto.eap.projeto_eap_joao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Size(min = 2, max = 100, message = "O nome de usuário deve conter entre 2 e 100 caracteres")
        @NotBlank(message = "Informe seu nome de usuário")
        String username,
        @NotBlank(message = "Informe sua senha")
        @Size(min = 2, max = 100, message = "A senha deve conter entre 6 e 255 caracteres")
        String password
) {}