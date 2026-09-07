import React, { useState } from 'react';
import { 
 X, 
 Scan, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 Layers, 
 MapPin, 
 Check, 
 ArrowRight, 
 Building2, 
 Radio, 
 Sparkles, 
 Tag, 
 PackageCheck,
 RotateCcw
} from 'lucide-react';
import { PutawayOrder, PutawayOrderItem } from '../../../data/mockPutawayData';
import { ModalPortal } from '../../common/ModalPortal';

interface PutawayScanStationModalProps {
 order: PutawayOrder;
 item: PutawayOrderItem;
 onClose: () => void;
 onConfirmPutaway: (completedItem: PutawayOrderItem) => void;
 onShowToast?: (msg: string) => void;
}

export const PutawayScanStationModal: React.FC<PutawayScanStationModalProps> = ({
 order,
 item,
 onClose,
 onConfirmPutaway,
 onShowToast,
}) => {
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
 const [isScanning, setIsScanning] = useState(false);
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
 const [errorMessage, setErrorMessage] = useState<string | null>(null);

 // Success state for completed execution
 const [isFinished, setIsFinished] = useState(false);

 // -------------------------------------------------------------------------
 // STEP 1: ARTICLE QR SCANNING
 // -------------------------------------------------------------------------
 const handleSimulateValidArticleScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('success');
 setTimeout(() => {
 setScanStatus('idle');
 setCurrentStep(2);
 }, 700);
 }, 450);
 };

 const handleSimulateInvalidArticleScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage(`✕ Unidad incorrecta: Esta orden requiere ${item.uid}. Escaneaste TAR-RTM-2026-000171.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // STEP 2: LOCATION QR SCANNING
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
 setCurrentStep(3);
 }, 700);
 }, 450);
 };

 const handleSimulateInvalidLocationScan = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setErrorMessage(`✕ Ubicación incorrecta: Esperada ${item.targetLocation}, pero escaneaste C-A-07. Escanea la ubicación asignada para continuar.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // STEP 3: FINAL CONFIRMATION
 // -------------------------------------------------------------------------
 const isShowroom = item.targetLocation.startsWith('SHOW-');

 const handleFinalConfirm = () => {
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const completedItem: PutawayOrderItem = {
 ...item,
 status: 'Acomodado',
 completedAt: dateStr,
 operator: order.operatorAssigned,
 };

 setIsFinished(true);

 setTimeout(() => {
 onConfirmPutaway(completedItem);
 if (onShowToast) {
 onShowToast(`✓ Unidad ${item.uid} acomodada exitosamente en ${item.targetLocation} (Estado: ${isShowroom ? 'En exhibición' : 'Disponible'})`);
 }
 }, 800);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header Terminal Style */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Radio className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-primary-light text-theme-primary border border-theme-primary/20">
 Estación de Acomodo
 </span>
 <span className="text-[10px] font-mono text-theme-muted font-bold">
 {order.warehouseName}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Ejecución y Confirmación de Acomodo
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
 
 {/* Stepper Progress Bar (ADS Style) */}
 <div className="grid grid-cols-3 gap-2">
 {[
 { num: 1, title: '1. Artículo', desc: 'Escanear QR de unidad' },
 { num: 2, title: '2. Ubicación', desc: 'Escanear QR de rack' },
 { num: 3, title: '3. Confirmar', desc: 'Guardado definitivo' },
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

 {/* Unit & Route Context Card */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2.5">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <span className="font-mono text-xs font-black text-theme-primary block">{item.uid}</span>
 <h4 className="text-xs font-bold text-theme-main">{item.productName}</h4>
 <span className="text-[10px] text-theme-muted font-mono">{item.sku} &bull; Lote: {item.lotNumber}</span>
 </div>

 <div className="flex items-center gap-2 text-xs font-mono">
 <div className="p-2 rounded-xl bg-theme-surface border border-theme-subtle text-center min-w-[70px]">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Origen</span>
 <strong className="text-theme-primary">{item.sourceLocation}</strong>
 </div>

 <ArrowRight className="w-4 h-4 text-theme-muted" />

 <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center min-w-[70px]">
 <span className="text-[9px] uppercase font-bold text-emerald-700 block">Destino</span>
 <strong className="text-emerald-700 font-bold">{item.targetLocation}</strong>
 </div>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* STEP 1: SCAN ARTICLE QR */}
 {/* ========================================================================= */}
 {currentStep === 1 && !isFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 PASO 1 — VALIDACIÓN DE ARTÍCULO
 </span>
 <p className="text-xs text-theme-main font-semibold">
 Escanea el código QR del sticker físico pegado en el material / tarima (Esperado: <strong className="font-mono text-theme-primary">{item.uid}</strong>).
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
 className={`absolute left-4 right-4 h-0.5 pointer-events-none transition-opacity ${
 scanStatus === 'error'
 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
 : scanStatus === 'success'
 ? 'bg-emerald-400 shadow-[0_0_15px_#34d399]'
 : 'bg-theme-primary shadow-[0_0_15px_var(--color-primary)]'
 }`}
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-16 h-16 rounded-2xl border border-dashed border-theme-primary/40 flex items-center justify-center">
 <QrCode className={`w-8 h-8 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-zinc-500'
 }`} />
 </div>

 <div className="absolute bottom-3 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 Esperando escaneo de sticker: <strong className="text-zinc-200">{item.uid}</strong>
 </div>
 </div>

 {/* Error Message */}
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
 onClick={handleSimulateValidArticleScan}
 className="w-full py-3.5 px-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de artículo ({item.uid})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateInvalidArticleScan}
 className="w-full py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular artículo incorrecto</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* STEP 2: SCAN LOCATION QR */}
 {/* ========================================================================= */}
 {currentStep === 2 && !isFinished && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 PASO 2 — VALIDACIÓN DE UBICACIÓN
 </span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
 ✓ Artículo Validado
 </span>
 </div>
 <p className="text-xs text-theme-main font-semibold">
 Dirígete a la posición física y escanea el código QR del rack (Destino asignado: <strong className="font-mono text-emerald-600">{item.targetLocation}</strong>).
 </p>
 </div>

 {/* HUD Scanner Box for Location */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-48 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 <div 
 className="absolute left-4 right-4 h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] pointer-events-none"
 style={{
 animation: isScanning ? 'scanSweep 0.7s ease-in-out infinite alternate' : 'scanSweep 2s ease-in-out infinite alternate',
 }}
 />

 <div className="w-16 h-16 rounded-2xl border border-dashed border-blue-500/40 flex items-center justify-center">
 <MapPin className={`w-8 h-8 transition-all ${
 scanStatus === 'success' ? 'text-emerald-400 scale-110' : scanStatus === 'error' ? 'text-rose-500 animate-bounce' : 'text-blue-400'
 }`} />
 </div>

 <div className="absolute bottom-3 left-4 right-4 text-center text-[10px] font-mono text-zinc-400">
 Esperando escaneo de ubicación de rack: <strong className="text-zinc-200">{item.targetLocation}</strong>
 </div>
 </div>

 {/* Error Message */}
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
 className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-4 h-4" />
 <span>Simular escaneo de ubicación ({item.targetLocation})</span>
 </button>

 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateInvalidLocationScan}
 className="w-full py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular ubicación incorrecta (C-A-07)</span>
 </button>
 </div>
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
 <strong className="text-sm font-black">TODO LISTO PARA CONFIRMAR</strong>
 </div>
 <p className="text-xs leading-relaxed">
 Tanto la unidad como la ubicación destino han sido validadas físicamente mediante escaneo QR.
 </p>
 </div>

 {/* Final Summary Card */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs text-xs">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidad Serializada:</span>
 <strong className="font-mono text-theme-primary text-xs">{item.uid}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Artículo:</span>
 <strong className="text-theme-main text-xs">{item.productName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Origen Actual:</span>
 <strong className="text-theme-main font-mono">{item.sourceLocation}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Nueva Ubicación:</span>
 <strong className="text-emerald-600 font-mono text-sm">{item.targetLocation}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Nuevo Estado:</span>
 <strong className={`font-bold ${isShowroom ? 'text-purple-600' : 'text-emerald-700'}`}>
 {isShowroom ? 'En muestra / pruebas' : 'Disponible'}
 </strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Operador Responsable:</span>
 <strong className="text-theme-main">{order.operatorAssigned}</strong>
 </div>
 </div>
 </div>

 {/* Confirm Button */}
 <button
 type="button"
 onClick={handleFinalConfirm}
 className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
 >
 <Check className="w-5 h-5" />
 <span>Confirmar acomodo en {item.targetLocation}</span>
 </button>
 </div>
 )}

 {/* ========================================================================= */}
 {/* SUCCESS BANNER */}
 {/* ========================================================================= */}
 {isFinished && (
 <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
 <div className="w-14 h-14 rounded-full bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center mx-auto shadow-lg">
 <PackageCheck className="w-8 h-8" />
 </div>
 <h3 className="text-base font-black text-emerald-950 dark:text-emerald-200">
 ✓ Acomodo Completado Exitosamente
 </h3>
 <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
 {item.uid} &bull; {item.sourceLocation} &rarr; {item.targetLocation}
 </p>
 <span className="text-[10px] text-theme-muted font-bold block">
 Actualizando existencias y mapa de almacén...
 </span>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted font-mono text-[11px]">
 {item.uid} &rarr; {item.targetLocation}
 </span>

 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cerrar
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
