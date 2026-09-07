import React, { useState } from 'react';
import { 
 X, 
 AlertTriangle, 
 ArrowRightLeft, 
 Check, 
 Tag, 
 Clock, 
 Layers 
} from 'lucide-react';
import { PickPlanStop } from '../../../data/mockPickingData';
import { ModalPortal } from '../../common/ModalPortal';

interface PickSubstitutionModalProps {
 plannedStop: PickPlanStop;
 scannedUid: string;
 onClose: () => void;
 onConfirmSubstitution: (scannedUid: string, reason: string) => void;
}

export const PickSubstitutionModal: React.FC<PickSubstitutionModalProps> = ({
 plannedStop,
 scannedUid,
 onClose,
 onConfirmSubstitution,
}) => {
 const [reason, setReason] = useState('Unidad no accesible en posición original');

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <ArrowRightLeft className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Sustitución de Unidad en Recolección
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 Mismo SKU &bull; Validación de Reemplazo
 </span>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
 
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-zinc-900 space-y-1 shadow-2xs">
 <div className="flex items-center gap-1.5 font-bold text-amber-600">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span className="text-zinc-900">Sustitución Operativa</span>
 </div>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
 La unidad escaneada (<strong className="font-mono text-zinc-900">{scannedUid}</strong>) corresponde al mismo artículo ({plannedStop.sku}), pero difiere de la sugerida por la estrategia.
 </p>
 </div>

 {/* Planned vs Scanned Comparison */}
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidad Planeada:</span>
 <strong className="font-mono text-rose-600 block truncate">{plannedStop.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono block">Antigüedad: {plannedStop.ageDays} días</span>
 </div>

 <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
 <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">Unidad Propuesta:</span>
 <strong className="font-mono text-emerald-700 dark:text-emerald-300 block truncate">{scannedUid}</strong>
 <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono block">Mismo SKU &bull; Válida</span>
 </div>
 </div>

 {/* Reason Selector */}
 <div className="space-y-1.5 pt-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Motivo de Sustitución:
 </label>
 <select
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Unidad no accesible en posición original">Unidad no accesible en posición original</option>
 <option value="Etiqueta QR / código dañado">Etiqueta QR / código dañado</option>
 <option value="Incidencia física / empaque dañado">Incidencia física / empaque dañado</option>
 <option value="Unidad retirada previamente por inventario">Unidad retirada previamente por inventario</option>
 </select>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 onClick={() => onConfirmSubstitution(scannedUid, reason)}
 className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Confirmar sustitución</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
