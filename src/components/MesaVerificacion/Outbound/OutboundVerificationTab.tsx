import React, { useState, useEffect } from 'react';
import { 
 PackageCheck, 
 ListChecks, 
 CheckCircle2, 
 ArrowUpRight 
} from 'lucide-react';
import { 
 PendingOutboundPickOrder, 
 OutboundVerificationOrder, 
 INITIAL_PENDING_OUTBOUND_ORDERS, 
 INITIAL_OUTBOUND_VERIFICATION_ORDERS 
} from '../../../data/mockOutboundVerificationData';
import { PendingOutboundList } from './PendingOutboundList';
import { OutboundVerificationOrderList } from './OutboundVerificationOrderList';
import { OutboundVerificationDetailView } from './OutboundVerificationDetailView';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

export const OutboundVerificationTab: React.FC = () => {
 const { selectedCedisId } = useVerificationDeskCedis();
 const [activeSubtab, setActiveSubtab] = useState<'pending' | 'orders'>('pending');
 const [pendingOrders, setPendingOrders] = useState<PendingOutboundPickOrder[]>(INITIAL_PENDING_OUTBOUND_ORDERS);
 const [orders, setOrders] = useState<OutboundVerificationOrder[]>(INITIAL_OUTBOUND_VERIFICATION_ORDERS);
 const [selectedOrder, setSelectedOrder] = useState<OutboundVerificationOrder | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Scoped to global CEDIS
 const visiblePendingOrders = pendingOrders.filter((p) => p.warehouseId === selectedCedisId);
 const visibleOrders = orders.filter((o) => o.warehouseId === selectedCedisId);

 // Auto close detail if CEDIS changed
 useEffect(() => {
 if (selectedOrder && selectedOrder.warehouseId !== selectedCedisId) {
 setSelectedOrder(null);
 }
 }, [selectedCedisId, selectedOrder]);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => {
 setToastMessage(null);
 }, 4000);
 };

 const handleOrderCreated = (newOrder: OutboundVerificationOrder) => {
 // Remove pick order from pending list
 setPendingOrders((prev) => prev.filter((p) => p.folio !== newOrder.pickOrderFolio));
 setOrders((prev) => [newOrder, ...prev]);
 setSelectedOrder(newOrder);
 showToast(`✓ Orden de salida ${newOrder.folio} preparada en carril ${newOrder.assignedLane}.`);
 };

 const handleUpdateOrder = (updatedOrder: OutboundVerificationOrder) => {
 setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
 setSelectedOrder(updatedOrder);
 };

 return (
 <div className="space-y-4">
 
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Subtabs Bar (Visible when not in order detail) */}
 {!selectedOrder && (
 <div className="border-b border-theme-subtle">
 <div className="flex flex-wrap gap-4">
 <button
 type="button"
 onClick={() => setActiveSubtab('pending')}
 className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
 activeSubtab === 'pending'
 ? 'border-rose-600 text-rose-600'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <PackageCheck className="h-4 w-4" />
 <span>Por validar</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-700 border border-rose-500/20">
 {visiblePendingOrders.length}
 </span>
 </button>

 <button
 type="button"
 onClick={() => setActiveSubtab('orders')}
 className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
 activeSubtab === 'orders'
 ? 'border-rose-600 text-rose-600'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <ListChecks className="h-4 w-4" />
 <span>Órdenes de salida</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-theme-muted text-theme-muted">
 {visibleOrders.length}
 </span>
 </button>
 </div>
 </div>
 )}

 {/* Content Rendering */}
 {selectedOrder ? (
 <OutboundVerificationDetailView
 order={selectedOrder}
 onBack={() => setSelectedOrder(null)}
 onUpdateOrder={handleUpdateOrder}
 onShowToast={showToast}
 />
 ) : activeSubtab === 'pending' ? (
 <PendingOutboundList
 pendingOrders={visiblePendingOrders}
 onOrderCreated={handleOrderCreated}
 />
 ) : (
 <OutboundVerificationOrderList
 orders={visibleOrders}
 onSelectOrder={(order) => setSelectedOrder(order)}
 />
 )}
 </div>
 );
};

