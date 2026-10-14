package com.example.demo.config;

import com.example.demo.Model.*;
import com.example.demo.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final FamiliaRepository familiaRepository;
    private final CargoRepository cargoRepository;
    private final EvaluadorRepository evaluadorRepository;
    private final PostulanteRepository postulanteRepository;
    private final EntrevistaRepository entrevistaRepository;

    @Override
    public void run(String... args) {
        if (postulanteRepository.count() > 0) {
            return;
        }

        // 1. Familias
        Map<String, Familia> familias = new HashMap<>();
        String[] nombresFamilias = {
                "Tecnología/TI",
                "Operaciones y Logística",
                "Recursos Humanos",
                "Finanzas y Contabilidad",
                "Ventas y Marketing"
        };
        for (String nf : nombresFamilias) {
            familias.put(nf, familiaRepository.save(new Familia(nf)));
        }

        // 2. Cargos
        Map<String, Cargo> cargos = new HashMap<>();
        cargos.put("Desarrollador Full Stack Senior", cargoRepository.save(new Cargo("Desarrollador Full Stack Senior", familias.get("Tecnología/TI"))));
        cargos.put("Supervisor de Centro de Cultivo", cargoRepository.save(new Cargo("Supervisor de Centro de Cultivo", familias.get("Operaciones y Logística"))));
        cargos.put("Analista de Clima y Cultura", cargoRepository.save(new Cargo("Analista de Clima y Cultura", familias.get("Recursos Humanos"))));
        cargos.put("Auditor Interno de Costos", cargoRepository.save(new Cargo("Auditor Interno de Costos", familias.get("Finanzas y Contabilidad"))));
        cargos.put("Key Account Manager Salmón Fresh", cargoRepository.save(new Cargo("Key Account Manager Salmón Fresh", familias.get("Ventas y Marketing"))));

        // 3. Evaluador
        Evaluador evaluadora = evaluadorRepository.save(new Evaluador("Psic. Valeria Lagos", "Psicóloga Selección RRHH"));

        // 4. Postulantes
        Postulante p1 = new Postulante();
        p1.setNombre("Camila Morales Sepúlveda");
        p1.setEmail("camila.morales@ejemplo.com");
        p1.setTelefono("+56 9 8452 1190");
        p1.setCargo(cargos.get("Desarrollador Full Stack Senior"));
        p1.setFechaPostulacion(LocalDate.of(2025, 5, 1));
        p1.setCvNombre("CV_Camila_Morales_2025.pdf");
        p1.setEstado(Estado.EN_PROCESO);
        p1 = postulanteRepository.save(p1);

        Postulante p2 = new Postulante();
        p2.setNombre("Rodrigo Alarcón Silva");
        p2.setEmail("rodrigo.alarcon@ejemplo.com");
        p2.setTelefono("+56 9 7611 3499");
        p2.setCargo(cargos.get("Supervisor de Centro de Cultivo"));
        p2.setFechaPostulacion(LocalDate.of(2025, 5, 3));
        p2.setCvNombre("CV_Rodrigo_Alarcon.pdf");
        p2.setEstado(Estado.PENDIENTE);
        p2 = postulanteRepository.save(p2);

        Postulante p3 = new Postulante();
        p3.setNombre("Fernanda Tapia Herrera");
        p3.setEmail("fernanda.tapia@ejemplo.com");
        p3.setTelefono("+56 9 9123 4567");
        p3.setCargo(cargos.get("Analista de Clima y Cultura"));
        p3.setFechaPostulacion(LocalDate.of(2025, 4, 26));
        p3.setCvNombre("CV_Fernanda_Tapia.pdf");
        p3.setEstado(Estado.FINALIZADA);
        p3 = postulanteRepository.save(p3);

        Postulante p4 = new Postulante();
        p4.setNombre("Ignacio Valenzuela Soto");
        p4.setEmail("ignacio.v@ejemplo.com");
        p4.setTelefono("+56 9 6554 9901");
        p4.setCargo(cargos.get("Auditor Interno de Costos"));
        p4.setFechaPostulacion(LocalDate.of(2025, 5, 4));
        p4.setCvNombre("CV_Ignacio_Valenzuela.pdf");
        p4.setEstado(Estado.EN_PROCESO);
        p4 = postulanteRepository.save(p4);

        Postulante p5 = new Postulante();
        p5.setNombre("Lorena Castillo Vega");
        p5.setEmail("lorena.castillo@ejemplo.com");
        p5.setTelefono("+56 9 8812 7744");
        p5.setCargo(cargos.get("Key Account Manager Salmón Fresh"));
        p5.setFechaPostulacion(LocalDate.of(2025, 5, 8));
        p5.setCvNombre("CV_Lorena_Castillo.pdf");
        p5.setEstado(Estado.PENDIENTE);
        p5 = postulanteRepository.save(p5);

        // 5. Entrevistas / Solicitudes
        Entrevista s1 = new Entrevista();
        s1.setCodigo("SOL-101");
        s1.setFecha(LocalDate.of(2025, 5, 2));
        s1.setFechaEvaluacion(LocalDate.of(2025, 5, 6));
        s1.setPostulante(p1);
        s1.setEvaluador(evaluadora);
        s1.setEvaluadorNombre(evaluadora.getNombre());
        s1.setEstado(Estado.EN_PROCESO);
        s1.setObservacionesIniciales("Requerimiento de la Subgerencia de Transformación Digital.");
        s1.setComentarios("Postulante demuestra sólidos rasgos de pensamiento abstracto, autonomía técnica y alta orientación a resolución de problemas. Buena compatibilidad con metodologías ágiles.");
        s1.setCriterioCompetencias(true);
        s1.setCriterioZulliger(true);
        s1.setCriterioReferencias(true);
        s1.setCriterioFitCultural(false);
        entrevistaRepository.save(s1);

        Entrevista s2 = new Entrevista();
        s2.setCodigo("SOL-102");
        s2.setFecha(LocalDate.of(2025, 5, 4));
        s2.setPostulante(p2);
        s2.setEvaluador(evaluadora);
        s2.setEvaluadorNombre(evaluadora.getNombre());
        s2.setEstado(Estado.PENDIENTE);
        s2.setObservacionesIniciales("Requerimiento del área de operaciones en centros.");
        s2.setComentarios("");
        entrevistaRepository.save(s2);

        Entrevista s3 = new Entrevista();
        s3.setCodigo("SOL-103");
        s3.setFecha(LocalDate.of(2025, 4, 28));
        s3.setFechaEvaluacion(LocalDate.of(2025, 4, 30));
        s3.setPostulante(p3);
        s3.setEvaluador(evaluadora);
        s3.setEvaluadorNombre(evaluadora.getNombre());
        s3.setEstado(Estado.FINALIZADA);
        s3.setObservacionesIniciales("Reemplazo por pre y postnatal.");
        s3.setComentarios("Candidata idónea. Excelente dominio de herramientas de medición de clima organizacional.");
        s3.setCriterioCompetencias(true);
        s3.setCriterioZulliger(true);
        s3.setCriterioReferencias(true);
        s3.setCriterioFitCultural(true);
        entrevistaRepository.save(s3);

        Entrevista s4 = new Entrevista();
        s4.setCodigo("SOL-104");
        s4.setFecha(LocalDate.of(2025, 5, 5));
        s4.setPostulante(p4);
        s4.setEvaluador(evaluadora);
        s4.setEvaluadorNombre(evaluadora.getNombre());
        s4.setEstado(Estado.EN_PROCESO);
        s4.setObservacionesIniciales("Evaluación psicológica para puesto de auditoría de costos.");
        s4.setComentarios("");
        entrevistaRepository.save(s4);
    }
}
