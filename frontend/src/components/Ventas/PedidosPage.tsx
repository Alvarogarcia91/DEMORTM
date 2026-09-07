import React, { useState } from 'react';
import {
 ShoppingBag,
 LayoutDashboard,
 Clock,
 List,
 CheckCircle2
} from 'lucide-react';
import {
 SalesOrder,
 SalesQuote
} from '../../data/mockSalesData';
import { PedidosDashboard } from './Pedidos/PedidosDashboard';
import { PendingAuthorizationOrdersList } from './Pedidos/PendingAuthorizationOrdersList';
import { PedidosList } from './Pedidos/PedidosList';
import { OrderDetailModal } from './Pedidos/OrderDetailModal';
import { OrderAuthorizationModal } from './Pedidos/OrderAuthorizationModal';

interface PedidosPageProps {
 orders: SalesOrder[];
 quotes: SalesQuote[];
 onAuthorizeOrder: (orderId: string, notes?: string) => void;
 onRequestAdjustmentOrder: (orderId: string, notes?: string) => void;
 onRejectOrder: (orderId: string, notes?: string) => void;
 onNavigateToRequisitions?: (preloadedSku?: string) => void;
 onNavigateToQuote?: (quoteFolio: string) => void;
}

export const PedidosPage: React.FC<PedidosPageProps> = ({
 orders,
 quotes,
 onAuthorizeOrder,
 onRequestAdjustmentOrder,
 onRejectOrder,
 onNavigateToRequisitions,
 onNavigateToQuote,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'pending' | 'list'>('dashboard');

 const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<SalesOrder | null>(null);
 const [selectedOrderForAuth, setSelectedOrderForAuth] = useState<SalesOrder | null>(null);

 const pendingCount = orders.filter((o) => o.status === 'Pendiente de autorización').length;

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
 VENTAS [BÁSICO]
 </span>
 </div>
 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
 Pedidos
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Monitoreo comercial, autorización de pedidos, análisis de showroom y cruce con inventario local.
 </p>
 </div>
 </div>

 {/* Subtabs Navigation */}
 <div className="flex items-center gap-2 border-b border-theme-subtle pb-3 overflow-x-auto">
 <button
 type="button"
 onClick={() => setActiveSubTab('dashboard')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
 activeSubTab === 'dashboard'
 ? 'bg-white text-rose-600 border-2 border-rose-600 shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <LayoutDashboard className="w-4 h-4 text-rose-600" />
 <span>Dashboard</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveSubTab('pending')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
 activeSubTab === 'pending'
 ? 'bg-white text-rose-600 border-2 border-rose-600 shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <Clock className="w-4 h-4 text-amber-600" />
 <span>Pendientes de autorización</span>
 {pendingCount > 0 && (
 <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white border border-amber-500 text-zinc-900 shadow-2xs">
 {pendingCount}
 </span>
 )}
 </button>

 <button
 type="button"
 onClick={() => setActiveSubTab('list')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
 activeSubTab === 'list'
 ? 'bg-white text-rose-600 border-2 border-rose-600 shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <List className="w-4 h-4 text-rose-600" />
 <span>Pedidos</span>
 <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-200">
 {orders.length}
 </span>
 </button>
 </div>

 {/* Subtab Content */}
 {activeSubTab === 'dashboard' && (
 <PedidosDashboard
 orders={orders}
 onNavigateToPendingAuth={() => setActiveSubTab('pending')}
 onNavigateToOrdersList={() => setActiveSubTab('list')}
 onNavigateToRequisitions={onNavigateToRequisitions}
 />
 )}

 {activeSubTab === 'pending' && (
 <PendingAuthorizationOrdersList
 orders={orders}
 onOpenDetail={(o) => setSelectedOrderForDetail(o)}
 onOpenAuthorizationModal={(o) => setSelectedOrderForAuth(o)}
 onAuthorizeOrder={(orderId) => onAuthorizeOrder(orderId, 'Autorizado desde la bandeja de pedidos.')}
 />
 )}

 {activeSubTab === 'list' && (
 <PedidosList
 orders={orders}
 onOpenDetail={(o) => setSelectedOrderForDetail(o)}
 />
 )}

 {/* Modales */}
 <OrderDetailModal
 order={selectedOrderForDetail}
 isOpen={!!selectedOrderForDetail}
 onClose={() => setSelectedOrderForDetail(null)}
 onOpenAuthorizationModal={(o) => {
 setSelectedOrderForDetail(null);
 setSelectedOrderForAuth(o);
 }}
 onAuthorizeOrder={(orderId) => {
 onAuthorizeOrder(orderId);
 setSelectedOrderForDetail(null);
 }}
 onNavigateToQuote={onNavigateToQuote}
 />

 <OrderAuthorizationModal
 order={selectedOrderForAuth}
 isOpen={!!selectedOrderForAuth}
 onClose={() => setSelectedOrderForAuth(null)}
 onAuthorize={(orderId, notes) => onAuthorizeOrder(orderId, notes)}
 onRequestAdjustment={(orderId, notes) => onRequestAdjustmentOrder(orderId, notes)}
 onReject={(orderId, notes) => onRejectOrder(orderId, notes)}
 />
 </div>
 );
};
