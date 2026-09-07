import React, { useState } from 'react';
import { 
 History, 
 Search, 
 Eye, 
 CheckCircle2, 
 Printer, 
 FileText, 
 X, 
 Layers, 
 MapPin, 
 QrCode, 
 User, 
 Building2 
} from 'lucide-react';
import { ReprintAuditRecord } from '../../../data/mockReprintData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReprintAuditHistorySectionProps {
 logs: ReprintAuditRecord[];
}

export const ReprintAuditHistorySection: React.FC<ReprintAuditHistorySectionProps> = ({
 logs,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedRecord, setSelectedRecord] = useState<ReprintAuditRecord | null>(null);

 const filteredLogs = logs.filter((l) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 l.code.toLowerCase().includes(q) ||
 l.title.toLowerCase().includes(q) ||
 l.reason.toLowerCase().includes(q) ||
 l.requestedBy.toLowerCase().includes(q) ||
 (l.sourceReference && l.sourceReference.toLowerCase().includes(q))
 );
 });

 return (
 <div className="space-y-6">
 
 {/* Header & Subtitle */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-1">
 <div className="flex items-center gap-2">
 <History className="w-5 h-5 text-rose-600" />
 <h2 className="text-sm font-extrabold text-theme-main">
 Bitácora de Auditoría de Reimpresiones
 </h2>
 </div>
 <p className="text-xs text-theme-muted">
 Historial completo de etiquetas generadas, usuarios responsables, motivos y referencias de incidencias.
 </p>
 </div>

 {/* Trazability Notice */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-xs text-theme-muted">
 <div className="flex items-center gap-2 font-mono text-[11px]">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>Toda reimpresión queda registrada para trazabilidad y auditoría de inventario.</span>
 </div>
 <span className="font-mono text-[11px] font-bold text-theme-main">
 Total de registros: {logs.length}
 </span>
 </div>

 {/* Search Bar */}
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar por código, artículo, motivo, usuario o referencia..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-10 pr-4 py-3 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30 shadow-xs"
 />
 </div>

 {/* Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Fecha / Hora</th>
 <th className="py-3 px-3">Tipo</th>
 <th className="py-3 px-3">Código</th>
 <th className="py-3 px-3">Artículo / Ubicación</th>
 <th className="py-3 px-3">Motivo</th>
 <th className="py-3 px-3">Usuario</th>
 <th className="py-3 px-3">Referencia</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredLogs.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-8 text-center text-theme-muted">
 No se encontraron registros de reimpresión.
 </td>
 </tr>
 ) : (
 filteredLogs.map((log) => (
 <tr key={log.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {log.reprintedAt}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 log.type === 'Unidad'
 ? 'border-rose-500'
 : 'border-blue-500'
 }`}>
 {log.type}
 </span>
 </td>
 <td className="py-3.5 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
 {log.code}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <strong className="text-theme-main block">{log.title}</strong>
 <span className="text-[10px] text-theme-muted block">{log.details}</span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-theme-muted text-theme-main border border-theme-subtle">
 {log.reason}
 </span>
 </td>
 <td className="py-3.5 px-3 text-theme-muted whitespace-nowrap">
 {log.requestedBy}
 </td>
 <td className="py-3.5 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
 {log.sourceReference || '—'}
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setSelectedRecord(log)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5 text-theme-primary" />
 <span>Ver</span>
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Modal: View Audit Record Detail */}
 {selectedRecord && (
 <ModalPortal onClose={() => setSelectedRecord(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh] text-xs">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Printer className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Detalle de Reimpresión
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">
 Registro de Auditoría de Trazabilidad
 </span>
 </div>
 </div>

 <button
 onClick={() => setSelectedRecord(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1">
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Tipo de Etiqueta:</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-surface border border-theme-subtle font-mono text-theme-main">
 {selectedRecord.type}
 </span>
 </div>

 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Código / Identificador:</span>
 <strong className="font-mono text-rose-600 text-sm block">{selectedRecord.code}</strong>
 <span className="text-[11px] text-theme-main font-semibold">{selectedRecord.title}</span>
 </div>

 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-subtle">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Motivo:</span>
 <strong className="text-theme-main">{selectedRecord.reason}</strong>
 </div>
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Referencia:</span>
 <strong className="font-mono text-rose-600">{selectedRecord.sourceReference || 'Directa'}</strong>
 </div>
 </div>

 <div className="pt-2 border-t border-theme-subtle">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Solicitado Por:</span>
 <strong className="text-theme-main block">{selectedRecord.requestedBy}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{selectedRecord.reprintedAt}</span>
 </div>

 <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-[11px] flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>Resultado: {selectedRecord.status}</span>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex justify-end text-xs">
 <button
 onClick={() => setSelectedRecord(null)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </div>
 );
};
