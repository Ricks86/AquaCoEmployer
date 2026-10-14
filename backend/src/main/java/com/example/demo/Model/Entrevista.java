package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ENTREVISTAS")
@Data
@NoArgsConstructor
public class Entrevista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    private String fechaEvaluacion;

    @ManyToOne
    @JoinColumn(name = "postulante_id", nullable = false)
    private Postulante postulante;

    @ManyToOne
    @JoinColumn(name = "evaluador_id", nullable = false)
    private Evaluador evaluador;

    @Column(length = 2000)
    private String comentarios;

    private Boolean criterioCompetencias;
    private Boolean criterioZulliger;
    private Boolean criterioReferencias;
    private Boolean criterioFitCultural;

    private String estado;
}
