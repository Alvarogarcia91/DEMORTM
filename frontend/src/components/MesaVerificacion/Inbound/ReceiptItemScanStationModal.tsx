import React, { useState } from 'react';
import { 
 X, 
 Scan, 
 QrCode, 
 CheckCircle2, 
 AlertTriangle, 
 Boxes, 
 Sparkles, 
 Printer, 
 Tag, 
 Clock, 
 ShieldAlert, 
 RefreshCw, 
 Check, 
 Package, 
 Layers, 
 Building2, 
 Radio,
 FileSpreadsheet
} from 'lucide-react';
import { InboundReceiptLine, InboundReceiptOrder, ReceivedUnitRecord } from '../../../data/mockInboundData';
import { ReceiptStickerModal } from './ReceiptStickerModal';
import { ModalPortal } from '../../common/ModalPortal';

interface ReceiptItemScanStationModalProps {
 order: InboundReceiptOrder;
 line: InboundReceiptLine;
 onClose: () => void;
 onUpdateLine: (updatedLine: InboundReceiptLine) => void;
 onShowToast?: (msg: string) => void;
}

export const ReceiptItemScanStationModal: React.FC<ReceiptItemScanStationModalProps> = ({
 order,
 line,
 onClose,
 onUpdateLine,
 onShowToast,
}) => {
 const isSerialized = line.serialization === 'Por unidad';

 // Scanner status
 const [isScanning, setIsScanning] = useState<boolean>(false);
 const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'warning'>('idle');
 const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
 const [lastReceivedUnit, setLastReceivedUnit] = useState<ReceivedUnitRecord | null>(null);

 // Sticker modal state
 const [previewStickerUnit, setPreviewStickerUnit] = useState<ReceivedUnitRecord | null>(null);

 // Non-serialized quantity input
 const [bulkQuantityInput, setBulkQuantityInput] = useState<number>(line.pendingQuantity || 1);

 // -------------------------------------------------------------------------
 // PIECE-BY-PIECE SCANNING & SERIALIZATION HANDLER
 // -------------------------------------------------------------------------
 const handleSimulatePieceScan = () => {
 // Check if line is already completed (surplus / excess simulation check)
 if (line.receivedQuantity >= line.expectedQuantity) {
 setScanStatus('warning');
 setFeedbackMessage(
 `⚠ Cantidad excedente: La orden esperaba ${line.expectedQuantity} unidades y ya fueron recibidas completamente. Registra una incidencia si el proveedor envió producto de más.`
 );
 return;
 }

 setIsScanning(true);
 setScanStatus('scanning');
 setFeedbackMessage(null);

 // Simulate 450ms optical laser recognition & UID generation
 setTimeout(() => {
 setIsScanning(false);
 
 const nextSerialNum = 180 + line.receivedUnits.length + Math.floor(Math.random() * 50);
 const newUid = `SC-UID-2026-000${nextSerialNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const fullDateStr = `27 Ago 2026, ${timeStr}`;

 const newUnit: ReceivedUnitRecord = {
 uid: newUid,
 sku: line.sku,
 productName: line.productName,
 brand: line.brand,
 size: line.size,
 lotNumber: line.lotNumber || 'LOTE-2026-W34',
 receivedAt: fullDateStr,
 operator: order.operatorAssigned || 'Operador Mesa 01',
 locationCode: order.receivingAreaCode || 'REC-01',
 status: 'Pendiente de acomodo',
 };

 const updatedReceivedUnits = [newUnit, ...line.receivedUnits];
 const newReceivedQty = line.receivedQuantity + 1;
 const newPendingQty = Math.max(0, line.expectedQuantity - newReceivedQty);

 const updatedLine: InboundReceiptLine = {
 ...line,
 receivedQuantity: newReceivedQty,
 pendingQuantity: newPendingQty,
 status: newReceivedQty >= line.expectedQuantity ? 'Completo' : 'En proceso',
 receivedUnits: updatedReceivedUnits,
 };

 setLastReceivedUnit(newUnit);
 setScanStatus('success');
 onUpdateLine(updatedLine);

 if (onShowToast) {
 onShowToast(`✓ Unidad ${newUid} serializada y asignada a ${order.receivingAreaCode}`);
 }
 }, 450);
 };

 // -------------------------------------------------------------------------
 // SIMULATION: INCORRECT ITEM ERROR
 // -------------------------------------------------------------------------
 const handleSimulateIncorrectItem = () => {
 setIsScanning(true);
 setScanStatus('scanning');
 setFeedbackMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setFeedbackMessage(
 '✕ Artículo no esperado: El código de barras escaneado (SC-RES-ORT-MAT) no corresponde al artículo seleccionado en esta recepción.'
 );
 }, 450);
 };

 // -------------------------------------------------------------------------
 // SIMULATION: DUPLICATE UID ERROR
 // -------------------------------------------------------------------------
 const handleSimulateDuplicateUid = () => {
 if (line.receivedUnits.length === 0) {
 handleSimulatePieceScan();
 return;
 }
 const dupUid = line.receivedUnits[0].uid;
 setIsScanning(true);
 setScanStatus('scanning');
 setFeedbackMessage(null);

 setTimeout(() => {
 setIsScanning(false);
 setScanStatus('error');
 setFeedbackMessage(`✕ Unidad ya registrada: El UID ${dupUid} ya fue capturado en este lote.`);
 }, 450);
 };

 // -------------------------------------------------------------------------
 // NON-SERIALIZED BULK RECEIPT HANDLER
 // -------------------------------------------------------------------------
 const handleReceiveBulkQuantity = () => {
 const qtyToReceive = Math.min(bulkQuantityInput, line.pendingQuantity);
 if (qtyToReceive <= 0) return;

 const newReceivedQty = line.receivedQuantity + qtyToReceive;
 const newPendingQty = Math.max(0, line.expectedQuantity - newReceivedQty);

 const updatedLine: InboundReceiptLine = {
 ...line,
 receivedQuantity: newReceivedQty,
 pendingQuantity: newPendingQty,
 status: newReceivedQty >= line.expectedQuantity ? 'Completo' : 'En proceso',
 };

 onUpdateLine(updatedLine);
 setScanStatus('success');
 if (onShowToast) {
 onShowToast(`✓ Se registraron ${qtyToReceive} unidades de ${line.productName}`);
 }
 };

 return (
 <>
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
 Estación de Recepción &middot; {order.receivingAreaCode}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-zinc-900 border border-zinc-400 shadow-2xs">
 Lote: {line.lotNumber}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Recepción y Serialización de Mercancía
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
 
 {/* Article Identity & Progress Card */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{line.sku}</span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-theme-surface text-theme-main border border-theme-subtle">
 {line.category}
 </span>
 <span className="text-[10px] text-theme-muted">{line.brand} &middot; {line.size}</span>
 </div>
 <h3 className="text-sm font-black text-theme-main">{line.productName}</h3>
 </div>

 <div className="text-right">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Área de Ingreso:</span>
 <span className="font-mono font-bold text-theme-primary text-xs">
 {order.destinationWarehouseName} &middot; {order.receivingAreaCode}
 </span>
 </div>
 </div>

 {/* Quantities Counter Bar */}
 <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-theme-subtle">
 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Esperadas</span>
 <strong className="text-base font-mono font-black text-theme-main">
 {line.expectedQuantity}
 </strong>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Recibidas</span>
 <strong className="text-base font-mono font-black text-emerald-600">
 {line.receivedQuantity}
 </strong>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Pendientes</span>
 <strong className={`text-base font-mono font-black ${
 line.pendingQuantity === 0 ? 'text-emerald-600' : 'text-amber-600'
 }`}>
 {line.pendingQuantity}
 </strong>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* SERIALIZED RECEIPT SCANNER STATION */}
 {/* ========================================================================= */}
 {isSerialized ? (
 <div className="space-y-4">
 
 {/* Animated HUD Optical Scanner Viewport */}
 <div className="relative w-full aspect-video sm:aspect-21/9 max-h-52 bg-zinc-950 rounded-3xl border-2 border-zinc-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
 
 {/* Ambient Grid Background */}
 <div 
 className="absolute inset-0 opacity-15 pointer-events-none"
 style={{
 backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
 backgroundSize: '16px 16px',
 }}
 />

 {/* Laser Scanner Beam */}
 <div 
 className={`absolute left-4 right-4 h-0.5 pointer-events-none transition-opacity ${
 scanStatus === 'error'
 ? 'bg-theme-error shadow-[0_0_15px_var(--color-error)]'
 : scanStatus === 'success'
 ? 'bg-emerald-400 shadow-[0_0_15px_#34d399]'
 : 'bg-theme-primary shadow-[0_0_15px_var(--color-primary)]'
 }`}
 style={{
 animation: isScanning ? 'scanSweep 0.8s ease-in-out infinite alternate' : 'scanSweep 2.2s ease-in-out infinite alternate',
 }}
 />

 {/* Corner HUD Brackets */}
 <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-theme-primary rounded-tl-lg" />
 <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-theme-primary rounded-tr-lg" />
 <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-theme-primary rounded-bl-lg" />
 <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-theme-primary rounded-br-lg" />

 {/* Center Crosshairs */}
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
 </div>

 {/* Top Status */}
 <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-theme-primary animate-ping" />
 <span className="font-bold text-zinc-300">ESTACIÓN DE SERIALIZACIÓN ÓPTICA</span>
 </div>
 <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold">
 60 FPS
 </span>
 </div>

 {/* Bottom Payload Text */}
 <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
 <span className="text-[11px] font-mono text-zinc-300 truncate">
 Apuntar al código de barras o etiqueta del bulto entrante
 </span>
 {lastReceivedUnit && scanStatus === 'success' && (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
 <CheckCircle2 className="w-3 h-3" />
 <span>{lastReceivedUnit.uid}</span>
 </span>
 )}
 </div>
 </div>

 {/* Feedback Alert Banners */}
 {feedbackMessage && (
 <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150 bg-white text-zinc-900 shadow-2xs ${
 scanStatus === 'warning'
 ? 'border-amber-500'
 : 'border-rose-500'
 }`}>
 <div className="flex items-center gap-2 min-w-0">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <p className="text-[11px] font-bold leading-relaxed">{feedbackMessage}</p>
 </div>
 <button onClick={() => setFeedbackMessage(null)} className="font-bold cursor-pointer shrink-0">
 <X className="w-4 h-4" />
 </button>
 </div>
 )}

 {/* Success Unit Banner with Sticker Actions */}
 {lastReceivedUnit && scanStatus === 'success' && (
 <div className="p-4 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 text-xs text-zinc-900">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <strong className="font-black text-sm text-zinc-900">
 ✓ Unidad recibida y serializada
 </strong>
 </div>
 <div className="font-mono text-xs font-bold text-zinc-900">
 UID: <span className="underline">{lastReceivedUnit.uid}</span> &middot; Estado: <span className="font-semibold">Pendiente de acomodo</span>
 </div>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <button
 type="button"
 onClick={() => setPreviewStickerUnit(lastReceivedUnit)}
 className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1.5"
 >
 <Tag className="w-3.5 h-3.5 text-theme-primary" />
 <span>Ver sticker</span>
 </button>

 <button
 type="button"
 onClick={() => setPreviewStickerUnit(lastReceivedUnit)}
 className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir</span>
 </button>
 </div>
 </div>
 )}

 {/* Main Scanning Action Buttons */}
 <div className="space-y-2">
 <button
 type="button"
 disabled={isScanning || line.pendingQuantity === 0}
 onClick={handleSimulatePieceScan}
 className="w-full py-3.5 px-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 <Scan className="w-5 h-5" />
 <span>
 {line.pendingQuantity === 0
 ? '✓ Partida completada al 100%'
 : `Simular escaneo / recibir pieza (${line.receivedQuantity + 1} de ${line.expectedQuantity})`}
 </span>
 </button>

 {/* Secondary Simulation Buttons */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
 <button
 type="button"
 disabled={isScanning}
 onClick={handleSimulateIncorrectItem}
 className="py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 <span>Simular artículo incorrecto</span>
 </button>

 <button
 type="button"
 disabled={isScanning || line.receivedUnits.length === 0}
 onClick={handleSimulateDuplicateUid}
 className="py-2 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
 >
 <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
 <span>Simular UID duplicado</span>
 </button>
 </div>
 </div>
 </div>
 ) : (
 /* ========================================================================= */
 /* NON-SERIALIZED BULK RECEIPT (ALMOHADAS / PROTECTORES) */
 /* ========================================================================= */
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-4 shadow-xs">
 <div className="space-y-1">
 <h4 className="text-xs font-extrabold text-theme-main">
 Recepción por Cantidad (Artículo no serializado)
 </h4>
 <p className="text-[11px] text-theme-muted">
 Este artículo no requiere generación de UID individual por unidad. Ingresa la cantidad recibida físicamente.
 </p>
 </div>

 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2">
 <span className="font-bold text-xs text-theme-main">Recibir:</span>
 <input
 type="number"
 min={1}
 max={line.pendingQuantity}
 value={bulkQuantityInput}
 onChange={(e) => setBulkQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
 className="w-24 bg-theme-muted border border-theme-subtle rounded-xl py-2 px-3 text-center text-xs font-mono font-black text-theme-main focus:outline-none focus:border-theme-primary"
 />
 <span className="text-xs text-theme-muted">unidades</span>
 </div>

 <button
 type="button"
 onClick={handleReceiveBulkQuantity}
 className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Confirmar recepción ({bulkQuantityInput} u.)</span>
 </button>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* LIST OF RECEIVED SERIALIZED UNITS IN THIS LINE */}
 {/* ========================================================================= */}
 {isSerialized && (
 <div className="space-y-2 pt-2 border-t border-theme-subtle">
 <div className="flex items-center justify-between text-xs">
 <span className="font-extrabold text-theme-main uppercase tracking-wider text-[10px]">
 Unidades serializadas recibidas ({line.receivedUnits.length}):
 </span>
 <span className="font-mono text-[10px] text-theme-muted font-bold">
 Ubicación actual: {order.receivingAreaCode} (Pendiente de acomodo)
 </span>
 </div>

 {line.receivedUnits.length === 0 ? (
 <div className="p-6 rounded-2xl border-2 border-dashed border-theme-subtle text-center text-theme-muted text-xs">
 No has recibido ninguna unidad aún en esta partida. Inicia el escaneo arriba.
 </div>
 ) : (
 <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
 {line.receivedUnits.map((unit, idx) => (
 <div
 key={unit.uid}
 className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle flex items-center justify-between gap-3 text-xs shadow-2xs"
 >
 <div className="flex items-center gap-2.5 min-w-0">
 <span className="w-5 h-5 rounded-full bg-theme-primary-light text-theme-primary font-bold text-[10px] flex items-center justify-center shrink-0">
 {idx + 1}
 </span>
 <div className="min-w-0">
 <span className="font-mono font-black text-theme-primary block truncate">{unit.uid}</span>
 <span className="text-[10px] text-theme-muted font-mono">{unit.lotNumber} &middot; {unit.receivedAt}</span>
 </div>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {unit.status}
 </span>

 <button
 type="button"
 onClick={() => setPreviewStickerUnit(unit)}
 className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-muted rounded-xl transition-colors cursor-pointer"
 title="Ver e imprimir sticker QR"
 >
 <QrCode className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted font-mono text-[11px]">
 Partida {line.receivedQuantity >= line.expectedQuantity ? '✓ Completa' : `${line.pendingQuantity} pendientes`}
 </span>

 <button
 onClick={onClose}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md cursor-pointer"
 >
 Aceptar y volver al detalle
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* Embedded Sticker Preview Modal */}
 {previewStickerUnit && (
 <ReceiptStickerModal
 unit={previewStickerUnit}
 warehouseName={order.destinationWarehouseName}
 onClose={() => setPreviewStickerUnit(null)}
 onPrintSuccess={() => {
 if (onShowToast) {
 onShowToast(`✓ Sticker para ${previewStickerUnit.uid} enviado a cola de impresión.`);
 }
 setPreviewStickerUnit(null);
 }}
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
