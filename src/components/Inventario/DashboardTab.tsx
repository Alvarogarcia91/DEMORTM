import React, { useState } from 'react';
import { 
 Building2, 
 Store, 
 Boxes, 
 DollarSign, 
 CheckCircle2, 
 Clock, 
 AlertTriangle, 
 ArrowLeftRight, 
 Flame, 
 Map as MapIcon, 
 Sparkles, 
 Truck, 
 Package, 
 ChevronRight, 
 Eye, 
 Layers, 
 TrendingUp, 
 Info,
 ShieldAlert,
 ArrowUpRight,
 ShieldCheck,
 Percent
} from 'lucide-react';
import { 
 MOCK_WAREHOUSES_LIST, 
 WarehouseLayout,
 MOCK_INVENTORY_MOVEMENTS,
 InventoryMovement
} from '../../data/mockInventoryData';
import { 
 NODE_DASHBOARD_DATA, 
 NodeDashboardData 
} from '../../data/mockAnalyticsData';
import { StatusBadge } from '../common/StatusBadge';
import { SemanticVariant } from '../common/semanticTokens';

interface DashboardTabProps {
 onNavigateTab?: (tabKey: string) => void;
 onShowToast?: (msg: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
 onNavigateTab,
 onShowToast,
}) => {
  const defaultWarehouseId = MOCK_WAREHOUSES_LIST[0]?.id || 'wh-alm-rtm';
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(defaultWarehouseId);
  const [isCostBreakdownOpen, setIsCostBreakdownOpen] = useState<boolean>(false);
  const [movementFilter, setMovementFilter] = useState<'ALL' | 'IN' | 'OUT' | 'INTERNAL'>('ALL');

  const activeNodeData: NodeDashboardData = 
    NODE_DASHBOARD_DATA[selectedWarehouseId] || 
    NODE_DASHBOARD_DATA['wh-alm-rtm'] || 
    Object.values(NODE_DASHBOARD_DATA)[0];
  const warehouseMeta = MOCK_WAREHOUSES_LIST.find(w => w.id === selectedWarehouseId) || MOCK_WAREHOUSES_LIST[0];

 const formatMxn = (val: number) => {
 if (val >= 1000000) {
 return `$${(val / 1000000).toFixed(2)} M MXN`;
 }
 if (val >= 1000) {
 return `$${(val / 1000).toFixed(1)} K MXN`;
 }
 return `$${val.toLocaleString()} MXN`;
 };

 const getHealthVariant = (status: string): SemanticVariant => {
 switch (status) {
 case 'Alta rotación':
 return 'success';
 case 'Saludable':
 return 'info';
 case 'Cobertura baja':
 return 'warning';
 case 'Sin movimiento':
 return 'danger';
 case 'En tránsito':
 return 'smart';
 default:
 return 'neutral';
 }
 };

 const handleCtaClick = (action: string) => {
 if (onNavigateTab) {
 onNavigateTab(action);
 }
 if (onShowToast) {
 onShowToast(`Navegando a ${action.toUpperCase()}`);
 }
 };

 // Recent movements filtered or relevant to node
 const recentMovements = MOCK_INVENTORY_MOVEMENTS.slice(0, 6);

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full pb-8">
 
 {/* ========================================================================= */}
 {/* 1. SELECTOR SUPERIOR DE NODO LOGÍSTICO (ALMACÉN & CONTROL) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Visión Ejecutiva & Operativa &middot; Impresos RTM
 </span>
 <StatusBadge variant="success" label="En Tiempo Real" size="sm" />
 </div>
 <h2 className="text-base sm:text-lg font-black text-theme-main flex items-center gap-2">
 {activeNodeData.type === 'CEDIS' ? (
 <Building2 className="w-5 h-5 text-theme-primary shrink-0" />
 ) : (
 <Store className="w-5 h-5 text-emerald-600 shrink-0" />
 )}
 <span>Dashboard: {activeNodeData.warehouseName}</span>
 </h2>
 </div>

 {/* Node Toggle Pills */}
 <div className="flex items-center gap-1.5 flex-wrap">
 {MOCK_WAREHOUSES_LIST.map((wh) => {
 const isSelected = selectedWarehouseId === wh.id;
 const isCedis = wh.type.includes('Distribución') || wh.type.includes('Primario') || wh.type.includes('Regional');

 return (
 <button
 key={wh.id}
 onClick={() => setSelectedWarehouseId(wh.id)}
 className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
 isSelected
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
 }`}
 >
 {isCedis ? <Building2 className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5 text-emerald-500" />}
 <span>{wh.name.replace('CEDIS ', '').replace('Sucursal ', '')}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 2. KPIs PRINCIPALES & VALOR DE INVENTARIO A COSTO */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
 
 {/* Total Units */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Inventario Total</span>
 <div className="w-7 h-7 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center">
 <Boxes className="w-4 h-4" />
 </div>
 </div>
 <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block">
 {activeNodeData.kpis.totalUnits.toLocaleString()}
 </strong>
 <span className="text-[10px] text-theme-muted font-medium block">
 Unidades físicas en almacén
 </span>
 </div>

 {/* Inventory Cost Value (with breakdown toggle) */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Valor a Costo</span>
 <button
 onClick={() => setIsCostBreakdownOpen(!isCostBreakdownOpen)}
 className="text-[10px] text-theme-primary hover:underline font-bold cursor-pointer"
 >
 {isCostBreakdownOpen ? 'Ocultar' : 'Ver desglose'}
 </button>
 </div>
 <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block">
 {formatMxn(activeNodeData.kpis.inventoryCostValue)}
 </strong>
 <span className="text-[10px] text-theme-muted font-medium block">
 Costo interno de adquisición
 </span>
 </div>

 {/* Disponible */}
 <div className="p-3.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Disponible</span>
 <strong className="text-lg font-mono font-black text-emerald-600 block">
 {activeNodeData.kpis.availableUnits.toLocaleString()}
 </strong>
 <span className="text-[9px] text-theme-muted">Para surtido</span>
 </div>

 {/* Comprometido */}
 <div className="p-3.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Comprometido</span>
 <strong className="text-lg font-mono font-black text-amber-600 block">
 {activeNodeData.kpis.committedUnits.toLocaleString()}
 </strong>
 <span className="text-[9px] text-theme-muted">En órdenes</span>
 </div>

 {/* En Tránsito */}
 <div className="p-3.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">En Tránsito</span>
 <strong className="text-lg font-mono font-black text-blue-600 block">
 {activeNodeData.kpis.inTransitUnits.toLocaleString()}
 </strong>
 <span className="text-[9px] text-theme-muted">Traspasos</span>
 </div>

 {/* Ocupación */}
 <div className="p-3.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ocupación</span>
 <strong className="text-lg font-mono font-black text-purple-600 block">
 {activeNodeData.kpis.occupancyPercentage}%
 </strong>
 <span className="text-[9px] text-theme-muted">Capacidad física</span>
 </div>
 </div>

 {/* Optional Financial Cost Breakdown Accordion */}
 {isCostBreakdownOpen && (
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-150 text-xs shadow-xs">
 <div className="space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">Disponible a Costo</span>
 <strong className="text-xs font-mono font-black text-emerald-600 block">
 {formatMxn(activeNodeData.kpis.costBreakdown.available)}
 </strong>
 </div>
 <div className="space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">Comprometido en Ventas</span>
 <strong className="text-xs font-mono font-black text-amber-600 block">
 {formatMxn(activeNodeData.kpis.costBreakdown.committed)}
 </strong>
 </div>
 <div className="space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">En Tránsito entre Instalaciones</span>
 <strong className="text-xs font-mono font-black text-blue-600 block">
 {formatMxn(activeNodeData.kpis.costBreakdown.inTransit)}
 </strong>
 </div>
 <div className="space-y-0.5">
 <span className="text-[10px] text-theme-muted uppercase font-bold">En Retrabajo / Observado</span>
 <strong className="text-xs font-mono font-black text-rose-600 block">
 {formatMxn(activeNodeData.kpis.costBreakdown.rework)}
 </strong>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* 3. ATENCIÓN REQUERIDA (BLOQUE MUY VISIBLE Y ACCIONABLE) */}
 {/* ========================================================================= */}
 <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 shadow-xs space-y-3">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
 <ShieldAlert className="w-5 h-5" />
 <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
 Atención Requerida &bull; Alertas Operativas de {activeNodeData.warehouseName}
 </h3>
 </div>
 <StatusBadge variant="danger" label={`${activeNodeData.alerts.length} alertas detectadas`} size="sm" />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {activeNodeData.alerts.map((alert) => (
 <div
 key={alert.id}
 className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-2 shadow-2xs"
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white text-zinc-900 border shadow-2xs ${
 alert.severity === 'danger'
 ? 'border-rose-500'
 : alert.severity === 'warning'
 ? 'border-amber-500'
 : 'border-blue-500'
 }`}>
 {alert.severity === 'danger' ? 'Crítico' : alert.severity === 'warning' ? 'Precaución' : 'Informativo'}
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main line-clamp-1">
 {alert.title}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 {alert.description}
 </p>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex justify-end">
 <button
 onClick={() => handleCtaClick(alert.ctaAction)}
 className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>{alert.ctaLabel}</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 4. OPERACIÓN HOY (FLUJO OPERATIVO DEL DÍA) */}
 {/* ========================================================================= */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <TrendingUp className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Flujo Operativo de Hoy &middot; 28 Ago 2026
 </h3>
 </div>
 <span className="text-[10px] text-theme-muted font-mono">Turno Operativo Matutino/Vespertino</span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
 
 {/* 1. Recepción */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 relative overflow-hidden">
 <div className="text-[9px] uppercase font-bold text-theme-muted">1. Recepción</div>
 <strong className="text-lg font-mono font-black text-theme-main block">
 {activeNodeData.todayOperations.received}
 </strong>
 <span className="text-[10px] text-theme-muted block">Unidades descargadas</span>
 </div>

 {/* 2. Acomodo */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 relative overflow-hidden">
 <div className="text-[9px] uppercase font-bold text-theme-muted">2. Acomodo en Rack</div>
 <strong className="text-lg font-mono font-black text-amber-600 block">
 {activeNodeData.todayOperations.pendingStaging}
 </strong>
 <span className="text-[10px] text-theme-muted block">Pendientes de slotting</span>
 </div>

 {/* 3. Picking */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 relative overflow-hidden">
 <div className="text-[9px] uppercase font-bold text-theme-muted">3. Recolección / Surtido</div>
 <strong className="text-lg font-mono font-black text-purple-600 block">
 {activeNodeData.todayOperations.picked}
 </strong>
 <span className="text-[10px] text-theme-muted block">Recolectadas en ruta</span>
 </div>

 {/* 4. Embarque */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 relative overflow-hidden">
 <div className="text-[9px] uppercase font-bold text-theme-muted">4. Embarques / Rampa</div>
 <strong className="text-lg font-mono font-black text-emerald-600 block">
 {activeNodeData.todayOperations.staged}
 </strong>
 <span className="text-[10px] text-theme-muted block">Listas para despacho</span>
 </div>

 {/* 5. Traspasos */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 relative overflow-hidden col-span-2 sm:col-span-1">
 <div className="text-[9px] uppercase font-bold text-theme-muted">5. Traspasos en Ruta</div>
 <strong className="text-lg font-mono font-black text-blue-600 block">
 {activeNodeData.todayOperations.transfersInTransit}
 </strong>
 <span className="text-[10px] text-theme-muted block">Hacia clientes / plantas</span>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 5. DOS COLUMNAS: SALUD DE INVENTARIO + REACOMODOS & MAPA */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* Left Column: Salud del Inventario (Table) */}
 <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Package className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Salud del Inventario por Artículo
 </h3>
 </div>
 <button
 onClick={() => handleCtaClick('stocks')}
 className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Ver catálogo completo</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Artículo / SKU</th>
 <th className="py-2.5 px-2 text-center">Disp.</th>
 <th className="py-2.5 px-2 text-center">Comp.</th>
 <th className="py-2.5 px-2 text-center">Trán.</th>
 <th className="py-2.5 px-2">Antigüedad</th>
 <th className="py-2.5 px-3 text-right">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {activeNodeData.inventoryHealth.map((art) => (
 <tr key={art.sku} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3">
 <div className="min-w-0">
 <span className="font-mono text-[10px] font-bold text-theme-primary block">{art.sku}</span>
 <span className="font-bold text-theme-main line-clamp-1">{art.name}</span>
 </div>
 </td>
 <td className="py-2.5 px-2 font-mono font-bold text-emerald-600 text-center">
 {art.available}
 </td>
 <td className="py-2.5 px-2 font-mono font-bold text-amber-600 text-center">
 {art.committed}
 </td>
 <td className="py-2.5 px-2 font-mono font-bold text-blue-600 text-center">
 {art.inTransit}
 </td>
 <td className="py-2.5 px-2 font-mono text-theme-muted text-[11px]">
 {art.avgAge}d
 </td>
 <td className="py-2.5 px-3 text-right whitespace-nowrap">
 <StatusBadge
 variant={getHealthVariant(art.status)}
 label={art.status}
 size="sm"
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Right Column: Optimización de Layout & Mapa de Calor */}
 <div className="lg:col-span-5 space-y-4">
 
 {/* Card: Reacomodos Sugeridos (Slotting Optimizer) */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Reacomodos Sugeridos
 </h3>
 </div>
 <StatusBadge
 variant="smart"
 label={`${activeNodeData.layoutSummary.activeSuggestions} sugerencias`}
 size="sm"
 />
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between">
 <div>
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Ahorro Estimado de Recorrido</span>
 <strong className="text-base font-mono font-black text-emerald-600">
 ~{activeNodeData.layoutSummary.savedMetersPerDay} metros / día
 </strong>
 </div>
 <button
 onClick={() => handleCtaClick('rearrangements')}
 className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
 >
 Ver reacomodos
 </button>
 </div>

 <div className="space-y-2">
 {activeNodeData.layoutSummary.topRecommendations.map((rec, idx) => (
 <div key={idx} className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1 text-xs">
 <div className="flex items-center justify-between">
 <span className="font-bold text-theme-main line-clamp-1">{rec.productName}</span>
 <span className="font-mono text-[10px] font-bold text-theme-primary">
 {rec.fromLocation} &rarr; {rec.toLocation}
 </span>
 </div>
 <p className="text-[10px] text-theme-muted leading-relaxed">
 {rec.reason}
 </p>
 </div>
 ))}
 </div>
 </div>

 {/* Card: Resumen de Mapa & Mapa de Calor */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Flame className="w-4 h-4 text-amber-500" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Actividad & Mapa de Calor
 </h3>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2 text-xs">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Zona más caliente</span>
 <strong className="text-xs font-mono font-bold text-rose-600">Pasillo A &middot; Nivel B</strong>
 </div>
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Posición Top</span>
 <strong className="text-xs font-mono font-bold text-purple-600">A-B-04 (142 ops)</strong>
 </div>
 </div>

 <div className="flex items-center gap-2 pt-1">
 <button
 onClick={() => handleCtaClick('map')}
 className="flex-1 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center justify-center gap-1.5"
 >
 <MapIcon className="w-3.5 h-3.5" />
 <span>Abrir mapa</span>
 </button>

 <button
 onClick={() => handleCtaClick('heatmap')}
 className="flex-1 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center justify-center gap-1.5"
 >
 <Flame className="w-3.5 h-3.5 text-amber-500" />
 <span>Abrir mapa de calor</span>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 6. ZONAS OPERATIVAS (ALMACÉN RTM) */}
 {/* ========================================================================= */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 {activeNodeData.type === 'CEDIS' ? 'Zonas Operativas del Almacén' : 'Áreas Auxiliares'}
 </h3>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 
 {/* Showroom (For Branch) */}
 {activeNodeData.specialZones.showroom && (
 <div className="p-4 rounded-3xl bg-white border border-purple-500 space-y-1.5 shadow-2xs">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase text-zinc-900">Showroom Retail</span>
 <span className="font-mono text-xs font-black text-zinc-900">
 {activeNodeData.specialZones.showroom.occupied}/{activeNodeData.specialZones.showroom.capacity}
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 {activeNodeData.specialZones.showroom.label}
 </strong>
 <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
 <div
 className="bg-purple-600 h-full rounded-full"
 style={{ width: `${(activeNodeData.specialZones.showroom.occupied / activeNodeData.specialZones.showroom.capacity) * 100}%` }}
 />
 </div>
 </div>
 )}

 {/* Recepción */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle space-y-1.5 shadow-xs">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase text-theme-muted">Recepción & Descarga</span>
 <span className="font-mono text-xs font-bold text-emerald-600">
 {activeNodeData.specialZones.reception.occupied}/{activeNodeData.specialZones.reception.capacity}
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 {activeNodeData.specialZones.reception.label}
 </strong>
 <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
 <div
 className="bg-emerald-500 h-full rounded-full"
 style={{ width: `${(activeNodeData.specialZones.reception.occupied / activeNodeData.specialZones.reception.capacity) * 100}%` }}
 />
 </div>
 </div>

 {/* Retrabajo */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle space-y-1.5 shadow-xs">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase text-theme-muted">Retrabajo / Incidencias</span>
 <span className="font-mono text-xs font-bold text-rose-600">
 {activeNodeData.specialZones.rework.occupied}/{activeNodeData.specialZones.rework.capacity}
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 {activeNodeData.specialZones.rework.label}
 </strong>
 <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
 <div
 className="bg-rose-500 h-full rounded-full"
 style={{ width: `${(activeNodeData.specialZones.rework.occupied / activeNodeData.specialZones.rework.capacity) * 100}%` }}
 />
 </div>
 </div>

 {/* Embarques / Entrega */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle space-y-1.5 shadow-xs">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase text-theme-muted">Carriles de Salida</span>
 <span className="font-mono text-xs font-bold text-blue-600">
 {activeNodeData.specialZones.shipping.occupied}/{activeNodeData.specialZones.shipping.capacity}
 </span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 {activeNodeData.specialZones.shipping.label}
 </strong>
 <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden">
 <div
 className="bg-blue-500 h-full rounded-full"
 style={{ width: `${(activeNodeData.specialZones.shipping.occupied / activeNodeData.specialZones.shipping.capacity) * 100}%` }}
 />
 </div>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 7. ÚLTIMOS MOVIMIENTOS REGISTRADOS */}
 {/* ========================================================================= */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Últimos Movimientos en el Sistema
 </h3>
 <button
 onClick={() => handleCtaClick('movements')}
 className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Ver bitácora completa</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Fecha / Hora</th>
 <th className="py-2.5 px-3">UID / Artículo</th>
 <th className="py-2.5 px-3">Tipo</th>
 <th className="py-2.5 px-3">Origen</th>
 <th className="py-2.5 px-3">Destino</th>
 <th className="py-2.5 px-3">Operador</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {recentMovements.map((mov) => (
 <tr key={mov.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono text-[10px] text-theme-muted whitespace-nowrap">
 {mov.timestamp}
 </td>
 <td className="py-2.5 px-3">
 <span className="font-mono font-bold text-theme-primary block text-[11px]">{mov.uid}</span>
 <span className="text-theme-main font-semibold text-[11px] line-clamp-1">{mov.productName}</span>
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {mov.movementType}
 </span>
 </td>
 <td className="py-2.5 px-3 font-mono text-theme-muted text-[11px] whitespace-nowrap">
 {mov.origin}
 </td>
 <td className="py-2.5 px-3 font-mono font-bold text-theme-main text-[11px] whitespace-nowrap">
 {mov.destination}
 </td>
 <td className="py-2.5 px-3 text-theme-muted text-[11px] whitespace-nowrap">
 {mov.user}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};
