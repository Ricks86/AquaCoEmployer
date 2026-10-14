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
    private String postulanteId;
    private String nombre;
    private String cargo;
    private String familia;
    private String fecha;
    private String responsable;
    private String estado;
    private String comentarios;
    private String fechaEvaluacion;
    private Boolean criterioCompetencias;
    private Boolean criterioZulliger;
    private Boolean criterioReferencias;
    private Boolean criterioFitCultural;
    private String email;
    private String tel;
    private String cv;
}
