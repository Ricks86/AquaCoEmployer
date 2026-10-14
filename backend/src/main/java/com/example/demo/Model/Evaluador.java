package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "EVALUADORES")
@Data
@NoArgsConstructor
public class Evaluador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String cargo;

    @OneToMany(mappedBy = "evaluador", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Entrevista> entrevistas = new ArrayList<>();

    public Evaluador(String nombre) {
        this.nombre = nombre;
    }

    public Evaluador(String nombre, String cargo) {
        this.nombre = nombre;
        this.cargo = cargo;
    }
}
