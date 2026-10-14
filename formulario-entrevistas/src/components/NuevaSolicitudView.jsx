import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const NuevaSolicitudView = ({
  postulantes,
  initialPostulanteId,
  onNavigate,
  onCreateSolicitud,
}) => {
  const [selectedPostulanteId, setSelectedPostulanteId] = useState(initialPostulanteId || '');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [responsable, setResponsable] = useState('Psic. Valeria Lagos');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (initialPostulanteId) {
      setSelectedPostulanteId(initialPostulanteId);
    }
  }, [initialPostulanteId]);

  const selectedPostulante = postulantes.find(
    (p) => String(p.id) === String(selectedPostulanteId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPostulante) {
      alert('Por favor selecciona un postulante de la lista.');
      return;
    }

    onCreateSolicitud({
      postulanteId: selectedPostulante.id,
      postulanteNombre: selectedPostulante.nombre,
      cargo: selectedPostulante.cargo,
      familia: selectedPostulante.familia,
      fecha,
      responsable,
      observaciones,
    });
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Botón Volver */}
      <button
        type="button"
        onClick={() => onNavigate('listado')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a Solicitudes</span>
      </button>

      <div>
        <h1 className="text-xl font-bold text-slate-900">Crear Nueva Solicitud de Evaluación</h1>
        <p className="text-xs text-slate-500 mt-1">
          Asocia a un postulante recibido para iniciar su batería de pruebas psicolaborales.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seleccionar Postulante */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Seleccionar Postulante *
            </label>
            <select
              value={selectedPostulanteId}
              onChange={(e) => setSelectedPostulanteId(e.target.value)}
              required
              className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            >
              <option value="">Selecciona un postulante recibido...</option>
              {postulantes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - {p.cargo}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Cargo y Familia (Automáticos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cargo a Postular (Automático)
              </label>
              <input
                type="text"
                readOnly
                value={selectedPostulante ? selectedPostulante.cargo : ''}
                placeholder="Selecciona un postulante arriba"
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-xs text-slate-600 bg-slate-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Familia de Cargo (Automática)
              </label>
              <input
                type="text"
                readOnly
                value={selectedPostulante ? selectedPostulante.familia : ''}
                placeholder="Selecciona un postulante arriba"
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-xs text-slate-600 bg-slate-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Grid Fecha y Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de Solicitud *
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Responsable / Evaluador Asignado *
              </label>
              <input
                type="text"
                required
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>

          {/* Estado Inicial */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estado Inicial</label>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-md font-semibold text-xs">
              Pendiente
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              El estado se actualiza en el panel de evaluación psicológica.
            </p>
          </div>

          {/* Observaciones Iniciales */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observaciones Iniciales
            </label>
            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Comentarios del requerimiento del área solicitante en AquaChile..."
              className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            ></textarea>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('listado')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Crear Solicitud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaSolicitudView;
