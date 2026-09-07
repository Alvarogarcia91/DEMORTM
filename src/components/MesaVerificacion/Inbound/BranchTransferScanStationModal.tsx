import React, { useState } from 'react';
import { 
 X, 
 Scan, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 ArrowRight, 
 Building2, 
 Truck, 
 Layers, 
 PackageCheck, 
 AlertCircle,
 Sparkles,
 RotateCcw,
 Check
} from 'lucide-react';
import { InventoryTransferOrder } from '../../../data/mockInventoryData';
import { OperatingFacilityOption } from '../../../context/VerificationDeskContext';
import { ModalPortal } from '../../common/ModalPortal';

interface BranchTransferScanStationModalProps {
 transfer: InventoryTransferOrder;
 facility: OperatingFacilityOption;
 onClose: () => void;
 onConfirmReception: (updatedTransfer: InventoryTransferOrder, newlyReceivedSerials: string[]) => void;
 onShowToast?: (msg: string) => void;
}

export const BranchTransferScanStationModal: React.FC<BranchTransferScanStationModalProps> = ({
 transfer,
 facility,
 onClose,
 onConfirmReception,
 onShowToast,
}) => {
 // All expected UIDs across all items in this transfer
 const allExpectedSerials = React.useMemo(() => {
 const set = new Set<string>();
 transfer.items.forEach((item) => {
 item.serials.forEach((s) => set.add(s));
 });
 return Array.from(set);
 }, [transfer]);

 // Set of initially received serials
 const initialReceivedSet = React.useMemo(() => {
 return new Set<string>(transfer.receivedSerials || []);
 }, [transfer]);

 // Current session received serials (starts with already received serials)
 const [currentReceivedSerials, setCurrentReceivedSerials] = useState<string[]>(() => {
 return Array.from(initialReceivedSet);
 });

 // Manual input field for scanning UID
 const [manualInput, setManualInput] = useState('');
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'duplicate'>('idle');
 const [feedbackMessage, setFeedbackMessage] = useState<{
 type: 'success' | 'error' | 'duplicate';
 title: string;
 detail: string;
 uid?: string;
 } | null>(null);

 const [confirmPartialOpen, setConfirmPartialOpen] = useState(false);

 // Derive pending serials
 const pendingSerials = allExpectedSerials.filter((s) => !currentReceivedSerials.includes(s));
 const isAllReceived = currentReceivedSerials.length === allExpectedSerials.length;
 const progressPercent = Math.round((currentReceivedSerials.length / (allExpectedSerials.length || 1)) * 100);

 // Helper to find which item an expected UID belongs to
 const findItemForSerial = (uid: string) => {
 return transfer.items.find((item) => item.serials.includes(uid));
 };

 // Process a scanned or typed UID
 const processScan = (scannedUid: string) => {
 const cleanUid = scannedUid.trim().toUpperCase();
 if (!cleanUid) return;

 setScanStatus('scanning');

 setTimeout(() => {
 // 1. Check if already scanned
 if (currentReceivedSerials.includes(cleanUid)) {
 setScanStatus('duplicate');
 setFeedbackMessage({
 type: 'duplicate',
 title: '✕ Unidad ya recibida previamente',
 detail: `La unidad ${cleanUid} ya fue registrada en este traspaso. No se incrementa el contador.`,
 uid: cleanUid,
 });
 return;
 }

 // 2. Check if UID belongs to this transfer order
 const matchingItem = findItemForSerial(cleanUid);
 if (!matchingItem) {
 setScanStatus('error');
 setFeedbackMessage({
 type: 'error',
 title: '✕ Unidad no incluida en este traspaso',
 detail: `El UID ${cleanUid} no pertenece a la orden ${transfer.folio}. No se agrega a la recepción.`,
 uid: cleanUid,
 });
 return;
 }

 // 3. Valid scan
 const updatedList = [...currentReceivedSerials, cleanUid];
 setCurrentReceivedSerials(updatedList);
 setScanStatus('success');
 setFeedbackMessage({
 type: 'success',
 title: '✓ Unidad recibida correctamente',
 detail: `${matchingItem.productName} · Origen: ${transfer.sourceWarehouseName}`,
 uid: cleanUid,
 });
 setManualInput('');
 }, 250);
 };

 // Simulations
 const handleSimulateNextValid = () => {
 if (pendingSerials.length > 0) {
 processScan(pendingSerials[0]);
 }
 };

 const handleSimulateDuplicate = () => {
 if (currentReceivedSerials.length > 0) {
 processScan(currentReceivedSerials[0]);
 } else if (allExpectedSerials.length > 0) {
 processScan(allExpectedSerials[0]);
 }
 };

 const handleSimulateInvalid = () => {
 processScan('TAR-RTM-2026-000333');
 };

 // Final confirmation logic
 const handleSaveReception = (allowPartial: boolean = false) => {
 const isComplete = currentReceivedSerials.length === allExpectedSerials.length;
 
 if (!isComplete && !allowPartial) {
 setConfirmPartialOpen(true);
 return;
 }

 const newlyAdded = currentReceivedSerials.filter((s) => !initialReceivedSet.has(s));

 // Update items receivedSerials
 const updatedItems = transfer.items.map((item) => {
 const itemReceived = item.serials.filter((s) => currentReceivedSerials.includes(s));
 return {
 ...item,
 receivedSerials: itemReceived,
 };
 });

 const newStatus: InventoryTransferOrder['status'] = isComplete
 ? 'Recibido'
 : currentReceivedSerials.length > 0
 ? 'Parcial'
 : transfer.status;

 const updatedTransfer: InventoryTransferOrder = {
 ...transfer,
 status: newStatus,
 receivedUnits: currentReceivedSerials.length,
 receivedSerials: currentReceivedSerials,
 items: updatedItems,
 };

 onConfirmReception(updatedTransfer, newlyAdded);

 if (onShowToast) {
 if (isComplete) {
 onShowToast(`✓ Traspaso ${transfer.folio} recibido completamente (${currentReceivedSerials.length} u.). Unidades listas para acomodo.`);
 } else {
 onShowToast(`ℹ Traspaso ${transfer.folio} actualizado en estado Parcial (${currentReceivedSerials.length}/${allExpectedSerials.length} u.).`);
 }
 }

 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Truck className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono font-extrabold text-sm text-theme-main">
 {transfer.folio}
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
 Recepción de Traspaso en Sucursal
 </span>
 </div>
 <p className="text-[11px] text-theme-muted mt-0.5 flex items-center gap-2">
 <span>{transfer.sourceWarehouseName}</span>
 <ArrowRight className="w-3 h-3 inline text-theme-muted" />
 <strong className="text-theme-main font-bold">{facility.name}</strong>
 {transfer.truckPlates && (
 <span className="font-mono text-theme-muted">({transfer.truckPlates})</span>
 )}
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

 {/* Modal Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* Informative Rule Notice Banner */}
 <div className="p-4 rounded-2xl bg-white border border-blue-500 shadow-2xs text-xs flex items-start gap-3">
 <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
 <div className="space-y-0.5">
 <span className="font-bold text-zinc-900 block">
 Validación de UIDs Serializados Existentes
 </span>
 <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
 Las unidades que arriban por traspaso ya fueron serializadas en el almacén de origen. <strong>No se generan nuevos UIDs ni se imprimen stickers adicionales</strong>. Escanea el código QR de cada tarima o bulto para confirmar su arribo físico a sucursal.
 </p>
 </div>
 </div>

 {/* Progress & KPIs Summary Bar */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] font-extrabold uppercase tracking-wider text-theme-muted block">
 Progreso de Recepción
 </span>
 <div className="flex items-baseline justify-between">
 <span className="text-2xl font-black font-mono text-theme-main">
 {currentReceivedSerials.length}{' '}
 <span className="text-sm font-normal text-theme-muted">/ {allExpectedSerials.length} u.</span>
 </span>
 <span className={`text-xs font-mono font-bold ${isAllReceived ? 'text-emerald-600' : 'text-amber-600'}`}>
 {progressPercent}%
 </span>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden mt-1.5">
 <div 
 className={`h-full transition-all duration-300 rounded-full ${isAllReceived ? 'bg-emerald-500' : 'bg-theme-primary'}`}
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] font-extrabold uppercase tracking-wider text-theme-muted block">
 Ubicación Temporal de Recepción
 </span>
 <div className="flex items-center gap-2">
 <span className="text-base font-black font-mono text-theme-primary">
 {facility.tempReceivingLocation}
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 Pendiente de acomodo
 </span>
 </div>
 <p className="text-[10px] text-theme-muted">
 Área de descarga en piso de sucursal
 </p>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] font-extrabold uppercase tracking-wider text-theme-muted block">
 Estado Actual
 </span>
 <div>
 {isAllReceived ? (
 <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600">
 <CheckCircle2 className="w-4 h-4" />
 Completo para guardar
 </span>
 ) : currentReceivedSerials.length > 0 ? (
 <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600">
 <AlertTriangle className="w-4 h-4" />
 Recepción Parcial ({pendingSerials.length} faltantes)
 </span>
 ) : (
 <span className="inline-flex items-center gap-1 text-xs font-extrabold text-theme-muted">
 <RotateCcw className="w-4 h-4" />
 Pendiente de inicio
 </span>
 )}
 </div>
 <p className="text-[10px] text-theme-muted">
 {transfer.driver || 'Chofer en ruta'}
 </p>
 </div>
 </div>

 {/* Scanner & Manual Validation Box */}
 <div className="p-5 rounded-3xl bg-theme-surface border-2 border-dashed border-theme-primary/30 space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <Scan className="w-5 h-5 text-theme-primary" />
 <h4 className="text-sm font-extrabold text-theme-main">
 Escanear QR / UID de Unidad
 </h4>
 </div>
 <span className="text-[10px] font-mono text-theme-muted">
 Escaner óptico activo · Modo teclado HID
 </span>
 </div>

 {/* Input & Action */}
 <div className="flex items-center gap-2">
 <div className="relative flex-1">
 <QrCode className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={manualInput}
 onChange={(e) => setManualInput(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 processScan(manualInput);
 }
 }}
 placeholder="Escanea el código QR o ingresa TAR-RTM-2026-XXXXXX..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary"
 />
 </div>

 <button
 type="button"
 disabled={!manualInput.trim()}
 onClick={() => processScan(manualInput)}
 className="px-4 py-2.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
 >
 Validar
 </button>
 </div>

 {/* Simulation Quick Buttons (For Interactive Demo Experience) */}
 <div className="pt-2 border-t border-theme-subtle flex flex-wrap items-center gap-2">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mr-1">
 Simulación rápida:
 </span>
 <button
 type="button"
 disabled={pendingSerials.length === 0}
 onClick={handleSimulateNextValid}
 className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-40"
 title="Simula la lectura de la siguiente unidad pendiente del traspaso"
 >
 + Escanear UID Válida ({pendingSerials[0] || 'Completo'})
 </button>

 <button
 type="button"
 onClick={handleSimulateDuplicate}
 className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-mono text-[11px] font-bold border border-amber-500 shadow-2xs transition-all cursor-pointer"
 title="Simula re-escanear una unidad que ya fue leída"
 >
 ✕ Probar Duplicado
 </button>

 <button
 type="button"
 onClick={handleSimulateInvalid}
 className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-mono text-[11px] font-bold border border-theme-primary shadow-2xs transition-all cursor-pointer"
 title="Simula escanear un UID que no pertenece a esta orden"
 >
 ✕ Probar UID Inesperada
 </button>
 </div>

 {/* Feedback message card */}
 {feedbackMessage && (
 <div 
 className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 animate-in fade-in duration-200 bg-white text-zinc-900 shadow-2xs ${
 feedbackMessage.type === 'success'
 ? 'border-emerald-600 '
 : feedbackMessage.type === 'duplicate'
 ? 'border-amber-500'
 : 'border-rose-500'
 }`}
 >
 <div className="flex items-start gap-2.5">
 {feedbackMessage.type === 'success' ? (
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
 ) : feedbackMessage.type === 'duplicate' ? (
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
 ) : (
 <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
 )}
 <div>
 <strong className="block font-bold">{feedbackMessage.title}</strong>
 <p className="text-[11px] opacity-90 mt-0.5">{feedbackMessage.detail}</p>
 </div>
 </div>

 <button
 type="button"
 onClick={() => setFeedbackMessage(null)}
 className="p-1 rounded-lg hover:bg-black/10 transition-colors"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 )}
 </div>

 {/* Items & UIDs Breakdown */}
 <div className="space-y-3">
 <h4 className="text-xs font-extrabold uppercase tracking-wider text-theme-main">
 Partidas del Traspaso ({transfer.items.length})
 </h4>

 <div className="space-y-3">
 {transfer.items.map((item, idx) => {
 const itemReceivedSerials = item.serials.filter((s) => currentReceivedSerials.includes(s));
 const isItemComplete = itemReceivedSerials.length === item.quantity;

 return (
 <div 
 key={idx}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-2xs"
 >
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <span className="font-mono text-[10px] font-extrabold text-theme-primary block">
 {item.sku}
 </span>
 <strong className="text-xs text-theme-main block">
 {item.productName}
 </strong>
 </div>

 <div className="text-right">
 <span className={`font-mono text-xs font-black ${isItemComplete ? 'text-emerald-600' : 'text-theme-main'}`}>
 {itemReceivedSerials.length} / {item.quantity} u.
 </span>
 <span className="text-[10px] text-theme-muted block">
 {isItemComplete ? '✓ Completo' : `${item.quantity - itemReceivedSerials.length} pendientes`}
 </span>
 </div>
 </div>

 {/* UIDs Pill Badges */}
 <div className="pt-2 border-t border-theme-subtle flex flex-wrap gap-1.5">
 {item.serials.map((serial) => {
 const isScanned = currentReceivedSerials.includes(serial);
 return (
 <div
 key={serial}
 className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
 isScanned
 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
 : 'bg-theme-muted/50 text-theme-muted border border-theme-subtle opacity-70'
 }`}
 >
 <QrCode className={`w-3 h-3 ${isScanned ? 'text-emerald-600' : 'text-theme-muted'}`} />
 <span>{serial}</span>
 {isScanned && <Check className="w-3 h-3 text-emerald-600" />}
 </div>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-surface flex items-center justify-between gap-3">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all cursor-pointer"
 >
 Cerrar sin guardar
 </button>

 <div className="flex items-center gap-2">
 {!isAllReceived && (
 <button
 type="button"
 onClick={() => handleSaveReception(true)}
 className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 <span>Guardar recepción parcial</span>
 </button>
 )}

 <button
 type="button"
 disabled={currentReceivedSerials.length === 0}
 onClick={() => handleSaveReception(false)}
 className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
 isAllReceived
 ? 'bg-emerald-600 hover:bg-emerald-700'
 : 'bg-theme-primary hover:bg-theme-primary-hover'
 }`}
 >
 <PackageCheck className="w-4 h-4" />
 <span>
 {isAllReceived ? 'Confirmar recepción completa' : 'Guardar avance'}
 </span>
 </button>
 </div>
 </div>

 {/* Sub-modal: Confirm Partial Reception Alert */}
 {confirmPartialOpen && (
 <ModalPortal onClose={() => setConfirmPartialOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 border border-amber-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <h4 className="text-sm font-black text-theme-main">
 Recepción Incompleta ({currentReceivedSerials.length} de {allExpectedSerials.length})
 </h4>
 <p className="text-xs text-theme-muted mt-0.5">
 Aún faltan {pendingSerials.length} unidades por escanear.
 </p>
 </div>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-xs space-y-1.5">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
 UIDs Faltantes:
 </span>
 <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
 {pendingSerials.map((s) => (
 <span key={s} className="px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-amber-500 shadow-2xs font-mono text-[10px] font-bold">
 {s}
 </span>
 ))}
 </div>
 </div>

 <p className="text-xs text-theme-muted">
 ¿Deseas guardar la orden en estado <strong>Parcial</strong>? Podrás continuar el escaneo posteriormente cuando arribe el resto de las piezas.
 </p>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 type="button"
 onClick={() => setConfirmPartialOpen(false)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold cursor-pointer"
 >
 Continuar escaneando
 </button>
 <button
 type="button"
 onClick={() => {
 setConfirmPartialOpen(false);
 handleSaveReception(true);
 }}
 className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
 >
 Confirmar Parcial
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 </div>
 </ModalPortal>
 );
};