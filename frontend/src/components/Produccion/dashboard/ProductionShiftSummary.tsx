import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Coffee,
  ChevronRight,
  Package,
} from 'lucide-react';

interface Props {
  onSelectDeviation: () => void;
  onSelectStoppedMachine: () => void;
  onSelectRiskOrders: () => void;
  onSelectSupplyStage: () => void;
}

export const ProductionShiftSummary: React.FC<Props> = ({
  onSelectDeviation,
  onSelectStoppedMachine,
  onSelectRiskOrders,
  onSelectSupplyStage,
}) => {
  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-theme-muted">
              EL CAFÉ DE LA MAÑANA DE IVÁN
            </span>
            <h3 className="text-xs font-black text-theme-main">
              Resumen Ejecutivo del Turno Actual (Estado de Planta)
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-theme-muted/20 px-2.5 py-0.5 text-[10px] font-bold text-theme-muted">
          Turno A en curso · Planta RTM
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-3 sm:grid-cols-2 lg:grid-cols-5 text-xs">
        {/* Item 1: Operaciones en estándar */}
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 text-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold text-[11px] leading-tight">
            ✓ 8 operaciones dentro del estándar
          </span>
        </div>

        {/* Item 2: Operaciones con desviación */}
        <button
          type="button"
          onClick={onSelectDeviation}
          className="flex items-center justify-between rounded-2xl border border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 text-left text-amber-950 dark:text-amber-200 hover:bg-amber-100/60 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold text-[11px] leading-tight">
              ⚠ 3 operaciones con desviación (+17m Doblado)
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        </button>

        {/* Item 3: Máquina detenida */}
        <button
          type="button"
          onClick={onSelectStoppedMachine}
          className="flex items-center justify-between rounded-2xl border border-rose-300/60 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 text-left text-rose-950 dark:text-rose-200 hover:bg-rose-100/60 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-bold text-[11px] leading-tight">
              🔴 1 máquina detenida (Mark Andy 830 · 47m)
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-rose-600 shrink-0" />
        </button>

        {/* Item 4: OP comprometiendo fecha cliente */}
        <button
          type="button"
          onClick={onSelectRiskOrders}
          className="flex items-center justify-between rounded-2xl border border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 text-left text-amber-950 dark:text-amber-200 hover:bg-amber-100/60 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold text-[11px] leading-tight">
              ⚠ 2 OP comprometen fecha cliente (TYCO, PAN)
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        </button>

        {/* Item 5: Material listo para arranques */}
        <button
          type="button"
          onClick={onSelectSupplyStage}
          className="flex items-center justify-between rounded-2xl border border-blue-300/60 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 text-left text-blue-950 dark:text-blue-200 hover:bg-blue-100/60 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-[11px] leading-tight">
              ✓ Material listo para 7 de 9 próximos arranques
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        </button>
      </div>
    </div>
  );
};
