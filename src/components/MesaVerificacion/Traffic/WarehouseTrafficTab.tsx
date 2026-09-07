import React, { useState } from 'react';
import { 
 Activity, 
 RefreshCw, 
 ArrowRight, 
 Clock, 
 AlertTriangle, 
 TrendingUp, 
 Building2, 
 Flame, 
 Boxes, 
 Layers, 
 CheckCircle2, 
 Sparkles, 
 MapPin, 
 ArrowDownLeft, 
 ArrowRightLeft, 
 PackageSearch, 
 ArrowUpRight, 
 User, 
 ShieldAlert 
} from 'lucide-react';
import { 
 getTrafficDataForCedis, 
 TrafficDataset 
} from '../../../data/mockTrafficData';
import { 
 HourlyActivityChart, 
 OperationalFunnel, 
 StageAvgDurationBars, 
 DayHourMatrixHeatmap 
} from './WarehouseTrafficCharts';
import { VerificationDeskTabId } from '../../MesaVerificacion';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

interface WarehouseTrafficTabProps {
 onNavigate: (tabId: VerificationDeskTabId) => void;
}

export const WarehouseTrafficTab: React.FC<WarehouseTrafficTabProps> = ({
 onNavigate,
}) => {
 const { selectedCedisId, selectedCedis } = useVerificationDeskCedis();
 const [period, setPeriod] = useState<string>('today');
 const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

 const traffic: TrafficDataset = getTrafficDataForCedis(period, selectedCedisId);

 const handleRefresh = () => {
 setIsRefreshing(true);
 setTimeout(() => setIsRefreshing(false), 500);
 };

 return (
 <div className="space-y-6">
 
 {/* Header & Selectors */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
 <div>
 <h2 className="text-base font-extrabold text-theme-main tracking-tight flex items-center gap-2">
 <Activity className="w-5 h-5 text-theme-primary" />
 <span>Tráfico Operativo</span>
 </h2>
 <p className="text-xs text-theme-muted mt-0.5">
 Analiza el volumen, ritmo y distribución de las operaciones físicas del almacén.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2.5">
 {/* Period selector */}
 <div className="flex items-center gap-1.5 bg-theme-muted/40 p-1 rounded-2xl border border-theme-subtle">
 {[
 { id: 'today', label: 'Hoy' },
 { id: 'yesterday', label: 'Ayer' },
 { id: '7d', label: '7 días' },
 { id: '30d', label: '30 días' },
 ].map((p) => (
 <button
 key={p.id}
 onClick={() => setPeriod(p.id)}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 period === p.id
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 {p.label}
 </button>
 ))}
 </div>

 {/* Active CEDIS Display */}
 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-theme-muted/60 border border-theme-subtle text-xs font-bold text-theme-main">
 <Building2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span>{selectedCedis.name}</span>
 </div>

 {/* Refresh Button */}
 <button
 onClick={handleRefresh}
 className={`p-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-all cursor-pointer ${
 isRefreshing ? 'animate-spin' : ''
 }`}
 title="Actualizar métricas"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Demo Mode Notice */}
 <div className="flex items-center justify-between text-[11px] text-theme-muted pt-2 border-t border-theme-subtle font-mono">
 <span className="flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
 <span>Modo demo: los periodos históricos contienen información simulada para análisis de throughput.</span>
 </span>
 <span>Throughput actual: 23 u/h</span>
 </div>
 </div>

 {/* 6 Top KPIs */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
 {/* KPI 1 */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Movimientos procesados
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 {traffic.totalMoves}
 </strong>
 <span className="text-[10px] text-emerald-600 font-bold block">
 +12% vs periodo anterior
 </span>
 </div>

 {/* KPI 2 */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Ritmo promedio
 </span>
 <strong className="text-2xl font-mono font-black text-theme-primary block">
              {traffic.pacePerHour} <span className="text-xs text-theme-muted font-sans font-bold">u/h</span>
 </strong>
 <span className="text-[10px] text-theme-muted block">
 Cadencia en piso
 </span>
 </div>

 {/* KPI 3 */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Hora pico
 </span>
 <strong className="text-sm font-mono font-black text-theme-main block truncate">
 {traffic.peakHour}
 </strong>
 <span className="text-[10px] text-amber-600 font-bold block">
 {traffic.peakHourOps} operaciones
 </span>
 </div>

 {/* KPI 4 */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Tiempo de proceso
 </span>
 <strong className="text-2xl font-mono font-black text-theme-main block">
 {traffic.avgProcessMinutes} <span className="text-xs text-theme-muted font-sans font-bold">min</span>
 </strong>
 <span className="text-[10px] text-theme-muted block truncate">
 Promedio por etapa
 </span>
 </div>

 {/* KPI 5 */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Órdenes activas
 </span>
 <strong className="text-2xl font-mono font-black text-blue-600 block">
 {traffic.activeOrdersCount}
 </strong>
 <span className="text-[10px] text-theme-muted block">
 En curso en piso
 </span>
 </div>

 {/* KPI 6 */}
 <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-xs space-y-1 text-rose-950 dark:text-rose-200">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-600 block">
 Incidencias
 </span>
 <strong className="text-2xl font-mono font-black text-rose-600 block">
 {traffic.incidentsCount}
 </strong>
 <span className="text-[10px] text-rose-700 font-bold block">
 {traffic.incidentsRate} del volumen
 </span>
 </div>
 </div>

 {/* Main Section Grid: Hourly Activity Chart + Bottlenecks */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Main Hourly Flow Chart (2/3) */}
 <div className="lg:col-span-2 bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Actividad por Hora (Throughput Operativo)
 </h3>
 <p className="text-[11px] text-theme-muted">
 Volumen horario de unidades procesadas por etapa física de almacén.
 </p>
 </div>
 <span className="font-mono text-xs font-bold text-theme-primary">
 Pico: {traffic.peakHour}
 </span>
 </div>

 <HourlyActivityChart data={traffic.hourlyPoints} />
 </div>

 {/* Bottlenecks Card (1/3) */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 <span>Cuellos de Botella Detectados</span>
 </h3>
 <p className="text-[11px] text-theme-muted">
 Puntos de fricción con acumulación de tiempo en piso.
 </p>
 </div>

 <div className="space-y-3 text-xs">
 {/* Bottleneck 1 */}
 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
 <div className="flex items-center justify-between">
 <strong className="text-rose-600 font-bold">Acomodo en Rack</strong>
 <span className="font-mono font-bold text-amber-600">2 h 04 min avg</span>
 </div>
 <p className="text-[11px] text-theme-muted">18 unidades pendientes de estiba en Pasillos A y B.</p>
 <button
 type="button"
 onClick={() => onNavigate('putaway')}
 className="text-[11px] font-bold text-theme-main hover:text-theme-primary flex items-center gap-1 cursor-pointer pt-1"
 >
 <span>Ver acomodo</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 {/* Bottleneck 2 */}
 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
 <div className="flex items-center justify-between">
 <strong className="text-purple-600 font-bold">Recolección de Mercancía</strong>
 <span className="font-mono font-bold text-theme-muted">2 órdenes &gt; 1 h</span>
 </div>
 <p className="text-[11px] text-theme-muted">OR-2026-0118 con demora en Parada #3 por discrepancia.</p>
 <button
 type="button"
 onClick={() => onNavigate('picking')}
 className="text-[11px] font-bold text-theme-main hover:text-theme-primary flex items-center gap-1 cursor-pointer pt-1"
 >
 <span>Ver recolección</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 {/* Bottleneck 3 */}
 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
 <div className="flex items-center justify-between">
 <strong className="text-amber-600 font-bold">Verificación de Salida</strong>
 <span className="font-mono font-bold text-rose-600">1 discrepancia</span>
 </div>
 <p className="text-[11px] text-theme-muted">VS-2026-0041 en carril EMB-03 requiere sustitución de UID.</p>
 <button
 type="button"
 onClick={() => onNavigate('outbound')}
 className="text-[11px] font-bold text-theme-main hover:text-theme-primary flex items-center gap-1 cursor-pointer pt-1"
 >
 <span>Ver salida</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Grid: Embudo Operativo + Tiempos Promedio por Etapa */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Funnel Card */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main">
 Embudo de Conversión del Flujo Físico
 </h3>
 <OperationalFunnel volumes={traffic.stageVolumes} />
 </div>

 {/* Stage Average Duration Bars */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main">
 Tiempo Promedio por Etapa
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">Minutos por ciclo</span>
 </div>
 <StageAvgDurationBars minutes={traffic.stageAvgMinutes} />
 </div>

 </div>

 {/* Grid: Zonas de Mayor Actividad + Mini Heatmap de Pasillos */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* Active Zones & Staging Table */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <Boxes className="w-4 h-4 text-theme-primary" />
 <span>Zonas con Mayor Actividad de Piso</span>
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">Toques físicos</span>
 </div>

 <div className="space-y-2">
 {traffic.topZones.map((z) => (
 <div
 key={z.zone}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs"
 >
 <div>
 <strong className="font-mono text-theme-primary block text-xs">{z.zone}</strong>
 <span className="text-[10px] text-theme-muted">{z.label}</span>
 </div>
 <div className="text-right font-mono">
 <strong className="text-theme-main text-xs">{z.moves} movs</strong>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Heatmap Section */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <Flame className="w-4 h-4 text-amber-500" />
 <span>Intensidad de Tráfico (Día &times; Hora)</span>
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">Concentración semanal</span>
 </div>

 {traffic.dayHourHeatmap.length > 0 ? (
 <DayHourMatrixHeatmap data={traffic.dayHourHeatmap} />
 ) : (
 <div className="p-8 text-center text-theme-muted text-xs">
 El mapa de calor detallado está disponible para periodos consolidados de 7 y 30 días.
 </div>
 )}
 </div>

 </div>

 {/* Grid: Top Artículos Más Movidos & Actividad por Operador */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Top Articles (2/3) */}
 <div className="lg:col-span-2 bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main">
 Artículos con Mayor Rotación Operativa
 </h3>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[9px]">
 <th className="py-2.5 px-3">Artículo / SKU</th>
 <th className="py-2.5 px-2 text-center">Entradas</th>
 <th className="py-2.5 px-2 text-center">Acomodo</th>
 <th className="py-2.5 px-2 text-center">Recolección</th>
 <th className="py-2.5 px-2 text-center">Salidas</th>
 <th className="py-2.5 px-3 text-right">Total Movs</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {traffic.topArticles.map((art) => (
 <tr key={art.sku} className="hover:bg-theme-muted/30">
 <td className="py-2.5 px-3">
 <strong className="text-theme-main block text-xs">{art.name}</strong>
 <span className="text-[10px] font-mono text-theme-muted">{art.sku}</span>
 </td>
 <td className="py-2.5 px-2 text-center font-mono text-theme-primary font-bold">{art.inbound}</td>
 <td className="py-2.5 px-2 text-center font-mono text-blue-600 font-bold">{art.putaway}</td>
 <td className="py-2.5 px-2 text-center font-mono text-purple-600 font-bold">{art.picking}</td>
 <td className="py-2.5 px-2 text-center font-mono text-amber-600 font-bold">{art.outbound}</td>
 <td className="py-2.5 px-3 text-right font-mono font-black text-theme-main">{art.totalMoves}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Operator Activity (1/3) */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <User className="w-4 h-4 text-theme-primary" />
 <span>Actividad por Operador</span>
 </h3>

 <div className="space-y-2 font-mono text-xs">
 {traffic.operators.map((op) => (
 <div key={op.name} className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <div className="flex items-center justify-between font-sans">
 <strong className="text-theme-main text-xs">{op.name}</strong>
 <span className="font-mono font-black text-theme-primary">{op.total} movs</span>
 </div>
 <div className="grid grid-cols-4 gap-1 text-[9px] text-theme-muted">
 <span>Ent: {op.inbound}</span>
 <span>Acom: {op.putaway}</span>
 <span>Rec: {op.picking}</span>
 <span>Sal: {op.outbound}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* Grid: Órdenes Más Lentas & Insights Operativos */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* Slow Orders */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main">
 Órdenes con Mayor Tiempo en Proceso
 </h3>
 <div className="space-y-2">
 {traffic.slowOrders.map((ord) => (
 <div
 key={ord.folio}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs"
 >
 <div>
 <div className="flex items-center gap-2">
 <strong className="font-mono text-theme-primary">{ord.folio}</strong>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {ord.stage}
 </span>
 </div>
 <span className="text-[10px] text-theme-muted">{ord.progress}</span>
 </div>

 <div className="flex items-center gap-3">
 <span className="font-mono font-bold text-amber-600 text-xs">{ord.timeActive}</span>
 <button
 type="button"
 onClick={() => onNavigate(ord.tabTarget)}
 className="px-2.5 py-1 rounded-xl bg-theme-surface hover:bg-theme-primary hover:text-white text-theme-main font-bold text-[11px] border border-theme-subtle transition-all cursor-pointer"
 >
 Ver
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Insights Section */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-amber-500" />
 <span>Análisis Operativo del Periodo</span>
 </h3>

 <div className="space-y-2 text-xs">
 {traffic.insights.map((insight, idx) => (
 <div
 key={idx}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-start gap-2.5 text-theme-main"
 >
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
 <p className="text-[11px] leading-relaxed font-medium">{insight}</p>
 </div>
 ))}
 </div>
 </div>

 </div>

 </div>
 );
};
