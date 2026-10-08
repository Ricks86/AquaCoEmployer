// CONFIGURACIÓN DE CONEXIÓN CON EL BACKEND SPRING BOOT
const API_BASE = (window.location.protocol.startsWith("http") && window.location.port === "8080")
  ? ""
  : "http://localhost:8080";

let isBackendConnected = false;

// ESTADO GLOBAL DE DATOS (Con fallback inicial en memoria)
let postulantes = [
  { id: "1", nombre: "Camila Morales Sepúlveda", email: "camila.morales@ejemplo.com", tel: "+56 9 8452 1190", cargo: "Desarrollador Full Stack Senior", familia: "Tecnología/TI", fecha: "2025-05-01", cv: "CV_Camila_Morales_2025.pdf" },
  { id: "2", nombre: "Rodrigo Alarcón Silva", email: "rodrigo.alarcon@ejemplo.com", tel: "+56 9 7611 3499", cargo: "Supervisor de Centro de Cultivo", familia: "Operaciones y Logística", fecha: "2025-05-03", cv: "CV_Rodrigo_Alarcon.pdf" },
  { id: "3", nombre: "Fernanda Tapia Herrera", email: "fernanda.tapia@ejemplo.com", tel: "+56 9 9123 4567", cargo: "Analista de Clima y Cultura", familia: "Recursos Humanos", fecha: "2025-04-26", cv: "CV_Fernanda_Tapia.pdf" },
  { id: "4", nombre: "Ignacio Valenzuela Soto", email: "ignacio.v@ejemplo.com", tel: "+56 9 6554 9901", cargo: "Auditor Interno de Costos", familia: "Finanzas y Contabilidad", fecha: "2025-05-04", cv: "CV_Ignacio_Valenzuela.pdf" },
  { id: "5", nombre: "Lorena Castillo Vega", email: "lorena.castillo@ejemplo.com", tel: "+56 9 8812 7744", cargo: "Key Account Manager Salmón Fresh", familia: "Ventas y Marketing", fecha: "2025-05-08", cv: "CV_Lorena_Castillo.pdf" }
];

let solicitudes = [
  { id: "SOL-101", postulanteId: "1", nombre: "Camila Morales Sepúlveda", cargo: "Desarrollador Full Stack Senior", familia: "Tecnología/TI", fecha: "2025-05-02", responsable: "Psic. Valeria Lagos", estado: "En proceso", comentarios: "Postulante demuestra sólidos rasgos de pensamiento abstracto, autonomía técnica y alta orientación a resolución de problemas. Buena compatibilidad con metodologías ágiles.", criterioCompetencias: true, criterioZulliger: true, criterioReferencias: true, criterioFitCultural: false },
  { id: "SOL-102", postulanteId: "2", nombre: "Rodrigo Alarcón Silva", cargo: "Supervisor de Centro de Cultivo", familia: "Operaciones y Logística", fecha: "2025-05-04", responsable: "Psic. Valeria Lagos", estado: "Pendiente", comentarios: "" },
  { id: "SOL-103", postulanteId: "3", nombre: "Fernanda Tapia Herrera", cargo: "Analista de Clima y Cultura", familia: "Recursos Humanos", fecha: "2025-04-28", responsable: "Psic. Valeria Lagos", estado: "Finalizada", comentarios: "Candidata idónea. Excelente dominio de herramientas de medición de clima organizacional.", criterioCompetencias: true, criterioZulliger: true, criterioReferencias: true, criterioFitCultural: true },
  { id: "SOL-104", postulanteId: "4", nombre: "Ignacio Valenzuela Soto", cargo: "Auditor Interno de Costos", familia: "Finanzas y Contabilidad", fecha: "2025-05-05", responsable: "Psic. Valeria Lagos", estado: "En proceso", comentarios: "" }
];

let selectedSolicitudId = "SOL-101";

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  
  // Listeners de navegación
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      navigateTo(view);
    });
  });

  const topPortalBtn = document.getElementById("topPortalBtn");
  if (topPortalBtn) {
    topPortalBtn.addEventListener("click", () => navigateTo("portal"));
  }

  // Render inicial inmediato con datos
  renderDashboard();
  renderPostulantes();
  renderSolicitudes();
  populatePostulanteSelect();
  renderDetalleEvaluacion(selectedSolicitudId);

  // Sincronizar inmediatamente con Backend Spring Boot
  fetchBackendData();
});

// ACTUALIZACIÓN DE INDICADOR DE CONEXIÓN
function updateConnectionBadge(connected, message) {
  isBackendConnected = connected;
  const badge = document.getElementById("backendStatusBadge");
  const dot = document.getElementById("backendStatusDot");
  const text = document.getElementById("backendStatusText");
  if (!badge || !dot || !text) return;

  if (connected) {
    badge.style.background = "#f0fdf4";
    badge.style.borderColor = "#bbf7d0";
    badge.style.color = "#166534";
    dot.style.background = "#22c55e";
    text.textContent = message || "Backend Conectado (8080)";
  } else {
    badge.style.background = "#fffbeb";
    badge.style.borderColor = "#fde68a";
    badge.style.color = "#b45309";
    dot.style.background = "#f59e0b";
    text.textContent = message || "Modo Local (Sin Backend)";
  }
}

// SINCRONIZACIÓN CON BACKEND (GET)
async function fetchBackendData() {
  const text = document.getElementById("backendStatusText");
  if (text) text.textContent = "Conectando...";

  try {
    const [resPostulantes, resSolicitudes] = await Promise.all([
      fetch(`${API_BASE}/api/postulantes`),
      fetch(`${API_BASE}/api/solicitudes`)
    ]);

    if (!resPostulantes.ok || !resSolicitudes.ok) {
      throw new Error("Respuesta no satisfactoria del servidor");
    }

    const dataPostulantes = await resPostulantes.json();
    const dataSolicitudes = await resSolicitudes.json();

    if (Array.isArray(dataPostulantes) && dataPostulantes.length > 0) {
      postulantes = dataPostulantes;
    }
    if (Array.isArray(dataSolicitudes) && dataSolicitudes.length > 0) {
      solicitudes = dataSolicitudes;
      if (!solicitudes.some(s => s.id === selectedSolicitudId)) {
        selectedSolicitudId = solicitudes[0].id;
      }
    }

    updateConnectionBadge(true, "Backend Conectado (8080)");

    // Refrescar vistas con datos reales del backend
    renderDashboard();
    renderPostulantes();
    renderSolicitudes();
    populatePostulanteSelect();
    renderDetalleEvaluacion(selectedSolicitudId);
  } catch (error) {
    console.warn("Aviso: No se pudo conectar al Backend Spring Boot en " + API_BASE + ". Operando con datos locales.", error);
    updateConnectionBadge(false, "Modo Local (Sin Backend)");
  }
}

// NAVEGACIÓN
function navigateTo(viewId) {
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) targetView.classList.add("active");

  const activeNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (activeNav) activeNav.classList.add("active");

  window.scrollTo(0, 0);
}

// RENDER DASHBOARD
function renderDashboard() {
  const tbody = document.getElementById("dash-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  solicitudes.slice(0, 4).forEach(sol => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700;">${sol.nombre}</td>
      <td>${sol.cargo}</td>
      <td style="color:#6b7280;">${sol.fecha}</td>
      <td>${getBadgeHTML(sol.estado)}</td>
      <td style="text-align:right;">
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="openDetalle('${sol.id}')">
          <i data-lucide="eye" style="width:12px; height:12px;"></i> Ver Evaluación
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateStats();
  if (window.lucide) lucide.createIcons();
}

// RENDER POSTULANTES
function renderPostulantes(items = postulantes) {
  const tbody = document.getElementById("postulantes-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  items.forEach(p => {
    const avatarLetter = (p.nombre && p.nombre.length > 0) ? p.nombre.charAt(0) : "P";
    const cvDisplay = (p.cv && p.cv.length > 15) ? (p.cv.substring(0, 14) + "...") : (p.cv || "CV.pdf");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:#ccfbf1; color:#0f766e; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">${avatarLetter}</div>
          <div>
            <div style="font-weight:700;">${p.nombre}</div>
            <div style="font-size:11px; color:#9ca3af;">ID Postulante #${p.id}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-size:12px;">${p.email}</div>
        <div style="font-size:11px; color:#6b7280;">${p.tel || "-"}</div>
      </td>
      <td>
        <div style="font-weight:600;">${p.cargo}</div>
        <span class="badge" style="background:#f1f5f9; color:#475569; font-size:10px; padding:2px 6px;">${p.familia}</span>
      </td>
      <td style="color:#6b7280;">${p.fecha}</td>
      <td>
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px; color:#0f766e;" onclick="descargarCvPostulante('${p.id}', '${p.cv}')">
          <i data-lucide="file-text" style="width:12px; height:12px;"></i> ${cvDisplay}
        </button>
      </td>
      <td style="text-align:right;">
        <button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="iniciarSolicitudDesdePostulante('${p.id}')">
          <i data-lucide="file-plus" style="width:12px; height:12px;"></i> Iniciar Solicitud
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

// RENDER SOLICITUDES
function renderSolicitudes(items = solicitudes) {
  const tbody = document.getElementById("solicitudes-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  items.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700; color:#4b5563;">${s.id}</td>
      <td style="font-weight:700;">${s.nombre}</td>
      <td>${s.cargo}</td>
      <td style="color:#6b7280;">${s.fecha}</td>
      <td style="font-size:12px;">${s.responsable || "Psic. Valeria Lagos"}</td>
      <td>${getBadgeHTML(s.estado)}</td>
      <td style="text-align:right;">
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="openDetalle('${s.id}')">
          <i data-lucide="file-check" style="width:12px; height:12px;"></i> Ver / Evaluar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

// HELPERS DE INTERFAZ
function getBadgeHTML(estado) {
  if (estado === "Pendiente") return `<span class="badge badge-pendiente">• Pendiente</span>`;
  if (estado === "En proceso" || estado === "EVALUANDO") return `<span class="badge badge-proceso">• En proceso</span>`;
  if (estado === "Finalizada" || estado === "APROBADO") return `<span class="badge badge-finalizada">• Finalizada</span>`;
  return `<span class="badge">${estado}</span>`;
}

function updateStats() {
  const elPostulantes = document.getElementById("dash-stat-postulantes");
  const elPendientes = document.getElementById("dash-stat-pendientes");
  const elProceso = document.getElementById("dash-stat-proceso");
  const elFinalizadas = document.getElementById("dash-stat-finalizadas");

  if (elPostulantes) elPostulantes.innerText = postulantes.length;
  if (elPendientes) elPendientes.innerText = solicitudes.filter(s => s.estado === "Pendiente").length;
  if (elProceso) elProceso.innerText = solicitudes.filter(s => s.estado === "En proceso" || s.estado === "EVALUANDO").length;
  if (elFinalizadas) elFinalizadas.innerText = solicitudes.filter(s => s.estado === "Finalizada" || s.estado === "APROBADO").length;
}

// FILTROS
function filterPostulantes() {
  const searchInput = document.getElementById("searchPostulante");
  const familiaInput = document.getElementById("filterFamiliaPostulante");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const familia = familiaInput ? familiaInput.value : "";

  const filtered = postulantes.filter(p => {
    const matchSearch = (p.nombre && p.nombre.toLowerCase().includes(search)) ||
                        (p.cargo && p.cargo.toLowerCase().includes(search)) ||
                        (p.email && p.email.toLowerCase().includes(search)) ||
                        (p.tel && p.tel.toLowerCase().includes(search));
    const matchFamilia = familia === "" || p.familia === familia;
    return matchSearch && matchFamilia;
  });

  renderPostulantes(filtered);
}

function clearPostulanteFilter() {
  if (document.getElementById("searchPostulante")) document.getElementById("searchPostulante").value = "";
  if (document.getElementById("filterFamiliaPostulante")) document.getElementById("filterFamiliaPostulante").value = "";
  renderPostulantes();
}

function filterSolicitudes() {
  const estado = document.getElementById("filterEstado") ? document.getElementById("filterEstado").value : "";
  const familia = document.getElementById("filterFamilia") ? document.getElementById("filterFamilia").value : "";

  const filtered = solicitudes.filter(s => {
    const matchEstado = estado === "" || s.estado === estado;
    const matchFamilia = familia === "" || s.familia === familia;
    return matchEstado && matchFamilia;
  });

  renderSolicitudes(filtered);
}

function resetSolicitudFilters() {
  if (document.getElementById("filterEstado")) document.getElementById("filterEstado").value = "";
  if (document.getElementById("filterFamilia")) document.getElementById("filterFamilia").value = "";
  renderSolicitudes();
}

// GESTIÓN DE SELECCIÓN Y FORMULARIO DE SOLICITUD
function populatePostulanteSelect() {
  const select = document.getElementById("selectPostulante");
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = `<option value="">Selecciona un postulante recibido...</option>`;
  postulantes.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} - ${p.cargo}`;
    select.appendChild(option);
  });
  if (currentVal) select.value = currentVal;
}

function onSelectPostulanteChange() {
  const select = document.getElementById("selectPostulante");
  if (!select) return;
  const id = select.value;
  const p = postulantes.find(item => String(item.id) === String(id));
  if (p) {
    document.getElementById("cargoAuto").value = p.cargo || "";
    document.getElementById("familiaAuto").value = p.familia || "";
  } else {
    document.getElementById("cargoAuto").value = "";
    document.getElementById("familiaAuto").value = "";
  }
}

function iniciarSolicitudDesdePostulante(postulanteId) {
  navigateTo("nueva");
  const select = document.getElementById("selectPostulante");
  if (select) {
    select.value = postulanteId;
    onSelectPostulanteChange();
  }
  const today = new Date().toISOString().split('T')[0];
  const fechaInput = document.getElementById("fechaSolicitud");
  if (fechaInput) fechaInput.value = today;
}

// CREAR SOLICITUD (POST /api/solicitudes)
async function handleCreateSolicitud(e) {
  e.preventDefault();
  const pId = document.getElementById("selectPostulante").value;
  const postulante = postulantes.find(p => String(p.id) === String(pId));

  if (!postulante) {
    alert("Por favor selecciona un postulante de la lista.");
    return;
  }

  const payload = {
    postulanteId: Number(postulante.id),
    fecha: document.getElementById("fechaSolicitud").value,
    responsable: document.getElementById("evaluadorAsignado").value,
    observaciones: document.getElementById("obsIniciales").value
  };

  try {
    const response = await fetch(`${API_BASE}/api/solicitudes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const nuevaSol = await response.json();
      solicitudes.unshift(nuevaSol);
      alert("¡Solicitud creada y guardada en el servidor exitosamente!");
    } else {
      throw new Error("El servidor devolvió un error: " + response.status);
    }
  } catch (error) {
    console.warn("Error enviando al backend, guardando en memoria local:", error);
    const newSol = {
      id: `SOL-10${solicitudes.length + 1}`,
      postulanteId: postulante.id,
      nombre: postulante.nombre,
      cargo: postulante.cargo,
      familia: postulante.familia,
      fecha: payload.fecha,
      responsable: payload.responsable,
      estado: "Pendiente",
      comentarios: payload.observaciones
    };
    solicitudes.unshift(newSol);
    alert("¡Solicitud registrada en modo local!");
  }

  renderDashboard();
  renderSolicitudes();
  navigateTo("listado");
}

// DETALLE Y EVALUACIÓN
function openDetalle(solicitudId) {
  selectedSolicitudId = solicitudId;
  renderDetalleEvaluacion(solicitudId);
  navigateTo("detalle");
}

function renderDetalleEvaluacion(solicitudId) {
  const sol = solicitudes.find(s => String(s.id) === String(solicitudId)) || solicitudes[0];
  if (!sol) return;

  const postulante = postulantes.find(p => String(p.id) === String(sol.postulanteId)) || {
    nombre: sol.nombre,
    email: sol.email || "candidato@ejemplo.com",
    tel: sol.tel || "+56 9 8452 1190",
    cv: sol.cv || "Curriculum.pdf"
  };

  document.getElementById("det-id-badge").innerText = sol.id;
  
  const estadoBadge = document.getElementById("det-estado-badge");
  if (estadoBadge) {
    estadoBadge.outerHTML = `<span class="badge" id="det-estado-badge">${getBadgeHTML(sol.estado)}</span>`;
  }
  
  document.getElementById("det-nombre").innerText = sol.nombre || postulante.nombre;
  document.getElementById("det-correo").innerText = postulante.email || sol.email || "-";
  document.getElementById("det-telefono").innerText = postulante.tel || sol.tel || "-";
  document.getElementById("det-cargo").innerText = sol.cargo;
  document.getElementById("det-familia").innerText = sol.familia;
  document.getElementById("det-fecha").innerText = sol.fecha;
  document.getElementById("det-evaluador").innerText = sol.responsable || "Psic. Valeria Lagos";
  
  const cvNombre = sol.cv || postulante.cv || "CV.pdf";
  document.getElementById("det-cv-name").innerText = `Descargar ${cvNombre}`;
  
  if (document.getElementById("det-obs-ingreso")) {
    document.getElementById("det-obs-ingreso").innerText = sol.observaciones || sol.comentarios || "Sin observaciones previas.";
  }

  if (document.getElementById("detEstadoSelect")) {
    document.getElementById("detEstadoSelect").value = sol.estado || "Pendiente";
  }
  if (document.getElementById("detComentarios")) {
    document.getElementById("detComentarios").value = sol.comentarios || "";
  }
  if (document.getElementById("detFechaEval") && sol.fechaEvaluacion) {
    document.getElementById("detFechaEval").value = sol.fechaEvaluacion;
  }

  // Criterios checklist
  if (document.getElementById("chk1")) document.getElementById("chk1").checked = !!sol.criterioCompetencias;
  if (document.getElementById("chk2")) document.getElementById("chk2").checked = !!sol.criterioZulliger;
  if (document.getElementById("chk3")) document.getElementById("chk3").checked = !!sol.criterioReferencias;
  if (document.getElementById("chk4")) document.getElementById("chk4").checked = !!sol.criterioFitCultural;
}

// GUARDAR EVALUACIÓN (PUT /api/solicitudes/{id})
async function handleSaveEvaluacion(e) {
  e.preventDefault();
  const sol = solicitudes.find(s => String(s.id) === String(selectedSolicitudId));
  if (!sol) return;

  const payload = {
    estado: document.getElementById("detEstadoSelect").value,
    fechaEvaluacion: document.getElementById("detFechaEval") ? document.getElementById("detFechaEval").value : "",
    comentarios: document.getElementById("detComentarios").value,
    criterioCompetencias: document.getElementById("chk1") ? document.getElementById("chk1").checked : false,
    criterioZulliger: document.getElementById("chk2") ? document.getElementById("chk2").checked : false,
    criterioReferencias: document.getElementById("chk3") ? document.getElementById("chk3").checked : false,
    criterioFitCultural: document.getElementById("chk4") ? document.getElementById("chk4").checked : false
  };

  try {
    const response = await fetch(`${API_BASE}/api/solicitudes/${selectedSolicitudId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const actualizada = await response.json();
      Object.assign(sol, actualizada);
      alert("¡Evaluación y estado actualizados correctamente en el servidor!");
    } else {
      throw new Error("Respuesta no satisfactoria: " + response.status);
    }
  } catch (error) {
    console.warn("Error conectando al backend, actualizando en memoria local:", error);
    sol.estado = payload.estado;
    sol.fechaEvaluacion = payload.fechaEvaluacion;
    sol.comentarios = payload.comentarios;
    sol.criterioCompetencias = payload.criterioCompetencias;
    sol.criterioZulliger = payload.criterioZulliger;
    sol.criterioReferencias = payload.criterioReferencias;
    sol.criterioFitCultural = payload.criterioFitCultural;
    alert("Evaluación actualizada en modo local.");
  }

  renderDashboard();
  renderSolicitudes();
  renderDetalleEvaluacion(selectedSolicitudId);
}

// DESCARGA DE CURRÍCULUM VITAE
function descargarCvPostulante(id, cvNombre) {
  const url = `${API_BASE}/api/postulantes/${id}/cv`;
  window.open(url, "_blank");
}

function descargarCvDetalle() {
  const sol = solicitudes.find(s => String(s.id) === String(selectedSolicitudId)) || solicitudes[0];
  if (sol && sol.postulanteId) {
    window.open(`${API_BASE}/api/postulantes/${sol.postulanteId}/cv`, "_blank");
  } else {
    alert("Archivo no disponible para este postulante.");
  }
}

// PORTAL PÚBLICO: MANIPULACIÓN DE ARCHIVO Y ENVÍO
function updateFileName(input) {
  if (input.files && input.files[0]) {
    document.getElementById("cvFileNameDisplay").innerText = `Archivo cargado: ${input.files[0].name}`;
  }
}

async function handlePortalPostulacion(e) {
  e.preventDefault();

  const nombre = document.getElementById("portalNombre").value;
  const email = document.getElementById("portalEmail").value;
  const tel = document.getElementById("portalTel").value;
  const cargo = document.getElementById("portalCargo").value;
  const familia = document.getElementById("portalFamilia").value;
  const observaciones = document.getElementById("portalObs") ? document.getElementById("portalObs").value : "";
  const fileInput = document.getElementById("portalCvFile");

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("email", email);
  formData.append("tel", tel);
  formData.append("cargo", cargo);
  formData.append("familia", familia);
  formData.append("observaciones", observaciones);

  if (fileInput && fileInput.files && fileInput.files[0]) {
    formData.append("cv", fileInput.files[0]);
  }

  try {
    const response = await fetch(`${API_BASE}/api/postulantes`, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const nuevoPostulante = await response.json();
      postulantes.unshift(nuevoPostulante);
      alert("¡Postulación enviada con éxito! Tu solicitud ha sido registrada en el panel interno de RRHH mediante el backend.");
    } else {
      throw new Error("Error en servidor al registrar postulante: " + response.status);
    }
  } catch (error) {
    console.warn("Aviso: Falló la subida al backend, registrando en memoria local:", error);
    const newPostulante = {
      id: `${postulantes.length + 1}`,
      nombre: nombre,
      email: email,
      tel: tel,
      cargo: cargo,
      familia: familia,
      fecha: new Date().toISOString().split('T')[0],
      cv: fileInput && fileInput.files[0] ? fileInput.files[0].name : `CV_${nombre.replace(/\s+/g, '_')}.pdf`
    };
    postulantes.unshift(newPostulante);
    alert("¡Postulación enviada con éxito! (Registrada localmente)");
  }

  e.target.reset();
  const fileDisplay = document.getElementById("cvFileNameDisplay");
  if (fileDisplay) fileDisplay.innerText = "Haz clic para subir tu CV aquí";

  renderPostulantes();
  populatePostulanteSelect();
  updateStats();
  navigateTo("postulantes");
}