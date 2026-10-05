package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Cargo;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
}
