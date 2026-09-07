import React from 'react';
import { X, QrCode, Printer, CheckCircle2, Copy, Download, Building2, MapPin, Tag } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PositionSerializedItem } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

interface QrModalProps {
  unit: PositionSerializedItem | null;
  warehouseName?: string;
  onClose: () => void;
  onPrint?: (unit: PositionSerializedItem) => void;
}

export const QrModal: React.FC<QrModalProps> = ({
 unit,
 warehouseName = 'Almacén Principal RTM',
 onClose,
 onPrint = () => {},
}) => {
 const [copied, setCopied] = React.useState(false);

 if (!unit) return null;

 const qrDataString = `UID=${unit.uid}|SKU=${unit.sku}|LOC=${unit.locationCode}|LOT=${unit.lotNumber}|ALM=${warehouseName}`;

 const handleCopy = () => {
 navigator.clipboard.writeText(qrDataString);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center">
 <QrCode className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-theme-main">Código QR Serializado</h3>
 <p className="text-[11px] text-theme-muted font-mono">{unit.uid}</p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-center">
 
 {/* Real QR Rendering */}
 <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 shadow-md inline-block mx-auto">
 <QRCodeSVG
 value={qrDataString}
 size={190}
 level="H"
 includeMargin={false}
 />
 </div>

 {/* Identification Details */}
 <div className="space-y-2 text-left">
 <div className="p-3.5 rounded-2xl bg-theme-muted/50 border border-theme-subtle space-y-1.5">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-theme-primary">{unit.sku}</span>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 {unit.status}
 </span>
 </div>
 <p className="text-xs font-bold text-theme-main leading-tight">{unit.productName}</p>
 
 <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-theme-subtle text-[11px] text-theme-muted">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Medida:</span>
 <strong className="text-theme-main">{unit.size}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Lote:</span>
 <strong className="text-theme-main font-mono">{unit.lotNumber}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ubicación:</span>
 <strong className="text-theme-primary font-mono">{unit.locationCode} (Nivel {unit.levelCode})</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Almacén:</span>
 <strong className="text-theme-main">{warehouseName}</strong>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between gap-3">
 <button
 onClick={handleCopy}
 className="px-3 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-theme-subtle"
 >
 {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
 <span>{copied ? 'Copiado' : 'Copiar datos'}</span>
 </button>

 <button
 onClick={() => {
 onClose();
 onPrint(unit);
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir Etiqueta</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
