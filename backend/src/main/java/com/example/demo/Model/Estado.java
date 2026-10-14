package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Estado {
    PENDIENTE("Pendiente"),
    EN_PROCESO("En proceso"),
    FINALIZADA("Finalizada"),
    EVALUANDO("En proceso"),
    APROBADO("Finalizada"),
    RECHAZADO("Finalizada");

    private final String descripcion;

    Estado(String descripcion) {
        this.descripcion = descripcion;
    }

    @JsonValue
    public String getDescripcion() {
        return descripcion;
    }

    @JsonCreator
    public static Estado fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return PENDIENTE;
        }
        String clean = text.trim();
        for (Estado e : Estado.values()) {
            if (e.name().equalsIgnoreCase(clean) || e.descripcion.equalsIgnoreCase(clean)) {
                return e;
            }
        }
        if (clean.equalsIgnoreCase("En proceso") || clean.equalsIgnoreCase("EVALUANDO")) {
            return EN_PROCESO;
        }
        if (clean.equalsIgnoreCase("Finalizada") || clean.equalsIgnoreCase("APROBADO") || clean.equalsIgnoreCase("RECHAZADO")) {
            return FINALIZADA;
        }
        return PENDIENTE;
    }
}
