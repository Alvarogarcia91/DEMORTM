import React, { useState } from 'react';
import { 
 ArrowLeft, 
 Building2, 
 Calendar, 
 Truck, 
 CheckCircle2, 
 Clock, 
 Layers, 
 AlertTriangle, 
 Boxes, 
 Tag, 
 Scan, 
 Sparkles, 
 PackageCheck, 
 Send,
 Eye,
 FileText,
 User,
 QrCode,
 ExternalLink,
 ShoppingCart
} from 'lucide-react';
import { InboundReceiptLine, InboundReceiptOrder, ReceivedUnitRecord } from '../../../data/mockInboundData';
import { ReceiptItemScanStationModal } from './ReceiptItemScanStationModal';
import { ReceiptStickerModal } from './ReceiptStickerModal';

interface ReceiptOrderDetailViewProps {
 order: InboundReceiptOrder;
 onBack: () => void;
 onUpdateOrder: (updatedOrder: InboundReceiptOrder) => void;
 onNavigateToPurchaseOrder?: (orderFolio: string) => void;
 onShowToast?: (msg: string) => void;
 onNavigateToPutaway?: () => void;
}

export const ReceiptOrderDetailView: React.FC<ReceiptOrderDetailViewProps> = ({
 order,
 onBack,
 onUpdateOrder,
 onNavigateToPurchaseOrder,
 onShowToast,
 onNavigateToPutaway,
}) => {
 const [activeLineForScanning, setActiveLineForScanning] = useState<InboundReceiptLine | null>(null);
 const [previewStickerUnit, setPreviewStickerUnit] = useState<ReceivedUnitRecord | null>(null);
 const [isPutawaySent, setIsPutawaySent] = useState<boolean>(false);

 // Recalculate totals
 const totalExpected = order.lines.reduce((s, l) => s + l.expectedQuantity, 0);
 const totalReceived = order.lines.reduce((s, l) => s + l.receivedQuantity, 0);
 const totalPending = order.lines.reduce((s, l) => s + l.pendingQuantity, 0);
 const isOrderFullyReceived = totalPending === 0 && totalReceived > 0;

 // Handle updating a single line from the scan station
 const handleUpdateLine = (updatedLine: InboundReceiptLine) => {
 const updatedLines = order.lines.map((l) => (l.id === updatedLine.id ? updatedLine : l));
 const newTotalReceived = updatedLines.reduce((s, l) => s + l.receivedQuantity, 0);
 const newTotalPending = updatedLines.reduce((s, l) => s + l.pendingQuantity, 0);
 
 const newStatus: InboundReceiptOrder['status'] =
 newTotalPending === 0
 ? 'Completa'
 : newTotalReceived > 0
 ? 'Parcial'
 : 'Pendiente';

 const updatedOrder: InboundReceiptOrder = {
 ...order,
 status: newStatus,
 totalReceivedUnits: newTotalReceived,
 totalPendingUnits: newTotalPending,
 completedAt: newTotalPending === 0 ? '27 Ago 2026, 18:45' : undefined,
 lines: updatedLines,
 };

 onUpdateOrder(updatedOrder);
 setActiveLineForScanning(updatedLine);
 };

 // Handle Send to Putaway CTA
 const handleSendToPutaway = () => {
 setIsPutawaySent(true);
 if (onShowToast) {
 onShowToast(
 `✓ ${totalReceived} unidades listas en ${order.receivingAreaCode}. Disponibles para generar órdenes de Acomodo.`
 );
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Header with Back Button and Quick Actions */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <button
 onClick={onBack}
 className="p-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-colors cursor-pointer"
 title="Volver a lista"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>

 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-xs font-bold uppercase tracking-wider text-theme-muted">
 Recepción de Compra:
 </span>
 <span className="font-mono text-base font-black text-theme-primary">
 {order.folio}
 </span>
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 order.status === 'Completa'
 ? 'border-emerald-600 '
 : order.status === 'En recepción'
 ? 'border-blue-500'
 : order.status === 'Parcial'
 ? 'border-amber-500'
 : 'border-zinc-400 '
 }`}>
 {order.status === 'Completa' ? 'Recibida al 100%' : order.status === 'Parcial' ? 'Parcialmente recibida' : order.status}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 {order.originName} &rarr; {order.destinationWarehouseName}
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 {onNavigateToPurchaseOrder && (
 <button
 type="button"
 onClick={() => onNavigateToPurchaseOrder(order.folio)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 title="Abrir la Orden de Compra en el módulo Compras"
 >
 <ShoppingCart className="w-3.5 h-3.5 text-theme-primary" />
 <span>Ver orden de compra</span>
 <ExternalLink className="w-3 h-3 text-theme-muted" />
 </button>
 )}
 </div>
 </div>

 {/* Metadata Strip */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
 <div>
 <span className="text-[10px] uppercase font-bold block">Proveedor:</span>
 <strong className="text-theme-main font-semibold">{order.originName}</strong>
 {order.supplierRfc && (
 <span className="text-[10px] text-theme-muted font-mono block">{order.supplierRfc}</span>
 )}
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Destino de Entrega:</span>
 <strong className="text-theme-main font-semibold">{order.destinationWarehouseName}</strong>
 <span className="text-[10px] text-theme-primary font-mono font-bold block">Rampa {order.receivingAreaCode}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Fecha Esperada:</span>
 <strong className="text-theme-main font-semibold font-mono">{order.expectedDate}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Referencia Requisición:</span>
 <strong className="text-theme-main font-semibold font-mono">
 {order.referenceFolio || 'Sin requisición'}
 </strong>
 </div>
 </div>
 </div>

 {/* Progress & Operational Counters Bar */}
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1">
 <Boxes className="w-3.5 h-3.5 text-theme-primary" />
 Total Ordenado
 </span>
 <p className="text-xl font-extrabold text-theme-main font-mono">
 {totalExpected} <span className="text-xs font-normal text-theme-muted">u.</span>
 </p>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" />
 Recibidas Físicamente
 </span>
 <p className="text-xl font-extrabold text-emerald-600 font-mono">
 {totalReceived} <span className="text-xs font-normal text-emerald-700">u.</span>
 </p>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1">
 <Clock className="w-3.5 h-3.5" />
 Pendientes por Recibir
 </span>
 <p className="text-xl font-extrabold text-amber-600 font-mono">
 {totalPending} <span className="text-xs font-normal text-amber-700">u.</span>
 </p>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1">
 <Tag className="w-3.5 h-3.5 text-purple-600" />
 Progreso de Recepción
 </span>
 <p className="text-xl font-extrabold text-purple-600 font-mono">
 {totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0}%
 </p>
 </div>
 </div>

 {/* Lines to Receive Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs space-y-3 p-5">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-theme-subtle">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Partidas de la Orden de Compra para Validación
 </h3>
 <p className="text-xs text-theme-muted">
 Escanea cada colchón al descargar para emitir su sticker individual con UID y Código QR.
 </p>
 </div>
 {isOrderFullyReceived && !isPutawaySent && (
 <button
 onClick={handleSendToPutaway}
 className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
 >
 <PackageCheck className="w-4 h-4" />
 <span>Cerrar recepción y enviar a Acomodo</span>
 </button>
 )}
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo Impresos RTM</th>
 <th className="py-2.5 px-3 text-center">Ordenado</th>
 <th className="py-2.5 px-3 text-center">Recibido</th>
 <th className="py-2.5 px-3 text-center">Pendiente</th>
 <th className="py-2.5 px-3">Unidad</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-3 text-right">Acción de Mesa</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {order.lines.map((line) => {
 const isLineComplete = line.pendingQuantity === 0 && line.receivedQuantity > 0;

 return (
 <tr key={line.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* SKU */}
 <td className="py-3.5 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {line.sku}
 </td>

 {/* Article Details */}
 <td className="py-3.5 px-3">
 <div className="space-y-0.5">
 <strong className="text-theme-main font-bold block text-xs">
 {line.productName}
 </strong>
 <div className="flex items-center gap-2 text-[11px] text-theme-muted">
 <span>{line.brand}</span>
 <span>&bull;</span>
 <span>{line.size}</span>
 <span>&bull;</span>
 <span className="font-mono text-[10px] bg-theme-muted px-1.5 py-0.2 rounded">
 {line.serialization}
 </span>
 </div>
 </div>
 </td>

 {/* Ordenado */}
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {line.expectedQuantity}
 </td>

 {/* Recibido */}
 <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">
 {line.receivedQuantity}
 </td>

 {/* Pendiente */}
 <td className="py-3.5 px-3 text-center font-mono font-black text-amber-600 whitespace-nowrap">
 {line.pendingQuantity}
 </td>

 {/* Unidad */}
 <td className="py-3.5 px-3 text-theme-muted font-medium whitespace-nowrap">
 Colchón
 </td>

 {/* Line Status */}
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 isLineComplete
 ? 'border-emerald-600 '
 : line.receivedQuantity > 0
 ? 'border-blue-500'
 : 'border-zinc-400 '
 }`}>
 {isLineComplete ? 'Completo' : line.receivedQuantity > 0 ? 'En proceso' : 'Pendiente'}
 </span>
 </td>

 {/* Scan / Receive CTA */}
 <td className="py-3.5 px-3 text-right whitespace-nowrap">
 <button
 type="button"
 onClick={() => setActiveLineForScanning(line)}
 className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer ${
 isLineComplete
 ? 'bg-theme-muted text-theme-main hover:bg-theme-subtle border border-theme-subtle'
 : 'bg-theme-primary hover:bg-theme-primary-hover text-white'
 }`}
 >
 <Scan className="w-3.5 h-3.5" />
 <span>{isLineComplete ? 'Ver UIDs / Agregar' : 'Escanear / Recibir'}</span>
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* Scanner Station Modal */}
 {activeLineForScanning && (
 <ReceiptItemScanStationModal
 order={order}
 line={activeLineForScanning}
 onClose={() => setActiveLineForScanning(null)}
 onUpdateLine={handleUpdateLine}
 onShowToast={onShowToast}
 />
 )}

 {/* Individual Sticker Preview Modal */}
 {previewStickerUnit && (
 <ReceiptStickerModal
 unit={previewStickerUnit}
 onClose={() => setPreviewStickerUnit(null)}
 onPrintSuccess={() => {
 if (onShowToast) {
 onShowToast(`✓ Enviado comando de impresión ZPL para ${previewStickerUnit.uid}`);
 }
 }}
 />
 )}

 </div>
 );
};
