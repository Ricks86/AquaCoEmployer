import React, { useState } from 'react';
import { Plus, Info, Search, FileText, FilePlus } from 'lucide-react';

const PostulantesView = ({
  postulantes,
  onNavigate,
  onIniciarSolicitud,
  onDescargarCv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');

  const familias = [
    'Tecnología/TI',
    'Operaciones y Logística',
    'Recursos Humanos',
    'Finanzas y Contabilidad',
    'Ventas y Marketing',
  ];

  const filtered = postulantes.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.cargo && p.cargo.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.tel && p.tel.toLowerCase().includes(term));
    const matchFamilia = selectedFamilia === '' || p.familia === selectedFamilia;
    return matchSearch && matchFamilia;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Postulantes Recibidos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bandeja de currículums y antecedentes ingresados para cargos de AquaChile.
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

      {/* Info Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-start gap-3">
        <div className="text-sky-600 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-sky-900 mb-0.5">
            Bandeja de recepción de postulantes externos
          </div>
          <div className="text-sky-800 leading-relaxed">
            Bandeja de postulantes recibidos a través del Portal de Empleos / Postulación Externa. Los
            reclutadores pueden revisar antecedentes en modo lectura, examinar sus CVs y derivar
            directamente a evaluación psicológica mediante el botón "Iniciar Solicitud".
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cargo, email o teléfono..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setSelectedFamilia('');
          }}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md text-xs font-medium cursor-pointer transition-colors"
        >
          Limpiar
        </button>

        <select
          value={selectedFamilia}
          onChange={(e) => setSelectedFamilia(e.target.value)}
          className="w-full sm:w-56 py-1.5 px-3 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 bg-white"
        >
          <option value="">Todas las Familias</option>
          {familias.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Postulante</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Familia / Cargo Postulado</th>
                <th className="py-3 px-4">Fecha Postulación</th>
                <th className="py-3 px-4">Currículum Vitae</th>
                <th className="py-3 px-4 text-right">Acciones de Selección</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const initial = p.nombre ? p.nombre.charAt(0).toUpperCase() : 'P';
                const cvDisplay =
                  p.cv && p.cv.length > 18 ? p.cv.substring(0, 16) + '...' : p.cv || 'CV.pdf';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{p.nombre}</div>
                          <div className="text-[10px] text-slate-400">ID Postulante #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{p.email}</div>
                      <div className="text-[11px] text-slate-400">{p.tel || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.cargo}</div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium mt-0.5">
                        {p.familia}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{p.fecha}</td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onDescargarCv(p.id, p.cv)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>{cvDisplay}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onIniciarSolicitud(p.id)}
                        className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-[11px] px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-xs"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Iniciar Solicitud</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No se encontraron postulantes con los filtros seleccionados.
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

export default PostulantesView;
