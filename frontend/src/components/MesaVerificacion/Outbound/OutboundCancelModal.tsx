import React, { useState } from 'react';
import { 
 X, 
 AlertOctagon, 
 Check, 
 Trash2 
} from 'lucide-react';
import { OutboundVerificationOrder } from '../../../data/mockOutboundVerificationData';
import { ModalPortal } from '../../common/ModalPortal';

interface OutboundCancelModalProps {
 order: OutboundVerificationOrder;
 onClose: () => void;
 onConfirmCancel: (reason: string) => void;
}

export const OutboundCancelModal: React.FC<OutboundCancelModalProps> = ({
 order,
 onClose,
 onConfirmCancel,
}) => {
 const [reason, setReason] = useState('Preparación incompleta en zona de salida');

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertOctagon className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Cancelar Verificación de Salida
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {order.folio} &bull; Ref: {order.referenceFolio}
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
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 space-y-1">
 <strong className="text-xs font-bold block">Confirmación de Cancelación</strong>
 <p className="text-[11px] leading-relaxed">
 La orden de verificación pasará a estado <strong className="font-bold">Cancelada</strong>. El inventario permanecerá en su ubicación actual ({order.stagingLocation}) sin afectar existencias.
 </p>
 </div>

 {/* Reason Selector */}
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Motivo Obligatorio de Cancelación:
 </label>
 <select
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Preparación incompleta en zona de salida">Preparación incompleta en zona de salida</option>
 <option value="Orden incorrecta / Error en traspaso">Orden incorrecta / Error en traspaso</option>
 <option value="Cambio de prioridad o reprogramación de ruta">Cambio de prioridad o reprogramación de ruta</option>
 <option value="Error operativo de escaneo">Error operativo de escaneo</option>
 </select>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Volver
 </button>

 <button
 onClick={() => onConfirmCancel(reason)}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Trash2 className="w-4 h-4" />
 <span>Confirmar cancelación</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
