import React, { useState } from 'react';
import { 
 X, 
 AlertTriangle, 
 CheckCircle2, 
 Clock, 
 MapPin, 
 User, 
 Layers, 
 FileText, 
 Building2, 
 ArrowRight, 
 Send, 
 RotateCcw, 
 Check, 
 Tag, 
 Wrench, 
 Calculator, 
 Printer, 
 Sparkles,
 ShieldCheck,
 Info
} from 'lucide-react';
import { 
 OperationalIncident, 
 IncidentTimelineEntry 
} from '../../../data/mockIncidentsData';
import { ReworkTransferModal } from './ReworkTransferModal';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';

interface IncidentDetailModalProps {
 incident: OperationalIncident;
 onClose: () => void;
 onUpdateIncident: (updated: OperationalIncident) => void;
 onNavigateToReprint?: (uid?: string, incidentRef?: string) => void;
 onShowToast?: (msg: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
 incident,
 onClose,
 onUpdateIncident,
 onNavigateToReprint,
 onShowToast,
}) => {
 const [newNote, setNewNote] = useState('');
 const [resolutionText, setResolutionText] = useState('');
 const [isClosing, setIsClosing] = useState(false);
 const [isReworkModalOpen, setIsReworkModalOpen] = useState(false);
 const [countTaskCreated, setCountTaskCreated] = useState<string | null>(null);

 const nowTime = () => {
 const d = new Date();
 return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
 };

 // Add note to timeline
 const handleAddNote = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newNote.trim()) return;

 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Admin Operaciones',
 role: 'Supervisor',
 message: newNote.trim(),
 type: 'note',
 };

 const updated: OperationalIncident = {
 ...incident,
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 setNewNote('');
 if (onShowToast) onShowToast('✓ Nota agregada a la bitácora.');
 };

 // Status transitions
 const handleStartAttention = () => {
 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Admin Operaciones',
 role: 'Supervisor',
 message: 'Incidencia puesta En atención para investigación de piso.',
 type: 'status_change',
 };

 const updated: OperationalIncident = {
 ...incident,
 status: 'En atención',
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 if (onShowToast) onShowToast('✓ Incidencia en atención.');
 };

 const handleMarkReadyToClose = () => {
 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Admin Operaciones',
 role: 'Supervisor',
 message: 'Incidencia marcada como Lista para cierre tras completar acciones de corrección.',
 type: 'status_change',
 };

 const updated: OperationalIncident = {
 ...incident,
 status: 'Lista para cierre',
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 if (onShowToast) onShowToast('✓ Incidencia lista para cierre.');
 };

 const handleResumeAttention = () => {
 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Admin Operaciones',
 role: 'Supervisor',
 message: 'Incidencia regresada a En atención para validaciones complementarias.',
 type: 'status_change',
 };

 const updated: OperationalIncident = {
 ...incident,
 status: 'En atención',
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 };

 const handleConfirmClose = () => {
 if (!resolutionText.trim()) return;

 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Admin Operaciones',
 role: 'Supervisor',
 message: `Resolución final: ${resolutionText.trim()}`,
 type: 'resolution',
 };

 const updated: OperationalIncident = {
 ...incident,
 status: 'Cerrada',
 resolution: resolutionText.trim(),
 closedAt: `27 Ago ${nowTime()}`,
 closedBy: 'Admin Operaciones',
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 setIsClosing(false);
 if (onShowToast) onShowToast(`✓ Incidencia ${incident.code} cerrada exitosamente.`);
 };

 // Contextual actions
 const handleRequestCount = () => {
 const folio = `CC-2026-00${Math.floor(48 + Math.random() * 20)}`;
 setCountTaskCreated(folio);

 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Sistema de Almacén',
 role: 'Auditoría',
 message: `Se generó solicitud de recuento cíclico (${folio}) para la posición ${incident.locationCode || 'A-B-03'}.`,
 type: 'action',
 };

 const updated: OperationalIncident = {
 ...incident,
 lastActivityAt: `27 Ago ${nowTime()}`,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 };

 const handleConfirmReworkTransfer = (targetLoc: string, notes: string) => {
 const entry: IncidentTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${nowTime()}`,
 actor: 'Mesa de Calidad',
 role: 'Calidad',
 message: `Unidad trasladada a ${targetLoc} para retrabajo. Instrucción: ${notes}`,
 type: 'action',
 };

 const updatedMovements = [
 ...(incident.unitMovementsHistory || []),
 {
 timestamp: `27 Ago ${nowTime()}`,
 type: 'TRASLADO A RETRABAJO',
 from: incident.locationCode || 'REC-01',
 to: targetLoc,
 user: 'Mesa de Calidad',
 },
 ];

 const updated: OperationalIncident = {
 ...incident,
 locationCode: targetLoc,
 lastActivityAt: `27 Ago ${nowTime()}`,
 unitMovementsHistory: updatedMovements,
 timeline: [...incident.timeline, entry],
 };

 onUpdateIncident(updated);
 setIsReworkModalOpen(false);
 if (onShowToast) onShowToast(`✓ Unidad trasladada a ${targetLoc}.`);
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface flex-wrap gap-2">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-base font-black text-rose-600">{incident.code}</span>
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
 size="md"
 />
 <PriorityBadge priority={incident.priority} size="md" />
 <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-zinc-900 border border-zinc-400/80 shadow-2xs">
 {incident.sourceModule}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 {incident.incidentType}
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {/* Transition action buttons */}
 {incident.status === 'Abierta' && (
 <button
 onClick={handleStartAttention}
 className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
 >
 Iniciar atención
 </button>
 )}

 {incident.status === 'En atención' && (
 <button
 onClick={handleMarkReadyToClose}
 className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
 >
 Marcar lista para cierre
 </button>
 )}

 {incident.status === 'Lista para cierre' && !isClosing && (
 <>
 <button
 onClick={handleResumeAttention}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer"
 >
 Volver a En atención
 </button>
 <button
 onClick={() => setIsClosing(true)}
 className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
 >
 Cerrar incidencia
 </button>
 </>
 )}

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Closing Resolution Form if active */}
 {isClosing && (
 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in duration-150">
 <strong className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
 Resolución Final para Cierre de Incidencia *
 </strong>
 <textarea
 rows={3}
 value={resolutionText}
 onChange={(e) => setResolutionText(e.target.value)}
 placeholder="Describe la solución aplicada, corrección física realizada o dictamen final..."
 className="w-full bg-theme-surface border border-emerald-500/40 rounded-xl p-2.5 text-xs text-theme-main focus:outline-none resize-none font-medium"
 />
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => setIsClosing(false)}
 className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle cursor-pointer"
 >
 Cancelar
 </button>
 <button
 disabled={!resolutionText.trim()}
 onClick={handleConfirmClose}
 className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
 >
 Confirmar cierre
 </button>
 </div>
 </div>
 )}

 {/* Section: Qué Ocurrió */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1.5">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Qué Ocurrió:
 </span>
 <h4 className="text-xs font-bold text-theme-main">{incident.title}</h4>
 <p className="text-xs text-theme-muted leading-relaxed">{incident.description}</p>
 </div>

 {/* Section: Contexto Operativo */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-2xs">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Contexto Operativo:
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Origen:</span>
 <strong className="text-theme-main">{incident.sourceModule}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Referencia:</span>
 <strong className="font-mono text-rose-600">{incident.sourceReference || 'Reporte directo'}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instalación:</span>
 <strong className="text-theme-main">{incident.warehouseName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ubicación Registrada:</span>
 <strong className="font-mono text-rose-600 text-sm">{incident.locationCode || 'N/A'}</strong>
 </div>

 {incident.uid && (
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">UID / Serie:</span>
 <strong className="font-mono text-rose-600 block truncate">{incident.uid}</strong>
 </div>
 )}

 {incident.sku && (
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">SKU / Artículo:</span>
 <strong className="text-theme-main block truncate">{incident.productName || incident.sku}</strong>
 </div>
 )}

 {incident.lotNumber && (
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Lote:</span>
 <strong className="font-mono text-theme-muted">{incident.lotNumber}</strong>
 </div>
 )}

 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Reportado Por:</span>
 <span className="text-theme-muted">{incident.reportedBy}</span>
 </div>
 </div>

 {/* Quantity Difference block if applicable */}
 {incident.quantityDifference && (
 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle shadow-2xs grid grid-cols-3 gap-2 text-center text-xs font-mono">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Planeado</span>
 <strong className="text-zinc-900">{incident.quantityDifference.planned} u.</strong>
 </div>
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Físico Contado</span>
 <strong className="text-zinc-900">{incident.quantityDifference.counted} u.</strong>
 </div>
 <div>
 <span className="text-[9px] uppercase font-bold text-rose-600 block">Diferencia</span>
 <strong className="text-rose-600 text-sm font-black">{incident.quantityDifference.difference} u.</strong>
 </div>
 </div>
 )}

 {/* Serial Difference block if applicable */}
 {incident.serialDifference && (
 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle shadow-2xs grid grid-cols-2 gap-2 text-xs font-mono">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">UID Esperada en Orden:</span>
 <strong className="text-rose-600 block">{incident.serialDifference.expectedUid}</strong>
 </div>
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">UID Escaneada en Rampa:</span>
 <strong className="text-zinc-900 block">{incident.serialDifference.foundUid}</strong>
 </div>
 </div>
 )}
 </div>

 {/* Section: Trazabilidad Rápida de la Unidad */}
 {incident.unitMovementsHistory && incident.unitMovementsHistory.length > 0 && (
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Últimos Movimientos de la Unidad:
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
 {incident.unitMovementsHistory.map((mov, idx) => (
 <div key={idx} className="p-2 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5 shadow-2xs">
 <span className="text-[9px] text-theme-muted block">{mov.timestamp} &bull; {mov.user}</span>
 <strong className="text-xs text-rose-600 block">{mov.type}</strong>
 <div className="text-[10px] text-theme-main">
 {mov.from} &rarr; {mov.to}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Section: Acciones Rápidas Contextuales */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2.5">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Acciones Operativas Disponibles:
 </span>

 <div className="flex flex-wrap items-center gap-2">
 {(incident.incidentType === 'Unidad no localizada' || incident.incidentType === 'Diferencia de cantidad') && (
 <button
 type="button"
 onClick={handleRequestCount}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
 >
 <Calculator className="w-3.5 h-3.5 text-blue-600" />
 <span>Solicitar recuento cíclico</span>
 </button>
 )}

 {(incident.incidentType === 'Artículo dañado' || incident.incidentType === 'Empaque dañado' || incident.incidentType === 'Daño operativo') && (
 <button
 type="button"
 onClick={() => setIsReworkModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Wrench className="w-3.5 h-3.5" />
 <span>Enviar a retrabajo</span>
 </button>
 )}

 {(incident.incidentType === 'QR / etiqueta ilegible' || incident.incidentType === 'QR / etiqueta faltante') && (
 <button
 type="button"
 onClick={() => {
 if (onNavigateToReprint) {
 onNavigateToReprint(incident.uid, incident.code);
 onClose();
 }
 }}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5 text-purple-600" />
 <span>Ir a reimpresión de sticker</span>
 </button>
 )}
 </div>

 {countTaskCreated && (
 <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>
 Tarea de conteo generada con folio: <strong className="font-mono">{countTaskCreated}</strong>.
 </span>
 </div>
 )}
 </div>

 {/* Section: Resolution if Closed */}
 {incident.status === 'Cerrada' && incident.resolution && (
 <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-emerald-950 dark:text-emerald-200">
 <div className="flex items-center justify-between">
 <strong className="text-xs font-black block">Resolución Final Registrada</strong>
 <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300">
 Cerrada el {incident.closedAt} por {incident.closedBy}
 </span>
 </div>
 <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
 {incident.resolution}
 </p>
 </div>
 )}

 {/* Section: Add Note Input */}
 {incident.status !== 'Cerrada' && (
 <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-theme-subtle">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Agregar Nota de Seguimiento:
 </span>
 <div className="flex items-center gap-2">
 <input
 type="text"
 value={newNote}
 onChange={(e) => setNewNote(e.target.value)}
 placeholder="Escribe una actualización operativa de esta incidencia..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 <button
 type="submit"
 disabled={!newNote.trim()}
 className="px-4 py-2 rounded-xl bg-theme-main text-theme-surface font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
 >
 <Send className="w-3.5 h-3.5" />
 <span>Publicar</span>
 </button>
 </div>
 </form>
 )}

 {/* Section: Bitácora (Activity Timeline) */}
 <div className="space-y-3 pt-2">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Bitácora de Actividades y Eventos:
 </span>

 <div className="space-y-3 pl-4 border-l-2 border-theme-subtle">
 {incident.timeline.slice().reverse().map((t) => (
 <div key={t.id} className="relative space-y-0.5 text-xs">
 <span className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-theme-surface ${
 t.type === 'resolution'
 ? 'bg-emerald-500'
 : t.type === 'status_change'
 ? 'bg-purple-500'
 : t.type === 'action'
 ? 'bg-amber-500'
 : 'bg-rose-500'
 }`} />
 <div className="flex items-center gap-2 text-[10px] text-theme-muted font-mono">
 <strong>{t.occurredAt}</strong>
 <span>&bull;</span>
 <span className="text-theme-main font-semibold">{t.actor} ({t.role})</span>
 </div>
 <p className="text-theme-main font-medium leading-snug">{t.message}</p>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted font-mono text-[10px]">
 Última actividad: {incident.lastActivityAt}
 </span>

 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cerrar detalle
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* Rework Transfer Modal */}
 {isReworkModalOpen && (
 <ReworkTransferModal
 incident={incident}
 onClose={() => setIsReworkModalOpen(false)}
 onConfirmTransfer={handleConfirmReworkTransfer}
 />
 )}
 </>
 );
};
