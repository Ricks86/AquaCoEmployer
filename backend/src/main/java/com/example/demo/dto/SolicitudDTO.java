package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudDTO {
    private String id;
    private Long numericId;
    private String postulanteId;
    private String nombre;
    private String email;
    private String tel;
    private String cargo;
    private String familia;
    private String fecha;
    private String fechaEvaluacion;
    private String responsable;
    private String estado;
    private String comentarios;
    private String observaciones;
    private String cv;
    private String cvUrl;

    @Builder.Default
    private Boolean criterioCompetencias = false;
    @Builder.Default
    private Boolean criterioZulliger = false;
    @Builder.Default
    private Boolean criterioReferencias = false;
    @Builder.Default
    private Boolean criterioFitCultural = false;
}
