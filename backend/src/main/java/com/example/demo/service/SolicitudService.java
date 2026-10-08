package com.example.demo.service;

import com.example.demo.Model.Entrevista;
import com.example.demo.Model.Estado;
import com.example.demo.Model.Evaluador;
import com.example.demo.Model.Postulante;
import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.dto.EvaluacionUpdateRequest;
import com.example.demo.dto.NuevaSolicitudRequest;
import com.example.demo.dto.SolicitudDTO;
import com.example.demo.repositories.EntrevistaRepository;
import com.example.demo.repositories.EvaluadorRepository;
import com.example.demo.repositories.PostulanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudService {

    private final EntrevistaRepository entrevistaRepository;
    private final PostulanteRepository postulanteRepository;
    private final EvaluadorRepository evaluadorRepository;

    @Transactional(readOnly = true)
    public List<SolicitudDTO> listarTodas() {
        return entrevistaRepository.findAllByOrderByIdDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SolicitudDTO obtenerPorIdOCodigo(String idOrCodigo) {
        Entrevista e = buscarEntrevista(idOrCodigo)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada: " + idOrCodigo));
        return toDTO(e);
    }

    @Transactional
    public SolicitudDTO crearSolicitud(NuevaSolicitudRequest request) {
        if (request.getPostulanteId() == null) {
            throw new IllegalArgumentException("Debe seleccionar un postulante");
        }

        Postulante postulante = postulanteRepository.findById(request.getPostulanteId())
                .orElseThrow(() -> new IllegalArgumentException("Postulante no encontrado con ID: " + request.getPostulanteId()));

        LocalDate fecha = (request.getFecha() != null && !request.getFecha().isBlank())
                ? LocalDate.parse(request.getFecha().trim())
                : LocalDate.now();

        String respNombre = (request.getResponsable() != null && !request.getResponsable().isBlank())
                ? request.getResponsable().trim()
                : "Psic. Valeria Lagos";

        Evaluador evaluador = evaluadorRepository.findByNombreIgnoreCase(respNombre)
                .orElseGet(() -> evaluadorRepository.save(new Evaluador(respNombre, "Psicología RRHH")));

        long total = entrevistaRepository.count() + 1;
        String codigo = "SOL-" + (100 + total);

        Entrevista entrevista = new Entrevista();
        entrevista.setCodigo(codigo);
        entrevista.setFecha(fecha);
        entrevista.setPostulante(postulante);
        entrevista.setEvaluador(evaluador);
        entrevista.setEvaluadorNombre(respNombre);
        entrevista.setEstado(Estado.PENDIENTE);
        entrevista.setObservacionesIniciales(request.getObservaciones());

        postulante.setEstado(Estado.PENDIENTE);
        postulanteRepository.save(postulante);

        Entrevista guardada = entrevistaRepository.save(entrevista);
        return toDTO(guardada);
    }

    @Transactional
    public SolicitudDTO actualizarEvaluacion(String idOrCodigo, EvaluacionUpdateRequest request) {
        Entrevista entrevista = buscarEntrevista(idOrCodigo)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada: " + idOrCodigo));

        if (request.getEstado() != null) {
            Estado nuevoEstado = Estado.fromString(request.getEstado());
            entrevista.setEstado(nuevoEstado);
            if (entrevista.getPostulante() != null) {
                entrevista.getPostulante().setEstado(nuevoEstado);
                postulanteRepository.save(entrevista.getPostulante());
            }
        }

        if (request.getFechaEvaluacion() != null && !request.getFechaEvaluacion().isBlank()) {
            try {
                entrevista.setFechaEvaluacion(LocalDate.parse(request.getFechaEvaluacion().trim()));
            } catch (Exception ignored) {
            }
        }

        if (request.getComentarios() != null) {
            entrevista.setComentarios(request.getComentarios());
        }

        if (request.getCriterioCompetencias() != null) {
            entrevista.setCriterioCompetencias(request.getCriterioCompetencias());
        }
        if (request.getCriterioZulliger() != null) {
            entrevista.setCriterioZulliger(request.getCriterioZulliger());
        }
        if (request.getCriterioReferencias() != null) {
            entrevista.setCriterioReferencias(request.getCriterioReferencias());
        }
        if (request.getCriterioFitCultural() != null) {
            entrevista.setCriterioFitCultural(request.getCriterioFitCultural());
        }

        Entrevista actualizada = entrevistaRepository.save(entrevista);
        return toDTO(actualizada);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO obtenerStats() {
        long postulantes = postulanteRepository.count();
        long pendientes = entrevistaRepository.countByEstado(Estado.PENDIENTE);
        long enProceso = entrevistaRepository.countByEstado(Estado.EN_PROCESO)
                + entrevistaRepository.countByEstado(Estado.EVALUANDO);
        long finalizadas = entrevistaRepository.countByEstado(Estado.FINALIZADA)
                + entrevistaRepository.countByEstado(Estado.APROBADO)
                + entrevistaRepository.countByEstado(Estado.RECHAZADO);

        return DashboardStatsDTO.builder()
                .postulantes(postulantes)
                .pendientes(pendientes)
                .enProceso(enProceso)
                .finalizadas(finalizadas)
                .build();
    }

    private Optional<Entrevista> buscarEntrevista(String idOrCodigo) {
        if (idOrCodigo == null || idOrCodigo.isBlank()) {
            return Optional.empty();
        }
        String clean = idOrCodigo.trim();

        // Si empieza por SOL-
        Optional<Entrevista> porCodigo = entrevistaRepository.findByCodigo(clean);
        if (porCodigo.isPresent()) {
            return porCodigo;
        }

        // Si es numérico
        try {
            Long numericId = Long.parseLong(clean);
            return entrevistaRepository.findById(numericId);
        } catch (NumberFormatException ignored) {
        }

        // Intentar agregar SOL- si pasaron solo el número (ej: 101 -> SOL-101)
        return entrevistaRepository.findByCodigo("SOL-" + clean);
    }

    public SolicitudDTO toDTO(Entrevista e) {
        Postulante p = e.getPostulante();
        String candidatoNombre = (p != null) ? p.getNombre() : "Sin asignar";
        String candidatoEmail = (p != null && p.getEmail() != null) ? p.getEmail() : "";
        String candidatoTel = (p != null && p.getTelefono() != null) ? p.getTelefono() : "";
        String cargo = (p != null && p.getCargo() != null) ? p.getCargo().getNombre() : "";
        String familia = (p != null && p.getCargo() != null && p.getCargo().getFamilia() != null)
                ? p.getCargo().getFamilia().getNombre()
                : "";
        String cv = (p != null && p.getCvNombre() != null)
                ? p.getCvNombre()
                : "CV_" + candidatoNombre.replaceAll("\\s+", "_") + ".pdf";
        String cvUrl = (p != null) ? "/api/postulantes/" + p.getId() + "/cv" : "";

        String responsable = (e.getEvaluador() != null)
                ? e.getEvaluador().getNombre()
                : (e.getEvaluadorNombre() != null ? e.getEvaluadorNombre() : "Psic. Valeria Lagos");

        String displayId = (e.getCodigo() != null && !e.getCodigo().isBlank())
                ? e.getCodigo()
                : "SOL-" + (100 + e.getId());

        return SolicitudDTO.builder()
                .id(displayId)
                .numericId(e.getId())
                .postulanteId((p != null) ? String.valueOf(p.getId()) : "")
                .nombre(candidatoNombre)
                .email(candidatoEmail)
                .tel(candidatoTel)
                .cargo(cargo)
                .familia(familia)
                .fecha(e.getFecha() != null ? e.getFecha().toString() : "")
                .fechaEvaluacion(e.getFechaEvaluacion() != null ? e.getFechaEvaluacion().toString() : "")
                .responsable(responsable)
                .estado(e.getEstado() != null ? e.getEstado().getDescripcion() : "Pendiente")
                .comentarios(e.getComentarios() != null ? e.getComentarios() : "")
                .observaciones(e.getObservacionesIniciales() != null ? e.getObservacionesIniciales() : "")
                .cv(cv)
                .cvUrl(cvUrl)
                .criterioCompetencias(Boolean.TRUE.equals(e.getCriterioCompetencias()))
                .criterioZulliger(Boolean.TRUE.equals(e.getCriterioZulliger()))
                .criterioReferencias(Boolean.TRUE.equals(e.getCriterioReferencias()))
                .criterioFitCultural(Boolean.TRUE.equals(e.getCriterioFitCultural()))
                .build();
    }
}
