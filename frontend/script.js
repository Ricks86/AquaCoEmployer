// INITIAL DATA
let postulantes = [
  { id: "1", nombre: "Camila Morales Sepúlveda", email: "camila.morales@ejemplo.com", tel: "+56 9 8452 1190", cargo: "Desarrollador Full Stack Senior", familia: "Tecnología/TI", fecha: "2025-05-01", cv: "CV_Camila_Morales_2025.pdf" },
  { id: "2", nombre: "Rodrigo Alarcón Silva", email: "rodrigo.alarcon@ejemplo.com", tel: "+56 9 7611 3499", cargo: "Supervisor de Centro de Cultivo", familia: "Operaciones y Logística", fecha: "2025-05-03", cv: "CV_Rodrigo_Alarcon.pdf" },
  { id: "3", nombre: "Fernanda Tapia Herrera", email: "fernanda.tapia@ejemplo.com", tel: "+56 9 9123 4567", cargo: "Analista de Clima y Cultura", familia: "Recursos Humanos", fecha: "2025-04-26", cv: "CV_Fernanda_Tapia.pdf" },
  { id: "4", nombre: "Ignacio Valenzuela Soto", email: "ignacio.v@ejemplo.com", tel: "+56 9 6554 9901", cargo: "Auditor Interno de Costos", familia: "Finanzas y Contabilidad", fecha: "2025-05-04", cv: "CV_Ignacio_Valenzuela.pdf" },
  { id: "5", nombre: "Lorena Castillo Vega", email: "lorena.castillo@ejemplo.com", tel: "+56 9 8812 7744", cargo: "Key Account Manager Salmón Fresh", familia: "Ventas y Marketing", fecha: "2025-05-08", cv: "CV_Lorena_Castillo.pdf" }
];

let solicitudes = [
  { id: "SOL-101", postulanteId: "1", nombre: "Camila Morales Sepúlveda", cargo: "Desarrollador Full Stack Senior", familia: "Tecnología/TI", fecha: "2025-05-02", responsable: "Psic. Valeria Lagos", estado: "En proceso", comentarios: "Postulante demuestra sólidos rasgos de pensamiento abstracto, autonomía técnica y alta orientación a resolución de problemas. Buena compatibilidad con metodologías ágiles." },
  { id: "SOL-102", postulanteId: "2", nombre: "Rodrigo Alarcón Silva", cargo: "Supervisor de Centro de Cultivo", familia: "Operaciones y Logística", fecha: "2025-05-04", responsable: "Psic. Valeria Lagos", estado: "Pendiente", comentarios: "" },
  { id: "SOL-103", postulanteId: "3", nombre: "Fernanda Tapia Herrera", cargo: "Analista de Clima y Cultura", familia: "Recursos Humanos", fecha: "2025-04-28", responsable: "Psic. Valeria Lagos", estado: "Finalizada", comentarios: "Candidata idónea. Excelente dominio de herramientas de medición de clima organizacional." },
  { id: "SOL-104", postulanteId: "4", nombre: "Ignacio Valenzuela Soto", cargo: "Auditor Interno de Costos", familia: "Finanzas y Contabilidad", fecha: "2025-05-05", responsable: "Psic. Valeria Lagos", estado: "En proceso", comentarios: "" }
];

let selectedSolicitudId = "SOL-101";

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  
  // Setup Navigation listeners
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      navigateTo(view);
    });
  });

  document.getElementById("topPortalBtn").addEventListener("click", () => {
    navigateTo("portal");
  });

  // Initial Render
  renderDashboard();
  renderPostulantes();
  renderSolicitudes();
  populatePostulanteSelect();
  renderDetalleEvaluacion("SOL-101");
});

// NAVIGATION FUNCTION
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
  lucide.createIcons();
}

// RENDER POSTULANTES
function renderPostulantes(items = postulantes) {
  const tbody = document.getElementById("postulantes-table-body");
  tbody.innerHTML = "";

  items.forEach(p => {
    const avatarLetter = p.nombre.charAt(0);
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
        <div style="font-size:11px; color:#6b7280;">${p.tel}</div>
      </td>
      <td>
        <div style="font-weight:600;">${p.cargo}</div>
        <span class="badge" style="background:#f1f5f9; color:#475569; font-size:10px; padding:2px 6px;">${p.familia}</span>
      </td>
      <td style="color:#6b7280;">${p.fecha}</td>
      <td>
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px; color:#0f766e;" onclick="alert('Abriendo documento: ${p.cv}')">
          <i data-lucide="file-text" style="width:12px; height:12px;"></i> ${p.cv.length > 15 ? p.cv.substring(0, 12) + '...' : p.cv}
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

  lucide.createIcons();
}

// RENDER SOLICITUDES
function renderSolicitudes(items = solicitudes) {
  const tbody = document.getElementById("solicitudes-table-body");
  tbody.innerHTML = "";

  items.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700; color:#4b5563;">${s.id}</td>
      <td style="font-weight:700;">${s.nombre}</td>
      <td>${s.cargo}</td>
      <td style="color:#6b7280;">${s.fecha}</td>
      <td style="font-size:12px;">${s.responsable}</td>
      <td>${getBadgeHTML(s.estado)}</td>
      <td style="text-align:right;">
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="openDetalle('${s.id}')">
          <i data-lucide="file-check" style="width:12px; height:12px;"></i> Ver / Evaluar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

// HELPERS
function getBadgeHTML(estado) {
  if (estado === "Pendiente") return `<span class="badge badge-pendiente">• Pendiente</span>`;
  if (estado === "En proceso") return `<span class="badge badge-proceso">• En proceso</span>`;
  if (estado === "Finalizada") return `<span class="badge badge-finalizada">• Finalizada</span>`;
  return `<span class="badge">${estado}</span>`;
}

function updateStats() {
  document.getElementById("dash-stat-postulantes").innerText = postulantes.length;
  document.getElementById("dash-stat-pendientes").innerText = solicitudes.filter(s => s.estado === "Pendiente").length;
  document.getElementById("dash-stat-proceso").innerText = solicitudes.filter(s => s.estado === "En proceso").length;
  document.getElementById("dash-stat-finalizadas").innerText = solicitudes.filter(s => s.estado === "Finalizada").length;
}

// FILTERS
function filterPostulantes() {
  const search = document.getElementById("searchPostulante").value.toLowerCase();
  const familia = document.getElementById("filterFamiliaPostulante").value;

  const filtered = postulantes.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search) || p.cargo.toLowerCase().includes(search) || p.email.toLowerCase().includes(search);
    const matchFamilia = familia === "" || p.familia === familia;
    return matchSearch && matchFamilia;
  });

  renderPostulantes(filtered);
}

function clearPostulanteFilter() {
  document.getElementById("searchPostulante").value = "";
  document.getElementById("filterFamiliaPostulante").value = "";
  renderPostulantes();
}

function filterSolicitudes() {
  const estado = document.getElementById("filterEstado").value;
  const familia = document.getElementById("filterFamilia").value;

  const filtered = solicitudes.filter(s => {
    const matchEstado = estado === "" || s.estado === estado;
    const matchFamilia = familia === "" || s.familia === familia;
    return matchEstado && matchFamilia;
  });

  renderSolicitudes(filtered);
}

function resetSolicitudFilters() {
  document.getElementById("filterEstado").value = "";
  document.getElementById("filterFamilia").value = "";
  renderSolicitudes();
}

// FORM HANDLING
function populatePostulanteSelect() {
  const select = document.getElementById("selectPostulante");
  select.innerHTML = `<option value="">Selecciona un postulante recibido...</option>`;
  postulantes.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} - ${p.cargo}`;
    select.appendChild(option);
  });
}

function onSelectPostulanteChange() {
  const id = document.getElementById("selectPostulante").value;
  const p = postulantes.find(item => item.id === id);
  if (p) {
    document.getElementById("cargoAuto").value = p.cargo;
    document.getElementById("familiaAuto").value = p.familia;
  } else {
    document.getElementById("cargoAuto").value = "";
    document.getElementById("familiaAuto").value = "";
  }
}

function iniciarSolicitudDesdePostulante(postulanteId) {
  navigateTo("nueva");
  document.getElementById("selectPostulante").value = postulanteId;
  onSelectPostulanteChange();
  
  // Auto set date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("fechaSolicitud").value = today;
}

function handleCreateSolicitud(e) {
  e.preventDefault();
  const pId = document.getElementById("selectPostulante").value;
  const postulante = postulantes.find(p => p.id === pId);

  if (!postulante) return;

  const newSol = {
    id: `SOL-10${solicitudes.length + 1}`,
    postulanteId: postulante.id,
    nombre: postulante.nombre,
    cargo: postulante.cargo,
    familia: postulante.familia,
    fecha: document.getElementById("fechaSolicitud").value,
    responsable: document.getElementById("evaluadorAsignado").value,
    estado: "Pendiente",
    comentarios: document.getElementById("obsIniciales").value
  };

  solicitudes.unshift(newSol);
  renderDashboard();
  renderSolicitudes();
  navigateTo("listado");
  alert("¡Solicitud creada exitosamente!");
}

// DETALLE EVALUACION
function openDetalle(solicitudId) {
  selectedSolicitudId = solicitudId;
  renderDetalleEvaluacion(solicitudId);
  navigateTo("detalle");
}

function renderDetalleEvaluacion(solicitudId) {
  const sol = solicitudes.find(s => s.id === solicitudId) || solicitudes[0];
  const postulante = postulantes.find(p => p.id === sol.postulanteId) || postulantes[0];

  document.getElementById("det-id-badge").innerText = sol.id;
  document.getElementById("det-estado-badge").outerHTML = getBadgeHTML(sol.estado);
  
  document.getElementById("det-nombre").innerText = sol.nombre;
  document.getElementById("det-correo").innerText = postulante.email;
  document.getElementById("det-telefono").innerText = postulante.tel;
  document.getElementById("det-cargo").innerText = sol.cargo;
  document.getElementById("det-familia").innerText = sol.familia;
  document.getElementById("det-fecha").innerText = sol.fecha;
  document.getElementById("det-evaluador").innerText = sol.responsable;
  document.getElementById("det-cv-name").innerText = `Descargar ${postulante.cv}`;
  
  if (sol.comentarios) {
    document.getElementById("det-obs-ingreso").innerText = sol.comentarios;
  }

  document.getElementById("detEstadoSelect").value = sol.estado;
  document.getElementById("detComentarios").value = sol.comentarios || "";
}

function handleSaveEvaluacion(e) {
  e.preventDefault();
  const sol = solicitudes.find(s => s.id === selectedSolicitudId);
  if (sol) {
    sol.estado = document.getElementById("detEstadoSelect").value;
    sol.comentarios = document.getElementById("detComentarios").value;

    renderDashboard();
    renderSolicitudes();
    renderDetalleEvaluacion(selectedSolicitudId);
    alert("Evaluación y estado actualizados correctamente.");
  }
}

// PORTAL PUBLICO
function updateFileName(input) {
  if (input.files && input.files[0]) {
    document.getElementById("cvFileNameDisplay").innerText = `Archivo cargado: ${input.files[0].name}`;
  }
}

function handlePortalPostulacion(e) {
  e.preventDefault();

  const newPostulante = {
    id: `${postulantes.length + 1}`,
    nombre: document.getElementById("portalNombre").value,
    email: document.getElementById("portalEmail").value,
    tel: document.getElementById("portalTel").value,
    cargo: document.getElementById("portalCargo").value,
    familia: document.getElementById("portalFamilia").value,
    fecha: new Date().toISOString().split('T')[0],
    cv: `CV_${document.getElementById("portalNombre").value.replace(/\s+/g, '_')}.pdf`
  };

  postulantes.unshift(newPostulante);
  renderPostulantes();
  populatePostulanteSelect();
  updateStats();

  alert("¡Postulación enviada con éxito! Tu solicitud ha sido registrada en el panel interno de RRHH.");
  e.target.reset();
  document.getElementById("cvFileNameDisplay").innerText = "Haz clic para subir tu CV aquí";
  navigateTo("postulantes");
}