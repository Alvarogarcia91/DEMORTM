import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  ProductionAnalyticsArea,
  PlanVsActualDataset,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionPlanVsActualProps {
  datasets: Record<ProductionAnalyticsArea, PlanVsActualDataset>;
}

export const ProductionPlanVsActual: React.FC<ProductionPlanVsActualProps> = ({
  datasets,
}) => {
  const [activeArea, setActiveArea] = useState<ProductionAnalyticsArea>('Todas');

  const currentData = datasets[activeArea] || datasets['Todas'];
  const areas: ProductionAnalyticsArea[] = ['Todas', 'Offset', 'Flexografía', 'Acabados'];

  return (
    <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
      {/* Header & Sub-selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-theme-primary" />
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              PRODUCCIÓN &middot; PLAN VS REAL
            </h3>
          </div>
          <p className="text-[11px] text-theme-muted">
            Tendencia acumulada y porcentaje de cumplimiento del periodo por área productiva.
          </p>
        </div>

        {/* Area Pills */}
        <div className="flex items-center gap-1 bg-theme-muted/40 p-1 rounded-2xl border border-theme-subtle">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setActiveArea(area)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeArea === area
                  ? 'bg-theme-main text-white shadow-2xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              {area === 'Todas' ? 'Total' : area}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Plan acumulado
          </span>
          <strong className="text-base sm:text-lg font-mono font-bold text-theme-main block">
            {currentData.totalPlanned.toLocaleString('es-MX')} u.
          </strong>
        </div>

        <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Real acumulado
          </span>
          <strong className="text-base sm:text-lg font-mono font-bold text-theme-primary block">
            {currentData.totalActual.toLocaleString('es-MX')} u.
          </strong>
        </div>

        <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Cumplimiento
          </span>
          <strong
            className={`text-base sm:text-lg font-mono font-bold block ${
              currentData.compliancePercent >= 90 ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {currentData.compliancePercent.toFixed(1)}%
          </strong>
        </div>
      </div>

      {/* Temporal Comparison Bars */}
      <div className="space-y-3 pt-2">
        {currentData.points.map((pt, idx) => {
          const maxVal = Math.max(...currentData.points.map((p) => Math.max(p.planned, p.actual)));
          const planWidth = (pt.planned / maxVal) * 100;
          const actualWidth = (pt.actual / maxVal) * 100;

          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-theme-main">{pt.label}</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-theme-muted">
                    Plan: <strong>{pt.planned.toLocaleString('es-MX')}</strong>
                  </span>
                  <span className="text-theme-primary">
                    Real: <strong>{pt.actual.toLocaleString('es-MX')}</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pt.compliancePercent >= 95
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : pt.compliancePercent >= 90
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {pt.compliancePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dual Visual Bar */}
              <div className="space-y-1">
                {/* Plan Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold text-theme-muted w-8">Plan</span>
                  <div className="flex-1 bg-theme-subtle h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-400 dark:bg-zinc-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${planWidth}%` }}
                    />
                  </div>
                </div>

                {/* Actual Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold text-theme-primary w-8">Real</span>
                  <div className="flex-1 bg-theme-subtle h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pt.actual >= pt.planned ? 'bg-emerald-500' : 'bg-theme-primary'
                      }`}
                      style={{ width: `${actualWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
