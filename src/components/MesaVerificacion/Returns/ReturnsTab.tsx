import React, { useState, useEffect } from 'react';
import { 
 RotateCcw, 
 Clock, 
 CheckCircle2, 
 Wrench, 
 Boxes, 
 Plus, 
 ArrowRightLeft, 
 AlertTriangle, 
 Sparkles, 
 Building2 
} from 'lucide-react';
import { 
 INITIAL_RETURN_ORDERS, 
 ReturnOrder, 
 ReturnItemRecord, 
 ReturnUnitCondition 
} from '../../../data/mockReturnsData';
import { PendingReturnsList } from './PendingReturnsList';
import { ReturnOrdersList } from './ReturnOrdersList';
import { ReturnCreateModal } from './ReturnCreateModal';
import { ReturnScanStationModal } from './ReturnScanStationModal';
import { ReturnOrderDetailView } from './ReturnOrderDetailView';
import { ReturnCancelModal } from './ReturnCancelModal';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

interface ReturnsTabProps {
 onNavigateToPutaway?: () => void;
 onNavigateToIncidents?: (incidentRef?: string) => void;
}

export const ReturnsTab: React.FC<ReturnsTabProps> = ({
 onNavigateToPutaway,
 onNavigateToIncidents,
}) => {
 const { selectedCedisId, selectedCedis } = useVerificationDeskCedis();
 const [orders, setOrders] = useState<ReturnOrder[]>(INITIAL_RETURN_ORDERS);
 const [activeSubtab, setActiveSubtab] = useState<'pending' | 'history'>('pending');
 const [selectedOrder, setSelectedOrder] = useState<ReturnOrder | null>(null);

 // Scoped to global CEDIS
 const visibleOrders = orders.filter((o) => o.warehouseId === selectedCedisId);

 // Auto close detail if CEDIS changed
 useEffect(() => {
 if (selectedOrder && selectedOrder.warehouseId !== selectedCedisId) {
 setSelectedOrder(null);
 }
 }, [selectedCedisId, selectedOrder]);

 // Modals
 const [isCreateOpen, setIsCreateOpen] = useState(false);
 const [scanStationItem, setScanStationItem] = useState<{ order: ReturnOrder; item: ReturnItemRecord } | null>(null);
 const [cancelOrderModal, setCancelOrderModal] = useState<ReturnOrder | null>(null);

 // Success message toast
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 4000);
 };

 // KPIs scoped to selected CEDIS
 const pendingOrdersCount = visibleOrders.filter((o) => o.status === 'Pendiente' || o.status === 'En recepción' || o.status === 'Parcial').length;
 const pendingUnitsCount = visibleOrders
 .filter((o) => o.status === 'Pendiente' || o.status === 'En recepción' || o.status === 'Parcial')
 .reduce((acc, o) => acc + o.items.filter((i) => i.status === 'Pendiente').length, 0);

 const receivedCount = visibleOrders.reduce(
 (acc, o) => acc + o.items.filter((i) => i.status === 'Pendiente de acomodo' || i.status === 'En retrabajo' || i.status === 'Recibida').length,
 0
 );

 const inReworkCount = visibleOrders.reduce(
 (acc, o) => acc + o.items.filter((i) => i.status === 'En retrabajo' || i.confirmedDestination === 'RET-NORTE' || i.confirmedDestination === 'RET-SUR').length,
 0
 );

 const inPutawayPendingCount = visibleOrders.reduce(
 (acc, o) => acc + o.items.filter((i) => i.status === 'Pendiente de acomodo' || i.confirmedDestination === 'REC-DEV-01').length,
 0
 );

 // Handler: Create Order
 const handleCreateOrder = (newOrder: ReturnOrder) => {
 setOrders((prev) => [newOrder, ...prev]);
 setIsCreateOpen(false);
 showToast(`✓ Solicitud ${newOrder.folio} creada exitosamente.`);
 };

 // Handler: Confirm Item Return in Station
 const handleConfirmItemReturn = (
 updatedItem: ReturnItemRecord,
 condition: ReturnUnitCondition,
 confirmedLocation: string
 ) => {
 if (!scanStationItem) return;

 const { order } = scanStationItem;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const updatedItems = order.items.map((it) => (it.id === updatedItem.id ? updatedItem : it));
 const allReceived = updatedItems.every((it) => it.status !== 'Pendiente');
 const newOrderStatus = allReceived ? 'Completa' : 'Parcial';

 const newTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: dateStr,
 actor: 'Operador Mesa Verificación',
 message: `UID ${updatedItem.uid} recibido en ${condition}. Asentado en bahía ${confirmedLocation}.`,
 type: 'completed' as const,
 };

 const updatedOrder: ReturnOrder = {
 ...order,
 status: newOrderStatus,
 receivedAt: allReceived ? dateStr : order.receivedAt,
 items: updatedItems,
 timeline: [...order.timeline, newTimelineEntry],
 };

 setOrders((prev) => prev.map((o) => (o.id === order.id ? updatedOrder : o)));
 if (selectedOrder?.id === order.id) {
 setSelectedOrder(updatedOrder);
 }
 setScanStationItem(null);

 showToast(
 `✓ Unidad ${updatedItem.uid} recibida (${condition}) &rarr; ${confirmedLocation}`
 );
 };

 // Handler: Cancel Order
 const handleCancelOrder = (reason: string) => {
 if (!cancelOrderModal) return;

 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const updatedOrder: ReturnOrder = {
 ...cancelOrderModal,
 status: 'Cancelada',
 timeline: [
 ...cancelOrderModal.timeline,
 {
 id: `t-${Date.now()}`,
 occurredAt: dateStr,
 actor: 'Supervisor Mesa',
 message: `Orden cancelada. Motivo: ${reason}`,
 type: 'canceled',
 },
 ],
 };

 setOrders((prev) => prev.map((o) => (o.id === cancelOrderModal.id ? updatedOrder : o)));
 if (selectedOrder?.id === cancelOrderModal.id) {
 setSelectedOrder(updatedOrder);
 }
 setCancelOrderModal(null);
 showToast(`✓ Devolución ${cancelOrderModal.folio} cancelada.`);
 };

 return (
 <div className="space-y-6">
 
 {/* Toast Alert */}
 {toastMessage && (
 <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center justify-between animate-in fade-in duration-150">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 shrink-0" />
 <span dangerouslySetInnerHTML={{ __html: toastMessage }} />
 </div>
 <button
 onClick={() => setToastMessage(null)}
 className="text-white/80 hover:text-white text-xs font-mono"
 >
 ✕
 </button>
 </div>
 )}

 {/* Header & Subtabs */}
 {!selectedOrder && (
 <>
 {/* Subtab navigation */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setActiveSubtab('pending')}
 className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'pending'
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <Clock className="w-3.5 h-3.5" />
 <span>1. Por recibir</span>
 {pendingOrdersCount > 0 && (
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
 activeSubtab === 'pending' ? 'bg-white/20 text-white' : 'bg-theme-primary-light text-theme-primary'
 }`}>
 {pendingOrdersCount}
 </span>
 )}
 </button>

 <button
 type="button"
 onClick={() => setActiveSubtab('history')}
 className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'history'
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>2. Devoluciones</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
 activeSubtab === 'history' ? 'bg-white/20 text-white' : 'bg-theme-surface text-theme-muted'
 }`}>
 {orders.length}
 </span>
 </button>
 </div>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setIsCreateOpen(true)}
 className="px-4 py-2 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva devolución</span>
 </button>
 </div>
 </div>

 {/* 4 KPIs Summary Bar */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Por Recibir</span>
 <strong className="text-2xl font-mono font-black text-amber-600 block">{pendingOrdersCount}</strong>
 <span className="text-[10px] text-theme-muted">{pendingUnitsCount} unidades en tránsito</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Recibidas en CEDIS</span>
 <strong className="text-2xl font-mono font-black text-emerald-600 block">{receivedCount}</strong>
 <span className="text-[10px] text-emerald-600 font-bold">Con UID verificado</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">En Retrabajo (RET)</span>
 <strong className="text-2xl font-mono font-black text-rose-600 block">{inReworkCount}</strong>
 <span className="text-[10px] text-rose-600 font-bold">Empaque / daño físico</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Pendientes de Acomodo</span>
 <strong className="text-2xl font-mono font-black text-blue-600 block">{inPutawayPendingCount}</strong>
 <span className="text-[10px] text-blue-600 font-bold">En bahía REC-DEV-01</span>
 </div>
 </div>
 </>
 )}

 {/* Main View: Detail View vs List View */}
 {selectedOrder ? (
 <ReturnOrderDetailView
 order={selectedOrder}
 onBack={() => setSelectedOrder(null)}
 onOpenReceiveStation={(item) => setScanStationItem({ order: selectedOrder, item })}
 onOpenCancelModal={() => setCancelOrderModal(selectedOrder)}
 onReportIncident={(item) => {
 if (onNavigateToIncidents) {
 onNavigateToIncidents(item.uid);
 }
 }}
 />
 ) : activeSubtab === 'pending' ? (
 <PendingReturnsList
 orders={visibleOrders}
 onSelectOrder={(ord) => setSelectedOrder(ord)}
 onOpenCreateModal={() => setIsCreateOpen(true)}
 onOpenReceiveStation={(ord) => {
 const firstPending = ord.items.find((i) => i.status === 'Pendiente') || ord.items[0];
 setScanStationItem({ order: ord, item: firstPending });
 }}
 />
 ) : (
 <ReturnOrdersList
 orders={visibleOrders}
 onSelectOrder={(ord) => setSelectedOrder(ord)}
 />
 )}

 {/* Modals */}
 {isCreateOpen && (
 <ReturnCreateModal
 onClose={() => setIsCreateOpen(false)}
 onCreateOrder={handleCreateOrder}
 />
 )}

 {scanStationItem && (
 <ReturnScanStationModal
 order={scanStationItem.order}
 item={scanStationItem.item}
 onClose={() => setScanStationItem(null)}
 onConfirmItemReturn={handleConfirmItemReturn}
 />
 )}

 {cancelOrderModal && (
 <ReturnCancelModal
 order={cancelOrderModal}
 onClose={() => setCancelOrderModal(null)}
 onConfirmCancel={handleCancelOrder}
 />
 )}

 </div>
 );
};
