package com.projeto.eap.projeto_eap_joao.dto;

import com.projeto.eap.projeto_eap_joao.domain.Technology;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommandRequest(
    @NotBlank String title,
    @NotNull Technology technology,
    @NotBlank String content
) {}
