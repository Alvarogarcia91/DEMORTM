import React from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Calendar,
  Clock,
} from 'lucide-react';
import { COMPLETED_JOBS_SUMMARY_V8 } from '../../../data/mockProductionDashboardV8';

export const CompletedJobsSummary: React.FC = () => {
  const data = COMPLETED_JOBS_SUMMARY_V8;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <PackageCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Trabajos Completados</h3>
            <p className="text-xs text-theme-muted">
              Cumplimiento de órdenes finalizadas y entregadas a PT.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-black px-2 py-0.5">
          {data.week.onTimePercent}% a tiempo
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Hoy */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Cierre de Hoy
          </span>
          <b className="text-lg font-black text-theme-main block font-mono">
            {data.today.completedOpsCount} OP
          </b>
          <p className="text-theme-muted text-[11px]">
            {data.today.goodUnitsProduced.toLocaleString('es-MX')} piezas buenas
          </p>
        </div>

        {/* Semana */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Acumulado Semanal
          </span>
          <b className="text-lg font-black text-theme-main block font-mono">
            {data.week.completedOpsCount} OP
          </b>
          <div className="flex items-center gap-2 text-[10px] font-mono text-theme-muted">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.week.aheadCount} adel.</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{data.week.delayedCount} atras.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
