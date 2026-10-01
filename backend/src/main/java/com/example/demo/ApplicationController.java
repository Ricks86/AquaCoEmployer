package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*") // Permitir peticiones desde React
public class ApplicationController {

    @PostMapping
    public ResponseEntity<Map<String, String>> submitApplication(
            @RequestParam("nombre") String nombre,
            @RequestParam("familiaCargo") String familiaCargo,
            @RequestParam("cargoPostular") String cargoPostular,
            @RequestParam("cv") MultipartFile cv) {

        // Aquí iría la lógica para procesar los datos, ej. guardarlo en DB y guardar el archivo
        
        System.out.println("Recibido:");
        System.out.println("Nombre: " + nombre);
        System.out.println("Familia Cargo: " + familiaCargo);
        System.out.println("Cargo Postular: " + cargoPostular);
        System.out.println("CV Original Filename: " + (cv != null ? cv.getOriginalFilename() : "Ninguno"));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Aplicación recibida exitosamente");

        return ResponseEntity.ok(response);
    }
}
