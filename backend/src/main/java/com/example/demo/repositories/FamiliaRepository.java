package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Familia;

import java.util.Optional;

@Repository
public interface FamiliaRepository extends JpaRepository<Familia, Long> {
    Optional<Familia> findByNombre(String nombre);
    Optional<Familia> findByNombreIgnoreCase(String nombre);
}
