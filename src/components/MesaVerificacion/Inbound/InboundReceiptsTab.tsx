import React, { useState, useEffect } from 'react';
import { 
 FileInput, 
 ListChecks, 
 CheckCircle2, 
 Truck
} from 'lucide-react';
import { 
 InboundReceiptOrder, 
 ReceivedUnitRecord, 
 buildInboundOrderFromPurchaseOrder 
} from '../../../data/mockInboundData';
import { PurchaseOrder } from '../../../data/mockPurchasesOrdersData';
import { PendingReceiptsList } from './PendingReceiptsList';
import { CompletedReceiptOrdersList } from './CompletedReceiptOrdersList';
import { ReceiptOrderDetailView } from './ReceiptOrderDetailView';
import { BranchTransfersInboundView } from './BranchTransfersInboundView';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

interface InboundReceiptsTabProps {
 orders?: PurchaseOrder[];
 onUpdatePurchaseOrder?: (updated: PurchaseOrder) => void;
 initialSelectedFolio?: string | null;
 onNavigateToPurchaseOrder?: (orderFolio: string) => void;
 onNavigateToPutaway?: () => void;
}

export const InboundReceiptsTab: React.FC<InboundReceiptsTabProps> = ({
 orders = [],
 onUpdatePurchaseOrder,
 initialSelectedFolio,
 onNavigateToPurchaseOrder,
 onNavigateToPutaway,
}) => {
 const { selectedFacilityId, selectedFacility, isSucursal } = useVerificationDeskCedis();
 const [activeSubtab, setActiveSubtab] = useState<'pending' | 'orders'>('pending');
 const [selectedOrder, setSelectedOrder] = useState<InboundReceiptOrder | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);
 
 // Cache for created serial units per SKU during session
 const [unitsCache, setUnitsCache] = useState<Record<string, ReceivedUnitRecord[]>>({});

 // Convert qualifying purchase orders for this CEDIS into InboundReceiptOrders
 const visiblePurchaseOrders = orders.filter((o) => {
 // 1. Must match current facility/CEDIS
 if (o.targetWarehouseId !== selectedFacilityId) return false;
 // 2. Must be CEDIS type (sucursales excluded from supplier direct POs)
 if (o.targetWarehouseType !== 'CEDIS') return false;
 // 3. Not cancelled or draft
 if (o.status === 'Cancelada' || o.status === 'Borrador') return false;
 return true;
 });

 const visibleInboundOrders = visiblePurchaseOrders.map((po) =>
 buildInboundOrderFromPurchaseOrder(po, unitsCache)
 );

 const pendingOrders = visibleInboundOrders.filter(
 (o) => o.status !== 'Completa' && o.totalPendingUnits > 0
 );

 const completedOrders = visibleInboundOrders.filter(
 (o) => o.status === 'Completa' || o.totalPendingUnits === 0
 );

 // Auto-open initial selected order if provided
 useEffect(() => {
 if (initialSelectedFolio && !isSucursal) {
 const match = visibleInboundOrders.find((o) => o.folio === initialSelectedFolio);
 if (match) {
 setSelectedOrder(match);
 }
 }
 }, [initialSelectedFolio, selectedFacilityId, isSucursal]);

 // Close open order detail if facility context changes and doesn't belong
 useEffect(() => {
 if (selectedOrder && selectedOrder.destinationWarehouseId !== selectedFacilityId) {
 setSelectedOrder(null);
 }
 }, [selectedFacilityId, selectedOrder]);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => {
 setToastMessage(null);
 }, 4000);
 };

 // Handle update from scanning / reception in CEDIS
 const handleUpdateOrder = (updatedInboundOrder: InboundReceiptOrder) => {
 // Update units cache
 const newCache = { ...unitsCache };
 updatedInboundOrder.lines.forEach((line) => {
 newCache[line.sku] = line.receivedUnits;
 });
 setUnitsCache(newCache);

 // Update the underlying shared PurchaseOrder
 const targetPo = orders.find((p) => p.folio === updatedInboundOrder.folio);
 if (targetPo && onUpdatePurchaseOrder) {
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 const updatedItems = targetPo.items.map((item) => {
 const matchingLine = updatedInboundOrder.lines.find((l) => l.sku === item.sku);
 if (matchingLine) {
 return {
 ...item,
 receivedQuantity: matchingLine.receivedQuantity,
 pendingQuantity: matchingLine.pendingQuantity,
 };
 }
 return item;
 });

 const totalPending = updatedItems.reduce((s, i) => s + i.pendingQuantity, 0);
 const totalReceived = updatedItems.reduce((s, i) => s + i.receivedQuantity, 0);

 let newStatus = targetPo.status;
 if (totalPending === 0 && totalReceived > 0) {
 newStatus = 'Recibida';
 } else if (totalReceived > 0) {
 newStatus = 'Parcialmente recibida';
 }

 const updatedPo: PurchaseOrder = {
 ...targetPo,
 items: updatedItems,
 status: newStatus,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: updatedInboundOrder.operatorAssigned || 'Operador Mesa 01',
 role: 'Mesa de Verificación',
 action: `Registró recepción física en rampa ${updatedInboundOrder.receivingAreaCode} (${totalReceived} u. recibidas, ${totalPending} u. pendientes)`,
 type: 'received',
 },
 ...targetPo.timeline,
 ],
 };

 onUpdatePurchaseOrder(updatedPo);
 }

 setSelectedOrder(updatedInboundOrder);
 };

 const handleSelectOrderToReceive = (order: InboundReceiptOrder) => {
 setSelectedOrder(order);
 };

 // If active facility is SUCURSAL, render branch transfer receiving flow
 if (isSucursal) {
 return (
 <BranchTransfersInboundView
 facility={selectedFacility}
 onNavigateToPutaway={onNavigateToPutaway}
 onShowToast={showToast}
 />
 );
 }

 // Otherwise, render CEDIS supplier purchase order receiving flow
 return (
 <div className="space-y-4">
 
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Subtabs Bar (Only shown when not in single order view) */}
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
 <FileInput className="h-4 w-4" />
 <span>Compras por recibir</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-700 border border-rose-500/20 font-bold">
 {pendingOrders.length}
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
 <span>Compras recibidas (Historial)</span>
 <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-theme-muted text-theme-muted font-bold">
 {completedOrders.length}
 </span>
 </button>
 </div>
 </div>
 )}

 {/* Content Rendering */}
 {selectedOrder ? (
 <ReceiptOrderDetailView
 order={selectedOrder}
 onBack={() => setSelectedOrder(null)}
 onUpdateOrder={handleUpdateOrder}
 onNavigateToPurchaseOrder={onNavigateToPurchaseOrder}
 onShowToast={showToast}
 onNavigateToPutaway={onNavigateToPutaway}
 />
 ) : activeSubtab === 'pending' ? (
 <PendingReceiptsList
 orders={pendingOrders}
 onSelectOrder={handleSelectOrderToReceive}
 />
 ) : (
 <CompletedReceiptOrdersList
 orders={completedOrders}
 onOpenOrderReceiving={handleSelectOrderToReceive}
 />
 )}
 </div>
 );
};
