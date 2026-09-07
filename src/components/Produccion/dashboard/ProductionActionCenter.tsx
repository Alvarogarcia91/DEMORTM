import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Calendar,
  ExternalLink,
  Layers,
  Package,
} from 'lucide-react';
import { ACTION_CENTER_ITEMS_V8, ActionCenterItem } from '../../../data/mockProductionDashboardV8';

interface Props {
  onOpenOrder: (opFolio: string) => void;
  onReprogramOrder: (opFolio: string) => void;
  onViewImpact: (machine: string) => void;
  onReviewScrap: (opFolio: string) => void;
  onViewSupply: (opFolio: string) => void;
}

export const ProductionActionCenter: React.FC<Props> = ({
  onOpenOrder,
  onReprogramOrder,
  onViewImpact,
  onReviewScrap,
  onViewSupply,
}) => {
  const items = ACTION_CENTER_ITEMS_V8;

  const handleAction = (item: ActionCenterItem, actionType: string) => {
    if (actionType === 'open_op' && item.targetOpFolio) {
      onOpenOrder(item.targetOpFolio);
    } else if (actionType === 'reprogram' && item.targetOpFolio) {
      onReprogramOrder(item.targetOpFolio);
    } else if (actionType === 'view_impact' && item.targetMachine) {
      onViewImpact(item.targetMachine);
    } else if (actionType === 'review_scrap' && item.targetOpFolio) {
      onReviewScrap(item.targetOpFolio);
    } else if (actionType === 'view_supply' && item.targetOpFolio) {
      onViewSupply(item.targetOpFolio);
    }
  };

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">
              Requiere tu Atención (Action Center)
            </h3>
            <p className="text-xs text-theme-muted">
              Excepciones operativas ordenadas por impacto en la planta.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-mono text-[10px] font-black px-2 py-0.5">
          {items.length} Pendientes
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isRed = item.severity === 'red';
          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all hover:shadow-sm ${
                isRed
                  ? 'border-rose-400/80 bg-rose-50/40 dark:bg-rose-950/20 border-l-4 border-l-rose-600'
                  : 'border-amber-400/80 bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-l-amber-600'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-theme-main">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-theme-muted font-medium">
                    {item.subtitle}
                  </p>
                  <small className="block text-[11px] text-theme-main font-semibold opacity-90">
                    {item.impactDescription}
                  </small>
                </div>

                {/* Acciones Rápidas */}
                <div className="flex items-center gap-2 pt-1 sm:pt-0">
                  {item.actionSecondary && (
                    <button
                      type="button"
                      onClick={() => handleAction(item, item.actionSecondary!.action)}
                      className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs"
                    >
                      {item.actionSecondary.label}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAction(item, item.actionPrimary.action)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-xs ${
                      isRed
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {item.actionPrimary.label}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
