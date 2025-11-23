package com.projeto.eap.projeto_eap_joao.exceptions;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiErrorException extends RuntimeException {

    private final HttpStatus status;

    public ApiErrorException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

}
