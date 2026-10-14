package com.example.demo.repositories;

import com.example.demo.Model.Entrevista;
import com.example.demo.Model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntrevistaRepository extends JpaRepository<Entrevista, Long> {
    Optional<Entrevista> findByCodigo(String codigo);
    List<Entrevista> findAllByOrderByIdDesc();
    List<Entrevista> findByEstado(Estado estado);
    List<Entrevista> findByPostulanteId(Long postulanteId);
    long countByEstado(Estado estado);
}
