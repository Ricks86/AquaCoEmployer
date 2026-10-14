package com.example.demo.service;

import com.example.demo.Model.Cargo;
import com.example.demo.Model.Estado;
import com.example.demo.Model.Familia;
import com.example.demo.Model.Postulante;
import com.example.demo.dto.PostulanteDTO;
import com.example.demo.repositories.CargoRepository;
import com.example.demo.repositories.FamiliaRepository;
import com.example.demo.repositories.PostulanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostulanteService {

    private final PostulanteRepository postulanteRepository;
    private final FamiliaRepository familiaRepository;
    private final CargoRepository cargoRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<PostulanteDTO> listarTodos() {
        return postulanteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostulanteDTO obtenerPorId(Long id) {
        Postulante p = postulanteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulante no encontrado con ID: " + id));
        return toDTO(p);
    }

    @Transactional
    public PostulanteDTO registrarPostulante(
            String nombre,
            String email,
            String tel,
            String familiaNombre,
            String cargoNombre,
            String observaciones,
            MultipartFile cvFile
    ) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es requerido");
        }

        // Buscar o crear Familia
        String cleanFamilia = (familiaNombre != null && !familiaNombre.isBlank()) ? familiaNombre.trim() : "General";
        Familia familia = familiaRepository.findByNombreIgnoreCase(cleanFamilia)
                .orElseGet(() -> familiaRepository.save(new Familia(cleanFamilia)));

        // Buscar o crear Cargo
        String cleanCargo = (cargoNombre != null && !cargoNombre.isBlank()) ? cargoNombre.trim() : "Cargo General";
        Cargo cargo = cargoRepository.findByNombreIgnoreCase(cleanCargo)
                .orElseGet(() -> cargoRepository.save(new Cargo(cleanCargo, familia)));

        // Guardar archivo si viene adjunto
        String cvFileName = null;
        if (cvFile != null && !cvFile.isEmpty()) {
            try {
                cvFileName = fileStorageService.guardarArchivo(cvFile, nombre);
            } catch (IOException e) {
                cvFileName = "CV_" + nombre.replaceAll("\\s+", "_") + ".pdf";
            }
        } else {
            cvFileName = "CV_" + nombre.replaceAll("\\s+", "_") + ".pdf";
        }

        Postulante p = new Postulante();
        p.setNombre(nombre.trim());
        p.setEmail(email.trim());
        p.setTelefono(tel != null ? tel.trim() : "");
        p.setFechaPostulacion(LocalDate.now());
        p.setCvNombre(cvFileName);
        p.setResumenExperiencia(observaciones);
        p.setCargo(cargo);
        p.setEstado(Estado.PENDIENTE);

        Postulante guardado = postulanteRepository.save(p);
        return toDTO(guardado);
    }

    @Transactional(readOnly = true)
    public Resource obtenerCvResource(Long postulanteId) {
        Postulante p = postulanteRepository.findById(postulanteId)
                .orElseThrow(() -> new IllegalArgumentException("Postulante no encontrado con ID: " + postulanteId));
        return fileStorageService.cargarArchivo(p.getCvNombre(), p.getNombre());
    }

    public PostulanteDTO toDTO(Postulante p) {
        String fam = (p.getCargo() != null && p.getCargo().getFamilia() != null)
                ? p.getCargo().getFamilia().getNombre()
                : "General";
        String carg = (p.getCargo() != null) ? p.getCargo().getNombre() : "General";

        return PostulanteDTO.builder()
                .id(String.valueOf(p.getId()))
                .nombre(p.getNombre())
                .email(p.getEmail() != null ? p.getEmail() : "")
                .tel(p.getTelefono() != null ? p.getTelefono() : "")
                .cargo(carg)
                .familia(fam)
                .fecha(p.getFechaPostulacion() != null ? p.getFechaPostulacion().toString() : LocalDate.now().toString())
                .cv(p.getCvNombre() != null ? p.getCvNombre() : "CV_" + p.getNombre().replaceAll("\\s+", "_") + ".pdf")
                .cvUrl("/api/postulantes/" + p.getId() + "/cv")
                .estado(p.getEstado() != null ? p.getEstado().getDescripcion() : "Pendiente")
                .build();
    }
}
