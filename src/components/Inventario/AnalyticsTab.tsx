import React, { useState } from 'react';
import { 
 TrendingUp, 
 BarChart3, 
 PieChart, 
 Calendar, 
 FileSpreadsheet, 
 Download, 
 Building2, 
 Sparkles, 
 Clock, 
 Boxes, 
 DollarSign, 
 ArrowUpRight, 
 CheckCircle2, 
 AlertTriangle, 
 ChevronRight, 
 Layers, 
 Flame, 
 Info,
 PackageCheck,
 RefreshCw,
 Percent
} from 'lucide-react';
import { 
 MOCK_ANALYTICS_DATA_30D, 
 AnalyticsDataset 
} from '../../data/mockAnalyticsData';

interface AnalyticsTabProps {
 onShowToast?: (msg: string) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ onShowToast }) => {
 const [selectedNode, setSelectedNode] = useState<string>('all');
 const [selectedPeriod, setSelectedPeriod] = useState<string>('30 días');
 const [exportSuccessMessage, setExportSuccessMessage] = useState<{ filename: string; subtitle: string } | null>(null);

 const data: AnalyticsDataset = MOCK_ANALYTICS_DATA_30D;

 const handlePeriodChange = (newPeriod: string) => {
 setSelectedPeriod(newPeriod);
 if (onShowToast) {
 onShowToast('Modo demo: los periodos muestran datos simulados para fines de presentación.');
 }
 };

 const handleExportExcel = () => {
 const filename = `inventario_${selectedNode === 'all' ? 'RED-LOGISTICA' : selectedNode.toUpperCase()}_2026-08-27.xlsx`;
 const subtitle = `Analítica de Inventario · ${
 selectedNode === 'all' ? 'Todas las instalaciones' : selectedNode
 } · Últimos ${selectedPeriod}`;

 setExportSuccessMessage({ filename, subtitle });
 if (onShowToast) {
 onShowToast(`Reporte exportado correctamente: ${filename}`);
 }

 // Auto-dismiss banner after 6s
 setTimeout(() => {
 setExportSuccessMessage(null);
 }, 6000);
 };

 const formatMxn = (val: number) => {
 if (val >= 1000000) {
 return `$${(val / 1000000).toFixed(2)} M MXN`;
 }
 if (val >= 1000) {
 return `$${(val / 1000).toFixed(1)} K MXN`;
 }
 return `$${val.toLocaleString()} MXN`;
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full pb-12">
 
 {/* ========================================================================= */}
 {/* 1. HEADER & CONTROLES SUPERIORES */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Inteligencia Logística &middot; Módulo Inventario
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 Analítica Operativa
 </span>
 </div>
 <h2 className="text-lg sm:text-xl font-black text-theme-main flex items-center gap-2">
 <BarChart3 className="w-5 h-5 text-theme-primary" />
 <span>Analítica de Inventario</span>
 </h2>
 <p className="text-xs text-theme-muted">
 Tendencias, rotación, ocupación y comportamiento operativo del inventario.
 </p>
 </div>

 {/* Action Controls: Node, Period, Export */}
 <div className="flex items-center gap-2.5 flex-wrap justify-start md:justify-end text-xs">
 {/* Node Filter */}
 <select
 value={selectedNode}
 onChange={(e) => setSelectedNode(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todas las Instalaciones</option>
 <option value="CEDIS Monterrey Norte">CEDIS Monterrey Norte</option>
 <option value="CEDIS Monterrey Sur">CEDIS Monterrey Sur</option>
 <option value="Sucursal Valle Oriente">Sucursal Valle Oriente</option>
 <option value="Sucursal Cumbres">Sucursal Cumbres</option>
 </select>

 {/* Period Filter */}
 <select
 value={selectedPeriod}
 onChange={(e) => handlePeriodChange(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="Hoy">Hoy</option>
 <option value="7 días">Últimos 7 días</option>
 <option value="30 días">Últimos 30 días</option>
 <option value="90 días">Últimos 90 días</option>
 <option value="6 meses">Últimos 6 meses</option>
 <option value="12 meses">Últimos 12 meses</option>
 </select>

 {/* Export Excel Button */}
 <button
 onClick={handleExportExcel}
 className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
 >
 <FileSpreadsheet className="w-4 h-4" />
 <span>Exportar Excel</span>
 </button>
 </div>
 </div>

 {/* Export Success Toast/Banner */}
 {exportSuccessMessage && (
 <div className="p-4 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 border border-emerald-600 shadow-2xs flex items-center justify-center shrink-0">
 <CheckCircle2 className="w-4 h-4" />
 </div>
 <div>
 <strong className="text-zinc-900 font-bold block">
 Reporte exportado correctamente: <span className="font-mono">{exportSuccessMessage.filename}</span>
 </strong>
 <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
 {exportSuccessMessage.subtitle}
 </span>
 </div>
 </div>
 <button
 onClick={() => setExportSuccessMessage(null)}
 className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 font-bold text-xs cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 )}

 {/* ========================================================================= */}
 {/* 2. KPIs ANALÍTICOS GLOBALES */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
 
 {/* Movimientos del periodo */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Movimientos del Periodo</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block">
 {data.kpis.totalMovements.toLocaleString()} ops
 </strong>
 <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
 <ArrowUpRight className="w-3 h-3" />
 <span>+14.2% vs periodo anterior</span>
 </span>
 </div>

 {/* Rotación Promedio */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Rotación Promedio</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-purple-600 block">
 {data.kpis.avgTurnoverRate}x / año
 </strong>
 <span className="text-[10px] text-theme-muted">
 Velocidad de salida en rack
 </span>
 </div>

 {/* Valor Promedio */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Valor Promedio Inventario</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block">
 {formatMxn(data.kpis.avgInventoryValue)}
 </strong>
 <span className="text-[10px] text-theme-muted">
 Valuación a costo interno
 </span>
 </div>

 {/* Días en Almacén */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Estancia Promedio</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-theme-primary block">
 {data.kpis.avgDaysInWarehouse} días
 </strong>
 <span className="text-[10px] text-theme-muted">
 Tiempo de permanencia
 </span>
 </div>

 {/* Ocupación Promedio */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ocupación Promedio</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-blue-600 block">
 {data.kpis.avgOccupancyPercentage}%
 </strong>
 <span className="text-[10px] text-theme-muted">
 Utilización física de espacio
 </span>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 3. DOS GRÁFICAS PRINCIPALES (TENDENCIA + ESTADOS) */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* GRÁFICA 1: TENDENCIA DE MOVIMIENTOS */}
 <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 1. Tendencia de Movimientos Operativos
 </h3>
 <p className="text-[11px] text-theme-muted">
 Volumen acumulado por semana clasificado por tipo de movimiento de almacén.
 </p>
 </div>
 </div>

 {/* Stacked Bars / Legend */}
 <div className="space-y-3 pt-2">
 {data.movementTrends.map((week, idx) => (
 <div key={idx} className="space-y-1 text-xs">
 <div className="flex items-center justify-between text-[11px]">
 <span className="font-bold text-theme-main">{week.label}</span>
 <span className="font-mono font-bold text-theme-primary">{week.total} movimientos</span>
 </div>
 
 {/* Multi-segment Bar */}
 <div className="h-4 w-full bg-theme-muted rounded-full overflow-hidden flex shadow-inner">
 <div style={{ width: `${(week.picking / week.total) * 100}%` }} className="bg-purple-600 h-full" title={`Recolección: ${week.picking}`} />
 <div style={{ width: `${(week.shipping / week.total) * 100}%` }} className="bg-emerald-500 h-full" title={`Embarque: ${week.shipping}`} />
 <div style={{ width: `${(week.entries / week.total) * 100}%` }} className="bg-blue-500 h-full" title={`Entradas: ${week.entries}`} />
 <div style={{ width: `${(week.staging / week.total) * 100}%` }} className="bg-amber-500 h-full" title={`Acomodo: ${week.staging}`} />
 <div style={{ width: `${(week.rearrangements / week.total) * 100}%` }} className="bg-indigo-400 h-full" title={`Reacomodos: ${week.rearrangements}`} />
 <div style={{ width: `${(week.transfers / week.total) * 100}%` }} className="bg-teal-400 h-full" title={`Traspasos: ${week.transfers}`} />
 </div>
 </div>
 ))}

 {/* Custom Legend */}
 <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-theme-subtle text-[10px] text-theme-muted font-bold">
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Recolección</span>
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Embarque</span>
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Entradas</span>
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Acomodo</span>
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Reacomodos</span>
 <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Traspasos</span>
 </div>
 </div>
 </div>

 {/* GRÁFICA 2: INVENTARIO POR ESTADO */}
 <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 2. Composición de Inventario por Estado
 </h3>
 <p className="text-[11px] text-theme-muted">
 Distribución física y compromiso del stock activo.
 </p>
 </div>

 <div className="space-y-2.5 pt-1">
 {data.inventoryByStatus.map((st) => (
 <div key={st.status} className="space-y-1 text-xs">
 <div className="flex items-center justify-between text-[11px]">
 <span className="font-bold text-theme-main">{st.status}</span>
 <div className="flex items-center gap-2">
 <span className="font-mono text-theme-muted">{st.count} u.</span>
 <strong className="font-mono font-bold text-theme-main">{st.percentage}%</strong>
 </div>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div className={`${st.color.split(' ')[0]} h-full rounded-full`} style={{ width: `${st.percentage}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 4. GRÁFICA 3 & 4: TOP ARTÍCULOS MOVIDOS VS ARTÍCULOS SIN MOVIMIENTO */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* GRÁFICA 3: TOP ARTÍCULOS MÁS MOVIDOS */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 3. Top 10 Artículos Más Movidos
 </h3>
 <p className="text-[11px] text-theme-muted">
 Mayor frecuencia de salidas, recolección y acomodo en el periodo.
 </p>
 </div>

 <div className="space-y-2.5">
 {data.topMovedArticles.map((art, idx) => (
 <div key={art.sku} className="space-y-1 text-xs">
 <div className="flex items-center justify-between text-[11px]">
 <div className="flex items-center gap-2 min-w-0">
 <span className="w-5 h-5 rounded-full bg-white text-zinc-900 border border-purple-500 shadow-2xs font-bold text-[10px] flex items-center justify-center shrink-0">
 {idx + 1}
 </span>
 <span className="font-bold text-theme-main truncate">{art.name}</span>
 </div>
 <strong className="font-mono text-purple-600 font-bold shrink-0 ml-2">
 {art.movementsCount} ops ({art.percentage}%)
 </strong>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div
 className="bg-purple-600 h-full rounded-full"
 style={{ width: `${(art.movementsCount / data.topMovedArticles[0].movementsCount) * 100}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* GRÁFICA 4: ARTÍCULOS SIN MOVIMIENTO RECIENTE */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider text-rose-700 dark:text-rose-400">
 4. Artículos Sin Movimiento Reciente (Baja Rotación)
 </h3>
 <p className="text-[11px] text-theme-muted">
 Existencias inmovilizadas con riesgo de obsolescencia o capital detenido.
 </p>
 </div>

 <div className="space-y-3">
 {data.idleArticles.map((art) => (
 <div key={art.sku} className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between gap-3 text-xs">
 <div className="min-w-0 space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-[10px] font-bold text-theme-primary">{art.sku}</span>
 <span className="text-[10px] text-theme-muted">{art.brand} &middot; {art.category}</span>
 </div>
 <h5 className="font-bold text-theme-main truncate">{art.name}</h5>
 </div>

 <div className="text-right shrink-0">
 <div className="font-mono font-black text-rose-600 text-xs">
 {art.stockUnits} u. &middot; {art.daysWithoutMovement} días
 </div>
 <span className="text-[10px] text-theme-muted font-mono font-semibold">
 {formatMxn(art.tiedCapital)} inmovilizado
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 5. GRÁFICA 5 & 6: OCUPACIÓN POR ZONA & VALOR POR MARCA */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* GRÁFICA 5: OCUPACIÓN POR ZONA */}
 <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 5. Ocupación Física por Zona y Pasillo
 </h3>
 <p className="text-[11px] text-theme-muted">
 Nivel de saturación en racks selectivos y áreas operativas.
 </p>
 </div>

 <div className="space-y-2.5">
 {data.zoneOccupancy.map((zone) => (
 <div key={zone.zone} className="space-y-1 text-xs">
 <div className="flex items-center justify-between text-[11px]">
 <span className="font-bold text-theme-main truncate">{zone.zone}</span>
 <div className="flex items-center gap-2">
 <span className="font-mono text-theme-muted">{zone.occupied}/{zone.capacity}</span>
 <strong className={`font-mono font-bold ${zone.percentage > 85 ? 'text-rose-600' : 'text-theme-main'}`}>
 {zone.percentage}%
 </strong>
 </div>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full ${
 zone.percentage > 85 ? 'bg-rose-500' : zone.percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
 }`}
 style={{ width: `${zone.percentage}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* GRÁFICA 6: VALOR DE INVENTARIO POR MARCA */}
 <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 6. Valor de Inventario a Costo por Marca
 </h3>
 <p className="text-[11px] text-theme-muted">
 Concentración financiera del stock disponible y comprometido.
 </p>
 </div>

 <div className="space-y-2.5">
 {data.brandValueBreakdown.map((b) => (
 <div key={b.brand} className="space-y-1 text-xs">
 <div className="flex items-center justify-between text-[11px]">
 <div className="flex items-center gap-2">
 <span className="font-bold text-theme-main">{b.brand}</span>
 <span className="text-[10px] text-theme-muted font-mono">({b.unitsCount} unidades)</span>
 </div>
 <strong className="font-mono font-bold text-emerald-600">
 {formatMxn(b.costValue)} ({b.percentage}%)
 </strong>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div
 className="bg-emerald-500 h-full rounded-full"
 style={{ width: `${b.percentage * 2.5}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 6. GRÁFICA 7 & 8: ANTIGÜEDAD & CLASIFICACIÓN DE ROTACIÓN */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* GRÁFICA 7: ANTIGÜEDAD */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 7. Distribución por Antigüedad en Almacén
 </h3>
 <p className="text-[11px] text-theme-muted">
 Días de estancia física desde el registro de recepción y serialización.
 </p>
 </div>

 <div className="space-y-3">
 {data.ageDistribution.map((age) => (
 <div key={age.range} className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1.5 text-xs">
 <div className="flex items-center justify-between">
 <span className="font-bold text-theme-main">{age.range}</span>
 <div className="font-mono font-bold text-theme-primary">
 {age.units} unidades &middot; {formatMxn(age.valueMxn)}
 </div>
 </div>
 <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
 <div
 className="bg-purple-600 h-full rounded-full"
 style={{ width: `${age.percentage}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* GRÁFICA 8: ROTACIÓN DE ARTÍCULOS */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 8. Clasificación por Nivel de Rotación
 </h3>
 <p className="text-[11px] text-theme-muted">
 Segmentación de catálogo según velocidad de evacuación operativa.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {data.rotationClassification.map((rot) => (
 <div key={rot.category} className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 text-xs flex flex-col justify-between">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-bold text-theme-main">{rot.category}</span>
 <span className="font-mono text-[10px] font-bold text-purple-600">{rot.skusCount} SKUs</span>
 </div>
 <p className="text-[10px] text-theme-muted leading-relaxed">
 {rot.description}
 </p>
 </div>
 <div className="pt-2 border-t border-theme-subtle font-mono text-[11px] font-bold text-theme-primary">
 {rot.unitsCount} u. ({rot.percentage}%)
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 7. GRÁFICA 9 & 10: ACTIVIDAD SEMANAL (HEATMAP) & TOP UBICACIONES */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* GRÁFICA 9: ACTIVIDAD SEMANAL (HEATMAP MATRIX) */}
 <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
 <Flame className="w-4 h-4 text-amber-500" />
 <span>9. Mapa de Calor Semanal (Día vs Franja Horaria)</span>
 </h3>
 <p className="text-[11px] text-theme-muted">
 Concentración de movimientos operativos para balanceo de turnos y montacargas.
 </p>
 </div>

 {/* Matrix Grid */}
 <div className="overflow-x-auto pt-2">
 <div className="min-w-[420px] space-y-2">
 {/* Header Time Slots */}
 <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-theme-muted">
 <span className="text-left">Día</span>
 <span>06-09h</span>
 <span>09-12h</span>
 <span>12-15h</span>
 <span>15-18h</span>
 <span>18-21h</span>
 </div>

 {/* Rows per Day */}
 {data.weeklyActivityMatrix.map((row) => (
 <div key={row.day} className="grid grid-cols-6 gap-2 items-center text-xs">
 <span className="font-bold text-theme-main text-[11px]">{row.day}</span>
 {row.hours.map((slot) => {
 const intensity = slot.activityLevel;
 const bgClass =
 intensity > 90
 ? 'bg-rose-600 text-white font-black'
 : intensity > 75
 ? 'bg-amber-500 text-white font-bold'
 : intensity > 50
 ? 'bg-purple-600/75 text-white font-semibold'
 : 'bg-theme-muted text-theme-muted';

 return (
 <div
 key={slot.timeSlot}
 className={`h-8 rounded-xl flex items-center justify-center text-[10px] font-mono transition-all ${bgClass}`}
 title={`${row.day} ${slot.timeSlot}: ${slot.opsCount} ops (${slot.activityLevel}%)`}
 >
 {slot.opsCount}
 </div>
 );
 })}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* GRÁFICA 10: TOP UBICACIONES MÁS ACTIVAS & MENOS USADAS */}
 <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-0.5">
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 10. Rankings de Ubicaciones Físicas
 </h3>
 <p className="text-[11px] text-theme-muted">
 Espacios de alta rotación vs posiciones subutilizadas.
 </p>
 </div>

 <div className="space-y-4 text-xs">
 {/* Most Active */}
 <div className="space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-emerald-600 block">
 Top 5 Más Activas (Alta Demanda)
 </span>
 <div className="space-y-1">
 {data.topLocations.mostActive.slice(0, 3).map((loc) => (
 <div key={loc.code} className="p-2 rounded-xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-[11px]">
 <div>
 <span className="font-mono font-black text-theme-primary">{loc.code}</span>
 <span className="text-theme-main font-semibold ml-2">{loc.name}</span>
 </div>
 <span className="font-mono font-bold text-emerald-600">{loc.opsCount} ops</span>
 </div>
 ))}
 </div>
 </div>

 {/* Least Used */}
 <div className="space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-rose-600 block">
 Menos Utilizadas (Candidatas a Reacomodo)
 </span>
 <div className="space-y-1">
 {data.topLocations.leastUsed.slice(0, 3).map((loc) => (
 <div key={loc.code} className="p-2 rounded-xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-[11px]">
 <div>
 <span className="font-mono font-black text-rose-600">{loc.code}</span>
 <span className="text-theme-main font-semibold ml-2">{loc.name}</span>
 </div>
 <span className="font-mono text-theme-muted">{loc.opsCount} ops</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 8. INSIGHTS DEL PERIODO (HALLAZGOS ACCIONABLES) */}
 {/* ========================================================================= */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-theme-main">
 <Sparkles className="w-5 h-5 text-purple-600" />
 <h3 className="text-sm font-black uppercase tracking-wider">
 Insights Operativos del Periodo
 </h3>
 </div>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 5 Hallazgos Detectados
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {data.insights.map((ins) => (
 <div
 key={ins.id}
 className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 shadow-2xs flex flex-col justify-between"
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {ins.metric}
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">
 {ins.title}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 {ins.description}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};
