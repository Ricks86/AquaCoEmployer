import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  FilePlus,
  FileCheck,
  Globe,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'postulantes', label: 'Postulantes Recibidos', icon: Users },
    { id: 'listado', label: 'Listado Solicitudes', icon: FileText },
    { id: 'nueva', label: '+ Nueva Solicitud', icon: FilePlus },
    { id: 'detalle', label: 'Detalle Evaluación', icon: FileCheck },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col shrink-0 min-h-full">
      {/* Sección RRHH */}
      <div className="mb-6">
        <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase">
          PANEL INTERNO RRHH
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección Entorno Externo */}
      <div>
        <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase">
          ENTORNO EXTERNO
        </div>
        <button
          type="button"
          onClick={() => onNavigate('portal')}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left border ${
            activeView === 'portal'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-50/60 text-emerald-800 border-emerald-200/60 hover:bg-emerald-100/70'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <div className="leading-tight">Portal Postulación</div>
            <div className="text-[10px] text-emerald-600/80 font-normal">Vista pública candidatos</div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        </button>
      </div>

      {/* Footer Card */}
      <div className="mt-auto pt-6">
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-3 text-[11px] text-emerald-800 leading-relaxed shadow-xs">
          <div className="font-bold text-teal-800 mb-1 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            AquaChile RRHH
          </div>
          <div>Ambiente MVP. Postulantes sincronizados desde el portal externo y backend.</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
