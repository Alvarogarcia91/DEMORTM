import React, { useState, useEffect } from 'react';
import { 
 QrCode, 
 Camera, 
 CheckCircle2, 
 AlertTriangle, 
 Radio, 
 Sparkles, 
 Scan, 
 Layers, 
 RefreshCw,
 X,
 Volume2
} from 'lucide-react';

interface LugaQrScannerProps {
 mode: 'LOCATION' | 'UNIT';
 expectedLocation?: string;
 expectedSerials?: string[];
 alreadyCountedSerials?: string[];
 onScanSuccess: (scannedData: { code: string; type: 'LOCATION' | 'UNIT'; extraMeta?: any }) => void;
 onScanError?: (errorMessage: string) => void;
 onSimulateUnexpectedUnit?: () => void;
 onSimulateDuplicateUnit?: () => void;
 disabled?: boolean;
}

export const LugaQrScanner: React.FC<LugaQrScannerProps> = ({
 mode,
 expectedLocation = 'A-C-04',
 expectedSerials = [],
 alreadyCountedSerials = [],
 onScanSuccess,
 onScanError,
 onSimulateUnexpectedUnit,
 onSimulateDuplicateUnit,
 disabled = false,
}) => {
 const [isScanning, setIsScanning] = useState<boolean>(false);
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
 const [lastScannedPayload, setLastScannedPayload] = useState<string | null>(null);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);

 // Trigger Simulated Scan Sequence
 const triggerScanSequence = (
 resultPayload: string,
 isSuccess: boolean,
 errText?: string
 ) => {
 setIsScanning(true);
 setScanStatus('scanning');
 setErrorMessage(null);

 // Simulate 450ms optical laser recognition delay
 setTimeout(() => {
 setIsScanning(false);
 if (isSuccess) {
 setScanStatus('success');
 setLastScannedPayload(resultPayload);
 onScanSuccess({
 code: resultPayload,
 type: mode,
 });
 // Auto reset status to idle after 1.8s
 setTimeout(() => {
 setScanStatus('idle');
 }, 1800);
 } else {
 setScanStatus('error');
 const err = errText || 'Código no reconocido';
 setErrorMessage(err);
 if (onScanError) onScanError(err);
 }
 }, 450);
 };

 // Simulates scanning the correct expected Location
 const handleSimulateValidLocation = () => {
 triggerScanSequence(expectedLocation, true);
 };

 // Simulates scanning an invalid location (e.g. B-A-08 instead of A-C-04)
 const handleSimulateInvalidLocation = () => {
 triggerScanSequence('B-A-08', false, `Ubicación incorrecta: Esperada ${expectedLocation}, pero escaneaste B-A-08.`);
 };

 // Simulates scanning next valid unit UID
 const handleSimulateNextUnit = () => {
 // Pick first serial that hasn't been scanned yet
 const nextExpected = expectedSerials.find(s => !alreadyCountedSerials.includes(s));
 const fallbackSerial = `TAR-RTM-260906-${170 + alreadyCountedSerials.length + 1}`;
 const targetUid = nextExpected || fallbackSerial;

 triggerScanSequence(targetUid, true);
 };

 // Simulates scanning an already counted unit (duplicate)
 const handleSimulateDuplicate = () => {
 if (alreadyCountedSerials.length > 0) {
 const dupUid = alreadyCountedSerials[0];
 setErrorMessage(`Unidad ya registrada en este conteo: ${dupUid}`);
 setScanStatus('error');
 if (onSimulateDuplicateUnit) onSimulateDuplicateUnit();
 } else {
 triggerScanSequence('TAR-RTM-260906-171', true);
 }
 };

 // Simulates scanning an unexpected unit from another location (e.g. B-C-06 in A-C-04)
 const handleSimulateUnexpected = () => {
 const unexpectedUid = 'TAR-RTM-260906-333';
 setIsScanning(true);
 setScanStatus('scanning');
 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('success');
 setLastScannedPayload(unexpectedUid);
 if (onSimulateUnexpectedUnit) {
 onSimulateUnexpectedUnit();
 } else {
 onScanSuccess({
 code: unexpectedUid,
 type: 'UNIT',
 extraMeta: { isUnexpected: true, registeredLocation: 'B-C-06' }
 });
 }
 setTimeout(() => setScanStatus('idle'), 2000);
 }, 450);
 };

 return (
 <div className="space-y-3.5 w-full">
 
 {/* Scanner Viewport / HUD Frame */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-56 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 
 {/* Ambient Grid Background */}
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 {/* Laser Scanner Beam (Animated Sweep) */}
 <div 
 className={`absolute left-4 right-4 h-0.5 pointer-events-none transition-opacity ${
 scanStatus === 'error'
 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
 : scanStatus === 'success'
 ? 'bg-emerald-400 shadow-[0_0_15px_#34d399]'
 : 'bg-theme-primary shadow-[0_0_15px_var(--color-primary)]'
 }`}
 style={{
 animation: isScanning ? 'scanSweep 0.8s ease-in-out infinite alternate' : 'scanSweep 2.2s ease-in-out infinite alternate',
 }}
 />

 {/* 4 Corner Reticles / HUD Brackets */}
 <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-theme-primary rounded-tl-lg" />
 <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-theme-primary rounded-tr-lg" />
 <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-theme-primary rounded-bl-lg" />
 <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-theme-primary rounded-br-lg" />

 {/* Center Target Crosshairs */}
 <div className="w-20 h-20 rounded-2xl border border-dashed border-theme-primary/40 flex items-center justify-center relative">
 <Scan className={`w-8 h-8 transition-all ${
 scanStatus === 'success'
 ? 'text-emerald-400 scale-110'
 : scanStatus === 'error'
 ? 'text-rose-500 animate-bounce'
 : isScanning
 ? 'text-theme-primary scale-105'
 : 'text-zinc-500'
 }`} />
 {isScanning && (
 <div className="absolute inset-0 rounded-2xl bg-theme-primary-light animate-ping" />
 )}
 </div>

 {/* Camera Status Bar */}
 <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
 <div className="flex items-center gap-1.5">
 <span className={`w-2 h-2 rounded-full ${
 scanStatus === 'success' ? 'bg-emerald-400 animate-pulse' : scanStatus === 'error' ? 'bg-rose-500' : 'bg-theme-primary animate-ping'
 }`} />
 <span className="font-bold text-zinc-300">
 {mode === 'LOCATION' ? 'ESCANEO DE UBICACIÓN' : 'ESCANEO DE UNIDADES (UID)'}
 </span>
 </div>

 <div className="flex items-center gap-2">
 <span className="hidden sm:inline-block text-zinc-500">OPTICAL RF-SENSOR</span>
 <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold">
 60 FPS
 </span>
 </div>
 </div>

 {/* Viewfinder Target Payload Message */}
 <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
 <div className="text-[11px] font-mono text-zinc-300 truncate">
 {mode === 'LOCATION' ? (
 <span>Apuntar al QR del espacio: <strong className="text-theme-primary font-bold">{expectedLocation}</strong></span>
 ) : (
 <span>Apuntar al código QR de la unidad / insumo</span>
 )}
 </div>

 {lastScannedPayload && scanStatus === 'success' && (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
 <CheckCircle2 className="w-3 h-3" />
 <span>{lastScannedPayload}</span>
 </span>
 )}
 </div>
 </div>

 {/* Error Shake Alert Banner */}
 {errorMessage && (
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-300 animate-in fade-in duration-150">
 <div className="flex items-center gap-2 min-w-0">
 <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
 <p className="text-[11px] font-bold">
 {errorMessage}
 </p>
 </div>
 <button
 onClick={() => setErrorMessage(null)}
 className="text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer shrink-0"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 )}

 {/* Simulation Trigger Buttons */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Simulación de Lectura en Terminal RF:
 </span>

 {mode === 'LOCATION' ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <button
 type="button"
 disabled={disabled || isScanning}
 onClick={handleSimulateValidLocation}
 className="py-2.5 px-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <QrCode className="w-4 h-4" />
 <span>Simular escaneo correcto ({expectedLocation})</span>
 </button>

 <button
 type="button"
 disabled={disabled || isScanning}
 onClick={handleSimulateInvalidLocation}
 className="py-2.5 px-3.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <AlertTriangle className="w-4 h-4 text-rose-600" />
 <span>Simular escaneo incorrecto (B-A-08)</span>
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
 {/* Valid Unit Scan */}
 <button
 type="button"
 disabled={disabled || isScanning}
 onClick={handleSimulateNextUnit}
 className="py-2.5 px-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 <QrCode className="w-4 h-4" />
 <span>Simular escaneo UID</span>
 </button>

 {/* Duplicate Unit Scan */}
 <button
 type="button"
 disabled={disabled || isScanning || alreadyCountedSerials.length === 0}
 onClick={handleSimulateDuplicate}
 className="py-2.5 px-3 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
 <span>Simular UID duplicada</span>
 </button>

 {/* Unexpected Unit Scan (Belongs to other location) */}
 <button
 type="button"
 disabled={disabled || isScanning}
 onClick={handleSimulateUnexpected}
 className="py-2.5 px-3 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 <Sparkles className="w-3.5 h-3.5 text-purple-600" />
 <span>Simular UID inesperada</span>
 </button>
 </div>
 )}
 </div>

 <style>{`
 @keyframes scanSweep {
 0% { top: 18%; }
 100% { top: 82%; }
 }
 `}</style>
 </div>
 );
};
