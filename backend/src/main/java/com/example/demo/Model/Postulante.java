package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String email;

    private String tel;

    private String fecha;

    private String cv;

    @Column(length = 1000)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "cargo_id", nullable = false)
    private Cargo cargo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @OneToMany(mappedBy = "postulante", cascade = CascadeType.ALL)
    private List<Entrevista> entrevistas;
}
