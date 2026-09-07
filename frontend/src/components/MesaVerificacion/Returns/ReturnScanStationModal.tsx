import React, { useState } from 'react';
import { 
 X, 
 RotateCcw, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 MapPin, 
 Layers, 
 Check, 
 Sparkles, 
 ArrowRight, 
 Scan, 
 AlertOctagon, 
 Wrench, 
 ShieldAlert, 
 PackageCheck 
} from 'lucide-react';
import { 
 ReturnOrder, 
 ReturnItemRecord, 
 ReturnUnitCondition 
} from '../../../data/mockReturnsData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReturnScanStationModalProps {
 order: ReturnOrder;
 item: ReturnItemRecord;
 onClose: () => void;
 onConfirmItemReturn: (
 updatedItem: ReturnItemRecord, 
 condition: ReturnUnitCondition, 
 confirmedLocation: string
 ) => void;
}

export const ReturnScanStationModal: React.FC<ReturnScanStationModalProps> = ({
 order,
 item,
 onClose,
 onConfirmItemReturn,
}) => {
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

 // Step 1: Unit Scan
 const [scannedUid, setScannedUid] = useState('');
 const [isUnitVerified, setIsUnitVerified] = useState(false);
 const [unitScanError, setUnitScanError] = useState<string | null>(null);

 // Step 2: Condition
 const [condition, setCondition] = useState<ReturnUnitCondition>('En buen estado');

 // Step 3: Target Location
 const [targetLocation, setTargetLocation] = useState('REC-DEV-01');
 const [locationWarning, setLocationWarning] = useState<string | null>(null);

 // Step 4: Location QR Double Scan
 const [scannedLocation, setScannedLocation] = useState('');
 const [isLocationVerified, setIsLocationVerified] = useState(false);
 const [locationScanError, setLocationScanError] = useState<string | null>(null);

 // Step 1 Handlers
 const handleSimulateValidUnitScan = () => {
 setScannedUid(item.uid);
 setIsUnitVerified(true);
 setUnitScanError(null);
 setTimeout(() => {
 setCurrentStep(2);
 }, 400);
 };

 const handleSimulateInvalidUnitScan = () => {
 const wrongUid = 'TAR-RTM-2026-000190';
 setScannedUid(wrongUid);
 setIsUnitVerified(false);
 setUnitScanError(`✕ Unidad incorrecta. Se esperaba ${item.uid} pero se escaneó ${wrongUid}.`);
 };

 // Step 2 Handler
 const handleSelectCondition = (cond: ReturnUnitCondition) => {
 setCondition(cond);
 if (cond === 'Empaque dañado' || cond === 'Producto dañado') {
 setTargetLocation('RET-NORTE');
 } else if (cond === 'Requiere inspección') {
 setTargetLocation('QUA-BLOQ');
 } else {
 setTargetLocation('REC-DEV-01');
 }
 setCurrentStep(3);
 };

 // Step 3 Handlers
 const handleConfirmLocationChoice = () => {
 if ((condition === 'Producto dañado' || condition === 'Empaque dañado') && (targetLocation.startsWith('A-') || targetLocation.startsWith('B-'))) {
 setLocationWarning('No se puede almacenar mercancía dañada directamente en racks sin pasar por retrabajo.');
 return;
 }
 setLocationWarning(null);
 setCurrentStep(4);
 };

 // Step 4 Handlers
 const handleSimulateValidLocationScan = () => {
 setScannedLocation(targetLocation);
 setIsLocationVerified(true);
 setLocationScanError(null);
 };

 const handleSimulateInvalidLocationScan = () => {
 const wrongLoc = 'A-B-03';
 setScannedLocation(wrongLoc);
 setIsLocationVerified(false);
 setLocationScanError(`✕ Ubicación incorrecta. La condición requiere ${targetLocation} pero se escaneó ${wrongLoc}.`);
 };

 // Final Confirmation
 const handleFinalSubmit = () => {
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const newStatus = 
 condition === 'En buen estado' 
 ? 'Pendiente de acomodo' 
 : 'En retrabajo';

 const updatedItem: ReturnItemRecord = {
 ...item,
 condition,
 confirmedDestination: targetLocation,
 returnDate: dateStr,
 status: newStatus,
 };

 onConfirmItemReturn(updatedItem, condition, targetLocation);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <RotateCcw className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="text-[10px] text-theme-muted font-mono">&bull; {order.reference}</span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Estación de Recepción y Doble Confirmación de Devolución
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

 {/* 4-Step Indicator */}
 <div className="px-6 py-2.5 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between text-xs">
 {[
 { step: 1, label: '1. Validar UID' },
 { step: 2, label: '2. Condición' },
 { step: 3, label: '3. Destino' },
 { step: 4, label: '4. Escanear Destino' },
 ].map((s) => (
 <div
 key={s.step}
 className={`flex items-center gap-1.5 font-bold ${
 currentStep === s.step
 ? 'text-theme-primary'
 : currentStep > s.step
 ? 'text-emerald-600'
 : 'text-theme-muted'
 }`}
 >
 <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
 currentStep === s.step
 ? 'bg-theme-primary text-white shadow-xs'
 : currentStep > s.step
 ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
 : 'bg-theme-muted text-theme-muted'
 }`}>
 {currentStep > s.step ? '✓' : s.step}
 </span>
 <span className="hidden sm:inline text-[11px]">{s.label}</span>
 </div>
 ))}
 </div>

 {/* Body Content */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Unit Target Banner */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-theme-primary font-black text-xs">{item.uid}</span>
 <span className="text-[10px] font-mono text-theme-muted">Lote: {item.lotNumber}</span>
 </div>
 <p className="text-[11px] text-theme-main font-bold truncate">{item.productName}</p>
 </div>
 <span className="text-[10px] font-mono font-bold text-theme-muted bg-theme-surface px-2 py-1 rounded-xl border border-theme-subtle shrink-0">
 Ingreso orig: {item.originalEntryDate}
 </span>
 </div>

 {/* STEP 1: Escanear Unidad */}
 {currentStep === 1 && (
 <div className="space-y-4 animate-in fade-in">
 <div className="text-center space-y-1">
 <h3 className="text-sm font-extrabold text-theme-main">
 Paso 1 — Identificar y Escanear UID del Material / Tarima
 </h3>
 <p className="text-xs text-theme-muted">
 Apunta el lector láser al código QR adherido al bulto que regresa al almacén.
 </p>
 </div>

 {/* Laser HUD Frame */}
 <div className="relative w-48 h-48 mx-auto rounded-3xl bg-zinc-950 border-2 border-theme-primary/40 flex flex-col items-center justify-center p-4 shadow-xl overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/10 via-transparent to-theme-primary/10 animate-pulse" />
 <QrCode className="w-16 h-16 text-theme-primary animate-pulse" />
 <span className="mt-2 text-[10px] font-mono text-theme-primary font-bold tracking-wider uppercase">
 Lector Activo
 </span>
 <div className="absolute top-0 left-0 w-full h-0.5 bg-theme-primary shadow-[0_0_8px_var(--color-primary)] animate-bounce" />
 </div>

 {unitScanError && (
 <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs flex items-center gap-2">
 <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
 <span>{unitScanError}</span>
 </div>
 )}

 {/* Simulation buttons */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
 <button
 type="button"
 onClick={handleSimulateValidUnitScan}
 className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Simular escaneo de UID correcto</span>
 </button>

 <button
 type="button"
 onClick={handleSimulateInvalidUnitScan}
 className="px-4 py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <AlertTriangle className="w-4 h-4 text-amber-500" />
 <span>Simular unidad incorrecta</span>
 </button>
 </div>
 </div>
 )}

 {/* STEP 2: Evaluar Condición Física */}
 {currentStep === 2 && (
 <div className="space-y-4 animate-in fade-in">
 <div className="text-center space-y-1">
 <h3 className="text-sm font-extrabold text-theme-main">
 Paso 2 — Evaluar Condición Física del Producto
 </h3>
 <p className="text-xs text-theme-muted">
 Inspecciona visualmente el producto y su embalaje de protección.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {[
 {
 id: 'En buen estado' as ReturnUnitCondition,
 title: '1. En Buen Estado',
 desc: 'Sin daños visibles. Embalaje o flejado íntegro y limpio.',
 suggested: 'Destino: REC-DEV-01 (Pendiente de acomodo)',
 tone: 'border-emerald-600/40 hover:border-emerald-600 /50',
 },
 {
 id: 'Empaque dañado' as ReturnUnitCondition,
 title: '2. Empaque Dañado',
 desc: 'Flejado o esquinero roto pero material interior intacto.',
 suggested: 'Destino: RET-01 (Reempaque / Reacondicionamiento)',
 tone: 'border-amber-500/40 hover:border-amber-500',
 },
 {
 id: 'Producto dañado' as ReturnUnitCondition,
 title: '3. Producto Dañado',
 desc: 'Costura zafada, mancha o deformidad física.',
 suggested: 'Destino: RET-NORTE (Dictamen de Calidad)',
 tone: 'border-rose-500/40 hover:border-rose-500',
 },
 {
 id: 'Requiere inspección' as ReturnUnitCondition,
 title: '4. Requiere Inspección',
 desc: 'Duda sobre garantía o dictamen técnico pendiente.',
 suggested: 'Destino: QUA-BLOQ (Cuarentena)',
 tone: 'border-purple-500/40 hover:border-purple-500',
 },
 ].map((c) => (
 <button
 key={c.id}
 type="button"
 onClick={() => handleSelectCondition(c.id)}
 className={`p-4 rounded-3xl border text-left transition-all hover:scale-[1.02] cursor-pointer space-y-1.5 shadow-2xs bg-white text-zinc-900 ${c.tone}`}
 >
 <strong className="text-xs font-black block">{c.title}</strong>
 <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">{c.desc}</p>
 <span className="text-[10px] font-mono font-bold block pt-1 border-t border-theme-subtle text-theme-muted">
 {c.suggested}
 </span>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* STEP 3: Confirmar Ubicación Destino */}
 {currentStep === 3 && (
 <div className="space-y-4 animate-in fade-in">
 <div className="text-center space-y-1">
 <h3 className="text-sm font-extrabold text-theme-main">
 Paso 3 — Confirmar Área de Destino en el CEDIS
 </h3>
 <p className="text-xs text-theme-muted">
 Condición registrada: <strong className="text-theme-main">{condition}</strong>.
 </p>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Área Operativa Destino Sugerida:
 </label>
 <select
 value={targetLocation}
 onChange={(e) => setTargetLocation(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2.5 text-xs font-mono font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="REC-DEV-01">REC-DEV-01 &bull; Bahía de Devoluciones (Pendiente Acomodo)</option>
 <option value="RET-NORTE">RET-NORTE &bull; Área Retrabajo y Garantías Norte</option>
 <option value="RET-SUR">RET-SUR &bull; Área Retrabajo y Garantías Sur</option>
 <option value="QUA-BLOQ">QUA-BLOQ &bull; Cuarentena de Calidad</option>
 </select>
 </div>

 {locationWarning && (
 <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
 <span>{locationWarning}</span>
 </div>
 )}
 </div>

 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => setCurrentStep(2)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle cursor-pointer"
 >
 Cambiar condición
 </button>
 <button
 type="button"
 onClick={handleConfirmLocationChoice}
 className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md cursor-pointer flex items-center gap-1.5"
 >
 <span>Continuar a escaneo de ubicación</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}

 {/* STEP 4: Doble Confirmación (Escanear Ubicación Destino) */}
 {currentStep === 4 && (
 <div className="space-y-4 animate-in fade-in">
 <div className="text-center space-y-1">
 <h3 className="text-sm font-extrabold text-theme-main">
 Paso 4 — Doble Confirmación: Escaneo de Ubicación Destino
 </h3>
 <p className="text-xs text-theme-muted">
 Escanea el código QR físico de la bahía <strong className="font-mono text-theme-primary">{targetLocation}</strong> para asentar físicamente la pieza.
 </p>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ubicación Requerida:</span>
 <strong className="font-mono text-lg font-black text-theme-primary">{targetLocation}</strong>
 </div>

 <div className="text-right">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Estado al Asentar:</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-surface text-theme-main border border-theme-subtle">
 {condition === 'En buen estado' ? 'Pendiente de acomodo' : 'En retrabajo'}
 </span>
 </div>
 </div>

 {locationScanError && (
 <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs flex items-center gap-2">
 <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
 <span>{locationScanError}</span>
 </div>
 )}

 {isLocationVerified ? (
 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-3">
 <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
 <div className="space-y-0.5">
 <strong className="text-xs font-black block">✓ Ubicación confirmada: {targetLocation}</strong>
 <p className="text-[11px]">La unidad y la posición destino han sido validadas por doble escaneo.</p>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <button
 type="button"
 onClick={handleSimulateValidLocationScan}
 className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Simular escaneo de {targetLocation}</span>
 </button>

 <button
 type="button"
 onClick={handleSimulateInvalidLocationScan}
 className="px-4 py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <AlertTriangle className="w-4 h-4 text-amber-500" />
 <span>Simular ubicación incorrecta (A-B-03)</span>
 </button>
 </div>
 )}
 </div>
 )}

 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 {currentStep === 4 && isLocationVerified && (
 <button
 type="button"
 onClick={handleFinalSubmit}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Confirmar devolución</span>
 </button>
 )}
 </div>
 </div>
 </ModalPortal>
 );
};
