import React, { useState } from 'react';
import { 
 X, 
 QrCode, 
 MapPin, 
 ArrowRight, 
 CheckCircle2, 
 AlertTriangle, 
 Radio, 
 Check, 
 RotateCcw,
 Sparkles,
 ShieldCheck,
 User,
 Clock,
 Layers,
 ChevronRight
} from 'lucide-react';

import { LocationQrModal, PhysicalLocationMeta } from './LocationQrModal';
import { PrintLocationQrModal } from './PrintLocationQrModal';
import { ModalPortal } from '../common/ModalPortal';

export interface RearrangementOrderRecord {
 id: string;
 folio: string;
 uid: string;
 sku: string;
 productName: string;
 brand: string;
 size: string;
 warehouseId: string;
 warehouseName: string;
 originLocation: string;
 destinationLocation: string;
 reasonType: string;
 status: 'Pendiente' | 'En ejecución' | 'Completado' | 'Cancelado';
 createdAt: string;
 executedAt?: string;
 executedBy?: string;
}

interface ExecuteRearrangementModalProps {
 order: RearrangementOrderRecord | null;
 onClose: () => void;
 onConfirmSuccess: (completedOrder: RearrangementOrderRecord) => void;
}

export const ExecuteRearrangementModal: React.FC<ExecuteRearrangementModalProps> = ({
 order,
 onClose,
 onConfirmSuccess,
}) => {
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1); // 1: scan unit, 2: scan loc, 3: confirm, 4: success
 const [unitScanned, setUnitScanned] = useState(false);
 const [locationScanned, setLocationScanned] = useState(false);
 const [scanError, setScanError] = useState<string | null>(null);

 // Modals for Destination Location QR
 const [selectedLocationQr, setSelectedLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedPrintLocationQr, setSelectedPrintLocationQr] = useState<PhysicalLocationMeta | null>(null);

 if (!order) return null;

 // Step 1: Simulate Unit Scan
 const handleScanUnit = () => {
 setScanError(null);
 setUnitScanned(true);
 setCurrentStep(2);
 };

 // Step 2: Simulate Valid Destination Scan
 const handleScanValidLocation = () => {
 setScanError(null);
 setLocationScanned(true);
 setCurrentStep(3);
 };

 // Step 2: Simulate Invalid Location Scan (Demo Error feature)
 const handleScanInvalidLocation = () => {
 setScanError(
 `Ubicación incorrecta: Se esperaba escanear el QR físico de la ubicación ${order.destinationLocation}. Escaneaste C-A-07. No se permite continuar hasta validar la ubicación correcta.`
 );
 };

 const handleOpenDestinationQr = () => {
 const parts = order.destinationLocation.split('-');
 const aisle = parts[0] ? `Pasillo ${parts[0]}` : undefined;
 const level = parts[1] || undefined;
 const posNum = parts[2] || undefined;

 setSelectedLocationQr({
 code: order.destinationLocation,
 name: `Ubicación Destino ${order.destinationLocation}`,
 type: 'RACK',
 warehouseName: order.warehouseName,
 warehouseCode: order.warehouseName.includes('Sur') ? 'MTY-S' : order.warehouseName.includes('Reynosa') ? 'ALM-REY' : order.warehouseName.includes('Matamoros') ? 'ALM-MAT' : 'MTY-N',
 aisle,
 level,
 positionNumber: posNum,
 capacity: 7,
 status: 'Activa · Lista para recepción',
 description: 'Espacio físico de destino asignado para la optimización de acomodo.',
 });
 };

 // Step 3: Confirm Rearrangement Execution
 const handleConfirmMovement = () => {
 const completedOrder: RearrangementOrderRecord = {
 ...order,
 status: 'Completado',
 executedAt: '27 Ago 2026, 18:55',
 executedBy: 'Admin Demo (Terminal RF-04)',
 };
 setCurrentStep(4);
 onConfirmSuccess(completedOrder);
 };

 const resetFlow = () => {
 setCurrentStep(1);
 setUnitScanned(false);
 setLocationScanned(false);
 setScanError(null);
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header / Terminal Simulation Badge */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center font-mono font-bold text-sm border border-blue-500 shadow-2xs shrink-0">
 <Radio className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{order.folio}</span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs">
 Terminal RF-04 &middot; Modo Operación
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Ejecución de Reacomodo Interno
 </h2>
 </div>
 </div>

 {currentStep !== 4 && (
 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>

 {/* Progress Bar (Steps 1, 2, 3) */}
 {currentStep !== 4 && (
 <div className="px-6 py-3 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between text-xs">
 <div className={`flex items-center gap-2 font-bold ${
 currentStep >= 1 ? 'text-theme-primary' : 'text-theme-muted'
 }`}>
 <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
 currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-theme-primary text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
 </div>
 <span>Escanear Unidad</span>
 </div>

 <ChevronRight className="w-4 h-4 text-theme-muted" />

 <div className={`flex items-center gap-2 font-bold ${
 currentStep >= 2 ? 'text-theme-primary' : 'text-theme-muted'
 }`}>
 <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
 currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-theme-primary text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
 </div>
 <span>Escanear Destino</span>
 </div>

 <ChevronRight className="w-4 h-4 text-theme-muted" />

 <div className={`flex items-center gap-2 font-bold ${
 currentStep === 3 ? 'text-theme-primary' : 'text-theme-muted'
 }`}>
 <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
 currentStep === 3 ? 'bg-theme-primary text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 3
 </div>
 <span>Confirmar</span>
 </div>
 </div>
 )}

 {/* Body Content */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* ========================================================================= */}
 {/* PASO 1: ESCANEAR UNIDAD */}
 {/* ========================================================================= */}
 {currentStep === 1 && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instrucción Operativa</span>
 <p className="text-sm font-bold text-theme-main">
 Escanea el código QR / Serie del material indicado en la orden.
 </p>
 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle text-xs">
 <span className="text-theme-muted">Serie esperada:</span>
 <span className="font-mono font-black text-theme-primary text-sm">{order.uid}</span>
 </div>
 </div>

 {/* Ficha Resumida */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-theme-muted">{order.sku}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {order.brand} &middot; {order.size}
 </span>
 </div>
 <h3 className="text-xs font-bold text-theme-main">{order.productName}</h3>
 <div className="flex items-center gap-2 text-theme-muted pt-1">
 <MapPin className="w-3.5 h-3.5 text-theme-primary" />
 <span>Ubicación actual: <strong className="font-mono text-theme-main">{order.originLocation}</strong></span>
 </div>
 </div>

 {/* Action Button */}
 <div className="pt-2">
 <button
 onClick={handleScanUnit}
 className="w-full py-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <QrCode className="w-4 h-4" />
 <span>Simular escaneo de serie ({order.uid})</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 2: ESCANEAR DESTINO */}
 {/* ========================================================================= */}
 {currentStep === 2 && (
 <div className="space-y-4 animate-in fade-in duration-150">
 {/* Status Banner Unidad Validada */}
 <div className="p-3 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-center gap-2.5 text-zinc-900 text-xs">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <div>
 <strong className="block">✓ Unidad validada correctamente</strong>
 <span className="font-mono text-[11px] text-theme-muted">{order.uid} &middot; {order.productName}</span>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instrucción Operativa</span>
 <button
 onClick={handleOpenDestinationQr}
 className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
 title="Ver código QR físico del espacio destino"
 >
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>Ver QR destino ({order.destinationLocation})</span>
 </button>
 </div>
 <p className="text-sm font-bold text-theme-main">
 Lleva la pieza y escanea el código de barras/QR de la <strong className="text-emerald-600">ubicación destino</strong>.
 </p>
 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle text-xs">
 <span className="text-theme-muted">Destino asignado:</span>
 <span className="font-mono font-black text-emerald-600 text-base">{order.destinationLocation}</span>
 </div>
 </div>

 {/* Error Banner si el operador escanea una ubicación errónea */}
 {scanError && (
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs space-y-1 animate-in shake duration-200">
 <div className="flex items-center gap-2 font-bold">
 <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
 <span>¡Error de Escaneo Operativo!</span>
 </div>
 <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-300">
 {scanError}
 </p>
 </div>
 )}

 {/* Action Buttons */}
 <div className="space-y-2 pt-2">
 <button
 onClick={handleScanValidLocation}
 className="w-full py-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <MapPin className="w-4 h-4" />
 <span>Simular escaneo de QR de ubicación ({order.destinationLocation})</span>
 </button>

 <button
 onClick={handleScanInvalidLocation}
 className="w-full py-2.5 rounded-xl bg-theme-muted hover:bg-theme-primary-light text-theme-muted hover:text-theme-primary font-semibold text-xs transition-colors border border-theme-subtle cursor-pointer flex items-center justify-center gap-1.5"
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 <span>Simular escaneo de ubicación incorrecta (C-A-07)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 3: CONFIRMAR REACOMODO */}
 {/* ========================================================================= */}
 {currentStep === 3 && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-3 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-center gap-2.5 text-zinc-900 text-xs">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <div>
 <strong className="block">✓ Ubicación validada con éxito</strong>
 <span className="font-mono text-[11px] text-theme-muted">{order.destinationLocation} (Disponible para acomodo)</span>
 </div>
 </div>

 {/* Resumen Final de Movimiento */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Resumen del Movimiento Físico</span>
 
 <div className="p-3 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="font-mono text-xs font-black text-theme-primary">{order.sku}</span>
 <p className="text-xs font-bold text-theme-main">{order.productName}</p>
 <div className="flex items-center gap-2 text-[11px] font-mono text-theme-muted">
 <span>{order.brand}</span>
 <span>&bull;</span>
 <span>{order.size}</span>
 <span>&bull;</span>
 <span className="font-bold text-theme-main">{order.uid}</span>
 </div>
 </div>

 <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-blue-500 shadow-2xs text-xs">
 <div className="text-center">
 <span className="text-[10px] text-theme-muted block font-semibold">Origen Liberado</span>
 <span className="font-mono font-black text-theme-primary text-sm">{order.originLocation}</span>
 </div>

 <ArrowRight className="w-5 h-5 text-theme-primary" />

 <div className="text-center">
 <span className="text-[10px] text-theme-muted block font-semibold">Destino Ocupado</span>
 <span className="font-mono font-black text-emerald-600 text-sm">{order.destinationLocation}</span>
 </div>
 </div>
 </div>

 {/* Confirm Execution Button */}
 <div className="pt-2">
 <button
 onClick={handleConfirmMovement}
 className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>Confirmar y actualizar inventario en tiempo real</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 4: ÉXITO OPERATIVO */}
 {/* ========================================================================= */}
 {currentStep === 4 && (
 <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-150">
 <div className="w-16 h-16 rounded-3xl bg-white text-emerald-600 border border-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
 <ShieldCheck className="w-9 h-9" />
 </div>

 <div className="space-y-1">
 <h3 className="text-base font-black text-theme-main">
 ¡Reacomodo Registrado con Éxito!
 </h3>
 <p className="text-xs text-theme-muted max-w-sm mx-auto">
 La unidad física ha sido trasladada a su nueva ubicación en el almacén y el inventario en tiempo real ha sido actualizado.
 </p>
 </div>

 <div className="pt-3">
 <button
 onClick={onClose}
 className="px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
 >
 Aceptar y cerrar
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </ModalPortal>

 {/* ========================================================================= */}
 {/* SUB-MODAL APILADO: VISOR DE QR DE UBICACIÓN DESTINO */}
 {/* ========================================================================= */}
 <LocationQrModal
 location={selectedLocationQr}
 onClose={() => setSelectedLocationQr(null)}
 onPrint={(loc) => setSelectedPrintLocationQr(loc)}
 />

 {/* ========================================================================= */}
 {/* SUB-MODAL APILADO: IMPRESIÓN DE ETIQUETA TÉRMICA DE UBICACIÓN */}
 {/* ========================================================================= */}
 <PrintLocationQrModal
 location={selectedPrintLocationQr}
 onClose={() => setSelectedPrintLocationQr(null)}
 />
 </>
 );
};
