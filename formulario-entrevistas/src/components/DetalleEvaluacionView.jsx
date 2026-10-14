import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ClipboardCheck, Download, Save } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DetalleEvaluacionView = ({
  solicitud,
  postulante,
  onNavigate,
  onSaveEvaluacion,
  onDescargarCv,
}) => {
  const [estado, setEstado] = useState(solicitud?.estado || 'Pendiente');
  const [fechaEval, setFechaEval] = useState(
    solicitud?.fechaEvaluacion || new Date().toISOString().split('T')[0]
  );
  const [comentarios, setComentarios] = useState(solicitud?.comentarios || '');
  const [criterioCompetencias, setCriterioCompetencias] = useState(
    !!solicitud?.criterioCompetencias
  );
  const [criterioZulliger, setCriterioZulliger] = useState(!!solicitud?.criterioZulliger);
  const [criterioReferencias, setCriterioReferencias] = useState(
    !!solicitud?.criterioReferencias
  );
  const [criterioFitCultural, setCriterioFitCultural] = useState(
    !!solicitud?.criterioFitCultural
  );

  useEffect(() => {
    if (solicitud) {
      setEstado(solicitud.estado || 'Pendiente');
      setFechaEval(solicitud.fechaEvaluacion || new Date().toISOString().split('T')[0]);
      setComentarios(solicitud.comentarios || '');
      setCriterioCompetencias(!!solicitud.criterioCompetencias);
      setCriterioZulliger(!!solicitud.criterioZulliger);
      setCriterioReferencias(!!solicitud.criterioReferencias);
      setCriterioFitCultural(!!solicitud.criterioFitCultural);
    }
  }, [solicitud]);

  if (!solicitud) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
        <p>No hay ninguna solicitud seleccionada.</p>
        <button
          type="button"
          onClick={() => onNavigate('listado')}
          className="mt-3 text-xs text-teal-600 font-bold hover:underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSaveEvaluacion(solicitud.id, {
      estado,
      fechaEvaluacion: fechaEval,
      comentarios,
      criterioCompetencias,
      criterioZulliger,
      criterioReferencias,
      criterioFitCultural,
    });
  };

  const candNombre = solicitud.nombre || postulante?.nombre || 'Candidato';
  const candEmail = postulante?.email || solicitud.email || '-';
  const candTel = postulante?.tel || solicitud.tel || '-';
  const candCv = solicitud.cv || postulante?.cv || 'CV.pdf';

  return (
    <div className="space-y-4">
      {/* Botón Volver */}
      <button
        type="button"
        onClick={() => onNavigate('listado')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a Solicitudes</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold text-slate-900">Detalle y Registro de Evaluación</h1>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">
            {solicitud.id}
          </span>
          <StatusBadge estado={solicitud.estado} />
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Ficha técnica y emisión del informe de aptitud psicolaboral.
      </p>

      {/* Grid 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Tarjeta Izquierda: Ficha del Candidato */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 font-bold text-sm text-slate-900">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Ficha del Candidato</span>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                CANDIDATO
              </div>
              <div className="font-bold text-base text-slate-900">{candNombre}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  CORREO
                </div>
                <div className="text-slate-800">{candEmail}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  TELÉFONO
                </div>
                <div className="text-slate-800">{candTel}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                CARGO POSTULADO
              </div>
              <div className="font-bold text-teal-700">{solicitud.cargo}</div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                FAMILIA DE CARGO
              </div>
              <div className="text-slate-800">{solicitud.familia}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  FECHA SOLICITUD
                </div>
                <div className="text-slate-800">{solicitud.fecha}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  EVALUADOR ASIGNADO
                </div>
                <div className="text-slate-800">
                  {solicitud.responsable || 'Psic. Valeria Lagos'}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                OBSERVACIONES DE INGRESO
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-md text-[11px] text-slate-600 italic">
                {solicitud.comentarios ||
                  solicitud.observaciones ||
                  'Requerimiento de la Subgerencia de Transformación Digital.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDescargarCv(solicitud.postulanteId, candCv)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-slate-700 font-semibold text-xs transition-colors cursor-pointer mt-2"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Descargar {candCv}</span>
            </button>
          </div>
        </div>

        {/* Tarjeta Derecha: Registro Psicolaboral y Dictamen */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-1 font-bold text-sm text-slate-900">
            <ClipboardCheck className="w-4 h-4 text-sky-600" />
            <span>Registro Psicolaboral y Dictamen</span>
          </div>
          <div className="text-xs text-slate-500 mb-4">
            Actualiza las notas clínicas y define el avance del postulante
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Estado */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Estado del Proceso de Evaluación *
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
              >
                <option value="Pendiente">Pendiente (Por agendar)</option>
                <option value="En proceso">En proceso (Entrevista o batería rendida)</option>
                <option value="Finalizada">Finalizada (Apto / Informe listo)</option>
              </select>
            </div>

            {/* Fecha Evaluación */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Fecha de la Evaluación *
              </label>
              <input
                type="date"
                required
                value={fechaEval}
                onChange={(e) => setFechaEval(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
              />
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Comentarios / Observaciones Psicolaborales *
              </label>
              <textarea
                rows={4}
                required
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Postulante demuestra sólidos rasgos de pensamiento abstracto, autonomía técnica y alta orientación a resolución de problemas..."
                className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            {/* Checklist Criterios */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="font-bold text-[11px] text-slate-700 mb-2.5">
                Checklist de Criterios Básicos AquaChile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={criterioCompetencias}
                    onChange={(e) => setCriterioCompetencias(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Entrevista por Competencias</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={criterioZulliger}
                    onChange={(e) => setCriterioZulliger(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Test de Zulliger / Lüscher</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={criterioReferencias}
                    onChange={(e) => setCriterioReferencias(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Verificación Referencias</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={criterioFitCultural}
                    onChange={(e) => setCriterioFitCultural(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Fit Cultural AquaChile</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Evaluación y Actualizar Estado</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetalleEvaluacionView;
