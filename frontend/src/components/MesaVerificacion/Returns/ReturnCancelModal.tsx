import React, { useState } from 'react';
import { 
 X, 
 AlertTriangle, 
 Check 
} from 'lucide-react';
import { ReturnOrder } from '../../../data/mockReturnsData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReturnCancelModalProps {
 order: ReturnOrder;
 onClose: () => void;
 onConfirmCancel: (reason: string) => void;
}

export const ReturnCancelModal: React.FC<ReturnCancelModalProps> = ({
 order,
 onClose,
 onConfirmCancel,
}) => {
 const [reason, setReason] = useState('Solicitud cancelada por el cliente');
 const [customReason, setCustomReason] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 const finalReason = reason === 'Otro' ? customReason.trim() : reason;
 if (!finalReason) return;
 onConfirmCancel(finalReason);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Cancelar Solicitud de Devolución
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">
 {order.folio} &bull; {order.reference}
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
 <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 space-y-1">
 <strong className="text-xs font-bold block">Confirmación Requerida</strong>
 <p className="text-[11px] leading-relaxed">
 La orden será cancelada y no afectará las existencias ni la trazabilidad de las unidades físicas.
 </p>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Motivo de Cancelación:
 </label>
 <select
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Solicitud cancelada por el cliente">Solicitud cancelada por el cliente</option>
 <option value="Unidad no retornada en camión">Unidad no retornada en camión</option>
 <option value="Error de captura en mesa">Error de captura en mesa</option>
 <option value="Devolución reasignada a otra sucursal">Devolución reasignada a otra sucursal</option>
 <option value="Otro">Otro</option>
 </select>
 </div>

 {reason === 'Otro' && (
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Especifica el motivo:
 </label>
 <textarea
 rows={2}
 required
 value={customReason}
 onChange={(e) => setCustomReason(e.target.value)}
 placeholder="Ingresa la justificación operativa..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-xs text-theme-main focus:outline-none resize-none font-medium"
 />
 </div>
 )}

 {/* Footer */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-between">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Volver
 </button>

 <button
 type="submit"
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Confirmar cancelación</span>
 </button>
 </div>
 </form>
 </div>
 </ModalPortal>
 );
};
