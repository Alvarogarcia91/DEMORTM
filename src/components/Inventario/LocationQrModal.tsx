import React, { useState } from 'react';
import { 
 X, 
 QrCode, 
 Printer, 
 Copy, 
 Check, 
 MapPin, 
 Building2, 
 Layers, 
 Info, 
 CheckCircle2,
 Tag,
 ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ModalPortal } from '../common/ModalPortal';

export interface PhysicalLocationMeta {
 code: string; // e.g. "A-C-04", "REC-01", "RET-NORTE", "EMB-03", "SHOW-02"
 name: string; // e.g. "Nivel C · Posición 04 · Pasillo A" o "Bahía de Showroom 02"
 type: 'RACK' | 'RECEPCION' | 'ACOMODO' | 'RETRABAJO' | 'EMBARQUE' | 'SUCURSAL' | 'SHOWROOM';
 warehouseName: string;
 warehouseCode: string;
 aisle?: string;
 level?: string;
 positionNumber?: string;
 capacity?: number;
 currentUnits?: number;
 status?: string;
 description?: string;
}

interface LocationQrModalProps {
 location: PhysicalLocationMeta | null;
 onClose: () => void;
 onPrint: (location: PhysicalLocationMeta) => void;
}

export const LocationQrModal: React.FC<LocationQrModalProps> = ({
 location,
 onClose,
 onPrint,
}) => {
 const [copied, setCopied] = useState(false);

 if (!location) return null;

 const qrDataString = `LOC=${location.code}|SITE=${location.warehouseCode || 'MTY-N'}|TYPE=${location.type}`;

 const handleCopy = () => {
 navigator.clipboard.writeText(qrDataString);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const getTypeBadge = (type: string) => {
 switch (type) {
 case 'RACK':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'RECEPCION':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'ACOMODO':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'RETRABAJO':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 case 'EMBARQUE':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'SUCURSAL':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
 QR de Ubicación Física
 </span>
 <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getTypeBadge(location.type)}`}>
 {location.type}
 </span>
 </div>
 <h3 className="text-sm font-black text-theme-main font-mono mt-0.5">
 {location.code}
 </h3>
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
 
 {/* Real QR Rendering with High Contrast Industrial Border */}
 <div className="p-5 bg-white rounded-2xl border-2 border-slate-300 shadow-md inline-block mx-auto">
 <QRCodeSVG
 value={qrDataString}
 size={190}
 level="H"
 includeMargin={false}
 />
 </div>

 {/* Quick Raw String Preview with Copy */}
 <div className="flex items-center justify-between bg-theme-muted/50 p-2.5 rounded-xl border border-theme-subtle text-[11px] font-mono">
 <span className="truncate text-theme-muted mr-2">{qrDataString}</span>
 <button
 onClick={handleCopy}
 className="px-2.5 py-1 rounded-lg bg-theme-surface hover:bg-theme-muted text-theme-main text-xs font-bold transition-colors border border-theme-subtle flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
 >
 {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-theme-muted" />}
 <span>{copied ? 'Copiado' : 'Copiar'}</span>
 </button>
 </div>

 {/* Location Attributes */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-left space-y-2.5">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Espacio Físico</span>
 <p className="text-xs font-bold text-theme-main leading-tight">{location.name}</p>
 </div>

 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-subtle text-[11px] text-theme-muted">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Almacén / CEDIS:</span>
 <strong className="text-theme-main">{location.warehouseName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Estado Operativo:</span>
 <strong className="text-emerald-600 font-bold">{location.status || 'Activa &bull; Operativa'}</strong>
 </div>
 {location.capacity !== undefined && (
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Capacidad Fís.:</span>
 <strong className="text-theme-main font-mono">{location.capacity} unidades</strong>
 </div>
 )}
 {location.currentUnits !== undefined && (
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ocupación Actual:</span>
 <strong className="text-theme-primary font-mono">{location.currentUnits} colchones</strong>
 </div>
 )}
 </div>
 </div>

 {/* Commercial / Demo Highlight Note */}
 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-left flex items-start gap-2.5 text-xs text-purple-950 dark:text-purple-300">
 <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
 <p className="text-[11px] leading-relaxed">
 <strong>Procedimiento RF:</strong> Escanea este código de ubicación física para confirmar acomodos, reacomodos internos y auditorías cíclicas de inventario.
 </p>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>

 <button
 onClick={() => onPrint(location)}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR Ubicación</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
