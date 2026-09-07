import React, { useState, useMemo } from 'react';
import { 
 ArrowDownLeft, 
 ArrowRightLeft, 
 PackageSearch, 
 ArrowUpRight, 
 AlertTriangle, 
 QrCode, 
 RefreshCw, 
 Search, 
 ArrowRight, 
 CheckCircle2, 
 Clock, 
 AlertCircle, 
 Building2, 
 Layers, 
 Boxes, 
 ShieldAlert, 
 Sparkles, 
 Calendar, 
 Eye, 
 MapPin 
} from 'lucide-react';
import { 
 getSummaryDataForCedis, 
 MOCK_RECENT_AUDIT_EVENTS, 
 MOCK_CEDIS_STAGING_LANES_SUMMARY, 
 MOCK_CEDIS_INBOUND_BAYS_SUMMARY, 
 SummaryAuditEvent, 
 SummaryPendingItem 
} from '../../../data/mockSummaryData';
import { VerificationDeskTabId } from '../../MesaVerificacion';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

interface OperationalSummaryTabProps {
 onNavigate: (tabId: VerificationDeskTabId) => void;
}

export const OperationalSummaryTab: React.FC<OperationalSummaryTabProps> = ({
 onNavigate,
}) => {
 const { selectedFacilityId, selectedFacility, isSucursal } = useVerificationDeskCedis();
 const [period, setPeriod] = useState<string>('today');
 const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
 const [activitySearch, setActivitySearch] = useState<string>('');

 const currentData = getSummaryDataForCedis(period, selectedFacilityId);

 const stagingLanes = MOCK_CEDIS_STAGING_LANES_SUMMARY[selectedFacilityId] || [];
 const inboundBays = MOCK_CEDIS_INBOUND_BAYS_SUMMARY[selectedFacilityId] || [];

 const handleRefresh = () => {
 setIsRefreshing(true);
 setTimeout(() => setIsRefreshing(false), 500);
 };

 // Filtered recent activity events
 const filteredEvents = useMemo(() => {
 const cedisEvents = MOCK_RECENT_AUDIT_EVENTS.filter(
 (e) => !e.warehouseId || e.warehouseId === selectedFacilityId
 );
 const q = activitySearch.toLowerCase().trim();
 if (!q) return cedisEvents;
 return cedisEvents.filter(
 (e) =>
 e.activity.toLowerCase().includes(q) ||
 e.reference.toLowerCase().includes(q) ||
 e.context.toLowerCase().includes(q) ||
 e.user.toLowerCase().includes(q)
 );
 }, [activitySearch, selectedFacilityId]);

 return (
 <div className="space-y-6">
 
 {/* Top Header & Selectors Bar */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
 <div>
 <h2 className="text-base font-extrabold text-theme-main tracking-tight">
 Resumen Operativo
 </h2>
 <p className="text-xs text-theme-muted mt-0.5">
 Consulta la operación actual, cuellos de botella y pendientes de Mesa de Verificación.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2.5">
 {/* Period Selector */}
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
 </div> {/* Active Facility Display */}
 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-theme-muted/60 border border-theme-subtle text-xs font-bold text-theme-main">
 <Building2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span>{selectedFacility.name}</span>
 </div>

 {/* Refresh Button */}
 <button
 onClick={handleRefresh}
 className={`p-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-all cursor-pointer ${
 isRefreshing ? 'animate-spin' : ''
 }`}
 title="Actualizar datos operativos"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Demo Mode Notice */}
 <div className="flex items-center justify-between text-[11px] text-theme-muted pt-2 border-t border-theme-subtle font-mono">
 <span className="flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
 <span>Modo demo: la información operativa se actualiza dinámicamente según el flujo de piso.</span>
 </span>
 <span>Última sincronización: Hoy, 22:35</span>
 </div>
 </div>

 {/* 6 Clickable KPIs Cards */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
 {currentData.kpis.map((kpi) => {
 return (
 <div
 key={kpi.id}
 onClick={() => onNavigate(kpi.tabTarget)}
 className="group p-4 rounded-3xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/50 hover:shadow-md transition-all cursor-pointer space-y-1.5 shadow-xs relative overflow-hidden"
 >
 <div className="flex items-center justify-between">
 <span className="text-[9px] uppercase font-extrabold tracking-wider text-theme-muted group-hover:text-theme-primary transition-colors truncate">
 {kpi.label}
 </span>
 <ArrowRight className="w-3 h-3 text-theme-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-theme-primary" />
 </div>

 <div className="flex items-baseline justify-between">
 <strong className={`text-2xl font-mono font-black ${
 kpi.tone === 'danger'
 ? 'text-rose-600'
 : kpi.tone === 'attention'
 ? 'text-amber-600'
 : kpi.tone === 'success'
 ? 'text-emerald-600'
 : 'text-theme-main'
 }`}>
 {kpi.count}
 </strong>
 </div>

 <span className="text-[10px] text-theme-muted font-medium block truncate">
 {kpi.subtext}
 </span>
 </div>
 );
 })}
 </div>

 {/* Horizontal Pipeline Activity Flow Strip */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted">
 Flujo Operativo de Unidades ({period === 'today' ? 'Hoy' : period === 'yesterday' ? 'Ayer' : period})
 </span>
 <span className="text-[10px] text-theme-muted font-mono">
 Unidades físicas procesadas en {selectedFacility.name}
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center text-center">
 
 {/* Step 1 */}
 <div 
 onClick={() => onNavigate('inbound')}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer space-y-1"
 >
 <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
 <ArrowDownLeft className="w-3 h-3 text-theme-primary" />
 <span>{isSucursal ? 'Traspasos' : 'Entradas'}</span>
 </div>
 <strong className="text-xl font-mono font-black text-theme-main block">
 {currentData.flow.inbound}
 </strong>
 <span className="text-[9px] text-theme-muted">{isSucursal ? 'Unidades recibidas' : 'Bultos recibidos'}</span>
 </div>

 {/* Step 2 */}
 <div 
 onClick={() => onNavigate('putaway')}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer space-y-1"
 >
 <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
 <ArrowRightLeft className="w-3 h-3 text-blue-600" />
 <span>Acomodo</span>
 </div>
 <strong className="text-xl font-mono font-black text-theme-main block">
 {currentData.flow.putaway}
 </strong>
 <span className="text-[9px] text-theme-muted">{isSucursal ? 'Área de Muestras / QA' : 'En rack final'}</span>
 </div>

 {/* Step 3 */}
 <div 
 onClick={() => onNavigate(isSucursal ? 'putaway' : 'picking')}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer space-y-1"
 >
 <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
 <PackageSearch className="w-3 h-3 text-purple-600" />
 <span>{isSucursal ? 'En Inspección' : 'Recolección'}</span>
 </div>
 <strong className="text-xl font-mono font-black text-theme-main block">
 {isSucursal ? 6 : currentData.flow.picking}
 </strong>
 <span className="text-[9px] text-theme-muted">{isSucursal ? 'Muestras liberadas' : 'En staging salida'}</span>
 </div>

 {/* Step 4 */}
 <div 
 onClick={() => onNavigate(isSucursal ? 'putaway' : 'outbound')}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer space-y-1"
 >
 <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
 <ArrowUpRight className="w-3 h-3 text-emerald-600" />
 <span>{isSucursal ? 'Stock Tienda' : 'Salidas'}</span>
 </div>
 <strong className="text-xl font-mono font-black text-theme-main block">
 {isSucursal ? 28 : currentData.flow.outbound}
 </strong>
 <span className="text-[9px] text-theme-muted">{isSucursal ? 'Inventario local' : 'Unidades validadas'}</span>
 </div>

 {/* Step 5 */}
 <div 
 onClick={() => onNavigate('reprint')}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer space-y-1"
 >
 <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
 <QrCode className="w-3 h-3 text-amber-600" />
 <span>Trazabilidad</span>
 </div>
 <strong className="text-xl font-mono font-black text-theme-main block">
 100%
 </strong>
 <span className="text-[9px] text-theme-muted">UIDs verificados</span>
 </div>
 </div>
 </div>

 {/* Urgent Alerts Strip if available */}
 {currentData.urgentAlerts.length > 0 && (
 <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 space-y-2.5">
 <div className="flex items-center gap-2">
 <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
 <strong className="text-xs font-black text-rose-950 dark:text-rose-200 uppercase tracking-wider">
 Atención Inmediata ({currentData.urgentAlerts.length} Alertas Activas)
 </strong>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
 {currentData.urgentAlerts.map((alert) => (
 <div
 key={alert.id}
 onClick={() => onNavigate(alert.tabTarget)}
 className="p-2.5 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-rose-500 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs group"
 >
 <div className="flex items-center gap-2">
 <span className={`w-2 h-2 rounded-full shrink-0 ${
 alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
 }`} />
 <span className="text-theme-main font-semibold text-[11px] group-hover:text-theme-primary transition-colors">
 {alert.message}
 </span>
 </div>
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-primary shrink-0" />
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Grid: Pendientes de Atención & Infraestructura */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Left Column (2/3): Actionable Pending Items */}
 <div className="lg:col-span-2 space-y-4">
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Pendientes de Atención Operativa
 </h3>
 <p className="text-[11px] text-theme-muted">
 Órdenes e incidencias con acciones pendientes de ejecución en piso.
 </p>
 </div>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle font-mono">
 {currentData.pending.length} pendientes
 </span>
 </div>

 <div className="space-y-2.5">
 {currentData.pending.map((item) => (
 <div
 key={item.id}
 className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-subtle hover:bg-theme-muted/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
 >
 <div className="space-y-1 flex-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono font-black text-theme-primary">{item.folio}</span>
 <span className="text-theme-main font-bold">{item.type}</span>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
 item.priority === 'Crítica'
 ? 'bg-theme-surface text-rose-950 dark:text-rose-200 border-rose-500/35'
 : item.priority === 'Alta'
 ? 'bg-theme-surface text-amber-950 dark:text-amber-200 border-amber-500/35'
 : 'bg-theme-surface text-zinc-700 dark:text-zinc-300 border-zinc-500/20'
 }`}>
 {item.priority}
 </span>
 <span className="text-[10px] text-theme-muted font-mono">{item.age}</span>
 </div>
 <p className="text-[11px] text-theme-muted font-medium">{item.description}</p>
 </div>

 <button
 type="button"
 onClick={() => onNavigate(item.tabTarget)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-primary hover:text-white text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto sm:ml-0"
 >
 <span>{item.actionLabel}</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Aging Units in Process */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Unidades con Mayor Tiempo en Proceso
 </h3>
 <p className="text-[11px] text-theme-muted">
 Piezas serializadas con tiempos de ciclo por encima del umbral promedio.
 </p>
 </div>
 <Clock className="w-4 h-4 text-theme-muted" />
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[9px]">
 <th className="py-2">UID</th>
 <th className="py-2">Artículo</th>
 <th className="py-2">Etapa</th>
 <th className="py-2">Ubicación</th>
 <th className="py-2">Tiempo</th>
 <th className="py-2 text-right">Referencia</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-mono text-[11px]">
 {currentData.agingUnits.map((u) => (
 <tr key={u.uid} className="hover:bg-theme-muted/20">
 <td className="py-2.5 font-bold text-theme-primary">{u.uid}</td>
 <td className="py-2.5 font-sans font-medium text-theme-main truncate max-w-[150px]">{u.productName}</td>
 <td className="py-2.5">
 <span className="px-1.5 py-0.2 rounded text-[10px] bg-theme-muted text-theme-main border border-theme-subtle">
 {u.stage}
 </span>
 </td>
 <td className="py-2.5 text-theme-main">{u.location}</td>
 <td className="py-2.5 font-bold text-amber-600">{u.timeInProcess}</td>
 <td className="py-2.5 text-right font-bold text-theme-muted">{u.referenceOrder}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Right Column (1/3): Operational Bays & Lanes */}
 <div className="space-y-4">
 
 {isSucursal ? (
 <>
 {/* QA Bays Status */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <Boxes className="w-4 h-4 text-purple-600" />
 <span>Bahías de Inspección & Muestras</span>
 </h3>
 <span className="text-[10px] font-mono text-theme-muted">SHOW-01 a 06</span>
 </div>

 <div className="space-y-2">
 {[
 { code: 'SHOW-01', status: 'En exhibición', model: 'Manual Instructivo 24 Páginas Black & Decker', uid: 'TAR-RTM-2026-000155' },
 { code: 'SHOW-02', status: 'Disponible', model: 'Espacio libre para Tarimas PT', uid: null },
 { code: 'SHOW-03', status: 'En exhibición', model: 'Etiqueta Farmacéutica 4x6" Medifarma', uid: 'BOB-RTM-2026-000110' },
 { code: 'SHOW-04', status: 'En exhibición', model: 'Blister Card Termosellable Stanley Tools', uid: 'TAR-RTM-2026-000151' },
 { code: 'SHOW-05', status: 'En exhibición', model: 'Folleto Plegable Médico Medifarma', uid: 'TAR-RTM-2026-000196' },
 { code: 'SHOW-06', status: 'En exhibición', model: 'Etiqueta Código de Barras Schneider', uid: 'BOB-RTM-2026-000121' },
 ].map((bay) => (
 <div
 key={bay.code}
 onClick={() => onNavigate('putaway')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-purple-500/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
 >
 <div className="min-w-0 pr-2">
 <div className="flex items-center gap-2">
 <strong className="font-mono text-theme-main">{bay.code}</strong>
 <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
 bay.status === 'Disponible'
 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
 : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
 }`}>
 {bay.status}
 </span>
 </div>
 <span className="text-[10px] text-theme-muted block truncate mt-0.5">{bay.model}</span>
 </div>

 {bay.uid ? (
 <span className="text-[10px] font-mono font-bold text-theme-primary shrink-0">
 {bay.uid}
 </span>
 ) : (
 <span className="text-[10px] text-theme-muted font-bold shrink-0">Libre</span>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Branch Zones Status */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <ArrowDownLeft className="w-4 h-4 text-theme-primary" />
 <span>Zonas de Descarga & Reserva</span>
 </h3>
 <span className="text-[10px] font-mono text-theme-muted">{selectedFacility.code}</span>
 </div>

 <div className="space-y-2">
 <div 
 onClick={() => onNavigate('putaway')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
 >
 <div>
 <strong className="text-theme-main block">{selectedFacility.tempReceivingLocation}</strong>
 <span className="text-[10px] text-theme-muted font-sans">Descarga de traspasos</span>
 </div>
 <div className="text-right">
 <span className="text-xs font-black text-theme-primary block">3 u.</span>
 <span className="text-[9px] text-amber-600 font-bold font-sans">Por acomodar</span>
 </div>
 </div>

 <div 
 onClick={() => onNavigate('putaway')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
 >
 <div>
 <strong className="text-theme-main block">MINI-ALM-01</strong>
 <span className="text-[10px] text-theme-muted font-sans">Entrega cliente / Flete</span>
 </div>
 <div className="text-right">
 <span className="text-xs font-black text-theme-main block">14 u.</span>
 <span className="text-[9px] text-emerald-600 font-bold font-sans">Disponible</span>
 </div>
 </div>

 <div 
 onClick={() => onNavigate('putaway')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
 >
 <div>
 <strong className="text-theme-main block">MINI-ALM-02</strong>
 <span className="text-[10px] text-theme-muted font-sans">Reserva posterior</span>
 </div>
 <div className="text-right">
 <span className="text-xs font-black text-theme-main block">8 u.</span>
 <span className="text-[9px] text-emerald-600 font-bold font-sans">Disponible</span>
 </div>
 </div>
 </div>
 </div>
 </>
 ) : (
 <>
 {/* Staging Lanes Status (CEDIS) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <Boxes className="w-4 h-4 text-theme-primary" />
 <span>Carriles de Embarque</span>
 </h3>
 <span className="text-[10px] font-mono text-theme-muted">EMB-01 a 05</span>
 </div>

 <div className="space-y-2">
 {stagingLanes.map((lane) => (
 <div
 key={lane.code}
 onClick={() => onNavigate('outbound')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-theme-primary/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
 >
 <div className="flex items-center gap-2">
 <strong className="text-theme-main">{lane.code}</strong>
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 lane.status === 'Disponible'
 ? 'border-emerald-600 '
 : lane.status === 'Ocupado'
 ? 'border-rose-500'
 : 'border-amber-500'
 }`}>
 {lane.status}
 </span>
 </div>

 {lane.unitsCount ? (
 <span className="text-[11px] font-bold text-rose-600">
 {lane.unitsCount} u. ({lane.orderRef})
 </span>
 ) : (
 <span className="text-[10px] text-theme-muted">Libre</span>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Inbound Bays Status (CEDIS) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <ArrowDownLeft className="w-4 h-4 text-blue-600" />
 <span>Áreas de Recepción</span>
 </h3>
 <span className="text-[10px] font-mono text-theme-muted">{selectedFacility.code}</span>
 </div>

 <div className="space-y-2">
 {inboundBays.map((bay) => (
 <div
 key={bay.code}
 onClick={() => onNavigate('putaway')}
 className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle hover:border-blue-500/40 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
 >
 <div>
 <strong className="text-theme-main block">{bay.code}</strong>
 <span className="text-[10px] text-theme-muted">{bay.orderRef}</span>
 </div>

 <div className="text-right">
 <span className="text-xs font-black text-blue-600 block">{bay.unitsCount} u.</span>
 <span className="text-[9px] text-amber-600 font-bold">
 {bay.pendingPutawayCount} por acomodar
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </>
 )}

 {/* Incidents Breakdown Mini-Card */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 <span>Incidencias por Origen</span>
 </h3>
 <button
 onClick={() => onNavigate('incidents')}
 className="text-[10px] font-bold text-theme-primary hover:underline cursor-pointer"
 >
 Ver todas
 </button>
 </div>

 <div className="grid grid-cols-2 gap-2 text-xs font-mono">
 <div className="p-2 rounded-xl bg-theme-muted/30 border border-theme-subtle flex justify-between">
 <span className="text-theme-muted">Entrada:</span>
 <strong className="text-theme-main">2</strong>
 </div>
 <div className="p-2 rounded-xl bg-theme-muted/30 border border-theme-subtle flex justify-between">
 <span className="text-theme-muted">Acomodo:</span>
 <strong className="text-theme-main">1</strong>
 </div>
 <div className="p-2 rounded-xl bg-theme-muted/30 border border-theme-subtle flex justify-between">
 <span className="text-theme-muted">Recolección:</span>
 <strong className="text-theme-main">2</strong>
 </div>
 <div className="p-2 rounded-xl bg-theme-muted/30 border border-theme-subtle flex justify-between">
 <span className="text-theme-muted">Salida:</span>
 <strong className="text-theme-main">1</strong>
 </div>
 </div>
 </div>

 </div>
 </div>

 {/* Recent Activity Audit Timeline */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Actividad Reciente en Mesa de Verificación
 </h3>
 <p className="text-[11px] text-theme-muted">
 Bitácora cronológica de eventos operativos ejecutados en el sistema.
 </p>
 </div>

 {/* Activity Search Box */}
 <div className="relative w-full sm:w-72">
 <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={activitySearch}
 onChange={(e) => setActivitySearch(e.target.value)}
 placeholder="Buscar actividad, folio, UID o usuario..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl pl-8 pr-3 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-1 focus:ring-theme-primary"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[10px]">
 <th className="py-2.5 px-3">Hora</th>
 <th className="py-2.5 px-3">Actividad</th>
 <th className="py-2.5 px-3">Referencia</th>
 <th className="py-2.5 px-3">Contexto Operativo</th>
 <th className="py-2.5 px-3 text-right">Usuario</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredEvents.map((evt) => (
 <tr key={evt.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {evt.time}
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <span className="font-bold text-theme-main">{evt.activity}</span>
 </td>
 <td className="py-2.5 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {evt.reference}
 </td>
 <td className="py-2.5 px-3 text-theme-muted font-medium">
 {evt.context}
 </td>
 <td className="py-2.5 px-3 text-right font-semibold text-theme-main whitespace-nowrap">
 {evt.user}
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
