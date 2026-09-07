import React, { useState } from 'react';
import { 
 X, 
 RotateCcw, 
 Search, 
 Check, 
 AlertTriangle, 
 QrCode, 
 Trash2, 
 Plus, 
 Building2, 
 Tag 
} from 'lucide-react';
import { 
 ReturnOrder, 
 ReturnSourceType, 
 ReturnReason, 
 ReturnItemRecord, 
 ELIGIBLE_RETURN_UNITS_DATABASE 
} from '../../../data/mockReturnsData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReturnCreateModalProps {
 onClose: () => void;
 onCreateOrder: (order: ReturnOrder) => void;
}

export const ReturnCreateModal: React.FC<ReturnCreateModalProps> = ({
 onClose,
 onCreateOrder,
}) => {
 const [sourceType, setSourceType] = useState<ReturnSourceType>('Cliente');
 const [warehouseId, setWarehouseId] = useState('wh-mty-norte');
 const [originClientOrBranch, setOriginClientOrBranch] = useState('Cliente Final (Ruta Domiciliaria)');
 const [reference, setReference] = useState('PED-2026-0195');
 const [reason, setReason] = useState<ReturnReason>('Empaque dañado');
 const [customReason, setCustomReason] = useState('');
 const [notes, setNotes] = useState('Cliente rechazó entrega por daño en empaque plástico.');

 // Unit Search & Selected Units
 const [unitSearch, setUnitSearch] = useState('');
 const [showUnitDropdown, setShowUnitDropdown] = useState(false);
 const [selectedUnits, setSelectedUnits] = useState<typeof ELIGIBLE_RETURN_UNITS_DATABASE>([
 ELIGIBLE_RETURN_UNITS_DATABASE[0],
 ]);

 const filteredCandidates = ELIGIBLE_RETURN_UNITS_DATABASE.filter(
 (u) =>
 !selectedUnits.some((su) => su.uid === u.uid) &&
 (!unitSearch ||
 u.uid.toLowerCase().includes(unitSearch.toLowerCase()) ||
 u.sku.toLowerCase().includes(unitSearch.toLowerCase()) ||
 u.productName.toLowerCase().includes(unitSearch.toLowerCase()))
 );

 const handleAddUnit = (u: typeof ELIGIBLE_RETURN_UNITS_DATABASE[0]) => {
 setSelectedUnits((prev) => [...prev, u]);
 setUnitSearch('');
 setShowUnitDropdown(false);
 };

 const handleRemoveUnit = (uid: string) => {
 setSelectedUnits((prev) => prev.filter((u) => u.uid !== uid));
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (selectedUnits.length === 0) return;

 const newCodeNum = Math.floor(23 + Math.random() * 20);
 const newFolio = `DEV-2026-00${newCodeNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const items: ReturnItemRecord[] = selectedUnits.map((u, idx) => ({
 id: `ri-${Date.now()}-${idx}`,
 uid: u.uid,
 sku: u.sku,
 productName: u.productName,
 brand: u.brand,
 size: u.size,
 lotNumber: u.lotNumber,
 originalEntryDate: u.originalEntryDate,
 suggestedDestination: reason === 'Empaque dañado' || reason === 'Daño visible' ? 'RET-NORTE' : 'REC-DEV-01',
 status: 'Pendiente',
 }));

 const newOrder: ReturnOrder = {
 id: `ret-${Date.now()}`,
 folio: newFolio,
 sourceType,
 reference: reference.trim(),
 originClientOrBranch: originClientOrBranch.trim(),
 warehouseId,
 warehouseName: warehouseId === 'wh-mty-sur' ? 'CEDIS Monterrey Sur' : 'CEDIS Monterrey Norte',
 reason,
 customReason: reason === 'Otro' ? customReason.trim() : undefined,
 notes: notes.trim(),
 createdAt: dateStr,
 status: 'Pendiente',
 items,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: dateStr,
 actor: 'Operador Mesa de Devoluciones',
 message: `Solicitud de devolución creada desde ${sourceType}.`,
 type: 'created',
 },
 ],
 };

 onCreateOrder(newOrder);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <RotateCcw className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Nueva Solicitud de Devolución
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 Recepción y Trazabilidad Inversa de Unidades Serializadas
 </span>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Form Body */}
 <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
 
 {/* Controls Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Tipo de Origen:
 </label>
 <select
 value={sourceType}
 onChange={(e) => setSourceType(e.target.value as ReturnSourceType)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Cliente">Cliente</option>
 <option value="Sucursal">Sucursal</option>
 <option value="Entrega rechazada">Entrega rechazada</option>
 <option value="Interna">Interna</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Almacén Destino:
 </label>
 <select
 value={warehouseId}
 onChange={(e) => setWarehouseId(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="wh-mty-norte">CEDIS Monterrey Norte</option>
 <option value="wh-mty-sur">CEDIS Monterrey Sur</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Motivo de Devolución:
 </label>
 <select
 value={reason}
 onChange={(e) => setReason(e.target.value as ReturnReason)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Empaque dañado">Empaque dañado</option>
 <option value="Daño visible">Daño visible</option>
 <option value="Producto incorrecto">Producto incorrecto</option>
 <option value="Entrega rechazada">Entrega rechazada</option>
 <option value="Cambio solicitado">Cambio solicitado</option>
 <option value="Error operativo">Error operativo</option>
 <option value="Otro">Otro</option>
 </select>
 </div>
 </div>

 {/* Reference & Origin Name */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Referencia de Origen (Pedido / Traspaso):
 </label>
 <input
 type="text"
 required
 value={reference}
 onChange={(e) => setReference(e.target.value)}
 placeholder="Ej. PED-2026-0195 o OTP-2026-0041"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-mono font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Cliente o Sucursal Emisora:
 </label>
 <input
 type="text"
 required
 value={originClientOrBranch}
 onChange={(e) => setOriginClientOrBranch(e.target.value)}
 placeholder="Ej. Cliente Final o Sucursal Valle Oriente"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-semibold text-theme-main focus:outline-none"
 />
 </div>
 </div>

 {/* Unit Autocomplete Selector */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-main">
 Unidades Físicas a Devolver ({selectedUnits.length})
 </span>
 <span className="text-[10px] text-theme-muted">
 Solo unidades elegibles que salieron a ruta/sucursal
 </span>
 </div>

 {/* Search input for units */}
 <div className="relative">
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={unitSearch}
 onFocus={() => setShowUnitDropdown(true)}
 onChange={(e) => {
 setUnitSearch(e.target.value);
 setShowUnitDropdown(true);
 }}
 placeholder="Buscar y agregar UID elegible (SC-UID-...)..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl pl-9 pr-4 py-2.5 text-xs text-theme-main font-semibold focus:outline-none shadow-2xs"
 />
 </div>

 {/* Autocomplete Dropdown */}
 {showUnitDropdown && filteredCandidates.length > 0 && (
 <div className="absolute left-0 right-0 top-full mt-1 bg-theme-surface border border-theme-subtle rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 space-y-1">
 {filteredCandidates.map((u) => (
 <div
 key={u.uid}
 onClick={() => handleAddUnit(u)}
 className="p-2 rounded-xl hover:bg-theme-muted transition-colors cursor-pointer text-xs space-y-0.5"
 >
 <div className="flex items-center justify-between">
 <strong className="font-mono text-rose-600">{u.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{u.lastKnownDestination}</span>
 </div>
 <p className="text-[10px] text-theme-main truncate">{u.productName}</p>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Selected Units List */}
 <div className="space-y-2 max-h-40 overflow-y-auto">
 {selectedUnits.map((u) => (
 <div
 key={u.uid}
 className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle flex items-center justify-between gap-2 shadow-2xs"
 >
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono font-bold text-rose-600 text-xs">{u.uid}</span>
 <span className="text-[10px] text-theme-muted font-mono">Ingreso original: {u.originalEntryDate}</span>
 </div>
 <p className="text-[11px] text-theme-main font-medium truncate max-w-sm">
 {u.productName} ({u.sku})
 </p>
 </div>

 <button
 type="button"
 onClick={() => handleRemoveUnit(u.uid)}
 className="p-1.5 rounded-lg text-theme-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
 title="Quitar unidad"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Notes */}
 <div className="space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Observaciones de Recepción:
 </label>
 <textarea
 rows={2}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Detalla las condiciones reportadas por el chofer o cliente..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs text-theme-main font-medium focus:outline-none resize-none"
 />
 </div>

 {/* Footer */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-between">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 type="submit"
 disabled={selectedUnits.length === 0}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 <Check className="w-4 h-4" />
 <span>Generar solicitud de devolución</span>
 </button>
 </div>
 </form>
 </div>
 </ModalPortal>
 );
};
