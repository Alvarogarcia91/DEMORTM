import React, { useState } from 'react';
import { 
 X, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 Truck, 
 ArrowRight, 
 Check, 
 Radio, 
 Boxes, 
 Building2,
 Store,
 Sparkles,
 ChevronRight
} from 'lucide-react';
import { InventoryTransferOrder } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

interface PrepareTransferModalProps {
 order: InventoryTransferOrder | null;
 onClose: () => void;
 onConfirmDeparture: (order: InventoryTransferOrder) => void;
}

export const PrepareTransferModal: React.FC<PrepareTransferModalProps> = ({
 order,
 onClose,
 onConfirmDeparture,
}) => {
 const [scannedSerials, setScannedSerials] = useState<string[]>([]);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);

 if (!order) return null;

 // Flatten all serials in order
 const allExpectedSerials: string[] = [];
 order.items.forEach(item => {
 item.serials.forEach(s => allExpectedSerials.push(s));
 });

 const totalExpected = allExpectedSerials.length || order.totalUnits;

 // Simulate scanning next expected unit
 const handleScanNext = () => {
 setErrorMessage(null);
 const nextUnscanned = allExpectedSerials.find(s => !scannedSerials.includes(s));
 if (nextUnscanned) {
 setScannedSerials(prev => [...prev, nextUnscanned]);
 }
 };

 // Simulate scanning an invalid/unexpected unit
 const handleScanInvalid = () => {
 setErrorMessage(
 `Unidad no incluida en este traspaso (SC-UID-2026-999401). Verifica la etiqueta física antes de cargar al camión.`
 );
 };

 const isAllScanned = scannedSerials.length >= totalExpected && totalExpected > 0;

 const handleConfirm = () => {
 const updatedOrder: InventoryTransferOrder = {
 ...order,
 status: 'En tránsito',
 departureDate: '28 Ago 2026 09:15',
 };
 onConfirmDeparture(updatedOrder);
 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center font-mono font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <Boxes className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 Preparación & Validación en Rampa
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Escaneo y Carga de Traspaso
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
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Ruta Preview */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Origen</span>
 <strong className="text-xs text-theme-main block">{order.sourceWarehouseName}</strong>
 </div>
 <div className="flex flex-col items-center px-2">
 <span className="text-[9px] font-bold text-indigo-600 mb-0.5">{order.truckPlates || 'Camión #08'}</span>
 <ArrowRight className="w-4 h-4 text-indigo-600" />
 </div>
 <div className="text-right">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Destino</span>
 <strong className="text-xs text-theme-primary block">{order.destinationWarehouseName}</strong>
 </div>
 </div>

 {/* Scanned Counter */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2 text-center">
 <span className="text-[10px] uppercase font-black text-theme-muted tracking-wider block">
 Avance de Escaneo en Rampa de Salida
 </span>
 
 <div className="text-2xl font-mono font-black text-theme-main">
 <span className={scannedSerials.length === totalExpected ? 'text-emerald-600' : 'text-theme-primary'}>
 {scannedSerials.length}
 </span>
 <span className="text-theme-muted"> / {totalExpected} unidades</span>
 </div>

 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div 
 className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
 style={{ width: `${(scannedSerials.length / (totalExpected || 1)) * 100}%` }}
 />
 </div>
 </div>

 {/* Error Banner */}
 {errorMessage && (
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs space-y-1 animate-in shake duration-200">
 <div className="flex items-center gap-2 font-bold">
 <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
 <span>Error de Escaneo</span>
 </div>
 <p className="text-[11px] leading-relaxed">
 {errorMessage}
 </p>
 </div>
 )}

 {/* Serial List with checks */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Lista de Series Asignadas ({allExpectedSerials.length} unidades):
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
 {allExpectedSerials.map((s) => {
 const isScanned = scannedSerials.includes(s);

 return (
 <div
 key={s}
 className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
 isScanned
 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-300'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted'
 }`}
 >
 <div className="flex items-center gap-2 min-w-0">
 <QrCode className={`w-3.5 h-3.5 ${isScanned ? 'text-emerald-600' : 'text-theme-muted'}`} />
 <span className="font-mono text-xs font-bold">{s}</span>
 </div>

 {isScanned ? (
 <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-0.5">
 <Check className="w-2.5 h-2.5" />
 <span>Validado</span>
 </span>
 ) : (
 <span className="text-[9px] font-semibold text-theme-muted">
 Pendiente
 </span>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Actions */}
 <div className="space-y-2 pt-2">
 {!isAllScanned ? (
 <div className="space-y-2">
 <button
 onClick={handleScanNext}
 className="w-full py-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <QrCode className="w-4 h-4" />
 <span>Simular escaneo de serie ({allExpectedSerials.find(s => !scannedSerials.includes(s)) || 'Completado'})</span>
 </button>

 <button
 onClick={handleScanInvalid}
 className="w-full py-2.5 rounded-xl bg-theme-muted hover:bg-rose-500/10 text-theme-muted hover:text-rose-600 font-semibold text-xs transition-colors border border-theme-subtle cursor-pointer flex items-center justify-center gap-1.5"
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 <span>Simular escaneo de serie incorrecta (SC-UID-2026-999401)</span>
 </button>
 </div>
 ) : (
 <button
 onClick={handleConfirm}
 className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <Truck className="w-4 h-4" />
 <span>Confirmar salida &bull; Enviar orden en tránsito</span>
 </button>
 )}
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};
