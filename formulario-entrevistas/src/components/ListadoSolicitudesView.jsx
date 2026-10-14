import React, { useState } from 'react';
import { Plus, RotateCcw, FileCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ListadoSolicitudesView = ({ solicitudes, onNavigate, onOpenDetalle }) => {
  const [filterEstado, setFilterEstado] = useState('');
  const [filterFamilia, setFilterFamilia] = useState('');

  const familias = [
    'Tecnología/TI',
    'Operaciones y Logística',
    'Recursos Humanos',
    'Finanzas y Contabilidad',
  ];

  const filtered = solicitudes.filter((s) => {
    const matchEstado =
      filterEstado === '' ||
      (s.estado || '').toLowerCase() === filterEstado.toLowerCase();
    const matchFamilia = filterFamilia === '' || s.familia === filterFamilia;
    return matchEstado && matchFamilia;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Listado de Solicitudes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo de procesos y asignación de evaluaciones psicolaborales.
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

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-end shadow-xs">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            FILTRAR POR ESTADO
          </label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full py-1.5 px-3 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
          >
            <option value="">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            FILTRAR POR FAMILIA DE CARGO
          </label>
          <select
            value={filterFamilia}
            onChange={(e) => setFilterFamilia(e.target.value)}
            className="w-full py-1.5 px-3 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
          >
            <option value="">Todas las Familias</option>
            {familias.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setFilterEstado('');
              setFilterFamilia('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID Solicitud</th>
                <th className="py-3 px-4">Candidato</th>
                <th className="py-3 px-4">Cargo</th>
                <th className="py-3 px-4">Fecha Solicitud</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-500">{s.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.nombre}</td>
                  <td className="py-3.5 px-4 text-slate-700">{s.cargo}</td>
                  <td className="py-3.5 px-4 text-slate-500">{s.fecha}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.responsable || 'Psic. Valeria Lagos'}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge estado={s.estado} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDetalle(s.id)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver / Evaluar</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No hay solicitudes que coincidan con los filtros aplicados.
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

export default ListadoSolicitudesView;
