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

// Master Paginación RTM base rules
export const MASTER_PAGINATION_RULES: Record<number, number[]> = {
  8: [8],
  12: [12],
  16: [16],
  20: [8, 12],
  24: [12, 12], // Master spreadsheet rule for standard presses
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
  const currentMachineObj = machines.find((m) => m.name === selectedMachine);
  const maxFormAllowed = currentMachineObj?.maxFormPages ?? 32;

  // Ivan's explicit constraint calculation:
  // If machine max is 16 pages/form:
  // e.g. 24 pages -> 16 + 8 (instead of 12 + 12)
  // e.g. 32 pages -> 16 + 16 (instead of 32)
  // e.g. 64 pages -> 16 + 16 + 16 + 16 (instead of 32 + 32)
  const calculateForms = (): { forms: number[]; note?: string } => {
    const pages = specs.pages;

    if (maxFormAllowed === 16) {
      if (pages === 24) {
        return { forms: [16, 8], note: 'Regla de taller Iván: Máquina máx 16 págs/forma descompone 24 en 16 + 8' };
      }
      if (pages === 32) {
        return { forms: [16, 16], note: 'Máquina máx 16 págs/forma: descompuesta en 2 formas de 16' };
      }
      if (pages === 64) {
        return { forms: [16, 16, 16, 16], note: 'Máquina máx 16 págs/forma: 4 formas de 16' };
      }
      // General decomposition using 16, 12, 8
      let rem = pages;
      const result: number[] = [];
      while (rem >= 16) {
        result.push(16);
        rem -= 16;
      }
      if (rem === 12) {
        result.push(12);
        rem = 0;
      } else if (rem === 8) {
        result.push(8);
        rem = 0;
      } else if (rem > 0) {
        return { forms: [pages], note: 'Ajuste manual requerido: residuo no estándar para formas RTM' };
      }
      return { forms: result };
    }

    // Standard 32-page capable press (Master Paginación rules)
    const masterForms = MASTER_PAGINATION_RULES[pages];
    if (masterForms) {
      return {
        forms: masterForms,
        note: pages === 24 ? 'Regla Master Paginación (12 + 12) en prensa de gran formato' : undefined,
      };
    }

    // Fallback decomposition using standard RTM forms (32, 16, 12, 8)
    let rem = pages;
    const result: number[] = [];
    while (rem >= 32) {
      result.push(32);
      rem -= 32;
    }
    if (rem >= 16) {
      result.push(16);
      rem -= 16;
    }
    if (rem === 12) {
      result.push(12);
      rem = 0;
    } else if (rem === 8) {
      result.push(8);
      rem = 0;
    }

    if (rem === 0 && result.length > 0) {
      return { forms: result };
    }

    return { forms: [pages], note: 'Ajuste manual requerido para número de páginas no divisible en formas estándar' };
  };

  const { forms: recommendedForms, note: ruleNote } = calculateForms();
  const estimatedSheets = Math.ceil((quantity * (specs.pages / (recommendedForms[0] || 16))) / 2);

  const applyRecommendation = () => {
    onChange({
      formCount: recommendedForms.length,
      formsDetail: recommendedForms.map((p, idx) => `Forma ${idx + 1} · ${p} páginas`),
      sheetSize: maxFormAllowed === 16 ? 'Medio Pliego (43 x 57 cm)' : 'Pliego Completo (57 x 87 cm)',
      printPercent: '98%',
      estimatedSheets,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-theme-primary/30 bg-theme-surface/80 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
              Cálculo de Paginación Dinámico RTM
            </span>
            <span className="font-mono text-xs text-theme-muted">
              Capacidad Máx de Máquina: <b>{maxFormAllowed} páginas/forma</b>
            </span>
          </div>
          <h3 className="text-base font-black text-theme-main mt-0.5">Optimización de paginación Offset</h3>
          <p className="text-xs text-theme-muted">
            Desglose de pliegos y formas para manuales e instructivos adaptado a la prensa seleccionada.
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

      {/* Nota de regla aplicada (ejemplo de Iván o Master) */}
      {ruleNote && (
        <div className="rounded-xl border border-blue-400/60 bg-blue-50/60 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
          <b>Nota Técnica de Paginación:</b> {ruleNote}
        </div>
      )}

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
          <span className="text-theme-muted">Prensa Activa:</span>
          <b className="mt-1 block text-xs font-bold text-theme-main truncate">{selectedMachine}</b>
        </div>
        <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
          <span className="text-theme-muted">Capacidad Forma:</span>
          <b className="mt-1 block text-sm font-mono text-theme-primary font-bold">Hasta {maxFormAllowed} págs</b>
        </div>
      </div>

      {/* Formas recomendadas */}
      <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-theme-main">Paginación calculada según máquina:</span>
          <span className="font-mono font-bold text-theme-primary">
            {recommendedForms.length} {recommendedForms.length === 1 ? 'Forma' : 'Formas'} ({recommendedForms.join(' + ')}) · Total {specs.pages} págs
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
                  Frente y Vuelta ({Math.ceil(pagesInForm / 2)} + {Math.floor(pagesInForm / 2)})
                </span>
              </div>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                100% Ok
              </span>
            </div>
          ))}
        </div>

        {/* Mini vista visual Frente / Reverso */}
        <div className="mt-4 rounded-xl border border-dashed border-theme-subtle bg-theme-muted/30 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
            Esquema de imposición de pliego (Frente y Vuelta)
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-lg border border-theme-subtle bg-theme-surface p-2.5">
              <span className="font-bold text-theme-main">Cara Frontal (Frente)</span>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                {Array.from({ length: Math.min(8, Math.max(4, Math.ceil(specs.pages / 4))) }).map((_, idx) => (
                  <div key={idx} className="rounded border border-theme-subtle bg-theme-muted/40 py-2">
                    pág {idx * 2 + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-theme-subtle bg-theme-surface p-2.5">
              <span className="font-bold text-theme-main">Cara Posterior (Reverso)</span>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                {Array.from({ length: Math.min(8, Math.max(4, Math.ceil(specs.pages / 4))) }).map((_, idx) => (
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
            <span className="block font-bold text-theme-main">{maxFormAllowed === 16 ? '43 x 57 cm' : '57 x 87 cm'}</span>
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

      {/* Selector de máquinas Offset para ver el cambio de regla en vivo */}
      <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4">
        <span className="text-xs font-bold text-theme-main">Cambiar Prensa para Recalcular Paginación:</span>
        <p className="text-[11px] text-theme-muted mb-2">
          Observa cómo cambia la descomposición (ej. 24 págs en Heidelberg = 12+12 vs en Conserver = 16+8):
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
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
                        Activa
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-theme-muted">
                    Capacidad: Máx {m.maxFormPages ?? 32} págs/forma
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-emerald-600">
                    Carga semanal: {m.load}%
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
