import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  Check,
} from 'lucide-react';
import {
  ProductionPeriod,
  ProductionAnalyticsArea,
  ProductionAnalyticsShift,
  ProductionAnalyticsSubView,
} from '../../../data/mockProduccionAnaliticaData';
import { PRODUCTION_MACHINES } from '../../../data/mockProduccionData';

interface ProductionAnalyticsHeaderProps {
  selectedPeriod: ProductionPeriod;
  onPeriodChange: (period: ProductionPeriod) => void;
  selectedArea: ProductionAnalyticsArea;
  onAreaChange: (area: ProductionAnalyticsArea) => void;
  selectedMachine: string;
  onMachineChange: (machine: string) => void;
  selectedShift: ProductionAnalyticsShift;
  onShiftChange: (shift: ProductionAnalyticsShift) => void;
  comparePrevious: boolean;
  onToggleComparePrevious: () => void;
  activeSubView: ProductionAnalyticsSubView;
  onSubViewChange: (subView: ProductionAnalyticsSubView) => void;
  onExportExcel: () => void;
  exportSuccessMessage: { filename: string; subtitle: string } | null;
  onDismissExportMessage: () => void;
}

export const ProductionAnalyticsHeader: React.FC<ProductionAnalyticsHeaderProps> = ({
  selectedPeriod,
  onPeriodChange,
  selectedArea,
  onAreaChange,
  selectedMachine,
  onMachineChange,
  selectedShift,
  onShiftChange,
  comparePrevious,
  onToggleComparePrevious,
  activeSubView,
  onSubViewChange,
  onExportExcel,
  exportSuccessMessage,
  onDismissExportMessage,
}) => {
  const periods: ProductionPeriod[] = ['Hoy', '7 días', '30 días', '90 días', 'Mes actual', 'Q3 2026'];
  const areas: ProductionAnalyticsArea[] = ['Todas', 'Offset', 'Flexografía', 'Acabados'];
  const shifts: ProductionAnalyticsShift[] = ['Todos', 'Turno A', 'Turno B', 'Turno C'];
  const subViews: ProductionAnalyticsSubView[] = ['Resumen', 'Máquinas', 'Operadores', 'Scrap y paros'];

  return (
    <div className="space-y-4">
      {/* Top Banner & Title */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Inteligencia Operativa &middot; Manufactura RTM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-400/40 shadow-2xs">
              Analítica de Producción v10
            </span>
            <span className="text-[10px] text-theme-muted font-medium">
              Datos consolidados en piso
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-theme-primary" />
            <span>ANALÍTICA DE PRODUCCIÓN</span>
          </h2>
          <p className="text-xs text-theme-muted">
            Patrones de eficiencia, paros 4M, scrap, variaciones de setup, capacidad por cliente y cumplimiento de entrega.
          </p>
        </div>

        {/* Action Controls & Global Filters */}
        <div className="flex items-center gap-2.5 flex-wrap justify-start xl:justify-end text-xs">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-theme-muted/50 border border-theme-subtle rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-theme-muted" />
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as ProductionPeriod)}
              className="bg-transparent border-none text-xs font-bold text-theme-main focus:outline-none cursor-pointer pr-1"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p === 'Hoy' ? 'Hoy (Turno en vivo)' : p === '30 días' ? 'Últimos 30 días' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="flex items-center gap-1 bg-theme-muted/50 border border-theme-subtle rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-theme-muted" />
            <select
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value as ProductionAnalyticsArea)}
              className="bg-transparent border-none text-xs font-bold text-theme-main focus:outline-none cursor-pointer pr-1"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a === 'Todas' ? 'Todas las áreas' : `Área: ${a}`}
                </option>
              ))}
            </select>
          </div>

          {/* Machine Filter */}
          <select
            value={selectedMachine}
            onChange={(e) => onMachineChange(e.target.value)}
            className="bg-theme-muted/50 border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">Todas las máquinas</option>
            {PRODUCTION_MACHINES.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Shift Filter */}
          <select
            value={selectedShift}
            onChange={(e) => onShiftChange(e.target.value as ProductionAnalyticsShift)}
            className="bg-theme-muted/50 border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            {shifts.map((s) => (
              <option key={s} value={s}>
                {s === 'Todos' ? 'Todos los turnos' : s}
              </option>
            ))}
          </select>

          {/* Compare Toggle */}
          <button
            type="button"
            onClick={onToggleComparePrevious}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              comparePrevious
                ? 'bg-theme-primary/10 border-theme-primary text-theme-primary'
                : 'bg-theme-surface border-theme-subtle text-theme-muted hover:text-theme-main'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                comparePrevious
                  ? 'bg-theme-primary border-theme-primary text-white'
                  : 'border-theme-muted text-transparent'
              }`}
            >
              <Check className="w-3 h-3" />
            </div>
            <span>Comparar vs anterior</span>
          </button>

          {/* Export Excel */}
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Sub-vistas Ligeras */}
      <div className="flex items-center justify-between border-b border-theme-subtle pb-1">
        <div className="flex items-center gap-2">
          {subViews.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => onSubViewChange(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubView === sub
                  ? 'bg-theme-main text-white shadow-xs'
                  : 'bg-theme-surface hover:bg-theme-muted text-theme-muted hover:text-theme-main border border-theme-subtle'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-theme-muted hidden sm:inline">
          {selectedArea === 'Todas' ? 'Planta Completa' : selectedArea} &middot;{' '}
          {selectedPeriod} &middot;{' '}
          {selectedShift === 'Todos' ? '3 Turnos' : selectedShift}
        </span>
      </div>

      {/* Export Success Message Banner */}
      {exportSuccessMessage && (
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-600/40 shadow-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-600/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100 font-bold block">
                Reporte generado: <span className="font-mono">{exportSuccessMessage.filename}</span>
              </strong>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                {exportSuccessMessage.subtitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissExportMessage}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};
