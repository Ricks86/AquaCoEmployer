package com.example.demo.controller;

import com.example.demo.Model.*;
import com.example.demo.dto.PostulanteDTO;
import com.example.demo.repositories.CargoRepository;
import com.example.demo.repositories.FamiliaRepository;
import com.example.demo.repositories.PostulanteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/postulantes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class PostulanteController {

    private final PostulanteRepository postulanteRepository;
    private final CargoRepository cargoRepository;
    private final FamiliaRepository familiaRepository;

    private static final String UPLOAD_DIR = "uploads";

    @GetMapping
    public ResponseEntity<List<PostulanteDTO>> getAllPostulantes() {
        List<Postulante> postulantes = postulanteRepository.findAllByOrderByIdDesc();
        List<PostulanteDTO> dtos = postulantes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostulanteDTO> createPostulante(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "tel", required = false) String tel,
            @RequestParam("cargo") String cargoNombre,
            @RequestParam("familia") String familiaNombre,
            @RequestParam(value = "observaciones", required = false) String observaciones,
            @RequestParam(value = "cv", required = false) MultipartFile cvFile) {

        log.info("Registrando nuevo postulante en BD: {}", nombre);

        // 1. Resolver Familia y Cargo
        Familia familia = familiaRepository.findByNombreIgnoreCase(familiaNombre)
                .orElseGet(() -> {
                    Familia f = new Familia();
                    f.setNombre(familiaNombre);
                    return familiaRepository.save(f);
                });

        Cargo cargo = cargoRepository.findByNombreIgnoreCase(cargoNombre)
                .orElseGet(() -> {
                    Cargo c = new Cargo();
                    c.setNombre(cargoNombre);
                    c.setFamilia(familia);
                    return cargoRepository.save(c);
                });

        // 2. Manejo de archivo CV
        String cvFileName = "CV_" + nombre.replaceAll("\\s+", "_") + ".pdf";
        if (cvFile != null && !cvFile.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                cvFileName = System.currentTimeMillis() + "_" + cvFile.getOriginalFilename();
                Path filePath = uploadPath.resolve(cvFileName);
                cvFile.transferTo(filePath.toFile());
            } catch (IOException e) {
                log.error("Error guardando archivo CV en disco: {}", e.getMessage());
            }
        }

        // 3. Crear y guardar entidad en Oracle DB
        Postulante p = new Postulante();
        p.setNombre(nombre);
        p.setEmail(email);
        p.setTel(tel);
        p.setCargo(cargo);
        p.setFecha(LocalDate.now().toString());
        p.setCv(cvFileName);
        p.setObservaciones(observaciones);
        p.setEstado(Estado.PENDIENTE);

        Postulante guardado = postulanteRepository.save(p);
        log.info("Postulante guardado con ID {} en Oracle DB", guardado.getId());

        return ResponseEntity.ok(toDTO(guardado));
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long id) {
        Postulante p = postulanteRepository.findById(id).orElse(null);
        if (p == null || p.getCv() == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(UPLOAD_DIR, p.getCv());
        if (!file.exists()) {
            // Retorna un archivo de texto descriptivo si el archivo físico no está disponible
            byte[] placeholder = ("Currículum Vitae de: " + p.getNombre() + "\nCargo: " + p.getCargo().getNombre()).getBytes();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + p.getCv() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new org.springframework.core.io.ByteArrayResource(placeholder));
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + p.getCv() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    private PostulanteDTO toDTO(Postulante p) {
        return PostulanteDTO.builder()
                .id(String.valueOf(p.getId()))
                .nombre(p.getNombre())
                .email(p.getEmail() != null ? p.getEmail() : "")
                .tel(p.getTel() != null ? p.getTel() : "")
                .cargo(p.getCargo() != null ? p.getCargo().getNombre() : "")
                .familia(p.getCargo() != null && p.getCargo().getFamilia() != null ? p.getCargo().getFamilia().getNombre() : "")
                .fecha(p.getFecha() != null ? p.getFecha() : "")
                .cv(p.getCv() != null ? p.getCv() : "CV.pdf")
                .observaciones(p.getObservaciones())
                .build();
    }
}
