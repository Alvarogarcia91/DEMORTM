import React from 'react';
import { X, ShieldAlert, AlertTriangle, QrCode, Calendar, Wrench, CheckCircle2 } from 'lucide-react';
import { SpecialAreaSlot } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

interface ReworkModalProps {
 reworkZone: SpecialAreaSlot | null;
 warehouseName: string;
 onClose: () => void;
}

export const ReworkModal: React.FC<ReworkModalProps> = ({
 reworkZone,
 warehouseName,
 onClose,
}) => {
 if (!reworkZone) return null;

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-amber-500 shadow-2xs">
 <ShieldAlert className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h2 className="text-sm font-bold text-theme-main">
 {reworkZone.name}
 </h2>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 Zona Especial
 </span>
 </div>
 <p className="text-[11px] text-theme-muted">
 {warehouseName} &middot; Capacidad: {reworkZone.capacity} piezas &middot; Ocupación actual: {reworkZone.currentUnits} piezas
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content Body */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1">
 <div className="p-3.5 rounded-xl bg-white border border-amber-500 text-xs text-zinc-900 space-y-1 shadow-2xs">
 <span className="font-bold flex items-center gap-1.5 text-amber-600">
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 <span className="text-zinc-900">Control de Incidencias e Inspección de Calidad</span>
 </span>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
 En esta bahía se resguardan unidades / bobinas con empaque dañado, incidencias en rampa de recibo, pendientes de reempaque al vacío o devoluciones en validación antes de su reintegración a racks.
 </p>
 </div>

 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 Unidades en Proceso de Retrabajo ({reworkZone.units.length})
 </span>
 <span className="text-[10px] font-mono text-theme-muted">
 Estado: <strong className="text-emerald-600">Operativa</strong>
 </span>
 </div>

 {reworkZone.units.length === 0 ? (
 <div className="p-8 text-center text-xs text-theme-muted">
 No hay unidades con incidencia en esta zona.
 </div>
 ) : (
 reworkZone.units.map((u, idx) => (
 <div
 key={idx}
 className="p-4 rounded-xl border border-amber-500/30 bg-theme-surface space-y-2 shadow-xs"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <QrCode className="w-3.5 h-3.5 text-theme-primary" />
 <span className="font-mono text-xs font-bold text-theme-main">{u.uid}</span>
 </div>
 <span className="font-mono text-xs font-semibold text-theme-primary">{u.sku}</span>
 </div>

 <p className="text-xs font-bold text-theme-main">{u.productName}</p>

 <div className="p-2 rounded-lg bg-theme-muted/50 border border-theme-subtle text-[11px] space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-amber-700 block">Motivo de Retrabajo:</span>
 <p className="text-theme-main font-medium">{u.reason}</p>
 </div>

 <div className="flex items-center justify-between text-[10px] text-theme-muted pt-1">
 <div className="flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 <span>Ingreso a zona: {u.entryDate}</span>
 </div>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 En Revisión
 </span>
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-3 border-t border-theme-subtle flex items-center justify-between bg-theme-muted/40 text-xs text-theme-muted">
 <span>Área aislada de inventario comercial disponible</span>
 <button
 onClick={onClose}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
