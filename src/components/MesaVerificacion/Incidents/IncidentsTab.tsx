import React, { useState, useMemo, useEffect } from 'react';
import { 
 AlertTriangle, 
 Plus, 
 Search, 
 Eye, 
 Filter, 
 X, 
 Clock, 
 CheckCircle2, 
 AlertOctagon, 
 Layers, 
 MapPin, 
 QrCode, 
 Building2, 
 Calendar, 
 Sparkles 
} from 'lucide-react';
import { 
 OperationalIncident, 
 INITIAL_OPERATIONAL_INCIDENTS, 
 IncidentStatus, 
 IncidentPriority, 
 IncidentSource, 
 IncidentType 
} from '../../../data/mockIncidentsData';
import { NewIncidentModal } from './NewIncidentModal';
import { IncidentDetailModal } from './IncidentDetailModal';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';
import { StatusBadge } from '../../common/StatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';

interface IncidentsTabProps {
 onNavigateToReprint?: (uid?: string, incidentRef?: string) => void;
}

export const IncidentsTab: React.FC<IncidentsTabProps> = ({
 onNavigateToReprint,
}) => {
 const { selectedCedisId, selectedCedis } = useVerificationDeskCedis();
 const [incidents, setIncidents] = useState<OperationalIncident[]>(INITIAL_OPERATIONAL_INCIDENTS);
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState<string>('ALL');
 const [typeFilter, setTypeFilter] = useState<string>('ALL');
 const [sourceFilter, setSourceFilter] = useState<string>('ALL');
 const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
 const [showClosed, setShowClosed] = useState<boolean>(true);

 // Modals state
 const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
 const [selectedIncident, setSelectedIncident] = useState<OperationalIncident | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Scoped to global CEDIS
 const visibleIncidents = incidents.filter((i) => i.warehouseId === selectedCedisId);

 // Auto close modal if CEDIS changed
 useEffect(() => {
 if (selectedIncident && selectedIncident.warehouseId !== selectedCedisId) {
 setSelectedIncident(null);
 }
 }, [selectedCedisId, selectedIncident]);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 4000);
 };

 // KPIs scoped to selected CEDIS
 const openCount = visibleIncidents.filter((i) => i.status === 'Abierta').length;
 const inProgressCount = visibleIncidents.filter((i) => i.status === 'En atención').length;
 const readyToCloseCount = visibleIncidents.filter((i) => i.status === 'Lista para cierre').length;
 const criticalCount = visibleIncidents.filter((i) => i.priority === 'Crítica' && i.status !== 'Cerrada').length;

 // Source breakdown counts
 const sourceBreakdown = useMemo(() => {
 const counts: Record<string, number> = {
 'Entrada': 0,
 'Acomodo': 0,
 'Recolección': 0,
 'Verificación de Salida': 0,
 'Conteo': 0,
 'Inventario': 0,
 'Reporte manual': 0,
 };
 visibleIncidents.forEach((i) => {
 if (counts[i.sourceModule] !== undefined) {
 counts[i.sourceModule]++;
 }
 });
 return counts;
 }, [visibleIncidents]);

 // Filtered incidents list
 const filteredIncidents = useMemo(() => {
 return visibleIncidents.filter((i) => {
 if (!showClosed && i.status === 'Cerrada') return false;

 const q = searchQuery.toLowerCase().trim();
 const matchesSearch =
 !q ||
 i.code.toLowerCase().includes(q) ||
 i.title.toLowerCase().includes(q) ||
 i.incidentType.toLowerCase().includes(q) ||
 (i.uid && i.uid.toLowerCase().includes(q)) ||
 (i.sku && i.sku.toLowerCase().includes(q)) ||
 (i.productName && i.productName.toLowerCase().includes(q)) ||
 (i.locationCode && i.locationCode.toLowerCase().includes(q)) ||
 (i.sourceReference && i.sourceReference.toLowerCase().includes(q));

 const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
 const matchesType = typeFilter === 'ALL' || i.incidentType === typeFilter;
 const matchesSource = sourceFilter === 'ALL' || i.sourceModule === sourceFilter;
 const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;

 return (
 matchesSearch &&
 matchesStatus &&
 matchesType &&
 matchesSource &&
 matchesPriority
 );
 });
 }, [
 visibleIncidents,
 searchQuery,
 statusFilter,
 typeFilter,
 sourceFilter,
 priorityFilter,
 showClosed,
 ]);

 const handleCreateIncident = (newInc: OperationalIncident) => {
 setIncidents((prev) => [newInc, ...prev]);
 setIsNewIncidentOpen(false);
 setSelectedIncident(newInc);
 showToast(`✓ Incidencia ${newInc.code} registrada con éxito.`);
 };

 const handleUpdateIncident = (updated: OperationalIncident) => {
 setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
 setSelectedIncident(updated);
 };

 return (
 <div className="space-y-6">
 
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Header & Quick Action Button */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs">
 <div>
 <h2 className="text-base font-extrabold text-theme-main">
 Incidencias Operativas
 </h2>
 <p className="text-xs text-theme-muted mt-0.5">
 Documenta, atiende y da seguimiento a excepciones operativas del almacén.
 </p>
 </div>

 <button
 onClick={() => setIsNewIncidentOpen(true)}
 className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva incidencia</span>
 </button>
 </div>

 {/* 4 KPIs Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
 Abiertas
 </span>
 <div className="flex items-baseline justify-between">
 <strong className="text-2xl font-mono font-black text-amber-600">{openCount}</strong>
 <span className="text-[10px] text-theme-muted">Pendientes</span>
 </div>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block">
 En Atención
 </span>
 <div className="flex items-baseline justify-between">
 <strong className="text-2xl font-mono font-black text-blue-600">{inProgressCount}</strong>
 <span className="text-[10px] text-theme-muted">En investigación</span>
 </div>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block">
 Listas para Cierre
 </span>
 <div className="flex items-baseline justify-between">
 <strong className="text-2xl font-mono font-black text-purple-600">{readyToCloseCount}</strong>
 <span className="text-[10px] text-theme-muted">Por dictaminar</span>
 </div>
 </div>

 <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-xs space-y-1 text-rose-950 dark:text-rose-200">
 <span className="text-[10px] uppercase font-bold text-rose-600 block">
 Críticas
 </span>
 <div className="flex items-baseline justify-between">
 <strong className="text-2xl font-mono font-black text-rose-600">{criticalCount}</strong>
 <span className="text-[10px] text-rose-700">Alta severidad</span>
 </div>
 </div>
 </div>

 {/* Source Breakdown Strip */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between flex-wrap gap-2 text-xs">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted">
 Incidencias por Origen:
 </span>
 <div className="flex items-center gap-3 flex-wrap font-mono text-[11px]">
 {Object.entries(sourceBreakdown).map(([src, count]) => (
 <span key={src} className="flex items-center gap-1 text-theme-muted">
 <strong className="text-theme-main font-bold">{src}:</strong>
 <span className="text-rose-600 font-bold">{count}</span>
 </span>
 ))}
 </div>
 </div>

 {/* Filters and Search */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center gap-3">
 
 {/* Search Box */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar folio, UID, artículo, ubicación u orden..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 {/* Quick Selectors */}
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Abierta">Abierta</option>
 <option value="En atención">En atención</option>
 <option value="Lista para cierre">Lista para cierre</option>
 <option value="Cerrada">Cerrada</option>
 </select>

 <select
 value={sourceFilter}
 onChange={(e) => setSourceFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los orígenes</option>
 <option value="Entrada">Entrada</option>
 <option value="Acomodo">Acomodo</option>
 <option value="Recolección">Recolección</option>
 <option value="Verificación de Salida">Verificación de Salida</option>
 <option value="Conteo">Conteo</option>
 <option value="Inventario">Inventario</option>
 <option value="Reporte manual">Reporte manual</option>
 </select>

 <select
 value={priorityFilter}
 onChange={(e) => setPriorityFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las prioridades</option>
 <option value="Crítica">Crítica</option>
 <option value="Alta">Alta</option>
 <option value="Media">Media</option>
 <option value="Baja">Baja</option>
 </select>

 <label className="flex items-center gap-1.5 px-3 py-2 text-xs text-theme-main font-semibold cursor-pointer select-none">
 <input
 type="checkbox"
 checked={showClosed}
 onChange={(e) => setShowClosed(e.target.checked)}
 className="rounded border-theme-subtle text-rose-600 focus:ring-rose-500"
 />
 <span>Mostrar cerradas</span>
 </label>
 </div>
 </div>
 </div>

 {/* Main Incidents Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Incidencia</th>
 <th className="py-3 px-3">UID / Artículo</th>
 <th className="py-3 px-3">Ubicación</th>
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Prioridad</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredIncidents.length === 0 ? (
 <tr>
 <td colSpan={9} className="py-8 text-center text-theme-muted">
 No se encontraron incidencias con los filtros seleccionados.
 </td>
 </tr>
 ) : (
 filteredIncidents.map((incident) => {
 return (
 <tr key={incident.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {incident.code}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <strong className="text-theme-main block">{incident.incidentType}</strong>
 <span className="text-[10px] text-theme-muted truncate block max-w-[200px]">
 {incident.title}
 </span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 {incident.uid ? (
 <>
 <span className="font-mono font-bold text-rose-600 block text-xs">{incident.uid}</span>
 <span className="text-[10px] text-theme-muted truncate block max-w-[180px]">
 {incident.productName || incident.sku}
 </span>
 </>
 ) : (
 <span className="text-theme-muted italic">N/A</span>
 )}
 </td>
 <td className="py-3.5 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
 {incident.locationCode ? (
 <span className="px-2 py-0.5 rounded text-[10px] bg-theme-muted text-theme-main border border-theme-subtle">
 {incident.locationCode}
 </span>
 ) : (
 <span className="text-theme-muted italic text-[11px]">Sin ubicación</span>
 )}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-theme-muted text-theme-main border border-theme-subtle">
 {incident.sourceModule}
 </span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <PriorityBadge priority={incident.priority} size="sm" />
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 incident.status === 'Cerrada'
 ? 'success'
 : incident.status === 'Lista para cierre'
 ? 'smart'
 : incident.status === 'En atención'
 ? 'info'
 : 'warning'
 }
 label={incident.status}
 size="sm"
 />
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {incident.createdAt}
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setSelectedIncident(incident)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5 text-theme-primary" />
 <span>Detalle</span>
 </button>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Modal: New Incident */}
 {isNewIncidentOpen && (
 <NewIncidentModal
 onClose={() => setIsNewIncidentOpen(false)}
 onCreated={handleCreateIncident}
 />
 )}

 {/* Modal: Incident Detail */}
 {selectedIncident && (
 <IncidentDetailModal
 incident={selectedIncident}
 onClose={() => setSelectedIncident(null)}
 onUpdateIncident={handleUpdateIncident}
 onNavigateToReprint={onNavigateToReprint}
 onShowToast={showToast}
 />
 )}
 </div>
 );
};
