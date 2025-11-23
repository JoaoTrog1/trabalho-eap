package com.projeto.eap.projeto_eap_joao.controller;

import com.projeto.eap.projeto_eap_joao.domain.Technology;
import com.projeto.eap.projeto_eap_joao.domain.User;
import com.projeto.eap.projeto_eap_joao.dto.CommandRequest;
import com.projeto.eap.projeto_eap_joao.dto.CommandResponse;
import com.projeto.eap.projeto_eap_joao.repository.UserRepository;
import com.projeto.eap.projeto_eap_joao.service.CommandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/commands")
@RequiredArgsConstructor
public class CommandController {

    private final CommandService commandService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<CommandResponse>> getCommands(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String technology
    ) {
        User user = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        String normalizedSearch = (StringUtils.hasText(search)) ? search : null;
        Technology tech = null;
        if (technology != null && !technology.isBlank()) {
            String trimmed = technology.trim().toUpperCase();
            try {
                tech = Technology.valueOf(trimmed);
            } catch (IllegalArgumentException e) {
                String allowed = Arrays.toString(Technology.values());
                throw new RuntimeException("Valor de technology inválido: '" + technology + "'. Valores permitidos: " + allowed);
            }
        }
        Page<CommandResponse> commands = commandService.getCommands(user, normalizedSearch, tech, pageable);
        return ResponseEntity.ok(commands);
    }

    @PostMapping
    public ResponseEntity<CommandResponse> createCommand(
            Authentication authentication,
            @RequestBody @Valid CommandRequest request
    ) {
        User user = getCurrentUser(authentication);
        CommandResponse response = commandService.createCommand(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommandResponse> updateCommand(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody @Valid CommandRequest request) {

        User user = getCurrentUser(authentication);
        CommandResponse response = commandService.updateCommand(user, id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandResponse> getCommandById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = getCurrentUser(authentication);
        CommandResponse response = commandService.getCommand(user, id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommand(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = getCurrentUser(authentication);
        commandService.deleteCommand(user, id);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Usuário não autenticado");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
