import React from 'react';
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
 Sparkles
} from 'lucide-react';
import { CountDifferenceRecord } from '../../../data/mockCountsData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface DifferenceDetailModalProps {
 difference: CountDifferenceRecord | null;
 onClose: () => void;
 onRequestRecount: (diff: CountDifferenceRecord) => void;
 onMarkInvestigation: (diff: CountDifferenceRecord) => void;
}

export const DifferenceDetailModal: React.FC<DifferenceDetailModalProps> = ({
 difference,
 onClose,
 onRequestRecount,
 onMarkInvestigation,
}) => {
 if (!difference) return null;

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-rose-600">{difference.folio}</span>
 <StatusBadge variant="danger" label={difference.differenceType} size="sm" />
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Detalle de Discrepancia de Conteo
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
 
 {/* Main Difference Badge */}
 <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">
 Ubicación Faltante / Afectada:
 </span>
 <span className="font-mono text-xs font-black text-theme-primary">
 {difference.locationCode}
 </span>
 </div>
 <strong className="text-sm font-black text-theme-main block">
 {difference.productName}
 </strong>
 <div className="flex items-center gap-2 text-[11px] font-mono text-theme-muted">
 <span>SKU: {difference.sku}</span>
 <span>&bull;</span>
 <span>UID: <strong className="text-rose-600">{difference.uid}</strong></span>
 </div>
 </div>

 {/* Quantities & Location Comparison */}
 <div className="grid grid-cols-2 gap-3">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">Ubicación Esperada</span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {difference.expectedLocation}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">Ubicación Física Real</span>
 <strong className="text-xs font-mono font-bold text-rose-600 block">
 {difference.actualLocation}
 </strong>
 </div>
 </div>

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
 <span>Ubicación destino registrada:</span>
 <strong className="font-mono text-theme-main">{difference.lastMovement.location}</strong>
 </div>
 </div>
 </div>

 {/* Non-automatic adjustment note */}
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-[11px] text-zinc-900 flex items-start gap-2 shadow-2xs">
 <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
 <p className="leading-relaxed text-zinc-900">
 <strong className="text-zinc-900 font-bold">Control de Auditoría y Trazabilidad:</strong> Las discrepancias no modifican automáticamente las existencias teóricas del sistema. Se requiere solicitar un segundo recuento físico o abrir un folio de investigación interna antes de autorizar cualquier ajuste contable.
 </p>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs gap-3">
 <button
 onClick={() => onMarkInvestigation(difference)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1.5"
 >
 <Search className="w-3.5 h-3.5" />
 <span>Marcar para investigación</span>
 </button>

 <button
 onClick={() => onRequestRecount(difference)}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <RotateCcw className="w-4 h-4" />
 <span>Solicitar recuento</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
