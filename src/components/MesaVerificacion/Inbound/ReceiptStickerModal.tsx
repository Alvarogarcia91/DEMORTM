import React from 'react';
import { 
 X, 
 Printer, 
 QrCode, 
 CheckCircle2, 
 Tag, 
 Building2, 
 Calendar, 
 Layers, 
 MapPin, 
 ShieldCheck,
 Check
} from 'lucide-react';
import { ReceivedUnitRecord } from '../../../data/mockInboundData';
import { ModalPortal } from '../../common/ModalPortal';

interface ReceiptStickerModalProps {
 unit: ReceivedUnitRecord | null;
 warehouseName?: string;
 onClose: () => void;
 onPrintSuccess?: () => void;
}

export const ReceiptStickerModal: React.FC<ReceiptStickerModalProps> = ({
 unit,
 warehouseName = 'Almacén Materia Prima',
 onClose,
 onPrintSuccess,
}) => {
 if (!unit) return null;

 const handlePrint = () => {
 if (onPrintSuccess) {
 onPrintSuccess();
 }
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Tag className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Sticker QR de Unidad Serializada
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {unit.uid} &bull; Recepción
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

 {/* Physical Sticker Card Preview */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Printable Label Viewport */}
 <div className="p-5 rounded-2xl bg-white text-zinc-900 border-2 border-dashed border-zinc-300 shadow-lg space-y-4 font-sans">
 
 {/* Header Impresos RTM */}
 <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-2.5">
 <div>
 <span className="text-[10px] font-black tracking-widest uppercase text-theme-primary block">
 IMPRESOS RTM
 </span>
 <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
 Etiqueta de Trazabilidad Serializada
 </span>
 </div>
 <span className="px-2 py-0.5 rounded bg-white text-zinc-900 border border-zinc-400 font-mono text-[9px] font-extrabold shadow-2xs">
 {unit.locationCode}
 </span>
 </div>

 {/* QR Centerpiece & Basic Specs */}
 <div className="flex items-center gap-4 py-1">
 {/* QR Container */}
 <div className="w-28 h-28 bg-zinc-50 rounded-xl border border-zinc-300 flex flex-col items-center justify-center p-2 shrink-0 shadow-inner">
 {/* Visual Representation of QR */}
 <div className="w-full h-full flex flex-col items-center justify-center relative">
 <QrCode className="w-20 h-20 text-zinc-900" />
 <span className="text-[8px] font-mono font-bold text-zinc-600 truncate max-w-[90px] mt-0.5">
 {unit.uid.replace('TAR-RTM-2026-', '')}
 </span>
 </div>
 </div>

 {/* Primary Specs */}
 <div className="space-y-1 min-w-0">
 <span className="font-mono text-xs font-black text-theme-primary block truncate">
 {unit.uid}
 </span>
 <span className="font-mono text-[10px] font-bold text-zinc-500 block">
 SKU: {unit.sku}
 </span>
 <h3 className="text-xs font-black text-zinc-900 leading-tight">
 {unit.productName}
 </h3>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 pt-0.5">
 <span>{unit.brand}</span>
 <span>&bull;</span>
 <span>{unit.size}</span>
 </div>
 </div>
 </div>

 {/* Detailed Metadata Grid */}
 <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-zinc-200 pt-2.5">
 <div>
 <span className="text-zinc-400 block font-semibold">Lote de Producción:</span>
 <strong className="font-mono text-zinc-800">{unit.lotNumber}</strong>
 </div>
 <div>
 <span className="text-zinc-400 block font-semibold">Fecha de Recepción:</span>
 <strong className="font-mono text-zinc-800">{unit.receivedAt}</strong>
 </div>
 <div>
 <span className="text-zinc-400 block font-semibold">Instalación Destino:</span>
 <strong className="text-zinc-800">{warehouseName}</strong>
 </div>
 <div>
 <span className="text-zinc-400 block font-semibold">Estado Operativo:</span>
 <strong className="text-amber-700 font-bold">{unit.status}</strong>
 </div>
 </div>

 {/* Bottom Barcode String */}
 <div className="border-t border-zinc-200 pt-2 text-center">
 <span className="font-mono text-[10px] tracking-widest text-zinc-600 font-semibold block">
 * {unit.uid} *
 </span>
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs gap-3">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cerrar
 </button>

 <button
 onClick={handlePrint}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir sticker</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
