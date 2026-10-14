import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PostulantesView from './components/PostulantesView';
import ListadoSolicitudesView from './components/ListadoSolicitudesView';
import NuevaSolicitudView from './components/NuevaSolicitudView';
import DetalleEvaluacionView from './components/DetalleEvaluacionView';
import PortalPostulacionView from './components/PortalPostulacionView';

const API_BASE =
  window.location.protocol.startsWith('http') && window.location.port === '8080'
    ? ''
    : 'http://localhost:8080';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [postulantes, setPostulantes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [preselectedPostulanteId, setPreselectedPostulanteId] = useState('');
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    checking: true,
    message: 'Conectando con Backend...',
  });

  // Carga todos los datos reales desde la base de datos a través de Spring Boot
  const fetchBackendData = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true, message: 'Conectando...' }));
    try {
      const [resPostulantes, resSolicitudes] = await Promise.all([
        fetch(`${API_BASE}/api/postulantes`),
        fetch(`${API_BASE}/api/solicitudes`),
      ]);

      if (!resPostulantes.ok || !resSolicitudes.ok) {
        throw new Error('Respuesta no satisfactoria del servidor');
      }

      const dataPostulantes = await resPostulantes.json();
      const dataSolicitudes = await resSolicitudes.json();

      setPostulantes(Array.isArray(dataPostulantes) ? dataPostulantes : []);
      setSolicitudes(Array.isArray(dataSolicitudes) ? dataSolicitudes : []);

      if (Array.isArray(dataSolicitudes) && dataSolicitudes.length > 0) {
        setSelectedSolicitudId((current) => current || dataSolicitudes[0].id);
      }

      setBackendStatus({
        connected: true,
        checking: false,
        message: 'Backend Conectado (Oracle DB)',
      });
    } catch (err) {
      console.error('Error al conectar con el backend:', err);
      setBackendStatus({
        connected: false,
        checking: false,
        message: 'Sin conexión con Backend',
      });
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const handleNavigate = (view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetalle = (solicitudId) => {
    setSelectedSolicitudId(solicitudId);
    handleNavigate('detalle');
  };

  const handleIniciarSolicitudDesdePostulante = (postulanteId) => {
    setPreselectedPostulanteId(postulanteId);
    handleNavigate('nueva');
  };

  const handleDescargarCv = (postulanteId, cvNombre) => {
    const url = `${API_BASE}/api/postulantes/${postulanteId}/cv`;
    window.open(url, '_blank');
  };

  const handleCreateSolicitud = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postulanteId: Number(payload.postulanteId),
          fecha: payload.fecha,
          responsable: payload.responsable,
          observaciones: payload.observaciones,
        }),
      });

      if (!res.ok) {
        throw new Error('Error en el servidor al crear la solicitud: ' + res.status);
      }

      const nuevaSol = await res.json();
      setSolicitudes((prev) => [nuevaSol, ...prev]);
      alert('¡Solicitud creada y guardada exitosamente en la base de datos!');
      handleNavigate('listado');
    } catch (err) {
      console.error('Error al guardar solicitud:', err);
      alert('Error: No se pudo registrar la solicitud en la base de datos.');
    }
  };

  const handleSaveEvaluacion = async (solicitudId, payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/solicitudes/${solicitudId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar evaluación: ' + res.status);
      }

      const actualizada = await res.json();
      setSolicitudes((prev) =>
        prev.map((s) => (String(s.id) === String(solicitudId) ? { ...s, ...actualizada } : s))
      );
      alert('¡Evaluación y estado actualizados correctamente en la base de datos!');
    } catch (err) {
      console.error('Error al actualizar evaluación:', err);
      alert('Error: No se pudo guardar la evaluación en la base de datos.');
    }
  };

  const handlePortalPostulacion = async (payload) => {
    const formData = new FormData();
    formData.append('nombre', payload.nombre);
    formData.append('email', payload.email);
    formData.append('tel', payload.tel);
    formData.append('cargo', payload.cargo);
    formData.append('familia', payload.familia);
    formData.append('observaciones', payload.observaciones);
    if (payload.file) {
      formData.append('cv', payload.file);
    }

    try {
      const res = await fetch(`${API_BASE}/api/postulantes`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error del servidor al registrar postulante: ' + res.status);
      }

      const nuevoPostulante = await res.json();
      setPostulantes((prev) => [nuevoPostulante, ...prev]);
      alert('¡Postulación enviada con éxito! Registrada en la base de datos de Oracle.');
      handleNavigate('postulantes');
    } catch (err) {
      console.error('Error al enviar postulación:', err);
      alert('Error: No se pudo registrar la postulación en el servidor.');
    }
  };

  const currentSolicitud =
    solicitudes.find((s) => String(s.id) === String(selectedSolicitudId)) ||
    (solicitudes.length > 0 ? solicitudes[0] : null);

  const currentPostulante = currentSolicitud
    ? postulantes.find((p) => String(p.id) === String(currentSolicitud.postulanteId))
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Header
        backendStatus={backendStatus}
        onRefreshBackend={fetchBackendData}
        onOpenPortal={() => handleNavigate('portal')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeView === 'dashboard' && (
            <DashboardView
              postulantes={postulantes}
              solicitudes={solicitudes}
              onNavigate={handleNavigate}
              onOpenDetalle={handleOpenDetalle}
            />
          )}

          {activeView === 'postulantes' && (
            <PostulantesView
              postulantes={postulantes}
              onNavigate={handleNavigate}
              onIniciarSolicitud={handleIniciarSolicitudDesdePostulante}
              onDescargarCv={handleDescargarCv}
            />
          )}

          {activeView === 'listado' && (
            <ListadoSolicitudesView
              solicitudes={solicitudes}
              onNavigate={handleNavigate}
              onOpenDetalle={handleOpenDetalle}
            />
          )}

          {activeView === 'nueva' && (
            <NuevaSolicitudView
              postulantes={postulantes}
              initialPostulanteId={preselectedPostulanteId}
              onNavigate={handleNavigate}
              onCreateSolicitud={handleCreateSolicitud}
            />
          )}

          {activeView === 'detalle' && (
            <DetalleEvaluacionView
              solicitud={currentSolicitud}
              postulante={currentPostulante}
              onNavigate={handleNavigate}
              onSaveEvaluacion={handleSaveEvaluacion}
              onDescargarCv={handleDescargarCv}
            />
          )}

          {activeView === 'portal' && (
            <PortalPostulacionView
              onNavigate={handleNavigate}
              onPostulacionSubmitted={handlePortalPostulacion}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
