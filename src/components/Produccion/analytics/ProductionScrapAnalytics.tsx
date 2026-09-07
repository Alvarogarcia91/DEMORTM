import React from 'react';
import {
  Trash2,
  TrendingDown,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Target,
} from 'lucide-react';
import {
  ScrapWeeklyTrendPoint,
  ScrapByProcessItem,
  ScrapCauseItem,
  TopScrapOpItem,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionScrapAnalyticsProps {
  weeklyTrend: ScrapWeeklyTrendPoint[];
  byProcess: ScrapByProcessItem[];
  scrapCauses: ScrapCauseItem[];
  topOps: TopScrapOpItem[];
  onOpenOrder?: (folio: string) => void;
}

export const ProductionScrapAnalytics: React.FC<ProductionScrapAnalyticsProps> = ({
  weeklyTrend,
  byProcess,
  scrapCauses,
  topOps,
  onOpenOrder,
}) => {
  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Tendencia & Scrap por Proceso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TENDENCIA DE SCRAP */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  SCRAP &middot; TENDENCIA TEMPORAL
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>&darr; 0.6 pts vs mes anterior</span>
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Evolución porcentual de merma semanal con umbral máximo permitido del 5.0%.
            </p>
          </div>

          {/* Weekly Trend Bars */}
          <div className="space-y-3 pt-2">
            {weeklyTrend.map((pt, idx) => {
              const isOverTarget = pt.rate > pt.target;

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-main">{pt.period}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-black text-sm ${
                          isOverTarget ? 'text-rose-600' : 'text-theme-primary'
                        }`}
                      >
                        {pt.rate.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-theme-muted font-mono">
                        (Meta: &le;{pt.target}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-theme-subtle h-3 rounded-full overflow-hidden relative">
                    {/* Target line indicator at 5% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-10"
                      style={{ left: `${(pt.target / 6.0) * 100}%` }}
                      title="Meta máxima 5.0%"
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverTarget ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(pt.rate / 6.0) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[10px] text-theme-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Semanas 3 y 4 en zona de control
            </span>
            <span className="text-rose-600 font-bold">Línea roja = Límite 5.0%</span>
          </div>
        </div>

        {/* SCRAP POR PROCESO */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  SCRAP POR PROCESO PRODUCTIVO
                </h3>
              </div>
              <span className="text-[10px] text-theme-muted font-bold">
                Merma acumulada
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Tasa de merma, volumen físico y costo financiero estimado por etapa.
            </p>
          </div>

          {/* Process List */}
          <div className="space-y-2.5 pt-1">
            {byProcess.map((proc, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="text-theme-main block font-semibold">{proc.process}</strong>
                  <span className="text-[10px] text-theme-muted font-mono">
                    {proc.volumeUnits.toLocaleString('es-MX')} u. &middot; ${proc.costMxn.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-black text-sm block ${
                      proc.rate >= 4.0
                        ? 'text-rose-600'
                        : proc.rate >= 2.5
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {proc.rate.toFixed(1)}%
                  </span>
                  <span className="text-[9px] text-theme-muted uppercase font-bold">
                    {proc.rate >= 4.0 ? 'Atención' : 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-2xl bg-theme-muted/20 border border-theme-subtle text-[11px] text-theme-muted flex items-center justify-between">
            <span>Costo total acumulado de merma:</span>
            <strong className="text-theme-main font-mono text-xs">$68,600 MXN</strong>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Causas de Scrap & Top OPs con mayor merma */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CAUSAS DE SCRAP */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              CAUSAS RAÍZ DE SCRAP
            </h3>
            <p className="text-[11px] text-theme-muted">
              Distribución porcentual clasificada por metodología 4M.
            </p>
          </div>

          <div className="space-y-2.5">
            {scrapCauses.map((sc, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-main font-semibold">{sc.cause}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold text-theme-muted bg-theme-muted px-1.5 py-0.5 rounded">
                      4M {sc.category4M}
                    </span>
                    <strong className="font-mono font-bold text-theme-primary">
                      {sc.percentage}%
                    </strong>
                  </div>
                </div>
                <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-theme-primary h-full rounded-full"
                    style={{ width: `${sc.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP OP POR SCRAP */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                TOP ÓRDENES CON MAYOR MERMA
              </h3>
              <span className="text-[10px] text-rose-600 font-bold">
                OPs &gt; 3.5% scrap
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Lotes con mayor desviación de desperdicio y motivo principal registrado.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                  <th className="pb-2">OP / Cliente</th>
                  <th className="pb-2">Motivo Principal</th>
                  <th className="pb-2 text-right">Merma</th>
                  <th className="pb-2 text-right">% Scrap</th>
                  <th className="pb-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle/60">
                {topOps.map((op) => (
                  <tr key={op.opFolio} className="hover:bg-theme-muted/30 transition-colors">
                    <td className="py-2.5">
                      <span className="font-mono font-bold text-theme-primary block">
                        {op.opFolio}
                      </span>
                      <span className="text-[10px] text-theme-muted">{op.client}</span>
                    </td>
                    <td className="py-2.5 max-w-[200px]">
                      <span className="text-[11px] text-theme-muted line-clamp-1">
                        {op.mainReason}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-theme-main">
                      {op.scrapUnits.toLocaleString('es-MX')} u.
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`font-mono font-black text-xs ${
                          op.alertLevel === 'critico' ? 'text-rose-600 font-bold' : 'text-amber-600'
                        }`}
                      >
                        {op.scrapPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenOrder) onOpenOrder(op.opFolio);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Abrir OP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-theme-muted italic">
            * Clic en "Abrir OP" despliega la trazabilidad completa, inspecciones de calidad y checklist de arranque.
          </p>
        </div>
      </div>
    </div>
  );
};
