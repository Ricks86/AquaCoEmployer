package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CARGOS")
@Data
@NoArgsConstructor
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "familia_id", nullable = false)
    @JsonIgnoreProperties("cargos")
    private Familia familia;

    @OneToMany(mappedBy = "cargo", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Postulante> postulantes = new ArrayList<>();

    public Cargo(String nombre, Familia familia) {
        this.nombre = nombre;
        this.familia = familia;
    }
}
