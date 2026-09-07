import React, { useState } from 'react';
import { Sidebar, NavItemKey } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardInicio } from './DashboardInicio';
import { MesaVerificacion } from './MesaVerificacion';
import { ArticulosPage } from './Articulos/ArticulosPage';
import { InventoryPage } from './Inventario/InventoryPage';
import { ConfiguracionView } from './ConfiguracionView';
import { RequisicionesTab } from './Compras/Requisiciones/RequisicionesTab';
import { ComprasTab } from './Compras/Ordenes/ComprasTab';
import { ProveedoresTab } from './Compras/Proveedores/ProveedoresTab';
import { CotizacionesPage } from './Ventas/CotizacionesPage';
import { PedidosPage } from './Ventas/PedidosPage';
import { ClientesPage } from './Ventas/ClientesPage';
import { EmbarquesPage } from './Embarques/EmbarquesPage';
import { ShowroomExposPage } from './ShowroomExpos/ShowroomExposPage';
import { Requisition, INITIAL_MOCK_REQUISITIONS } from '../data/mockRequisitionsData';
import { SupplierMaster, INITIAL_MOCK_SUPPLIERS } from '../data/mockSuppliersData';
import { PurchaseOrder, INITIAL_MOCK_PURCHASE_ORDERS } from '../data/mockPurchasesOrdersData';
import {
 SalesQuote,
 SalesOrder,
 SalesCustomer,
 SalesPriceList,
 INITIAL_MOCK_SALES_QUOTES,
 INITIAL_MOCK_SALES_ORDERS,
 INITIAL_MOCK_SALES_CUSTOMERS,
 INITIAL_MOCK_SALES_PRICE_LISTS
} from '../data/mockSalesData';
import { useVerificationDeskCedis } from '../context/VerificationDeskContext';

interface DashboardShellProps {
 onLogout: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ onLogout }) => {
 const [activeTab, setActiveTab] = useState<NavItemKey>('inicio');
 const [isOpenMobile, setIsOpenMobile] = useState(false);

 // Global verification desk CEDIS setter
 const { setSelectedCedisId } = useVerificationDeskCedis();

 // Shared Master Data State (Compras & Cadena de Suministro)
 const [requisitions, setRequisitions] = useState<Requisition[]>(INITIAL_MOCK_REQUISITIONS);
 const [suppliers, setSuppliers] = useState<SupplierMaster[]>(INITIAL_MOCK_SUPPLIERS);
 const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_MOCK_PURCHASE_ORDERS);

 // Shared Master Data State (Ventas [Básico])
 const [quotes, setQuotes] = useState<SalesQuote[]>(INITIAL_MOCK_SALES_QUOTES);
 const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_MOCK_SALES_ORDERS);
 const [customers, setCustomers] = useState<SalesCustomer[]>(INITIAL_MOCK_SALES_CUSTOMERS);
 const [priceLists] = useState<SalesPriceList[]>(INITIAL_MOCK_SALES_PRICE_LISTS);

 // Cross-module targeted navigation state
 const [targetPurchaseOrderFolio, setTargetPurchaseOrderFolio] = useState<string | null>(null);
 const [targetInboundFolio, setTargetInboundFolio] = useState<string | null>(null);
 const [targetQuoteCustomerId, setTargetQuoteCustomerId] = useState<string | null>(null);
 const [targetQuoteFolio, setTargetQuoteFolio] = useState<string | null>(null);
 const [targetOrderFolio, setTargetOrderFolio] = useState<string | null>(null);

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

 // Ventas Actions
 const handleSaveQuote = (newQuote: SalesQuote) => {
 setQuotes((prev) => [newQuote, ...prev]);
 // Also update customer stats
 setCustomers((prev) =>
 prev.map((c) =>
 c.id === newQuote.customerId
 ? {
 ...c,
 totalQuotesCount: c.totalQuotesCount + 1,
 }
 : c
 )
 );
 };

 const handleUpdateQuoteStatus = (
 quoteId: string,
 newStatus: SalesQuote['status'],
 extra?: Partial<SalesQuote>
 ) => {
 setQuotes((prev) =>
 prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus, ...extra } : q))
 );
 };

 const handleGenerateOrderFromQuote = (quote: SalesQuote) => {
 const orderNum = Math.floor(1000 + Math.random() * 9000);
 const orderFolio = 'PED-2026-' + orderNum;
 const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
 const targetDeliveryDate = new Date();
 targetDeliveryDate.setDate(targetDeliveryDate.getDate() + (quote.estimatedDeliveryDays || 3));
 const targetDeliveryStr = targetDeliveryDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

 const newOrder: SalesOrder = {
 id: 'order-' + Date.now(),
 folio: orderFolio,
 quoteId: quote.id,
 originQuoteFolio: quote.folio,
 createdAt: today,
 targetDeliveryDate: targetDeliveryStr,
 customerId: quote.customerId,
 customerName: quote.customerName,
 customerRfc: quote.customerRfc,
 customerType: quote.customerType,
 branchId: quote.branchId,
 branchName: quote.branchName,
 priceListName: quote.priceListName,
 sellerName: quote.sellerName || 'Admin Demo (Ventas Industriales)',
 status: 'Pendiente de autorización',
 paymentConditions: quote.paymentConditions || 'Contado / Transferencia SPEI',
 deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
 items: quote.items.map((it) => ({
 id: 'ord-it-' + it.id,
 sku: it.sku,
 productName: it.productName,
 brand: it.brand,
 size: it.size,
 quantity: it.quantity,
 unitPrice: it.netPrice,
 subtotal: it.subtotal,
 costReference: it.costReference,
 localStock: it.localStock,
 })),
 financials: {
 subtotal: quote.financials.subtotalNet,
 discountAmount: quote.financials.totalDiscountAmount,
 taxIva: quote.financials.taxIva,
 total: quote.financials.total,
 estimatedCost: quote.financials.estimatedCost,
 estimatedMarginAmount: quote.financials.estimatedMarginAmount,
 estimatedMarginPct: quote.financials.estimatedMarginPct,
 },
 };

 // 1. Add order
 setSalesOrders((prev) => [newOrder, ...prev]);

 // 2. Mark quote as Convertida en pedido
 handleUpdateQuoteStatus(quote.id, 'Convertida en pedido', {
 generatedOrderFolio: orderFolio,
 });

 // 3. Update customer stats
 setCustomers((prev) =>
 prev.map((c) =>
 c.id === quote.customerId
 ? {
 ...c,
 totalOrdersCount: c.totalOrdersCount + 1,
 totalSpent: c.totalSpent + quote.financials.total,
 lastPurchaseDate: today,
 }
 : c
 )
 );

 // 4. Navigate to pedidos with selected order
 setTargetOrderFolio(orderFolio);
 setActiveTab('pedidos');
 };

 const handleAuthorizeSalesOrder = (orderId: string, notes?: string) => {
 const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
 setSalesOrders((prev) =>
 prev.map((o) =>
 o.id === orderId
 ? {
 ...o,
 status: 'Pendiente de surtido',
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: today,
 notes: notes || 'Pedido aprobado para surtido.',
 status: 'Autorizada',
 },
 }
 : o
 )
 );
 };

 const handleRequestAdjustmentSalesOrder = (orderId: string, notes?: string) => {
 const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
 setSalesOrders((prev) =>
 prev.map((o) =>
 o.id === orderId
 ? {
 ...o,
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: today,
 notes: notes || 'Ajuste solicitado.',
 status: 'Ajuste solicitado',
 },
 }
 : o
 )
 );
 };

 const handleRejectSalesOrder = (orderId: string, notes?: string) => {
 const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
 setSalesOrders((prev) =>
 prev.map((o) =>
 o.id === orderId
 ? {
 ...o,
 status: 'Cancelado',
 authorizationLog: {
 authorizedBy: 'Gerencia Comercial Demo',
 authorizedAt: today,
 notes: notes || 'Pedido rechazado por gerencia.',
 status: 'Rechazada',
 },
 }
 : o
 )
 );
 };

 const handleSaveCustomer = (newCustomer: SalesCustomer) => {
 setCustomers((prev) => [newCustomer, ...prev]);
 };

  const handleStartQuoteForCustomer = (customer: SalesCustomer) => {
    setTargetQuoteCustomerId(customer.id);
    setTargetQuoteFolio(null);
    setActiveTab('cotizaciones');
  };

 // Cross Navigation: From Compras to Mesa de Verificación
 const handleNavigateToInbound = (folio: string, targetWarehouseId?: string) => {
 if (targetWarehouseId && (targetWarehouseId === 'wh-mty-norte' || targetWarehouseId === 'wh-mty-sur')) {
 setSelectedCedisId(targetWarehouseId);
 }
 setTargetInboundFolio(folio);
 setActiveTab('mesa-verificacion');
 };

 // Cross Navigation: From Mesa de Verificación to Compras
 const handleNavigateToPurchaseOrder = (orderFolio: string) => {
 setTargetPurchaseOrderFolio(orderFolio);
 setActiveTab('compras');
 };

 const renderContent = () => {
 switch (activeTab) {
 case 'inicio':
 return <DashboardInicio onNavigate={(tab) => setActiveTab(tab)} />;
 case 'articulos':
 return <ArticulosPage />;
 case 'inventario':
 return <InventoryPage />;
 case 'mesa-verificacion':
 return (
 <MesaVerificacion
 orders={orders}
 onUpdatePurchaseOrder={handleUpdateOrder}
 initialInboundFolio={targetInboundFolio}
 onNavigateToPurchaseOrder={handleNavigateToPurchaseOrder}
 />
 );
 case 'logistica':
 return <EmbarquesPage />;
 case 'showroom-expos':
 return <ShowroomExposPage />;
 case 'requisiciones':
 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 <div className="space-y-1">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
 Cadena de Suministro & Abastecimiento
 </span>
 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
 Requisiciones
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Solicitudes internas, autorización y diagnóstico de reorden de compra.
 </p>
 </div>

 <RequisicionesTab
 requisitions={requisitions}
 onSetRequisitions={setRequisitions}
 onNavigateToPurchasesTab={() => {
 setTargetPurchaseOrderFolio(null);
 setActiveTab('compras');
 }}
 />
 </div>
 );
 case 'compras':
 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 <div className="space-y-1">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
 Cadena de Suministro & Abastecimiento
 </span>
 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
 Compras
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Órdenes de compra, compromisos con proveedores y seguimiento de entregas.
 </p>
 </div>

 <ComprasTab
 requisitions={requisitions}
 onUpdateRequisition={handleUpdateRequisition}
 orders={orders}
 onUpdateOrder={handleUpdateOrder}
 onAddOrder={handleAddOrder}
 initialSelectedOrderFolio={targetPurchaseOrderFolio}
 onNavigateToInbound={handleNavigateToInbound}
 />
 </div>
 );
 case 'proveedores':
 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 <div className="space-y-1">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
 Cadena de Suministro & Abastecimiento
 </span>
 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
 Proveedores
 </h1>
 <p className="text-xs sm:text-sm text-theme-muted">
 Directorio maestro de proveedores, condiciones comerciales y expediente digital.
 </p>
 </div>

 <ProveedoresTab
 suppliers={suppliers}
 onSetSuppliers={setSuppliers}
 />
 </div>
 );
  case 'cotizaciones':
  return (
  <CotizacionesPage
  quotes={quotes}
  customers={customers}
  priceLists={priceLists}
  onSaveQuote={handleSaveQuote}
  onUpdateQuoteStatus={handleUpdateQuoteStatus}
  onSaveCustomer={handleSaveCustomer}
  onGenerateOrderFromQuote={handleGenerateOrderFromQuote}
  onNavigateToOrder={(folio) => {
    setTargetOrderFolio(folio);
    setActiveTab('pedidos');
  }}
  initialPreselectedCustomerId={targetQuoteCustomerId}
  initialSelectedQuoteFolio={targetQuoteFolio}
  />
  );
  case 'pedidos':
  return (
  <PedidosPage
  orders={salesOrders}
  quotes={quotes}
  onAuthorizeOrder={handleAuthorizeSalesOrder}
  onRequestAdjustmentOrder={handleRequestAdjustmentSalesOrder}
  onRejectOrder={handleRejectSalesOrder}
  onNavigateToRequisitions={(sku) => {
  setActiveTab('requisiciones');
  }}
  onNavigateToQuote={(folio) => {
    setTargetQuoteFolio(folio);
    setTargetQuoteCustomerId(null);
    setActiveTab('cotizaciones');
  }}
  initialSelectedOrderFolio={targetOrderFolio}
  />
  );
 case 'clientes':
 return (
 <ClientesPage
 customers={customers}
 quotes={quotes}
 orders={salesOrders}
 onSaveCustomer={handleSaveCustomer}
 onStartQuoteForCustomer={handleStartQuoteForCustomer}
 />
 );
 case 'configuracion':
 return <ConfiguracionView />;
 default:
 return <DashboardInicio onNavigate={(tab) => setActiveTab(tab)} />;
 }
 };

 return (
 <div className="min-h-screen bg-theme-base text-theme-main flex flex-col lg:flex-row font-sans transition-colors duration-200">
 {/* Sidebar Navigation */}
 <Sidebar
 activeTab={activeTab}
 onSelectTab={(tab) => {
 setTargetPurchaseOrderFolio(null);
 setTargetInboundFolio(null);
 setActiveTab(tab);
 }}
 isOpenMobile={isOpenMobile}
 onCloseMobile={() => setIsOpenMobile(false)}
 onLogout={onLogout}
 />

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col min-w-0 bg-theme-base">
 <Topbar
 onOpenMobileMenu={() => setIsOpenMobile(true)}
 onLogout={onLogout}
 />

 <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1520px] w-full mx-auto">
 {renderContent()}
 </main>
 </div>
 </div>
 );
};
