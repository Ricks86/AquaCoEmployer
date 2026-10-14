package com.example.demo.config;

import com.example.demo.Model.*;
import com.example.demo.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FamiliaRepository familiaRepository;
    private final CargoRepository cargoRepository;
    private final EvaluadorRepository evaluadorRepository;
    private final PostulanteRepository postulanteRepository;
    private final EntrevistaRepository entrevistaRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verificando inicialización de datos en Oracle Database...");

        // 1. Familias
        Familia famTi = getOrCreateFamilia("Tecnología/TI");
        Familia famOps = getOrCreateFamilia("Operaciones y Logística");
        Familia famRrhh = getOrCreateFamilia("Recursos Humanos");
        Familia famFin = getOrCreateFamilia("Finanzas y Contabilidad");
        Familia famVentas = getOrCreateFamilia("Ventas y Marketing");

        // 2. Cargos
        Cargo cargoDev = getOrCreateCargo("Desarrollador Full Stack Senior", famTi);
        Cargo cargoSup = getOrCreateCargo("Supervisor de Centro de Cultivo", famOps);
        Cargo cargoClima = getOrCreateCargo("Analista de Clima y Cultura", famRrhh);
        Cargo cargoAudit = getOrCreateCargo("Auditor Interno de Costos", famFin);
        Cargo cargoKam = getOrCreateCargo("Key Account Manager Salmón Fresh", famVentas);

        // 3. Evaluador
        Evaluador evaluador = evaluadorRepository.findByNombreIgnoreCase("Psic. Valeria Lagos")
                .orElseGet(() -> {
                    Evaluador ev = new Evaluador();
                    ev.setNombre("Psic. Valeria Lagos");
                    return evaluadorRepository.save(ev);
                });

        // 4. Postulantes iniciales si la tabla está vacía
        if (postulanteRepository.count() == 0) {
            log.info("Sembrando postulantes iniciales en la base de datos Oracle...");

            Postulante p1 = createPostulante("Camila Morales Sepúlveda", "camila.morales@ejemplo.com", "+56 9 8452 1190", cargoDev, "2025-05-01", "CV_Camila_Morales_2025.pdf");
            Postulante p2 = createPostulante("Rodrigo Alarcón Silva", "rodrigo.alarcon@ejemplo.com", "+56 9 7611 3499", cargoSup, "2025-05-03", "CV_Rodrigo_Alarcon.pdf");
            Postulante p3 = createPostulante("Fernanda Tapia Herrera", "fernanda.tapia@ejemplo.com", "+56 9 9123 4567", cargoClima, "2025-04-26", "CV_Fernanda_Tapia.pdf");
            Postulante p4 = createPostulante("Ignacio Valenzuela Soto", "ignacio.v@ejemplo.com", "+56 9 6554 9901", cargoAudit, "2025-05-04", "CV_Ignacio_Valenzuela.pdf");
            Postulante p5 = createPostulante("Lorena Castillo Vega", "lorena.castillo@ejemplo.com", "+56 9 8812 7744", cargoKam, "2025-05-08", "CV_Lorena_Castillo.pdf");

            // 5. Entrevistas / Solicitudes iniciales
            createEntrevista(p1, evaluador, "En proceso", "2025-05-02", "2025-05-06",
                    "Postulante demuestra sólidos rasgos de pensamiento abstracto, autonomía técnica y alta orientación a resolución de problemas. Buena compatibilidad con metodologías ágiles.",
                    true, true, true, false);

            createEntrevista(p2, evaluador, "Pendiente", "2025-05-04", null,
                    "", false, false, false, false);

            createEntrevista(p3, evaluador, "Finalizada", "2025-04-28", "2025-04-30",
                    "Candidata idónea. Excelente dominio de herramientas de medición de clima organizacional.",
                    true, true, true, true);

            createEntrevista(p4, evaluador, "En proceso", "2025-05-05", null,
                    "", false, false, false, false);

            log.info("Datos sembrados exitosamente en Oracle Cloud Autonomous Database.");
        } else {
            log.info("La base de datos ya contiene postulantes. No es necesario sembrar datos.");
        }
    }

    private Familia getOrCreateFamilia(String nombre) {
        return familiaRepository.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> {
                    Familia f = new Familia();
                    f.setNombre(nombre);
                    return familiaRepository.save(f);
                });
    }

    private Cargo getOrCreateCargo(String nombre, Familia familia) {
        return cargoRepository.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> {
                    Cargo c = new Cargo();
                    c.setNombre(nombre);
                    c.setFamilia(familia);
                    return cargoRepository.save(c);
                });
    }

    private Postulante createPostulante(String nombre, String email, String tel, Cargo cargo, String fecha, String cv) {
        Postulante p = new Postulante();
        p.setNombre(nombre);
        p.setEmail(email);
        p.setTel(tel);
        p.setCargo(cargo);
        p.setFecha(fecha);
        p.setCv(cv);
        p.setEstado(Estado.PENDIENTE);
        return postulanteRepository.save(p);
    }

    private void createEntrevista(Postulante postulante, Evaluador evaluador, String estado, String fecha, String fechaEval, String comentarios, boolean c1, boolean c2, boolean c3, boolean c4) {
        Entrevista e = new Entrevista();
        e.setPostulante(postulante);
        e.setEvaluador(evaluador);
        e.setFecha(LocalDateTime.now());
        e.setFechaEvaluacion(fechaEval);
        e.setEstado(estado);
        e.setComentarios(comentarios);
        e.setCriterioCompetencias(c1);
        e.setCriterioZulliger(c2);
        e.setCriterioReferencias(c3);
        e.setCriterioFitCultural(c4);
        entrevistaRepository.save(e);
    }
}
