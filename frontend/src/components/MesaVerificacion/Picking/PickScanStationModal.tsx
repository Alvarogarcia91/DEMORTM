import React, { useState } from 'react';
import { 
 X, 
 Scan, 
 QrCode, 
 MapPin, 
 CheckCircle2, 
 AlertTriangle, 
 ArrowRight, 
 Check, 
 Tag, 
 Clock, 
 Radio, 
 PackageCheck,
 Send,
 RotateCcw,
 Sparkles
} from 'lucide-react';
import { PickOrder, PickPlanStop } from '../../../data/mockPickingData';
import { PickSubstitutionModal } from './PickSubstitutionModal';
import { ModalPortal } from '../../common/ModalPortal';

interface PickScanStationModalProps {
 order: PickOrder;
 initialStopIndex?: number;
 onClose: () => void;
 onConfirmPickStop: (stopId: string, pickedUid: string, substitutionReason?: string) => void;
 onCompleteOrder: () => void;
 onShowToast?: (msg: string) => void;
}

export const PickScanStationModal: React.FC<PickScanStationModalProps> = ({
 order,
 initialStopIndex = 0,
 onClose,
 onConfirmPickStop,
 onCompleteOrder,
 onShowToast,
}) => {
 // Find first pending stop
 const pendingStops = order.stops.filter((s) => s.status !== 'Recolectada');
 const [currentStopIndex, setCurrentStopIndex] = useState(() => {
 const firstPendingIdx = order.stops.findIndex((s) => s.status !== 'Recolectada');
 return firstPendingIdx !== -1 ? firstPendingIdx : initialStopIndex;
 });

 const currentStop = order.stops[currentStopIndex] || order.stops[0];

 const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
 const [isScanning, setIsScanning] = useState(false);
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
 const [errorMessage, setErrorMessage] = useState<string | null>(null);
 const [wrongScannedUid, setWrongScannedUid] = useState<string | null>(null);

 // Substitution modal state
 const [isSubModalOpen, setIsSubModalOpen] = useState(false);
 const [activePickedUid, setActivePickedUid] = useState<string>(currentStop.uid);
 const [activeSubReason, setActiveSubReason] = useState<string | undefined>(undefined);

 // Finished state
 const [isStopFinished, setIsStopFinished] = useState(false);

 // -------------------------------------------------------------------------
 // STEP 1: LOCATION QR SCAN
 // -------------------------------------------------------------------------
 const handleSimulateValidLocationScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('success');
 setTimeout(() => {
 setScanStatus('idle');
 setCurrentStep(2);
 }, 650);
 }, 450);
 };

 const handleSimulateInvalidLocationScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage(`✕ Ubicación incorrecta: La orden requiere ${currentStop.locationCode}. Escaneaste B-C-07.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // STEP 2: UNIT QR SCAN
 // -------------------------------------------------------------------------
 const handleSimulateValidUnitScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);
 setWrongScannedUid(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('success');
 setActivePickedUid(currentStop.uid);
 setTimeout(() => {
 setScanStatus('idle');
 setCurrentStep(3);
 }, 650);
 }, 450);
 };

 const handleSimulateInvalidUnitScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 const alternateUid = `SC-UID-2026-000${Math.floor(190 + Math.random() * 20)}`;
 setWrongScannedUid(alternateUid);
 setErrorMessage(`✕ Unidad diferente escaneada: ${alternateUid}. La estrategia esperaba ${currentStop.uid}.`);
 }, 450);
 };

 // Handle confirmed substitution
 const handleConfirmSubstitution = (substitutedUid: string, reason: string) => {
 setActivePickedUid(substitutedUid);
 setActiveSubReason(reason);
 setIsSubModalOpen(false);
 setWrongScannedUid(null);
 setErrorMessage(null);
 setScanStatus('success');
 setCurrentStep(3);

 if (onShowToast) {
 onShowToast(`✓ Sustitución autorizada: ${currentStop.uid} → ${substitutedUid}`);
 }
 };

 // -------------------------------------------------------------------------
 // STEP 3: CONFIRM PICK STOP
 // -------------------------------------------------------------------------
 const handleConfirmStop = () => {
 setIsStopFinished(true);

 onConfirmPickStop(currentStop.id, activePickedUid, activeSubReason);

 setTimeout(() => {
 // Check if there are remaining pending stops
 const remainingStops = order.stops.filter(
 (s) => s.id !== currentStop.id && s.status !== 'Recolectada'
 );

 if (remainingStops.length > 0) {
 // Move to next pending stop
 const nextIdx = order.stops.findIndex(
 (s) => s.id !== currentStop.id && s.status !== 'Recolectada'
 );
 setCurrentStopIndex(nextIdx);
 setCurrentStep(1);
 setIsStopFinished(false);
 setErrorMessage(null);
 setWrongScannedUid(null);
 setActiveSubReason(undefined);
 } else {
 // All stops completed!
 onCompleteOrder();
 }
 }, 700);
 };

 const completedCount = order.stops.filter((s) => s.status === 'Recolectada').length;
 const isOrderFullyComplete = completedCount === order.stops.length;

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Radio className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-rose-600">{order.folio}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20">
 Parada {currentStop.sequence} de {order.stops.length}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 border border-purple-500/20">
 {order.strategyName}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Estación de Recolección Operativa
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

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Stepper Progress */}
 <div className="grid grid-cols-3 gap-2">
 {[
 { num: 1, title: '1. Ubicación', desc: `Escanear ${currentStop.locationCode}` },
 { num: 2, title: '2. Unidad', desc: `Escanear ${currentStop.uid}` },
 { num: 3, title: '3. Confirmar', desc: `Enviar a ${order.tempStagingLocation}` },
 ].map((s) => {
 const isDone = currentStep > s.num || isStopFinished;
 const isCurrent = currentStep === s.num && !isStopFinished;

 return (
 <div
 key={s.num}
 className={`p-2.5 rounded-2xl border transition-all ${
 isDone
 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300'
 : isCurrent
 ? 'bg-rose-500/10 border-rose-500 text-rose-950 dark:text-rose-300 ring-1 ring-rose-300'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted'
 }`}
 >
 <div className="flex items-center gap-1.5 font-bold">
 <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
 isDone ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-rose-600 text-white' : 'bg-theme-muted text-theme-muted'
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

 {/* Current Stop Target Card */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2.5">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs font-mono">
 Parada #{currentStop.sequence}
 </span>
 <span className="font-mono text-xs font-black text-rose-600">{currentStop.uid}</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {currentStop.strategyBadge} &bull; {currentStop.ageDays} días
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{currentStop.productName}</h4>
 <p className="text-[10px] text-theme-muted">{currentStop.strategyReason}</p>
 </div>

 <div className="flex items-center gap-2 text-xs font-mono">
 <div className="p-2 rounded-xl bg-white border border-theme-subtle text-center min-w-[80px] shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Rack Origen</span>
 <strong className="text-rose-600 text-sm">{currentStop.locationCode}</strong>
 </div>

 <ArrowRight className="w-4 h-4 text-theme-muted" />

 <div className="p-2 rounded-xl bg-white border border-emerald-600 text-center min-w-[80px] shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">Preparación</span>
 <strong className="text-zinc-900 font-bold text-sm">{order.tempStagingLocation}</strong>
 </div>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* STEP 1: SCAN LOCATION */}
 {/* ========================================================================= */}
 {currentStep === 1 && !isStopFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 PASO 1 — VALIDACIÓN DE UBICACIÓN ORIGEN
 </span>
 <p className="text-xs text-theme-main font-semibold">
 Dirígete al rack y escanea el código QR de la posición: <strong className="font-mono text-rose-600 text-sm">{currentStop.locationCode}</strong> ({currentStop.aisle} &bull; {currentStop.rackPosition} &bull; {currentStop.level}).
 </p>
 </div>

 {/* HUD Scanner Box */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-48 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, #ef4444 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 <div 
 className={`absolute left-4 right-4 h-0.5 bg-rose-500 shadow-[0_0_15px_#ef4444] pointer-events-none`}
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-16 h-16 rounded-2xl border border-dashed border-rose-500/40 flex items-center justify-center">
 <MapPin className={`w-8 h-8 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-zinc-500'
 }`} />
 </div>

 <div className="absolute bottom-3 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 Esperando QR de ubicación: <strong className="text-zinc-200">{currentStop.locationCode}</strong>
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
 onClick={handleSimulateValidLocationScan}
 className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de ubicación ({currentStop.locationCode})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateInvalidLocationScan}
 className="w-full py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular ubicación incorrecta (B-C-07)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* STEP 2: SCAN UNIT QR */}
 {/* ========================================================================= */}
 {currentStep === 2 && !isStopFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 PASO 2 — VALIDACIÓN DE UNIDAD FÍSICA
 </span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
 ✓ Ubicación {currentStop.locationCode} Confirmada
 </span>
 </div>
 <p className="text-xs text-theme-main font-semibold">
 Escanea el sticker QR del colchón indicado: <strong className="font-mono text-rose-600">{currentStop.uid}</strong>.
 </p>
 </div>

 {/* HUD Scanner Box for Unit */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-48 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, #a855f7 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 <div 
 className="absolute left-4 right-4 h-0.5 bg-purple-500 shadow-[0_0_15px_#a855f7] pointer-events-none"
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-16 h-16 rounded-2xl border border-dashed border-purple-500/40 flex items-center justify-center">
 <QrCode className={`w-8 h-8 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-purple-400'
 }`} />
 </div>

 <div className="absolute bottom-3 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 Esperando escaneo de sticker: <strong className="text-zinc-200">{currentStop.uid}</strong>
 </div>
 </div>

 {/* Error Message + Substitution Action */}
 {errorMessage && (
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs space-y-2">
 <div className="flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
 <span className="font-semibold">{errorMessage}</span>
 </div>

 {wrongScannedUid && (
 <div className="flex items-center justify-between pt-1 border-t border-rose-500/20">
 <span className="text-[10px] text-theme-muted">
 ¿Deseas autorizar la sustitución por esta unidad del mismo SKU?
 </span>
 <button
 type="button"
 onClick={() => setIsSubModalOpen(true)}
 className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
 >
 Solicitar sustitución
 </button>
 </div>
 )}
 </div>
 )}

 {/* Action Buttons */}
 <div className="space-y-2">
 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateValidUnitScan}
 className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de unidad ({currentStop.uid})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateInvalidUnitScan}
 className="w-full py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular unidad diferente (Mismo SKU)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* STEP 3: CONFIRM RECOLECCIÓN */}
 {/* ========================================================================= */}
 {currentStep === 3 && !isStopFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-emerald-950 dark:text-emerald-200">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
 <strong className="text-sm font-black">TODO LISTO PARA RECOLECTAR</strong>
 </div>
 <p className="text-xs leading-relaxed">
 La posición {currentStop.locationCode} y la unidad {activePickedUid} han sido validadas. La pieza se trasladará a la zona de preparación {order.tempStagingLocation}.
 </p>
 </div>

 {/* Summary Card */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs text-xs">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidad Recolectada:</span>
 <strong className="font-mono text-rose-600 text-xs">{activePickedUid}</strong>
 {activeSubReason && (
 <span className="text-[9px] text-amber-700 block font-bold mt-0.5">
 (Sustitución: {activeSubReason})
 </span>
 )}
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Artículo:</span>
 <strong className="text-theme-main text-xs">{currentStop.productName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Rack Origen:</span>
 <strong className="text-theme-main font-mono">{currentStop.locationCode}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Zona de Preparación:</span>
 <strong className="text-emerald-600 font-mono text-sm">{order.tempStagingLocation}</strong>
 </div>
 </div>
 </div>

 {/* Confirm Button */}
 <button
 type="button"
 onClick={handleConfirmStop}
 className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
 >
 <Check className="w-5 h-5" />
 <span>Confirmar recolección de parada #{currentStop.sequence}</span>
 </button>
 </div>
 )}

 {/* ========================================================================= */}
 {/* STOP COMPLETED SUCCESS VIEW */}
 {/* ========================================================================= */}
 {isStopFinished && (
 <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
 <div className="w-14 h-14 rounded-full bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center mx-auto shadow-lg">
 <PackageCheck className="w-8 h-8" />
 </div>
 <h3 className="text-base font-black text-emerald-950 dark:text-emerald-200">
 ✓ Unidad Recolectada Exitosamente
 </h3>
 <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
 {activePickedUid} &bull; {currentStop.locationCode} &rarr; {order.tempStagingLocation}
 </p>
 <span className="text-[10px] text-theme-muted font-bold block">
 Cargando siguiente parada del recorrido...
 </span>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted font-mono text-[11px]">
 Progreso: {completedCount} de {order.stops.length} piezas recolectadas
 </span>

 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Pausar y cerrar
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* Embedded Substitution Modal */}
 {isSubModalOpen && wrongScannedUid && (
 <PickSubstitutionModal
 plannedStop={currentStop}
 scannedUid={wrongScannedUid}
 onClose={() => setIsSubModalOpen(false)}
 onConfirmSubstitution={handleConfirmSubstitution}
 />
 )}

 <style>{`
 @keyframes scanSweep {
 0% { top: 18%; }
 100% { top: 82%; }
 }
 `}</style>
 </>
 );
};
