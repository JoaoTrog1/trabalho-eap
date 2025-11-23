package com.projeto.eap.projeto_eap_joao.repository;

import com.projeto.eap.projeto_eap_joao.domain.Command;
import com.projeto.eap.projeto_eap_joao.domain.Technology;
import com.projeto.eap.projeto_eap_joao.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {

    @Query("SELECT c FROM Command c WHERE c.user = :user " +
           "AND (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.content) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:technology IS NULL OR c.technology = :technology)")
    Page<Command> findByUserWithFilters(@Param("user") User user,
                                        @Param("search") String search,
                                        @Param("technology") Technology technology,
                                        Pageable pageable);
}
