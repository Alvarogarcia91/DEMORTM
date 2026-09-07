import React, { useState, useMemo } from 'react';
import {
  X, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Clock, ArrowRight, Camera, Printer, Sparkles, Building2,
  FileText, Check, AlertOctagon, RefreshCw, UserCheck, Eye
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import {
  QualityAuditItem,
  OPERATION_CHECKLISTS,
  BatchSample,
  ZebraLabelConfig
} from '../../data/mockCalidadData';
import { ProductionOrder } from '../../data/mockProduccionData';

interface PisoQaAuditModalProps {
  audit: QualityAuditItem;
  nextAudit?: QualityAuditItem | null;
  onClose: () => void;
  onCompleteAudit: (
    audit: QualityAuditItem,
    effect: 'approve' | 'reject' | 'draft',
    defectReason?: string
  ) => void;
  onContinueNext?: (nextAudit: QualityAuditItem) => void;
  onOpenLabelPreview?: (op: string, client: string, part: string, lot: string) => void;
}

export const PisoQaAuditModal: React.FC<PisoQaAuditModalProps> = ({
  audit,
  nextAudit,
  onClose,
  onCompleteAudit,
  onContinueNext,
  onOpenLabelPreview,
}) => {
  // Checklists based on operation type
  const baseCriteria = useMemo(() => {
    const list = OPERATION_CHECKLISTS[audit.operationType] || OPERATION_CHECKLISTS['Impresión + Troquel'] || [
      ['Número de parte y revisión', 'Arte vigente aprobado por cliente', 'Conforme'],
      ['Registro de impresión', '± 0.010 in entre colores y suaje', '0.005 in Conforme'],
      ['Color y tono', 'Referencia PMS cliente aprobada', 'Conforme'],
      ['Dimensiones de etiqueta / pliego', 'Medida exacta según orden técnica', 'Conforme'],
      ['Ausencia de manchas o defectos', 'Cero defectos visuales en muestra', 'Conforme'],
    ];

    return list.map(([criterion, spec], idx) => ({
      id: `c-${idx + 1}`,
      criterion,
      spec,
      isNumeric: spec.includes('±') || spec.includes('in') || spec.includes('mm') || spec.includes('ΔE'),
      tolerance: spec,
      measuredVal: idx === 1 ? '0.006' : '',
      status: 'Conforme' as 'Conforme' | 'No conforme' | 'N/A' | 'Pendiente',
      note: '',
      evidenceAdded: false,
    }));
  }, [audit.operationType]);

  const [criteria, setCriteria] = useState(baseCriteria);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [holdReason, setHoldReason] = useState('Registro fuera de tolerancia dimensional');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedEffect, setCompletedEffect] = useState<'approve' | 'reject' | null>(null);

  // Progress metrics
  const totalReviewed = criteria.filter((c) => c.status !== 'Pendiente').length;
  const hasFailure = criteria.some((c) => c.status === 'No conforme');
  const allConforming = totalReviewed === criteria.length && !hasFailure;

  const handleToggleStatus = (id: string, newStatus: 'Conforme' | 'No conforme' | 'N/A') => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleMeasuredChange = (id: string, val: string) => {
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const num = parseFloat(val);
        let autoStatus = c.status;
        if (!isNaN(num)) {
          // Si es registro ± 0.010 in
          if (c.spec.includes('0.010')) {
            autoStatus = Math.abs(num) <= 0.010 ? 'Conforme' : 'No conforme';
          } else if (c.spec.includes('0.5 mm')) {
            autoStatus = Math.abs(num) <= 0.5 ? 'Conforme' : 'No conforme';
          }
        }
        return { ...c, measuredVal: val, status: autoStatus };
      })
    );
  };

  const handleFinalize = (effect: 'approve' | 'reject') => {
    const updatedAudit: QualityAuditItem = {
      ...audit,
      status: effect === 'approve' ? 'Conforme' : 'Hold',
      checklistResults: criteria.map((c) => ({
        criterion: c.criterion,
        spec: c.spec,
        measured: c.measuredVal || undefined,
        result: c.status === 'Pendiente' ? 'Conforme' : c.status,
        note: c.note || undefined,
      })),
    };

    onCompleteAudit(
      updatedAudit,
      effect,
      effect === 'reject' ? holdReason : undefined
    );

    setCompletedEffect(effect);
    setIsCompleted(true);
  };

  return (
    <ModalPortal onClose={onClose} closeOnBackdropClick={false}>
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-theme-surface border border-theme-subtle shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* POST-AUDIT SUCCESS STATE */}
        {isCompleted ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {completedEffect === 'approve' ? 'Auditoría Aprobada & Liberada' : 'Auditoría en HOLD / Bloqueada'}
              </span>
              <h2 className="text-2xl font-black text-theme-main">
                {audit.folio} cerrada exitosamente
              </h2>
              <p className="text-xs text-theme-muted max-w-md mx-auto">
                {completedEffect === 'approve'
                  ? `La orden ${audit.origin} fue autorizada y desbloqueada para continuar producción en ${audit.line}.`
                  : `La orden ${audit.origin} fue puesta en HOLD y detenida por no conformidad.`}
              </p>
            </div>

            {/* Next route suggestion card */}
            {nextAudit ? (
              <div className="bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 border border-purple-500/30 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Siguiente estación recomendada en tu ruta:
                  </span>
                  <span className="text-[10px] font-mono text-purple-600 font-bold">Ruta Continua</span>
                </div>

                <div className="bg-theme-surface border border-theme-subtle rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-main block">{nextAudit.line}</span>
                    <span className="text-[11px] text-theme-muted font-mono">{nextAudit.origin} · {nextAudit.client}</span>
                    <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">{nextAudit.type}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onContinueNext) onContinueNext(nextAudit);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02]"
                  >
                    <span>Continuar ruta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-theme-muted/20 rounded-xl text-xs text-theme-muted max-w-md mx-auto">
                🎉 No hay más auditorías pendientes en tu ruta actual.
              </div>
            )}

            <div className="pt-4 flex items-center justify-center gap-3">
              {audit.type === 'Auditoría final' && onOpenLabelPreview && (
                <button
                  onClick={() => onOpenLabelPreview(audit.origin, audit.client, audit.part, 'PT-' + audit.folio)}
                  className="px-4 py-2 border border-theme-subtle bg-theme-surface rounded-xl text-xs font-bold text-theme-main hover:bg-theme-muted flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-600" /> Imprimir Etiqueta Zebra
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 bg-theme-main text-theme-inverse rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Volver a Piso QA
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-theme-subtle bg-theme-surface flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300">
                    AUDITORÍA EN PISO · {audit.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-bold text-theme-primary">{audit.folio}</span>
                </div>
                <h2 className="text-lg font-extrabold text-theme-main">
                  {audit.origin} · {audit.client}
                </h2>
                <div className="text-xs text-theme-muted flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-theme-main">{audit.part} · {audit.revision}</span>
                  <span>Estación: <b className="text-theme-main">{audit.line}</b></span>
                  <span>Operador: <b className="text-theme-main">{audit.operator}</b></span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-theme-muted hover:text-theme-main rounded-xl hover:bg-theme-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTEXT STRIP */}
            <div className="bg-theme-muted/30 px-5 py-2.5 border-b border-theme-subtle flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-4 text-theme-muted">
                <span>Operación: <strong className="text-theme-main">{audit.operationType}</strong></span>
                <span>Esperando: <strong className="text-rose-600 font-mono font-bold">{audit.waitingMinutes} min</strong></span>
                <span>Plan de control: <strong className="text-theme-main font-mono">PC-{audit.part.replace(/[^a-zA-Z0-9]/g, '')}-R1</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-theme-muted">Progreso:</span>
                <span className="font-mono font-black text-purple-600 text-xs">{totalReviewed} / {criteria.length} revisados</span>
              </div>
            </div>

            {/* CHECKLIST CARDS BODY */}
            <div className="p-5 overflow-y-auto space-y-3.5 max-h-[58vh]">
              {criteria.map((item, idx) => {
                const isTested = item.status !== 'Pendiente';
                const isFail = item.status === 'No conforme';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                      isFail
                        ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs'
                        : item.status === 'Conforme'
                        ? 'border-emerald-300 dark:border-emerald-800 bg-theme-surface shadow-2xs'
                        : 'border-theme-subtle bg-theme-surface'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-theme-muted/60 text-theme-main font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-sm text-theme-main">{item.criterion}</h4>
                        </div>
                        <p className="text-xs text-theme-muted mt-1 ml-7">
                          Especificación esperada: <span className="font-semibold text-theme-main">{item.spec}</span>
                        </p>
                      </div>

                      {/* Touch Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center ml-7 sm:ml-0">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id, 'Conforme')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            item.status === 'Conforme'
                              ? 'bg-emerald-600 text-white shadow-sm scale-102'
                              : 'bg-theme-muted/40 text-theme-muted hover:text-theme-main'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id, 'No conforme')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            item.status === 'No conforme'
                              ? 'bg-rose-600 text-white shadow-sm scale-102'
                              : 'bg-theme-muted/40 text-theme-muted hover:text-theme-main'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>No Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id, 'N/A')}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            item.status === 'N/A'
                              ? 'bg-zinc-700 text-white shadow-sm'
                              : 'bg-theme-muted/30 text-theme-muted hover:text-theme-main'
                          }`}
                        >
                          N/A
                        </button>
                      </div>
                    </div>

                    {/* Numeric Measurement Input & Auto-tolerance */}
                    {item.isNumeric && (
                      <div className="ml-7 pt-2 border-t border-theme-subtle flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-theme-muted font-medium">Valor medido:</span>
                          <input
                            type="text"
                            value={item.measuredVal}
                            onChange={(e) => handleMeasuredChange(item.id, e.target.value)}
                            placeholder="Ej. 0.006 in"
                            className="w-28 px-2.5 py-1 bg-theme-muted/30 border border-theme-subtle rounded-lg text-xs font-mono font-bold text-theme-main focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {item.measuredVal && (
                          <div className="flex items-center gap-1.5">
                            {item.status === 'Conforme' ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> DENTRO DE TOLERANCIA
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> FUERA DE TOLERANCIA
                              </span>
                            )}
                            <span className="text-[10px] text-theme-muted font-mono">
                              Instrumento: Comparador Óptico QA-012 (Calibrado)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DICTAMEN SECTION & CONTROLS */}
            <div className="p-5 border-t border-theme-subtle bg-theme-surface space-y-3">
              {/* Failure Alert Banner */}
              {hasFailure ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200">
                    <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <span className="font-bold block">1 o más no conformidades detectadas</span>
                      <span className="text-[11px] text-rose-700 dark:text-rose-300">
                        Al rechazar se detendrá la orden {audit.origin} y se enviará a estado HOLD / MNC.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleFinalize('reject')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl font-bold shadow-sm transition-all"
                    >
                      Mandar a HOLD / Rechazar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-theme-muted">
                    {allConforming ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Todos los criterios validados conformes. Listo para liberar.
                      </span>
                    ) : (
                      <span>Revisa y valida todos los criterios para desbloquear la liberación.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-theme-subtle text-xs font-bold text-theme-muted hover:text-theme-main transition-colors"
                    >
                      Guardar Borrador
                    </button>

                    <button
                      type="button"
                      disabled={!allConforming}
                      onClick={() => handleFinalize('approve')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                        allConforming
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 scale-101 cursor-pointer'
                          : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {audit.type === 'Primera pieza'
                          ? 'LIBERAR PRIMERA PIEZA'
                          : audit.type === 'Auditoría final'
                          ? 'LIBERAR BACHE / EMBARQUE'
                          : 'APROBAR AUDITORÍA'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ModalPortal>
  );
};
