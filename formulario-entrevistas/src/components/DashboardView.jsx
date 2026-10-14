import React from 'react';
import { Users, Clock, Loader, CheckCircle, Plus, ChevronRight, Eye, Globe } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DashboardView = ({ postulantes, solicitudes, onNavigate, onOpenDetalle }) => {
  const pendientesCount = solicitudes.filter(
    (s) => (s.estado || '').toLowerCase() === 'pendiente'
  ).length;

  const procesoCount = solicitudes.filter((s) => {
    const st = (s.estado || '').toLowerCase();
    return st === 'en proceso' || st === 'evaluando';
  }).length;

  const finalizadasCount = solicitudes.filter((s) => {
    const st = (s.estado || '').toLowerCase();
    return st === 'finalizada' || st === 'aprobado';
  }).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard General</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bienvenida de nuevo. Resumen del estado de procesos de evaluación psicolaboral.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('nueva')}
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3.5 py-2 rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nueva Solicitud</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Postulantes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Postulantes Recibidos</span>
            <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{postulantes.length}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Portal de empleo</span>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pendientes</span>
            <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{pendientesCount}</div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Por agendar
            </span>
          </div>
        </div>

        {/* En Proceso */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">En Proceso</span>
            <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <Loader className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{procesoCount}</div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              En evaluación
            </span>
          </div>
        </div>

        {/* Finalizadas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Finalizadas</span>
            <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{finalizadasCount}</div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Completadas
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Últimas Solicitudes */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-slate-900">Últimas Solicitudes Registradas</div>
            <div className="text-xs text-slate-500">Gestión inmediata de informes de idoneidad laboral</div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('listado')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidato</th>
                <th className="py-3 px-4">Cargo Postulado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {solicitudes.slice(0, 4).map((sol) => (
                <tr key={sol.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sol.nombre}</td>
                  <td className="py-3.5 px-4 text-slate-700">{sol.cargo}</td>
                  <td className="py-3.5 px-4 text-slate-500">{sol.fecha}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge estado={sol.estado} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDetalle(sol.id)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>Ver Evaluación</span>
                    </button>
                  </td>
                </tr>
              ))}
              {solicitudes.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    No hay solicitudes registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
