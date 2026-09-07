import React from 'react';
import {
  Flame,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  MachineDayPerformanceRow,
  Pareto4MSummary,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionPerformanceHeatmapProps {
  heatmap: MachineDayPerformanceRow[];
  pareto4M: Pareto4MSummary[];
  onNavigateTab?: (tab: any) => void;
}

export const ProductionPerformanceHeatmap: React.FC<ProductionPerformanceHeatmapProps> = ({
  heatmap,
  pareto4M,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Heatmap Máquina × Día & Pareto 4M */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HEATMAP MÁQUINA X DÍA */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  MAPA DE CALOR &middot; MÁQUINA &times; DÍA
                </h3>
              </div>
              <span className="text-[10px] text-theme-muted font-bold font-mono">
                Semana en curso
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Rendimiento diario vs estándar por estación para balanceo de carga.
            </p>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto pt-1">
            <div className="min-w-[380px] space-y-2">
              {/* Header Days */}
              <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-theme-muted uppercase">
                <span className="text-left">Estación</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
              </div>

              {/* Rows */}
              {heatmap.map((row) => (
                <div key={row.machineName} className="grid grid-cols-6 gap-2 items-center text-xs">
                  <span className="font-bold text-theme-main text-[11px] truncate" title={row.machineName}>
                    {row.machineName}
                  </span>

                  {row.days.map((d) => {
                    const statusClass =
                      d.status === 'verde'
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30'
                        : d.status === 'ambar'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 font-black border border-rose-500/30';

                    return (
                      <div
                        key={d.day}
                        className={`h-8 rounded-xl flex items-center justify-center text-[11px] font-mono transition-all ${statusClass}`}
                        title={`${row.machineName} - ${d.day}: ${d.efficiencyPercent}% eficiencia`}
                      >
                        {d.efficiencyPercent}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[10px] text-theme-muted">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/40" /> &ge;90% Saludable
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/40" /> 80-89% Atención
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500/40" /> &lt;80% Crítico
              </span>
            </div>
          </div>
        </div>

        {/* PARETO 4M + TENDENCIA SEMANAL */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  PARETO 4M &middot; EVOLUCIÓN TEMPORAL
                </h3>
              </div>
              <span className="text-[10px] text-theme-muted font-bold font-mono">
                Minutos por categoría
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Ishikawa 4M acumulado y tendencia de las últimas 4 semanas (S1 a S4).
            </p>
          </div>

          {/* Table / Bars */}
          <div className="space-y-3 pt-1">
            {pareto4M.map((p) => (
              <div key={p.category} className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-theme-main block font-semibold">4M {p.category}</strong>
                    <span className="text-[10px] text-theme-muted font-mono">
                      {p.minutes} min acumulados
                    </span>
                  </div>
                  <strong className="font-mono font-black text-theme-primary text-sm">
                    {p.percentage}%
                  </strong>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-theme-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>

                {/* Weekly evolution mini-chips */}
                <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono pt-0.5">
                  <span>Evolución (min):</span>
                  <div className="flex items-center gap-2">
                    {p.weeklyTrend.map((val, i) => (
                      <span key={i} className="bg-theme-surface px-1.5 py-0.5 rounded border border-theme-subtle font-bold">
                        S{i + 1}: {val}m
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sugerencia inteligente morada sobre tendencia 4M */}
          <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <p className="text-[11px] text-purple-800 dark:text-purple-300">
                <strong>Tendencia 4M: </strong>
                Máquina pasó de 44 a 93 min perdidos en cuatro semanas. Mayor contribución: Mark Andy 830.
              </p>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('Máquinas')}
                className="text-purple-700 dark:text-purple-300 hover:underline font-bold text-[11px] whitespace-nowrap cursor-pointer"
              >
                Analizar &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
