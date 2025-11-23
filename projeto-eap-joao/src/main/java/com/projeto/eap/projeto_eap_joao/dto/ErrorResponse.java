package com.projeto.eap.projeto_eap_joao.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class ErrorResponse {

    private int statusCode;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private List<FieldErrorResponse> fieldErrors;

    public ErrorResponse(int statusCode, String error, String message) {
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int statusCode, String error, String message, List<FieldErrorResponse> fieldErrors) {
        this(statusCode, error, message);
        this.fieldErrors = fieldErrors;
    }
}
