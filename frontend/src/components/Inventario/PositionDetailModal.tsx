import React, { useState } from 'react';
import { 
 X, 
 Layers, 
 QrCode, 
 Calendar, 
 Clock, 
 Package, 
 CheckCircle2, 
 ShieldAlert, 
 Printer, 
 Eye, 
 Building2, 
 Boxes,
 MapPin,
 ChevronRight,
 ArrowLeft,
 ChevronLeft,
 Info
} from 'lucide-react';
import { PositionRack, PositionSerializedItem, LevelItem } from '../../data/mockInventoryData';
import { LocationQrModal, PhysicalLocationMeta } from './LocationQrModal';
import { PrintLocationQrModal } from './PrintLocationQrModal';
import { ModalPortal } from '../common/ModalPortal';

// Centralized Level Configuration (Niveles C, B, A sin capacidades fijas)
export const LEVEL_CONFIG = {
 C: { code: 'C' as const, name: 'Nivel C · Superior', label: 'Superior' },
 B: { code: 'B' as const, name: 'Nivel B · Medio', label: 'Medio' },
 A: { code: 'A' as const, name: 'Nivel A · Piso', label: 'Piso' },
} as const;

export type LevelCode = keyof typeof LEVEL_CONFIG;

interface PositionDetailModalProps {
 position: PositionRack | null;
 warehouseName: string;
 onClose: () => void;
 onOpenUnitDetail: (unit: PositionSerializedItem) => void;
 onOpenQr: (unit: PositionSerializedItem) => void;
 onPrintQr: (unit: PositionSerializedItem) => void;
}

export const PositionDetailModal: React.FC<PositionDetailModalProps> = ({
 position,
 warehouseName,
 onClose,
 onOpenUnitDetail,
 onOpenQr,
 onPrintQr,
}) => {
 // State for hierarchical drilldown: null = Position overview, 'C' | 'B' | 'A' = Level content
 const [activeLevelCode, setActiveLevelCode] = useState<LevelCode | null>(null);

 // States for Location QR modals
 const [selectedLocationQr, setSelectedLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedPrintLocationQr, setSelectedPrintLocationQr] = useState<PhysicalLocationMeta | null>(null);

 if (!position) return null;

 const handleClose = () => {
 setActiveLevelCode(null);
 onClose();
 };

 const LEVEL_CODES: LevelCode[] = ['C', 'B', 'A'];

 // Calculate real units per level without arbitrary capacities
 const levelsData = LEVEL_CODES.map((code) => {
 const config = LEVEL_CONFIG[code];
 const lvl = position.levels?.find((l) => l.levelCode === code);
 const locationCode = lvl?.locationCode || `${position.aisle}-${code}-${position.positionNumber}`;
 const units = lvl?.units || [];
 const occupiedCount = units.length > 0 ? units.length : (lvl?.count ?? 0);

 let countText = '';
 if (occupiedCount === 0) {
 countText = 'Sin unidades';
 } else if (occupiedCount === 1) {
 countText = '1 unidad';
 } else {
 countText = `${occupiedCount} unidades`;
 }

 return {
 code,
 name: config.name,
 label: config.label,
 locationCode,
 occupiedCount,
 countText,
 units,
 isEmpty: occupiedCount === 0,
 };
 });

 // Total position calculations
 const totalOccupied = levelsData.reduce((acc, curr) => acc + curr.occupiedCount, 0);
 const totalAvailable = position.availableCount ?? (totalOccupied - (position.committedCount ?? 0));
 const totalCommitted = position.committedCount ?? 0;

 const handleOpenLevelLocationQr = (code: LevelCode, locCode: string, unitsCount: number) => {
 setSelectedLocationQr({
 code: locCode,
 name: `Nivel ${code} · Posición ${position.positionNumber} · Pasillo ${position.aisle}`,
 type: 'RACK',
 warehouseName: warehouseName,
 warehouseCode: warehouseName.includes('Virtual') ? 'ALM-VIRTUAL' : 'ALM-RTM',
 aisle: `Pasillo ${position.aisle}`,
 level: code,
 positionNumber: position.positionNumber,
 capacity: 7,
 currentUnits: unitsCount,
 status: 'Activa · Operativa',
 description: 'Espacio físico para almacenamiento de sustratos, materias primas y producto terminado.',
 });
 };

 const handlePrintLevelLocationQr = (code: LevelCode, locCode: string, unitsCount: number) => {
 setSelectedPrintLocationQr({
 code: locCode,
 name: `Nivel ${code} · Posición ${position.positionNumber} · Pasillo ${position.aisle}`,
 type: 'RACK',
 warehouseName: warehouseName,
 warehouseCode: warehouseName.includes('Virtual') ? 'ALM-VIRTUAL' : 'ALM-RTM',
 aisle: `Pasillo ${position.aisle}`,
 level: code,
 positionNumber: position.positionNumber,
 capacity: 7,
 currentUnits: unitsCount,
 status: 'Activa · Operativa',
 description: 'Espacio físico para almacenamiento de sustratos, materias primas y producto terminado.',
 });
 };

 const activeLevelData = activeLevelCode
 ? levelsData.find((l) => l.code === activeLevelCode)
 : null;

 const isEmpty = totalOccupied === 0;

 return (
 <>
 <ModalPortal onClose={handleClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* ========================================================================= */}
 {/* MODAL HEADER WITH HIERARCHICAL BREADCRUMB & BACK NAVIGATION */}
 {/* ========================================================================= */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 {activeLevelCode ? (
 <button
 onClick={() => setActiveLevelCode(null)}
 className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer border border-theme-subtle"
 title="Volver al resumen de posición"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Volver a Posición {position.positionId}</span>
 </button>
 ) : (
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center font-mono font-black text-sm border border-theme-primary/20 shrink-0">
 {position.positionId}
 </div>
 )}

 <div>
 {activeLevelCode && activeLevelData ? (
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[11px] font-mono text-theme-muted">
 Posición {position.positionId} &gt;
 </span>
 <h2 className="text-sm font-extrabold text-theme-main">
 {activeLevelData.name} &middot; {activeLevelData.locationCode}
 </h2>
 </div>
 <p className="text-[11px] text-theme-muted mt-0.5">
 {activeLevelData.occupiedCount === 0
 ? 'Sin unidades almacenadas'
 : activeLevelData.occupiedCount === 1
 ? '1 unidad almacenada en este nivel'
 : `${activeLevelData.occupiedCount} unidades almacenadas en este nivel`}
 </p>
 </div>
 ) : (
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <h2 className="text-sm font-extrabold text-theme-main">
 Pasillo {position.aisle} &middot; Posición {position.positionNumber}
 </h2>
 <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-theme-muted text-theme-muted border border-theme-subtle">
 {warehouseName}
 </span>
 <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
 isEmpty
 ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
 : 'bg-theme-primary/10 text-theme-primary border-theme-primary/30'
 }`}>
 {totalOccupied === 0
 ? 'Sin unidades'
 : totalOccupied === 1
 ? '1 unidad'
 : `${totalOccupied} unidades`}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted mt-0.5">
 Rack de almacenamiento vertical &middot; 3 niveles físicos independientes
 </p>
 </div>
 )}
 </div>
 </div>

 <button
 onClick={handleClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* ========================================================================= */}
 {/* MODAL BODY (SWITCHABLE BETWEEN POSITION OVERVIEW & LEVEL CONTENT) */}
 {/* ========================================================================= */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* ======================================================================= */}
 {/* VISTA 1: RESUMEN DE POSICIÓN (KPIs + DISTRIBUCIÓN POR NIVELES) */}
 {/* ======================================================================= */}
 {!activeLevelCode && (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* KPIs Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ocupación Actual</span>
 <strong className="text-base font-mono font-black text-theme-main block">
 {totalOccupied} unidades
 </strong>
 <span className="text-[10px] text-theme-muted font-medium">
 {totalOccupied === 0 ? 'Posición vacía' : 'En esta posición'}
 </span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-emerald-600 block">Disponibles</span>
 <strong className="text-base font-mono font-black text-emerald-600 block">
 {totalAvailable} pzas
 </strong>
 <span className="text-[10px] text-theme-muted font-medium">Listos para surtido</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-amber-600 block">Comprometidos</span>
 <strong className="text-base font-mono font-black text-amber-600 block">
 {totalCommitted} pzas
 </strong>
 <span className="text-[10px] text-theme-muted font-medium">Asignados a ruta</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-indigo-600 block">Antigüedad Promedio</span>
 <strong className="text-base font-mono font-black text-indigo-600 block">
 {position.avgAgeDays} días
 </strong>
 <span className="text-[10px] text-theme-muted font-medium">Permanencia en rack</span>
 </div>
 </div>

 {/* Distribución por Niveles Físicos (Cards Grandes y Clickeables) */}
 <div className="space-y-3 pt-2">
 <div className="flex items-center justify-between">
 <span className="text-[11px] uppercase font-black text-theme-muted tracking-wider block">
 Distribución por Niveles Físicos & QRs de Ubicación
 </span>
 <span className="text-[10px] text-theme-muted font-mono">
 Selecciona un nivel para ver sus unidades o gestiona el QR del espacio
 </span>
 </div>

 <div className="grid grid-cols-1 gap-3.5">
 {levelsData.map((lvl) => (
 <div
 key={lvl.code}
 className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/60 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
 >
 <div 
 onClick={() => setActiveLevelCode(lvl.code)}
 className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
 >
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-base border transition-all shrink-0 ${
 lvl.isEmpty
 ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25 group-hover:bg-emerald-500/20'
 : 'bg-theme-primary/10 text-theme-primary border-theme-primary/20 group-hover:bg-theme-primary/20'
 }`}>
 {lvl.code}
 </div>

 <div className="min-w-0">
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-bold text-theme-main group-hover:text-theme-primary transition-colors">
 {lvl.name}
 </h3>
 <span className="font-mono text-[10px] text-theme-primary font-bold px-2 py-0.5 rounded bg-theme-primary/10 border border-theme-primary/20">
 {lvl.locationCode}
 </span>
 </div>

 <p className="text-[11px] text-theme-muted mt-0.5">
 <strong className="text-theme-main font-mono">{lvl.countText}</strong>
 </p>
 </div>
 </div>

 {/* Right side: Location QR quick actions + Content button */}
 <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-subtle">
 {/* Quick Location QR button */}
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleOpenLevelLocationQr(lvl.code, lvl.locationCode, lvl.occupiedCount);
 }}
 className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all border border-purple-500/30 flex items-center gap-1 cursor-pointer"
 title={`Ver QR de ubicación física ${lvl.locationCode}`}
 >
 <QrCode className="w-3.5 h-3.5" />
 <span className="hidden md:inline">QR Ubicación</span>
 </button>

 {/* Quick Print Location QR button */}
 <button
 onClick={(e) => {
 e.stopPropagation();
 handlePrintLevelLocationQr(lvl.code, lvl.locationCode, lvl.occupiedCount);
 }}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-all border border-theme-subtle flex items-center gap-1 cursor-pointer"
 title={`Imprimir etiqueta térmica para ${lvl.locationCode}`}
 >
 <Printer className="w-3.5 h-3.5" />
 <span className="hidden md:inline">Etiqueta</span>
 </button>

 <button
 onClick={() => setActiveLevelCode(lvl.code)}
 className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
 >
 <span>Ver contenido</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* ======================================================================= */}
 {/* VISTA 2: CONTENIDO ESPECÍFICO DEL NIVEL SELECCIONADO */}
 {/* ======================================================================= */}
 {activeLevelCode && activeLevelData && (
 <div className="space-y-5 animate-in fade-in duration-150">
 
 {/* Header Info Box del Nivel & Acciones de QR de Ubicación Física */}
 <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-mono font-black text-sm shadow-xs shrink-0">
 {activeLevelData.code}
 </div>
 <div className="space-y-0.5">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[10px] uppercase font-black tracking-wider text-purple-700 dark:text-purple-300">
 Ubicación Física de Almacén
 </span>
 <span className="font-mono text-xs font-black text-theme-main bg-theme-surface px-2 py-0.5 rounded border border-theme-subtle">
 {activeLevelData.locationCode}
 </span>
 <span className="text-[10px] text-theme-muted">
 Tipo: <strong className="text-theme-main">Rack Selectivo</strong> &bull; {warehouseName}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted">
 Contenido actual: <strong className="text-theme-main font-mono">{activeLevelData.countText}</strong>
 </p>
 </div>
 </div>

 {/* DEDICATED LOCATION QR ACTIONS (Distinct from unit QRs) */}
 <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
 <button
 onClick={() => handleOpenLevelLocationQr(activeLevelData.code, activeLevelData.locationCode, activeLevelData.occupiedCount)}
 className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted text-purple-700 hover:text-purple-800 text-xs font-bold transition-all border border-purple-300/60 flex items-center gap-1.5 cursor-pointer shadow-2xs"
 >
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>Ver QR ubicación</span>
 </button>

 <button
 onClick={() => handlePrintLevelLocationQr(activeLevelData.code, activeLevelData.locationCode, activeLevelData.occupiedCount)}
 className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR ubicación</span>
 </button>
 </div>
 </div>

 {/* Lista de Unidades ÚNICAMENTE de este Nivel */}
 {activeLevelData.units.length === 0 ? (
 <div className="p-8 text-center rounded-2xl border border-dashed border-theme-subtle bg-theme-muted/20 space-y-2">
 <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
 <p className="text-xs font-bold text-theme-main">Este nivel no tiene unidades almacenadas</p>
 <p className="text-[11px] text-theme-muted">
 Ubicación física <strong className="font-mono">{activeLevelData.locationCode}</strong> disponible para asignación.
 </p>
 </div>
 ) : (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Unidades Físicas Almacenadas en este Nivel ({activeLevelData.units.length} pzas):
 </span>
 <span className="text-[10px] text-theme-muted font-mono">
 QRs individuales por unidad física
 </span>
 </div>

 {activeLevelData.units.map((unit) => (
 <div
 key={unit.uid}
 className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface space-y-3 shadow-xs hover:border-theme-primary/40 transition-colors"
 >
 {/* Top Row: UID & Status */}
 <div className="flex items-center justify-between gap-2 flex-wrap">
 <div className="flex items-center gap-2">
 <QrCode className="w-4 h-4 text-theme-primary shrink-0" />
 <span className="font-mono text-xs font-bold text-theme-main">
 {unit.uid}
 </span>
 <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-theme-muted text-theme-main border border-theme-subtle">
 {unit.locationCode}
 </span>
 </div>

 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 unit.status === 'Disponible'
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {unit.status}
 </span>
 </div>

 {/* Product Box */}
 <div className="p-3 rounded-xl bg-theme-muted/40 border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{unit.sku}</span>
 <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-theme-muted text-theme-main border border-theme-subtle">
 {unit.brand}
 </span>
 </div>
 <p className="text-xs font-bold text-theme-main leading-snug">
 {unit.productName}
 </p>
 </div>

 <div className="text-left sm:text-right text-[11px] font-mono text-theme-muted shrink-0">
 <span className="block font-semibold text-theme-main">{unit.size}</span>
 <span>{unit.lotNumber}</span>
 </div>
 </div>

 {/* Dates & Actions */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-theme-muted">
 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1">
 <Calendar className="w-3.5 h-3.5" />
 <span>Entrada: {unit.entryDate}</span>
 </span>
 <span className="flex items-center gap-1 font-mono">
 <Clock className="w-3.5 h-3.5" />
 <span>{unit.ageDays} días</span>
 </span>
 </div>

 {/* Unit Action Buttons */}
 <div className="flex items-center gap-1.5 self-end sm:self-auto">
 <button
 onClick={() => onOpenUnitDetail(unit)}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-theme-subtle"
 title="Ver ficha individual del artículo"
 >
 <Eye className="w-3.5 h-3.5 text-theme-muted" />
 <span>Detalle</span>
 </button>

 <button
 onClick={() => onOpenQr(unit)}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-purple-700 hover:text-purple-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-purple-200/40"
 title="Ver código QR de la unidad"
 >
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>QR Unidad</span>
 </button>

 <button
 onClick={() => onPrintQr(unit)}
 className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
 title="Imprimir etiqueta térmica"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR</span>
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>

 {/* ========================================================================= */}
 {/* MODAL FOOTER */}
 {/* ========================================================================= */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs text-theme-muted">
 {activeLevelCode ? (
 <button
 onClick={() => setActiveLevelCode(null)}
 className="text-theme-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Volver a selección de niveles</span>
 </button>
 ) : (
 <span>Niveles de almacenamiento: Nivel C (Superior) &middot; Nivel B (Medio) &middot; Nivel A (Piso)</span>
 )}

 <button
 onClick={handleClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* ========================================================================= */}
 {/* SUB-MODAL APILADO: VISOR DE QR DE UBICACIÓN FÍSICA */}
 {/* ========================================================================= */}
 <LocationQrModal
 location={selectedLocationQr}
 onClose={() => setSelectedLocationQr(null)}
 onPrint={(loc) => setSelectedPrintLocationQr(loc)}
 />

 {/* ========================================================================= */}
 {/* SUB-MODAL APILADO: IMPRESIÓN DE ETIQUETA TÉRMICA DE UBICACIÓN FÍSICA */}
 {/* ========================================================================= */}
 <PrintLocationQrModal
 location={selectedPrintLocationQr}
 onClose={() => setSelectedPrintLocationQr(null)}
 />
 </>
 );
};
