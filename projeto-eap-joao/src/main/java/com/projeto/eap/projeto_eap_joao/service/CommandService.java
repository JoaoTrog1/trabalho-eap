package com.projeto.eap.projeto_eap_joao.service;

import com.projeto.eap.projeto_eap_joao.domain.Command;
import com.projeto.eap.projeto_eap_joao.domain.Technology;
import com.projeto.eap.projeto_eap_joao.domain.User;
import com.projeto.eap.projeto_eap_joao.dto.CommandRequest;
import com.projeto.eap.projeto_eap_joao.dto.CommandResponse;
import com.projeto.eap.projeto_eap_joao.repository.CommandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandService {

    private final CommandRepository commandRepository;

    public Page<CommandResponse> getCommands(User user, String search, Technology technology, Pageable pageable) {
        Page<Command> commands = commandRepository.findByUserWithFilters(user, search, technology, pageable);
        return commands.map(this::toResponse);
    }

    public CommandResponse createCommand(User user, CommandRequest request) {
        Command command = new Command();
        command.setTitle(request.title());
        command.setTechnology(request.technology());
        command.setContent(request.content());
        command.setUser(user);
        Command saved = commandRepository.save(command);
        return toResponse(saved);
    }

    public CommandResponse updateCommand(User user, Long id, CommandRequest request) {
        Command command = commandRepository.findById(id)
                .filter(c -> c.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Command not found or not owned by user"));
        command.setTitle(request.title());
        command.setTechnology(request.technology());
        command.setContent(request.content());
        Command saved = commandRepository.save(command);
        return toResponse(saved);
    }

    public CommandResponse getCommand(User user, Long id) {
        Command command = commandRepository.findById(id)
                .filter(c -> c.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Command not found or not owned by user"));
        return toResponse(command);
    }

    public void deleteCommand(User user, Long id) {
        Command command = commandRepository.findById(id)
                .filter(c -> c.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Command not found or not owned by user"));
        commandRepository.delete(command);
    }

    private CommandResponse toResponse(Command command) {
        return new CommandResponse(
                command.getId(),
                command.getTitle(),
                command.getTechnology(),
                command.getContent(),
                command.getCreatedAt()
        );
    }
}
