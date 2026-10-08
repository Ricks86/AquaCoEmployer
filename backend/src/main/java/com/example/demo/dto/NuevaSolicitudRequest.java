package com.example.demo.dto;

import lombok.Data;

@Data
public class NuevaSolicitudRequest {
    private Long postulanteId;
    private String fecha;
    private String responsable;
    private String observaciones;
}
