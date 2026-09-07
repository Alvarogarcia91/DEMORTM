import React from 'react';
import {
  TrendingDown,
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  Factory,
} from 'lucide-react';

interface Props {
  planTotal: number;
  goodProduced: number;
  lostMinutes: number;
  scrapUnits: number;
  criticalOpsCount: number;
  criticalOpsUrgent: number;
  criticalMachinesCount: number;
  onViewRiskOrders: () => void;
}

export const ProductionExecutiveKpis: React.FC<Props> = ({
  planTotal,
  goodProduced,
  lostMinutes,
  scrapUnits,
  criticalOpsCount,
  criticalOpsUrgent,
  criticalMachinesCount,
  onViewRiskOrders,
}) => {
  const compliance = planTotal > 0 ? ((goodProduced / planTotal) * 100).toFixed(1) : '0.0';
  const totalPieces = goodProduced + scrapUnits;
  const scrapPercent = totalPieces > 0 ? ((scrapUnits / totalPieces) * 100).toFixed(1) : '0.0';
  const lostHours = Math.floor(lostMinutes / 60);
  const lostRemMin = lostMinutes % 60;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {/* KPI 1: Cumplimiento del Plan */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Cumplimiento Plan
          </span>
          <span className="flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <TrendingDown className="mr-0.5 h-3 w-3" />
            -2.5 pts
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-black text-theme-main">
            {compliance}%
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] text-theme-muted">
          {goodProduced.toLocaleString('es-MX')} / {planTotal.toLocaleString('es-MX')} plan
        </p>
      </div>

      {/* KPI 2: Producción Buena */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Producción Buena
          </span>
          <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-black text-theme-main">
            {goodProduced.toLocaleString('es-MX')}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-theme-muted">
          piezas / etiquetas buenas
        </p>
      </div>

      {/* KPI 3: Tiempo Perdido (4M) */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md border-l-4 border-l-rose-500">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Tiempo Perdido
          </span>
          <Clock className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400">
            {lostHours}h {lostRemMin}m
          </span>
        </div>
        <p className="mt-1 text-[11px] text-theme-muted">
          5 incidencias · Máquina 93m
        </p>
      </div>

      {/* KPI 4: Merma */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Merma
          </span>
          <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-black text-theme-main">
            {scrapPercent}%
          </span>
          <span className="text-[10px] text-theme-muted font-bold">
            ({scrapUnits.toLocaleString('es-MX')} pz)
          </span>
        </div>
        <p className="mt-1 text-[11px] text-theme-muted">
          Objetivo ≤ 5.0% demo
        </p>
      </div>

      {/* KPI 5: Entregas en Riesgo */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Entregas en Riesgo
          </span>
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
            {criticalOpsCount} OP
          </span>
          <button
            type="button"
            onClick={onViewRiskOrders}
            className="rounded-lg bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-black text-amber-800 dark:text-amber-300 hover:bg-amber-200"
          >
            [Ver]
          </button>
        </div>
        <p className="mt-1 text-[11px] text-theme-muted">
          {criticalOpsUrgent} críticas para entrega
        </p>
      </div>

      {/* KPI 6: Máquinas Críticas */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
            Máquinas Críticas
          </span>
          <Factory className="h-3.5 w-3.5 text-theme-primary" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-black text-theme-main">
            {criticalMachinesCount}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-theme-muted">
          1 detenida · 1 saturada
        </p>
      </div>
    </div>
  );
};
