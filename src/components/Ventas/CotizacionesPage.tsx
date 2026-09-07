import React, { useState } from 'react';
import {
 FileText,
 Plus,
 LayoutDashboard,
 List
} from 'lucide-react';
import {
 SalesQuote,
 SalesCustomer,
 SalesPriceList
} from '../../data/mockSalesData';
import { CotizacionesDashboard } from './Cotizaciones/CotizacionesDashboard';
import { CotizacionesList } from './Cotizaciones/CotizacionesList';
import { CreateQuoteWizardModal } from './Cotizaciones/CreateQuoteWizardModal';
import { QuoteDetailModal } from './Cotizaciones/QuoteDetailModal';
import { QuoteAuthorizationModal } from './Cotizaciones/QuoteAuthorizationModal';
import { QuickClientFormModal } from './Clientes/QuickClientFormModal';

interface CotizacionesPageProps {
 quotes: SalesQuote[];
 customers: SalesCustomer[];
 priceLists: SalesPriceList[];
 onSaveQuote: (quote: SalesQuote) => void;
 onUpdateQuoteStatus: (quoteId: string, newStatus: SalesQuote['status'], extra?: Partial<SalesQuote>) => void;
 onSaveCustomer: (customer: SalesCustomer) => void;
 onGenerateOrderFromQuote: (quote: SalesQuote) => void;
 onNavigateToOrder?: (orderFolio: string) => void;
 initialPreselectedCustomerId?: string | null;
 initialSelectedQuoteFolio?: string | null;
}

export const CotizacionesPage: React.FC<CotizacionesPageProps> = ({
 quotes,
 customers,
 priceLists,
 onSaveQuote,
 onUpdateQuoteStatus,
 onSaveCustomer,
 onGenerateOrderFromQuote,
 onNavigateToOrder,
 initialPreselectedCustomerId,
 initialSelectedQuoteFolio,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'list'>('dashboard');

 // Modales
 const [isWizardOpen, setIsWizardOpen] = useState(false);
 const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<SalesQuote | null>(null);
 const [selectedQuoteForAuth, setSelectedQuoteForAuth] = useState<SalesQuote | null>(null);
 const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
 const [wizardPreselectedCustomerId, setWizardPreselectedCustomerId] = useState<string | undefined>(
  initialPreselectedCustomerId || undefined
 );

 React.useEffect(() => {
  if (initialPreselectedCustomerId) {
   setWizardPreselectedCustomerId(initialPreselectedCustomerId);
   setIsWizardOpen(true);
  }
 }, [initialPreselectedCustomerId]);

 React.useEffect(() => {
  if (initialSelectedQuoteFolio) {
   const found = quotes.find((q) => q.folio === initialSelectedQuoteFolio);
   if (found) {
    setSelectedQuoteForDetail(found);
   }
  }
 }, [initialSelectedQuoteFolio, quotes]);

 const handleOpenWizardWithCustomer = (customerId?: string) => {
 setWizardPreselectedCustomerId(customerId);
 setIsWizardOpen(true);
 };

 const handleAuthorizeQuote = (quoteId: string, notes: string) => {
 onUpdateQuoteStatus(quoteId, 'Autorizada', {
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
 notes,
 action: 'Autorizada',
 },
 });
 };

 const handleRequestAdjustment = (quoteId: string, notes: string) => {
 onUpdateQuoteStatus(quoteId, 'Borrador', {
 notes: notes ? `Ajuste solicitado por gerencia: ${notes}` : 'Ajuste comercial requerido.',
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
 notes,
 action: 'Ajuste solicitado',
 },
 });
 };

 const handleRejectQuote = (quoteId: string, notes: string) => {
 onUpdateQuoteStatus(quoteId, 'Rechazada', {
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
 notes,
 action: 'Rechazada',
 },
 });
 };

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
 Cotizaciones
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Gestión de propuestas comerciales, listas de precios de venta, descuentos y margen comercial.
 </p>
 </div>

 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={() => handleOpenWizardWithCustomer()}
 className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva cotización</span>
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
 : 'bg-white border border-theme-subtle text-theme-muted hover:text-theme-main hover:bg-zinc-50 shadow-2xs'
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
 : 'bg-white border border-theme-subtle text-theme-muted hover:text-theme-main hover:bg-zinc-50 shadow-2xs'
 }`}
 >
 <List className="w-4 h-4 text-theme-primary" />
 <span>Cotizaciones</span>
 <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-200">
 {quotes.length}
 </span>
 </button>
 </div>

 {/* Subtab Content */}
 {activeSubTab === 'dashboard' ? (
 <CotizacionesDashboard
 quotes={quotes}
 onOpenCreateWizard={() => handleOpenWizardWithCustomer()}
 onNavigateToList={() => setActiveSubTab('list')}
 onOpenDetail={(q) => setSelectedQuoteForDetail(q)}
 />
 ) : (
 <CotizacionesList
 quotes={quotes}
 onOpenDetail={(q) => setSelectedQuoteForDetail(q)}
 onOpenCreateWizard={() => handleOpenWizardWithCustomer()}
 onOpenAuthorizationModal={(q) => setSelectedQuoteForAuth(q)}
 onGenerateOrder={(q) => onGenerateOrderFromQuote(q)}
 onNavigateToOrder={(folio) => onNavigateToOrder && onNavigateToOrder(folio)}
 />
 )}

 {/* Create Quote Wizard Modal */}
 <CreateQuoteWizardModal
 isOpen={isWizardOpen}
 onClose={() => {
 setIsWizardOpen(false);
 setWizardPreselectedCustomerId(undefined);
 }}
 customers={customers}
 priceLists={priceLists}
 onSaveQuote={onSaveQuote}
 onOpenQuickClientModal={() => setIsQuickClientOpen(true)}
 initialCustomerId={wizardPreselectedCustomerId}
 />

 {/* Quote Detail Modal */}
 <QuoteDetailModal
 quote={selectedQuoteForDetail}
 isOpen={!!selectedQuoteForDetail}
 onClose={() => setSelectedQuoteForDetail(null)}
 onOpenAuthorizationModal={(q) => {
 setSelectedQuoteForDetail(null);
 setSelectedQuoteForAuth(q);
 }}
 onUpdateQuoteStatus={onUpdateQuoteStatus}
 onGenerateOrder={(q) => {
 setSelectedQuoteForDetail(null);
 onGenerateOrderFromQuote(q);
 }}
 onNavigateToOrder={onNavigateToOrder}
 />

 {/* Quote Authorization Modal */}
 <QuoteAuthorizationModal
 quote={selectedQuoteForAuth}
 isOpen={!!selectedQuoteForAuth}
 onClose={() => setSelectedQuoteForAuth(null)}
 onAuthorize={handleAuthorizeQuote}
 onRequestAdjustment={handleRequestAdjustment}
 onReject={handleRejectQuote}
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
