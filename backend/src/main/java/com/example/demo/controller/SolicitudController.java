package com.example.demo.controller;

import com.example.demo.Model.Entrevista;
import com.example.demo.Model.Evaluador;
import com.example.demo.Model.Postulante;
import com.example.demo.dto.ActualizarEvaluacionRequest;
import com.example.demo.dto.CrearSolicitudRequest;
import com.example.demo.dto.SolicitudDTO;
import com.example.demo.repositories.EntrevistaRepository;
import com.example.demo.repositories.EvaluadorRepository;
import com.example.demo.repositories.PostulanteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class SolicitudController {

    private final EntrevistaRepository entrevistaRepository;
    private final PostulanteRepository postulanteRepository;
    private final EvaluadorRepository evaluadorRepository;

    @GetMapping
    public ResponseEntity<List<SolicitudDTO>> getAllSolicitudes() {
        List<Entrevista> entrevistas = entrevistaRepository.findAllByOrderByIdDesc();
        List<SolicitudDTO> dtos = entrevistas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<SolicitudDTO> createSolicitud(@RequestBody CrearSolicitudRequest req) {
        log.info("Creando solicitud para postulante ID: {}", req.getPostulanteId());

        Postulante postulante = postulanteRepository.findById(req.getPostulanteId())
                .orElseThrow(() -> new IllegalArgumentException("Postulante no encontrado"));

        String evaluadorNombre = req.getResponsable() != null && !req.getResponsable().isBlank()
                ? req.getResponsable()
                : "Psic. Valeria Lagos";

        Evaluador evaluador = evaluadorRepository.findByNombreIgnoreCase(evaluadorNombre)
                .orElseGet(() -> {
                    Evaluador ev = new Evaluador();
                    ev.setNombre(evaluadorNombre);
                    return evaluadorRepository.save(ev);
                });

        Entrevista entrevista = new Entrevista();
        entrevista.setPostulante(postulante);
        entrevista.setEvaluador(evaluador);
        entrevista.setFecha(LocalDateTime.now());
        entrevista.setEstado("Pendiente");
        entrevista.setComentarios(req.getObservaciones());

        Entrevista guardada = entrevistaRepository.save(entrevista);
        log.info("Solicitud guardada con ID {} en Oracle DB", guardada.getId());

        return ResponseEntity.ok(toDTO(guardada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudDTO> updateEvaluacion(
            @PathVariable String id,
            @RequestBody ActualizarEvaluacionRequest req) {

        Long numericId = parseId(id);
        log.info("Actualizando evaluación de solicitud ID: {}", numericId);

        Entrevista entrevista = entrevistaRepository.findById(numericId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));

        if (req.getEstado() != null) {
            entrevista.setEstado(req.getEstado());
        }
        if (req.getFechaEvaluacion() != null) {
            entrevista.setFechaEvaluacion(req.getFechaEvaluacion());
        }
        if (req.getComentarios() != null) {
            entrevista.setComentarios(req.getComentarios());
        }
        if (req.getCriterioCompetencias() != null) {
            entrevista.setCriterioCompetencias(req.getCriterioCompetencias());
        }
        if (req.getCriterioZulliger() != null) {
            entrevista.setCriterioZulliger(req.getCriterioZulliger());
        }
        if (req.getCriterioReferencias() != null) {
            entrevista.setCriterioReferencias(req.getCriterioReferencias());
        }
        if (req.getCriterioFitCultural() != null) {
            entrevista.setCriterioFitCultural(req.getCriterioFitCultural());
        }

        Entrevista actualizada = entrevistaRepository.save(entrevista);
        return ResponseEntity.ok(toDTO(actualizada));
    }

    private Long parseId(String idStr) {
        if (idStr.toUpperCase().startsWith("SOL-")) {
            return Long.parseLong(idStr.substring(4));
        }
        return Long.parseLong(idStr);
    }

    private SolicitudDTO toDTO(Entrevista e) {
        Postulante p = e.getPostulante();
        return SolicitudDTO.builder()
                .id("SOL-" + e.getId())
                .postulanteId(p != null ? String.valueOf(p.getId()) : "")
                .nombre(p != null ? p.getNombre() : "")
                .cargo(p != null && p.getCargo() != null ? p.getCargo().getNombre() : "")
                .familia(p != null && p.getCargo() != null && p.getCargo().getFamilia() != null
                        ? p.getCargo().getFamilia().getNombre() : "")
                .fecha(e.getFecha() != null ? e.getFecha().toLocalDate().toString() : "")
                .responsable(e.getEvaluador() != null ? e.getEvaluador().getNombre() : "Psic. Valeria Lagos")
                .estado(e.getEstado() != null ? e.getEstado() : "Pendiente")
                .comentarios(e.getComentarios() != null ? e.getComentarios() : "")
                .fechaEvaluacion(e.getFechaEvaluacion())
                .criterioCompetencias(e.getCriterioCompetencias() != null ? e.getCriterioCompetencias() : false)
                .criterioZulliger(e.getCriterioZulliger() != null ? e.getCriterioZulliger() : false)
                .criterioReferencias(e.getCriterioReferencias() != null ? e.getCriterioReferencias() : false)
                .criterioFitCultural(e.getCriterioFitCultural() != null ? e.getCriterioFitCultural() : false)
                .email(p != null ? p.getEmail() : "")
                .tel(p != null ? p.getTel() : "")
                .cv(p != null ? p.getCv() : "CV.pdf")
                .build();
    }
}
