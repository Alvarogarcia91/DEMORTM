import React from 'react';
import {
  Gauge,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { WEEKLY_MACHINES_CAPACITY_V8 } from '../../../data/mockProductionDashboardV8';

interface Props {
  onNavigateToPlanning: () => void;
}

export const WeeklyCapacity: React.FC<Props> = ({ onNavigateToPlanning }) => {
  const machines = WEEKLY_MACHINES_CAPACITY_V8;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Capacidad Semanal por Máquina</h3>
            <p className="text-xs text-theme-muted">
              Horas planeadas vs disponibles (Base 40 h/semana estándar).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToPlanning}
          className="flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline"
        >
          <span>Ver Planeación</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
        <table className="w-full text-xs">
          <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3 text-left">Máquina</th>
              <th className="p-3 text-left">Área</th>
              <th className="p-3 text-right">Planeado</th>
              <th className="p-3 text-right">Disponible</th>
              <th className="p-3 text-right">Utilización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {machines.map((m) => {
              const isHigh = m.utilizationPercent >= 90;
              const isWarn = m.utilizationPercent >= 85 && m.utilizationPercent < 90;

              return (
                <tr key={m.id} className="hover:bg-theme-muted/10 transition-colors">
                  <td className="p-3">
                    <b className="text-theme-main block">{m.name}</b>
                    {m.stopReason && (
                      <small className="font-mono text-rose-600 block text-[10px]">
                        {m.stopReason} ({m.stopMinutes}m)
                      </small>
                    )}
                  </td>
                  <td className="p-3 text-theme-muted text-[11px]">
                    {m.area}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-theme-main">
                    {m.plannedHours} h
                  </td>
                  <td className="p-3 text-right font-mono text-theme-muted">
                    {m.availableHours} h
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:block w-16 h-1.5 rounded-full bg-theme-muted/20 overflow-hidden">
                        <div
                          className={`h-full ${
                            isHigh ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-theme-primary'
                          }`}
                          style={{ width: `${m.utilizationPercent}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-black text-xs ${
                          isHigh
                            ? 'text-rose-600 dark:text-rose-400'
                            : isWarn
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-theme-main'
                        }`}
                      >
                        {m.utilizationPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1">
        <span className="flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-theme-muted" />
          Capacidad base: <b>40 h / semana</b> por máquina
        </span>
        <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[9px] font-bold">
          Demo configurable RTM
        </span>
      </div>
    </div>
  );
};
