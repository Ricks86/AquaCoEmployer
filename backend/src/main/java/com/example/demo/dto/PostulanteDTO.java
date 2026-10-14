package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostulanteDTO {
    private String id;
    private String nombre;
    private String email;
    private String tel;
    private String cargo;
    private String familia;
    private String fecha;
    private String cv;
    private String cvUrl;
    private String estado;
}
