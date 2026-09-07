import React, { useState } from 'react';
import { 
 X, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 ArrowRight, 
 Check, 
 Building2, 
 Store, 
 PackageCheck,
 Truck,
 Sparkles,
 Layers
} from 'lucide-react';
import { InventoryTransferOrder } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

interface ReceiveTransferModalProps {
 order: InventoryTransferOrder | null;
 onClose: () => void;
 onConfirmReceived: (order: InventoryTransferOrder, hadIncidence: boolean, missingUid?: string) => void;
}

export const ReceiveTransferModal: React.FC<ReceiveTransferModalProps> = ({
 order,
 onClose,
 onConfirmReceived,
}) => {
 const [receivedSerials, setReceivedSerials] = useState<string[]>([]);
 const [hasIncidence, setHasIncidence] = useState(false);
 const [missingSerial, setMissingSerial] = useState<string | null>(null);

 if (!order) return null;

 const allExpectedSerials: string[] = [];
 order.items.forEach(item => {
 item.serials.forEach(s => allExpectedSerials.push(s));
 });

 const totalExpected = allExpectedSerials.length || order.totalUnits;

 // Normal scan of next unit
 const handleScanNext = () => {
 const nextUnscanned = allExpectedSerials.find(s => !receivedSerials.includes(s) && s !== missingSerial);
 if (nextUnscanned) {
 setReceivedSerials(prev => [...prev, nextUnscanned]);
 }
 };

 // Simulate missing unit incidence (Demo feature)
 const handleSimulateMissing = () => {
 if (allExpectedSerials.length > 0) {
 const lastSerial = allExpectedSerials[allExpectedSerials.length - 1];
 setMissingSerial(lastSerial);
 setHasIncidence(true);
 // Scan all except the missing one
 const rest = allExpectedSerials.filter(s => s !== lastSerial);
 setReceivedSerials(rest);
 }
 };

 const isAllComplete = receivedSerials.length === totalExpected;
 const isIncidenceReady = hasIncidence && missingSerial !== null;

 const handleConfirm = () => {
 const updatedOrder: InventoryTransferOrder = {
 ...order,
 status: hasIncidence ? 'Con incidencia' : 'Recibido',
 arrivalDate: '28 Ago 2026 14:20',
 };
 onConfirmReceived(updatedOrder, hasIncidence, missingSerial || undefined);
 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-mono font-bold text-sm border border-emerald-600 shadow-2xs shrink-0">
 <PackageCheck className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 Recepción en {order.destinationWarehouseName}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Verificación y Descarga de Traspaso
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

 {/* Progress Counter */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2 text-center">
 <span className="text-[10px] uppercase font-black text-theme-muted tracking-wider block">
 Unidades Escaneadas al Descargar
 </span>
 
 <div className="text-2xl font-mono font-black text-theme-main">
 <span className={isAllComplete ? 'text-emerald-600' : hasIncidence ? 'text-amber-600' : 'text-theme-primary'}>
 {receivedSerials.length}
 </span>
 <span className="text-theme-muted"> / {totalExpected} recibidas</span>
 </div>

 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div 
 className={`h-full transition-all duration-300 rounded-full ${hasIncidence ? 'bg-amber-500' : 'bg-emerald-500'}`}
 style={{ width: `${(receivedSerials.length / (totalExpected || 1)) * 100}%` }}
 />
 </div>
 </div>

 {/* Incidence Banner */}
 {hasIncidence && missingSerial && (
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-zinc-900 text-xs space-y-1 shadow-2xs animate-in shake duration-200">
 <div className="flex items-center gap-2 font-bold text-amber-600">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span className="text-zinc-900 font-bold">1 Unidad Faltante Identificada en Recepción</span>
 </div>
 <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
 Serie no encontrada en el camión: <strong className="font-mono text-zinc-900">{missingSerial}</strong>. El traspaso se registrará con estado <span className="font-bold text-zinc-900">Con incidencia</span> para auditoría.
 </p>
 </div>
 )}

 {/* Serial List */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Verificación de Piezas ({allExpectedSerials.length} totales):
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
 {allExpectedSerials.map((s) => {
 const isRec = receivedSerials.includes(s);
 const isMiss = s === missingSerial;

 return (
 <div
 key={s}
 className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
 isRec
 ? 'bg-white border-emerald-600 text-zinc-900 shadow-2xs'
 : isMiss
 ? 'bg-white border-rose-500 text-zinc-900 shadow-2xs'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted'
 }`}
 >
 <div className="flex items-center gap-2 min-w-0">
 <QrCode className={`w-3.5 h-3.5 ${isRec ? 'text-emerald-600' : isMiss ? 'text-rose-600' : 'text-theme-muted'}`} />
 <span className="font-mono text-xs font-bold">{s}</span>
 </div>

 {isRec ? (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs flex items-center gap-0.5">
 <Check className="w-2.5 h-2.5 text-emerald-600" />
 <span>Recibido</span>
 </span>
 ) : isMiss ? (
 <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
 Faltante
 </span>
 ) : (
 <span className="text-[9px] font-semibold text-theme-muted">
 Por escanear
 </span>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="space-y-2 pt-2">
 {!isAllComplete && !isIncidenceReady ? (
 <div className="space-y-2">
 <button
 onClick={handleScanNext}
 className="w-full py-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <QrCode className="w-4 h-4" />
 <span>Simular escaneo en destino ({allExpectedSerials.find(s => !receivedSerials.includes(s)) || 'Listo'})</span>
 </button>

 <button
 onClick={handleSimulateMissing}
 className="w-full py-2.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors border border-amber-500 shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
 <span>Simular faltante de 1 pieza (Demo de incidencia)</span>
 </button>
 </div>
 ) : (
 <button
 onClick={handleConfirm}
 className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
 hasIncidence ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
 }`}
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>
 {hasIncidence ? 'Registrar recepción con Incidencia' : 'Confirmar recepción &bull; Ingresar a Inventario de Destino'}
 </span>
 </button>
 )}
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};
