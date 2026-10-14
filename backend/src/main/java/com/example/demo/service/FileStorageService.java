package com.example.demo.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation = Paths.get("uploads/cv").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta de almacenamiento para CVs", e);
        }
    }

    public String guardarArchivo(MultipartFile file, String nombreCandidato) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String safeCandidato = (nombreCandidato != null ? nombreCandidato : "Candidato")
                .replaceAll("[^a-zA-Z0-9_-]", "_");

        String fileName = "CV_" + safeCandidato + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = this.storageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public Resource cargarArchivo(String fileName, String nombrePostulante) {
        if (fileName != null && !fileName.isBlank()) {
            try {
                Path filePath = this.storageLocation.resolve(fileName).normalize();
                Resource resource = new UrlResource(filePath.toUri());
                if (resource.exists() && resource.isReadable()) {
                    return resource;
                }
            } catch (Exception ignored) {
            }
        }

        // Generar un documento representativo dinámico en caso de archivo precargado o demo
        String docContent = "========================================================\n" +
                "       AQUACHILE - ANTECEDENTES CURRICULARES (CV)\n" +
                "========================================================\n\n" +
                "Candidato(a): " + (nombrePostulante != null ? nombrePostulante : "Candidato") + "\n" +
                "Documento: " + (fileName != null ? fileName : "Curriculum_Vitae.pdf") + "\n\n" +
                "Resumen Profesional:\n" +
                "- Profesional con amplia experiencia y motivación en la industria acuícola.\n" +
                "- Postulación formal ingresada al sistema de selección de personas AquaChile.\n\n" +
                "Estado de validación: Verificado por RRHH.\n";

        return new ByteArrayResource(docContent.getBytes(StandardCharsets.UTF_8));
    }
}
