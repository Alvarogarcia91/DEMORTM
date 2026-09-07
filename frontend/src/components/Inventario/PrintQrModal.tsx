import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Tag, Building2, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PositionSerializedItem } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

interface PrintQrModalProps {
  unit: PositionSerializedItem | null;
  warehouseName?: string;
  onClose: () => void;
}

export const PrintQrModal: React.FC<PrintQrModalProps> = ({
 unit,
 warehouseName = 'Almacén Principal RTM',
 onClose,
}) => {
 if (!unit) return null;

 const qrDataString = `UID=${unit.uid}|SKU=${unit.sku}|LOC=${unit.locationCode}|LOT=${unit.lotNumber}|ALM=${warehouseName}`;

 const handlePrint = () => {
 window.print();
 };

 return (
 <ModalPortal onClose={onClose}>
 
 {/* Hidden print stylesheet for isolating label when window.print() is triggered */}
 <style>{`
 @media print {
 body * {
 visibility: hidden !important;
 }
 #printable-warehouse-label, #printable-warehouse-label * {
 visibility: visible !important;
 }
 #printable-warehouse-label {
 position: fixed !important;
 left: 50% !important;
 top: 50% !important;
 transform: translate(-50%, -50%) !important;
 width: 100mm !important;
 max-width: 100mm !important;
 border: 2px solid #000 !important;
 padding: 4mm !important;
 background: #fff !important;
 color: #000 !important;
 box-shadow: none !important;
 }
 }
 `}</style>

 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[95vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
 <Printer className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-theme-main">Vista Previa de Etiqueta Térmica</h3>
 <p className="text-[11px] text-theme-muted">Etiqueta oficial de trazabilidad serializada por pieza</p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body: Preview Label Canvas */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-zinc-100 dark:bg-zinc-900/50 flex flex-col items-center justify-center">
 
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Formato: Etiqueta Adhesiva Térmica 100mm &times; 75mm
 </span>

 {/* THE OFFICIAL PRINTABLE LABEL CONTAINER */}
 <div
 id="printable-warehouse-label"
 className="w-full max-w-[440px] bg-white text-zinc-950 p-5 rounded-2xl border-2 border-zinc-900 shadow-xl space-y-3.5 select-none"
 >
 {/* Label Header */}
 <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-2">
 <div className="flex items-center gap-2">
 <img
 src="/assets/logo-rtm.svg"
 alt="Impresos RTM"
 className="h-6 w-auto object-contain"
 />
 <span className="text-[9px] font-black tracking-widest uppercase bg-white text-zinc-900 border border-zinc-400 px-1.5 py-0.5 rounded">
 TRAZABILIDAD
 </span>
 </div>
 <span className="text-[10px] font-mono font-bold">
 {unit.entryDate}
 </span>
 </div>

 {/* Main QR + Data Row */}
 <div className="flex items-center gap-4">
 {/* Crisp QR Code */}
 <div className="p-1 border border-zinc-900 bg-white shrink-0">
 <QRCodeSVG
 value={qrDataString}
 size={120}
 level="H"
 includeMargin={false}
 />
 </div>

 {/* Serial & Product Info */}
 <div className="space-y-1 min-w-0 flex-1">
 <span className="text-[9px] uppercase font-bold text-zinc-500 block">UID / Serial Individual:</span>
 <span className="font-mono text-xs font-black block tracking-tight bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-300">
 {unit.uid}
 </span>

 <span className="text-[9px] uppercase font-bold text-zinc-500 block pt-1">SKU:</span>
 <span className="font-mono text-xs font-bold text-zinc-950 block">
 {unit.sku}
 </span>

 <span className="text-[9px] uppercase font-bold text-zinc-500 block pt-0.5">Medida:</span>
 <span className="text-xs font-black text-zinc-950 block leading-none">
 {unit.size}
 </span>
 </div>
 </div>

 {/* Product Name */}
 <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-300">
 <span className="text-[9px] uppercase font-bold text-zinc-500 block">Descripción del Artículo:</span>
 <p className="text-xs font-bold text-zinc-950 leading-tight">
 {unit.productName}
 </p>
 </div>

 {/* Location & Lot Footer Grid */}
 <div className="grid grid-cols-3 gap-2 border-t-2 border-zinc-900 pt-2 text-center text-[10px] font-mono">
 <div className="border-r border-zinc-300 pr-1">
 <span className="text-[8px] uppercase font-bold text-zinc-500 block">Ubicación</span>
 <strong className="text-xs font-black text-zinc-950">{unit.locationCode}</strong>
 </div>
 <div className="border-r border-zinc-300 pr-1">
 <span className="text-[8px] uppercase font-bold text-zinc-500 block">Nivel</span>
 <strong className="text-xs font-black text-zinc-950">Nivel {unit.levelCode}</strong>
 </div>
 <div>
 <span className="text-[8px] uppercase font-bold text-zinc-500 block">Lote</span>
 <strong className="text-xs font-black text-zinc-950">{unit.lotNumber}</strong>
 </div>
 </div>

 {/* Warehouse Stamp */}
 <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1 border-t border-dashed border-zinc-300">
 <span>{warehouseName}</span>
 <span className="font-bold">VERIFICADO &bull; CONTROL DE CALIDAD</span>
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-surface flex items-center justify-between">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 onClick={handlePrint}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir Etiqueta (window.print)</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
