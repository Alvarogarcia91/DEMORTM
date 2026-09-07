import React from 'react';
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  PlanVsActualArea,
  DASHBOARD_V8_SNAPSHOTS,
  DashboardPeriod,
} from '../../../data/mockProductionDashboardV8';

interface Props {
  period: DashboardPeriod;
}

export const PlanVsActual: React.FC<Props> = ({ period }) => {
  const snapshot = DASHBOARD_V8_SNAPSHOTS[period === 'Semana actual' ? 'Semana actual' : 'Hoy'];
  const areas = snapshot.areaPlanReal;
  const hourly = snapshot.hourlyAccumulation;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Plan vs Real · {period}</h3>
            <p className="text-xs text-theme-muted">
              Cumplimiento desglosado por proceso de manufactura.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-theme-main">
          Total: {snapshot.goodProduced.toLocaleString('es-MX')} / {snapshot.planTotal.toLocaleString('es-MX')}
        </span>
      </div>

      {/* Tabla Desglosada */}
      <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
        <table className="w-full text-xs">
          <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3 text-left">Área</th>
              <th className="p-3 text-right">Plan</th>
              <th className="p-3 text-right">Real</th>
              <th className="p-3 text-right">Cumplimiento</th>
              <th className="p-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {areas.map((row) => (
              <tr key={row.area} className="hover:bg-theme-muted/10 transition-colors">
                <td className="p-3 font-bold text-theme-main">
                  {row.area}
                </td>
                <td className="p-3 text-right font-mono text-theme-muted">
                  {row.plan.toLocaleString('es-MX')}
                </td>
                <td className="p-3 text-right font-mono font-bold text-theme-main">
                  {row.real.toLocaleString('es-MX')}
                </td>
                <td className="p-3 text-right font-mono font-black">
                  <span className={row.compliancePercent < 85 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                    {row.compliancePercent}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    row.status === 'Atención'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {row.status === 'Atención' ? '⚠ Atraso' : '✓ En meta'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-theme-subtle bg-theme-muted/10 font-bold">
            <tr>
              <td className="p-3 text-theme-main">TOTAL</td>
              <td className="p-3 text-right font-mono text-theme-muted">
                {snapshot.planTotal.toLocaleString('es-MX')}
              </td>
              <td className="p-3 text-right font-mono text-theme-main">
                {snapshot.goodProduced.toLocaleString('es-MX')}
              </td>
              <td className="p-3 text-right font-mono font-black text-theme-primary">
                {((snapshot.goodProduced / snapshot.planTotal) * 100).toFixed(1)}%
              </td>
              <td className="p-3 text-center">
                <span className="rounded-full bg-theme-primary/10 text-theme-primary px-2 py-0.5 text-[9px] font-black">
                  Global
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Producción Acumulada */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
          Ritmo Acumulado en el Turno (Plan vs Real):
        </span>
        <div className="space-y-2">
          {hourly.map((h) => {
            const pct = Math.min(100, Math.round((h.realAccum / h.planAccum) * 100));
            return (
              <div key={h.hour} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-theme-muted font-bold w-12">{h.hour}</span>
                  <span className="text-theme-main">
                    Real: <b>{h.realAccum.toLocaleString('es-MX')}</b> / Plan: {h.planAccum.toLocaleString('es-MX')}
                  </span>
                  <span className={`font-black ${pct < 85 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-theme-muted/20 overflow-hidden">
                  <div
                    className={`h-full transition-all ${pct < 85 ? 'bg-amber-500' : 'bg-theme-primary'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
