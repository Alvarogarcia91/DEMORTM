import React, { useState } from 'react';
import { 
 X, 
 Wrench, 
 Check, 
 MapPin, 
 ArrowRight, 
 ShieldAlert 
} from 'lucide-react';
import { OperationalIncident } from '../../../data/mockIncidentsData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReworkTransferModalProps {
 incident: OperationalIncident;
 onClose: () => void;
 onConfirmTransfer: (targetLocation: string, notes: string) => void;
}

export const ReworkTransferModal: React.FC<ReworkTransferModalProps> = ({
 incident,
 onClose,
 onConfirmTransfer,
}) => {
 const [targetLocation, setTargetLocation] = useState('RET-NORTE');
 const [notes, setNotes] = useState('Traslado a área de retrabajo para inspección y reempaque de producto.');

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <Wrench className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Trasladar Unidad a Retrabajo
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {incident.code} &bull; Área de Garantías
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

 {/* Body */}
 <div className="p-6 space-y-4 text-xs overflow-y-auto">
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-zinc-900 shadow-2xs space-y-1">
 <strong className="text-xs font-bold block text-zinc-900">Acción Correctiva</strong>
 <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
 La unidad física será retirada de su ubicación actual y transferida a la zona de retrabajo para diagnóstico, reempaque o dictamen de calidad.
 </p>
 </div>

 {/* Unit & Location Preview */}
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2 text-xs">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidad Serializada:</span>
 <strong className="font-mono text-rose-600 block">{incident.uid || 'RTM-UID-2026-000201'}</strong>
 <span className="text-[10px] text-theme-muted">{incident.productName}</span>
 </div>

 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle font-mono">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Ubicación Origen:</span>
 <strong className="text-theme-main">{incident.locationCode || 'REC-01'}</strong>
 </div>
 <ArrowRight className="w-4 h-4 text-theme-muted" />
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Destino Retrabajo:</span>
 <strong className="text-amber-600">{targetLocation}</strong>
 </div>
 </div>
 </div>

 {/* Target Location Selector */}
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Área de Retrabajo Destino:
 </label>
 <select
 value={targetLocation}
 onChange={(e) => setTargetLocation(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="RET-NORTE">RET-NORTE &bull; Área Retrabajo y Garantías Norte</option>
 <option value="RET-SUR">RET-SUR &bull; Área Retrabajo y Garantías Sur</option>
 <option value="QUA-BLOQ">QUA-BLOQ &bull; Cuarentena de Calidad</option>
 </select>
 </div>

 {/* Notes */}
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Instrucciones de Retrabajo:
 </label>
 <textarea
 rows={3}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs text-theme-main focus:outline-none resize-none font-medium"
 />
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
 onClick={() => onConfirmTransfer(targetLocation, notes)}
 className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Confirmar traslado a retrabajo</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
