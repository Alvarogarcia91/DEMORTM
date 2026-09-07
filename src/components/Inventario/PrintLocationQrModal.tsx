import React from 'react';
import { 
 X, 
 Printer, 
 MapPin, 
 Building2, 
 Layers, 
 Tag, 
 ShieldCheck,
 CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PhysicalLocationMeta } from './LocationQrModal';
import { ModalPortal } from '../common/ModalPortal';

interface PrintLocationQrModalProps {
 location: PhysicalLocationMeta | null;
 onClose: () => void;
}

export const PrintLocationQrModal: React.FC<PrintLocationQrModalProps> = ({
 location,
 onClose,
}) => {
 if (!location) return null;

 const qrDataString = `LOC=${location.code}|SITE=${location.warehouseCode || 'MTY-N'}|TYPE=${location.type}`;

 const handlePrint = () => {
 window.print();
 };

 return (
 <ModalPortal onClose={onClose}>
 
 {/* Hidden print stylesheet for isolating location label when window.print() is triggered */}
 <style>{`
 @media print {
 body * {
 visibility: hidden !important;
 }
 #printable-location-label, #printable-location-label * {
 visibility: visible !important;
 }
 #printable-location-label {
 position: fixed !important;
 left: 50% !important;
 top: 50% !important;
 transform: translate(-50%, -50%) !important;
 width: 100mm !important;
 max-width: 100mm !important;
 border: 2px solid #000 !important;
 padding: 5mm !important;
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
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
 Impresión Térmica de Ubicación
 </span>
 <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 Formato Rack 100mm &times; 75mm
 </span>
 </div>
 <h2 className="text-sm font-black text-theme-main font-mono mt-0.5">
 Etiqueta: {location.code}
 </h2>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body / Label Preview */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 <div className="text-center space-y-1">
 <span className="text-xs font-bold text-theme-main">
 Vista previa de la etiqueta física de señalización
 </span>
 <p className="text-[11px] text-theme-muted">
 Lista para imprimirse en impresora de transferencia térmica Zebra / Honeywell para montaje en rack.
 </p>
 </div>

 {/* ========================================================================= */}
 {/* OFICIAL PRINTABLE WAREHOUSE LOCATION LABEL (100mm x 75mm standard) */}
 {/* ========================================================================= */}
 <div 
 id="printable-location-label"
 className="w-full max-w-[420px] mx-auto bg-white text-black p-5 rounded-2xl border-2 border-zinc-900 shadow-xl space-y-3 font-sans"
 >
 {/* Top Brand & Facility Header */}
 <div className="flex items-center justify-between border-b-2 border-black pb-2">
 <div>
 <div className="flex items-center gap-1.5">
 <span className="text-[13px] font-black tracking-tight uppercase text-black">
 Impresos RTM
 </span>
 </div>
 <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-700 block">
 Identificación de Espacio Físico
 </span>
 </div>

 <div className="text-right">
 <span className="text-[10px] font-black uppercase text-black block">
 {location.warehouseName}
 </span>
 <span className="text-[9px] font-mono font-bold text-zinc-600">
 {location.warehouseCode || 'MTY-N'} &bull; {location.type}
 </span>
 </div>
 </div>

 {/* Giant Location Code Header */}
 <div className="text-center py-1 bg-zinc-100 rounded-lg border border-black">
 <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block">
 Código de Ubicación
 </span>
 <h1 className="text-3xl font-black font-mono tracking-wider text-black">
 {location.code}
 </h1>
 </div>

 {/* Middle Section: Big Industrial QR + Detailed Hierarchy */}
 <div className="flex items-center justify-between gap-4 pt-1">
 <div className="p-2 border-2 border-black rounded-xl bg-white shrink-0">
 <QRCodeSVG
 value={qrDataString}
 size={125}
 level="H"
 includeMargin={false}
 />
 </div>

 <div className="flex-1 space-y-1.5 text-left font-mono">
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Espacio Operativo</span>
 <strong className="text-[11px] font-black text-black leading-tight block">
 {location.name}
 </strong>
 </div>

 {location.aisle && (
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Pasillo & Posición</span>
 <strong className="text-[10px] font-black text-black block">
 {location.aisle} &middot; Pos {location.positionNumber || '01'}
 </strong>
 </div>
 )}

 {location.level && (
 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Nivel Físico</span>
 <strong className="text-[10px] font-black text-black block">
 Nivel {location.level} ({location.level === 'C' ? 'Superior' : location.level === 'B' ? 'Medio' : 'Piso'})
 </strong>
 </div>
 )}

 <div>
 <span className="text-[8px] uppercase font-extrabold text-zinc-600 block">Tipo / Uso</span>
 <strong className="text-[10px] font-black text-black block">
 {location.type === 'RACK' ? 'Rack Selectivo' : location.type}
 </strong>
 </div>
 </div>
 </div>

 {/* Bottom Bar: Instructions & Barcode Raw Text */}
 <div className="pt-2 border-t-2 border-black flex items-center justify-between text-[9px] font-bold">
 <span className="truncate">
 ESCANEAR PARA VALIDAR ACOMODO / RECOLECCIÓN
 </span>
 <span className="font-mono text-zinc-700 shrink-0 ml-2">
 REV: 2026-W34
 </span>
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cancelar
 </button>

 <button
 onClick={handlePrint}
 className="px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Mandar a Imprimir Etiqueta</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
