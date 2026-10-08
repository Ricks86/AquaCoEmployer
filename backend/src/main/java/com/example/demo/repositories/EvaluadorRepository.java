package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Evaluador;

import java.util.Optional;

@Repository
public interface EvaluadorRepository extends JpaRepository<Evaluador, Long> {
    Optional<Evaluador> findByNombre(String nombre);
    Optional<Evaluador> findByNombreIgnoreCase(String nombre);
}
