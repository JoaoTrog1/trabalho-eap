package com.projeto.eap.projeto_eap_joao.dto;

import com.projeto.eap.projeto_eap_joao.domain.Technology;

import java.time.LocalDateTime;

public record CommandResponse(
    Long id,
    String title,
    Technology technology,
    String content,
    LocalDateTime createdAt
) {}
