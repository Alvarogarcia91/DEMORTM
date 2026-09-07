import React from 'react';
import {
  Wrench,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { SetupComparisonItem } from '../../../data/mockProduccionAnaliticaData';

interface ProductionSetupAnalyticsProps {
  setupComparison: SetupComparisonItem[];
  onNavigateTab?: (tab: any) => void;
}

export const ProductionSetupAnalytics: React.FC<ProductionSetupAnalyticsProps> = ({
  setupComparison,
  onNavigateTab,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. SETUP ESTÁNDAR VS REAL POR FAMILIA */}
      <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                SETUP &middot; ESTÁNDAR VS TIEMPO REAL
              </h3>
            </div>
            <span className="text-[10px] font-bold text-theme-muted font-mono">
              Basado en recetas maestras
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Desviación promedio en minutos de preparación respecto a la hoja de proceso.
          </p>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                <th className="pb-2">Proceso / Familia</th>
                <th className="pb-2 text-center">Muestras</th>
                <th className="pb-2 text-right">Estándar</th>
                <th className="pb-2 text-right">Real</th>
                <th className="pb-2 text-right">Variación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle/60">
              {setupComparison.map((item, idx) => {
                const isOver = item.variationPercent > 0;

                return (
                  <tr key={idx} className="hover:bg-theme-muted/30 transition-colors">
                    <td className="py-2.5">
                      <strong className="text-theme-main block font-semibold">
                        {item.processFamily}
                      </strong>
                    </td>
                    <td className="py-2.5 text-center text-theme-muted font-mono text-[11px]">
                      {item.samplesCount} OPs
                    </td>
                    <td className="py-2.5 text-right font-mono text-theme-muted text-[11px]">
                      {item.standardMinutes} min
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-theme-main text-[11px]">
                      {item.realMinutes} min
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isOver ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {isOver ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>{item.variationPercent > 0 ? `+${item.variationPercent.toFixed(1)}%` : `${item.variationPercent.toFixed(1)}%`}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[10px] text-theme-muted">
          <span>Tiempos estándar calculados con base en catálogo de recetas v6.</span>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('Procesos')}
              className="font-bold text-theme-primary hover:underline cursor-pointer"
            >
              Configurar recetas &rarr;
            </button>
          )}
        </div>
      </div>

      {/* 2. OPORTUNIDAD DE MEJORA IDENTIFICADA (MORADO SMART) */}
      <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-purple-500/35 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              ✦ Oportunidad de Mejora
            </span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>

          <h3 className="text-sm font-black text-theme-main leading-snug">
            El 62% del sobretiempo de setup Flexo aparece cuando coinciden troquel rotativo + barniz UV
          </h3>

          <p className="text-xs text-theme-muted leading-relaxed">
            El análisis de cronómetros en piso indica que los operadores pierden un promedio de 13 minutos esperando el lavado de charolas y la búsqueda de suajes magnéticos en el almacén de herramentales.
          </p>

          <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-1 text-xs">
            <span className="font-bold text-purple-700 dark:text-purple-300 block">
              Recomendación Operativa:
            </span>
            <p className="text-[11px] text-theme-muted">
              Implementar kit previo de estación en mesa de montaje antes de parar el tiraje anterior. Ahorro estimado: <strong>~22 min/orden</strong>.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 border-t border-theme-subtle flex items-center justify-between">
          <span className="text-[10px] text-theme-muted">Demo configurable</span>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('Procesos')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <span>Ver operaciones</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
