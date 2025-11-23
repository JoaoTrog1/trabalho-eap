package com.projeto.eap.projeto_eap_joao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class FieldErrorResponse {
    private String field;
    private String message;
}

