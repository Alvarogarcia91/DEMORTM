import React from 'react';
import {
  Clock,
  Wrench,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { DASHBOARD_V8_SNAPSHOTS, DashboardPeriod } from '../../../data/mockProductionDashboardV8';

interface Props {
  period: DashboardPeriod;
  onNavigateToIncidents: () => void;
}

export const Losses4M: React.FC<Props> = ({ period, onNavigateToIncidents }) => {
  const snapshot = DASHBOARD_V8_SNAPSHOTS[period === 'Semana actual' ? 'Semana actual' : 'Hoy'];
  const losses = snapshot.losses4M;
  const totalMin = snapshot.lostMinutesTotal;
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Pérdidas · Control 4M</h3>
            <p className="text-xs text-theme-muted">
              Tiempo muerto distribuido por causa raíz técnica.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToIncidents}
          className="flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline"
        >
          <span>Ver incidencias</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {losses.map((item) => (
          <div key={item.category} className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-theme-main">{item.category}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-theme-muted text-[11px]">{item.note}</span>
                <b className="text-theme-main">{item.minutes} min</b>
                <span className="text-theme-muted text-[10px]">({item.percent}%)</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-theme-muted/20 overflow-hidden">
              <div
                className={`h-full ${item.color}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Resumen Total Matemático */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3 text-xs">
        <div>
          <span className="text-theme-muted uppercase tracking-wider text-[10px] font-bold block">
            Principal Incidencia Registrada:
          </span>
          <b className="text-theme-main text-xs">Ajuste de registro Mark Andy · 47 min</b>
        </div>
        <div className="text-right">
          <span className="text-theme-muted uppercase tracking-wider text-[10px] font-bold block">
            Total Tiempo Perdido:
          </span>
          <span className="font-mono text-base font-black text-rose-600 dark:text-rose-400">
            {hours}h {mins}m ({totalMin} min)
          </span>
        </div>
      </div>
    </div>
  );
};
