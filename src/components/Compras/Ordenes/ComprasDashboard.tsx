import React, { useState, useMemo } from 'react';
import {
 LayoutDashboard,
 ShoppingCart,
 ShoppingBag,
 Truck,
 Clock,
 CheckCircle2,
 AlertTriangle,
 ArrowRight,
 Building2,
 Calendar,
 DollarSign,
 TrendingUp,
 TrendingDown,
 Percent,
 RefreshCw,
 Eye,
 PackagePlus,
 ShieldCheck,
 ShieldAlert,
 Boxes,
 FileText,
 Filter,
 Users,
 BarChart3,
 Sparkles,
 Layers,
 ArrowUpRight,
 ExternalLink,
 ChevronRight,
 Plus
} from 'lucide-react';
import { PurchaseOrder } from '../../../data/mockPurchasesOrdersData';
import { Requisition } from '../../../data/mockRequisitionsData';
import { PurchaseOrderStatusBadge } from './PurchaseOrderStatusBadge';
import { StatusBadge } from '../../common/StatusBadge';

interface ComprasDashboardProps {
 orders: PurchaseOrder[];
 readyRequisitions: Requisition[];
 allRequisitions?: Requisition[];
 onSelectOrder: (order: PurchaseOrder) => void;
 onOpenCreateOrderWizard: (req: Requisition) => void;
 onNavigateSubTab: (subTab: 'dashboard' | 'por_comprar' | 'ordenes') => void;
 onNavigateToInbound?: (folio: string) => void;
}

export const ComprasDashboard: React.FC<ComprasDashboardProps> = ({
 orders,
 readyRequisitions,
 allRequisitions = [],
 onSelectOrder,
 onOpenCreateOrderWizard,
 onNavigateSubTab,
 onNavigateToInbound,
}) => {
 // Filter states
 const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d');
 const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
 const [selectedSupplier, setSelectedSupplier] = useState<string>('ALL');
 const [isRefreshing, setIsRefreshing] = useState(false);

 const handleRefresh = () => {
 setIsRefreshing(true);
 setTimeout(() => setIsRefreshing(false), 350);
 };

 // Filtered orders based on destination and supplier
 const filteredOrders = useMemo(() => {
 return orders.filter((o) => {
 if (selectedWarehouse !== 'ALL' && o.targetWarehouseId !== selectedWarehouse) return false;
 if (selectedSupplier !== 'ALL' && o.supplierId !== selectedSupplier) return false;
 return true;
 });
 }, [orders, selectedWarehouse, selectedSupplier]);

 // Unique suppliers list for filter dropdown
 const suppliersList = useMemo(() => {
 const map = new Map<string, string>();
 orders.forEach((o) => map.set(o.supplierId, o.supplierTradeName));
 return Array.from(map.entries());
 }, [orders]);

 // ---------------------------------------------------------------------------
 // 6 KPIs CALCULATIONS
 // ---------------------------------------------------------------------------
 const porComprarReqs = readyRequisitions;
 const porComprarUnits = porComprarReqs.reduce(
 (acc, r) => acc + r.items.reduce((sum, it) => sum + it.quantity, 0),
 0
 );

 const openOrders = filteredOrders.filter(
 (o) => o.status !== 'Recibida' && o.status !== 'Cancelada'
 );
 const openOrdersTotalMxn = openOrders.reduce((sum, o) => sum + o.total, 0);

 const inTransitOrders = filteredOrders.filter((o) => o.status === 'En tránsito');
 const inTransitUnits = inTransitOrders.reduce(
 (acc, o) => acc + o.items.reduce((sum, it) => sum + it.pendingQuantity, 0),
 0
 );

 const thisWeekDeliveries = filteredOrders.filter(
 (o) =>
 o.status === 'En tránsito' ||
 o.status === 'Confirmada por proveedor' ||
 o.status === 'Emitida' ||
 o.status === 'Parcialmente recibida' ||
 o.status === 'Atrasada'
 );
 const thisWeekUnits = thisWeekDeliveries.reduce(
 (acc, o) => acc + o.items.reduce((sum, it) => sum + it.pendingQuantity, 0),
 0
 );

 const delayedOrders = filteredOrders.filter((o) => o.status === 'Atrasada');

 const activeSuppliersCount = 18;
 const creditSuppliersCount = 11;

 // ---------------------------------------------------------------------------
 // SUPPLY FUNNEL (FLUJO DE COMPRA)
 // ---------------------------------------------------------------------------
 const totalRequisitionsCount = allRequisitions.length > 0 ? allRequisitions.length : 7;
 const readyForPurchaseCount = porComprarReqs.length > 0 ? porComprarReqs.length : 4;
 const openOrdersCount = openOrders.length > 0 ? openOrders.length : 7;
 const inTransitCount = inTransitOrders.length > 0 ? inTransitOrders.length : 3;
 const byReceiveCount = thisWeekDeliveries.length > 0 ? thisWeekDeliveries.length : 5;

 // ---------------------------------------------------------------------------
 // RISK OF STOCKOUT DATA (RIESGO DE ABASTECIMIENTO)
  // ---------------------------------------------------------------------------
  const stockRisks = [
    {
      sku: 'MP-COU-090',
      name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
      warehouse: 'Almacén Principal RTM',
      available: 1,
      inTransit: 4,
      monthlyConsumption: 12,
      coverageMonths: 0.1,
      status: 'Crítico' as const,
      suggestedQty: 4,
    },
    {
      sku: 'MP-BOP-WHT',
      name: 'Sustrato BOPP Blanco Brillante 60 mic',
      warehouse: 'Almacén Principal RTM',
      available: 2,
      inTransit: 10,
      monthlyConsumption: 16,
      coverageMonths: 0.25,
      status: 'Crítico' as const,
      suggestedQty: 8,
    },
    {
      sku: 'TIN-CYN-001',
      name: 'Tinta Flexográfica Process Cyan',
      warehouse: 'Almacén Principal RTM',
      available: 4,
      inTransit: 12,
      monthlyConsumption: 14,
      coverageMonths: 0.71,
      status: 'En riesgo' as const,
      suggestedQty: 16,
    },
    {
      sku: 'MP-SBS-240',
      name: 'Cartulina Sulfatada SBS 240 g / 14 pts',
      warehouse: 'Almacén Principal RTM',
      available: 5,
      inTransit: 3,
      monthlyConsumption: 8,
      coverageMonths: 1.82,
      status: 'Cubierto' as const,
      suggestedQty: 0,
    },
  ];

 // ---------------------------------------------------------------------------
 // TOP PURCHASED ARTICLES
  // ---------------------------------------------------------------------------
  const topArticles = [
    {
      sku: 'MP-COU-090',
      name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
      purchasedUnits: 48,
      totalAmount: 384000,
      supplier: 'Bio-Pappel S.A.B. de C.V.',
    },
    {
      sku: 'MP-BOP-WHT',
      name: 'Sustrato BOPP Blanco Brillante 60 mic',
      purchasedUnits: 32,
      totalAmount: 288000,
      supplier: 'Avery Dennison México',
    },
    {
      sku: 'TIN-CYN-001',
      name: 'Tinta Flexográfica Process Cyan',
      purchasedUnits: 28,
      totalAmount: 112000,
      supplier: 'Sun Chemical México',
    },
    {
      sku: 'MP-SBS-240',
      name: 'Cartulina Sulfatada SBS 240 g / 14 pts',
      purchasedUnits: 24,
      totalAmount: 216000,
      supplier: 'WestRock Empaques México',
    },
  ];

 // ---------------------------------------------------------------------------
 // SUPPLIER PERFORMANCE MOCK DATA
 // ---------------------------------------------------------------------------
 const supplierPerformance = [
 {
 name: 'Sun Chemical México',
 ordersCount: 8,
 onTimeRate: 94,
 avgLeadDays: 4,
 incidents: 1,
 status: 'Bueno' as const,
 },
 {
 name: 'Bio-Pappel',
 ordersCount: 5,
 onTimeRate: 96,
 avgLeadDays: 5,
 incidents: 0,
 status: 'Bueno' as const,
 },
 {
 name: 'Fasson Avery Dennison',
 ordersCount: 4,
 onTimeRate: 91,
 avgLeadDays: 6,
 incidents: 1,
 status: 'Bueno' as const,
 },
 {
 name: 'WestRock México',
 ordersCount: 6,
 onTimeRate: 82,
 avgLeadDays: 7,
 incidents: 2,
 status: 'Atención' as const,
 },
 ];

 // ---------------------------------------------------------------------------
 // PRICE VARIATION DATA
  // ---------------------------------------------------------------------------
  const priceVariations = [
    {
      sku: 'MP-COU-090',
      name: 'Papel Couché 90 g',
      refPrice: 7800,
      lastPrice: 8000,
      variationPercent: 2.5,
      supplier: 'Bio-Pappel',
    },
    {
      sku: 'MP-BOP-WHT',
      name: 'Sustrato BOPP Blanco',
      refPrice: 8800,
      lastPrice: 9000,
      variationPercent: 2.2,
      supplier: 'Avery Dennison',
    },
    {
      sku: 'TIN-CYN-001',
      name: 'Tinta Flexo Cyan',
      refPrice: 3900,
      lastPrice: 3900,
      variationPercent: 0.0,
      supplier: 'Sun Chemical',
    },
    {
      sku: 'MP-SBS-240',
      name: 'Cartulina SBS 240g',
      refPrice: 9200,
      lastPrice: 8900,
      variationPercent: -3.2,
      supplier: 'WestRock',
    },
  ];

 // ---------------------------------------------------------------------------
 // PURCHASES BY DESTINATION
 // ---------------------------------------------------------------------------
 const destinationsData = [
 {
 name: 'Almacén Materia Prima',
 amount: 210000,
 inTransitUnits: 42,
 type: 'CEDIS',
 },
 {
 name: 'Almacén Producto Terminado',
 amount: 132000,
 inTransitUnits: 18,
 type: 'CEDIS',
 },
 {
 name: 'Almacén Auxiliar Reynosa',
 amount: 64000,
 inTransitUnits: 12,
 type: 'Sucursal',
 },
 {
 name: 'Almacén Matamoros',
 amount: 22000,
 inTransitUnits: 6,
 type: 'Sucursal',
 },
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* ========================================================================= */}
 {/* 1. HEADER & CONTROL TOOLBAR */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center">
 <LayoutDashboard className="w-4 h-4" />
 </div>
 <h2 className="text-lg font-black text-theme-main tracking-tight">
 Dashboard de Compras
 </h2>
 </div>
 <p className="text-xs text-theme-muted">
 Control de necesidades, órdenes, proveedores y entregas pendientes para Impresos RTM.
 </p>
 </div>

 {/* Quick Filters */}
 <div className="flex flex-wrap items-center gap-2.5">
 {/* Period Selector */}
 <div className="flex items-center p-1 bg-theme-muted/60 rounded-2xl border border-theme-subtle text-xs">
 {(
 [
 { id: 'today', label: 'Hoy' },
 { id: '7d', label: '7 días' },
 { id: '30d', label: '30 días' },
 { id: '90d', label: '90 días' },
 ] as const
 ).map((p) => (
 <button
 key={p.id}
 onClick={() => setSelectedPeriod(p.id)}
 className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
 selectedPeriod === p.id
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 {p.label}
 </button>
 ))}
 </div>

 {/* Destination Selector */}
 <select
 value={selectedWarehouse}
 onChange={(e) => setSelectedWarehouse(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-1.5 text-xs font-bold text-theme-main cursor-pointer focus:outline-none"
 >
 <option value="ALL">Todos los destinos</option>
 <option value="wh-mty-norte">Almacén Materia Prima</option>
 <option value="wh-mty-sur">Almacén Producto Terminado</option>
 <option value="wh-reynosa-aux">Almacén Auxiliar Reynosa</option>
 <option value="wh-matamoros">Almacén Matamoros</option>
 </select>

 {/* Supplier Selector */}
 <select
 value={selectedSupplier}
 onChange={(e) => setSelectedSupplier(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-1.5 text-xs font-bold text-theme-main cursor-pointer focus:outline-none"
 >
 <option value="ALL">Todos los proveedores</option>
 {suppliersList.map(([id, name]) => (
 <option key={id} value={id}>
 {name}
 </option>
 ))}
 </select>

 {/* Refresh Button */}
 <button
 onClick={handleRefresh}
 className="p-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-colors cursor-pointer"
 title="Actualizar datos del dashboard"
 >
 <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
 </button>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 2. 6 KPIS PRINCIPALES (Fondo Blanco Semántico) */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
 
 {/* KPI 1: REQUISICIONES POR COMPRAR */}
 <div
 onClick={() => onNavigateSubTab('por_comprar')}
 className="p-4 rounded-3xl bg-theme-surface border border-emerald-500/35 shadow-2xs space-y-1 cursor-pointer hover:border-emerald-500/60 transition-all group"
 >
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
 <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
 Por Comprar
 </span>
 <strong className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-400 block">
 {porComprarReqs.length}
 </strong>
 <span className="text-[10px] text-theme-muted block truncate">
 {porComprarUnits > 0 ? `${porComprarUnits} u. solicitadas` : '32 u. solicitadas'}
 </span>
 <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5 pt-1.5 border-t border-theme-subtle group-hover:underline">
 <span>Ver por comprar</span>
 <ArrowRight className="w-2.5 h-2.5" />
 </span>
 </div>

 {/* KPI 2: ÓRDENES ABIERTAS */}
 <div
 onClick={() => onNavigateSubTab('ordenes')}
 className="p-4 rounded-3xl bg-theme-surface border border-blue-500/35 shadow-2xs space-y-1 cursor-pointer hover:border-blue-500/60 transition-all group"
 >
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
 <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
 Órdenes Abiertas
 </span>
 <strong className="text-2xl font-mono font-black text-blue-700 dark:text-blue-400 block">
 {openOrders.length > 0 ? openOrders.length : 7}
 </strong>
 <span className="text-[10px] text-theme-muted block truncate font-mono font-bold">
 ${openOrdersTotalMxn > 0 ? openOrdersTotalMxn.toLocaleString('es-MX') : '428,650'} MXN
 </span>
 <span className="text-[10px] font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-0.5 pt-1.5 border-t border-theme-subtle group-hover:underline">
 <span>Ver órdenes</span>
 <ArrowRight className="w-2.5 h-2.5" />
 </span>
 </div>

 {/* KPI 3: EN TRÁNSITO */}
 <div
 onClick={() => onNavigateSubTab('ordenes')}
 className="p-4 rounded-3xl bg-theme-surface border border-purple-500/35 shadow-2xs space-y-1 cursor-pointer hover:border-purple-500/60 transition-all group"
 >
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
 <Truck className="w-3.5 h-3.5 text-purple-600" />
 En Tránsito
 </span>
 <strong className="text-2xl font-mono font-black text-purple-700 dark:text-purple-400 block">
 {inTransitOrders.length > 0 ? inTransitOrders.length : 3}{' '}
 <span className="text-xs font-semibold text-theme-muted font-sans">ócs</span>
 </strong>
 <span className="text-[10px] text-theme-muted block truncate font-mono">
 {inTransitUnits > 0 ? `${inTransitUnits} u. en ruta` : '48 unidades'}
 </span>
 <span className="text-[10px] font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-0.5 pt-1.5 border-t border-theme-subtle group-hover:underline">
 <span>Monitorear</span>
 <ArrowRight className="w-2.5 h-2.5" />
 </span>
 </div>

 {/* KPI 4: POR RECIBIR ESTA SEMANA */}
 <div
 onClick={() => {
 if (onNavigateToInbound) onNavigateToInbound('OC-2026-0081');
 }}
 className="p-4 rounded-3xl bg-theme-surface border border-blue-500/35 shadow-2xs space-y-1 cursor-pointer hover:border-blue-500/60 transition-all group"
 >
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
 <Boxes className="w-3.5 h-3.5 text-blue-600" />
 Por Recibir Semana
 </span>
 <strong className="text-2xl font-mono font-black text-blue-700 dark:text-blue-400 block">
 {thisWeekDeliveries.length > 0 ? thisWeekDeliveries.length : 5}{' '}
 <span className="text-xs font-semibold text-theme-muted font-sans">ócs</span>
 </strong>
 <span className="text-[10px] text-theme-muted block truncate font-mono">
 {thisWeekUnits > 0 ? `${thisWeekUnits} unidades` : '72 unidades'}
 </span>
 <span className="text-[10px] font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-0.5 pt-1.5 border-t border-theme-subtle group-hover:underline">
 <span>Mesa de verificación</span>
 <ArrowRight className="w-2.5 h-2.5" />
 </span>
 </div>

 {/* KPI 5: ATRASADAS */}
 <div
 onClick={() => onNavigateSubTab('ordenes')}
 className="p-4 rounded-3xl bg-theme-surface border border-rose-500/35 shadow-2xs space-y-1 cursor-pointer hover:border-rose-500/60 transition-all group"
 >
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
 <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
 Atrasadas
 </span>
 <strong className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400 block">
 {delayedOrders.length > 0 ? delayedOrders.length : 1}
 </strong>
 <span className="text-[10px] text-theme-muted block truncate font-mono">
 2 días de atraso
 </span>
 <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-0.5 pt-1.5 border-t border-theme-subtle group-hover:underline">
 <span>Dar seguimiento</span>
 <ArrowRight className="w-2.5 h-2.5" />
 </span>
 </div>

 {/* KPI 6: PROVEEDORES ACTIVOS */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-amber-500/35 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
 <Users className="w-3.5 h-3.5 text-amber-600" />
 Proveedores Activos
 </span>
 <strong className="text-2xl font-mono font-black text-amber-900 dark:text-amber-300 block">
 {activeSuppliersCount}
 </strong>
 <span className="text-[10px] text-theme-muted block truncate font-mono">
 {creditSuppliersCount} con línea de crédito
 </span>
 <span className="text-[10px] text-theme-muted block pt-1.5 border-t border-theme-subtle font-semibold">
 Directorio maestro
 </span>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 3. FLUJO DE COMPRA (SUPPLY FUNNEL BANNER) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Layers className="w-4 h-4 text-rose-600" />
 <span>Flujo Operativo de Abastecimiento</span>
 </span>
 <span className="text-[11px] text-theme-muted">
 Actividad actual del proceso de abastecimiento Impresos RTM.
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
 <div
 onClick={() => onNavigateSubTab('por_comprar')}
 className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle text-center space-y-0.5 cursor-pointer hover:border-theme-primary transition-all group shadow-2xs"
 >
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Requisiciones</span>
 <strong className="text-lg font-black font-mono text-theme-main group-hover:text-rose-600">
 {totalRequisitionsCount}
 </strong>
 </div>

 <div
 onClick={() => onNavigateSubTab('por_comprar')}
 className="p-3 rounded-2xl bg-theme-surface border border-emerald-600/50 text-center space-y-0.5 cursor-pointer hover:border-emerald-600 transition-all group shadow-2xs"
 >
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
 <span>Listas para Compra</span>
 </span>
 <strong className="text-lg font-black font-mono text-zinc-900 group-hover:text-emerald-600">
 {readyForPurchaseCount}
 </strong>
 </div>

 <div
 onClick={() => onNavigateSubTab('ordenes')}
 className="p-3 rounded-2xl bg-theme-surface border border-blue-600/50 text-center space-y-0.5 cursor-pointer hover:border-blue-600 transition-all group shadow-2xs"
 >
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 <span>Órdenes Abiertas</span>
 </span>
 <strong className="text-lg font-black font-mono text-zinc-900 group-hover:text-blue-600">
 {openOrdersCount}
 </strong>
 </div>

 <div
 onClick={() => onNavigateSubTab('ordenes')}
 className="p-3 rounded-2xl bg-theme-surface border border-purple-600/50 text-center space-y-0.5 cursor-pointer hover:border-purple-600 transition-all group shadow-2xs"
 >
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
 <span>En Tránsito</span>
 </span>
 <strong className="text-lg font-black font-mono text-zinc-900 group-hover:text-purple-600">
 {inTransitCount}
 </strong>
 </div>

 <div
 onClick={() => {
 if (onNavigateToInbound) onNavigateToInbound('OC-2026-0081');
 }}
 className="p-3 rounded-2xl bg-theme-surface border border-blue-600/50 text-center space-y-0.5 cursor-pointer hover:border-blue-600 transition-all group shadow-2xs"
 >
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 <span>Por Recibir</span>
 </span>
 <strong className="text-lg font-black font-mono text-zinc-900 group-hover:text-blue-600">
 {byReceiveCount}
 </strong>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 4. ATENCIÓN REQUERIDA (ACTIONABLE ALERT CARDS) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <ShieldAlert className="w-4 h-4 text-amber-500" />
 <span>Atención Requerida en Abastecimiento</span>
 </span>
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
 Prioridad operativa
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 
 {/* Card A: Atrasada OC-2026-0078 */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-rose-500/35 space-y-2.5 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono font-black text-rose-600 text-xs">OC-2026-0078</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-surface text-rose-950 dark:text-rose-200 border border-rose-500/35 shadow-2xs">
 2 días atraso
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">WestRock México</strong>
 <p className="text-[11px] text-theme-muted font-mono">$82,400 MXN &bull; 18 unidades</p>
 </div>

 <button
 onClick={() => {
 const ord = orders.find((o) => o.folio === 'OC-2026-0078');
 if (ord) onSelectOrder(ord);
 }}
 className="w-full py-1.5 px-3 rounded-xl bg-theme-muted hover:bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <span>Dar seguimiento</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Card B: Requisición Lista REQ-2026-0047 */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-emerald-500/35 space-y-2.5 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono font-black text-emerald-600 text-xs">REQ-2026-0047</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-surface text-emerald-950 dark:text-emerald-200 border border-emerald-500/35 shadow-2xs">
 Lista para compra
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">Papel Couché 90 g</strong>
 <p className="text-[11px] text-theme-muted font-mono">12 unidades &bull; CEDIS Norte</p>
 </div>

 <button
 onClick={() => {
 const req = readyRequisitions[0];
 if (req) onOpenCreateOrderWizard(req);
 else onNavigateSubTab('por_comprar');
 }}
 className="w-full py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Crear OC</span>
 </button>
 </div>

 {/* Card C: Entrega esperada hoy OC-2026-0081 */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-blue-500/35 space-y-2.5 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono font-black text-blue-600 text-xs">OC-2026-0081</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-surface text-blue-950 dark:text-blue-200 border border-blue-500/35 shadow-2xs">
 Entrega hoy
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">Sun Chemical México</strong>
 <p className="text-[11px] text-theme-muted font-mono">19 unidades &bull; CEDIS Norte</p>
 </div>

 <button
 onClick={() => {
 const ord = orders.find((o) => o.folio === 'OC-2026-0081');
 if (ord) onSelectOrder(ord);
 }}
 className="w-full py-1.5 px-3 rounded-xl bg-theme-muted hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Ver orden</span>
 </button>
 </div>

 {/* Card D: Documento de Proveedor por vencer */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-amber-500/35 space-y-2.5 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-bold text-amber-950 dark:text-amber-200 text-xs">Proveedor</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-surface text-amber-950 dark:text-amber-200 border border-amber-500/35 shadow-2xs">
 Doc. por vencer
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">Bio-Pappel</strong>
 <p className="text-[11px] text-theme-muted">Opinión 32-D SAT vence en 4 días</p>
 </div>

 <button
 onClick={() => {
 // Navigate to suppliers tab if available
 }}
 className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-bold text-xs border border-amber-500 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Ver expediente</span>
 </button>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 5. GRÁFICAS: COMPRAS EMITIDAS & ÓRDENES POR ESTADO */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
 
 {/* Gráfica: Compras Emitidas por Periodo */}
 <div className="lg:col-span-2 bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <BarChart3 className="w-4 h-4 text-rose-600" />
 <span>Compras Emitidas por Semana</span>
 </h3>
 <p className="text-[11px] text-theme-muted">
 Volumen monetario de órdenes de compra autorizadas y emitidas a proveedores.
 </p>
 </div>
 <span className="text-xs font-mono font-black text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-xl">
 $548,000 MXN total
 </span>
 </div>

 <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-theme-subtle">
 {[
 { label: 'Semana 1', amount: 120000, height: '65%' },
 { label: 'Semana 2', amount: 184000, height: '100%' },
 { label: 'Semana 3', amount: 98000, height: '53%' },
 { label: 'Semana 4', amount: 146000, height: '79%' },
 ].map((bar) => (
 <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
 <span className="text-[10px] font-mono font-bold text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity">
 ${(bar.amount / 1000).toFixed(0)}k
 </span>
 <div
 style={{ height: bar.height }}
 className="w-full max-w-[56px] bg-rose-600 hover:bg-rose-700 rounded-t-xl transition-all shadow-xs"
 />
 <span className="text-[10px] font-bold text-theme-muted whitespace-nowrap">
 {bar.label}
 </span>
 </div>
 ))}
 </div>

 <div className="flex items-center justify-between text-[11px] text-theme-muted font-mono">
 <span>Promedio semanal: <strong>$137,000 MXN</strong></span>
 <span>Pico: <strong>Semana 2 ($184,000 MXN)</strong></span>
 </div>
 </div>

 {/* Gráfica: Órdenes por Estado */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Órdenes por Estado
 </h3>
 <p className="text-[11px] text-theme-muted">
 Distribución de las órdenes activas en el sistema.
 </p>
 </div>

 <div className="space-y-2.5">
 {[
 { label: 'Emitidas', count: 2, percent: '22%', color: 'bg-blue-500' },
 { label: 'Confirmadas', count: 2, percent: '22%', color: 'bg-purple-500' },
 { label: 'En tránsito', count: 3, percent: '33%', color: 'bg-indigo-500' },
 { label: 'Parciales', count: 1, percent: '11%', color: 'bg-amber-500' },
 { label: 'Atrasadas', count: 1, percent: '11%', color: 'bg-rose-500' },
 ].map((st) => (
 <div key={st.label} className="space-y-1">
 <div className="flex items-center justify-between text-xs">
 <span className="font-semibold text-theme-main flex items-center gap-2">
 <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
 {st.label}
 </span>
 <span className="font-mono font-bold text-theme-muted">
 {st.count} <span className="text-[10px]">({st.percent})</span>
 </span>
 </div>
 <div className="w-full bg-theme-muted rounded-full h-1.5 overflow-hidden">
 <div className={`h-full ${st.color}`} style={{ width: st.percent }} />
 </div>
 </div>
 ))}
 </div>

 <div className="pt-2 border-t border-theme-subtle text-center">
 <button
 onClick={() => onNavigateSubTab('ordenes')}
 className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
 >
 <span>Ver todas las órdenes</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 6. RIESGO DE ABASTECIMIENTO (CRITICAL STOCKOUT RISK) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-rose-600" />
 <span>Riesgo de Abastecimiento & Cobertura</span>
 </h3>
 <p className="text-xs text-theme-muted">
 Diagnóstico de existencias disponibles, inventario en tránsito y semanas de cobertura proyectadas.
 </p>
 </div>
 <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-xl">
 2 artículos en estado crítico
 </span>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo Impresos RTM</th>
 <th className="py-2.5 px-3">Destino</th>
 <th className="py-2.5 px-3 text-center">Disponible</th>
 <th className="py-2.5 px-3 text-center">En Tránsito</th>
 <th className="py-2.5 px-3 text-center">Consumo/mes</th>
 <th className="py-2.5 px-3 text-center">Cobertura</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {stockRisks.map((risk) => (
 <tr key={`${risk.sku}-${risk.warehouse}`} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
 {risk.sku}
 </td>
 <td className="py-3 px-3">
 <strong className="text-theme-main font-bold block text-xs">{risk.name}</strong>
 </td>
 <td className="py-3 px-3 font-semibold text-theme-main whitespace-nowrap">
 {risk.warehouse}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {risk.available} u.
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-purple-600 whitespace-nowrap">
 {risk.inTransit} u.
 </td>
 <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
 {risk.monthlyConsumption} u.
 </td>
 <td className="py-3 px-3 text-center font-mono font-black whitespace-nowrap">
 <span className={risk.coverageMonths < 0.5 ? 'text-rose-600' : 'text-emerald-600'}>
 {risk.coverageMonths} meses
 </span>
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={risk.status === 'Crítico' ? 'danger' : risk.status === 'En riesgo' ? 'warning' : 'success'}
 label={risk.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-3 text-right whitespace-nowrap">
 {risk.status !== 'Cubierto' && (
 <button
 onClick={() => onNavigateSubTab('por_comprar')}
 className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-all shadow-xs flex items-center gap-1 ml-auto cursor-pointer"
 >
 <Plus className="w-3 h-3" />
 <span>Crear requisición</span>
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 7. PRÓXIMAS ENTREGAS & ÓRDENES ATRASADAS */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
 {/* Próximas Entregas */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Calendar className="w-4 h-4 text-blue-600" />
 <span>Próximas Entregas Programadas</span>
 </h3>
 <button
 onClick={() => onNavigateSubTab('ordenes')}
 className="text-[11px] text-theme-primary font-bold hover:underline"
 >
 Ver todas
 </button>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">OC</th>
 <th className="py-2.5 px-3">Proveedor</th>
 <th className="py-2.5 px-3">Destino</th>
 <th className="py-2.5 px-3">Fecha</th>
 <th className="py-2.5 px-3 text-center">Unidades</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {orders.slice(0, 4).map((ord) => {
 const totalUnits = ord.items.reduce((s, i) => s + i.orderedQuantity, 0);
 return (
 <tr key={ord.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
 {ord.folio}
 </td>
 <td className="py-2.5 px-3 font-semibold text-theme-main whitespace-nowrap">
 {ord.supplierTradeName}
 </td>
 <td className="py-2.5 px-3 text-theme-muted text-[11px] whitespace-nowrap">
 {ord.targetWarehouseName}
 </td>
 <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
 {ord.expectedDeliveryDate}
 </td>
 <td className="py-2.5 px-3 text-center font-mono font-bold whitespace-nowrap">
 {totalUnits}
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <PurchaseOrderStatusBadge status={ord.status} />
 </td>
 <td className="py-2.5 px-3 text-right whitespace-nowrap">
 <button
 onClick={() => onSelectOrder(ord)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* Órdenes Atrasadas */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-2">
 <Clock className="w-4 h-4" />
 <span>Órdenes de Compra Atrasadas</span>
 </h3>
 <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-700 px-2 py-0.5 rounded">
 1 orden crítica
 </span>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">OC</th>
 <th className="py-2.5 px-3">Proveedor</th>
 <th className="py-2.5 px-3">Fecha Esperada</th>
 <th className="py-2.5 px-3 text-center">Atraso</th>
 <th className="py-2.5 px-3 text-center">Pendiente</th>
 <th className="py-2.5 px-3 text-right">Monto</th>
 <th className="py-2.5 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 <tr className="hover:bg-rose-500/5 transition-colors">
 <td className="py-3 px-3 font-mono font-black text-rose-600 whitespace-nowrap">
 OC-2026-0078
 </td>
 <td className="py-3 px-3 font-bold text-theme-main whitespace-nowrap">
 WestRock México
 </td>
 <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
 25 Ago 2026
 </td>
 <td className="py-3 px-3 text-center font-bold text-rose-600 whitespace-nowrap">
 2 días
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold whitespace-nowrap">
 18 unidades
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 $82,400
 </td>
 <td className="py-3 px-3 text-right whitespace-nowrap">
 <button
 onClick={() => {
 const ord = orders.find((o) => o.folio === 'OC-2026-0078');
 if (ord) onSelectOrder(ord);
 }}
 className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
 >
 Gestionar
 </button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <p className="text-[11px] text-theme-muted italic">
 * El proveedor reportó demora en fabricación de lotes ortopédicos. Se contactó a ejecutiva comercial.
 </p>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 8. TOP ARTÍCULOS & COMPRAS POR PROVEEDOR */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
 {/* Top Artículos Comprados */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Top Artículos Comprados
 </h3>
 <p className="text-[11px] text-theme-muted">
 Modelos con mayor volumen de unidades y monto acumulado en el periodo.
 </p>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Artículo</th>
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3 text-center">Compradas</th>
 <th className="py-2.5 px-3 text-right">Monto</th>
 <th className="py-2.5 px-3">Proveedor Principal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {topArticles.map((art) => (
 <tr key={art.sku} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-bold text-theme-main">{art.name}</td>
 <td className="py-2.5 px-3 font-mono text-[11px] text-theme-primary">{art.sku}</td>
 <td className="py-2.5 px-3 text-center font-mono font-bold">{art.purchasedUnits} u.</td>
 <td className="py-2.5 px-3 text-right font-mono font-black">${art.totalAmount.toLocaleString('es-MX')}</td>
 <td className="py-2.5 px-3 font-medium text-theme-muted">{art.supplier}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Compras por Proveedor */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Concentración de Compras por Proveedor
 </h3>
 <p className="text-[11px] text-theme-muted">
 Distribución del gasto total emitido entre fabricantes.
 </p>
 </div>

 <div className="space-y-3 pt-2">
 {[
 { name: 'Sun Chemical México', amount: 180000, percent: 38 },
 { name: 'WestRock México', amount: 132000, percent: 28 },
 { name: 'Bio-Pappel', amount: 84000, percent: 18 },
 { name: 'Fasson Avery Dennison', amount: 72000, percent: 15 },
 ].map((p) => (
 <div key={p.name} className="space-y-1">
 <div className="flex items-center justify-between text-xs">
 <span className="font-bold text-theme-main">{p.name}</span>
 <span className="font-mono font-black text-theme-main">
 ${p.amount.toLocaleString('es-MX')} MXN{' '}
 <span className="text-[10px] text-theme-muted font-normal">({p.percent}%)</span>
 </span>
 </div>
 <div className="w-full bg-theme-muted rounded-full h-2 overflow-hidden">
 <div className="h-full bg-rose-600 rounded-full" style={{ width: `${p.percent}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 9. DESEMPEÑO DE PROVEEDORES & VARIACIÓN DE PRECIOS */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
 {/* Desempeño de Proveedores */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Cumplimiento y Desempeño de Proveedores
 </h3>
 <p className="text-[11px] text-theme-muted">
 Entregas a tiempo, tiempos de ciclo promedio e incidencias registradas.
 </p>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Proveedor</th>
 <th className="py-2.5 px-3 text-center">Órdenes</th>
 <th className="py-2.5 px-3 text-center">A Tiempo</th>
 <th className="py-2.5 px-3 text-center">Lead Time</th>
 <th className="py-2.5 px-3 text-center">Incidencias</th>
 <th className="py-2.5 px-3 text-right">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {supplierPerformance.map((sup) => (
 <tr key={sup.name} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-bold text-theme-main">{sup.name}</td>
 <td className="py-2.5 px-3 text-center font-mono">{sup.ordersCount}</td>
 <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{sup.onTimeRate}%</td>
 <td className="py-2.5 px-3 text-center font-mono">{sup.avgLeadDays} días</td>
 <td className="py-2.5 px-3 text-center font-mono">{sup.incidents}</td>
 <td className="py-2.5 px-3 text-right">
 <StatusBadge
 variant={sup.status === 'Bueno' ? 'success' : 'warning'}
 label={sup.status}
 size="sm"
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Variación de Precios */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Variación de Precios de Compra
 </h3>
 <p className="text-[11px] text-theme-muted">
 Comparativa entre precio de referencia pactado y última Orden de Compra emitida.
 </p>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Referencia</th>
 <th className="py-2.5 px-3">Última Compra</th>
 <th className="py-2.5 px-3 text-center">Variación</th>
 <th className="py-2.5 px-3 text-right">Proveedor</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {priceVariations.map((pv) => (
 <tr key={pv.sku} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{pv.sku}</td>
 <td className="py-2.5 px-3 font-mono text-theme-muted">${pv.refPrice.toLocaleString('es-MX')}</td>
 <td className="py-2.5 px-3 font-mono font-bold text-theme-main">${pv.lastPrice.toLocaleString('es-MX')}</td>
 <td className="py-2.5 px-3 text-center font-mono font-black">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border shadow-2xs ${
 pv.variationPercent > 0
 ? 'border-amber-500'
 : pv.variationPercent < 0
 ? 'border-emerald-600 '
 : 'border-zinc-300 '
 }`}>
 {pv.variationPercent > 0 ? `+${pv.variationPercent}%` : `${pv.variationPercent}%`}
 </span>
 </td>
 <td className="py-2.5 px-3 text-right text-theme-muted font-medium">{pv.supplier}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 10. COMPRAS POR DESTINO & RECEPCIÓN */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
 {/* Compras por Destino */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Distribución de Compras por Destino
 </h3>
 <p className="text-[11px] text-theme-muted">
 Monto asignado y unidades en tránsito por CEDIS y piso de venta.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {destinationsData.map((d) => (
 <div key={d.name} className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-bold text-xs text-theme-main">{d.name}</span>
 <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-theme-surface text-theme-muted border border-theme-subtle">
 {d.type}
 </span>
 </div>
 <strong className="text-base font-black font-mono text-rose-600 block">
 ${d.amount.toLocaleString('es-MX')} MXN
 </strong>
 <span className="text-[10px] text-theme-muted font-mono block">
 {d.inTransitUnits} unidades en ruta / tránsito
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Recepción de Compras */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5 flex flex-col justify-between">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Boxes className="w-4 h-4 text-emerald-600" />
 <span>Recepción de Compras en Almacenes</span>
 </h3>
 <p className="text-[11px] text-theme-muted">
 Avance de entradas físicas y validación en Mesa de Verificación.
 </p>
 </div>

 <div className="grid grid-cols-3 gap-3 text-center">
 <div className="p-3 rounded-2xl bg-theme-surface border border-amber-500 shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span>Por Recibir</span>
 </span>
 <strong className="text-xl font-black font-mono text-zinc-900">5</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-blue-500 shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span>Parciales</span>
 </span>
 <strong className="text-xl font-black font-mono text-zinc-900">2</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-emerald-600 shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
 <span>Completas (Sem)</span>
 </span>
 <strong className="text-xl font-black font-mono text-zinc-900">8</strong>
 </div>
 </div>

 <button
 onClick={() => {
 if (onNavigateToInbound) onNavigateToInbound('OC-2026-0081');
 }}
 className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <span>Ver Entradas en Mesa de Verificación</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 11. ACTIVIDAD RECIENTE & OBSERVACIONES */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
 {/* Actividad Reciente */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Clock className="w-4 h-4 text-theme-muted" />
 <span>Actividad Reciente en Compras</span>
 </h3>

 <div className="space-y-3">
 {[
 { time: '27 Ago 22:14', text: 'OC-2026-0084 emitida a Sun Chemical México ($42,000 MXN)', type: 'emit' },
 { time: '27 Ago 21:42', text: 'REQ-2026-0047 autorizada y lista para compra', type: 'auth' },
 { time: '27 Ago 20:18', text: 'OC-2026-0078 marcada como atrasada (2 días de demora)', type: 'delay' },
 { time: '27 Ago 18:31', text: 'OC-2026-0081 recibió 6 de 10 unidades en rampa REC-01', type: 'rec' },
 ].map((act, i) => (
 <div key={i} className="flex items-start gap-3 text-xs">
 <span className="font-mono text-[10px] text-theme-muted whitespace-nowrap pt-0.5">
 {act.time}
 </span>
 <span className="font-medium text-theme-main">
 {act.text}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Observaciones del Periodo */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <span>Observaciones del Periodo</span>
 </h3>

 <ul className="space-y-2.5 text-xs text-theme-main">
 <li className="flex items-start gap-2">
 <span className="text-rose-600 font-bold">&bull;</span>
 <span><strong>Bio-Pappel S.A.B. de C.V.</strong> concentra el mayor monto de compras del periodo ($384,000 MXN).</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-rose-600 font-bold">&bull;</span>
 <span><strong>1 orden de compra (OC-2026-0078)</strong> se encuentra fuera de su fecha esperada de entrega.</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-rose-600 font-bold">&bull;</span>
 <span><strong>Almacén Principal RTM</strong> presenta la menor cobertura en inventario para el insumo crítico MP-COU-090 (0.1 meses).</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-rose-600 font-bold">&bull;</span>
 <span>El <strong>68% de las órdenes abiertas</strong> tiene entrega programada en los próximos 7 días hábiles.</span>
 </li>
 </ul>
 </div>

 </div>

 {/* Mode Demo Notice */}
 <div className="text-center py-2">
 <span className="text-[10px] text-theme-muted font-medium opacity-70">
 Modo demo: los datos históricos y comparativos son simulados para Impresos RTM ERP.
 </span>
 </div>

 </div>
 );
};
