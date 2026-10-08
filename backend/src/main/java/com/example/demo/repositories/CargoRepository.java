package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Cargo;

import java.util.List;
import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    Optional<Cargo> findByNombre(String nombre);
    Optional<Cargo> findByNombreIgnoreCase(String nombre);
    List<Cargo> findByFamiliaId(Long familiaId);
}
