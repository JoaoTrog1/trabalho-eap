package com.projeto.eap.projeto_eap_joao.service;

import com.projeto.eap.projeto_eap_joao.domain.User;
import com.projeto.eap.projeto_eap_joao.dto.LoginRequest;
import com.projeto.eap.projeto_eap_joao.dto.LoginResponse;
import com.projeto.eap.projeto_eap_joao.dto.RegisterRequest;
import com.projeto.eap.projeto_eap_joao.exceptions.ApiErrorException;
import com.projeto.eap.projeto_eap_joao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public void registerUser(RegisterRequest data) {
        if(userRepository.existsByUsername(data.username())){
            throw new ApiErrorException(HttpStatus.BAD_REQUEST, "Nome de usuário já está em uso.");
        }
        User newUser = new User();
        newUser.setUsername(data.username());
        newUser.setPassword(passwordEncoder.encode(data.password()));
        userRepository.save(newUser);
    }

    public LoginResponse loginUser(LoginRequest dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.username(), dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var user = userRepository.findByUsername(dto.username()).orElseThrow();
        var token = tokenService.generateToken(user);

        return new LoginResponse(token);
    }
}
