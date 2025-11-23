package com.projeto.eap.projeto_eap_joao.repository;

import com.projeto.eap.projeto_eap_joao.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
