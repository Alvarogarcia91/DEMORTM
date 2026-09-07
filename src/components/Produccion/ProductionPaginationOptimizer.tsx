import React, { useState } from 'react';
import { OffsetSpecs, ProductionMachine } from '../../data/mockProduccionData';
import { Check, Edit3, Sparkles, Layers, Sliders } from 'lucide-react';

interface Props {
  specs: OffsetSpecs;
  onChange: (patch: Partial<OffsetSpecs>) => void;
  selectedMachine: string;
  machines: ProductionMachine[];
  onSelectMachine: (machineName: string) => void;
  quantity: number;
}

// Master Paginación RTM base rules para prensas de gran formato (32 págs/forma)
export const MASTER_PAGINATION_32: Record<number, number[]> = {
  8: [8],
  12: [12],
  16: [16],
  20: [12, 8],
  24: [12, 12], // En prensa de 32 se divide en 2 formas equilibradas de 12
  28: [16, 12],
  32: [32],
  40: [32, 8],
  44: [32, 12],
  48: [32, 16],
  56: [32, 12, 12],
  60: [32, 16, 12],
  64: [32, 32],
  72: [32, 32, 8],
  80: [32, 32, 16],
  96: [32, 32, 32],
};

// Reglas RTM para máquinas de medio pliego / 16 págs por forma (Regla explícita explicada por Iván)
export const MASTER_PAGINATION_16: Record<number, number[]> = {
  8: [8],
  12: [12],
  16: [16],
  20: [12, 8],
  24: [16, 8], // EJEMPLO CENTRAL DE IVÁN: 24 págs en máquina de 16 = 16 + 8
  28: [16, 12],
  32: [16, 16],
  40: [16, 16, 8],
  48: [16, 16, 16],
  64: [16, 16, 16, 16],
  72: [16, 16, 16, 16, 8],
  80: [16, 16, 16, 16, 16],
  96: [16, 16, 16, 16, 16, 16],
};

export const ProductionPaginationOptimizer: React.FC<Props> = ({
  specs,
  onChange,
  selectedMachine,
  machines,
  onSelectMachine,
  quantity,
}) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualFormsText, setManualFormsText] = useState('');
  const [lastSelectedMachine, setLastSelectedMachine] = useState(selectedMachine);
  const [justRecalculated, setJustRecalculated] = useState(false);

  const currentMachineObj = machines.find((m) => m.name === selectedMachine);
  const maxFormAllowed = currentMachineObj?.maxFormPages ?? 32;

  // Lógica de cálculo estricta dependiente de la máquina y las explicaciones de Iván
  const calculateForms = (): { forms: number[]; note?: string } => {
    const pages = specs.pages;

    if (maxFormAllowed === 16) {
      const rule16 = MASTER_PAGINATION_16[pages];
      if (rule16) {
        return {
          forms: rule16,
          note:
            pages === 24
              ? 'Regla de taller de Iván: En prensa con máx 16 págs/forma, 24 páginas se recomienda como 16 + 8'
              : `Capacidad de máquina máx 16 págs/forma: descompuesta en ${rule16.length} formas (${rule16.join(' + ')})`,
        };
      }
      // Algoritmo general recursivo si no está en la tabla
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
      }
      if (rem === 0 && result.length > 0) return { forms: result };
      return { forms: [pages], note: 'Ajuste manual requerido: número de páginas no divisible en formas estándar' };
    }

    // Máquina de 32 páginas (Prensa gran formato como Heidelberg Speedmaster)
    const rule32 = MASTER_PAGINATION_32[pages];
    if (rule32) {
      return {
        forms: rule32,
        note:
          pages === 24
            ? 'Regla Master Paginación en prensa de gran formato: 12 + 12 (aprovechamiento equilibrado)'
            : `Prensa de gran formato (32 págs/forma): optimizada en ${rule32.length} formas (${rule32.join(' + ')})`,
      };
    }

    // Fallback general para 32
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

    return { forms: [pages], note: 'Ajuste manual requerido' };
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
    setIsManualMode(false);
  };

  const handleMachineSelect = (mName: string) => {
    onSelectMachine(mName);
    setLastSelectedMachine(mName);
    setJustRecalculated(true);
    setTimeout(() => setJustRecalculated(false), 3000);
  };

  const handleApplyManual = () => {
    const parts = manualFormsText
      .split(/[+,;\s]+/)
      .map((p) => parseInt(p.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
    if (parts.length > 0) {
      onChange({
        formCount: parts.length,
        formsDetail: parts.map((p, idx) => `Forma ${idx + 1} · ${p} páginas (Manual)`),
        estimatedSheets: Math.ceil((quantity * (specs.pages / (parts[0] || 16))) / 2),
      });
      setIsManualMode(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-theme-primary/30 bg-theme-surface/80 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
              CÁLCULO DE PAGINACIÓN DINÁMICO RTM · V5
            </span>
            <span className="font-mono text-xs text-theme-muted">
              Capacidad de Prensa: <b>{maxFormAllowed} páginas/forma</b>
            </span>
          </div>
          <h3 className="text-base font-black text-theme-main mt-0.5">Optimización de paginación Offset</h3>
          <p className="text-xs text-theme-muted">
            Desglose de pliegos y formas para manuales e instructivos adaptado a la capacidad real de la máquina.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isManualMode ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsManualMode(true);
                  setManualFormsText(recommendedForms.join(' + '));
                }}
                className="flex items-center gap-1 rounded-xl border border-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
              >
                <Sliders className="h-3.5 w-3.5" /> Ajustar manualmente
              </button>
              <button
                type="button"
                onClick={applyRecommendation}
                className="flex items-center gap-1 rounded-xl bg-theme-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
              >
                <Check className="h-3.5 w-3.5" /> Usar recomendación
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsManualMode(false)}
              className="rounded-xl border border-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
            >
              Cancelar ajuste
            </button>
          )}
        </div>
      </div>

      {/* Banner central de máquina y capacidad exigido por Iván en la V5 */}
      <div
        className={`rounded-xl border p-3.5 transition-all ${
          justRecalculated
            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
            : 'border-theme-primary/40 bg-theme-primary/5'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-theme-primary" />
              <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                {justRecalculated ? '⚡ PAGINACIÓN RECALCULADA POR CAMBIO DE MÁQUINA' : 'CONFIGURACIÓN DE MÁQUINA ACTIVA'}
              </span>
            </div>
            <div className="mt-1 text-xs">
              <span className="text-theme-muted">Máquina seleccionada: </span>
              <b className="text-theme-main">{selectedMachine}</b>
              <span className="mx-2 text-theme-muted">·</span>
              <span className="text-theme-muted">Capacidad por forma: </span>
              <b className="font-mono font-bold text-theme-main">{maxFormAllowed} páginas</b>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">Recomendación RTM:</span>
            <span className="font-mono font-black text-sm text-theme-primary">
              {recommendedForms.join(' + ')} páginas ({recommendedForms.length} {recommendedForms.length === 1 ? 'forma' : 'formas'})
            </span>
          </div>
        </div>
      </div>

      {/* Nota técnica de la regla aplicada */}
      {ruleNote && (
        <div className="rounded-xl border border-blue-400/60 bg-blue-50/60 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
          <b>Nota Técnica de Taller:</b> {ruleNote}
        </div>
      )}

      {/* Parámetros de entrada */}
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

      {/* Modo de ajuste manual opcional */}
      {isManualMode && (
        <div className="rounded-xl border border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/30 p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Ajuste Manual de Formas para {specs.pages} páginas:
            </span>
            <span className="text-[11px] text-theme-muted">Ingresa las páginas separadas por suma (ej: 16 + 8)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualFormsText}
              onChange={(e) => setManualFormsText(e.target.value)}
              placeholder="Ej. 16 + 8 o 12 + 12"
              className="flex-1 rounded-xl border border-theme-subtle bg-theme-surface p-2 font-mono font-bold"
            />
            <button
              type="button"
              onClick={handleApplyManual}
              className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-500"
            >
              Aplicar ajuste manual
            </button>
          </div>
        </div>
      )}

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

        {/* Totales calculados */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs border-t border-theme-subtle pt-3">
          <div className="p-2">
            <span className="text-theme-muted">Tamaño pliego:</span>
            <span className="block font-bold text-theme-main">{maxFormAllowed === 16 ? 'Medio Pliego (43 x 57 cm)' : 'Pliego Completo (57 x 87 cm)'}</span>
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

      {/* Selector de máquinas Offset para ver el cambio de regla en vivo (Demo interactiva) */}
      <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-theme-main">
            Cambiar Prensa para Recalcular Paginación (Comparativa en Vivo):
          </span>
          <span className="text-[10px] font-mono text-theme-muted">
            Ejemplo de Iván: 24 págs en Heidelberg (32) vs Conserver (16)
          </span>
        </div>
        <p className="text-[11px] text-theme-muted mb-3">
          Haz clic en cualquier prensa para ver cómo el sistema adapta automáticamente la descomposición de pliegos:
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          {machines
            .filter((m) => m.area === 'Offset')
            .map((m) => {
              const isSelected = selectedMachine === m.name;
              const machineCap = m.maxFormPages ?? 32;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMachineSelect(m.name)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-theme-primary bg-theme-primary/10 ring-2 ring-theme-primary/30 shadow-xs'
                      : 'border-theme-subtle hover:border-theme-primary/50 hover:bg-theme-muted/20'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-theme-main">{m.name}</span>
                    {isSelected ? (
                      <span className="rounded-full bg-theme-primary px-2 py-0.5 text-[9px] font-bold text-white">
                        Activa
                      </span>
                    ) : (
                      <span className="rounded bg-theme-muted/40 px-1.5 py-0.5 text-[9px] font-mono text-theme-muted">
                        Máx {machineCap} págs
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-theme-muted">
                    Capacidad por forma: <b>{machineCap} páginas</b>
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-emerald-600">
                    Carga semanal: {m.load}% {m.load > 80 ? '(Alta)' : '(Normal)'}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
