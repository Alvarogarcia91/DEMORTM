import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
} from 'lucide-react';
import { NEXT_STARTS_SUMMARY_V8 } from '../../../data/mockProductionDashboardV8';

interface Props {
  onNavigateToSupplyProgram: () => void;
}

export const NextStartsSummary: React.FC<Props> = ({ onNavigateToSupplyProgram }) => {
  const data = NEXT_STARTS_SUMMARY_V8;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Arranques Próximas 24 h</h3>
            <p className="text-xs text-theme-muted">
              Preparación y surtido previo de bobinas y herramentales.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToSupplyProgram}
          className="flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline"
        >
          <span>Ver surtido 24h</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-2.5">
          <span className="text-[10px] text-theme-muted uppercase font-bold block">Programados</span>
          <b className="text-lg font-black text-theme-main font-mono">{data.scheduledTotal}</b>
        </div>
        <div className="rounded-2xl border border-emerald-300/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 text-emerald-950 dark:text-emerald-200">
          <span className="text-[10px] uppercase font-bold block">Material Listo</span>
          <b className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">{data.materialReady}</b>
        </div>
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 text-amber-950 dark:text-amber-200">
          <span className="text-[10px] uppercase font-bold block">Por Surtir</span>
          <b className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">{data.materialPending}</b>
        </div>
        <div className="rounded-2xl border border-blue-300/60 bg-blue-50/40 dark:bg-blue-950/20 p-2.5 text-blue-950 dark:text-blue-200">
          <span className="text-[10px] uppercase font-bold block">Herramental</span>
          <b className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">{data.toolingPending}</b>
        </div>
      </div>

      <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden text-xs">
        {data.items.map((item) => (
          <div key={item.opFolio} className="flex items-center justify-between p-2.5 hover:bg-theme-muted/10">
            <div>
              <div className="flex items-center gap-2">
                <b className="font-mono text-theme-main">{item.opFolio}</b>
                <span className="text-theme-muted">·</span>
                <span className="text-theme-main font-bold">{item.client}</span>
              </div>
              <small className="text-theme-muted block">{item.machine} · {item.startTime}</small>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                item.statusTone === 'emerald'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
