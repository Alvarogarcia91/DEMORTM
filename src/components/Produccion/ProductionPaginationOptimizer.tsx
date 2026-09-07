import React from 'react';
import { OffsetSpecs, ProductionMachine } from '../../data/mockProduccionData';

interface Props {
  specs: OffsetSpecs;
  onChange: (patch: Partial<OffsetSpecs>) => void;
  selectedMachine: string;
  machines: ProductionMachine[];
  onSelectMachine: (machineName: string) => void;
  quantity: number;
}

// Combinations from Master Paginacion (documented in spec)
export const OFFSET_PAGINATION_RULES: Record<number, number[]> = {
  8: [8],
  12: [12],
  16: [16],
  20: [8, 12],
  24: [12, 12],
  28: [12, 16],
  32: [32],
  40: [8, 32],
  44: [12, 32],
  48: [16, 32],
  56: [12, 12, 32],
  60: [12, 16, 32],
  64: [32, 32],
  72: [8, 32, 32],
  80: [16, 32, 32],
  96: [32, 32, 32],
};

export const ProductionPaginationOptimizer: React.FC<Props> = ({
  specs,
  onChange,
  selectedMachine,
  machines,
  onSelectMachine,
  quantity,
}) => {
  const recommendedForms = OFFSET_PAGINATION_RULES[specs.pages] ?? [Math.ceil(specs.pages / 2), Math.floor(specs.pages / 2)];
  const estimatedSheets = Math.ceil((quantity * (specs.pages / (recommendedForms[0] || 16))) / 2);

  const applyRecommendation = () => {
    onChange({
      formCount: recommendedForms.length,
      formsDetail: recommendedForms.map((p, idx) => `Forma ${idx + 1} · ${p} páginas`),
      sheetSize: '57 x 87 cm (Estándar Offset)',
      printPercent: '98%',
      estimatedSheets,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-theme-primary/30 bg-theme-surface/80 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-subtle pb-3">
        <div>
          <span className="inline-block rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
            Cálculo Inteligente Master Paginación RTM
          </span>
          <h3 className="text-base font-black text-theme-main">Optimización de paginación Offset</h3>
          <p className="text-xs text-theme-muted">
            Desglose de pliegos y formas para manuales e instructivos según estándares RTM.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyRecommendation}
            className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
          >
            ✓ Usar recomendación
          </button>
        </div>
      </div>

      {/* Input parameters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
          <span className="text-theme-muted">Páginas manual:</span>
          <b className="mt-1 block font-mono text-sm text-theme-main">{specs.pages} págs</b>
        </div>
        <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
          <span className="text-theme-muted">Tiraje solicitado:</span>
          <b className="mt-1 block font-mono text-sm text-theme-main">{quantity.toLocaleString('es-MX')} ejs</b>
        </div>
        <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
          <span className="text-theme-muted">Tamaño final:</span>
          <b className="mt-1 block font-mono text-sm text-theme-main">
            {specs.finalWidthMm} x {specs.finalHeightMm} mm
          </b>
        </div>
        <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
          <span className="text-theme-muted">Gramaje / Sustrato:</span>
          <b className="mt-1 block text-sm text-theme-main">
            {specs.paperWeightGsm}g {specs.paperType}
          </b>
        </div>
      </div>

      {/* Formas recomendadas */}
      <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-theme-main">Paginación recomendada:</span>
          <span className="font-mono font-bold text-theme-primary">
            {recommendedForms.length} {recommendedForms.length === 1 ? 'Forma' : 'Formas'} · Total {specs.pages} págs
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedForms.map((pagesInForm, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs"
            >
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Forma {i + 1}
                </span>
                <span className="ml-2 font-mono text-xs text-theme-muted">
                  · {pagesInForm} páginas
                </span>
                <span className="block text-[11px] text-theme-muted mt-0.5">
                  Frente y Vuelta ({pagesInForm / 2} + {pagesInForm / 2})
                </span>
              </div>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                100% Ok
              </span>
            </div>
          ))}
        </div>

        {/* Mini vista visual Frente / Reverso inspirada en el Excel */}
        <div className="mt-4 rounded-xl border border-dashed border-theme-subtle bg-theme-muted/30 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
            Esquema de imposición de pliego (Frente y Vuelta)
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-lg border border-theme-subtle bg-theme-surface p-2.5">
              <span className="font-bold text-theme-main">Cara Frontal (Frente)</span>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="rounded border border-theme-subtle bg-theme-muted/40 py-2">
                    pág {idx * 2 + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-theme-subtle bg-theme-surface p-2.5">
              <span className="font-bold text-theme-main">Cara Posterior (Reverso)</span>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="rounded border border-theme-subtle bg-theme-muted/40 py-2">
                    pág {idx * 2 + 2}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Totales calculados */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
          <div className="p-2">
            <span className="text-theme-muted">Tamaño pliego:</span>
            <span className="block font-bold text-theme-main">57 x 87 cm</span>
          </div>
          <div className="p-2">
            <span className="text-theme-muted">% a imprimir:</span>
            <span className="block font-bold text-emerald-600">98% (Aprovechamiento)</span>
          </div>
          <div className="p-2">
            <span className="text-theme-muted">Pliegos estimados:</span>
            <span className="block font-bold font-mono text-theme-main">
              {estimatedSheets.toLocaleString('es-MX')} pliegos
            </span>
          </div>
          <div className="p-2">
            <span className="text-theme-muted">Desperdicio est.:</span>
            <span className="block font-bold text-theme-main">2.0% merma técnica</span>
          </div>
        </div>
      </div>

      {/* Máquina compatible y selector */}
      <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4">
        <span className="text-xs font-bold text-theme-main">Máquina Offset para corrida de formas:</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {machines
            .filter((m) => m.area === 'Offset')
            .map((m) => {
              const isSelected = selectedMachine === m.name;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMachine(m.name)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-theme-primary bg-theme-primary/10 ring-2 ring-theme-primary/20'
                      : 'border-theme-subtle hover:bg-theme-muted/20'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-theme-main">{m.name}</span>
                    {isSelected && (
                      <span className="rounded-full bg-theme-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Seleccionada
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-theme-muted">
                    {m.maxColors ?? 4} colores · Carga {m.load}%
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-emerald-600">
                    ✓ Formato pliego compatible
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
