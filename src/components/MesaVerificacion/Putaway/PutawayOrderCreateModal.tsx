import React, { useState } from 'react';
import { 
 X, 
 ArrowRightLeft, 
 MapPin, 
 Sparkles, 
 Check, 
 Building2, 
 Layers, 
 Search, 
 AlertCircle,
 Tag
} from 'lucide-react';
import { PendingPutawayUnit, PutawayOrder, PutawayOrderItem } from '../../../data/mockPutawayData';
import { ModalPortal } from '../../common/ModalPortal';

interface PutawayOrderCreateModalProps {
 selectedUnits: PendingPutawayUnit[];
 warehouseName: string;
 warehouseId: string;
 onClose: () => void;
 onCreateOrder: (newOrder: PutawayOrder) => void;
}

// Available rack locations for autocomplete
const VALID_RACK_LOCATIONS = [
 // Bahías de Muestras e Inspección QA
 { code: 'QA-01', aisle: 'Inspección QA', level: 'Bahía 01', desc: 'Muestras de Retención / Pruebas QA' },
 { code: 'QA-02', aisle: 'Inspección QA', level: 'Bahía 02', desc: 'Muestras de Retención / Pruebas QA' },
 { code: 'QA-03', aisle: 'Inspección QA', level: 'Bahía 03', desc: 'Muestras de Retención / Pruebas QA' },
 { code: 'QA-04', aisle: 'Inspección QA', level: 'Bahía 04', desc: 'Muestras de Retención / Pruebas QA' },
 { code: 'QA-05', aisle: 'Inspección QA', level: 'Bahía 05', desc: 'Muestras de Retención / Pruebas QA' },
 { code: 'QA-06', aisle: 'Inspección QA', level: 'Bahía 06', desc: 'Muestras de Retención / Pruebas QA' },
 // Mini Almacén / Reserva Sucursal
 { code: 'SUC-MINI-01', aisle: 'Mini Almacén', level: 'Bahía 01', desc: 'Reserva sucursal' },
 { code: 'SUC-MINI-02', aisle: 'Mini Almacén', level: 'Bahía 02', desc: 'Reserva sucursal' },
 // Pasillos Racks CEDIS / Mini almacén
 { code: 'A-A-01', aisle: 'Pasillo A', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'A-A-02', aisle: 'Pasillo A', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'A-A-03', aisle: 'Pasillo A', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'A-A-04', aisle: 'Pasillo A', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'A-B-01', aisle: 'Pasillo A', level: 'Nivel B (Medio)', desc: 'Rotación estándar' },
 { code: 'A-B-02', aisle: 'Pasillo A', level: 'Nivel B (Medio)', desc: 'Rotación estándar' },
 { code: 'A-B-03', aisle: 'Pasillo A', level: 'Nivel B (Medio)', desc: 'Alta rotación' },
 { code: 'A-B-04', aisle: 'Pasillo A', level: 'Nivel B (Medio)', desc: 'Alta rotación' },
 { code: 'A-C-01', aisle: 'Pasillo A', level: 'Nivel C (Superior)', desc: 'Reserva alta' },
 { code: 'A-C-02', aisle: 'Pasillo A', level: 'Nivel C (Superior)', desc: 'Reserva alta' },
 { code: 'A-C-03', aisle: 'Pasillo A', level: 'Nivel C (Superior)', desc: 'Reserva alta' },
 { code: 'A-C-04', aisle: 'Pasillo A', level: 'Nivel C (Superior)', desc: 'Reserva alta' },
 { code: 'B-A-01', aisle: 'Pasillo B', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'B-A-02', aisle: 'Pasillo B', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'B-B-01', aisle: 'Pasillo B', level: 'Nivel B (Medio)', desc: 'Rotación estándar' },
 { code: 'B-B-02', aisle: 'Pasillo B', level: 'Nivel B (Medio)', desc: 'Rotación estándar' },
 { code: 'B-C-01', aisle: 'Pasillo B', level: 'Nivel C (Superior)', desc: 'Reserva alta' },
 { code: 'C-A-01', aisle: 'Pasillo C', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
 { code: 'C-A-02', aisle: 'Pasillo C', level: 'Nivel A (Piso)', desc: 'Recolección ágil' },
];

export const PutawayOrderCreateModal: React.FC<PutawayOrderCreateModalProps> = ({
 selectedUnits,
 warehouseName,
 warehouseId,
 onClose,
 onCreateOrder,
}) => {
 // Map of unit UID -> custom selected target location
 const [assignedLocations, setAssignedLocations] = useState<Record<string, string>>(() => {
 const initial: Record<string, string> = {};
 selectedUnits.forEach((u) => {
 initial[u.uid] = u.suggestedLocation;
 });
 return initial;
 });

 const [operator, setOperator] = useState('Operador Mesa 01 (Carlos Medina)');
 const [notes, setNotes] = useState('Orden generada desde pool de unidades por acomodar.');

 const handleLocationChange = (uid: string, locationCode: string) => {
 setAssignedLocations((prev) => ({
 ...prev,
 [uid]: locationCode,
 }));
 };

 const handleGenerate = () => {
 const newFolioNum = Math.floor(32 + Math.random() * 60);
 const newFolio = `OA-2026-00${newFolioNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const items: PutawayOrderItem[] = selectedUnits.map((u, idx) => ({
 id: `item-${Date.now()}-${idx}`,
 uid: u.uid,
 sku: u.sku,
 productName: u.productName,
 brand: u.brand,
 size: u.size,
 lotNumber: u.lotNumber,
 sourceLocation: u.sourceLocation,
 targetLocation: assignedLocations[u.uid] || u.suggestedLocation,
 suggestedLocation: u.suggestedLocation,
 status: 'Pendiente',
 }));

 const newOrder: PutawayOrder = {
 id: `oa-${Date.now()}`,
 folio: newFolio,
 warehouseId,
 warehouseName,
 createdAt: dateStr,
 operatorAssigned: operator,
 status: 'Pendiente',
 totalUnits: items.length,
 completedUnits: 0,
 pendingUnits: items.length,
 notes,
 items,
 };

 onCreateOrder(newOrder);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <ArrowRightLeft className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Generar Orden de Acomodo
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {warehouseName} &bull; {selectedUnits.length} unidades seleccionadas
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

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Top Info Banner */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-xs">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instalación Operativa:</span>
 <strong className="text-theme-main font-bold">{warehouseName}</strong>
 </div>
 <div className="text-right">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Total a Acomodar:</span>
 <strong className="text-sm font-mono font-black text-theme-primary">
 {selectedUnits.length} piezas
 </strong>
 </div>
 </div>

 {/* Units and Target Locations Mapping Table */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-main">
 Asignación de Destinos por Unidad:
 </span>
 <span className="text-[10px] text-theme-muted">
 Puedes conservar la sugerencia de slotting o cambiarla
 </span>
 </div>

 <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
 {selectedUnits.map((unit) => {
 const currentDest = assignedLocations[unit.uid] || unit.suggestedLocation;
 const isCustom = currentDest !== unit.suggestedLocation;

 return (
 <div
 key={unit.uid}
 className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 shadow-2xs"
 >
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{unit.uid}</span>
 <span className="font-mono text-[10px] text-theme-muted font-bold">{unit.sku}</span>
 </div>
 <h4 className="text-xs font-bold text-theme-main truncate">{unit.productName}</h4>
 </div>

 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-theme-muted text-theme-main border border-theme-subtle">
 Origen: <strong>{unit.sourceLocation}</strong>
 </span>
 </div>
 </div>

 {/* Location Selector Row */}
 <div className="flex items-center justify-between pt-1 border-t border-theme-subtle gap-3">
 <div className="flex items-center gap-1.5 text-[10px] text-theme-muted">
 <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
 <span>Sugerida: <strong className="text-theme-main font-mono">{unit.suggestedLocation}</strong> ({unit.suggestionReason})</span>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <label className="text-[10px] font-bold text-theme-muted uppercase">
 Destino final:
 </label>
 <select
 value={currentDest}
 onChange={(e) => handleLocationChange(unit.uid, e.target.value)}
 className={`bg-theme-muted border rounded-xl py-1 px-2.5 text-xs font-mono font-bold focus:outline-none cursor-pointer ${
 isCustom ? 'border-theme-primary text-theme-primary' : 'border-theme-subtle text-theme-main'
 }`}
 >
 {VALID_RACK_LOCATIONS.map((loc) => (
 <option key={loc.code} value={loc.code}>
 {loc.code} &bull; {loc.aisle} ({loc.level})
 </option>
 ))}
 </select>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Form Fields: Operator & Notes */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-theme-subtle">
 <div className="space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Operador Asignado:
 </label>
 <select
 value={operator}
 onChange={(e) => setOperator(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Operador Mesa 01 (Carlos Medina)">Operador Mesa 01 (Carlos Medina)</option>
 <option value="Operador Mesa 02 (Luis Garza)">Operador Mesa 02 (Luis Garza)</option>
 <option value="Supervisor Mesa Sur (Eduardo Ruiz)">Supervisor Mesa Sur (Eduardo Ruiz)</option>
 <option value="Asesor Almacén Valle Ote">Asesor Almacén Valle Ote</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Instrucciones / Notas:
 </label>
 <input
 type="text"
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Observaciones para el operador..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-xs text-theme-main focus:outline-none"
 />
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 onClick={handleGenerate}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Generar orden de acomodo ({selectedUnits.length} unidades)</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
