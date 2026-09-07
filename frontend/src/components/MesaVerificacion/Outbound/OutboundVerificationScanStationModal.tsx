import React, { useState } from 'react';
import { 
 X, 
 Scan, 
 QrCode, 
 MapPin, 
 CheckCircle2, 
 AlertTriangle, 
 AlertOctagon,
 ArrowRight, 
 Check, 
 Tag, 
 Clock, 
 Radio, 
 PackageCheck,
 Send,
 RotateCcw,
 Sparkles,
 Info
} from 'lucide-react';
import { OutboundVerificationOrder, OutboundVerificationItem } from '../../../data/mockOutboundVerificationData';
import { ModalPortal } from '../../common/ModalPortal';

interface OutboundVerificationScanStationModalProps {
 order: OutboundVerificationOrder;
 onClose: () => void;
 onConfirmVerification: (updatedItems: OutboundVerificationItem[]) => void;
 onRegisterDifference: () => void;
 onShowToast?: (msg: string) => void;
}

export const OutboundVerificationScanStationModal: React.FC<OutboundVerificationScanStationModalProps> = ({
 order,
 onClose,
 onConfirmVerification,
 onRegisterDifference,
 onShowToast,
}) => {
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
 const [isLaneConfirmed, setIsLaneConfirmed] = useState(false);
 const [items, setItems] = useState<OutboundVerificationItem[]>(order.items);
 const [isScanning, setIsScanning] = useState(false);
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'warning'>('idle');
 const [errorMessage, setErrorMessage] = useState<string | null>(null);
 const [warningMessage, setWarningMessage] = useState<string | null>(null);
 const [lastValidatedItem, setLastValidatedItem] = useState<OutboundVerificationItem | null>(null);
 const [isFinished, setIsFinished] = useState(false);
 const [showLoadPlaceholder, setShowLoadPlaceholder] = useState(false);

 const validatedCount = items.filter((it) => it.isValidated).length;
 const pendingCount = items.length - validatedCount;
 const isAllValidated = pendingCount === 0;

 // -------------------------------------------------------------------------
 // STEP 1: LANE CONFIRMATION
 // -------------------------------------------------------------------------
 const handleSimulateValidLaneScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('success');
 setIsLaneConfirmed(true);
 setTimeout(() => {
 setScanStatus('idle');
 setCurrentStep(2);
 }, 600);
 }, 450);
 };

 const handleSimulateInvalidLaneScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage(`✕ Carril incorrecto: La orden asignó ${order.assignedLane}. Escaneaste EMB-01.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // STEP 2: UNIT SCAN SIMULATIONS
 // -------------------------------------------------------------------------
 // 1. Scan next valid expected unit
 const handleSimulateValidScan = () => {
 const nextPending = items.find((it) => !it.isValidated);
 if (!nextPending) return;

 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);
 setWarningMessage(null);

 setTimeout(() => {
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

 const updated = items.map((it) =>
 it.id === nextPending.id
 ? { ...it, isValidated: true, validatedAt: `27 Ago ${timeStr}` }
 : it
 );

 setItems(updated);
 setLastValidatedItem({ ...nextPending, isValidated: true, validatedAt: `27 Ago ${timeStr}` });
 setIsScanning(false);
 setScanStatus('success');

 // If this was the last pending item, automatically advance to Step 3 after brief pause
 if (updated.filter((it) => !it.isValidated).length === 0) {
 setTimeout(() => {
 setScanStatus('idle');
 setCurrentStep(3);
 }, 700);
 } else {
 setTimeout(() => {
 setScanStatus('idle');
 }, 800);
 }
 }, 450);
 };

 // 2. Scan an unlisted/foreign unit
 const handleSimulateForeignUnitScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);
 setWarningMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage('✕ Unidad no pertenece a esta salida: TAR-RTM-2026-000333 (Material de otro lote en STG-OUT-01). No agregada.');
 }, 450);
 };

 // 3. Scan same article but wrong serial UID
 const handleSimulateSameSkuWrongUidScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);
 setWarningMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('warning');
 setWarningMessage('⚠ Unidad del artículo correcto, pero UID incorrecta: Escaneaste TAR-RTM-2026-000190. (Cantidad correcta · trazabilidad incorrecta). Se requiere registrar diferencia o escanear la serie esperada.');
 }, 450);
 };

 // 4. Duplicate scan
 const handleSimulateDuplicateScan = () => {
 const alreadyValidated = items.find((it) => it.isValidated);
 if (!alreadyValidated) {
 setErrorMessage('Primero escanea al menos una unidad para probar duplicados.');
 return;
 }

 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);
 setWarningMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage(`✕ Unidad ya validada: ${alreadyValidated.uid} ya fue registrada en esta verificación de salida.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // STEP 3: CONFIRM
 // -------------------------------------------------------------------------
 const handleConfirmOrder = () => {
 setIsFinished(true);
 onConfirmVerification(items);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Radio className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 Ref: {order.referenceFolio}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono">
 Carril: {order.assignedLane}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Estación de Verificación de Salida
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
 
 {/* Stepper Progress */}
 <div className="grid grid-cols-3 gap-2">
 {[
 { num: 1, title: '1. Confirmar Carril', desc: `Escanear ${order.assignedLane}` },
 { num: 2, title: '2. Validar Unidades', desc: `${validatedCount} / ${items.length} piezas` },
 { num: 3, title: '3. Confirmar Salida', desc: 'Lista para carga' },
 ].map((s) => {
 const isDone = currentStep > s.num || isFinished;
 const isCurrent = currentStep === s.num && !isFinished;

 return (
 <div
 key={s.num}
 className={`p-2.5 rounded-2xl border transition-all ${
 isDone
 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300'
 : isCurrent
 ? 'bg-theme-primary-light border-theme-primary text-theme-primary ring-1 ring-theme-primary/30'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted'
 }`}
 >
 <div className="flex items-center gap-1.5 font-bold">
 <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
 isDone ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-theme-primary text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {isDone ? '✓' : s.num}
 </span>
 <span className="text-xs">{s.title}</span>
 </div>
 <p className="text-[10px] opacity-80 mt-0.5 pl-5.5 hidden sm:block truncate">{s.desc}</p>
 </div>
 );
 })}
 </div>

 {/* ========================================================================= */}
 {/* STEP 1: CONFIRM STAGING LANE */}
 {/* ========================================================================= */}
 {currentStep === 1 && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 PASO 1 — VALIDACIÓN DE CARRIL DE EMBARQUE
 </span>
 <p className="text-xs text-theme-main font-semibold">
 Escanea el código QR físico del carril asignado: <strong className="font-mono text-theme-primary text-sm">{order.assignedLane}</strong> ({order.warehouseName}).
 </p>
 </div>

 {/* HUD Scanner Box */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-48 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 <div 
 className="absolute left-4 right-4 h-0.5 bg-theme-primary shadow-[0_0_15px_var(--color-primary)] pointer-events-none"
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-16 h-16 rounded-2xl border border-dashed border-theme-primary/40 flex items-center justify-center">
 <MapPin className={`w-8 h-8 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-zinc-500'
 }`} />
 </div>

 <div className="absolute bottom-3 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 Esperando QR de carril: <strong className="text-zinc-200">{order.assignedLane}</strong>
 </div>
 </div>

 {/* Error Alert */}
 {errorMessage && (
 <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
 <span>{errorMessage}</span>
 </div>
 )}

 {/* Action Buttons */}
 <div className="space-y-2">
 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateValidLaneScan}
 className="w-full py-3.5 px-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de carril ({order.assignedLane})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateInvalidLaneScan}
 className="w-full py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular carril incorrecto (EMB-01)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* STEP 2: SCAN UNITS */}
 {/* ========================================================================= */}
 {currentStep === 2 && (
 <div className="space-y-4 animate-in fade-in duration-150">
 
 {/* Progress Counters Bar */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between flex-wrap gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Unidades Validadas en Carril:
 </span>
 <div className="flex items-baseline gap-2">
 <strong className="text-2xl font-mono font-black text-theme-primary">
 {validatedCount}
 </strong>
 <span className="text-sm font-mono font-bold text-theme-muted">
 / {items.length} piezas
 </span>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono">
 Carril: {order.assignedLane} ✓
 </span>
 <span className="text-xs font-mono font-bold text-theme-muted">
 {Math.round((validatedCount / items.length) * 100)}% completado
 </span>
 </div>
 </div>

 {/* HUD Scanner Box */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-44 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 <div 
 className="absolute left-4 right-4 h-0.5 bg-theme-primary shadow-[0_0_15px_var(--color-primary)] pointer-events-none"
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-14 h-14 rounded-2xl border border-dashed border-theme-primary/40 flex items-center justify-center">
 <QrCode className={`w-7 h-7 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-zinc-400'
 }`} />
 </div>

 <div className="absolute bottom-2.5 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 {lastValidatedItem ? (
 <span className="text-emerald-400 font-bold">
 ✓ Validada: {lastValidatedItem.uid} &bull; {lastValidatedItem.productName}
 </span>
 ) : (
 <span>Esperando escaneo de sticker QR de material / tarima</span>
 )}
 </div>
 </div>

 {/* Error or Warning Banner */}
 {errorMessage && (
 <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
 <span className="font-semibold">{errorMessage}</span>
 </div>
 )}

 {warningMessage && (
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 shadow-2xs text-zinc-900 text-xs space-y-2">
 <div className="flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
 <span className="font-semibold">{warningMessage}</span>
 </div>
 <div className="flex items-center justify-end gap-2 pt-1 border-t border-theme-subtle">
 <button
 type="button"
 onClick={onRegisterDifference}
 className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
 >
 Registrar diferencia
 </button>
 </div>
 </div>
 )}

 {/* Simulation Buttons Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <button
 type="button"
 disabled={isScanning || isAllValidated}
 onClick={handleSimulateValidScan}
 className="py-3 px-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de unidad esperada ({items.find((it) => !it.isValidated)?.uid || 'Completo'})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateForeignUnitScan}
 className="py-2.5 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular unidad no perteneciente (TAR-RTM-999)</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateSameSkuWrongUidScan}
 className="py-2.5 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
 <span>Simular mismo SKU / UID equivocada</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateDuplicateScan}
 className="py-2.5 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <RotateCcw className="w-3.5 h-3.5 text-theme-muted" />
 <span>Simular escaneo duplicado</span>
 </button>
 </div>

 {/* Scanned Units List in Real-Time */}
 <div className="space-y-1.5 pt-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Bitácora de Escaneo en Tiempo Real:
 </span>

 <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
 {items.map((it) => (
 <div
 key={it.id}
 className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
 it.isValidated
 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted'
 }`}
 >
 <div className="flex items-center gap-2 min-w-0">
 <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
 it.isValidated ? 'bg-emerald-600 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {it.isValidated ? '✓' : '•'}
 </span>
 <strong className="font-mono text-xs truncate">{it.uid}</strong>
 <span className="text-[10px] opacity-80 truncate">{it.productName}</span>
 </div>

 <div className="text-[10px] font-mono whitespace-nowrap">
 {it.isValidated ? (
 <span className="font-bold text-emerald-700 dark:text-emerald-400">
 {it.validatedAt}
 </span>
 ) : (
 <span>Pendiente</span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Button to Proceed if All Validated */}
 {isAllValidated && (
 <button
 type="button"
 onClick={() => setCurrentStep(3)}
 className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Avanzar a confirmación final (100% validado)</span>
 </button>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* STEP 3: FINAL CONFIRMATION */}
 {/* ========================================================================= */}
 {currentStep === 3 && !isFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-emerald-950 dark:text-emerald-200">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
 <strong className="text-sm font-black">TODO VALIDADO EXITOSAMENTE</strong>
 </div>
 <p className="text-xs leading-relaxed">
 Las {items.length} piezas esperadas coinciden con sus UIDs individuales. El inventario queda listo para carga en el carril {order.assignedLane}.
 </p>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 text-xs">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Folio Salida:</span>
 <strong className="font-mono text-theme-primary text-xs">{order.folio}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Destino:</span>
 <strong className="text-theme-main text-xs">{order.destinationName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Carril Embarque:</span>
 <strong className="text-emerald-600 font-mono text-sm">{order.assignedLane}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Total Piezas:</span>
 <strong className="text-theme-main font-mono text-sm">{items.length} validadas</strong>
 </div>
 </div>
 </div>

 <button
 type="button"
 onClick={handleConfirmOrder}
 className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
 >
 <Check className="w-5 h-5" />
 <span>Confirmar verificación y marcar como 'Lista para carga'</span>
 </button>
 </div>
 )}

 {/* ========================================================================= */}
 {/* SUCCESS VIEW */}
 {/* ========================================================================= */}
 {isFinished && (
 <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95 duration-200">
 <div className="w-16 h-16 rounded-full bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center mx-auto shadow-lg">
 <PackageCheck className="w-9 h-9" />
 </div>
 <div className="space-y-1">
 <h3 className="text-base font-black text-emerald-950 dark:text-emerald-200">
 ✓ Verificación de Salida Completada
 </h3>
 <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
 {order.folio} &bull; {items.length} / {items.length} unidades validadas &bull; Carril {order.assignedLane}
 </p>
 <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs mt-2">
 Estado: Lista para carga
 </span>
 </div>

 <div className="pt-3">
 <button
 onClick={() => setShowLoadPlaceholder(true)}
 className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs transition-all shadow-lg hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
 >
 <Send className="w-4 h-4 text-emerald-400" />
 <span>Continuar a carga</span>
 </button>
 </div>

 {showLoadPlaceholder && (
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle text-theme-muted text-xs flex items-center justify-center gap-2 max-w-md mx-auto animate-in fade-in">
 <Info className="w-4 h-4 text-blue-500 shrink-0" />
 <span>La orden pasará a estar disponible para asignación y despacho en <strong>Embarques & Entregas</strong>.</span>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted font-mono text-[11px]">
 {validatedCount} de {items.length} piezas verificadas
 </span>

 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 {isFinished ? 'Cerrar estación' : 'Pausar y salir'}
 </button>
 </div>
 </div>

 <style>{`
 @keyframes scanSweep {
 0% { top: 18%; }
 100% { top: 82%; }
 }
 `}</style>
 </ModalPortal>
 );
};
