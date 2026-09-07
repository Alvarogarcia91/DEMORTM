import React, { useState, useEffect } from 'react';
import { 
 PackageSearch, 
 ListFilter, 
 CheckCircle2, 
 ArrowRightLeft,
 Sparkles
} from 'lucide-react';
import { 
 PendingPutawayUnit, 
 PutawayOrder, 
 INITIAL_PENDING_PUTAWAY_UNITS, 
 INITIAL_PUTAWAY_ORDERS 
} from '../../../data/mockPutawayData';
import { PutawayPendingPool } from './PutawayPendingPool';
import { PutawayOrderList } from './PutawayOrderList';
import { PutawayOrderDetailView } from './PutawayOrderDetailView';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

export const PutawayTab: React.FC = () => {
 const { selectedCedisId } = useVerificationDeskCedis();
 const [activeSubtab, setActiveSubtab] = useState<'pool' | 'orders'>('pool');
 const [pendingUnits, setPendingUnits] = useState<PendingPutawayUnit[]>(INITIAL_PENDING_PUTAWAY_UNITS);
 const [orders, setOrders] = useState<PutawayOrder[]>(INITIAL_PUTAWAY_ORDERS);
 const [selectedOrder, setSelectedOrder] = useState<PutawayOrder | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 const visiblePendingUnits = pendingUnits.filter((u) => u.warehouseId === selectedCedisId);
 const visibleOrders = orders.filter((o) => o.warehouseId === selectedCedisId);

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

 // Handle order creation from pool
 const handleOrderCreated = (newOrder: PutawayOrder) => {
 const orderUids = newOrder.items.map((it) => it.uid);
 // Remove or mark units as in-order from pending pool
 setPendingUnits((prev) => prev.filter((u) => !orderUids.includes(u.uid)));
 setOrders((prev) => [newOrder, ...prev]);
 setSelectedOrder(newOrder);
 showToast(`✓ Orden de acomodo ${newOrder.folio} generada con ${newOrder.items.length} unidades.`);
 };

 // Handle order update (e.g. after item scanned in PutawayOrderDetailView)
 const handleUpdateOrder = (updatedOrder: PutawayOrder) => {
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

 {/* Subtabs Bar (Visible when not inside order detail) */}
 {!selectedOrder && (
 <div className="border-b border-theme-subtle">
 <div className="flex flex-wrap gap-4">
 <button
 type="button"
 onClick={() => setActiveSubtab('pool')}
 className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
 activeSubtab === 'pool'
 ? 'border-rose-600 text-rose-600'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <PackageSearch className="h-4 w-4" />
 <span>Por acomodar</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-700 border border-rose-500/20">
 {visiblePendingUnits.length}
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
 <ListFilter className="h-4 w-4" />
 <span>Órdenes de Acomodo</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-theme-muted text-theme-muted">
 {visibleOrders.length}
 </span>
 </button>
 </div>
 </div>
 )}

 {/* Main Content */}
 {selectedOrder ? (
 <PutawayOrderDetailView
 order={selectedOrder}
 onBack={() => setSelectedOrder(null)}
 onUpdateOrder={handleUpdateOrder}
 onShowToast={showToast}
 />
 ) : activeSubtab === 'pool' ? (
 <PutawayPendingPool
 units={visiblePendingUnits}
 onOrderCreated={handleOrderCreated}
 />
 ) : (
 <PutawayOrderList
 orders={visibleOrders}
 onSelectOrder={(order) => setSelectedOrder(order)}
 />
 )}
 </div>
 );
};
