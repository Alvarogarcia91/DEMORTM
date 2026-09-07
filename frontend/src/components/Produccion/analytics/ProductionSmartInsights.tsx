import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  X,
  Info,
  Layers,
  Zap,
} from 'lucide-react';
import { ProductionSmartSuggestion } from '../../../data/mockProduccionAnaliticaData';

interface ProductionSmartInsightsProps {
  suggestions: ProductionSmartSuggestion[];
  onActionClick: (target: string, payload?: string) => void;
  onNotice: (message: string) => void;
}

export const ProductionSmartInsights: React.FC<ProductionSmartInsightsProps> = ({
  suggestions,
  onActionClick,
  onNotice,
}) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeSuggestions = suggestions.filter((s) => !dismissedIds.includes(s.id));

  const handleDismiss = (id: string, title: string) => {
    setDismissedIds((prev) => [...prev, id]);
    onNotice(`Sugerencia archivada del panel: "${title.slice(0, 38)}..."`);
  };

  if (activeSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-3xl bg-theme-surface border border-purple-500/35 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/25 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main tracking-wider uppercase flex items-center gap-2">
              <span>Sugerencias del sistema</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-400/40">
                ● SMART PATTERNS
              </span>
            </h3>
            <p className="text-[11px] text-theme-muted">
              Patrones detectados automáticamente a partir de tiempos reales, scrap y paros 4M.
            </p>
          </div>
        </div>

        <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-300/40 w-fit">
          {activeSuggestions.length} recomendaciones activas
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activeSuggestions.map((sug) => (
          <div
            key={sug.id}
            className="p-4 rounded-2xl bg-theme-surface border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-2xs flex flex-col justify-between space-y-3 relative group"
          >
            {/* Top row */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  {sug.category === 'machine' && 'Máquina crítica'}
                  {sug.category === 'efficiency' && 'Eficiencia / Estándar'}
                  {sug.category === 'sequence' && 'Secuencia de preparación'}
                  {sug.category === 'scrap' && 'Tendencia de Scrap'}
                  {sug.category === 'operator' && 'Contexto de piso'}
                  {sug.category === 'setup' && 'Setup y herramental'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDismiss(sug.id, sug.title)}
                  title="Descartar sugerencia"
                  className="text-theme-muted hover:text-theme-main p-0.5 rounded-md hover:bg-theme-muted/40 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs font-black text-theme-main leading-snug">
                {sug.title}
              </h4>

              <div className="space-y-1.5 text-[11px] text-theme-muted leading-relaxed">
                <p>
                  <strong className="text-theme-main font-semibold">Por qué aparece: </strong>
                  {sug.reason}
                </p>
                <div className="flex items-start gap-1 text-purple-700 dark:text-purple-300 bg-purple-500/5 p-2 rounded-xl border border-purple-500/15">
                  <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="font-medium text-[10px]">{sug.impactNote}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onActionClick(sug.primaryActionTarget, sug.primaryActionPayload)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                <span>{sug.primaryActionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              {sug.secondaryActionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    onNotice(`Acción complementaria ejecutada: ${sug.secondaryActionLabel}`);
                  }}
                  className="text-[11px] text-theme-muted hover:text-theme-main font-semibold hover:underline cursor-pointer"
                >
                  {sug.secondaryActionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
