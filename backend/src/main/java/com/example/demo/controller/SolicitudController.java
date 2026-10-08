package com.example.demo.controller;

import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.dto.EvaluacionUpdateRequest;
import com.example.demo.dto.NuevaSolicitudRequest;
import com.example.demo.dto.SolicitudDTO;
import com.example.demo.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SolicitudController {

    private final SolicitudService solicitudService;

    @GetMapping
    public ResponseEntity<List<SolicitudDTO>> listarTodas() {
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> obtenerStats() {
        return ResponseEntity.ok(solicitudService.obtenerStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudDTO> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(solicitudService.obtenerPorIdOCodigo(id));
    }

    @PostMapping
    public ResponseEntity<SolicitudDTO> crearSolicitud(@RequestBody NuevaSolicitudRequest request) {
        SolicitudDTO creada = solicitudService.crearSolicitud(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudDTO> actualizarEvaluacion(
            @PathVariable String id,
            @RequestBody EvaluacionUpdateRequest request
    ) {
        SolicitudDTO actualizada = solicitudService.actualizarEvaluacion(id, request);
        return ResponseEntity.ok(actualizada);
    }
}
