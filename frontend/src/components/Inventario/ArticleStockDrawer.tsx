import React, { useState } from 'react';
import { 
 X, 
 Building2, 
 ChevronDown, 
 ChevronUp, 
 Boxes, 
 QrCode, 
 Calendar, 
 Clock, 
 MapPin, 
 Printer, 
 Eye, 
 Sparkles,
 Layers,
 ChevronRight
} from 'lucide-react';
import { StockItemRecord, PositionSerializedMattress } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';
import { StatusBadge } from '../common/StatusBadge';
import { SemanticVariant } from '../common/semanticTokens';

export interface ArticleStockSummary {
 sku: string;
 productName: string;
 brand: string;
 size: string;
 totalUnits: number;
 availableUnits: number;
 committedUnits: number;
 stagingUnits: number;
 shippingUnits: number;
 reworkUnits: number;
 inTransitUnits: number;
 warehouses: {
 id: string;
 name: string;
 code: string;
 total: number;
 available: number;
 committed: number;
 staging: number;
 shipping: number;
 rework: number;
 inTransit: number;
 units: StockItemRecord[];
 }[];
 allUnits: StockItemRecord[];
}

interface ArticleStockDrawerProps {
 article: ArticleStockSummary | null;
 onClose: () => void;
 onOpenUnitDetail: (unit: PositionSerializedMattress) => void;
 onOpenQr: (unit: PositionSerializedMattress) => void;
 onPrintQr: (unit: PositionSerializedMattress) => void;
}

export const ArticleStockDrawer: React.FC<ArticleStockDrawerProps> = ({
 article,
 onClose,
 onOpenUnitDetail,
 onOpenQr,
 onPrintQr,
}) => {
 // Map of expanded warehouse accordion IDs
 const [expandedWarehouseIds, setExpandedWarehouseIds] = useState<Record<string, boolean>>({
 'wh-mty-norte': true,
 'wh-mty-sur': true,
 });

 if (!article) return null;

 const toggleWarehouse = (whId: string) => {
 setExpandedWarehouseIds(prev => ({
 ...prev,
 [whId]: !prev[whId]
 }));
 };

 const getUnitVariant = (status: string): SemanticVariant => {
 switch (status) {
 case 'Disponible':
 return 'success';
 case 'Comprometido':
 return 'warning';
 case 'En acomodo':
 return 'info';
 case 'En retrabajo':
 return 'danger';
 case 'En embarque':
 return 'smart';
 default:
 return 'neutral';
 }
 };

 // Convert StockItemRecord to PositionSerializedMattress for modals compatibility
 const toSerializedMattress = (item: StockItemRecord): PositionSerializedMattress => {
 const locParts = item.location.split('-');
 const levelCode = (locParts[1] === 'C' || locParts[1] === 'B' || locParts[1] === 'A') ? locParts[1] : 'A';

 return {
 uid: item.uid,
 sku: item.sku,
 productName: item.productName,
 brand: item.brand,
 size: item.size,
 levelCode: levelCode as 'C' | 'B' | 'A',
 locationCode: item.location,
 lotNumber: item.lotNumber,
 entryDate: item.entryDate,
 ageDays: item.ageDays,
 status: item.status as any,
 classification: 'Colchón Terminado / Calidad A',
 notes: `Registro verificado en ${item.warehouseName}.`,
 };
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center font-mono font-bold text-sm border border-theme-primary/20 shrink-0">
 <Boxes className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{article.sku}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {article.brand}
 </span>
 <span className="text-[11px] font-semibold text-theme-muted">
 {article.size}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main truncate mt-0.5">
 {article.productName}
 </h2>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer shrink-0"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* Resumen Global de Existencias (KPIs) */}
 <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
 <div className="p-3 rounded-2xl bg-white border border-theme-subtle text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">Total Físico</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.totalUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-emerald-600 text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">Disponible</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.availableUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-amber-500 text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">Comprometido</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.committedUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-blue-500 text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">En Acomodo</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.stagingUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-purple-500 text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">En Embarque</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.shippingUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-rose-500 text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">En Retrabajo</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.reworkUnits}</strong>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-theme-subtle text-center shadow-2xs">
 <span className="text-[9px] uppercase font-bold text-zinc-700 dark:text-zinc-300 block">En Tránsito</span>
 <strong className="text-base font-mono font-black text-zinc-900 block mt-0.5">{article.inTransitUnits}</strong>
 </div>
 </div>

 {/* DESGLOSE POR CEDIS (ACCORDIONS) */}
 <div className="space-y-4 pt-2">
 <div className="flex items-center justify-between">
 <span className="text-[11px] uppercase font-black text-theme-muted tracking-wider block">
 Distribución por Centros de Distribución ({article.warehouses.length} CEDIS)
 </span>
 <span className="text-[10px] font-mono text-theme-muted">
 Clic en el almacén para ver unidades serializadas
 </span>
 </div>

 <div className="space-y-4">
 {article.warehouses.map((wh) => {
 const isExpanded = !!expandedWarehouseIds[wh.id];

 return (
 <div
 key={wh.id}
 className="rounded-2xl border border-theme-subtle bg-theme-surface shadow-xs overflow-hidden"
 >
 {/* Warehouse Card Header (Clickable Accordion) */}
 <div
 onClick={() => toggleWarehouse(wh.id)}
 className="p-4 bg-theme-muted/30 hover:bg-theme-muted/60 transition-colors flex items-center justify-between gap-3 cursor-pointer select-none border-b border-theme-subtle"
 >
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-subtle flex items-center justify-center text-theme-main font-mono font-bold text-xs">
 {wh.code}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-xs font-bold text-theme-main">{wh.name}</h3>
 <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
 {wh.total} {wh.total === 1 ? 'pieza' : 'piezas'}
 </span>
 </div>

 <p className="text-[11px] text-theme-muted mt-0.5">
 Disponible: <strong className="text-emerald-600 font-mono">{wh.available}</strong> &middot; Comprometido: <strong className="text-amber-600 font-mono">{wh.committed}</strong> &middot; Acomodo: <strong className="text-blue-600 font-mono">{wh.staging}</strong> &middot; Embarque: <strong className="text-purple-600 font-mono">{wh.shipping}</strong> &middot; Retrabajo: <strong className="text-rose-600 font-mono">{wh.rework}</strong>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 text-theme-muted">
 <span className="text-[10px] font-semibold hidden sm:inline">
 {isExpanded ? 'Ocultar unidades' : 'Ver unidades'}
 </span>
 {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </div>
 </div>

 {/* Serialized Units Table */}
 {isExpanded && (
 <div className="p-0 overflow-x-auto">
 {wh.units.length === 0 ? (
 <div className="p-6 text-center text-theme-muted text-xs">
 No hay unidades serializadas registradas en {wh.name}.
 </div>
 ) : (
 <table className="w-full text-left text-xs border-collapse min-w-[700px]">
 <thead>
 <tr className="border-b border-theme-subtle bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 <th className="py-2.5 px-4">UID / Serie</th>
 <th className="py-2.5 px-3">Ubicación</th>
 <th className="py-2.5 px-3">Lote</th>
 <th className="py-2.5 px-3">Fecha Entrada</th>
 <th className="py-2.5 px-3">Antigüedad</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {wh.units.map((unit) => {
 const serialized = toSerializedMattress(unit);

 return (
 <tr key={unit.uid} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-4 font-mono font-bold text-theme-main flex items-center gap-1.5">
 <QrCode className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span>{unit.uid}</span>
 </td>
 <td className="py-2.5 px-3 font-mono font-bold text-theme-primary">
 {unit.location}
 </td>
 <td className="py-2.5 px-3 font-mono text-theme-muted">
 {unit.lotNumber}
 </td>
 <td className="py-2.5 px-3 text-theme-muted">
 {unit.entryDate}
 </td>
 <td className="py-2.5 px-3 font-mono text-theme-muted">
 {unit.ageDays} días
 </td>
 <td className="py-2.5 px-3">
 <StatusBadge
 variant={getUnitVariant(unit.status)}
 label={unit.status}
 size="sm"
 />
 </td>
 <td className="py-2.5 px-4 text-right">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => onOpenUnitDetail(serialized)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer border border-theme-subtle"
 title="Ver detalle"
 >
 <Eye className="w-3.5 h-3.5 text-theme-muted" />
 </button>
 <button
 onClick={() => onOpenQr(serialized)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-purple-600 transition-colors cursor-pointer border border-purple-200/40"
 title="Ver QR"
 >
 <QrCode className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => onPrintQr(serialized)}
 className="p-1.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white transition-colors cursor-pointer shadow-xs"
 title="Imprimir QR"
 >
 <Printer className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs text-theme-muted">
 <span>Trazabilidad integral serializada por SKU &middot; Impresos RTM</span>
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
