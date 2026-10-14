package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "FAMILIAS")
@Data
@NoArgsConstructor
public class Familia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "familia", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Cargo> cargos = new ArrayList<>();

    public Familia(String nombre) {
        this.nombre = nombre;
    }
}
