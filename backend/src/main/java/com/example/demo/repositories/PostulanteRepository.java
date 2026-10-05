package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Estado;
import com.example.demo.Model.Postulante;

import java.util.List;

@Repository
public interface PostulanteRepository extends JpaRepository<Postulante, Long> {
    List<Postulante> findByEstado(Estado estado);
}
