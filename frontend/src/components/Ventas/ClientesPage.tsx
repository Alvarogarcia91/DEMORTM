import React, { useState } from 'react';
import {
 Users,
 Plus,
 LayoutDashboard,
 List
} from 'lucide-react';
import {
 SalesCustomer,
 SalesQuote,
 SalesOrder
} from '../../data/mockSalesData';
import { ClientesDashboard } from './Clientes/ClientesDashboard';
import { ClientesList } from './Clientes/ClientesList';
import { ClientDetailModal } from './Clientes/ClientDetailModal';
import { QuickClientFormModal } from './Clientes/QuickClientFormModal';

interface ClientesPageProps {
 customers: SalesCustomer[];
 quotes: SalesQuote[];
 orders: SalesOrder[];
 onSaveCustomer: (customer: SalesCustomer) => void;
 onStartQuoteForCustomer?: (customer: SalesCustomer) => void;
}

export const ClientesPage: React.FC<ClientesPageProps> = ({
 customers,
 quotes,
 orders,
 onSaveCustomer,
 onStartQuoteForCustomer,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'list'>('dashboard');

 const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<SalesCustomer | null>(null);
 const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);

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
 Clientes
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Directorio comercial de personas, empresas y convenios con condiciones comerciales preferenciales.
 </p>
 </div>

 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={() => setIsQuickClientOpen(true)}
 className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
 >
 <Plus className="w-4 h-4" />
 <span>Nuevo cliente</span>
 </button>
 </div>
 </div>

 {/* Subtabs Navigation */}
 <div className="flex items-center gap-2 border-b border-theme-subtle pb-3">
 <button
 type="button"
 onClick={() => setActiveSubTab('dashboard')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 activeSubTab === 'dashboard'
 ? 'bg-white text-theme-primary border-2 border-theme-primary shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <LayoutDashboard className="w-4 h-4 text-theme-primary" />
 <span>Dashboard</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveSubTab('list')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 activeSubTab === 'list'
 ? 'bg-white text-theme-primary border-2 border-theme-primary shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <List className="w-4 h-4 text-theme-primary" />
 <span>Clientes</span>
 <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-200">
 {customers.length}
 </span>
 </button>
 </div>

 {/* Subtab Content */}
 {activeSubTab === 'dashboard' ? (
 <ClientesDashboard
 customers={customers}
 onOpenQuickForm={() => setIsQuickClientOpen(true)}
 onNavigateToList={() => setActiveSubTab('list')}
 onOpenDetail={(c) => setSelectedCustomerForDetail(c)}
 />
 ) : (
 <ClientesList
 customers={customers}
 onOpenDetail={(c) => setSelectedCustomerForDetail(c)}
 onOpenQuickForm={() => setIsQuickClientOpen(true)}
 onStartQuoteForCustomer={onStartQuoteForCustomer}
 />
 )}

 {/* Client Detail Modal */}
 <ClientDetailModal
 customer={selectedCustomerForDetail}
 isOpen={!!selectedCustomerForDetail}
 onClose={() => setSelectedCustomerForDetail(null)}
 quotes={quotes}
 orders={orders}
 onStartQuoteForCustomer={(c) => {
 setSelectedCustomerForDetail(null);
 if (onStartQuoteForCustomer) onStartQuoteForCustomer(c);
 }}
 />

 {/* Quick Client Form Modal */}
 <QuickClientFormModal
 isOpen={isQuickClientOpen}
 onClose={() => setIsQuickClientOpen(false)}
 onSaveCustomer={onSaveCustomer}
 />
 </div>
 );
};
