package com.projeto.eap.projeto_eap_joao.service;

import com.projeto.eap.projeto_eap_joao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;



}
