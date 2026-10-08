package com.example.demo.controller;

import com.example.demo.dto.PostulanteDTO;
import com.example.demo.service.PostulanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/postulantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostulanteController {

    private final PostulanteService postulanteService;

    @GetMapping
    public ResponseEntity<List<PostulanteDTO>> listarTodos() {
        return ResponseEntity.ok(postulanteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostulanteDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(postulanteService.obtenerPorId(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostulanteDTO> registrarConArchivo(
            @RequestParam("nombre") String nombre,
            @RequestParam("email") String email,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "tel", required = false) String tel,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "familiaCargo", required = false) String familiaCargo,
            @RequestParam(value = "cargo", required = false) String cargo,
            @RequestParam(value = "cargoPostular", required = false) String cargoPostular,
            @RequestParam(value = "observaciones", required = false) String observaciones,
            @RequestParam(value = "cv", required = false) MultipartFile cvFile
    ) {
        String finalTel = (telefono != null && !telefono.isBlank()) ? telefono : tel;
        String finalFamilia = (familia != null && !familia.isBlank()) ? familia : familiaCargo;
        String finalCargo = (cargo != null && !cargo.isBlank()) ? cargo : cargoPostular;

        PostulanteDTO creado = postulanteService.registrarPostulante(
                nombre,
                email,
                finalTel,
                finalFamilia,
                finalCargo,
                observaciones,
                cvFile
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostulanteDTO> registrarJson(@RequestBody PostulanteDTO dto) {
        PostulanteDTO creado = postulanteService.registrarPostulante(
                dto.getNombre(),
                dto.getEmail(),
                dto.getTel(),
                dto.getFamilia(),
                dto.getCargo(),
                "",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> descargarCv(@PathVariable Long id) {
        PostulanteDTO postulante = postulanteService.obtenerPorId(id);
        Resource resource = postulanteService.obtenerCvResource(id);

        String filename = postulante.getCv() != null ? postulante.getCv() : "CV.pdf";

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (filename.toLowerCase().endsWith(".pdf")) {
            mediaType = MediaType.APPLICATION_PDF;
        } else if (filename.toLowerCase().endsWith(".txt")) {
            mediaType = MediaType.TEXT_PLAIN;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }
}
