package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "POSTULANTES")
@Data
@NoArgsConstructor
public class Postulante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String email;

    private String telefono;

    private LocalDate fechaPostulacion;

    private String cvNombre;

    private String cvRuta;

    @Column(length = 2000)
    private String resumenExperiencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cargo_id", nullable = false)
    @JsonIgnoreProperties("postulantes")
    private Cargo cargo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @OneToMany(mappedBy = "postulante", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Entrevista> entrevistas = new ArrayList<>();
}
