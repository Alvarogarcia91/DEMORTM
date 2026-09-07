import React, { useState, useEffect } from 'react';
import { 
 Compass, 
 ListFilter, 
 CheckCircle2, 
 PackageSearch 
} from 'lucide-react';
import { 
 PendingPickingDemand, 
 PickOrder, 
 INITIAL_PENDING_PICKING_DEMANDS, 
 INITIAL_PICK_ORDERS 
} from '../../../data/mockPickingData';
import { PendingPickDemandsList } from './PendingPickDemandsList';
import { PickOrderList } from './PickOrderList';
import { PickOrderDetailView } from './PickOrderDetailView';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

interface PickTabProps {
 onNavigateToOutbound?: () => void;
}

export const PickTab: React.FC<PickTabProps> = ({
 onNavigateToOutbound,
}) => {
 const { selectedCedisId } = useVerificationDeskCedis();
 const [activeSubtab, setActiveSubtab] = useState<'demands' | 'orders'>('demands');
 const [demands, setDemands] = useState<PendingPickingDemand[]>(INITIAL_PENDING_PICKING_DEMANDS);
 const [orders, setOrders] = useState<PickOrder[]>(INITIAL_PICK_ORDERS);
 const [selectedOrder, setSelectedOrder] = useState<PickOrder | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Scoped to global CEDIS
 const visibleDemands = demands.filter((d) => d.warehouseId === selectedCedisId);
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

 const handleOrderCreated = (newOrder: PickOrder) => {
 // Remove demand from pending list
 setDemands((prev) => prev.filter((d) => d.referenceFolio !== newOrder.referenceFolio));
 setOrders((prev) => [newOrder, ...prev]);
 setSelectedOrder(newOrder);
 showToast(`✓ Orden de recolección ${newOrder.folio} generada con éxito.`);
 };

 const handleUpdateOrder = (updatedOrder: PickOrder) => {
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

 {/* Subtabs Bar (Only shown when not in single order detail) */}
 {!selectedOrder && (
 <div className="border-b border-theme-subtle">
 <div className="flex flex-wrap gap-4">
 <button
 type="button"
 onClick={() => setActiveSubtab('demands')}
 className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
 activeSubtab === 'demands'
 ? 'border-rose-600 text-rose-600'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <Compass className="h-4 w-4" />
 <span>Por planear</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-700 border border-rose-500/20">
 {visibleDemands.length}
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
 <span>Órdenes de recolección</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-theme-muted text-theme-muted">
 {visibleOrders.length}
 </span>
 </button>
 </div>
 </div>
 )}

 {/* Content Rendering */}
 {selectedOrder ? (
 <PickOrderDetailView
 order={selectedOrder}
 onBack={() => setSelectedOrder(null)}
 onUpdateOrder={handleUpdateOrder}
 onNavigateToOutbound={onNavigateToOutbound}
 onShowToast={showToast}
 />
 ) : activeSubtab === 'demands' ? (
 <PendingPickDemandsList
 demands={visibleDemands}
 onOrderCreated={handleOrderCreated}
 />
 ) : (
 <PickOrderList
 orders={visibleOrders}
 onSelectOrder={(order) => setSelectedOrder(order)}
 />
 )}
 </div>
 );
};
