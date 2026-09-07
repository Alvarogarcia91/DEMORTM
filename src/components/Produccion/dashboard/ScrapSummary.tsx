import React from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';
import { DASHBOARD_V8_SNAPSHOTS, DashboardPeriod } from '../../../data/mockProductionDashboardV8';

interface Props {
  period: DashboardPeriod;
  onOpenOrder: (opFolio: string) => void;
}

export const ScrapSummary: React.FC<Props> = ({ period, onOpenOrder }) => {
  const snapshot = DASHBOARD_V8_SNAPSHOTS[period === 'Semana actual' ? 'Semana actual' : 'Hoy'];
  const scrapAreas = snapshot.scrapByArea;
  const topContributor = snapshot.topScrapContributor;
  const totalPieces = snapshot.goodProduced + snapshot.scrapTotalUnits;
  const globalScrap = ((snapshot.scrapTotalUnits / totalPieces) * 100).toFixed(1);

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Merma / Desperdicio de Proceso</h3>
            <p className="text-xs text-theme-muted">
              Control de merma por área contra objetivo corporativo.
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-theme-muted uppercase block">Objetivo demo</span>
          <b className="text-xs text-emerald-600 dark:text-emerald-400">≤ 5.0%</b>
        </div>
      </div>

      {/* Indicador Global */}
      <div className="flex items-center justify-between rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
            Merma Consolidada ({period}):
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono text-2xl font-black text-theme-main">
              {globalScrap}%
            </span>
            <span className="font-mono text-xs text-theme-muted">
              ({snapshot.scrapTotalUnits.toLocaleString('es-MX')} piezas de {totalPieces.toLocaleString('es-MX')})
            </span>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs px-2.5 py-1">
          ✓ Dentro de objetivo
        </span>
      </div>

      {/* Desglose por Área */}
      <div className="space-y-2 text-xs">
        {scrapAreas.map((sa) => {
          const isWarn = sa.scrapPercent > 4.0;
          return (
            <div key={sa.area} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-theme-main">{sa.area}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className={`font-black ${isWarn ? 'text-amber-600 dark:text-amber-400' : 'text-theme-main'}`}>
                    {sa.scrapPercent}%
                  </span>
                  {isWarn && (
                    <span className="rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1 py-0.2 text-[9px] font-bold">
                      Cercano a 5%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-theme-muted/20 overflow-hidden">
                <div
                  className={`h-full ${isWarn ? 'bg-amber-500' : 'bg-theme-primary'}`}
                  style={{ width: `${(sa.scrapPercent / 5.0) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mayor Contribución */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/20 p-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
            Mayor Contribución a Merma:
          </span>
          <button
            type="button"
            onClick={() => onOpenOrder(topContributor.opFolio)}
            className="font-mono font-bold text-theme-primary hover:underline text-xs"
          >
            {topContributor.opFolio} · {topContributor.client}
          </button>
          <small className="block text-[11px] text-theme-muted">{topContributor.reason}</small>
        </div>
        <div className="text-right font-mono">
          <span className="text-sm font-black text-amber-700 dark:text-amber-300">
            {topContributor.units.toLocaleString('es-MX')} pz
          </span>
        </div>
      </div>
    </div>
  );
};
