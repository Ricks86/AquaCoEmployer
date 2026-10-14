import React from 'react';
import { Waves, Globe, RefreshCw } from 'lucide-react';

const Header = ({ backendStatus, onRefreshBackend, onOpenPortal }) => {
  return (
    <header className="h-14 bg-[#0b1329] text-white flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="bg-white w-8 h-8 rounded-md flex items-center justify-center shadow-sm">
          <Waves className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-white">
            AquaChile <span className="bg-teal-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">MVP</span>
          </span>
          <span className="text-[10px] text-slate-400">EvalPsico Laboral</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Connection status badge */}
        <button
          type="button"
          onClick={onRefreshBackend}
          title="Haz clic para comprobar conexión con Backend"
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            backendStatus.connected
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
              : backendStatus.checking
              ? 'bg-slate-800 text-slate-300 border-slate-700 animate-pulse'
              : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/50'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              backendStatus.connected
                ? 'bg-emerald-400'
                : backendStatus.checking
                ? 'bg-slate-400'
                : 'bg-amber-400'
            }`}
          ></span>
          <span>{backendStatus.message}</span>
          <RefreshCw className={`w-3 h-3 ml-0.5 text-slate-400 ${backendStatus.checking ? 'animate-spin' : ''}`} />
        </button>

        {/* Portal Público Button */}
        <button
          type="button"
          onClick={onOpenPortal}
          className="bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Portal Público</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
          <div className="text-right text-[11px] hidden sm:block">
            <span className="font-semibold block text-slate-100">Psic. Valeria Lagos</span>
            <span className="text-slate-400 text-[10px]">Recursos Humanos</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-inner">
            VL
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
