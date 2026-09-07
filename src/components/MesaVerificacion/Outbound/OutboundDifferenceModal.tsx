import React, { useState } from 'react';
import { 
 X, 
 AlertTriangle, 
 Check, 
 FileText 
} from 'lucide-react';
import { OutboundVerificationOrder } from '../../../data/mockOutboundVerificationData';
import { ModalPortal } from '../../common/ModalPortal';

interface OutboundDifferenceModalProps {
 order: OutboundVerificationOrder;
 onClose: () => void;
 onConfirmDifference: (type: 'Faltante' | 'UID incorrecta' | 'Unidad adicional' | 'Etiqueta ilegible' | 'Daño físico', notes: string) => void;
}

export const OutboundDifferenceModal: React.FC<OutboundDifferenceModalProps> = ({
 order,
 onClose,
 onConfirmDifference,
}) => {
 const [diffType, setDiffType] = useState<'Faltante' | 'UID incorrecta' | 'Unidad adicional' | 'Etiqueta ilegible' | 'Daño físico'>('Faltante');
 const [notes, setNotes] = useState('Se detectó discrepancia durante el escaneo de piezas en rampa.');

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Registrar Diferencia de Salida
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
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-zinc-900 shadow-2xs space-y-1">
 <strong className="text-xs font-bold block text-zinc-900">Afectación de Verificación</strong>
 <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
 La orden pasará a estado <strong className="font-bold text-zinc-900">Con diferencia</strong>. No podrá ser marcada como lista para carga hasta que la discrepancia física sea resuelta o autorizada.
 </p>
 </div>

 {/* Type Selector */}
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Tipo de Discrepancia Detectada:
 </label>
 <select
 value={diffType}
 onChange={(e) => setDiffType(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Faltante">Faltante (Pieza no localizada en preparación)</option>
 <option value="UID incorrecta">UID incorrecta (Serie física no coincide con orden)</option>
 <option value="Unidad adicional">Unidad adicional (Sobrante físico en carril)</option>
 <option value="Etiqueta ilegible">Etiqueta ilegible / QR dañado</option>
 <option value="Daño físico">Daño físico / Empaque roto</option>
 </select>
 </div>

 {/* Notes Input */}
 <div className="space-y-1.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Observaciones Operativas:
 </label>
 <textarea
 rows={3}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Describe detalladamente la causa de la diferencia..."
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
 onClick={() => onConfirmDifference(diffType, notes)}
 className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Guardar diferencia</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
