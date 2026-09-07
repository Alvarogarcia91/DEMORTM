import React, { useState } from 'react';
import {
 X,
 Calendar,
 Building2,
 Truck,
 FileText,
 User,
 Clock,
 CheckCircle2,
 AlertTriangle,
 Send,
 XCircle,
 History,
 Boxes,
 ArrowRight,
 ShieldCheck,
 Check,
 PackageCheck,
 DollarSign
} from 'lucide-react';
import {
 PurchaseOrder,
 PurchaseOrderStatus,
 PurchaseOrderTimelineEntry
} from '../../../data/mockPurchasesOrdersData';
import { PurchaseOrderStatusBadge } from './PurchaseOrderStatusBadge';
import { ModalPortal } from '../../common/ModalPortal';

interface PurchaseOrderDetailModalProps {
 order: PurchaseOrder;
 onClose: () => void;
 onUpdateOrder: (updated: PurchaseOrder) => void;
 onNavigateToInboundReceipts?: (orderFolio: string) => void;
}

export const PurchaseOrderDetailModal: React.FC<PurchaseOrderDetailModalProps> = ({
 order,
 onClose,
 onUpdateOrder,
 onNavigateToInboundReceipts,
}) => {
 const [activeTab, setActiveTab] = useState<'resumen' | 'partidas' | 'seguimiento' | 'recepciones'>('resumen');

 // Status update modal state
 const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
 const [newStatus, setNewStatus] = useState<PurchaseOrderStatus>(order.status);
 const [statusNote, setStatusNote] = useState('');

 // Cancellation modal state
 const [cancelModalOpen, setCancelModalOpen] = useState(false);
 const [cancellationReason, setCancellationReason] = useState('');

 // Calculate units
 const totalOrdered = order.items.reduce((acc, i) => acc + i.orderedQuantity, 0);
 const totalReceived = order.items.reduce((acc, i) => acc + i.receivedQuantity, 0);
 const totalPending = order.items.reduce((acc, i) => acc + i.pendingQuantity, 0);
 const receiptProgress = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;

 // Emit Purchase Order Action
 const handleEmitOrder = () => {
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 const timelineEntry: PurchaseOrderTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: 'Emitió formalmente la Orden de Compra al proveedor',
 type: 'emitted',
 };

 const updated: PurchaseOrder = {
 ...order,
 status: 'Emitida',
 emissionDate: '27 Ago 2026',
 timeline: [timelineEntry, ...order.timeline],
 };

 onUpdateOrder(updated);
 };

 // Update Status / Tracking Action
 const handleConfirmStatusUpdate = () => {
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 const timelineEntry: PurchaseOrderTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Seguimiento de Compras',
 action: `Actualizó el estado a "${newStatus}"`,
 comment: statusNote.trim() || undefined,
 type: 'updated',
 };

 const updated: PurchaseOrder = {
 ...order,
 status: newStatus,
 timeline: [timelineEntry, ...order.timeline],
 };

 onUpdateOrder(updated);
 setStatusUpdateOpen(false);
 setStatusNote('');
 };

 // Cancel Order Action
 const handleConfirmCancellation = () => {
 if (!cancellationReason.trim()) return;

 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 const timelineEntry: PurchaseOrderTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: 'Canceló la Orden de Compra',
 comment: cancellationReason.trim(),
 type: 'cancelled',
 };

 const updated: PurchaseOrder = {
 ...order,
 status: 'Cancelada',
 cancellationReason: cancellationReason.trim(),
 timeline: [timelineEntry, ...order.timeline],
 };

 onUpdateOrder(updated);
 setCancelModalOpen(false);
 };

 const tabs = [
 { id: 'resumen' as const, label: 'Resumen' },
 { id: 'partidas' as const, label: `Partidas (${order.items.length})` },
 { id: 'seguimiento' as const, label: `Seguimiento (${order.timeline.length})` },
 { id: 'recepciones' as const, label: 'Recepciones' },
 ];

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-5xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5 flex-wrap">
 <h2 className="text-base font-black text-theme-main font-mono">
 {order.folio}
 </h2>
 <PurchaseOrderStatusBadge status={order.status} delayDays={order.delayDays} size="md" />
 <span className="text-xs font-bold text-theme-muted">
 &bull; {order.supplierTradeName}
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Destino: <strong className="text-theme-main">{order.targetWarehouseName}</strong> &bull; Total: <strong className="text-theme-main font-mono">${order.total.toLocaleString('es-MX')} MXN</strong>
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Tab Switcher */}
 <div className="px-6 py-2.5 bg-theme-muted/40 border-b border-theme-subtle flex items-center gap-1.5 overflow-x-auto">
 {tabs.map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => setActiveTab(t.id)}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 activeTab === t.id
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/80'
 }`}
 >
 {t.label}
 </button>
 ))}
 </div>

 {/* Body Content */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1">
 
 {/* ========================================================================= */}
 {/* TAB 1: RESUMEN */}
 {/* ========================================================================= */}
 {activeTab === 'resumen' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* Status Notice if Delayed */}
 {order.status === 'Atrasada' && (
 <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
 <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
 <div>
 <strong className="font-bold block">Orden con retraso de entrega ({order.delayDays || 2} días)</strong>
 <span>La fecha de entrega acordada era el {order.expectedDeliveryDate}. Se recomienda dar seguimiento directo con {order.contactName}.</span>
 </div>
 </div>
 )}

 {/* Cancellation Notice */}
 {order.status === 'Cancelada' && order.cancellationReason && (
 <div className="p-4 rounded-2xl bg-zinc-500/10 border border-zinc-500/30 space-y-1 text-xs">
 <span className="text-[10px] uppercase font-black tracking-wider text-rose-600 flex items-center gap-1">
 <XCircle className="w-3.5 h-3.5" />
 Motivo de Cancelación
 </span>
 <p className="text-theme-main italic font-semibold">{order.cancellationReason}</p>
 </div>
 )}

 {/* Commercial Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Truck className="w-3 h-3 text-theme-primary" />
 Proveedor
 </span>
 <strong className="text-theme-main font-bold block truncate" title={order.supplierName}>
 {order.supplierTradeName}
 </strong>
 <span className="text-[10px] font-mono text-theme-muted block">{order.supplierRfc}</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Building2 className="w-3 h-3 text-blue-600" />
 Destino
 </span>
 <strong className="text-theme-main font-bold block truncate">
 {order.targetWarehouseName}
 </strong>
 <span className="text-[10px] text-theme-muted block">({order.targetWarehouseType})</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Calendar className="w-3 h-3 text-purple-600" />
 Fecha Esperada
 </span>
 <strong className="text-theme-main font-mono font-bold block">
 {order.expectedDeliveryDate}
 </strong>
 <span className="text-[10px] text-theme-muted block">Emisión: {order.emissionDate || 'Borrador'}</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <DollarSign className="w-3 h-3 text-emerald-600" />
 Condición de Pago
 </span>
 <strong className="text-theme-main font-bold block">
 {order.paymentCondition} ({order.creditDays} días)
 </strong>
 <span className="text-[10px] text-theme-muted block">Moneda: {order.currency}</span>
 </div>
 </div>

 {/* Reference Requisition & Notes */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Requisición de Origen:</span>
 <strong className="font-mono text-sm text-theme-primary font-black block">
 {order.requisitionFolio || 'Sin referencia'}
 </strong>
 <span className="text-[11px] text-theme-muted">
 Partidas consolidadas y autorizadas previamente por compras.
 </span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Contacto Comercial:</span>
 <strong className="text-xs font-bold text-theme-main block">
 {order.contactName}
 </strong>
 <span className="text-[11px] text-theme-muted block">
 {order.notes || 'Sin notas adicionales para esta orden.'}
 </span>
 </div>
 </div>

 {/* Totals Summary */}
 <div className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="space-y-1 text-xs text-theme-muted">
 <span className="font-bold text-theme-main block">Resumen Económico de la Orden</span>
 <span>Importes calculados con IVA desglosado (16%).</span>
 </div>

 <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
 <div className="flex justify-between text-theme-muted">
 <span>Subtotal:</span>
 <strong className="text-theme-main">${order.subtotal.toLocaleString('es-MX')}</strong>
 </div>
 <div className="flex justify-between text-theme-muted">
 <span>IVA (16%):</span>
 <strong className="text-theme-main">${order.tax.toLocaleString('es-MX')}</strong>
 </div>
 <div className="flex justify-between text-sm font-black text-theme-main pt-1.5 border-t border-theme-subtle">
 <span>Total:</span>
 <strong className="text-theme-primary font-extrabold text-base">${order.total.toLocaleString('es-MX')} MXN</strong>
 </div>
 </div>
 </div>

 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 2: PARTIDAS */}
 {/* ========================================================================= */}
 {activeTab === 'partidas' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 
 {/* Progress Bar of Reception */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between text-xs">
 <span className="font-bold text-theme-main">Progreso Global de Recepción</span>
 <span className="font-mono font-black text-rose-600">{totalReceived} de {totalOrdered} unidades ({receiptProgress}%)</span>
 </div>
 <div className="w-full h-2 rounded-full bg-theme-subtle overflow-hidden">
 <div
 className="h-full bg-emerald-600 rounded-full transition-all duration-300"
 style={{ width: `${receiptProgress}%` }}
 />
 </div>
 </div>

 <div className="border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo / Descripción</th>
 <th className="py-2.5 px-3 text-center">Ordenado</th>
 <th className="py-2.5 px-3 text-center">Recibido</th>
 <th className="py-2.5 px-3 text-center">Pendiente</th>
 <th className="py-2.5 px-3">Precio Unitario</th>
 <th className="py-2.5 px-3 text-right">Subtotal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {order.items.map((item) => (
 <tr key={item.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {item.sku}
 </td>
 <td className="py-3 px-3">
 <div className="space-y-0.5">
 <span className="font-bold text-theme-main block text-xs">{item.name}</span>
 <span className="text-[10px] text-theme-muted block">{item.brand} &bull; {item.size}</span>
 </div>
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {item.orderedQuantity} {item.unit}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">
 {item.receivedQuantity}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-rose-600 whitespace-nowrap">
 {item.pendingQuantity}
 </td>
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 ${item.unitPrice.toLocaleString('es-MX')}
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 ${item.subtotal.toLocaleString('es-MX')}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 3: SEGUIMIENTO (TIMELINE) */}
 {/* ========================================================================= */}
 {activeTab === 'seguimiento' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
 <History className="w-3.5 h-3.5 text-theme-primary" />
 Bitácora de Trazabilidad & Logística
 </h3>

 {order.status !== 'Cancelada' && order.status !== 'Recibida' && (
 <button
 type="button"
 onClick={() => {
 setNewStatus(order.status);
 setStatusUpdateOpen(true);
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1.5 cursor-pointer"
 >
 <Clock className="w-3.5 h-3.5 text-theme-primary" />
 <span>Actualizar seguimiento</span>
 </button>
 )}
 </div>

 <div className="space-y-2.5">
 {order.timeline.map((entry) => (
 <div
 key={entry.id}
 className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
 >
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <strong className="text-theme-main font-bold">{entry.actor}</strong>
 <span className="text-[10px] text-theme-muted px-1.5 py-0.2 rounded bg-theme-muted border border-theme-subtle">
 {entry.role}
 </span>
 </div>
 <p className="text-theme-main">{entry.action}</p>
 {entry.comment && (
 <p className="text-[11px] text-theme-muted italic bg-theme-surface p-2 rounded-xl border border-theme-subtle mt-1">
 &ldquo;{entry.comment}&rdquo;
 </p>
 )}
 </div>

 <span className="text-[10px] font-mono text-theme-muted shrink-0">
 {entry.occurredAt}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 4: RECEPCIONES */}
 {/* ========================================================================= */}
 {activeTab === 'recepciones' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 {order.targetWarehouseType === 'CEDIS' ? (
 <div className="p-5 rounded-3xl bg-white border border-emerald-600/40 /50 shadow-2xs space-y-4">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="flex items-center gap-2 text-zinc-900">
 <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0" />
 <div>
 <strong className="text-xs font-black uppercase tracking-wider block">
 Recepción en Mesa de Verificación (CEDIS)
 </strong>
 <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block font-medium">
 Destino: {order.targetWarehouseName} &bull; Folio de referencia: {order.folio}
 </span>
 </div>
 </div>

 <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-white text-zinc-900 border shadow-2xs ${
 order.status === 'Recibida'
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {order.status === 'Recibida' ? 'Completamente recibida' : `${totalPending} unidades por recibir`}
 </span>
 </div>

 <p className="text-xs text-theme-muted leading-relaxed">
 Al arribar el transporte del fabricante al CEDIS, el operador de la Mesa de Verificación validará las partidas contra este folio <strong>{order.folio}</strong> y generará los identificadores individuales (QR) por cada colchón descargado.
 </p>

 <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between flex-wrap gap-2 text-xs">
 <span className="text-theme-muted font-mono">
 Estado operativo: <strong>{order.status === 'Recibida' ? 'Cerrada' : 'Disponible en Entradas'}</strong>
 </span>

 {onNavigateToInboundReceipts && (
 <button
 type="button"
 onClick={() => {
 onClose();
 onNavigateToInboundReceipts(order.folio);
 }}
 className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <span>Ver en Entradas (Mesa de Verificación)</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 </div>
 ) : (
 <div className="p-5 rounded-3xl bg-white border border-blue-500 shadow-2xs space-y-3">
 <div className="flex items-center gap-2 text-zinc-900">
 <Building2 className="w-5 h-5 text-blue-600" />
 <strong className="text-xs font-black uppercase tracking-wider">
 Entrega Directa a Sucursal ({order.targetWarehouseName})
 </strong>
 </div>
 <p className="text-xs text-theme-muted leading-relaxed">
 Esta orden de compra tiene como destino una sucursal de Impresos RTM. La entrega física y recepción se realiza directamente en tienda sin pasar por la Mesa de Verificación de los CEDIS.
 </p>
 </div>
 )}
 </div>
 )}

 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle w-full sm:w-auto"
 >
 Cerrar
 </button>

 <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
 
 {/* Cancel Button */}
 {order.status !== 'Cancelada' && order.status !== 'Recibida' && totalReceived === 0 && (
 <button
 type="button"
 onClick={() => setCancelModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
 >
 <XCircle className="w-3.5 h-3.5" />
 <span>Cancelar orden</span>
 </button>
 )}

 {/* Emit Order Button if Draft */}
 {order.status === 'Borrador' && (
 <button
 type="button"
 onClick={handleEmitOrder}
 className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Send className="w-4 h-4" />
 <span>Emitir orden</span>
 </button>
 )}

 {/* Status Update Button */}
 {order.status !== 'Borrador' && order.status !== 'Cancelada' && order.status !== 'Recibida' && (
 <button
 type="button"
 onClick={() => {
 setNewStatus(order.status);
 setStatusUpdateOpen(true);
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Clock className="w-3.5 h-3.5" />
 <span>Actualizar seguimiento</span>
 </button>
 )}

 </div>
 </div>

 </div>
 </ModalPortal>

 {/* Modal for Status Tracking Update */}
 {statusUpdateOpen && (
 <ModalPortal onClose={() => setStatusUpdateOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center gap-2 text-theme-primary">
 <Clock className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Actualizar Estado de Seguimiento</h3>
 </div>
 <p className="text-xs text-theme-muted">
 Registra el nuevo estado reportado por el proveedor o transportista:
 </p>
 
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted">Nuevo Estado:</label>
 <select
 value={newStatus}
 onChange={(e) => setNewStatus(e.target.value as PurchaseOrderStatus)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="Confirmada por proveedor">Confirmada por proveedor</option>
 <option value="En tránsito">En tránsito</option>
 <option value="Parcialmente recibida">Parcialmente recibida</option>
 <option value="Recibida">Recibida</option>
 <option value="Atrasada">Atrasada</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted">Nota o comentario de seguimiento (Opcional):</label>
 <textarea
 rows={2}
 value={statusNote}
 onChange={(e) => setStatusNote(e.target.value)}
 placeholder="Ej. Proveedor confirmó salida de planta Monterrey..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-3 text-xs text-theme-main focus:outline-none resize-none"
 />
 </div>

 <div className="flex items-center justify-end gap-2 text-xs pt-2">
 <button
 onClick={() => setStatusUpdateOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleConfirmStatusUpdate}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Guardar actualización
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Modal for Order Cancellation */}
 {cancelModalOpen && (
 <ModalPortal onClose={() => setCancelModalOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center gap-2 text-rose-600">
 <XCircle className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Cancelar Orden de Compra</h3>
 </div>
 <p className="text-xs text-theme-muted">
 Indica el motivo por el cual se cancela esta orden de compra con el proveedor:
 </p>
 <textarea
 rows={3}
 value={cancellationReason}
 onChange={(e) => setCancellationReason(e.target.value)}
 placeholder="Ej. Cancelación acordada con proveedor por desabasto de tela..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-3 text-xs text-theme-main focus:outline-none resize-none"
 />
 <div className="flex items-center justify-end gap-2 text-xs pt-2">
 <button
 onClick={() => setCancelModalOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Volver
 </button>
 <button
 onClick={handleConfirmCancellation}
 disabled={!cancellationReason.trim()}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer disabled:opacity-50"
 >
 Confirmar cancelación
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </>
 );
};
