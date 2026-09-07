import React, { useState } from 'react';
import { ShoppingCart, FileText, Truck, ClipboardList } from 'lucide-react';
import { Requisition, INITIAL_MOCK_REQUISITIONS } from '../../data/mockRequisitionsData';
import { RequisicionesTab } from './Requisiciones/RequisicionesTab';
import { ComprasTab } from './Ordenes/ComprasTab';
import { ProveedoresTab } from './Proveedores/ProveedoresTab';
import { SupplierMaster, INITIAL_MOCK_SUPPLIERS } from '../../data/mockSuppliersData';
import { PurchaseOrder, INITIAL_MOCK_PURCHASE_ORDERS } from '../../data/mockPurchasesOrdersData';
import { NavItemKey } from '../Sidebar';

export type ComprasMainTab = 'requisiciones' | 'compras' | 'proveedores';

interface ComprasPageProps {
 onNavigateTab?: (tab: NavItemKey) => void;
}

export const ComprasPage: React.FC<ComprasPageProps> = ({ onNavigateTab }) => {
 const [activeTab, setActiveTab] = useState<ComprasMainTab>('requisiciones');
 const [requisitions, setRequisitions] = useState<Requisition[]>(INITIAL_MOCK_REQUISITIONS);
 const [suppliers, setSuppliers] = useState<SupplierMaster[]>(INITIAL_MOCK_SUPPLIERS);
 const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_MOCK_PURCHASE_ORDERS);

 const handleUpdateRequisition = (updated: Requisition) => {
 setRequisitions((prev) =>
 prev.map((r) => (r.id === updated.id ? updated : r))
 );
 };

 const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
 setOrders((prev) =>
 prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
 );
 };

 const handleAddOrder = (newOrder: PurchaseOrder) => {
 setOrders((prev) => [newOrder, ...prev]);
 };

 const mainTabs = [
 { id: 'requisiciones' as const, label: 'Requisiciones', icon: ClipboardList },
 { id: 'compras' as const, label: 'Compras', icon: ShoppingCart },
 { id: 'proveedores' as const, label: 'Proveedores', icon: Truck },
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Main Header */}
 <div className="space-y-1">
 <div className="flex items-center gap-2.5">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-theme-primary-light text-theme-primary border border-theme-primary/25">
 Cadena de Suministro & Abastecimiento
 </span>
 </div>
 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
 Compras
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Solicitudes, órdenes de compra y proveedores.
 </p>
 </div>

 {/* Main Navigation Tabs */}
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/60 rounded-2xl border border-theme-subtle w-fit">
 {mainTabs.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;

 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveTab(tab.id)}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
 isActive
 ? 'bg-theme-surface text-theme-main shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/80'
 }`}
 >
 <Icon className={`w-4 h-4 ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`} />
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>

 {/* Main Tab Content */}
 <div>
 {activeTab === 'requisiciones' && (
 <RequisicionesTab
 requisitions={requisitions}
 onSetRequisitions={setRequisitions}
 onNavigateToPurchasesTab={() => setActiveTab('compras')}
 />
 )}
 {activeTab === 'compras' && (
 <ComprasTab
 requisitions={requisitions}
 onUpdateRequisition={handleUpdateRequisition}
 orders={orders}
 onUpdateOrder={handleUpdateOrder}
 onAddOrder={handleAddOrder}
 onNavigateToInbound={(folio) => {
 if (onNavigateTab) {
 onNavigateTab('mesa-verificacion');
 }
 }}
 />
 )}
 {activeTab === 'proveedores' && (
 <ProveedoresTab
 suppliers={suppliers}
 onSetSuppliers={setSuppliers}
 />
 )}
 </div>

 </div>
 );
};
