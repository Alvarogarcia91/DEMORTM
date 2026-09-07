import React, { useState, useEffect } from 'react';
import { 
 X, 
 AlertTriangle, 
 Check, 
 Search, 
 MapPin, 
 QrCode, 
 Building2, 
 FileText, 
 Layers 
} from 'lucide-react';
import { 
 OperationalIncident, 
 IncidentPriority, 
 IncidentSource, 
 IncidentType 
} from '../../../data/mockIncidentsData';
import { ModalPortal } from '../../common/ModalPortal';

interface NewIncidentModalProps {
 initialData?: Partial<OperationalIncident>;
 onClose: () => void;
 onCreated: (newIncident: OperationalIncident) => void;
}

const KNOWN_UNITS_DATABASE = [
 { uid: 'TAR-RTM-2026-000184', sku: 'PT-MAN-002', productName: 'Manual Instructivo 48 Páginas Medifarma', brand: 'Black & Decker', size: 'Tarima 18,000 pzas', lotNumber: 'LOTE-2026-W34', location: 'A-B-03', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'TAR-RTM-2026-000185', sku: 'PT-MAN-002', productName: 'Manual Instructivo 48 Páginas Medifarma', brand: 'Black & Decker', size: 'Tarima 18,000 pzas', lotNumber: 'LOTE-2026-W34', location: 'A-B-04', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'TAR-RTM-2026-000101', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Tarima 12,000 pzas', lotNumber: 'LOTE-2026-W31', location: 'A-A-01', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'TAR-RTM-2026-000102', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Tarima 12,000 pzas', lotNumber: 'LOTE-2026-W31', location: 'A-A-02', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'BOB-RTM-2026-000121', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Bobina 2,500 m', lotNumber: 'LOTE-2026-W32', location: 'B-A-01', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'BOB-RTM-2026-000122', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Bobina 2,500 m', lotNumber: 'LOTE-2026-W32', location: 'B-A-02', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'TAR-RTM-2026-000201', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Tarima 8,000 pzas', lotNumber: 'LOTE-2026-W32', location: 'REC-01', wh: 'alm-rtm-mp', whName: 'Almacén Materia Prima' },
 { uid: 'TAR-RTM-2026-000131', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Tarima 10,000 pzas', lotNumber: 'LOTE-2026-W33', location: 'B-A-01', wh: 'alm-rtm-pt', whName: 'Almacén Producto Terminado' },
];

const KNOWN_LOCATIONS = [
 'A-A-01', 'A-A-02', 'A-B-03', 'A-B-04', 'B-A-01', 'B-A-02', 'REC-01', 'REC-02', 'EMB-01', 'EMB-02', 'EMB-03', 'STG-OUT-01', 'SHOW-02', 'RET-NORTE', 'RET-SUR'
];

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
 initialData,
 onClose,
 onCreated,
}) => {
 const [sourceModule, setSourceModule] = useState<IncidentSource>(initialData?.sourceModule || 'Reporte manual');
 const [incidentType, setIncidentType] = useState<IncidentType>(initialData?.incidentType || 'Unidad no localizada');
 const [priority, setPriority] = useState<IncidentPriority>(initialData?.priority || 'Alta');
 const [title, setTitle] = useState(initialData?.title || '');
 const [description, setDescription] = useState(initialData?.description || '');
 
 // Context fields
 const [warehouseId, setWarehouseId] = useState(initialData?.warehouseId || 'alm-rtm-mp');
 const [uidQuery, setUidQuery] = useState(initialData?.uid || '');
 const [sku, setSku] = useState(initialData?.sku || '');
 const [productName, setProductName] = useState(initialData?.productName || '');
 const [brand, setBrand] = useState(initialData?.brand || '');
 const [size, setSize] = useState(initialData?.size || '');
 const [lotNumber, setLotNumber] = useState(initialData?.lotNumber || '');
 const [locationCode, setLocationCode] = useState(initialData?.locationCode || '');
 const [sourceReference, setSourceReference] = useState(initialData?.sourceReference || '');

 // Autocomplete suggestions
 const [showUidSuggestions, setShowUidSuggestions] = useState(false);
 const filteredUidSuggestions = KNOWN_UNITS_DATABASE.filter(
 (u) =>
 !uidQuery ||
 u.uid.toLowerCase().includes(uidQuery.toLowerCase()) ||
 u.sku.toLowerCase().includes(uidQuery.toLowerCase()) ||
 u.productName.toLowerCase().includes(uidQuery.toLowerCase())
 );

 const handleSelectUid = (u: typeof KNOWN_UNITS_DATABASE[0]) => {
 setUidQuery(u.uid);
 setSku(u.sku);
 setProductName(u.productName);
 setBrand(u.brand);
 setSize(u.size);
 setLotNumber(u.lotNumber);
 setLocationCode(u.location);
 setWarehouseId(u.wh);
 setShowUidSuggestions(false);
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!title.trim() || !description.trim()) return;

 const newCodeNum = Math.floor(35 + Math.random() * 20);
 const newCode = `INC-2026-00${newCodeNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026 ${timeStr}`;

 const newIncident: OperationalIncident = {
 id: `inc-${Date.now()}`,
 code: newCode,
 title: title.trim(),
 description: description.trim(),
 incidentType,
 sourceModule,
 priority,
 status: 'Abierta',
 createdAt: dateStr,
 lastActivityAt: dateStr,
 reportedBy: 'Operador Mesa Central',
 warehouseId,
 warehouseName: warehouseId === 'alm-rtm-pt' ? 'Almacén Producto Terminado' : 'Almacén Materia Prima',
 locationCode: locationCode.trim() || undefined,
 uid: uidQuery.trim() || undefined,
 sku: sku.trim() || undefined,
 productName: productName.trim() || undefined,
 brand: brand.trim() || undefined,
 size: size.trim() || undefined,
 lotNumber: lotNumber.trim() || undefined,
 sourceReference: sourceReference.trim() || undefined,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: dateStr,
 actor: 'Operador Mesa Central',
 role: 'Operador',
 message: `Incidencia reportada desde ${sourceModule}.`,
 type: 'created',
 },
 ],
 };

 onCreated(newIncident);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Reportar Nueva Incidencia Operativa
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 Documentación y Seguimiento en Almacén
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
 
 {/* Main Controls Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Origen del Reporte:
 </label>
 <select
 value={sourceModule}
 onChange={(e) => setSourceModule(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Reporte manual">Reporte manual</option>
 <option value="Entrada">Entrada</option>
 <option value="Acomodo">Acomodo</option>
 <option value="Recolección">Recolección</option>
 <option value="Verificación de Salida">Verificación de Salida</option>
 <option value="Conteo">Conteo</option>
 <option value="Inventario">Inventario</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Tipo de Incidencia:
 </label>
 <select
 value={incidentType}
 onChange={(e) => setIncidentType(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Unidad no localizada">Unidad no localizada</option>
 <option value="Unidad incorrecta">Unidad incorrecta</option>
 <option value="Diferencia de cantidad">Diferencia de cantidad</option>
 <option value="Artículo dañado">Artículo dañado</option>
 <option value="Empaque dañado">Empaque dañado</option>
 <option value="QR / etiqueta ilegible">QR / etiqueta ilegible</option>
 <option value="QR / etiqueta faltante">QR / etiqueta faltante</option>
 <option value="Ubicación bloqueada">Ubicación bloqueada</option>
 <option value="Ubicación incorrecta">Ubicación incorrecta</option>
 <option value="Faltante físico">Faltante físico</option>
 <option value="Sobrante físico">Sobrante físico</option>
 <option value="Unidad inesperada">Unidad inesperada</option>
 <option value="Daño operativo">Daño operativo</option>
 <option value="Otro">Otro</option>
 </select>
 </div>

 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Prioridad:
 </label>
 <select
 value={priority}
 onChange={(e) => setPriority(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Baja">Baja</option>
 <option value="Media">Media</option>
 <option value="Alta">Alta</option>
 <option value="Crítica">Crítica</option>
 </select>
 </div>
 </div>

 {/* Title & Description */}
 <div className="space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Resumen de la Incidencia *
 </label>
 <input
 type="text"
 required
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="Ej. Unidad no localizada durante recolección en parada #3"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Descripción Detallada *
 </label>
 <textarea
 rows={3}
 required
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Detalla lo ocurrido, personal involucrado y condiciones físicas del área..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs text-theme-main font-medium focus:outline-none resize-none"
 />
 </div>

 {/* Related Context Section */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-main">
 Contexto Operativo Relacionado (Opcional)
 </span>
 <span className="text-[10px] text-theme-muted">
 Escribe un UID para autocompletar
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {/* UID Autocomplete Input */}
 <div className="relative">
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 UID / Serie:
 </label>
 <div className="relative">
 <input
 type="text"
 value={uidQuery}
 onFocus={() => setShowUidSuggestions(true)}
 onChange={(e) => {
 setUidQuery(e.target.value);
 setShowUidSuggestions(true);
 }}
 placeholder="Buscar TAR-RTM-... / BOB-RTM-..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 text-xs font-mono font-bold text-rose-600 focus:outline-none"
 />
 <QrCode className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-theme-muted pointer-events-none" />
 </div>

 {showUidSuggestions && filteredUidSuggestions.length > 0 && (
 <div className="absolute left-0 right-0 top-full mt-1 bg-theme-surface border border-theme-subtle rounded-2xl shadow-xl z-20 max-h-44 overflow-y-auto p-1.5 space-y-1">
 {filteredUidSuggestions.map((u) => (
 <div
 key={u.uid}
 onClick={() => handleSelectUid(u)}
 className="p-2 rounded-xl hover:bg-theme-muted transition-colors cursor-pointer text-xs space-y-0.5"
 >
 <div className="flex items-center justify-between">
 <strong className="font-mono text-rose-600">{u.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{u.location}</span>
 </div>
 <p className="text-[10px] text-theme-main truncate">{u.productName}</p>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Location Selector */}
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Ubicación:
 </label>
 <input
 type="text"
 list="known-locations"
 value={locationCode}
 onChange={(e) => setLocationCode(e.target.value)}
 placeholder="Ej. A-B-03, REC-01, EMB-03..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 text-xs font-mono font-bold text-theme-main focus:outline-none"
 />
 <datalist id="known-locations">
 {KNOWN_LOCATIONS.map((loc) => (
 <option key={loc} value={loc} />
 ))}
 </datalist>
 </div>

 {/* Article / SKU */}
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Artículo / SKU:
 </label>
 <input
 type="text"
 value={productName ? `${productName} (${sku})` : sku}
 onChange={(e) => setSku(e.target.value)}
 placeholder="SKU del material / producto..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 text-xs font-medium text-theme-main focus:outline-none"
 />
 </div>

 {/* Order Reference */}
 <div>
 <label className="text-[10px] uppercase font-bold text-theme-muted block mb-1">
 Orden / Referencia:
 </label>
 <input
 type="text"
 value={sourceReference}
 onChange={(e) => setSourceReference(e.target.value)}
 placeholder="Ej. OR-2026-0118, REC-2026-0084..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-2 text-xs font-mono font-semibold text-theme-main focus:outline-none"
 />
 </div>
 </div>
 </div>

 {/* Footer inside form */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-between text-xs">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 type="submit"
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Reportar incidencia</span>
 </button>
 </div>
 </form>
 </div>
 </ModalPortal>
 );
};
