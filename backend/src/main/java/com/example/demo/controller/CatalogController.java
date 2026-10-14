package com.example.demo.controller;

import com.example.demo.Model.Evaluador;
import com.example.demo.Model.Familia;
import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.repositories.EvaluadorRepository;
import com.example.demo.repositories.FamiliaRepository;
import com.example.demo.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CatalogController {

    private final FamiliaRepository familiaRepository;
    private final EvaluadorRepository evaluadorRepository;
    private final SolicitudService solicitudService;

    @GetMapping("/familias")
    public ResponseEntity<List<Familia>> listarFamilias() {
        return ResponseEntity.ok(familiaRepository.findAll());
    }

    @GetMapping("/evaluadores")
    public ResponseEntity<List<Evaluador>> listarEvaluadores() {
        return ResponseEntity.ok(evaluadorRepository.findAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> stats() {
        return ResponseEntity.ok(solicitudService.obtenerStats());
    }
}
