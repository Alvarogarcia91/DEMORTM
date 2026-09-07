import React, { useState } from 'react';
import { 
 Search, 
 Printer, 
 Eye, 
 QrCode, 
 Layers, 
 MapPin, 
 CheckCircle2, 
 Sparkles, 
 X, 
 Building2,
 Boxes
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
 LocationReprintCandidate, 
 ReprintReason, 
 REPRINT_REASONS_LIST, 
 ReprintAuditRecord 
} from '../../../data/mockReprintData';
import { ModalPortal } from '../../common/ModalPortal';

interface LocationReprintSectionProps {
 locations: LocationReprintCandidate[];
 onRecordReprint: (record: ReprintAuditRecord) => void;
 onShowToast: (msg: string) => void;
}

export const LocationReprintSection: React.FC<LocationReprintSectionProps> = ({
 locations,
 onRecordReprint,
 onShowToast,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedLoc, setSelectedLoc] = useState<LocationReprintCandidate | null>(locations[2] || locations[0]); // default A-B-03
 const [reason, setReason] = useState<ReprintReason>('Etiqueta dañada');
 const [showAutocomplete, setShowAutocomplete] = useState(false);
 const [showMassiveModal, setShowMassiveModal] = useState(false);
 const [massiveMode, setMassiveMode] = useState<'column' | 'level' | 'special'>('column');
 const [massiveAisle, setMassiveAisle] = useState('Pasillo A');
 const [massivePos, setMassivePos] = useState('04');
 const [massiveLevel, setMassiveLevel] = useState('Nivel B');

 const filteredLocations = locations.filter((l) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 l.code.toLowerCase().includes(q) ||
 l.name.toLowerCase().includes(q) ||
 l.type.toLowerCase().includes(q) ||
 (l.aisle && l.aisle.toLowerCase().includes(q))
 );
 });

 const handleSelectLocation = (loc: LocationReprintCandidate) => {
 setSelectedLoc(loc);
 setSearchQuery(loc.code);
 setShowAutocomplete(false);
 };

 const handleExecuteReprint = (locToReprint = selectedLoc) => {
 if (!locToReprint) return;

 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const newRecord: ReprintAuditRecord = {
 id: `rep-${Date.now()}`,
 reprintedAt: dateStr,
 type: 'Ubicación',
 code: locToReprint.code,
 title: locToReprint.name,
 details: `${locToReprint.type} · ${locToReprint.aisle || 'Zona Operativa'}`,
 reason,
 requestedBy: 'Admin Demo (Supervisor Mesa)',
 warehouseName: locToReprint.warehouseName,
 status: 'Impresión completada',
 };

 onRecordReprint(newRecord);
 onShowToast(`✓ Etiqueta de ubicación enviada a impresión: ${locToReprint.code}.`);
 };

 const handleExecuteMassive = () => {
 let generatedCodes: string[] = [];
 if (massiveMode === 'column') {
 generatedCodes = ['A-C-04', 'A-B-04', 'A-A-04'];
 } else if (massiveMode === 'level') {
 generatedCodes = ['A-B-01', 'A-B-02', 'A-B-03', 'A-B-04', 'A-B-05'];
 } else {
 generatedCodes = ['REC-01', 'EMB-01', 'EMB-02', 'EMB-03', 'SHOW-01', 'RET-NORTE'];
 }

 generatedCodes.forEach((code, idx) => {
 const targetLoc = locations.find((l) => l.code === code) || {
 code,
 name: `Ubicación ${code}`,
 type: 'Rack de Almacenamiento' as const,
 warehouseId: 'wh-mty-norte',
 warehouseName: 'Almacén Materia Prima',
 status: 'Activa' as const,
 };

 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

 onRecordReprint({
 id: `rep-mass-${Date.now()}-${idx}`,
 reprintedAt: `27 Ago 2026, ${timeStr}`,
 type: 'Ubicación',
 code: targetLoc.code,
 title: targetLoc.name,
 details: `Impresión Masiva · Modo ${massiveMode}`,
 reason: 'Reposición preventiva' as ReprintReason,
 requestedBy: 'Admin Demo (Supervisor Mesa)',
 warehouseName: targetLoc.warehouseName,
 status: 'Impresión completada',
 });
 });

 setShowMassiveModal(false);
 onShowToast(`✓ Lote de ${generatedCodes.length} etiquetas de ubicación enviado a impresión.`);
 };

 return (
 <div className="space-y-6">
 
 {/* Header & Subtitle */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-1">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <MapPin className="w-5 h-5 text-theme-primary" />
 <h2 className="text-sm font-extrabold text-theme-main">
 Reimpresión de Etiquetas de Ubicación
 </h2>
 </div>
 <p className="text-xs text-theme-muted">
 Reimprime códigos QR físicos de racks, andenes, zonas operativas y áreas de sucursal.
 </p>
 </div>

 <button
 type="button"
 onClick={() => setShowMassiveModal(true)}
 className="px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
 >
 <Boxes className="w-4 h-4 text-amber-400" />
 <span>Impresión masiva</span>
 </button>
 </div>
 </div>

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
 placeholder="Buscar código de ubicación (A-B-03, REC-01, EMB-03, SHOW-02, RET-NORTE)..."
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
 {showAutocomplete && filteredLocations.length > 0 && (
 <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto p-2 space-y-1">
 {filteredLocations.map((loc) => (
 <div
 key={loc.code}
 onClick={() => handleSelectLocation(loc)}
 className="p-2.5 rounded-xl hover:bg-theme-muted transition-colors cursor-pointer text-xs flex items-center justify-between"
 >
 <div>
 <strong className="font-mono text-theme-primary block">{loc.code}</strong>
 <span className="text-[10px] text-theme-muted">{loc.name}</span>
 </div>
 <span className="px-2 py-0.5 rounded text-[10px] bg-theme-muted text-theme-main border border-theme-subtle font-mono">
 {loc.type}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Selected Location Details Card */}
 {selectedLoc && (
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-6">
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
 
 {/* Location Info */}
 <div className="md:col-span-2 space-y-4">
 <div>
 <div className="flex items-center gap-2 flex-wrap mb-1">
 <span className="font-mono text-xl font-black text-theme-primary">
 {selectedLoc.code}
 </span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
 {selectedLoc.status}
 </span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {selectedLoc.type}
 </span>
 </div>
 <h3 className="text-base font-extrabold text-theme-main">
 {selectedLoc.name}
 </h3>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instalación:</span>
 <strong className="text-theme-main text-xs">{selectedLoc.warehouseName}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Pasillo / Bahía:</span>
 <strong className="font-mono text-theme-main text-xs">{selectedLoc.aisle || 'N/A'}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Posición / Nivel:</span>
 <strong className="font-mono text-theme-primary text-xs">
 {selectedLoc.rackPosition ? `Pos ${selectedLoc.rackPosition} · ${selectedLoc.level}` : 'Área General'}
 </strong>
 </div>
 </div>

 {/* Reason Selector */}
 <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Motivo de Reimpresión de Etiqueta de Ubicación:
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
 </div>
 </div>

 {/* Location QR Preview Graphic */}
 <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-theme-muted/20 border border-theme-subtle text-center space-y-3">
 <div className="bg-white p-3.5 rounded-2xl shadow-md border border-zinc-200">
 <QRCodeSVG
 value={`IMPRESOSRTM|LOC:${selectedLoc.code}|WH:${selectedLoc.warehouseId}`}
 size={128}
 level="H"
 includeMargin={false}
 />
 </div>

 <div className="space-y-0.5 font-mono">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">QR Físico de Ubicación</span>
 <strong className="text-sm text-theme-main font-black block">{selectedLoc.code}</strong>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-theme-subtle text-xs">
 <span className="text-[11px] text-theme-muted font-mono flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 <span>Etiqueta física de rack/bahía de 100mm x 50mm lista para impresión térmica.</span>
 </span>

 <button
 type="button"
 onClick={() => handleExecuteReprint()}
 className="px-5 py-2.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
 >
 <Printer className="w-4 h-4" />
 <span>Reimprimir etiqueta de ubicación</span>
 </button>
 </div>
 </div>
 )}

 {/* Modal: Massive Reprint */}
 {showMassiveModal && (
 <ModalPortal onClose={() => setShowMassiveModal(false)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh] text-xs">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <Boxes className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Impresión Masiva de Ubicaciones
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">
 Generación de lotes por columna, nivel o zonas
 </span>
 </div>
 </div>

 <button
 onClick={() => setShowMassiveModal(false)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1">
 
 <div className="space-y-2">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Modalidad de Impresión Masiva:
 </label>
 <div className="grid grid-cols-3 gap-2">
 {[
 { id: 'column', label: 'Por Columna', desc: 'A-C-04, A-B-04, A-A-04' },
 { id: 'level', label: 'Por Nivel', desc: 'Todo Nivel B Pasillo A' },
 { id: 'special', label: 'Zonas Especiales', desc: 'Andenes, EMB, RET' },
 ].map((m) => (
 <div
 key={m.id}
 onClick={() => setMassiveMode(m.id as any)}
 className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
 massiveMode === m.id
 ? 'bg-theme-primary-light border-theme-primary text-theme-primary ring-1 ring-theme-primary'
 : 'bg-theme-muted/30 border-theme-subtle hover:bg-theme-muted text-theme-main'
 }`}
 >
 <strong className="text-xs font-bold block">{m.label}</strong>
 <span className="text-[9px] text-theme-muted block leading-tight">{m.desc}</span>
 </div>
 ))}
 </div>
 </div>

 {massiveMode === 'column' && (
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">Pasillo:</label>
 <select
 value={massiveAisle}
 onChange={(e) => setMassiveAisle(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 font-bold focus:outline-none"
 >
 <option value="Pasillo A">Pasillo A</option>
 <option value="Pasillo B">Pasillo B</option>
 <option value="Pasillo C">Pasillo C</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">Posición:</label>
 <select
 value={massivePos}
 onChange={(e) => setMassivePos(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 font-bold focus:outline-none"
 >
 <option value="01">Posición 01</option>
 <option value="02">Posición 02</option>
 <option value="03">Posición 03</option>
 <option value="04">Posición 04</option>
 </select>
 </div>
 </div>

 <div className="text-[11px] text-theme-muted font-mono">
 Se generarán 3 etiquetas: <strong className="text-theme-main">A-C-04, A-B-04, A-A-04</strong>
 </div>
 </div>
 )}

 {massiveMode === 'level' && (
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">Pasillo:</label>
 <select
 value={massiveAisle}
 onChange={(e) => setMassiveAisle(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 font-bold focus:outline-none"
 >
 <option value="Pasillo A">Pasillo A</option>
 <option value="Pasillo B">Pasillo B</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">Nivel:</label>
 <select
 value={massiveLevel}
 onChange={(e) => setMassiveLevel(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 font-bold focus:outline-none"
 >
 <option value="Nivel A">Nivel A (Piso)</option>
 <option value="Nivel B">Nivel B (Medio)</option>
 <option value="Nivel C">Nivel C (Alto)</option>
 </select>
 </div>
 </div>

 <div className="text-[11px] text-theme-muted font-mono">
 Se generarán 5 etiquetas: <strong className="text-theme-main">A-B-01 a A-B-05</strong>
 </div>
 </div>
 )}

 {massiveMode === 'special' && (
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Zonas Seleccionadas:</span>
 <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
 {['REC-01', 'EMB-01', 'EMB-02', 'EMB-03', 'SHOW-01', 'RET-NORTE'].map((z) => (
 <span key={z} className="px-2 py-0.5 rounded bg-theme-surface border border-theme-subtle font-bold text-theme-primary">
 {z}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={() => setShowMassiveModal(false)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 onClick={handleExecuteMassive}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir lote</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </div>
 );
};
