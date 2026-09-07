import React from 'react';
import { Truck, Clock, BarChart3, Wrench, ShieldAlert } from 'lucide-react';

export const EmbarquesDashboardPlaceholder: React.FC = () => {
  return (
    <div className="bg-theme-surface p-12 border border-theme-subtle rounded-3xl shadow-xs text-center space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <Truck className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs uppercase tracking-wider">
          Módulo en construcción
        </span>
        <h2 className="text-xl font-black text-theme-main">
          Dashboard de Embarques & Camiones
        </h2>
        <p className="text-xs text-theme-muted leading-relaxed">
          En esta sección se visualizarán las métricas de despacho diario, ocupación volumétrica de flota, tiempos de carga en andén y monitoreo de entregas en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
        <div className="p-4 rounded-2xl bg-white border border-theme-subtle shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <Truck className="w-4 h-4" />
            <span>Flota Activa</span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Monitoreo de unidades en andén, en ruta y en mantenimiento preventivo.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-theme-subtle shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <BarChart3 className="w-4 h-4" />
            <span>Capacidad & Rutas</span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Cálculo de factor de estiba y balanceo de carga por zona metropolitana.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-theme-subtle shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <Clock className="w-4 h-4" />
            <span>Puntualidad de Salida</span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Cumplimiento de ventanas horarias de salida desde CEDIS y sucursales.
          </p>
        </div>
      </div>
    </div>
  );
};
