package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ENTREVISTAS")
@Data
@NoArgsConstructor
public class Entrevista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigo;

    @Column(nullable = false)
    private LocalDate fecha;

    private LocalDate fechaEvaluacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "postulante_id", nullable = false)
    @JsonIgnoreProperties("entrevistas")
    private Postulante postulante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evaluador_id")
    @JsonIgnoreProperties("entrevistas")
    private Evaluador evaluador;

    private String evaluadorNombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @Column(length = 2000)
    private String observacionesIniciales;

    @Column(length = 3000)
    private String comentarios;

    private Boolean criterioCompetencias = false;
    private Boolean criterioZulliger = false;
    private Boolean criterioReferencias = false;
    private Boolean criterioFitCultural = false;
}
