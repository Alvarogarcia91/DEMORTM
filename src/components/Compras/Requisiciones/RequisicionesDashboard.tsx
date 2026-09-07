import React, { useState, useMemo } from 'react';
import {
 Clock,
 CheckCircle2,
 AlertTriangle,
 Sparkles,
 ArrowRight,
 Building2,
 Boxes,
 FileText,
 Truck,
 TrendingDown,
 TrendingUp,
 ShieldAlert,
 BarChart3,
 PieChart,
 Layers,
 ArrowUpRight,
 Filter,
 Download,
 Flame,
 PackageSearch,
 Check,
 Calendar,
 Zap,
 Activity,
 AlertCircle
} from 'lucide-react';
import {
 Requisition,
 ReorderSuggestion,
 DESTINATION_WAREHOUSES
} from '../../../data/mockRequisitionsData';
import { RequisitionStatusBadge } from './RequisitionStatusBadge';

interface RequisicionesDashboardProps {
 requisitions: Requisition[];
 suggestions: ReorderSuggestion[];
 onOpenCreate: () => void;
 onSelectRequisition: (req: Requisition) => void;
 onNavigateSubTab: (subTab: 'dashboard' | 'resumen' | 'requisiciones' | 'sugerencias') => void;
}

export const RequisicionesDashboard: React.FC<RequisicionesDashboardProps> = ({
 requisitions,
 suggestions,
 onOpenCreate,
 onSelectRequisition,
 onNavigateSubTab,
}) => {
 // Period filter state (demo)
 const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '4w' | 'month'>('4w');
 const [showExportToast, setShowExportToast] = useState(false);

 // Calculate Primary KPI values
 const pendingAuthCount = requisitions.filter((r) => r.status === 'Pendiente de autorización').length;
 const readyForPurchaseCount = requisitions.filter((r) => r.status === 'Lista para compra').length;
 const rejectedOrCorrectionCount = requisitions.filter(
 (r) => r.status === 'Requiere corrección' || r.status === 'Rechazada'
 ).length;
 const reorderSuggestionsCount = suggestions.length;

 // Secondary Operational Metrics
 const totalUnits = useMemo(() => {
 return requisitions.reduce((sum, req) => {
 return sum + req.items.reduce((iSum, item) => iSum + (Number(item.quantity) || 0), 0);
 }, 0);
 }, [requisitions]);

 const totalItemsCount = useMemo(() => {
 return requisitions.reduce((sum, req) => sum + req.items.length, 0);
 }, [requisitions]);

 const urgentRequisitionsCount = requisitions.filter((r) => r.priority === 'Urgente').length;
 const highPriorityCount = requisitions.filter((r) => r.priority === 'Alta').length;
 const normalPriorityCount = requisitions.filter((r) => r.priority === 'Normal').length;

 const uniqueWarehousesWithDemand = useMemo(() => {
 return Array.from(new Set(requisitions.map((r) => r.targetWarehouseName)));
 }, [requisitions]);

 // Attention Items
 const attentionRequisitions = useMemo(() => {
 return requisitions.filter(
 (r) =>
 r.status === 'Pendiente de autorización' ||
 r.status === 'Requiere corrección' ||
 r.hasPendingProductReview ||
 r.status === 'Lista para compra'
 ).slice(0, 6);
 }, [requisitions]);

 const urgentSuggestions = useMemo(() => {
 return suggestions.filter(
 (s) => s.status === 'Reorden urgente' || s.status === 'Cobertura insuficiente'
 ).slice(0, 4);
 }, [suggestions]);

 // Demo Top Most Requested Articles
 const topRequestedArticles = [
 {
 sku: 'SC-NAYT-FLOW-IND',
 name: 'Nayt Colchón Flow Basic White Individual',
 units: 54,
 reqCount: 3,
 supplier: 'Nayt México S.A. de C.V.',
 tag: '★ Alta Rotación',
 tagColor: 'bg-white text-zinc-900 border-emerald-600 shadow-2xs',
 leadTime: '3 días',
 trend: '+24% vs mes anterior',
 },
 {
 sku: 'SC-NAYT-FLOW-MAT',
 name: 'Nayt Colchón Flow Basic White Matrimonial',
 units: 38,
 reqCount: 2,
 supplier: 'Nayt México S.A. de C.V.',
 tag: 'Top Ventas',
 tagColor: 'bg-white text-zinc-900 border-emerald-600 shadow-2xs',
 leadTime: '3 días',
 trend: '+18% vs mes anterior',
 },
 {
 sku: 'SC-SPA-REC-IND',
 name: 'Spring Air Colchón Record Individual',
 units: 30,
 reqCount: 1,
 supplier: 'Spring Air de México',
 tag: 'Campaña Institucional',
 tagColor: 'bg-white text-zinc-900 border border-blue-500 shadow-2xs',
 leadTime: '5 días',
 trend: '+45% volumen puntual',
 },
 {
 sku: 'SC-RES-ORT-MAT',
 name: 'Restonic Colchón Ortopedic Matrimonial',
 units: 22,
 reqCount: 2,
 supplier: 'Restonic México S.A.',
 tag: 'Resurtido Continuo',
 tagColor: 'bg-white text-zinc-900 border border-purple-500 shadow-2xs',
 leadTime: '4 días',
 trend: 'Demanda constante',
 },
 {
 sku: 'SC-THE-ERG-QS',
 name: 'Therapedic Colchón Ergo Comfort Queen',
 units: 14,
 reqCount: 1,
 supplier: 'Therapedic México',
 tag: 'Demanda Creciente',
 tagColor: 'bg-white text-zinc-900 border border-amber-500 shadow-2xs',
 leadTime: '6 días',
 trend: '+12% trimestral',
 },
 ];

 // Demo Articles with Low Movement / Infrequent Request
 const lowDemandArticles = [
 {
 sku: 'SC-SEA-CRW-KS',
 name: 'Sealy Colchón Crown Jewel King Size Ultra',
 lastReqDate: '10 Jul 2026',
 daysWithoutDemand: 48,
 statusNote: 'Demanda estable baja · Compra bajo pedido especial cliente',
 statusType: 'neutral',
 },
 {
 sku: 'SC-MAG-PLEG-IND',
 name: 'Magnus Colchoneta Plegable Campestre',
 lastReqDate: '23 Jul 2026',
 daysWithoutDemand: 35,
 statusNote: 'Artículo estacional de temporada de verano',
 statusType: 'seasonal',
 },
 {
 sku: 'SC-AME-CLA-CUN',
 name: 'Colchones América Modelo Classic Cuna',
 lastReqDate: '16 Jul 2026',
 daysWithoutDemand: 42,
 statusNote: 'Surtido de nicho infantil bajo revisión de catálogo',
 statusType: 'review',
 },
 {
 sku: 'SC-SPA-COL-IND',
 name: 'Spring Air Colchoneta Extra Confort Individual',
 lastReqDate: '03 Jul 2026',
 daysWithoutDemand: 55,
 statusNote: 'Stock remanente suficiente en CEDIS Monterrey Norte',
 statusType: 'sufficient',
 },
 ];

 // Demo Demand by Destination
 const demandByDestinations = [
 {
 id: 'wh-mty-norte',
 name: 'CEDIS Monterrey Norte',
 type: 'CEDIS Principal',
 reqCount: 4,
 totalUnits: 92,
 dominantSupplier: 'Spring Air / Nayt',
 urgencyLevel: 'Alta',
 urgencyBadge: 'bg-white text-zinc-900 border border-amber-500 shadow-2xs',
 },
 {
 id: 'wh-mty-sur',
 name: 'CEDIS Monterrey Sur',
 type: 'CEDIS Regional',
 reqCount: 3,
 totalUnits: 68,
 dominantSupplier: 'Restonic / Sealy',
 urgencyLevel: 'Media',
 urgencyBadge: 'bg-white text-zinc-900 border border-blue-500 shadow-2xs',
 },
 {
 id: 'wh-suc-valle-oriente',
 name: 'Sucursal Valle Oriente',
 type: 'Sucursal Flagship',
 reqCount: 3,
 totalUnits: 44,
 dominantSupplier: 'Nayt México S.A.',
 urgencyLevel: 'Urgente',
 urgencyBadge: 'bg-rose-500/10 text-rose-950 dark:text-rose-200 border-rose-500/30 shadow-2xs',
 },
 {
 id: 'wh-suc-cumbres',
 name: 'Sucursal Cumbres',
 type: 'Sucursal Comercial',
 reqCount: 2,
 totalUnits: 26,
 dominantSupplier: 'Nayt / Therapedic',
 urgencyLevel: 'Normal',
 urgencyBadge: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
 },
 ];

 // Demo Top Suppliers Involved (Nayt México as hero)
 const topSuppliersInvolved = [
 {
 name: 'Nayt México S.A. de C.V.',
 reqCount: 4,
 units: 112,
 leadDays: 3,
 slaCompliance: '99.4%',
 badges: ['★ Mejor tiempo entrega (3d)', 'Mayor cobertura', 'Proveedor Preferente'],
 isHero: true,
 },
 {
 name: 'Spring Air de México S.A. de C.V.',
 reqCount: 3,
 units: 72,
 leadDays: 5,
 slaCompliance: '96.8%',
 badges: ['Alta capacidad de lote', 'Línea Hotelera'],
 isHero: false,
 },
 {
 name: 'Restonic Fábricas de Colchones S.A.',
 reqCount: 2,
 units: 38,
 leadDays: 4,
 slaCompliance: '97.2%',
 badges: ['Resurtido programado'],
 isHero: false,
 },
 {
 name: 'Therapedic International México',
 reqCount: 1,
 units: 14,
 leadDays: 6,
 slaCompliance: '95.0%',
 badges: ['Especialidades ortopédicas'],
 isHero: false,
 },
 ];

 // Weekly Trend Data for Mini Bar Chart
 const weeklyTrends = [
 { label: 'Sem 31', reqs: 8, units: 42, percentHeight: 45 },
 { label: 'Sem 32', reqs: 12, units: 64, percentHeight: 65 },
 { label: 'Sem 33', reqs: 15, units: 82, percentHeight: 80 },
 { label: 'Sem 34 (Actual)', reqs: 18, units: 96, percentHeight: 100, isCurrent: true },
 ];

 const handleExport = () => {
 setShowExportToast(true);
 setTimeout(() => setShowExportToast(false), 3500);
 };

 return (
 <div className="space-y-6">
 
 {/* ========================================================================= */}
 {/* 1. HEADER EJECUTIVO & CONTROLES DE PERIODO */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 md:p-6 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2.5 flex-wrap">
 <div className="w-8 h-8 rounded-xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold">
 <Activity className="w-4 h-4" />
 </div>
 <h2 className="text-base md:text-lg font-black text-theme-main">
 Dashboard de Requisiciones y Abastecimiento
 </h2>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
 Analítica en tiempo real
 </span>
 </div>
 <p className="text-xs text-theme-muted leading-relaxed">
 Diagnóstico integral del flujo de solicitudes internas, balance de abastecimiento por instalación y priorización operativa de compras.
 </p>
 </div>

 {/* Period Selector & Export Demo Controls */}
 <div className="flex items-center gap-2 flex-wrap shrink-0">
 <div className="flex items-center p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle text-xs">
 <button
 onClick={() => setSelectedPeriod('7d')}
 className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
 selectedPeriod === '7d'
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 7 Días
 </button>
 <button
 onClick={() => setSelectedPeriod('4w')}
 className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
 selectedPeriod === '4w'
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 4 Semanas
 </button>
 <button
 onClick={() => setSelectedPeriod('month')}
 className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
 selectedPeriod === 'month'
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Mes Actual
 </button>
 </div>

 <button
 type="button"
 onClick={handleExport}
 className="px-3.5 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
 title="Exportar reporte de requisiciones"
 >
 <Download className="w-3.5 h-3.5 text-theme-muted" />
 <span>Exportar</span>
 </button>
 </div>
 </div>

 {/* Export Toast Notification */}
 {showExportToast && (
 <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 text-white shadow-2xl border border-zinc-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
 <Check className="w-5 h-5 text-emerald-400 shrink-0" />
 <div className="text-xs">
 <strong className="font-bold block">Reporte Ejecutivo Generado</strong>
 <span className="text-zinc-300">Resumen operativo de requisiciones descargado correctamente (Demo).</span>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* 2. BLOQUE PRINCIPAL: 4 KPIS DE ESTADOS OPERATIVOS (Fondo Blanco) */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
 
 {/* KPI 1: Pendientes de Autorización */}
 <div
 onClick={() => onNavigateSubTab('requisiciones')}
 className="p-4 rounded-3xl bg-theme-surface hover:border-amber-500/60 border border-amber-500/35 shadow-2xs space-y-2 cursor-pointer transition-all flex flex-col justify-between group"
 >
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-amber-600" />
 Pendientes de Autorización
 </span>
 <strong className="text-2xl font-mono font-black text-amber-900 dark:text-amber-300 block">
 {pendingAuthCount} <span className="text-xs font-semibold text-theme-muted font-sans">solicitudes</span>
 </strong>
 </div>
 <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 group-hover:underline flex items-center gap-1 transition-colors pt-1.5 border-t border-theme-subtle">
 <span>Ver listado</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 {/* KPI 2: Listas para Compra */}
 <div
 onClick={() => onNavigateSubTab('requisiciones')}
 className="p-4 rounded-3xl bg-theme-surface hover:border-emerald-500/60 border border-emerald-500/35 shadow-2xs space-y-2 cursor-pointer transition-all flex flex-col justify-between group"
 >
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 Listas para Compra
 </span>
 <strong className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-400 block">
 {readyForPurchaseCount} <span className="text-xs font-semibold text-theme-muted font-sans">autorizadas</span>
 </strong>
 </div>
 <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 group-hover:underline flex items-center gap-1 transition-colors pt-1.5 border-t border-theme-subtle">
 <span>Listas para orden de compra</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 {/* KPI 3: Rechazadas / Corrección */}
 <div
 onClick={() => onNavigateSubTab('requisiciones')}
 className="p-4 rounded-3xl bg-theme-surface hover:border-orange-500/60 border border-orange-500/35 shadow-2xs space-y-2 cursor-pointer transition-all flex flex-col justify-between group"
 >
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
 <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
 Rechazadas / Corrección
 </span>
 <strong className="text-2xl font-mono font-black text-orange-700 dark:text-orange-400 block">
 {rejectedOrCorrectionCount} <span className="text-xs font-semibold text-theme-muted font-sans">observadas</span>
 </strong>
 </div>
 <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 group-hover:underline flex items-center gap-1 transition-colors pt-1.5 border-t border-theme-subtle">
 <span>Requieren atención o ajuste</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 {/* KPI 4: Sugerencias de Reorden */}
 <div
 onClick={() => onNavigateSubTab('sugerencias')}
 className="p-4 rounded-3xl bg-theme-surface hover:border-purple-500/60 border border-purple-500/35 shadow-2xs space-y-2 cursor-pointer transition-all flex flex-col justify-between group"
 >
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-purple-600" />
 Sugerencias de Reorden
 </span>
 <strong className="text-2xl font-mono font-black text-purple-700 dark:text-purple-400 block">
 {reorderSuggestionsCount} <span className="text-xs font-semibold text-theme-muted font-sans">alertas</span>
 </strong>
 </div>
 <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300 group-hover:underline flex items-center gap-1 transition-colors pt-1.5 border-t border-theme-subtle">
 <span>Diagnóstico de inventario</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 3. BLOQUE SECUNDARIO: 4 MÉTRICAS COMPLEMENTARIAS DE OPERACIÓN */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
 
 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Volumen Total Solicitado</span>
 <div className="flex items-baseline gap-1.5">
 <strong className="text-lg font-mono font-black text-theme-main">{totalUnits}</strong>
 <span className="text-xs text-theme-muted">unidades en {totalItemsCount} partidas</span>
 </div>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Destinos con Demanda</span>
 <div className="flex items-baseline gap-1.5">
 <strong className="text-lg font-mono font-black text-theme-main">{uniqueWarehousesWithDemand.length}</strong>
 <span className="text-xs text-theme-muted">instalaciones activas</span>
 </div>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Origen por Reorden Auto</span>
 <div className="flex items-baseline gap-1.5">
 <strong className="text-lg font-mono font-black text-purple-600">62%</strong>
 <span className="text-xs text-theme-muted">vía diagnóstico stock</span>
 </div>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Tiempo Prom. Aprobación</span>
 <div className="flex items-baseline gap-1.5">
 <strong className="text-lg font-mono font-black text-emerald-600">~1.8 h</strong>
 <span className="text-xs text-theme-muted">94% SLA oportuno</span>
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 4. ANALÍTICA VISUAL: 4 WIDGETS CON MINI GRÁFICAS */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
 {/* Widget A: Tendencia de Solicitudes (Barras de evolución) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <BarChart3 className="w-4 h-4 text-rose-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Tendencia de Solicitudes
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Evolución reciente de requisiciones y colchones solicitados
 </p>
 </div>
 <span className="text-[11px] font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-emerald-600 shadow-2xs flex items-center gap-1">
 <TrendingUp className="w-3 h-3 text-emerald-600" />
 +16% demanda
 </span>
 </div>

 {/* Mini Bar Chart */}
 <div className="grid grid-cols-4 gap-3 pt-3 items-end h-32 border-b border-theme-subtle pb-2">
 {weeklyTrends.map((t, idx) => (
 <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
 <span className="text-[10px] font-mono font-bold text-theme-main group-hover:text-rose-600 transition-colors">
 {t.units} u
 </span>
 <div className="w-full max-w-[42px] bg-theme-muted rounded-t-xl overflow-hidden flex flex-col justify-end h-20">
 <div
 style={{ height: `${t.percentHeight}%` }}
 className={`w-full rounded-t-lg transition-all ${
 t.isCurrent
 ? 'bg-rose-600 group-hover:bg-rose-700 shadow-sm'
 : 'bg-rose-500/40 group-hover:bg-rose-500/60'
 }`}
 />
 </div>
 <span className={`text-[10px] font-semibold ${t.isCurrent ? 'font-black text-rose-600' : 'text-theme-muted'}`}>
 {t.label}
 </span>
 </div>
 ))}
 </div>

 <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1">
 <span>Volumen proyectado para semana en curso: <strong>110 unidades</strong></span>
 <span className="font-mono font-bold text-theme-main">96 u confirmadas</span>
 </div>
 </div>

 {/* Widget B: Origen de las Requisiciones */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <PieChart className="w-4 h-4 text-purple-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Origen de las Requisiciones
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Canal de generación de necesidades y solicitudes
 </p>
 </div>

 {/* Segmented Progress Bar */}
 <div className="space-y-2 pt-1">
 <div className="h-3.5 w-full bg-theme-muted rounded-full overflow-hidden flex">
 <div style={{ width: '60%' }} className="bg-purple-600 h-full" title="Sugerencia de reorden: 60%" />
 <div style={{ width: '28%' }} className="bg-rose-600 h-full" title="Solicitud manual: 28%" />
 <div style={{ width: '12%' }} className="bg-amber-500 h-full" title="Homologación catálogo: 12%" />
 </div>

 <div className="grid grid-cols-3 gap-2 text-xs pt-2">
 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5 shadow-2xs">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
 <span>Sugerencia Reorden</span>
 </span>
 <strong className="text-sm font-mono font-black text-zinc-900 block">60%</strong>
 <span className="text-[9px] text-theme-muted block">Algoritmo de stock</span>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5 shadow-2xs">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
 <span>Solicitud Manual</span>
 </span>
 <strong className="text-sm font-mono font-black text-zinc-900 block">28%</strong>
 <span className="text-[9px] text-theme-muted block">Piso de venta / CEDIS</span>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5 shadow-2xs">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span>Homologación</span>
 </span>
 <strong className="text-sm font-mono font-black text-zinc-900 block">12%</strong>
 <span className="text-[9px] text-theme-muted block">No registrados</span>
 </div>
 </div>
 </div>

 <p className="text-[11px] text-theme-muted leading-relaxed">
 El <strong>88%</strong> de las solicitudes se apoyan en datos consolidados de catálogo maestro y ritmos de consumo mensual.
 </p>
 </div>

 {/* Widget C: Distribución por Prioridad */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <Flame className="w-4 h-4 text-amber-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Distribución por Prioridad
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Nivel de urgencia operativa declarado en las solicitudes
 </p>
 </div>

 <div className="space-y-2.5">
 {/* Urgente */}
 <div className="space-y-1">
 <div className="flex items-center justify-between text-xs font-bold">
 <span className="text-rose-600 flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-rose-600" />
 Urgente (Atención &lt; 24h)
 </span>
 <span className="font-mono text-theme-main">{urgentRequisitionsCount || 2} req (25%)</span>
 </div>
 <div className="h-2 w-full bg-theme-muted rounded-full overflow-hidden">
 <div style={{ width: '25%' }} className="h-full bg-rose-600 rounded-full" />
 </div>
 </div>

 {/* Alta */}
 <div className="space-y-1">
 <div className="flex items-center justify-between text-xs font-bold">
 <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-amber-500" />
 Alta (Fin de semana / Campaña)
 </span>
 <span className="font-mono text-theme-main">{highPriorityCount || 4} req (45%)</span>
 </div>
 <div className="h-2 w-full bg-theme-muted rounded-full overflow-hidden">
 <div style={{ width: '45%' }} className="h-full bg-amber-500 rounded-full" />
 </div>
 </div>

 {/* Normal */}
 <div className="space-y-1">
 <div className="flex items-center justify-between text-xs font-bold">
 <span className="text-blue-600 flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-blue-600" />
 Normal (Resurtido programado)
 </span>
 <span className="font-mono text-theme-main">{normalPriorityCount || 3} req (30%)</span>
 </div>
 <div className="h-2 w-full bg-theme-muted rounded-full overflow-hidden">
 <div style={{ width: '30%' }} className="h-full bg-blue-600 rounded-full" />
 </div>
 </div>
 </div>
 </div>

 {/* Widget D: Estado del Flujo */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-emerald-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Estado del Flujo
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Pipeline de avance desde borrador hasta compra emitida
 </p>
 </div>

 <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
 <div className="p-2 rounded-xl bg-white border border-amber-500 shadow-2xs space-y-1">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span>Pendientes</span>
 </span>
 <strong className="text-base font-mono font-black text-zinc-900 block">{pendingAuthCount}</strong>
 </div>

 <div className="p-2 rounded-xl bg-white border border-orange-500 dark:border-orange-500 shadow-2xs space-y-1">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
 <span>Corrección</span>
 </span>
 <strong className="text-base font-mono font-black text-zinc-900 block">{rejectedOrCorrectionCount}</strong>
 </div>

 <div className="p-2 rounded-xl bg-white border border-emerald-600 shadow-2xs space-y-1">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
 <span>Listas</span>
 </span>
 <strong className="text-base font-mono font-black text-zinc-900 block">{readyForPurchaseCount}</strong>
 </div>

 <div className="p-2 rounded-xl bg-white border border-purple-600 shadow-2xs space-y-1">
 <span className="text-[10px] font-bold text-zinc-900 flex items-center justify-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
 <span>En Compra</span>
 </span>
 <strong className="text-base font-mono font-black text-zinc-900 block">2</strong>
 </div>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-xs">
 <span className="text-theme-muted">Tasa de conversión a orden de compra:</span>
 <strong className="font-mono font-bold text-emerald-600">82.5%</strong>
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 5. RANKINGS DE ARTÍCULOS: MÁS SOLICITADOS vs MENOR MOVIMIENTO */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
 {/* Panel A: Top Artículos Más Solicitados */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <Flame className="w-4 h-4 text-rose-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Top Artículos Más Solicitados
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Modelos con mayor concentración de demanda en requisiciones
 </p>
 </div>
 </div>

 <div className="space-y-2.5">
 {topRequestedArticles.map((art) => (
 <div
 key={art.sku}
 className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/50 border border-theme-subtle transition-colors flex items-center justify-between gap-3 text-xs"
 >
 <div className="space-y-1 min-w-0 flex-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono font-black text-[11px] text-rose-600 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
 {art.sku}
 </span>
 <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${art.tagColor}`}>
 {art.tag}
 </span>
 </div>
 <strong className="text-theme-main font-bold block truncate" title={art.name}>
 {art.name}
 </strong>
 <div className="text-[10px] text-theme-muted flex items-center gap-2 flex-wrap">
 <span>Proveedor: <strong className="text-theme-main">{art.supplier}</strong></span>
 <span>&bull;</span>
 <span>Lead: <strong className="font-mono text-theme-main">{art.leadTime}</strong></span>
 </div>
 </div>

 <div className="text-right shrink-0">
 <strong className="text-base font-mono font-black text-theme-main block">
 {art.units} <span className="text-xs font-normal text-theme-muted">u</span>
 </strong>
 <span className="text-[10px] text-theme-muted font-mono block">
 {art.reqCount} requisiciones
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Panel B: Artículos con Menor Movimiento / Baja Demanda */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <PackageSearch className="w-4 h-4 text-theme-muted" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Artículos con Menor Movimiento de Abastecimiento
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Modelos con baja frecuencia de solicitud o compra eventual
 </p>
 </div>
 </div>

 <div className="space-y-2.5">
 {lowDemandArticles.map((art) => (
 <div
 key={art.sku}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5 text-xs"
 >
 <div className="flex items-center justify-between gap-2 flex-wrap">
 <span className="font-mono font-bold text-[11px] text-theme-muted bg-theme-muted px-1.5 py-0.2 rounded border border-theme-subtle">
 {art.sku}
 </span>
 <span className="text-[10px] font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-amber-500 shadow-2xs">
 {art.daysWithoutDemand} días sin solicitud
 </span>
 </div>

 <strong className="text-theme-main font-bold block truncate" title={art.name}>
 {art.name}
 </strong>

 <p className="text-[11px] text-theme-muted italic">
 {art.statusNote}
 </p>
 </div>
 ))}
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle text-[11px] text-theme-muted leading-relaxed">
 💡 <strong>Diagnóstico Automático:</strong> Permite evitar compras especulativas en SKUs de baja rotación y concentrar capital en líneas de alto flujo como <em>Nayt Flow</em>.
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 6. DESTINOS SOLICITANTES & PROVEEDORES MÁS INVOLUCRADOS */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
 {/* Destinos con Mayor Demanda */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <Building2 className="w-4 h-4 text-rose-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Destinos con Mayor Demanda
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Distribución de requerimientos entre CEDIS y Sucursales operativas
 </p>
 </div>

 <div className="space-y-2.5">
 {demandByDestinations.map((dest) => (
 <div
 key={dest.id}
 className="p-3.5 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/50 border border-theme-subtle transition-colors flex items-center justify-between gap-3 text-xs"
 >
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <strong className="text-theme-main font-bold text-xs">{dest.name}</strong>
 <span className="text-[10px] text-theme-muted">({dest.type})</span>
 </div>
 <div className="text-[11px] text-theme-muted flex items-center gap-2 flex-wrap">
 <span>Proveedor dominante: <strong className="text-theme-main">{dest.dominantSupplier}</strong></span>
 </div>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <div className="text-right">
 <strong className="text-sm font-mono font-black text-theme-main block">
 {dest.totalUnits} u
 </strong>
 <span className="text-[10px] text-theme-muted font-mono block">
 {dest.reqCount} reqs
 </span>
 </div>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${dest.urgencyBadge}`}>
 {dest.urgencyLevel}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Proveedores Más Involucrados (Hero: Nayt México) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <Truck className="w-4 h-4 text-purple-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Proveedores Más Involucrados
 </h3>
 </div>
 <p className="text-[11px] text-theme-muted">
 Participación de fabricantes en el resurtido y tiempos de entrega proyectados
 </p>
 </div>

 <div className="space-y-2.5">
 {topSuppliersInvolved.map((sup) => (
 <div
 key={sup.name}
 className={`p-3.5 rounded-2xl border transition-colors space-y-2 text-xs ${
 sup.isHero
 ? 'bg-rose-500/5 border-rose-500/30 shadow-2xs'
 : 'bg-theme-muted/30 border-theme-subtle'
 }`}
 >
 <div className="flex items-center justify-between gap-2 flex-wrap">
 <strong className={`font-bold ${sup.isHero ? 'text-rose-600 text-sm' : 'text-theme-main'}`}>
 {sup.name}
 </strong>
 <div className="flex items-center gap-2">
 <span className="font-mono text-theme-muted text-[11px]">
 SLA: <strong className="text-emerald-600">{sup.slaCompliance}</strong>
 </span>
 <span className="font-mono font-bold text-theme-main text-xs bg-theme-muted px-2 py-0.5 rounded-lg border border-theme-subtle">
 {sup.units} unidades
 </span>
 </div>
 </div>

 <div className="flex items-center justify-between text-[11px] text-theme-muted flex-wrap gap-2">
 <div className="flex items-center gap-1.5 flex-wrap">
 {sup.badges.map((b, i) => (
 <span
 key={i}
 className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${
 sup.isHero
 ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
 : 'bg-theme-muted text-theme-muted border-theme-subtle'
 }`}
 >
 {b}
 </span>
 ))}
 </div>
 <span className="font-mono text-theme-muted">
 Lead: <strong className="text-theme-main">{sup.leadDays} días hábiles</strong>
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 7. SECCIÓN: ATENCIÓN REQUERIDA (REQUISICIONES EN CURSO) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <ShieldAlert className="w-4 h-4 text-rose-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Atención Requerida &middot; Requisiciones en Curso
 </h3>
 </div>
 <button
 type="button"
 onClick={() => onNavigateSubTab('requisiciones')}
 className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Ver todas las requisiciones ({requisitions.length})</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {attentionRequisitions.map((req) => {
 const reqTotalUnits = req.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0);

 return (
 <div
 key={req.id}
 onClick={() => onSelectRequisition(req)}
 className="p-4 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/50 border border-theme-subtle hover:border-theme-primary/40 transition-all cursor-pointer space-y-3 flex flex-col justify-between group shadow-2xs"
 >
 <div className="space-y-2.5">
 <div className="flex items-center justify-between gap-2 flex-wrap">
 <span className="font-mono font-black text-xs text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
 {req.folio}
 </span>
 <RequisitionStatusBadge status={req.status} size="sm" />
 </div>

 <div className="space-y-1 text-xs">
 <strong className="font-bold text-theme-main block">
 {req.targetWarehouseName}
 </strong>
 <span className="text-[11px] text-theme-muted block">
 {req.items.length} partidas &bull; <strong className="text-theme-main font-mono">{reqTotalUnits}</strong> unidades solicitadas
 </span>
 {req.suggestedSupplier && (
 <span className="text-[11px] text-theme-muted block truncate" title={req.suggestedSupplier}>
 Proveedor: <strong className="text-theme-main">{req.suggestedSupplier}</strong>
 </span>
 )}
 </div>

 {req.hasPendingProductReview && (
 <div className="p-2 rounded-xl bg-white border border-amber-500 flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-900 shadow-2xs">
 <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
 <span>Producto pendiente de revisión</span>
 </div>
 )}
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
 <span>Ver detalle</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 8. SECCIÓN: SUGERENCIAS CRÍTICAS DE REABASTO */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Sugerencias Críticas de Reabasto
 </h3>
 </div>
 <button
 type="button"
 onClick={() => onNavigateSubTab('sugerencias')}
 className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Ver todas las sugerencias ({suggestions.length})</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 {urgentSuggestions.map((sug) => (
 <div
 key={sug.id}
 onClick={() => onNavigateSubTab('sugerencias')}
 className="p-3.5 rounded-2xl bg-theme-surface hover:bg-theme-muted/50 border border-theme-subtle space-y-2 cursor-pointer transition-all flex flex-col justify-between shadow-2xs"
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono font-bold text-[10px] text-zinc-900 bg-white px-1.5 py-0.2 rounded border border-rose-500 shadow-2xs">{sug.sku}</span>
 <RequisitionStatusBadge status={sug.status} size="sm" />
 </div>
 <strong className="text-xs font-bold text-theme-main block line-clamp-1">{sug.productName}</strong>
 <span className="text-[10px] text-theme-muted block">{sug.targetWarehouseName}</span>
 <div className="text-[10px] text-theme-muted pt-1 border-t border-theme-subtle flex justify-between">
 <span>Disponible: <strong className="text-rose-600">{sug.availableStock}</strong></span>
 <span>Sugerido: <strong className="text-emerald-600 font-bold">+{sug.suggestedQuantity}</strong></span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 9. BARRA DE ACCIONES RÁPIDAS / ATAJOS DIRECTOS */}
 {/* ========================================================================= */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
 <div className="flex items-center gap-2 text-theme-muted">
 <Zap className="w-4 h-4 text-rose-600 shrink-0" />
 <span className="font-semibold">Atajos Rápidos de Operación:</span>
 </div>

 <div className="flex items-center gap-2 flex-wrap justify-end">
 <button
 type="button"
 onClick={() => onNavigateSubTab('requisiciones')}
 className="px-3 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 border border-amber-500 font-bold transition-all cursor-pointer shadow-2xs"
 >
 Pendientes de Autorización ({pendingAuthCount})
 </button>

 <button
 type="button"
 onClick={() => onNavigateSubTab('requisiciones')}
 className="px-3 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 border border-emerald-600 font-bold transition-all cursor-pointer shadow-2xs"
 >
 Listas para Compra ({readyForPurchaseCount})
 </button>

 <button
 type="button"
 onClick={() => onNavigateSubTab('sugerencias')}
 className="px-3 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 border border-purple-500 font-bold transition-all cursor-pointer shadow-2xs"
 >
 Sugerencias de Reorden ({suggestions.length})
 </button>
 </div>
 </div>

 </div>
 );
};
