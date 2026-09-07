import React from 'react';
import { 
 X, 
 QrCode, 
 Printer, 
 Calendar, 
 Clock, 
 MapPin, 
 Building2, 
 Tag, 
 CheckCircle2, 
 ShieldCheck,
 Package,
 Layers,
 FileText,
 History
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PositionSerializedMattress } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';

export interface TransferRouteMeta {
 origin: string;
 destination: string;
 status: string;
 departureDate?: string;
 arrivalDate?: string;
 plates?: string;
 driver?: string;
 folio?: string;
}

interface UnitDetailModalProps {
 unit: PositionSerializedMattress | null;
 warehouseName: string;
 transferRoute?: TransferRouteMeta | null;
 onClose: () => void;
 onOpenQr: (unit: PositionSerializedMattress) => void;
 onPrintQr: (unit: PositionSerializedMattress) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
 unit,
 warehouseName,
 transferRoute,
 onClose,
 onOpenQr,
 onPrintQr,
}) => {
 if (!unit) return null;

 const isInTransit = unit.status === 'En tránsito' || !!transferRoute;
 const qrDataString = `UID=${unit.uid}|SKU=${unit.sku}|LOC=${isInTransit ? 'EN_TRANSITO' : unit.locationCode}|LOT=${unit.lotNumber}|ALM=${warehouseName}`;
 
 // Extract aisle and position from locationCode (e.g. "A-C-06")
 const locParts = unit.locationCode.split('-');
 const aisleCode = locParts[0] ? `Pasillo ${locParts[0]}` : 'Pasillo A';
 const posCode = locParts[2] ? `Posición ${locParts[2]}` : 'Posición 01';

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white text-theme-primary flex items-center justify-center border border-theme-primary shadow-2xs shrink-0">
 <QrCode className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h2 className="text-sm font-bold text-theme-main font-mono">{unit.uid}</h2>
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 unit.status === 'En tránsito' || isInTransit
 ? 'border-blue-500'
 : unit.status === 'Disponible'
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {isInTransit ? 'En tránsito' : unit.status}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted">
 Ficha Maestra de Trazabilidad Individual &middot; {warehouseName}
 </p>
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
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Main Info Card with Mini QR */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="space-y-1.5 flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{unit.sku}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {unit.brand}
 </span>
 <span className="text-[11px] font-semibold text-theme-muted">
 {unit.size}
 </span>
 </div>

 <h3 className="text-sm font-bold text-theme-main leading-snug">
 {unit.productName}
 </h3>

 <p className="text-[11px] text-theme-muted">
 Clasificación: <strong className="text-theme-main">{unit.classification}</strong>
 </p>
 </div>

 {/* Interactive Mini QR */}
 <div 
 onClick={() => onOpenQr(unit)}
 className="p-2.5 bg-white rounded-xl border border-theme-subtle shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-theme-primary transition-all group flex flex-col items-center gap-1"
 title="Clic para ampliar código QR"
 >
 <QRCodeSVG
 value={qrDataString}
 size={72}
 level="M"
 includeMargin={false}
 />
 <span className="text-[9px] font-bold text-theme-primary group-hover:underline">
 Ampliar QR
 </span>
 </div>
 </div>

 {/* Transfer Route Banner if in transit */}
 {isInTransit && (
 <div className="p-4 rounded-2xl bg-white border border-blue-500 shadow-2xs space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-zinc-900 block">
 Traspaso Entre Almacenes {transferRoute?.folio ? `(${transferRoute.folio})` : ''}
 </span>
 <span className="font-mono text-[10px] font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-blue-500 shadow-2xs">
 {transferRoute?.plates || 'Camión #08 (NL-8842-A)'}
 </span>
 </div>

 <div className="flex items-center justify-between pt-1">
 <div>
 <span className="text-[9px] uppercase font-semibold text-theme-muted block">Origen</span>
 <span className="text-xs font-bold text-theme-main">{transferRoute?.origin || 'Almacén Principal RTM'}</span>
 </div>
 <div className="text-blue-600 font-bold text-xs px-2">
 &rarr;
 </div>
 <div className="text-right">
 <span className="text-[9px] uppercase font-semibold text-theme-muted block">Destino</span>
 <span className="text-xs font-bold text-theme-primary">{transferRoute?.destination || 'Almacén Virtual / Control'}</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-500/20 text-[11px] text-theme-muted">
 <div>
 <span>Salida: </span>
 <strong className="text-theme-main">{transferRoute?.departureDate || '27 Ago 2026, 08:30'}</strong>
 </div>
 <div className="text-right">
 <span>Llegada estimada: </span>
 <strong className="text-theme-main">{transferRoute?.arrivalDate || '27 Ago 2026, 14:00'}</strong>
 </div>
 </div>
 </div>
 )}

 {/* Detailed Attributes Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ubicación Actual</span>
 <strong className="text-sm font-mono font-bold text-theme-primary block">
 {isInTransit ? 'En tránsito entre almacenes' : unit.locationCode}
 </strong>
 <span className="text-[10px] text-theme-muted block">
 {isInTransit ? 'Traslado en camión' : `${aisleCode} · ${posCode}`}
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Nivel Físico</span>
 <strong className="text-sm font-mono font-bold text-theme-main block">
 {isInTransit ? 'En plataforma' : `Nivel ${unit.levelCode}`}
 </strong>
 <span className="text-[10px] text-theme-muted block">
 {isInTransit ? 'Plataforma de carga' : unit.levelCode === 'C' ? 'Nivel Superior' : unit.levelCode === 'B' ? 'Nivel Medio' : 'Nivel Piso'}
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Lote de Fabricación</span>
 <strong className="text-sm font-mono font-bold text-theme-main block">{unit.lotNumber}</strong>
 <span className="text-[10px] text-theme-muted block">Semana de producción</span>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Fecha de Ingreso</span>
 <strong className="text-sm font-bold text-theme-main block">{unit.entryDate}</strong>
 <span className="text-[10px] text-theme-muted block font-mono">Antigüedad: {unit.ageDays} días</span>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Estado Operativo</span>
 <strong className={`text-xs font-bold block ${isInTransit ? 'text-blue-600' : 'text-emerald-600'}`}>
 {isInTransit ? 'En tránsito' : unit.status}
 </strong>
 <span className="text-[10px] text-theme-muted block">
 {isInTransit ? 'En ruta inter-almacenes' : 'Listo para surtido'}
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Centro de Distribución</span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {isInTransit ? `${transferRoute?.origin || 'Almacén Principal RTM'} → ${transferRoute?.destination || 'Almacén Virtual'}` : warehouseName}
 </strong>
 <span className="text-[10px] text-theme-muted block">
 {isInTransit ? (transferRoute?.driver || 'Roberto Garza (Chofer)') : 'Racks de almacenamiento'}
 </span>
 </div>
 </div>

 {/* Recent Traceability History */}
 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block flex items-center gap-1.5">
 <History className="w-3.5 h-3.5 text-blue-600" />
 Trazabilidad & Eventos Recientes
 </span>
 <div className="space-y-1.5 text-[11px] divide-y divide-theme-subtle">
 <div className="flex items-center justify-between pt-1">
 <span>Ingreso verificado en rampa y asignación de UID</span>
 <span className="font-mono text-[10px] text-theme-muted">{unit.entryDate} 09:30</span>
 </div>
 <div className="flex items-center justify-between pt-1">
 <span>Acomodo confirmado en posición <strong className="text-theme-main font-mono">{unit.locationCode}</strong></span>
 <span className="font-mono text-[10px] text-theme-muted">{unit.entryDate} 10:15</span>
 </div>
 </div>
 </div>

 {/* Quality & Inspection Notes */}
 <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block flex items-center gap-1.5">
 <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
 Certificación de Entrada & Calidad
 </span>
 <p className="text-[11px] text-theme-main leading-relaxed">
 {unit.notes || 'Pieza inspeccionada en rampa de recibo sin incidencias perimetrales ni de empaque al vacío.'}
 </p>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between gap-3">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer"
 >
 Cerrar
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => onOpenQr(unit)}
 className="px-3.5 py-2 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main text-xs font-semibold transition-colors border border-theme-subtle flex items-center gap-1.5 cursor-pointer shadow-xs"
 >
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>Ver QR</span>
 </button>

 <button
 onClick={() => onPrintQr(unit)}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR</span>
 </button>
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};
