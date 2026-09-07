import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  GitPullRequest,
  Layers,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Wrench,
  X,
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { IcarAction, QualityDeviation } from '../../data/mockCalidadData';

interface Props {
  deviation: QualityDeviation;
  onClose: () => void;
  onOpenIcar: (deviation: QualityDeviation, icarData: Partial<IcarAction>) => void;
  onResolveDeviation: (deviationId: string, resolutionNote: string) => void;
}

export const AnalizarDesviacionModal: React.FC<Props> = ({
  deviation,
  onClose,
  onOpenIcar,
  onResolveDeviation,
}) => {
  const [selected4M, setSelected4M] = useState<QualityDeviation['category4M']>(deviation.category4M);
  const [responsible, setResponsible] = useState(deviation.suggestedResponsible);
  const [containment, setContainment] = useState(deviation.containmentAction);
  const [rootCause, setRootCause] = useState(
    `Análisis 5 Porqués (Calidad): Desviación provocada en estación ${deviation.machine}. Factor principal: ${selected4M}.`
  );
  const [correctiveAction, setCorrectiveAction] = useState(
    'Estandarización de control operativo y validación previa obligatoria por Calidad antes de liberar etapa.'
  );

  const handleCreateIcar = () => {
    onOpenIcar(deviation, {
      title: `ICAR: ${deviation.type} en ${deviation.opFolio} (${deviation.machine})`,
      source: `${deviation.id} · ${deviation.opFolio}`,
      area: deviation.machine.includes('Mark') ? 'Flexografía' : 'Offset / Acabados',
      category4M: selected4M,
      responsible,
      rootCause,
      correctiveAction,
      status: 'Abierta',
    });
  };

  const handleResolve = () => {
    onResolveDeviation(
      deviation.id,
      `Contención aplicada: ${containment}. Verificado por Alicia Ramírez (Calidad).`
    );
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-theme-subtle bg-theme-surface p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                  {deviation.id}
                </span>
                <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2 py-0.2 text-[9px] font-black uppercase text-rose-800 dark:text-rose-300">
                  Severidad {deviation.severity}
                </span>
              </div>
              <h2 className="text-base font-black text-theme-main mt-0.5">
                Análisis Operativo 4M & Causa Raíz
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Tarjeta de Hallazgo y Desviación Detectada */}
          <div className="rounded-2xl border border-amber-400/50 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/50 dark:border-amber-900/40 pb-2">
              <div className="flex items-center gap-2">
                <b className="font-mono text-xs font-black text-theme-main">{deviation.opFolio}</b>
                <span className="text-theme-muted">·</span>
                <span className="font-bold text-theme-main">{deviation.client}</span>
                <span className="text-theme-muted">({deviation.partNumber})</span>
              </div>
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">
                <Clock className="h-3.5 w-3.5" /> {deviation.stoppedMinutes} minutos perdidos en piso
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 text-[11px]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                  Ruta / Parámetro Esperado:
                </span>
                <p className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                  {deviation.expected}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                  Ejecutado Real en Piso:
                </span>
                <p className="font-mono text-rose-700 dark:text-rose-300 font-bold">
                  {deviation.actual}
                </p>
              </div>
            </div>

            {deviation.operatorComment && (
              <div className="rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-[11px]">
                <b className="text-theme-muted block text-[10px] uppercase">Comentario de Piso / Operador:</b>
                <p className="text-theme-main italic mt-0.5">{deviation.operatorComment}</p>
              </div>
            )}
          </div>

          {/* Selector de Clasificación 4M */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              1. Clasificación Metodológica 4M (Ishikawa):
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['Máquina', 'Material', 'Mano de obra', 'Método'] as QualityDeviation['category4M'][]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelected4M(item)}
                    className={`rounded-2xl border p-3 text-center transition-all ${
                      selected4M === item
                        ? 'border-theme-primary bg-theme-primary/10 text-theme-primary font-bold shadow-xs ring-1 ring-theme-primary'
                        : 'border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/20'
                    }`}
                  >
                    <b className="block text-xs">{item}</b>
                    <span className="text-[10px] block opacity-80 mt-0.5">
                      {item === 'Máquina' && 'Ajuste / Desgaste'}
                      {item === 'Material' && 'Lote / Sustrato'}
                      {item === 'Mano de obra' && 'Operador / Skill'}
                      {item === 'Método' && 'Ruta / Procedimiento'}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Formulario de Análisis Causa Raíz (5 Porqués) y Contención */}
          <div className="space-y-4 rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-theme-muted">
                  Responsable del Análisis / Área:
                </label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-theme-muted">
                  Acción Inmediata de Contención (Piso):
                </label>
                <input
                  type="text"
                  value={containment}
                  onChange={(e) => setContainment(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-theme-muted">
                Causa Raíz / Conclusión Técnica (Alicia Ramírez):
              </label>
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-theme-muted">
                Propuesta de Acción Correctiva Permanente (ICAR):
              </label>
              <textarea
                rows={2}
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Footer de Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-4">
            <button
              type="button"
              onClick={handleResolve}
              className="rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100"
            >
              <CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-600" />
              Contener y Resolver Desviación
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleCreateIcar}
                className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90 flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                Abrir Acción Correctiva (ICAR) · SGC
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
