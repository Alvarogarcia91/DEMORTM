import React, { useState } from 'react';
import {
 Truck,
 Building2,
 Calendar,
 User,
 DollarSign,
 Clock,
 FileText,
 AlertTriangle,
 CheckCircle2,
 FileCheck2,
 ArrowRight,
 ShieldAlert,
 Layers,
 Globe,
 TrendingUp,
 TrendingDown,
 Percent,
 Star,
 Award,
 AlertCircle,
 X,
 Package,
 Activity,
 BarChart3,
 Info
} from 'lucide-react';
import { SupplierMaster } from '../../../data/mockSuppliersData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface SupplierPerformanceDetail {
 supplierTradeName: string;
 supplierId: string;
 score: number;
 ratingLabel: 'Excelente' | 'Muy bueno' | 'Seguimiento' | 'Atención';
 onTimePercent: number;
 avgLeadDays: number;
 fillRatePercent: number;
 incidentsCount: number;
 priceVariationPercent: number;
 analyzedOrdersCount: number;
 recentNotes: string;
}

interface SuppliersDashboardProps {
 suppliers: SupplierMaster[];
 onOpenCreateModal?: () => void;
 onSelectSupplierWithTab: (
 supplier: SupplierMaster,
 tab: 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial'
 ) => void;
 onNavigateSubTab: (subTab: 'resumen' | 'proveedores') => void;
}

export const SuppliersDashboard: React.FC<SuppliersDashboardProps> = ({
 suppliers,
 onSelectSupplierWithTab,
 onNavigateSubTab,
}) => {
 const [selectedPerformanceSupplier, setSelectedPerformanceSupplier] = useState<SupplierPerformanceDetail | null>(null);

 // Active and Filtered Suppliers
 const activeSuppliers = suppliers.filter((s) => s.status === 'Activo');
 const activeCount = activeSuppliers.length;
 const creditCount = activeSuppliers.filter((s) => s.paymentCondition === 'Crédito').length;

 // Documents expiring
 const expiringDocs = activeSuppliers.flatMap((s) =>
 s.documents
 .filter((d) => d.status === 'Por vencer' || d.status === 'Vencido')
 .map((d) => ({ supplier: s, doc: d }))
 );

 // Performance datasets (Nayt México as #1 benchmark)
 const topPerformers: SupplierPerformanceDetail[] = [
 {
 supplierTradeName: 'Nayt México',
 supplierId: 'sup-nayt',
 score: 97,
 ratingLabel: 'Excelente',
 onTimePercent: 98,
 avgLeadDays: 4,
 fillRatePercent: 99,
 incidentsCount: 1,
 priceVariationPercent: 1.3,
 analyzedOrdersCount: 8,
 recentNotes: 'Proveedor estratégico prioritario. Máxima confiabilidad en entregas a CEDIS Monterrey Norte.',
 },
 {
 supplierTradeName: 'Restonic México',
 supplierId: 'sup-restonic',
 score: 94,
 ratingLabel: 'Muy bueno',
 onTimePercent: 95,
 avgLeadDays: 5,
 fillRatePercent: 98,
 incidentsCount: 0,
 priceVariationPercent: -0.8,
 analyzedOrdersCount: 5,
 recentNotes: 'Cumplimiento impecable sin reportes de mermas ni incidencias en los últimos 90 días.',
 },
 {
 supplierTradeName: 'Sealy México',
 supplierId: 'sup-sealy',
 score: 92,
 ratingLabel: 'Muy bueno',
 onTimePercent: 93,
 avgLeadDays: 7,
 fillRatePercent: 97,
 incidentsCount: 1,
 priceVariationPercent: 4.0,
 analyzedOrdersCount: 4,
 recentNotes: 'Gama alta con excelente calidad de producto. Buen nivel de cumplimiento en ventanas de descarga.',
 },
 ];

 const reviewPerformers: SupplierPerformanceDetail[] = [
 {
 supplierTradeName: 'Spring Air México',
 supplierId: 'sup-springair',
 score: 78,
 ratingLabel: 'Atención',
 onTimePercent: 78,
 avgLeadDays: 9,
 fillRatePercent: 92,
 incidentsCount: 3,
 priceVariationPercent: 4.6,
 analyzedOrdersCount: 6,
 recentNotes: 'Tiempos de entrega extendidos (9d) y 2 retrasos registrados en entregas de línea Ortopédica.',
 },
 {
 supplierTradeName: 'Distribuidora del Norte',
 supplierId: 'sup-dist-norte',
 score: 81,
 ratingLabel: 'Atención',
 onTimePercent: 80,
 avgLeadDays: 12,
 fillRatePercent: 90,
 incidentsCount: 2,
 priceVariationPercent: 0.0,
 analyzedOrdersCount: 3,
 recentNotes: 'Falta de contacto comercial directo y lead time de 12 días genera reprogramaciones de compra.',
 },
 {
 supplierTradeName: 'Therapedic México',
 supplierId: 'sup-therapedic',
 score: 86,
 ratingLabel: 'Seguimiento',
 onTimePercent: 85,
 avgLeadDays: 8,
 fillRatePercent: 94,
 incidentsCount: 2,
 priceVariationPercent: 2.5,
 analyzedOrdersCount: 3,
 recentNotes: 'Incidencia reciente con faltante menor de unidades en descarga CEDIS Sur. En seguimiento preventivo.',
 },
 ];

 // Helper to open supplier detail
 const handleOpenSupplierByName = (
 tradeName: string,
 tab: 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial' = 'resumen'
 ) => {
 const found = suppliers.find(
 (s) => s.tradeName.toLowerCase().includes(tradeName.toLowerCase()) ||
 s.legalName.toLowerCase().includes(tradeName.toLowerCase())
 );
 if (found) {
 onSelectSupplierWithTab(found, tab);
 } else {
 onNavigateSubTab('proveedores');
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* ========================================================================= */}
 {/* CABECERA & SUBTÍTULO MINIMALISTA */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-bold text-xs">
 <Truck className="w-4 h-4" />
 </div>
 <h2 className="text-base font-black text-theme-main">
 Directorio Maestro de Proveedores & Fabricantes
 </h2>
 </div>
 <p className="text-xs text-theme-muted">
 Monitoreo ejecutivo de cumplimiento de entregas, acuerdos comerciales, evaluación operativa y control de expedientes.
 </p>
 </div>

 <div className="flex items-center gap-2 text-[11px] text-theme-muted italic">
 <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
 <span>Datos de desempeño simulados para fines de demostración operativa.</span>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* FILA 1: 6 KPIS EJECUTIVOS (FONDO BLANCO, BORDES SUTILES, SEÑALES LIMPIAS) */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
 
 {/* KPI 1: Proveedores Activos */}
 <div
 onClick={() => onNavigateSubTab('proveedores')}
 className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-emerald-500/40 transition-all group"
 >
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <Building2 className="w-3.5 h-3.5 text-emerald-600" />
 Proveedores Activos
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 {activeCount} <span className="text-xs font-semibold text-theme-muted">/ {suppliers.length}</span>
 </strong>
 <span className="text-[10px] text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
 <span>Ver listado</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 {/* KPI 2: Tiempo Promedio de Entrega */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-blue-600" />
 Tiempo Promedio
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 4.8 <span className="text-xs font-semibold text-theme-muted">días</span>
 </strong>
 <span className="text-[10px] text-theme-muted font-mono">
 Meta: &lt; 6 días hábiles
 </span>
 </div>

 {/* KPI 3: Entregas a Tiempo */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 Entregas a Tiempo
 </span>
 <strong className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 block">
 91%
 </strong>
 <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
 +2.4% vs mes anterior
 </span>
 </div>

 {/* KPI 4: Órdenes Abiertas */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <Package className="w-3.5 h-3.5 text-purple-600" />
 Órdenes Abiertas
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 7 <span className="text-xs font-semibold text-theme-muted">OCs</span>
 </strong>
 <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
 En proceso y tránsito
 </span>
 </div>

 {/* KPI 5: Documentos por Vencer */}
 <div
 onClick={() => onNavigateSubTab('proveedores')}
 className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-amber-500/40 transition-all group"
 >
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
 Docs por Vencer
 </span>
 <strong className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400 block">
 {expiringDocs.length} <span className="text-xs font-semibold text-theme-muted">archivos</span>
 </strong>
 <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium group-hover:underline flex items-center gap-1">
 <span>Requieren renovación</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>

 {/* KPI 6: Con Crédito Comercial */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1.5">
 <DollarSign className="w-3.5 h-3.5 text-rose-600" />
 Con Crédito
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 {creditCount} <span className="text-xs font-semibold text-theme-muted">proveedores</span>
 </strong>
 <span className="text-[10px] text-theme-muted font-mono">
 Plazos 30 a 45 días
 </span>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* FILA 2: ATENCIÓN REQUERIDA (CARDS CON FONDO BLANCO, CHIPS Y BORDES SUTILES) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <ShieldAlert className="w-4 h-4 text-rose-600" />
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Atención Requerida en Catálogo de Proveedores
 </h3>
 </div>
 <button
 type="button"
 onClick={() => onNavigateSubTab('proveedores')}
 className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Ver todos los proveedores ({suppliers.length})</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
 
 {/* Alerta 1: Documento por Vencer (Nayt México) */}
 <div
 onClick={() => handleOpenSupplierByName('Nayt México', 'documentos')}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-amber-500/40 space-y-3 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1">
 <strong className="text-xs font-bold text-theme-main truncate">Nayt México</strong>
 <StatusBadge variant="warning" label="Doc. por vencer" size="sm" />
 </div>
 <p className="text-xs text-theme-muted font-semibold">Constancia de Situación Fiscal 2026</p>
 <span className="text-[10px] text-zinc-700 dark:text-zinc-300 block font-mono">
 Vence: 08 Sep 2026
 </span>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-theme-main group-hover:text-rose-600 transition-colors">
 <span>Ver expediente</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
 </div>
 </div>

 {/* Alerta 2: Tiempo Extendido (Spring Air México) */}
 <div
 onClick={() => handleOpenSupplierByName('Spring Air México', 'condiciones')}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-blue-500/40 space-y-3 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1">
 <strong className="text-xs font-bold text-theme-main truncate">Spring Air México</strong>
 <StatusBadge variant="info" label="Tiempo extendido" size="sm" />
 </div>
 <p className="text-xs text-theme-muted">
 Tiempo de entrega estimado: <strong>9 días hábiles</strong>
 </p>
 <span className="text-[10px] text-theme-muted block font-mono">
 2 artículos en catálogo maestro
 </span>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-theme-main group-hover:text-rose-600 transition-colors">
 <span>Ver condiciones</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
 </div>
 </div>

 {/* Alerta 3: Sin Contacto Comercial (Distribuidora del Norte) */}
 <div
 onClick={() => handleOpenSupplierByName('Distribuidora del Norte', 'contactos')}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-rose-500/40 space-y-3 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1">
 <strong className="text-xs font-bold text-theme-main truncate">Distribuidora del Norte</strong>
 <StatusBadge variant="danger" label="Sin contacto" size="sm" />
 </div>
 <p className="text-xs text-theme-muted">
 No cuenta con contacto comercial registrado para OCs.
 </p>
 <span className="text-[10px] text-theme-muted block font-mono">
 RFC: DEMO-DIS-006
 </span>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-theme-main group-hover:text-rose-600 transition-colors">
 <span>Completar contacto</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
 </div>
 </div>

 {/* Alerta 4: Incidencia de Entrega Reciente (Therapedic México) */}
 <div
 onClick={() => handleOpenSupplierByName('Therapedic México', 'historial')}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-purple-500/40 space-y-3 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1">
 <strong className="text-xs font-bold text-theme-main truncate">Therapedic México</strong>
 <StatusBadge variant="smart" label="Incidencia reciente" size="sm" />
 </div>
 <p className="text-xs text-theme-muted">
 Recepción con faltante de 2 pzas reportada en CEDIS Sur.
 </p>
 <span className="text-[10px] text-zinc-700 dark:text-zinc-300 block font-mono">
 Score: 86% &bull; En seguimiento
 </span>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-theme-main group-hover:text-rose-600 transition-colors">
 <span>Ver historial</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
 </div>
 </div>

 </div>
 </div>

 {/* ========================================================================= */}
 {/* FILA 3: DESEMPEÑO DE PROVEEDORES (MEJORES VS PROVEEDORES A REVISAR) */}
 {/* ========================================================================= */}
 <div className="space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div>
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
 <Award className="w-4 h-4 text-amber-500" />
 Desempeño de Proveedores
 </h3>
 <p className="text-[11px] text-theme-muted">
 Evaluación multidimensional basada en puntualidad de entrega, cumplimiento de unidades pactadas y variaciones de precio.
 </p>
 </div>
 <span className="text-[10px] text-theme-muted italic">
 * Haz click en un proveedor para ver su desglose completo
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
 {/* MEJORES PROVEEDORES */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-2.5">
 <div className="flex items-center gap-2">
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
 <span className="text-xs font-black uppercase tracking-wider text-theme-main">
 Mejores Proveedores
 </span>
 </div>
 <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
 Líderes de cumplimiento
 </span>
 </div>

 <div className="space-y-2.5">
 {topPerformers.map((p, idx) => (
 <div
 key={p.supplierId}
 onClick={() => setSelectedPerformanceSupplier(p)}
 className="p-3.5 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/70 border border-theme-subtle cursor-pointer transition-all flex items-center justify-between gap-3 group"
 >
 <div className="flex items-center gap-3 min-w-0">
 <span className="w-6 h-6 rounded-xl bg-white text-zinc-900 border border-emerald-600 shadow-2xs font-mono font-black text-xs flex items-center justify-center shrink-0">
 #{idx + 1}
 </span>
 <div className="min-w-0">
 <strong className="text-xs font-bold text-theme-main block truncate group-hover:text-rose-600 transition-colors">
 {p.supplierTradeName}
 </strong>
 <div className="text-[10px] text-theme-muted flex items-center gap-2 mt-0.5">
 <span>Puntualidad: <strong>{p.onTimePercent}%</strong></span>
 <span>&bull;</span>
 <span>Lead: <strong>{p.avgLeadDays}d</strong></span>
 <span>&bull;</span>
 <span>Incidencias: <strong>{p.incidentsCount}</strong></span>
 </div>
 </div>
 </div>

 <div className="text-right shrink-0 flex items-center gap-2.5">
 <div>
 <strong className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400 block">
 {p.score}%
 </strong>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 {p.ratingLabel}
 </span>
 </div>
 <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-main group-hover:translate-x-0.5 transition-all" />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* PROVEEDORES A REVISAR */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3.5">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-2.5">
 <div className="flex items-center gap-2">
 <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
 <span className="text-xs font-black uppercase tracking-wider text-theme-main">
 Proveedores a Revisar
 </span>
 </div>
 <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
 Requieren seguimiento
 </span>
 </div>

 <div className="space-y-2.5">
 {reviewPerformers.map((p, idx) => (
 <div
 key={p.supplierId}
 onClick={() => setSelectedPerformanceSupplier(p)}
 className="p-3.5 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/70 border border-theme-subtle cursor-pointer transition-all flex items-center justify-between gap-3 group"
 >
 <div className="flex items-center gap-3 min-w-0">
 <span className="w-6 h-6 rounded-xl bg-white text-amber-600 border border-amber-500 shadow-2xs font-mono font-black text-xs flex items-center justify-center shrink-0">
 !
 </span>
 <div className="min-w-0">
 <strong className="text-xs font-bold text-theme-main block truncate group-hover:text-rose-600 transition-colors">
 {p.supplierTradeName}
 </strong>
 <div className="text-[10px] text-theme-muted flex items-center gap-2 mt-0.5">
 <span>Puntualidad: <strong>{p.onTimePercent}%</strong></span>
 <span>&bull;</span>
 <span>Lead: <strong>{p.avgLeadDays}d</strong></span>
 <span>&bull;</span>
 <span>Incidencias: <strong>{p.incidentsCount}</strong></span>
 </div>
 </div>
 </div>

 <div className="text-right shrink-0 flex items-center gap-2.5">
 <div>
 <strong className="text-base font-mono font-black text-amber-600 dark:text-amber-400 block">
 {p.score}%
 </strong>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {p.ratingLabel}
 </span>
 </div>
 <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-main group-hover:translate-x-0.5 transition-all" />
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>

 {/* ========================================================================= */}
 {/* FILA 4: CUMPLIMIENTO DE ENTREGAS & TIEMPO PROMEDIO DE ENTREGA */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
 {/* Cumplimiento de Entregas (Barras Horizontales) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Cumplimiento de Entregas
 </span>
 <span className="text-[10px] text-theme-muted font-mono">Últimas 50 entregas</span>
 </div>

 <div className="space-y-3 text-xs font-semibold">
 {[
 { name: 'Nayt México', pct: 98, color: 'bg-emerald-500' },
 { name: 'Restonic México', pct: 95, color: 'bg-emerald-500' },
 { name: 'Sealy México', pct: 93, color: 'bg-blue-500' },
 { name: 'Therapedic México', pct: 86, color: 'bg-blue-500' },
 { name: 'Spring Air México', pct: 78, color: 'bg-amber-500' },
 ].map((item) => (
 <div
 key={item.name}
 onClick={() => handleOpenSupplierByName(item.name, 'resumen')}
 className="space-y-1 cursor-pointer group"
 >
 <div className="flex items-center justify-between text-xs">
 <span className="text-theme-main group-hover:text-rose-600 transition-colors">
 {item.name}
 </span>
 <span className="font-mono font-black text-theme-main">{item.pct}%</span>
 </div>
 <div className="h-2 w-full bg-theme-muted rounded-full overflow-hidden">
 <div
 className={`h-full ${item.color} rounded-full transition-all duration-500`}
 style={{ width: `${item.pct}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Tiempo Promedio de Entrega */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Tiempo Promedio de Entrega
 </span>
 <span className="text-[10px] text-theme-muted font-mono">Días hábiles</span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
 {[
 { name: 'Nayt México', days: 4, badge: 'Óptimo', type: 'good' },
 { name: 'Restonic México', days: 5, badge: 'Bueno', type: 'good' },
 { name: 'Sealy México', days: 7, badge: 'Estándar', type: 'neutral' },
 { name: 'Therapedic México', days: 8, badge: 'Extendido', type: 'warn' },
 { name: 'Spring Air México', days: 9, badge: 'Atención', type: 'warn' },
 { name: 'Distribuidora Norte', days: 12, badge: 'Atención', type: 'warn' },
 ].map((lead) => (
 <div
 key={lead.name}
 onClick={() => handleOpenSupplierByName(lead.name, 'condiciones')}
 className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/70 border border-theme-subtle cursor-pointer transition-all space-y-1 group"
 >
 <span className="text-[11px] font-bold text-theme-main block truncate group-hover:text-rose-600 transition-colors">
 {lead.name}
 </span>
 <div className="flex items-baseline justify-between">
 <strong className="text-base font-mono font-black text-theme-main">
 {lead.days} <span className="text-[10px] font-normal text-theme-muted">días</span>
 </strong>
 <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border shadow-2xs ${
 lead.type === 'good'
 ? 'border-emerald-600 '
 : lead.type === 'neutral'
 ? 'border-zinc-300 '
 : 'border-amber-500'
 }`}>
 {lead.badge}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* FILA 5: ÚLTIMAS ENTREGAS (TABLA LIMPIA DE RECEPCIONES) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="p-5 border-b border-theme-subtle flex items-center justify-between">
 <div>
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Últimas Entregas Recibidas
 </h3>
 <p className="text-[11px] text-theme-muted mt-0.5">
 Registro reciente de arribos a CEDIS con validación de puntualidad y completitud física.
 </p>
 </div>
 <span className="text-xs font-mono text-theme-muted">CEDIS Monterrey Norte / Sur</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Proveedor</th>
 <th className="py-3 px-3">Orden de Compra</th>
 <th className="py-3 px-3">Fecha Esperada</th>
 <th className="py-3 px-3">Fecha Recibida</th>
 <th className="py-3 px-3 text-center">Resultado</th>
 <th className="py-3 px-4 text-right">Unidades</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {[
 { sup: 'Nayt México', oc: 'OC-2026-0081', exp: '25 Ago 2026', rec: '25 Ago 2026', res: 'A tiempo', resType: 'good', units: '20 / 20 pzas' },
 { sup: 'Restonic México', oc: 'OC-2026-0079', exp: '24 Ago 2026', rec: '24 Ago 2026', res: 'A tiempo', resType: 'good', units: '12 / 12 pzas' },
 { sup: 'Spring Air México', oc: 'OC-2026-0078', exp: '23 Ago 2026', rec: '25 Ago 2026', res: '2 días tarde', resType: 'warn', units: '18 / 18 pzas' },
 { sup: 'Sealy México', oc: 'OC-2026-0076', exp: '21 Ago 2026', rec: '21 Ago 2026', res: 'A tiempo', resType: 'good', units: '8 / 8 pzas' },
 { sup: 'Distribuidora del Norte', oc: 'OC-2026-0074', exp: '18 Ago 2026', rec: '22 Ago 2026', res: '4 días tarde', resType: 'warn', units: '15 / 15 pzas' },
 { sup: 'Colchones América', oc: 'OC-2026-0072', exp: '16 Ago 2026', rec: '16 Ago 2026', res: 'A tiempo', resType: 'good', units: '10 / 10 pzas' },
 ].map((row, idx) => (
 <tr key={idx} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4">
 <button
 type="button"
 onClick={() => handleOpenSupplierByName(row.sup, 'resumen')}
 className="font-bold text-theme-main hover:text-rose-600 transition-colors cursor-pointer text-left"
 >
 {row.sup}
 </button>
 </td>
 <td className="py-3 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
 {row.oc}
 </td>
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {row.exp}
 </td>
 <td className="py-3 px-3 font-mono text-theme-main whitespace-nowrap">
 {row.rec}
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border shadow-2xs ${
 row.resType === 'good'
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {row.res}
 </span>
 </td>
 <td className="py-3 px-4 text-right font-mono font-bold text-theme-main whitespace-nowrap">
 {row.units}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* FILA 6: PRECIOS Y CONDICIONES & COMPRAS RECIENTES E INCIDENCIAS */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
 
 {/* Precios y Condiciones Comerciales (7 columnas) */}
 <div className="lg:col-span-7 bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="p-5 border-b border-theme-subtle flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Precios y Condiciones Comerciales
 </span>
 <span className="text-[10px] text-theme-muted font-mono">Tarifarios pactados</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-4">Proveedor</th>
 <th className="py-2.5 px-3">Condición</th>
 <th className="py-2.5 px-3">Crédito</th>
 <th className="py-2.5 px-3 text-center">Entrega</th>
 <th className="py-2.5 px-4 text-right">Variación Precio</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {[
 { name: 'Nayt México', cond: 'Crédito', credit: '30 días', lead: '4 días', var: '+1.3%', varType: 'up' },
 { name: 'Restonic México', cond: 'Crédito', credit: '30 días', lead: '5 días', var: '-0.8%', varType: 'down' },
 { name: 'Sealy México', cond: 'Crédito', credit: '30 días', lead: '7 días', var: '+4.0%', varType: 'up' },
 { name: 'Spring Air México', cond: 'Crédito', credit: '45 días', lead: '9 días', var: '+4.6%', varType: 'up' },
 { name: 'Distribuidora del Norte', cond: 'Contado', credit: 'Inmediato', lead: '12 días', var: '0.0%', varType: 'neutral' },
 { name: 'Sleep Tech USA', cond: 'Anticipo', credit: '0 días', lead: '15 días', var: '+2.1%', varType: 'up' },
 ].map((row, idx) => (
 <tr key={idx} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-bold text-theme-main">
 <button
 type="button"
 onClick={() => handleOpenSupplierByName(row.name, 'condiciones')}
 className="hover:text-rose-600 transition-colors cursor-pointer text-left"
 >
 {row.name}
 </button>
 </td>
 <td className="py-3 px-3 font-semibold text-theme-main whitespace-nowrap">
 {row.cond}
 </td>
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {row.credit}
 </td>
 <td className="py-3 px-3 text-center font-mono text-theme-main whitespace-nowrap">
 {row.lead}
 </td>
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-900 border shadow-2xs ${
 row.varType === 'down'
 ? 'border-emerald-600 '
 : row.varType === 'up'
 ? 'border-amber-500'
 : 'border-zinc-300 '
 }`}>
 {row.var}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Compras Recientes & Incidencias (5 columnas) */}
 <div className="lg:col-span-5 space-y-4">
 
 {/* Compras Recientes por Proveedor */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Compras Recientes por Proveedor
 </span>

 <div className="space-y-2 text-xs">
 {[
 { name: 'Nayt México', orders: 8, max: 8 },
 { name: 'Spring Air México', orders: 6, max: 8 },
 { name: 'Restonic México', orders: 5, max: 8 },
 { name: 'Sealy México', orders: 4, max: 8 },
 ].map((co) => (
 <div
 key={co.name}
 onClick={() => handleOpenSupplierByName(co.name, 'resumen')}
 className="space-y-1 cursor-pointer group"
 >
 <div className="flex justify-between text-xs">
 <span className="font-semibold text-theme-main group-hover:text-rose-600 transition-colors">
 {co.name}
 </span>
 <span className="font-mono font-bold text-theme-main">{co.orders} órdenes</span>
 </div>
 <div className="h-1.5 w-full bg-theme-muted rounded-full overflow-hidden">
 <div
 className="h-full bg-rose-600 rounded-full"
 style={{ width: `${(co.orders / co.max) * 100}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Incidencias por Proveedor */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Incidencias Operativas Recientes
 </span>

 <div className="grid grid-cols-2 gap-2 text-xs">
 {[
 { name: 'Nayt México', count: 1, label: 'Diferencia menor de embalaje', type: 'low' },
 { name: 'Restonic México', count: 0, label: 'Sin incidencias registradas', type: 'none' },
 { name: 'Sealy México', count: 1, label: 'Retraso de 1 día', type: 'low' },
 { name: 'Spring Air México', count: 3, label: '2 retrasos, 1 empaque dañado', type: 'high' },
 ].map((inc) => (
 <div
 key={inc.name}
 onClick={() => handleOpenSupplierByName(inc.name, 'historial')}
 className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/60 border border-theme-subtle cursor-pointer transition-all space-y-1 group"
 >
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-bold text-theme-main truncate group-hover:text-rose-600 transition-colors">
 {inc.name}
 </span>
 <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border shadow-2xs ${
 inc.count === 0
 ? 'border-emerald-600 '
 : inc.count === 1
 ? 'border-blue-500'
 : 'border-amber-500'
 }`}>
 {inc.count} inc.
 </span>
 </div>
 <p className="text-[10px] text-theme-muted truncate">{inc.label}</p>
 </div>
 ))}
 </div>
 </div>

 </div>

 </div>

 {/* ========================================================================= */}
 {/* MODAL / POPOVER: DETALLE DE DESEMPEÑO DE PROVEEDOR */}
 {/* ========================================================================= */}
 {selectedPerformanceSupplier && (
 <ModalPortal onClose={() => setSelectedPerformanceSupplier(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-5">
 
 {/* Header Modal */}
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="space-y-0.5">
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Evaluación de Desempeño
 </span>
 <h4 className="text-base font-black text-theme-main">
 {selectedPerformanceSupplier.supplierTradeName}
 </h4>
 </div>
 <button
 onClick={() => setSelectedPerformanceSupplier(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Main Score Pill */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between">
 <div>
 <span className="text-xs font-bold text-theme-muted block">Score Global de Desempeño:</span>
 <span className="text-[11px] text-theme-muted">{selectedPerformanceSupplier.recentNotes}</span>
 </div>
 <div className="text-right shrink-0">
 <strong className="text-3xl font-mono font-black text-rose-600 block">
 {selectedPerformanceSupplier.score}%
 </strong>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {selectedPerformanceSupplier.ratingLabel}
 </span>
 </div>
 </div>

 {/* Metrics Breakdown Grid */}
 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Entregas a Tiempo:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedPerformanceSupplier.onTimePercent}%
 </strong>
 </div>

 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Tiempo Promedio:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedPerformanceSupplier.avgLeadDays} días
 </strong>
 </div>

 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Cumplimiento de Cantidad:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedPerformanceSupplier.fillRatePercent}%
 </strong>
 </div>

 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Incidencias Registradas:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedPerformanceSupplier.incidentsCount} reporte(s)
 </strong>
 </div>

 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Variación Promedio:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 +{selectedPerformanceSupplier.priceVariationPercent}%
 </strong>
 </div>

 <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] text-theme-muted font-bold block uppercase">Órdenes Analizadas:</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedPerformanceSupplier.analyzedOrdersCount} órdenes
 </strong>
 </div>
 </div>

 {/* Helper Note */}
 <p className="text-[10px] text-theme-muted italic">
 Indicador demo calculado a partir del histórico de cumplimiento en recepciones de CEDIS, discrepancias de embarque y condiciones pactadas.
 </p>

 {/* Action Buttons */}
 <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setSelectedPerformanceSupplier(null)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cerrar
 </button>
 <button
 onClick={() => {
 const sName = selectedPerformanceSupplier.supplierTradeName;
 setSelectedPerformanceSupplier(null);
 handleOpenSupplierByName(sName, 'resumen');
 }}
 className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
 >
 <span>Ver expediente de proveedor</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>

 </div>
 </ModalPortal>
 )}

 </div>
 );
};
