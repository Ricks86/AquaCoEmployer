package com.example.demo.dto;

import lombok.Data;

@Data
public class EvaluacionUpdateRequest {
    private String estado;
    private String fechaEvaluacion;
    private String comentarios;
    private Boolean criterioCompetencias;
    private Boolean criterioZulliger;
    private Boolean criterioReferencias;
    private Boolean criterioFitCultural;
}
