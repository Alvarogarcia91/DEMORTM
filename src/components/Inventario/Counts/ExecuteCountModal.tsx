import React, { useState } from 'react';
import { 
 X, 
 QrCode, 
 MapPin, 
 CheckCircle2, 
 AlertTriangle, 
 Boxes, 
 Sparkles, 
 ChevronRight, 
 Check, 
 Radio, 
 Layers, 
 Eye, 
 EyeOff,
 Package,
 RotateCcw,
 ShieldCheck,
 Building2,
 Store
} from 'lucide-react';
import { CountTaskRecord, CountDifferenceRecord } from '../../../data/mockCountsData';
import { MOCK_STOCK_ITEMS, StockItemRecord } from '../../../data/mockInventoryData';
import { LugaQrScanner } from './LugaQrScanner';
import { ModalPortal } from '../../common/ModalPortal';

interface ScannedUnitItem {
 uid: string;
 sku: string;
 productName: string;
 brand: string;
 isUnexpected?: boolean;
 registeredLocation?: string;
}

interface ExecuteCountModalProps {
 task: CountTaskRecord | null;
 onClose: () => void;
 onCompleteCount: (
 updatedTask: CountTaskRecord, 
 generatedDifferences: CountDifferenceRecord[]
 ) => void;
}

export const ExecuteCountModal: React.FC<ExecuteCountModalProps> = ({
 task,
 onClose,
 onCompleteCount,
}) => {
 // Wizard steps: 1: Scan Location, 2: Scan Units, 3: Comparison & Result
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
 
 // Location Scan State
 const [isLocationValidated, setIsLocationValidated] = useState<boolean>(false);
 const [scannedLocationCode, setScannedLocationCode] = useState<string | null>(null);

 // Scanned Units State
 const [scannedUnits, setScannedUnits] = useState<ScannedUnitItem[]>([]);
 const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

 if (!task) return null;

 // Step 1: Handle Location Scan Success
 const handleLocationScanSuccess = (payload: { code: string }) => {
 setIsLocationValidated(true);
 setScannedLocationCode(payload.code);
 setTimeout(() => {
 setCurrentStep(2);
 }, 600);
 };

 // Step 2: Handle Unit Scan Success
 const handleUnitScanSuccess = (payload: { code: string; extraMeta?: any }) => {
 setDuplicateWarning(null);
 const scannedUid = payload.code;

 // Check for duplicate scan
 if (scannedUnits.some(u => u.uid === scannedUid)) {
 setDuplicateWarning(`Unidad ya registrada en este conteo: ${scannedUid}`);
 return;
 }

 // Lookup metadata in stock
 const stockMatch = MOCK_STOCK_ITEMS.find(s => s.uid === scannedUid);
 const isUnexpected = payload.extraMeta?.isUnexpected || (stockMatch && stockMatch.location !== task.locationCode);
 const registeredLoc = payload.extraMeta?.registeredLocation || stockMatch?.location || 'Otra ubicación';

 const newUnit: ScannedUnitItem = {
 uid: scannedUid,
 sku: stockMatch?.sku || 'SC-NAYT-FLOW-IND',
 productName: stockMatch?.productName || 'Nayt Colchón Flow Basic White Individual',
 brand: stockMatch?.brand || 'Nayt',
 isUnexpected: !!isUnexpected,
 registeredLocation: registeredLoc,
 };

 setScannedUnits(prev => [newUnit, ...prev]);
 };

 // Step 2: Finish Location Count and move to comparison
 const handleFinishLocationCount = () => {
 setCurrentStep(3);
 };

 // Step 3: Calculations of differences
 const scannedUids = scannedUnits.map(u => u.uid);
 const expectedUids = task.expectedSerials;
 
 const matchingUids = scannedUids.filter(uid => expectedUids.includes(uid));
 const missingUids = expectedUids.filter(uid => !scannedUids.includes(uid));
 const unexpectedUnitsList = scannedUnits.filter(u => !expectedUids.includes(u.uid));

 const quantityDiff = scannedUnits.length - task.expectedUnitsCount;
 const hasSerialDifference = missingUids.length > 0 || unexpectedUnitsList.length > 0;
 const isPerfectMatch = quantityDiff === 0 && !hasSerialDifference;

 // Final Confirmation of count
 const handleConfirmAndCloseTask = () => {
 const generatedDifferences: CountDifferenceRecord[] = [];

 // Create difference records if any
 missingUids.forEach((mUid, idx) => {
 const matchStock = MOCK_STOCK_ITEMS.find(s => s.uid === mUid);
 generatedDifferences.push({
 id: `diff-${Date.now()}-${idx}`,
 folio: `DIF-2026-00${45 + Math.floor(Math.random() * 20)}`,
 taskFolio: task.folio,
 warehouseId: task.warehouseId,
 warehouseName: task.warehouseName,
 locationCode: task.locationCode,
 locationName: task.locationName,
 sku: matchStock?.sku || 'SC-NAYT-FLOW-IND',
 productName: matchStock?.productName || 'Nayt Colchón Flow Individual',
 uid: mUid,
 expectedLocation: task.locationCode,
 actualLocation: 'No localizada',
 expectedCount: 1,
 actualCount: 0,
 differenceType: 'Faltante',
 status: 'Pendiente de revisión',
 lastMovement: {
 date: '27 Ago 2026 10:30',
 type: 'ACOMODO',
 user: 'Operador RF',
 location: task.locationCode,
 },
 });
 });

 unexpectedUnitsList.forEach((uUnit, idx) => {
 generatedDifferences.push({
 id: `diff-${Date.now()}-u-${idx}`,
 folio: `DIF-2026-00${65 + Math.floor(Math.random() * 20)}`,
 taskFolio: task.folio,
 warehouseId: task.warehouseId,
 warehouseName: task.warehouseName,
 locationCode: task.locationCode,
 locationName: task.locationName,
 sku: uUnit.sku,
 productName: uUnit.productName,
 uid: uUnit.uid,
 expectedLocation: uUnit.registeredLocation || 'Otra ubicación',
 actualLocation: `${task.locationCode} (Encontrada físicamente)`,
 expectedCount: 0,
 actualCount: 1,
 differenceType: 'UID inesperada',
 status: 'Pendiente de revisión',
 lastMovement: {
 date: '27 Ago 2026 12:45',
 type: 'ACOMODO',
 user: 'Operador RF',
 location: uUnit.registeredLocation || 'B-C-06',
 },
 });
 });

 const updatedTask: CountTaskRecord = {
 ...task,
 countedUnitsCount: scannedUnits.length,
 countedSerials: scannedUids,
 status: isPerfectMatch ? 'Cerrado' : 'Por revisar',
 hasDifference: !isPerfectMatch,
 differenceType: isPerfectMatch
 ? 'Sin diferencia'
 : missingUids.length > 0 && unexpectedUnitsList.length > 0 && quantityDiff === 0
 ? 'Diferencia serial'
 : quantityDiff < 0
 ? 'Faltante'
 : 'Sobrante',
 completedAt: '28 Ago 2026, 12:40',
 notes: isPerfectMatch
 ? 'Conteo físico validado al 100% sin discrepancias.'
 : `Diferencia detectada: ${missingUids.length} faltantes, ${unexpectedUnitsList.length} inesperadas.`,
 };

 onCompleteCount(updatedTask, generatedDifferences);
 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header Terminal Style */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Radio className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{task.folio}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20">
 Terminal RF-04 &middot; Modo Conteo
 </span>
 {task.isBlindCount && (
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 border border-zinc-400 shadow-2xs flex items-center gap-1">
 <EyeOff className="w-3 h-3" />
 <span>Conteo Ciego</span>
 </span>
 )}
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Ejecución de Conteo Físico
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

 {/* Steps Breadcrumbs */}
 <div className="px-6 py-2.5 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between text-[11px] font-bold">
 {[
 { num: 1, label: '1. Validar Ubicación' },
 { num: 2, label: '2. Escanear Unidades' },
 { num: 3, label: '3. Comparación y Cierre' },
 ].map((s) => {
 const isActive = currentStep === s.num;
 const isPassed = currentStep > s.num;
 return (
 <div
 key={s.num}
 className={`flex items-center gap-1.5 ${
 isActive ? 'text-rose-600 font-black' : isPassed ? 'text-emerald-600' : 'text-theme-muted'
 }`}
 >
 <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
 isActive ? 'bg-rose-600 text-white' : isPassed ? 'bg-emerald-500 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {s.num}
 </div>
 <span>{s.label}</span>
 </div>
 );
 })}
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* ========================================================================= */}
 {/* PASO 1: ESCANEAR UBICACIÓN FÍSICA */}
 {/* ========================================================================= */}
 {currentStep === 1 && (
 <div className="space-y-4">
 
 {/* Location Target Info Card */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Ubicación Asignada a Contar:
 </span>
 <strong className="font-mono text-base font-black text-theme-primary">
 {task.locationCode}
 </strong>
 <span className="text-xs text-theme-main font-semibold block">
 {task.locationName} &middot; {task.warehouseName}
 </span>
 </div>

 <div className="px-3 py-1 rounded-xl bg-theme-surface border border-theme-subtle text-[10px] font-mono font-bold text-theme-muted">
 Zona: {task.zoneType}
 </div>
 </div>

 {/* LUGA Animated Scanner Viewport */}
 <LugaQrScanner
 mode="LOCATION"
 expectedLocation={task.locationCode}
 onScanSuccess={handleLocationScanSuccess}
 />
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 2: ESCANEAR UNIDADES (CONTEO CIEGO) */}
 {/* ========================================================================= */}
 {currentStep === 2 && (
 <div className="space-y-4">
 
 {/* Validated Location Banner */}
 <div className="p-3.5 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-center justify-between text-xs text-zinc-900">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <div>
 <strong>Ubicación Validada: {task.locationCode}</strong>
 <span className="text-[11px] block text-theme-muted">{task.locationName}</span>
 </div>
 </div>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 En progreso
 </span>
 </div>

 {/* Blind Count Helper & Counter */}
 <div className="flex items-center justify-between p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <div>
 <h4 className="text-xs font-black text-theme-main">
 Escanea todas las unidades físicas encontradas
 </h4>
 {task.isBlindCount ? (
 <span className="text-[11px] text-theme-muted">
 Modo Conteo Ciego: La existencia teórica del sistema permanece oculta.
 </span>
 ) : (
 <span className="text-[11px] text-theme-muted">
 Existencia en sistema: <strong className="font-mono text-theme-main">{task.expectedUnitsCount} unidades</strong>
 </span>
 )}
 </div>

 <div className="text-right shrink-0">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Unidades Escaneadas:</span>
 <strong className="text-lg font-mono font-black text-theme-primary">
 {scannedUnits.length}
 </strong>
 </div>
 </div>

 {duplicateWarning && (
 <div className="p-3 rounded-xl bg-white border border-amber-500 text-zinc-900 text-xs flex items-center gap-2 shadow-2xs font-semibold">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span>{duplicateWarning}</span>
 </div>
 )}

 {/* LUGA Animated Scanner Viewport for Units */}
 <LugaQrScanner
 mode="UNIT"
 expectedSerials={task.expectedSerials}
 alreadyCountedSerials={scannedUnits.map(u => u.uid)}
 onScanSuccess={handleUnitScanSuccess}
 />

 {/* Scanned Units List */}
 <div className="space-y-2 pt-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Unidades Registradas Físicamente ({scannedUnits.length}):
 </span>

 {scannedUnits.length === 0 ? (
 <div className="p-6 rounded-2xl border-2 border-dashed border-theme-subtle text-center text-theme-muted text-xs">
 Aún no has escaneado ninguna unidad. Utiliza el simulador de lectura de arriba.
 </div>
 ) : (
 <div className="space-y-1.5 max-h-44 overflow-y-auto">
 {scannedUnits.map((unit, idx) => (
 <div
 key={unit.uid}
 className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
 unit.isUnexpected
 ? 'bg-white border-purple-500 shadow-2xs text-zinc-900'
 : 'bg-white border-theme-subtle'
 }`}
 >
 <div className="flex items-center gap-2 min-w-0">
 <span className="w-5 h-5 rounded-full bg-theme-muted text-theme-main font-bold text-[10px] flex items-center justify-center shrink-0">
 {idx + 1}
 </span>
 <div className="min-w-0">
 <span className="font-mono font-bold text-theme-primary block truncate">{unit.uid}</span>
 <span className="text-[10px] text-theme-muted">{unit.productName}</span>
 </div>
 </div>

 {unit.isUnexpected ? (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs shrink-0">
 ⚠ Inesperada (Pertenece a {unit.registeredLocation})
 </span>
 ) : (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs shrink-0">
 ✓ Registrada
 </span>
 )}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Action Button: Finish Location Count */}
 <div className="pt-2 flex justify-end">
 <button
 type="button"
 onClick={handleFinishLocationCount}
 className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Finalizar conteo de ubicación ({scannedUnits.length} unidades)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 3: COMPARACIÓN CONTRA SISTEMA & RESULTADOS */}
 {/* ========================================================================= */}
 {currentStep === 3 && (
 <div className="space-y-4">
 
 {/* Overall Outcome Status Banner */}
 {isPerfectMatch ? (
 <div className="p-4 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-center gap-3 text-xs text-zinc-900">
 <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 border border-emerald-600 shadow-2xs flex items-center justify-center shrink-0">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <div>
 <strong className="text-sm font-black block">
 ✓ Conteo Correcto · Sin Diferencias
 </strong>
 <span className="text-[11px]">
 {task.expectedUnitsCount} unidades esperadas &middot; {scannedUnits.length} encontradas &middot; Todas las UIDs coinciden al 100%.
 </span>
 </div>
 </div>
 ) : (
 <div className="p-4 rounded-2xl bg-white border border-amber-500 flex items-center gap-3 text-xs text-zinc-900 shadow-2xs">
 <div className="w-9 h-9 rounded-xl bg-white text-amber-600 border border-amber-500 shadow-2xs flex items-center justify-center shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <strong className="text-sm font-black block">
 ⚠ Discrepancia Detectada en Ubicación {task.locationCode}
 </strong>
 <span className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
 Se registraron diferencias entre la existencia del sistema y las unidades físicas escaneadas.
 </span>
 </div>
 </div>
 )}

 {/* Quantities Comparison Grid */}
 <div className="grid grid-cols-3 gap-3 text-center">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">En Sistema</span>
 <strong className="text-base font-mono font-black text-theme-main">
 {task.expectedUnitsCount} u.
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Físico Contado</span>
 <strong className="text-base font-mono font-black text-theme-primary">
 {scannedUnits.length} u.
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Diferencia</span>
 <strong className={`text-base font-mono font-black ${
 quantityDiff === 0 ? 'text-emerald-600' : 'text-rose-600'
 }`}>
 {quantityDiff > 0 ? `+${quantityDiff}` : quantityDiff} u.
 </strong>
 </div>
 </div>

 {/* Serial Breakdown: Matching vs Missing vs Unexpected */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider">
 Detalle de Serialización por UID:
 </h4>

 {/* Coincidentes */}
 {matchingUids.length > 0 && (
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
 <Check className="w-3 h-3" />
 <span>UIDs Coincidentes ({matchingUids.length}):</span>
 </span>
 <div className="flex flex-wrap gap-1">
 {matchingUids.map(uid => (
 <span key={uid} className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-white text-zinc-900 border border-emerald-600 shadow-2xs font-bold">
 {uid}
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Faltantes */}
 {missingUids.length > 0 && (
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">
 <AlertTriangle className="w-3 h-3" />
 <span>Faltantes en Ubicación ({missingUids.length}):</span>
 </span>
 <div className="flex flex-wrap gap-1">
 {missingUids.map(uid => (
 <span key={uid} className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-500/10 text-rose-700 border border-rose-500/20 font-bold">
 {uid} (No encontrada)
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Inesperadas */}
 {unexpectedUnitsList.length > 0 && (
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase flex items-center gap-1">
 <Sparkles className="w-3 h-3" />
 <span>UIDs Inesperadas ({unexpectedUnitsList.length}):</span>
 </span>
 <div className="flex flex-wrap gap-1">
 {unexpectedUnitsList.map(u => (
 <span key={u.uid} className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-white text-zinc-900 border border-purple-500 shadow-2xs font-bold">
 {u.uid} &middot; Sistema marca: {u.registeredLocation}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Action Buttons */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-between gap-3">
 <button
 type="button"
 onClick={() => setCurrentStep(2)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold text-xs border border-theme-subtle cursor-pointer flex items-center gap-1"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>Re-escanear</span>
 </button>

 <button
 type="button"
 onClick={handleConfirmAndCloseTask}
 className={`px-5 py-2.5 rounded-xl text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
 isPerfectMatch ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
 }`}
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>{isPerfectMatch ? 'Cerrar ubicación' : 'Registrar diferencia y continuar'}</span>
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </ModalPortal>
 );
};
