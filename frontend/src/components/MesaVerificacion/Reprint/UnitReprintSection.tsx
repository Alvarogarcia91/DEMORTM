import React, { useState, useEffect } from 'react';
import { 
 Search, 
 Printer, 
 Eye, 
 QrCode, 
 AlertTriangle, 
 CheckCircle2, 
 Sparkles, 
 Building2, 
 Tag, 
 Calendar, 
 Layers, 
 MapPin, 
 X 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
 UnitReprintCandidate, 
 ReprintReason, 
 REPRINT_REASONS_LIST, 
 ReprintAuditRecord 
} from '../../../data/mockReprintData';
import { ReceiptStickerModal } from '../Inbound/ReceiptStickerModal';
import { ReceivedUnitRecord } from '../../../data/mockInboundData';

interface UnitReprintSectionProps {
 candidates: UnitReprintCandidate[];
 initialUid?: string;
 initialIncidentRef?: string;
 onRecordReprint: (record: ReprintAuditRecord) => void;
 onShowToast: (msg: string) => void;
}

export const UnitReprintSection: React.FC<UnitReprintSectionProps> = ({
 candidates,
 initialUid,
 initialIncidentRef,
 onRecordReprint,
 onShowToast,
}) => {
 const [searchQuery, setSearchQuery] = useState(initialUid || '');
 const [selectedUnit, setSelectedUnit] = useState<UnitReprintCandidate | null>(() => {
 if (initialUid) {
 return candidates.find((c) => c.uid.toLowerCase() === initialUid.toLowerCase()) || candidates[0];
 }
 return candidates[0];
 });
 const [reason, setReason] = useState<ReprintReason>('Etiqueta ilegible');
 const [customReason, setCustomReason] = useState('');
 const [showPreviewModal, setShowPreviewModal] = useState(false);
 const [showAutocomplete, setShowAutocomplete] = useState(false);

 // Sync if initialUid changes
 useEffect(() => {
 if (initialUid) {
 const found = candidates.find((c) => c.uid.toLowerCase() === initialUid.toLowerCase());
 if (found) {
 setSelectedUnit(found);
 setSearchQuery(initialUid);
 }
 }
 }, [initialUid, candidates]);

 const filteredCandidates = candidates.filter((c) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 c.uid.toLowerCase().includes(q) ||
 c.sku.toLowerCase().includes(q) ||
 c.productName.toLowerCase().includes(q) ||
 c.lotNumber.toLowerCase().includes(q) ||
 c.locationCode.toLowerCase().includes(q)
 );
 });

 const handleSelectCandidate = (cand: UnitReprintCandidate) => {
 setSelectedUnit(cand);
 setSearchQuery(cand.uid);
 setShowAutocomplete(false);
 };

 const handleExecuteReprint = () => {
 if (!selectedUnit) return;

 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const newRecord: ReprintAuditRecord = {
 id: `rep-${Date.now()}`,
 reprintedAt: dateStr,
 type: 'Unidad',
 code: selectedUnit.uid,
 title: selectedUnit.productName,
 details: `SKU: ${selectedUnit.sku} · Lote: ${selectedUnit.lotNumber}`,
 reason,
 customReason: reason === 'Otro' ? customReason : undefined,
 requestedBy: 'Admin Demo (Supervisor Mesa)',
 sourceReference: initialIncidentRef,
 warehouseName: selectedUnit.warehouseName,
 status: 'Impresión completada',
 };

 onRecordReprint(newRecord);
 onShowToast(`✓ Etiqueta enviada a impresión: ${selectedUnit.uid} · Reimpresión registrada.`);
 };

 const stickerUnitObj: ReceivedUnitRecord | null = selectedUnit
 ? {
 uid: selectedUnit.uid,
 sku: selectedUnit.sku,
 productName: selectedUnit.productName,
 brand: selectedUnit.brand,
 size: selectedUnit.size,
 lotNumber: selectedUnit.lotNumber,
 receivedAt: '27 Ago 10:00',
 operator: 'Admin Demo',
 locationCode: selectedUnit.locationCode,
 status: 'Pendiente de acomodo',
 }
 : null;

 return (
 <div className="space-y-6">
 
 {/* Header & Subtitle */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-1">
 <div className="flex items-center gap-2">
 <QrCode className="w-5 h-5 text-theme-primary" />
 <h2 className="text-sm font-extrabold text-theme-main">
 Reimpresión de Etiquetas de Unidad
 </h2>
 </div>
 <p className="text-xs text-theme-muted">
 Busca una unidad serializada y genera una nueva impresión de su etiqueta QR física sin modificar su estado en inventario.
 </p>
 </div>

 {/* Incident Reference Context Banner if applicable */}
 {initialIncidentRef && (
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 shadow-2xs flex items-center justify-between text-xs text-zinc-900 animate-in fade-in">
 <div className="flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span>
 Solicitud de reimpresión originada desde Incidencia <strong className="font-mono text-zinc-900">{initialIncidentRef}</strong>.
 </span>
 </div>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs font-mono">
 {initialUid}
 </span>
 </div>
 )}

 {/* Search Bar with Autocomplete */}
 <div className="relative">
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onFocus={() => setShowAutocomplete(true)}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setShowAutocomplete(true);
 }}
 placeholder="Buscar UID (TAR-RTM-..., BOB-RTM-...), SKU, artículo, lote o ubicación..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-10 pr-9 py-3 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30 shadow-xs"
 />
 {searchQuery && (
 <button
 onClick={() => {
 setSearchQuery('');
 setShowAutocomplete(false);
 }}
 className="absolute right-3.5 top-3.5 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 )}
 </div>

 {/* Autocomplete Dropdown */}
 {showAutocomplete && filteredCandidates.length > 0 && (
 <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto p-2 space-y-1">
 {filteredCandidates.map((cand) => (
 <div
 key={cand.uid}
 onClick={() => handleSelectCandidate(cand)}
 className="p-2.5 rounded-xl hover:bg-theme-muted transition-colors cursor-pointer text-xs space-y-0.5"
 >
 <div className="flex items-center justify-between">
 <strong className="font-mono text-theme-primary">{cand.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{cand.locationCode} &bull; {cand.warehouseName}</span>
 </div>
 <div className="flex items-center justify-between text-[11px] text-theme-main">
 <span className="font-semibold truncate">{cand.productName}</span>
 <span className="text-[10px] text-theme-muted font-mono">Lote: {cand.lotNumber}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Selected Unit Details & QR Preview Card */}
 {selectedUnit && (
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-6">
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
 
 {/* Unit Info */}
 <div className="md:col-span-2 space-y-4">
 <div>
 <div className="flex items-center gap-2 flex-wrap mb-1">
 <span className="font-mono text-base font-black text-theme-primary">
 {selectedUnit.uid}
 </span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
 {selectedUnit.status}
 </span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {selectedUnit.brand} &bull; {selectedUnit.size}
 </span>
 </div>
 <h3 className="text-base font-extrabold text-theme-main">
 {selectedUnit.productName}
 </h3>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">SKU:</span>
 <strong className="font-mono text-theme-main text-xs">{selectedUnit.sku}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Lote:</span>
 <strong className="font-mono text-theme-main text-xs">{selectedUnit.lotNumber}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ubicación Actual:</span>
 <strong className="font-mono text-theme-primary text-xs">{selectedUnit.locationCode}</strong>
 </div>
 </div>

 {/* Reason Selector */}
 <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Motivo de Reimpresión (Requerido para auditoría):
 </label>
 <select
 value={reason}
 onChange={(e) => setReason(e.target.value as ReprintReason)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 {REPRINT_REASONS_LIST.map((r) => (
 <option key={r} value={r}>
 {r}
 </option>
 ))}
 </select>

 {reason === 'Otro' && (
 <textarea
 rows={2}
 value={customReason}
 onChange={(e) => setCustomReason(e.target.value)}
 placeholder="Especifica el motivo de la reimpresión..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-xs text-theme-main focus:outline-none resize-none mt-2 font-medium"
 />
 )}
 </div>
 </div>

 {/* QR Card Graphic */}
 <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-theme-muted/20 border border-theme-subtle text-center space-y-3">
 <div className="bg-white p-3.5 rounded-2xl shadow-md border border-zinc-200">
 <QRCodeSVG
 value={`IMPRESOSRTM|UID:${selectedUnit.uid}|SKU:${selectedUnit.sku}|LOT:${selectedUnit.lotNumber}`}
 size={128}
 level="H"
 includeMargin={false}
 />
 </div>

 <div className="space-y-0.5 font-mono">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">QR Físico de Unidad</span>
 <strong className="text-xs text-theme-main font-bold block">{selectedUnit.uid}</strong>
 </div>
 </div>
 </div>

 {/* Action Buttons & Audit Notice */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-theme-subtle text-xs">
 <span className="text-[11px] text-theme-muted font-mono flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 <span>Toda reimpresión queda registrada en la bitácora de trazabilidad.</span>
 </span>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setShowPreviewModal(true)}
 className="px-4 py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center gap-1.5"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Vista previa</span>
 </button>

 <button
 type="button"
 onClick={handleExecuteReprint}
 className="px-5 py-2.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Reimprimir etiqueta</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Modal: Preview Sticker */}
 {showPreviewModal && stickerUnitObj && (
 <ReceiptStickerModal
 unit={stickerUnitObj}
 warehouseName={selectedUnit?.warehouseName}
 onClose={() => setShowPreviewModal(false)}
 onPrintSuccess={() => {
 setShowPreviewModal(false);
 handleExecuteReprint();
 }}
 />
 )}
 </div>
 );
};
