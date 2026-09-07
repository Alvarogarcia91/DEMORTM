import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Tag, 
  User, 
  Info,
  ShieldAlert,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { CountDifferenceRecord } from '../../../data/mockCountsData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface DifferenceDetailModalProps {
  difference: CountDifferenceRecord | null;
  onClose: () => void;
  onRequestRecount: (diff: CountDifferenceRecord) => void;
  onMarkInvestigation: (diff: CountDifferenceRecord) => void;
  onApplyAdjustment?: (diff: CountDifferenceRecord) => void;
}

export const DifferenceDetailModal: React.FC<DifferenceDetailModalProps> = ({
  difference,
  onClose,
  onRequestRecount,
  onMarkInvestigation,
  onApplyAdjustment,
}) => {
  const [adjustmentDone, setAdjustmentDone] = useState(false);

  if (!difference) return null;

  const diffQuantity = difference.actualCount - difference.expectedCount;
  const isCouchFlagship = difference.sku === 'MP-COU-090' || difference.expectedCount === 22000;

  const handleApplyAdjustmentInternal = () => {
    setAdjustmentDone(true);
    if (onApplyAdjustment) {
      onApplyAdjustment(difference);
    }
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-rose-600">{difference.folio}</span>
                <StatusBadge variant="danger" label={difference.differenceType} size="sm" />
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
                  Estado: {difference.status}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
                Detalle de Discrepancia de Conteo Físico
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Main Difference Card */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">
                Ubicación Auditada:
              </span>
              <span className="font-mono text-xs font-black text-theme-primary">
                {difference.locationCode}
              </span>
            </div>
            <strong className="text-sm font-black text-theme-main block">
              {difference.productName}
            </strong>
            <div className="flex items-center gap-2 text-[11px] font-mono text-theme-muted">
              <span>SKU: <strong className="text-theme-main">{difference.sku}</strong></span>
              <span>&bull;</span>
              <span>Identificador: <strong className="text-rose-600">{difference.uid}</strong></span>
            </div>
          </div>

          {/* Comparativo de Cantidades (Caso Estrella RTM) */}
          <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Comparativo de Existencias del Conteo
            </span>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">En Sistema</span>
                <strong className="text-sm sm:text-base font-mono font-black text-theme-main block mt-0.5">
                  {difference.expectedCount.toLocaleString()}
                </strong>
                <span className="text-[10px] text-theme-muted">teórico</span>
              </div>

              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Físico Contado</span>
                <strong className="text-sm sm:text-base font-mono font-black text-theme-main block mt-0.5">
                  {difference.actualCount.toLocaleString()}
                </strong>
                <span className="text-[10px] text-theme-muted">en tarima</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-[9px] uppercase font-bold text-rose-700 block">Diferencia</span>
                <strong className="text-sm sm:text-base font-mono font-black text-rose-600 block mt-0.5">
                  {diffQuantity > 0 ? `+${diffQuantity.toLocaleString()}` : diffQuantity.toLocaleString()}
                </strong>
                <span className="text-[10px] text-rose-600 font-bold">pliegos faltantes</span>
              </div>
            </div>
          </div>

          {/* Demo Scenario Notice */}
          {isCouchFlagship && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block">Escenario DEMO RTM · Auditoría de Papel Couché:</strong>
                <p className="leading-relaxed">
                  Escenario inspirado en la problemática de control de mermas y consumos no descargados en órdenes de producción previas. Permite demostrar el flujo completo: <em>Conteo &rarr; Discrepancia &rarr; Recuento &rarr; Investigación &rarr; Ajuste trazable</em>.
                </p>
              </div>
            </div>
          )}

          {/* Last Registered Movement Trace */}
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-theme-main font-bold text-xs">
              <Clock className="w-4 h-4 text-theme-primary" />
              <span>Último Movimiento Registrado en Sistema:</span>
            </div>

            <div className="space-y-1 text-[11px] text-theme-muted pt-1 border-t border-theme-subtle">
              <div className="flex justify-between">
                <span>Fecha y hora:</span>
                <strong className="font-mono text-theme-main">{difference.lastMovement.date}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tipo de operación:</span>
                <strong className="text-theme-main">{difference.lastMovement.type}</strong>
              </div>
              <div className="flex justify-between">
                <span>Operador / Terminal:</span>
                <strong className="text-theme-main">{difference.lastMovement.user}</strong>
              </div>
              <div className="flex justify-between">
                <span>Ubicación registrada:</span>
                <strong className="font-mono text-theme-main">{difference.lastMovement.location}</strong>
              </div>
            </div>
          </div>

          {/* Audit Rule Note */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-theme-subtle text-[11px] text-theme-muted flex items-start gap-2 shadow-2xs">
            <Info className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-theme-main font-bold">Protocolo de Ajustes:</strong> Las discrepancias no modifican automáticamente el stock físico de planta sin autorización formal de auditoría y supervisión.
            </p>
          </div>

          {adjustmentDone && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ajuste trazable generado exitosamente en bitácora de auditoría con folio AJ-2026-0031.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMarkInvestigation(difference)}
              className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Marcar investigación</span>
            </button>

            <button
              onClick={handleApplyAdjustmentInternal}
              disabled={adjustmentDone}
              className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ajuste trazable</span>
            </button>
          </div>

          <button
            onClick={() => onRequestRecount(difference)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Solicitar recuento físico</span>
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
