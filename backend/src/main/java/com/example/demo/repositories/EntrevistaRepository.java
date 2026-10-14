package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Entrevista;

import java.util.List;

@Repository
public interface EntrevistaRepository extends JpaRepository<Entrevista, Long> {
    List<Entrevista> findAllByOrderByIdDesc();
}
