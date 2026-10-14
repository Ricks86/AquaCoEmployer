package com.example.demo.repositories;

import com.example.demo.Model.Estado;
import com.example.demo.Model.Postulante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulanteRepository extends JpaRepository<Postulante, Long> {
    List<Postulante> findByEstado(Estado estado);
    Optional<Postulante> findByEmail(String email);
    List<Postulante> findAllByOrderByIdDesc();
}
