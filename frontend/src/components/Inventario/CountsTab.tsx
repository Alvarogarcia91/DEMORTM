import React, { useState, useMemo } from 'react';
import { 
 ClipboardCheck, 
 Layers, 
 CheckCircle2, 
 AlertTriangle, 
 Clock, 
 RotateCcw, 
 Plus, 
 Search, 
 Building2, 
 Store, 
 Eye, 
 Play, 
 Sparkles, 
 Flame, 
 ShieldAlert, 
 Radio, 
 EyeOff, 
 ChevronRight,
 Boxes,
 QrCode,
 FileSpreadsheet
} from 'lucide-react';
import { 
 MOCK_COUNT_PLANS, 
 MOCK_COUNT_TASKS, 
 MOCK_COUNT_DIFFERENCES, 
 MOCK_SUGGESTED_COUNTS,
 CountPlanRecord, 
 CountTaskRecord, 
 CountDifferenceRecord,
 SuggestedCyclicCount
} from '../../data/mockCountsData';
import { MOCK_WAREHOUSES_LIST } from '../../data/mockInventoryData';
import { ExecuteCountModal } from './Counts/ExecuteCountModal';
import { CreateCountPlanModal } from './Counts/CreateCountPlanModal';
import { DifferenceDetailModal } from './Counts/DifferenceDetailModal';
import { StatusBadge } from '../common/StatusBadge';

interface CountsTabProps {
 onShowToast?: (msg: string) => void;
}

export const CountsTab: React.FC<CountsTabProps> = ({ onShowToast }) => {
 // Subtabs: 'panel' | 'plans' | 'tasks' | 'differences' (Default: 'panel')
 const [subTab, setSubTab] = useState<'panel' | 'plans' | 'tasks' | 'differences'>('panel');
 const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-mty-norte');

 // Active state data
 const [plans, setPlans] = useState<CountPlanRecord[]>(MOCK_COUNT_PLANS);
 const [tasks, setTasks] = useState<CountTaskRecord[]>(MOCK_COUNT_TASKS);
 const [differences, setDifferences] = useState<CountDifferenceRecord[]>(MOCK_COUNT_DIFFERENCES);
 const [suggestedCounts, setSuggestedCounts] = useState<SuggestedCyclicCount[]>(MOCK_SUGGESTED_COUNTS);

 // Modals state
 const [isCreatePlanOpen, setIsCreatePlanOpen] = useState<boolean>(false);
 const [activeTaskToExecute, setActiveTaskToExecute] = useState<CountTaskRecord | null>(null);
 const [selectedDifferenceDetail, setSelectedDifferenceDetail] = useState<CountDifferenceRecord | null>(null);

 // Filter terms
 const [taskSearch, setTaskSearch] = useState<string>('');
 const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');

 // Handle count completion from ExecuteCountModal
 const handleCompleteCount = (
 updatedTask: CountTaskRecord, 
 generatedDifferences: CountDifferenceRecord[]
 ) => {
 setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

 if (generatedDifferences.length > 0) {
 setDifferences(prev => [...generatedDifferences, ...prev]);
 if (onShowToast) {
 onShowToast(`Conteo ${updatedTask.folio} finalizado con ${generatedDifferences.length} discrepancias registradas.`);
 }
 } else {
 if (onShowToast) {
 onShowToast(`✓ Conteo ${updatedTask.folio} completado con 100% de precisión.`);
 }
 }
 };

 // Handle plan creation
 const handlePlanCreated = (newPlan: CountPlanRecord, newTasks: CountTaskRecord[]) => {
 setPlans(prev => [newPlan, ...prev]);
 setTasks(prev => [...newTasks, ...prev]);
 if (onShowToast) {
 onShowToast(`Plan de conteo ${newPlan.folio} generado con ${newTasks.length} tareas asignadas.`);
 }
 setSubTab('tasks');
 };

 // Handle creating task from suggestion
 const handleGenerateTaskFromSuggestion = (sug: SuggestedCyclicCount) => {
 const nextTaskNum = 60 + Math.floor(Math.random() * 20);
 const newTask: CountTaskRecord = {
 id: `task-sug-${Date.now()}`,
 folio: `CC-2026-00${nextTaskNum}`,
 planFolio: 'PLC-2026-0018',
 warehouseId: sug.warehouseId,
 warehouseName: sug.warehouseName,
 locationCode: sug.locationCode,
 locationName: sug.locationName,
 zoneType: 'RACK',
 expectedUnitsCount: 3,
 expectedSerials: ['SC-UID-2026-000171', 'SC-UID-2026-000172', 'SC-UID-2026-000173'],
 countedUnitsCount: 0,
 countedSerials: [],
 isBlindCount: true,
 status: 'Pendiente',
 assignedTo: 'Operador RF Demo (Roberto Garza)',
 hasDifference: false,
 };

 setTasks(prev => [newTask, ...prev]);
 setSuggestedCounts(prev => prev.filter(s => s.id !== sug.id));

 if (onShowToast) {
 onShowToast(`Tarea ${newTask.folio} generada para ${sug.locationCode} (${sug.warehouseName})`);
 }
 setSubTab('tasks');
 };

 // Handle requesting recount
 const handleRequestRecount = (diff: CountDifferenceRecord) => {
 const recountFolio = `RC-2026-00${12 + Math.floor(Math.random() * 20)}`;
 
 // Update difference status
 setDifferences(prev => prev.map(d => d.id === diff.id ? {
 ...d,
 status: 'En recuento',
 recountTaskFolio: recountFolio,
 } : d));

 // Add recount task to Tasks
 const recountTask: CountTaskRecord = {
 id: `task-recount-${Date.now()}`,
 folio: recountFolio,
 planFolio: diff.taskFolio,
 warehouseId: diff.warehouseId,
 warehouseName: diff.warehouseName,
 locationCode: diff.locationCode,
 locationName: diff.locationName,
 zoneType: 'RACK',
 expectedUnitsCount: diff.expectedCount,
 expectedSerials: [diff.uid],
 countedUnitsCount: 0,
 countedSerials: [],
 isBlindCount: true,
 status: 'Pendiente',
 assignedTo: 'Auditor de Almacén (Recuento Supervisor)',
 hasDifference: false,
 notes: `Recuento solicitado por diferencia en ${diff.taskFolio} (${diff.differenceType}).`,
 };

 setTasks(prev => [recountTask, ...prev]);
 setSelectedDifferenceDetail(null);

 if (onShowToast) {
 onShowToast(`Recuento ${recountFolio} generado para ubicación ${diff.locationCode}`);
 }
 };

 // Handle marking difference for investigation
 const handleMarkInvestigation = (diff: CountDifferenceRecord) => {
 setDifferences(prev => prev.map(d => d.id === diff.id ? { ...d, status: 'Investigación' } : d));
 setSelectedDifferenceDetail(null);
 if (onShowToast) {
 onShowToast(`Discrepancia ${diff.folio} marcada para investigación interna.`);
 }
 };

 const filteredTasks = useMemo(() => {
 return tasks.filter(t => {
 const matchSearch =
 t.folio.toLowerCase().includes(taskSearch.toLowerCase()) ||
 t.locationCode.toLowerCase().includes(taskSearch.toLowerCase()) ||
 t.assignedTo.toLowerCase().includes(taskSearch.toLowerCase());

 const matchStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter;
 return matchSearch && matchStatus;
 });
 }, [tasks, taskSearch, taskStatusFilter]);

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full pb-12">
 
 {/* ========================================================================= */}
 {/* SUBTABS HEADER BAR */}
 {/* ========================================================================= */}
 <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-theme-subtle">
 <div className="flex items-center gap-1.5 flex-wrap">
 {[
 { id: 'panel', label: '1. Panel', icon: ClipboardCheck },
 { id: 'plans', label: '2. Planes de conteo', icon: Layers },
 { id: 'tasks', label: '3. Tareas', icon: Radio },
 { id: 'differences', label: '4. Diferencias', icon: AlertTriangle },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = subTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => setSubTab(tab.id as any)}
 className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 isActive
 ? 'bg-rose-600 text-white shadow-md'
 : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
 }`}
 >
 <Icon className="w-4 h-4" />
 <span>{tab.label}</span>
 {tab.id === 'differences' && differences.length > 0 && (
 <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-mono">
 {differences.length}
 </span>
 )}
 </button>
 );
 })}
 </div>

 {/* Global Action: New Count Plan */}
 <button
 onClick={() => setIsCreatePlanOpen(true)}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
 >
 <Plus className="w-4 h-4" />
 <span>Nuevo plan de conteo</span>
 </button>
 </div>

 {/* ========================================================================= */}
 {/* SUBTAB 1: PANEL DE CONTEOS FÍSICOS */}
 {/* ========================================================================= */}
 {subTab === 'panel' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* Node Selector Banner */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-0.5">
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Auditoría Física y Trazabilidad &middot; Impresos RTM
 </span>
 <h3 className="text-base font-black text-theme-main">
 Control de Conteos Cíclicos & Precisión de Inventario
 </h3>
 </div>

 <div className="flex items-center gap-1.5 flex-wrap">
 {MOCK_WAREHOUSES_LIST.map((wh) => (
 <button
 key={wh.id}
 onClick={() => setSelectedWarehouseId(wh.id)}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
 selectedWarehouseId === wh.id
 ? 'bg-rose-600 text-white shadow-xs'
 : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
 }`}
 >
 <span>{wh.name.replace('CEDIS ', '').replace('Sucursal ', '')}</span>
 </button>
 ))}
 </div>
 </div>

 {/* 5 KPIs Principales */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
 
 {/* Precisión de Inventario */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Precisión de Inventario</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block">
 98.7%
 </strong>
 <span className="text-[10px] text-theme-muted">Exactitud registro vs físico</span>
 </div>

 {/* Conteos Pendientes */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Conteos Pendientes</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-amber-600 block">
 {tasks.filter(t => t.status === 'Pendiente' || t.status === 'En proceso').length}
 </strong>
 <span className="text-[10px] text-theme-muted">Tareas asignadas en cola</span>
 </div>

 {/* Diferencias Abiertas */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Diferencias Abiertas</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-rose-600 block">
 {differences.filter(d => d.status !== 'Aclarada').length}
 </strong>
 <span className="text-[10px] text-theme-muted">Requieren investigación</span>
 </div>

 {/* Conteos Completados Hoy */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Completados Hoy</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block">
 14
 </strong>
 <span className="text-[10px] text-emerald-600 font-bold">✓ 42 UIDs verificadas</span>
 </div>

 {/* Cobertura 30 Días */}
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Cobertura 30 Días</span>
 <strong className="text-xl sm:text-2xl font-mono font-black text-purple-600 block">
 87%
 </strong>
 <span className="text-[10px] text-theme-muted">Ubicaciones auditadas</span>
 </div>
 </div>

 {/* Atención Requerida (Recomendaciones de Conteo) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-rose-600">
 <ShieldAlert className="w-5 h-5" />
 <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-theme-main">
 Atención Requerida &bull; Alertas de Auditoría
 </h3>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 
 {/* Card 1: Pasillo A */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <strong className="font-mono text-xs font-black text-theme-primary">Pasillo A</strong>
 <StatusBadge variant="danger" label="3 diferencias" size="sm" />
 </div>
 <p className="text-[11px] text-theme-muted">
 Se detectaron discrepancias en nivel piso y último conteo ejecutado hace 18 días.
 </p>
 </div>
 <button
 onClick={() => setSubTab('differences')}
 className="w-full py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle cursor-pointer"
 >
 Revisar diferencias
 </button>
 </div>

 {/* Card 2: RET-NORTE */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <strong className="font-mono text-xs font-black text-rose-600">RET-NORTE</strong>
 <StatusBadge variant="warning" label="Alta actividad" size="sm" />
 </div>
 <p className="text-[11px] text-theme-muted">
 7 unidades resguardadas por empaque dañado e incidencias de rampa.
 </p>
 </div>
 <button
 onClick={() => {
 setIsCreatePlanOpen(true);
 }}
 className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
 >
 Generar conteo
 </button>
 </div>

 {/* Card 3: EMB-02 */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 flex flex-col justify-between shadow-2xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <strong className="font-mono text-xs font-black text-blue-600">EMB-02</strong>
 <StatusBadge variant="info" label="22 movimientos" size="sm" />
 </div>
 <p className="text-[11px] text-theme-muted">
 Carril de despacho de alta rotación con 14 días sin auditoría física.
 </p>
 </div>
 <button
 onClick={() => {
 setIsCreatePlanOpen(true);
 }}
 className="w-full py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle cursor-pointer"
 >
 Generar conteo
 </button>
 </div>
 </div>
 </div>

 {/* Conteos Cíclicos Sugeridos */}
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
 Conteos Cíclicos Sugeridos por Rotación
 </h3>
 </div>
 <span className="text-[10px] font-mono text-theme-muted">Algoritmo de Priorización Operativa</span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {suggestedCounts.map((sug) => (
 <div
 key={sug.id}
 className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2.5 flex flex-col justify-between"
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-theme-primary">{sug.locationCode}</span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/15 text-rose-700 flex items-center gap-1">
 <Flame className="w-3 h-3 text-rose-600" />
 <span>Alta actividad</span>
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{sug.locationName}</h4>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 <strong>Motivo:</strong> {sug.triggerReason} &middot; <span className="font-mono font-bold text-theme-main">{sug.recentMovementsCount} movs &middot; {sug.daysSinceLastCount} días</span>
 </p>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex justify-end">
 <button
 type="button"
 onClick={() => handleGenerateTaskFromSuggestion(sug)}
 className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Generar tarea de conteo</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* SUBTAB 2: PLANES DE CONTEO */}
 {/* ========================================================================= */}
 {subTab === 'plans' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Almacén / CEDIS</th>
 <th className="py-3 px-3">Tipo</th>
 <th className="py-3 px-4">Alcance</th>
 <th className="py-3 px-3">Método</th>
 <th className="py-3 px-3 text-center">Conteo Ciego</th>
 <th className="py-3 px-3 text-center">Progreso</th>
 <th className="py-3 px-3">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {plans.map((p) => (
 <tr key={p.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {p.folio}
 </td>
 <td className="py-3 px-3 font-semibold text-theme-main whitespace-nowrap">
 {p.warehouseName}
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {p.type}
 </span>
 </td>
 <td className="py-3 px-4 text-theme-main font-medium">
 {p.scope}
 </td>
 <td className="py-3 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {p.method === 'QR_UID' ? 'QR / UID' : 'Manual'}
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 {p.isBlindCount ? (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 Activado
 </span>
 ) : (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-zinc-400 shadow-2xs">
 Visible
 </span>
 )}
 </td>
 <td className="py-3 px-3 font-mono font-bold text-center text-theme-main whitespace-nowrap">
 {p.completedLocations} / {p.totalLocations} pos
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={p.status === 'Completado' ? 'success' : 'danger'}
 label={p.status}
 size="sm"
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* SUBTAB 3: TAREAS OPERATIVAS (EJECUTAR CONTEO CON SCANNER LUGA) */}
 {/* ========================================================================= */}
 {subTab === 'tasks' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 
 {/* Toolbar */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-surface p-4 rounded-2xl border border-theme-subtle">
 <div className="relative w-full sm:w-80">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={taskSearch}
 onChange={(e) => setTaskSearch(e.target.value)}
 placeholder="Buscar por folio, ubicación, operador..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>

 <div className="flex items-center gap-2 w-full sm:w-auto">
 <select
 value={taskStatusFilter}
 onChange={(e) => setTaskStatusFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-bold text-theme-main py-1.5 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los estados</option>
 <option value="Pendiente">Pendiente</option>
 <option value="Por revisar">Por revisar</option>
 <option value="Cerrado">Cerrado</option>
 </select>
 </div>
 </div>

 {/* Tasks Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Almacén / CEDIS</th>
 <th className="py-3 px-3">Ubicación</th>
 <th className="py-3 px-3">Espacio Físico</th>
 <th className="py-3 px-3 text-center">Progreso Físico</th>
 <th className="py-3 px-3">Asignado a</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredTasks.map((t) => (
 <tr key={t.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {t.folio}
 </td>
 <td className="py-3 px-3 font-semibold text-theme-main whitespace-nowrap">
 {t.warehouseName}
 </td>
 <td className="py-3 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
 {t.locationCode}
 </td>
 <td className="py-3 px-3 text-theme-main text-[11px]">
 {t.locationName}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {t.countedUnitsCount > 0 ? (
 <span className={t.hasDifference ? 'text-rose-600' : 'text-emerald-600'}>
 {t.countedUnitsCount} u. {t.hasDifference ? '(!)' : '(✓)'}
 </span>
 ) : (
 <span className="text-theme-muted">0 / ?</span>
 )}
 </td>
 <td className="py-3 px-3 text-theme-muted text-[11px] whitespace-nowrap">
 {t.assignedTo}
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 t.status === 'Cerrado'
 ? 'success'
 : t.status === 'Por revisar'
 ? 'warning'
 : 'danger'
 }
 label={t.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-4 text-right whitespace-nowrap">
 {t.status === 'Pendiente' ? (
 <button
 onClick={() => setActiveTaskToExecute(t)}
 className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Play className="w-3.5 h-3.5" />
 <span>Ejecutar</span>
 </button>
 ) : (
 <button
 onClick={() => setActiveTaskToExecute(t)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold text-xs border border-theme-subtle transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5 text-theme-muted" />
 <span>Revisar</span>
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* SUBTAB 4: DIFERENCIAS Y DISCREPANCIAS */}
 {/* ========================================================================= */}
 {subTab === 'differences' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 
 <div className="p-4 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
 <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
 <AlertTriangle className="w-5 h-5 shrink-0" />
 <div>
 <strong>Bitácora de Discrepancias Físicas:</strong> Se muestran las diferencias detectadas entre el registro de seriales en sistema y las lecturas ópticas en piso.
 </div>
 </div>
 </div>

 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Tarea Origen</th>
 <th className="py-3 px-3">Ubicación</th>
 <th className="py-3 px-4">Artículo / UID</th>
 <th className="py-3 px-3">Tipo Discrepancia</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {differences.map((diff) => (
 <tr key={diff.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {diff.folio}
 </td>
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {diff.taskFolio}
 </td>
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {diff.locationCode}
 </td>
 <td className="py-3 px-4">
 <span className="font-mono font-bold text-theme-main block">{diff.uid}</span>
 <span className="text-[11px] text-theme-muted line-clamp-1">{diff.productName}</span>
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20">
 {diff.differenceType}
 </span>
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 diff.status === 'Aclarada'
 ? 'success'
 : diff.status === 'En recuento'
 ? 'smart'
 : 'warning'
 }
 label={diff.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setSelectedDifferenceDetail(diff)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-xs font-semibold text-theme-main transition-colors border border-theme-subtle cursor-pointer flex items-center gap-1 ml-auto"
 >
 <Eye className="w-3.5 h-3.5 text-theme-muted" />
 <span>Detalle</span>
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* MODAL: EJECUTAR CONTEO FISICO (SCANNER LUGA) */}
 {/* ========================================================================= */}
 {activeTaskToExecute && (
 <ExecuteCountModal
 task={activeTaskToExecute}
 onClose={() => setActiveTaskToExecute(null)}
 onCompleteCount={handleCompleteCount}
 />
 )}

 {/* ========================================================================= */}
 {/* MODAL: NUEVO PLAN DE CONTEO (6 PASOS) */}
 {/* ========================================================================= */}
 <CreateCountPlanModal
 isOpen={isCreatePlanOpen}
 onClose={() => setIsCreatePlanOpen(false)}
 onPlanCreated={handlePlanCreated}
 />

 {/* ========================================================================= */}
 {/* MODAL: DETALLE DE DIFERENCIA / RECUENTO */}
 {/* ========================================================================= */}
 {selectedDifferenceDetail && (
 <DifferenceDetailModal
 difference={selectedDifferenceDetail}
 onClose={() => setSelectedDifferenceDetail(null)}
 onRequestRecount={handleRequestRecount}
 onMarkInvestigation={handleMarkInvestigation}
 />
 )}
 </div>
 );
};
