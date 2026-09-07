import React, { useState, useMemo, useEffect } from 'react';
import { 
 X, 
 Printer, 
 QrCode, 
 Layers, 
 Trash2, 
 ChevronLeft, 
 ChevronRight, 
 Building2, 
 Check, 
 Plus, 
 RotateCcw, 
 Eye, 
 Sparkles, 
 CheckCircle2, 
 AlertTriangle, 
 Store, 
 Truck, 
 Boxes,
 Flame,
 LayoutGrid,
 FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MOCK_WAREHOUSES_LIST, WarehouseLayout } from '../../data/mockInventoryData';
import { PhysicalLocationMeta } from './LocationQrModal';
import { ModalPortal } from '../common/ModalPortal';

export interface PrintBlock {
 id: string;
 title: string;
 warehouseName: string;
 warehouseCode: string;
 locations: PhysicalLocationMeta[];
}

export type PrintSequenceItem = 
 | { type: 'reference'; block: PrintBlock; index: number }
 | { type: 'location'; location: PhysicalLocationMeta; blockTitle: string; index: number };

interface LocationBatchPrintModalProps {
 isOpen: boolean;
 onClose: () => void;
 initialWarehouseId?: string;
}

const sortNatural = (a: string | number, b: string | number) => 
 String(a).localeCompare(String(b), undefined, { numeric: true });

export const LocationBatchPrintModal: React.FC<LocationBatchPrintModalProps> = ({
 isOpen,
 onClose,
 initialWarehouseId = 'wh-mty-norte',
}) => {
 const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(initialWarehouseId);
 const [mode, setMode] = useState<'COLUMN' | 'LEVEL' | 'MANUAL'>('COLUMN');

 // Active Warehouse
 const selectedWarehouse: WarehouseLayout = useMemo(() => {
 return MOCK_WAREHOUSES_LIST.find(w => w.id === selectedWarehouseId) || MOCK_WAREHOUSES_LIST[0];
 }, [selectedWarehouseId]);

 // Compute all physical locations for this warehouse
 const allWarehouseLocations = useMemo<PhysicalLocationMeta[]>(() => {
 if (!selectedWarehouse) return [];
 const list: PhysicalLocationMeta[] = [];

 // 1. Racks (Levels C, B, A per position)
 selectedWarehouse.aisles.forEach((aisle) => {
 aisle.positions.forEach((pos) => {
 ['C', 'B', 'A'].forEach((lvlCode) => {
 const lvl = pos.levels?.find(l => l.levelCode === lvlCode);
 const locCode = lvl?.locationCode || `${pos.aisle}-${lvlCode}-${pos.positionNumber}`;
 const unitsCount = lvl?.units ? lvl.units.length : (lvl?.count || 0);

 list.push({
 code: locCode,
 name: `Nivel ${lvlCode} (${lvlCode === 'C' ? 'Superior' : lvlCode === 'B' ? 'Medio' : 'Piso'}) · Posición ${pos.positionNumber} · Pasillo ${aisle.aisleCode}`,
 type: selectedWarehouse.type.includes('Sucursal') ? 'SUCURSAL' : 'RACK',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 aisle: aisle.aisleCode,
 level: lvlCode,
 positionNumber: pos.positionNumber,
 capacity: 7,
 currentUnits: unitsCount,
 status: 'Activa · Operativa',
 description: `Posición de rack en ${selectedWarehouse.name} (Pasillo ${aisle.aisleCode}).`,
 });
 });
 });
 });

 // 2. Reception
 selectedWarehouse.receptionAreas.forEach((rec) => {
 list.push({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 description: `Área de recepción y descarga en ${selectedWarehouse.name}.`,
 });
 });

 // 3. Staging / Acomodo / Entrega
 selectedWarehouse.stagingAreas.forEach((stg) => {
 list.push({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 description: `Zona operativa de acomodo / entrega en ${selectedWarehouse.name}.`,
 });
 });

 // 4. Rework / Incidencias
 if (selectedWarehouse.reworkZone) {
 list.push({
 code: selectedWarehouse.reworkZone.code,
 name: selectedWarehouse.reworkZone.name,
 type: 'RETRABAJO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: selectedWarehouse.reworkZone.capacity,
 currentUnits: selectedWarehouse.reworkZone.currentUnits,
 status: selectedWarehouse.reworkZone.status,
 description: `Zona de aislamiento y control de calidad en ${selectedWarehouse.name}.`,
 });
 }

 // 5. Shipping Lanes
 selectedWarehouse.shippingLanes.forEach((lane) => {
 list.push({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 description: `Carril de despacho / entrega en ${selectedWarehouse.name}.`,
 });
 });

 // 6. Showroom Bays (Exhibición Retail)
 if (selectedWarehouse.showroomBays) {
 selectedWarehouse.showroomBays.forEach((bay) => {
 list.push({
 code: bay.code,
 name: `${bay.name} · Showroom`,
 type: 'SHOWROOM',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: 1,
 currentUnits: bay.status === 'Ocupada' && bay.mattress ? 1 : 0,
 status: bay.status === 'Ocupada' ? 'Ocupada · En exhibición' : 'Libre para montaje',
 description: `Bahía de exhibición retail en piso de venta (${selectedWarehouse.name}).`,
 });
 });
 }

 return list;
 }, [selectedWarehouse]);

 // Distinct Aisles & Positions for active warehouse
 const aisles = useMemo(() => {
 const rackLocs = allWarehouseLocations.filter(loc => loc.aisle);
 const unique = Array.from(new Set(rackLocs.map(loc => loc.aisle as string))).sort();
 return unique.length ? unique : ['A'];
 }, [allWarehouseLocations]);

 const [selectedAisle, setSelectedAisle] = useState<string>(aisles[0] || 'A');

 // Keep selectedAisle valid when warehouse changes
 useEffect(() => {
 if (!aisles.includes(selectedAisle)) {
 setSelectedAisle(aisles[0] || 'A');
 }
 }, [aisles, selectedAisle]);

 // Positions available in chosen aisle
 const positionsInAisle = useMemo(() => {
 const matching = allWarehouseLocations.filter(loc => loc.aisle === selectedAisle && loc.positionNumber);
 const unique = Array.from(new Set(matching.map(loc => loc.positionNumber as string))).sort(sortNatural);
 return unique.length ? unique : ['01'];
 }, [allWarehouseLocations, selectedAisle]);

 const [selectedPosition, setSelectedPosition] = useState<string>(positionsInAisle[0] || '01');

 // Keep selectedPosition valid
 useEffect(() => {
 if (!positionsInAisle.includes(selectedPosition)) {
 setSelectedPosition(positionsInAisle[0] || '01');
 }
 }, [positionsInAisle, selectedPosition]);

 // Levels for COLUMN Mode
 const columnLevelsAvailable = useMemo(() => ['C', 'B', 'A'], []);
 const [selectedLevelsForColumn, setSelectedLevelsForColumn] = useState<string[]>(['C', 'B', 'A']);

 // Reset selected levels on column change
 useEffect(() => {
 setSelectedLevelsForColumn(['C', 'B', 'A']);
 }, [selectedAisle, selectedPosition]);

 // Level for LEVEL Mode
 const [selectedLevelForAisle, setSelectedLevelForAisle] = useState<string>('C');
 const [excludedLevelPositionCodes, setExcludedLevelPositionCodes] = useState<string[]>([]);

 // Reset excluded positions on level change
 useEffect(() => {
 setExcludedLevelPositionCodes([]);
 }, [selectedAisle, selectedLevelForAisle]);

 // Manual Mode selection
 const [selectedManualCodes, setSelectedManualCodes] = useState<string[]>([]);

 // Batch Print Blocks
 const [blocks, setBlocks] = useState<PrintBlock[]>([]);
 const [includeReference, setIncludeReference] = useState<boolean>(true);
 const [previewIndex, setPreviewIndex] = useState<number | null>(null);

 // Synchronize initial warehouse when opening modal
 useEffect(() => {
 if (isOpen && initialWarehouseId) {
 setSelectedWarehouseId(initialWarehouseId);
 }
 }, [isOpen, initialWarehouseId]);

 // =========================================================================
 // DRAFT LOCATIONS COMPUTATION
 // =========================================================================
 const draftColumnLocations = useMemo(() => {
 return allWarehouseLocations.filter(loc => 
 loc.aisle === selectedAisle && 
 loc.positionNumber === selectedPosition && 
 loc.level && 
 selectedLevelsForColumn.includes(loc.level)
 ).sort((a, b) => String(b.level).localeCompare(String(a.level))); // C, B, A order
 }, [allWarehouseLocations, selectedAisle, selectedPosition, selectedLevelsForColumn]);

 const draftLevelLocations = useMemo(() => {
 return allWarehouseLocations.filter(loc => 
 loc.aisle === selectedAisle && 
 loc.level === selectedLevelForAisle &&
 !excludedLevelPositionCodes.includes(loc.code)
 ).sort((a, b) => sortNatural(a.positionNumber || '', b.positionNumber || ''));
 }, [allWarehouseLocations, selectedAisle, selectedLevelForAisle, excludedLevelPositionCodes]);

 const draftManualLocations = useMemo(() => {
 return allWarehouseLocations.filter(loc => selectedManualCodes.includes(loc.code));
 }, [allWarehouseLocations, selectedManualCodes]);

 const currentDraftLocations = useMemo(() => {
 if (mode === 'COLUMN') return draftColumnLocations;
 if (mode === 'LEVEL') return draftLevelLocations;
 return draftManualLocations;
 }, [mode, draftColumnLocations, draftLevelLocations, draftManualLocations]);

 const currentDraftTitle = useMemo(() => {
 if (mode === 'COLUMN') return `Pasillo ${selectedAisle} · Posición ${selectedPosition}`;
 if (mode === 'LEVEL') return `Pasillo ${selectedAisle} · Nivel ${selectedLevelForAisle}`;
 return `Selección manual (${draftManualLocations.length} ubicaciones)`;
 }, [mode, selectedAisle, selectedPosition, selectedLevelForAisle, draftManualLocations.length]);

 // Add block to print batch
 const handleAddBlockToBatch = () => {
 if (!currentDraftLocations.length) return;

 const newBlock: PrintBlock = {
 id: `block-${Date.now()}-${blocks.length}`,
 title: currentDraftTitle,
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 locations: [...currentDraftLocations],
 };

 setBlocks(prev => [...prev, newBlock]);

 // If manual mode, clear manual selections after adding
 if (mode === 'MANUAL') {
 setSelectedManualCodes([]);
 }
 };

 // Remove block
 const handleRemoveBlock = (blockId: string) => {
 setBlocks(prev => prev.filter(b => b.id !== blockId));
 };

 // Build total print sequence (References + Labels)
 const printSequence = useMemo<PrintSequenceItem[]>(() => {
 const sequence: PrintSequenceItem[] = [];
 let runningIndex = 0;

 blocks.forEach((block) => {
 if (includeReference) {
 sequence.push({
 type: 'reference',
 block,
 index: runningIndex++,
 });
 }
 block.locations.forEach((loc) => {
 sequence.push({
 type: 'location',
 location: loc,
 blockTitle: block.title,
 index: runningIndex++,
 });
 });
 });

 return sequence;
 }, [blocks, includeReference]);

 const totalLabelsCount = useMemo(() => {
 return blocks.reduce((sum, b) => sum + b.locations.length, 0);
 }, [blocks]);

 // If modal is not open, return null
 if (!isOpen) return null;

 // Helper for QR string payload
 const getQrPayload = (loc: PhysicalLocationMeta) => {
 return `LOC=${loc.code}|SITE=${loc.warehouseCode || 'MTY-N'}|TYPE=${loc.type}`;
 };

 // =========================================================================
 // RENDER: VISTA PREVIA DEL PAQUETE
 // =========================================================================
 if (previewIndex !== null) {
 const currentItem = printSequence[previewIndex] || printSequence[0];

 return (
 <ModalPortal onClose={() => setPreviewIndex(null)}>
 
 {/* Hidden printable sheet for browser window.print() */}
 <style>{`
 @media print {
 body * {
 visibility: hidden !important;
 }
 #batch-location-print-sheet, #batch-location-print-sheet * {
 visibility: visible !important;
 }
 #batch-location-print-sheet {
 position: absolute !important;
 left: 0 !important;
 top: 0 !important;
 width: 100% !important;
 }
 .batch-sticker-item {
 width: 100mm !important;
 min-height: 75mm !important;
 box-sizing: border-box !important;
 padding: 5mm !important;
 page-break-after: always !important;
 break-after: page !important;
 border: 2px solid #000 !important;
 margin: 0 auto 10mm auto !important;
 background: #fff !important;
 color: #000 !important;
 }
 }
 `}</style>

 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-bold text-sm">
 <Eye className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-black text-theme-main">
 Vista Previa del Paquete de Impresión
 </h2>
 <p className="text-[11px] text-theme-muted font-mono">
 {selectedWarehouse.name} &bull; Elemento {previewIndex + 1} de {printSequence.length} ({totalLabelsCount} stickers)
 </p>
 </div>
 </div>

 <button
 onClick={() => setPreviewIndex(null)}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body Preview */}
 <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 p-6 overflow-y-auto flex-1 text-xs">
 
 {/* Center: The Sticker Display */}
 <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-900/50 border border-theme-subtle min-h-[340px]">
 
 {/* Reference Card Sticker */}
 {currentItem?.type === 'reference' ? (
 <div className="w-full max-w-[380px] bg-white text-black p-6 rounded-2xl border-2 border-dashed border-black shadow-xl space-y-4 font-sans text-center">
 <div className="border-b-2 border-black pb-2 flex items-center justify-between">
 <span className="text-[11px] font-black uppercase tracking-widest text-zinc-700">
 IMPRESOS RTM
 </span>
 <span className="text-[9px] font-mono font-bold bg-white text-zinc-900 border border-zinc-400 px-2 py-0.5 rounded">
 HOJA DE SEPARACIÓN
 </span>
 </div>

 <div className="py-2">
 <span className="text-[10px] uppercase font-bold text-zinc-600 block">
 PAQUETE / BLOQUE DE RACK
 </span>
 <h3 className="text-2xl font-black font-mono text-black mt-1">
 {currentItem.block.title}
 </h3>
 <p className="text-xs font-bold text-zinc-700 mt-1">
 {currentItem.block.warehouseName}
 </p>
 </div>

 <div className="p-3 bg-zinc-100 rounded-xl border border-black text-left font-mono text-[11px] space-y-1">
 <span className="text-[9px] uppercase font-extrabold text-zinc-500 block">
 Ubicaciones incluidas en este bloque ({currentItem.block.locations.length}):
 </span>
 <div className="flex flex-wrap gap-1.5 pt-1">
 {currentItem.block.locations.map(loc => (
 <span key={loc.code} className="px-2 py-0.5 bg-white border border-zinc-400 rounded font-black text-black text-[10px]">
 {loc.code}
 </span>
 ))}
 </div>
 </div>

 <div className="text-[9px] font-bold text-zinc-500 pt-2 border-t border-zinc-300">
 Colocar esta hoja al frente del lote para entrega al operador montacarguista
 </div>
 </div>
 ) : (
 /* Actual Physical Location Label */
 <div className="w-full max-w-[390px] bg-white text-black p-5 rounded-2xl border-2 border-black shadow-xl space-y-3 font-sans">
 
 {/* Top Brand & Facility Header */}
 <div className="flex items-center justify-between border-b-2 border-black pb-2">
 <div>
 <span className="text-[12px] font-black tracking-tight uppercase text-black block">
 Impresos RTM
 </span>
 <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-600 block">
 Identificación de Espacio Físico
 </span>
 </div>

 <div className="text-right">
 <span className="text-[10px] font-black uppercase text-black block truncate max-w-[130px]">
 {currentItem?.location.warehouseName}
 </span>
 <span className="text-[9px] font-mono font-bold text-zinc-600">
 {currentItem?.location.warehouseCode || 'MTY-N'} &bull; {currentItem?.location.type}
 </span>
 </div>
 </div>

 {/* Giant Location Code Header */}
 <div className="text-center py-1 bg-zinc-100 rounded-lg border border-black">
 <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-600 block">
 Código de Ubicación
 </span>
 <h1 className="text-3xl font-black font-mono tracking-wider text-black">
 {currentItem?.location.code}
 </h1>
 </div>

 {/* Middle Section: Big Industrial QR + Detailed Hierarchy */}
 <div className="flex items-center justify-between gap-3 pt-1">
 <div className="p-1.5 border-2 border-black rounded-xl bg-white shrink-0">
 <QRCodeSVG
 value={getQrPayload(currentItem?.location)}
 size={115}
 level="H"
 includeMargin={false}
 />
 </div>

 <div className="flex-1 space-y-1 text-left font-mono">
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Espacio Operativo</span>
 <strong className="text-[10px] font-black text-black leading-tight block truncate">
 {currentItem?.location.name}
 </strong>
 </div>

 {currentItem?.location.aisle && (
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Pasillo & Posición</span>
 <strong className="text-[10px] font-black text-black block">
 {currentItem?.location.aisle} &middot; Pos {currentItem?.location.positionNumber || '01'}
 </strong>
 </div>
 )}

 {currentItem?.location.level && (
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Nivel Físico</span>
 <strong className="text-[10px] font-black text-black block">
 Nivel {currentItem?.location.level} ({currentItem?.location.level === 'C' ? 'Superior' : currentItem?.location.level === 'B' ? 'Medio' : 'Piso'})
 </strong>
 </div>
 )}

 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Tipo / Zona</span>
 <strong className="text-[10px] font-black text-black block">
 {currentItem?.location.type === 'SHOWROOM' ? 'Showroom Retail' : currentItem?.location.type === 'EMBARQUE' ? 'Carril de Entrega' : currentItem?.location.type}
 </strong>
 </div>
 </div>
 </div>

 {/* Bottom Bar */}
 <div className="pt-2 border-t-2 border-black flex items-center justify-between text-[8px] font-bold">
 <span className="truncate">
 ESCANEAR PARA VALIDAR ACOMODO / RECOLECCIÓN
 </span>
 <span className="font-mono text-zinc-700 shrink-0 ml-1">
 REV: 2026-W34
 </span>
 </div>
 </div>
 )}
 </div>

 {/* Right: Package Summary & Navigation Index */}
 <aside className="p-4 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-4 flex flex-col justify-between">
 <div className="space-y-3">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Estructura del Paquete
 </span>

 <div className="space-y-2">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle">
 <span className="text-[10px] text-theme-muted block">Bloques configurados</span>
 <strong className="text-sm font-mono font-black text-theme-main">{blocks.length} columnas / áreas</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle">
 <span className="text-[10px] text-theme-muted block">Etiquetas físicas (QRs)</span>
 <strong className="text-sm font-mono font-black text-purple-600">{totalLabelsCount} stickers</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle">
 <span className="text-[10px] text-theme-muted block">Hojas de referencia</span>
 <strong className="text-sm font-mono font-black text-theme-main">
 {includeReference ? `${blocks.length} separadores` : 'Ninguna'}
 </strong>
 </div>
 </div>

 {/* List of elements in sequence */}
 <div className="space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">
 Índice de impresión:
 </span>
 <div className="max-h-[140px] overflow-y-auto space-y-1 font-mono text-[10px]">
 {printSequence.map((item, idx) => (
 <button
 key={idx}
 onClick={() => setPreviewIndex(idx)}
 className={`w-full text-left px-2 py-1 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
 previewIndex === idx
 ? 'bg-purple-600 text-white font-bold'
 : 'hover:bg-theme-muted text-theme-muted hover:text-theme-main'
 }`}
 >
 <span className="truncate">
 {idx + 1}. {item.type === 'reference' ? `[REF] ${item.block.title}` : item.location.code}
 </span>
 <span className="text-[9px] opacity-75 shrink-0 ml-1">
 {item.type === 'reference' ? 'Separador' : item.location.type}
 </span>
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="pt-2 border-t border-theme-subtle">
 <span className="text-[10px] text-theme-muted block text-center">
 Formato estándar Zebra 100mm &times; 75mm
 </span>
 </div>
 </aside>
 </div>

 {/* Footer Controls */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={() => setPreviewIndex(prev => Math.max(0, (prev || 0) - 1))}
 disabled={previewIndex === 0}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border border-theme-subtle"
 >
 <ChevronLeft className="w-4 h-4" />
 <span>Anterior</span>
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setPreviewIndex(null)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Volver a configuración
 </button>

 <button
 onClick={() => window.print()}
 className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir paquete ({printSequence.length} hojas)</span>
 </button>
 </div>

 <button
 onClick={() => setPreviewIndex(prev => Math.min(printSequence.length - 1, (prev || 0) + 1))}
 disabled={previewIndex >= printSequence.length - 1}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer border border-theme-subtle"
 >
 <span>Siguiente</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Global Print Sheet Element */}
 <div id="batch-location-print-sheet" className="hidden">
 {printSequence.map((item, idx) => (
 <div key={idx} className="batch-sticker-item">
 {item.type === 'reference' ? (
 <div style={{ textAlign: 'center', padding: '10px' }}>
 <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>IMPRESOS RTM - PAQUETE DE IMPRESIÓN</h2>
 <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '10px 0' }}>{item.block.title}</h1>
 <p style={{ fontSize: '12px', color: '#555' }}>{item.block.warehouseName} &bull; {item.block.locations.length} etiquetas</p>
 <p style={{ fontSize: '11px', marginTop: '10px' }}>{item.block.locations.map(l => l.code).join(' &bull; ')}</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '4px' }}>
 <span style={{ fontWeight: '900', fontSize: '12px' }}>IMPRESOS RTM</span>
 <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{item.location.warehouseName}</span>
 </div>
 <div style={{ textAlign: 'center', background: '#eee', padding: '4px', border: '1px solid #000' }}>
 <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace' }}>{item.location.code}</span>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
 <QRCodeSVG value={getQrPayload(item.location)} size={110} level="H" />
 <div style={{ fontSize: '10px', fontFamily: 'monospace', lineHeight: '1.4' }}>
 <strong>{item.location.name}</strong><br />
 {item.location.aisle && <span>Pasillo {item.location.aisle} &bull; Pos {item.location.positionNumber}<br /></span>}
 {item.location.level && <span>Nivel {item.location.level}<br /></span>}
 <span>Tipo: {item.location.type}</span>
 </div>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </ModalPortal>
 );
 }

 // =========================================================================
 // RENDER: MODAL PRINCIPAL DE CONFIGURACIÓN DE IMPRESIÓN MASIVA
 // =========================================================================
 return (
 <ModalPortal isOpen={isOpen} onClose={onClose}>
 <div className="w-full max-w-6xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Printer className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <h2 className="text-sm font-extrabold text-theme-main">
 Imprimir QRs de Ubicaciones Físicas
 </h2>
 <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
 Impresión por Lotes
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Genera paquetes de etiquetas para columnas de rack, niveles completos o áreas operativas de CEDIS y Sucursales.
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* 2-Column Workspace */}
 <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] flex-1 overflow-y-auto">
 
 {/* Left Column: Mode Selector & Location Filtering */}
 <div className="p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-theme-subtle">
 
 {/* Warehouse & Mode Selection Form */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Warehouse Selector */}
 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Almacén / Sucursal
 </label>
 <select
 value={selectedWarehouseId}
 onChange={(e) => setSelectedWarehouseId(e.target.value)}
 className="w-full px-3 py-2 rounded-xl bg-theme-muted border border-theme-subtle text-xs font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-purple-500/30"
 >
 {MOCK_WAREHOUSES_LIST.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name} ({wh.code})
 </option>
 ))}
 </select>
 </div>

 {/* Mode Selector */}
 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Modo de Impresión
 </label>
 <div className="grid grid-cols-3 gap-1 bg-theme-muted/70 p-1 rounded-xl border border-theme-subtle">
 <button
 type="button"
 onClick={() => setMode('COLUMN')}
 className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
 mode === 'COLUMN'
 ? 'bg-purple-600 text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Por columna
 </button>
 <button
 type="button"
 onClick={() => setMode('LEVEL')}
 className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
 mode === 'LEVEL'
 ? 'bg-purple-600 text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Por nivel
 </button>
 <button
 type="button"
 onClick={() => setMode('MANUAL')}
 className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
 mode === 'MANUAL'
 ? 'bg-purple-600 text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Manual
 </button>
 </div>
 </div>
 </div>

 {/* ============================================================= */}
 {/* MODO 1: POR COLUMNA (DEFAULT & PRINCIPAL) */}
 {/* ============================================================= */}
 {mode === 'COLUMN' && (
 <div className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-purple-600" />
 <h4 className="text-xs font-extrabold text-theme-main">
 Selección de Columna Física de Rack
 </h4>
 </div>
 <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
 Pasillo {selectedAisle} &middot; Posición {selectedPosition}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-3">
 {/* Select Pasillo */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted">Pasillo</label>
 <select
 value={selectedAisle}
 onChange={(e) => setSelectedAisle(e.target.value)}
 className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-bold text-theme-main"
 >
 {aisles.map(a => (
 <option key={a} value={a}>Pasillo {a}</option>
 ))}
 </select>
 </div>

 {/* Select Posición */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted">Posición / Columna</label>
 <select
 value={selectedPosition}
 onChange={(e) => setSelectedPosition(e.target.value)}
 className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-bold text-theme-main font-mono"
 >
 {positionsInAisle.map(p => (
 <option key={p} value={p}>Posición {p}</option>
 ))}
 </select>
 </div>
 </div>

 {/* Preview de Niveles Encontrados */}
 <div className="space-y-2 pt-2 border-t border-theme-subtle">
 <div className="flex items-center justify-between text-[11px]">
 <span className="font-bold text-theme-main">
 {draftColumnLocations.length} ubicaciones físicas encontradas en esta columna:
 </span>
 <span className="text-[10px] text-theme-muted">
 Niveles C, B y A
 </span>
 </div>

 <div className="space-y-1.5">
 {columnLevelsAvailable.map((lvl) => {
 const matchingLoc = allWarehouseLocations.find(l => 
 l.aisle === selectedAisle && 
 l.positionNumber === selectedPosition && 
 l.level === lvl
 );
 const isChecked = selectedLevelsForColumn.includes(lvl);

 return (
 <label
 key={lvl}
 className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
 isChecked
 ? 'bg-theme-surface border-purple-500/40 text-theme-main shadow-xs'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted opacity-60'
 }`}
 >
 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 checked={isChecked}
 onChange={() => {
 setSelectedLevelsForColumn(prev => 
 prev.includes(lvl) ? prev.filter(x => x !== lvl) : [...prev, lvl]
 );
 }}
 className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
 />
 <div>
 <strong className="font-mono text-xs font-black text-theme-main block">
 {matchingLoc?.code || `${selectedAisle}-${lvl}-${selectedPosition}`}
 </strong>
 <span className="text-[10px] text-theme-muted">
 Nivel {lvl} ({lvl === 'C' ? 'Superior' : lvl === 'B' ? 'Medio' : 'Piso'}) &middot; Capacidad: 7 colchones
 </span>
 </div>
 </div>

 <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
 lvl === 'C' ? 'bg-purple-500/10 text-purple-700 border-purple-500/20' :
 lvl === 'B' ? 'bg-blue-500/10 text-blue-700 border-blue-500/20' :
 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
 }`}>
 Nivel {lvl}
 </span>
 </label>
 );
 })}
 </div>
 </div>

 {/* Add to Batch Button */}
 <button
 type="button"
 onClick={handleAddBlockToBatch}
 disabled={!draftColumnLocations.length}
 className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar columna al paquete ({draftColumnLocations.length} etiquetas)</span>
 </button>
 </div>
 )}

 {/* ============================================================= */}
 {/* MODO 2: POR NIVEL COMPLETO */}
 {/* ============================================================= */}
 {mode === 'LEVEL' && (
 <div className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Boxes className="w-4 h-4 text-purple-600" />
 <h4 className="text-xs font-extrabold text-theme-main">
 Impresión por Nivel Horizontal del Pasillo
 </h4>
 </div>
 <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
 Pasillo {selectedAisle} &middot; Nivel {selectedLevelForAisle}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted">Pasillo</label>
 <select
 value={selectedAisle}
 onChange={(e) => setSelectedAisle(e.target.value)}
 className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-bold text-theme-main"
 >
 {aisles.map(a => (
 <option key={a} value={a}>Pasillo {a}</option>
 ))}
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted">Nivel Físico</label>
 <select
 value={selectedLevelForAisle}
 onChange={(e) => setSelectedLevelForAisle(e.target.value)}
 className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-bold text-theme-main font-mono"
 >
 <option value="C">Nivel C (Superior)</option>
 <option value="B">Nivel B (Medio)</option>
 <option value="A">Nivel A (Piso)</option>
 </select>
 </div>
 </div>

 {/* Positions list for this level */}
 <div className="space-y-2 pt-2 border-t border-theme-subtle">
 <span className="font-bold text-theme-main text-[11px] block">
 Posiciones disponibles en este nivel ({draftLevelLocations.length} activas):
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1">
 {allWarehouseLocations
 .filter(l => l.aisle === selectedAisle && l.level === selectedLevelForAisle)
 .map(loc => {
 const isIncluded = !excludedLevelPositionCodes.includes(loc.code);
 return (
 <button
 key={loc.code}
 type="button"
 onClick={() => {
 setExcludedLevelPositionCodes(prev => 
 isIncluded ? [...prev, loc.code] : prev.filter(c => c !== loc.code)
 );
 }}
 className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
 isIncluded
 ? 'bg-theme-surface border-purple-500/40 text-theme-main shadow-xs'
 : 'bg-theme-muted/30 border-theme-subtle text-theme-muted opacity-50'
 }`}
 >
 <span className="font-mono text-xs font-black block">{loc.code}</span>
 <span className="text-[9px] text-theme-muted">Pos {loc.positionNumber}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Add Level to Batch */}
 <button
 type="button"
 onClick={handleAddBlockToBatch}
 disabled={!draftLevelLocations.length}
 className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar nivel al paquete ({draftLevelLocations.length} etiquetas)</span>
 </button>
 </div>
 )}

 {/* ============================================================= */}
 {/* MODO 3: SELECCIÓN MANUAL & ZONAS ESPECIALES (SHOWROOM, ETC.) */}
 {/* ============================================================= */}
 {mode === 'MANUAL' && (
 <div className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <LayoutGrid className="w-4 h-4 text-purple-600" />
 <h4 className="text-xs font-extrabold text-theme-main">
 Selección Manual de Ubicaciones
 </h4>
 </div>
 <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
 {selectedManualCodes.length} seleccionadas
 </span>
 </div>

 {/* Racks filter by aisle */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-[10px]">
 <span className="font-bold text-theme-muted uppercase">Posiciones de Rack (Pasillo {selectedAisle})</span>
 <select
 value={selectedAisle}
 onChange={(e) => setSelectedAisle(e.target.value)}
 className="px-2 py-1 rounded-lg bg-theme-surface border border-theme-subtle text-[10px] font-bold"
 >
 {aisles.map(a => <option key={a} value={a}>Pasillo {a}</option>)}
 </select>
 </div>

 <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto p-1">
 {allWarehouseLocations
 .filter(l => l.aisle === selectedAisle)
 .map(loc => {
 const isSelected = selectedManualCodes.includes(loc.code);
 return (
 <button
 key={loc.code}
 type="button"
 onClick={() => {
 setSelectedManualCodes(prev => 
 isSelected ? prev.filter(c => c !== loc.code) : [...prev, loc.code]
 );
 }}
 className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
 isSelected
 ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
 : 'bg-theme-surface border-theme-subtle text-theme-main hover:bg-theme-muted'
 }`}
 >
 <span className="font-mono text-[11px] block">{loc.code}</span>
 <span className="text-[8px] opacity-75">{loc.level ? `Nivel ${loc.level}` : loc.type}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Special Zones (Showroom, Shipping lanes, Reception, Rework) */}
 <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
 <span className="text-[10px] font-bold text-theme-muted uppercase block">
 Zonas Especiales & Showroom ({selectedWarehouse.name})
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
 {allWarehouseLocations
 .filter(l => !l.aisle)
 .map(loc => {
 const isSelected = selectedManualCodes.includes(loc.code);
 return (
 <button
 key={loc.code}
 type="button"
 onClick={() => {
 setSelectedManualCodes(prev => 
 isSelected ? prev.filter(c => c !== loc.code) : [...prev, loc.code]
 );
 }}
 className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
 isSelected
 ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
 : 'bg-theme-surface border-theme-subtle text-theme-main hover:bg-theme-muted'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black">{loc.code}</span>
 <span className="text-[9px] opacity-80">{loc.type}</span>
 </div>
 <span className="text-[10px] block truncate mt-0.5">{loc.name}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Add Manual to Batch */}
 <button
 type="button"
 onClick={handleAddBlockToBatch}
 disabled={!draftManualLocations.length}
 className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar selección manual ({draftManualLocations.length} etiquetas)</span>
 </button>
 </div>
 )}
 </div>

 {/* Right Column: Batch Builder / Paquete de Impresión */}
 <aside className="p-6 bg-theme-muted/30 flex flex-col justify-between space-y-4">
 
 <div className="space-y-4">
 
 {/* Batch Header */}
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div>
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <span>Paquete de Impresión</span>
 <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono text-[10px]">
 {totalLabelsCount} stickers
 </span>
 </h3>
 <span className="text-[10px] text-theme-muted">
 Lotes listos para mandar a cola de impresión térmica
 </span>
 </div>

 {blocks.length > 0 && (
 <button
 type="button"
 onClick={() => setBlocks([])}
 className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
 >
 Vaciar paquete
 </button>
 )}
 </div>

 {/* Checkbox Reference Sheet Option */}
 <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer">
 <div className="flex items-center gap-2.5">
 <input
 type="checkbox"
 checked={includeReference}
 onChange={(e) => setIncludeReference(e.target.checked)}
 className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
 />
 <div>
 <span className="text-xs font-bold text-theme-main block">
 Incluir hoja de referencia por columna
 </span>
 <span className="text-[10px] text-theme-muted block">
 Imprime un separador resumen antes de cada bloque de rack
 </span>
 </div>
 </div>

 <FileText className="w-4 h-4 text-purple-600 shrink-0" />
 </label>

 {/* List of Added Blocks */}
 <div className="space-y-2 max-h-[340px] overflow-y-auto">
 {blocks.length > 0 ? (
 blocks.map((block, index) => (
 <div
 key={block.id}
 className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/30 transition-all flex items-start justify-between gap-3 shadow-xs"
 >
 <div className="space-y-1 flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
 {index + 1}
 </span>
 <strong className="text-xs font-bold text-theme-main truncate block">
 {block.title}
 </strong>
 </div>

 <div className="flex flex-wrap gap-1 pt-1 font-mono text-[9px]">
 {block.locations.map(loc => (
 <span key={loc.code} className="px-1.5 py-0.2 rounded bg-theme-muted text-theme-main font-bold border border-theme-subtle">
 {loc.code}
 </span>
 ))}
 </div>

 <span className="text-[10px] text-theme-muted block pt-0.5">
 {block.warehouseName} &bull; {block.locations.length} etiquetas
 </span>
 </div>

 <button
 type="button"
 onClick={() => handleRemoveBlock(block.id)}
 className="p-1.5 text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
 title="Quitar este bloque"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 ))
 ) : (
 <div className="p-8 rounded-3xl border-2 border-dashed border-theme-subtle text-center space-y-2">
 <div className="w-10 h-10 rounded-2xl bg-theme-muted text-theme-muted flex items-center justify-center mx-auto">
 <Printer className="w-5 h-5" />
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 El paquete está vacío
 </strong>
 <p className="text-[11px] text-theme-muted leading-relaxed max-w-[240px] mx-auto">
 Selecciona una columna o nivel a la izquierda y pulsa <strong>"Agregar al paquete"</strong> para acumular etiquetas.
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Bottom Actions */}
 <div className="pt-4 border-t border-theme-subtle space-y-3">
 <div className="flex items-center justify-between text-xs font-bold text-theme-main">
 <span>Total en cola:</span>
 <span className="font-mono text-sm text-purple-700 dark:text-purple-300">
 {totalLabelsCount} stickers {includeReference && blocks.length > 0 && `(+${blocks.length} ref)`}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setPreviewIndex(0)}
 disabled={!printSequence.length}
 className="py-2.5 px-3 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs transition-colors border border-theme-subtle flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Eye className="w-4 h-4" />
 <span>Vista previa</span>
 </button>

 <button
 type="button"
 onClick={() => setPreviewIndex(0)}
 disabled={!printSequence.length}
 className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir ({totalLabelsCount})</span>
 </button>
 </div>
 </div>
 </aside>
 </div>

 {/* Modal Bottom Bar */}
 <div className="px-6 py-3 border-t border-theme-subtle bg-theme-muted/20 flex items-center justify-between text-xs">
 <span className="text-[11px] text-theme-muted font-mono">
 Integrado con catálogo unificado de ubicaciones físicas y terminales RF
 </span>

 <button
 type="button"
 onClick={onClose}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
