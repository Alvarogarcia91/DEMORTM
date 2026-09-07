import React, { useState, useEffect } from 'react';
import {
 LayoutDashboard,
 ShoppingBag,
 ShoppingCart,
 Plus
} from 'lucide-react';
import { Requisition } from '../../../data/mockRequisitionsData';
import {
 PurchaseOrder,
 INITIAL_MOCK_PURCHASE_ORDERS
} from '../../../data/mockPurchasesOrdersData';
import { ComprasDashboard } from './ComprasDashboard';
import { PorComprarList } from './PorComprarList';
import { PurchaseOrdersList } from './PurchaseOrdersList';
import { PurchaseOrderCreateWizardModal } from './PurchaseOrderCreateWizardModal';
import { PurchaseOrderDetailModal } from './PurchaseOrderDetailModal';

export type ComprasSubTab = 'dashboard' | 'por_comprar' | 'ordenes';

interface ComprasTabProps {
 requisitions: Requisition[];
 onUpdateRequisition: (updated: Requisition) => void;
 orders: PurchaseOrder[];
 onUpdateOrder: (updated: PurchaseOrder) => void;
 onAddOrder: (newOrder: PurchaseOrder) => void;
 initialSelectedOrderFolio?: string | null;
 onNavigateToInbound?: (folio: string, targetWarehouseId?: string) => void;
}

export const ComprasTab: React.FC<ComprasTabProps> = ({
 requisitions,
 onUpdateRequisition,
 orders,
 onUpdateOrder,
 onAddOrder,
 initialSelectedOrderFolio,
 onNavigateToInbound,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<ComprasSubTab>(
 initialSelectedOrderFolio ? 'ordenes' : 'dashboard'
 );

 // Modal states
 const [creatingForRequisition, setCreatingForRequisition] = useState<{
 req: Requisition;
 selectedItemIds?: string[];
 } | null>(null);
 const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

 // Auto-select initial order if requested
 useEffect(() => {
 if (initialSelectedOrderFolio) {
 const match = orders.find((o) => o.folio === initialSelectedOrderFolio);
 if (match) {
 setSelectedOrder(match);
 setActiveSubTab('ordenes');
 }
 }
 }, [initialSelectedOrderFolio, orders]);

 // Filter ready for purchase requisitions
 const readyRequisitions = requisitions.filter((r) => r.status === 'Lista para compra');

 // Handle new PO creation from wizard
 const handleOrderCreated = (newOrder: PurchaseOrder, updatedReq: Requisition) => {
 onAddOrder(newOrder);
 onUpdateRequisition(updatedReq);
 setCreatingForRequisition(null);
 setSelectedOrder(newOrder);
 };

 // Handle PO updates (emission, status change, cancellation)
 const handleOrderUpdated = (updatedOrder: PurchaseOrder) => {
 onUpdateOrder(updatedOrder);
 setSelectedOrder(updatedOrder);
 };

 const subTabs = [
 { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
 {
 id: 'por_comprar' as const,
 label: 'Por comprar',
 icon: ShoppingBag,
 count: readyRequisitions.length,
 },
 {
 id: 'ordenes' as const,
 label: 'Órdenes de compra',
 icon: ShoppingCart,
 count: orders.length,
 },
 ];

 return (
 <div className="space-y-6">
 
 {/* Sub-Navigation Tabs */}
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3 gap-3 flex-wrap">
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle">
 {subTabs.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeSubTab === tab.id;

 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveSubTab(tab.id)}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
 isActive
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
 }`}
 >
 <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`} />
 <span>{tab.label}</span>
 {tab.count !== undefined && (
 <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
 isActive ? 'bg-theme-primary/10 text-theme-primary' : 'bg-theme-muted text-theme-muted'
 }`}>
 {tab.count}
 </span>
 )}
 </button>
 );
 })}
 </div>

 {readyRequisitions.length > 0 && (
 <button
 type="button"
 onClick={() => setActiveSubTab('por_comprar')}
 className="px-4 py-2 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
 >
 <ShoppingBag className="w-4 h-4" />
 <span>Atender Requisiciones ({readyRequisitions.length})</span>
 </button>
 )}
 </div>

 {/* Subview Content */}
 {activeSubTab === 'dashboard' && (
 <ComprasDashboard
 orders={orders}
 readyRequisitions={readyRequisitions}
 allRequisitions={requisitions}
 onSelectOrder={(ord) => setSelectedOrder(ord)}
 onOpenCreateOrderWizard={(req) => setCreatingForRequisition({ req })}
 onNavigateSubTab={(tab) => setActiveSubTab(tab)}
 onNavigateToInbound={onNavigateToInbound}
 />
 )}

 {activeSubTab === 'por_comprar' && (
 <PorComprarList
 requisitions={requisitions}
 onOpenCreateOrderWizard={(req, selectedItemIds) =>
 setCreatingForRequisition({ req, selectedItemIds })
 }
 onUpdateRequisition={onUpdateRequisition}
 />
 )}

 {activeSubTab === 'ordenes' && (
 <PurchaseOrdersList
 orders={orders}
 onSelectOrder={(ord) => setSelectedOrder(ord)}
 />
 )}

 {/* Purchase Order Wizard Modal */}
 {creatingForRequisition && (
 <PurchaseOrderCreateWizardModal
 requisition={creatingForRequisition.req}
 initialSelectedItemIds={creatingForRequisition.selectedItemIds}
 onClose={() => setCreatingForRequisition(null)}
 onSuccess={handleOrderCreated}
 />
 )}

 {/* Purchase Order Detail Modal */}
 {selectedOrder && (
 <PurchaseOrderDetailModal
 order={selectedOrder}
 onClose={() => setSelectedOrder(null)}
 onUpdateOrder={handleOrderUpdated}
 onNavigateToInboundReceipts={(folio) => {
 if (onNavigateToInbound) {
 onNavigateToInbound(folio, selectedOrder.targetWarehouseId);
 }
 }}
 />
 )}

 </div>
 );
};
