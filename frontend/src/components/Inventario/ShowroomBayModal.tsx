import React, { useState } from 'react';
import { 
 X, 
 Sparkles, 
 QrCode, 
 Printer, 
 MapPin, 
 Calendar, 
 Clock, 
 Building2, 
 Store,
 Tag, 
 Layers, 
 CheckCircle2,
 Info,
 ShieldCheck,
 Eye,
 BedDouble
} from 'lucide-react';
import { ShowroomBay, PositionSerializedMattress } from '../../data/mockInventoryData';
import { LocationQrModal, PhysicalLocationMeta } from './LocationQrModal';
import { PrintLocationQrModal } from './PrintLocationQrModal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';
import { ModalPortal } from '../common/ModalPortal';

interface ShowroomBayModalProps {
 bay: ShowroomBay | null;
 warehouseName: string;
 warehouseCode: string;
 onClose: () => void;
}

export const ShowroomBayModal: React.FC<ShowroomBayModalProps> = ({
 bay,
 warehouseName,
 warehouseCode,
 onClose,
}) => {
 const [selectedLocationQr, setSelectedLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedPrintLocationQr, setSelectedPrintLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedMattress | null>(null);

 if (!bay) return null;

 const isOccupied = bay.status === 'Ocupada' && !!bay.mattress;
 const mattress = bay.mattress;

 const handleOpenLocationQr = () => {
 setSelectedLocationQr({
 code: bay.code,
 name: `${bay.name} · ${warehouseName}`,
 type: 'SHOWROOM',
 warehouseName,
 warehouseCode,
 capacity: 1,
 currentUnits: isOccupied ? 1 : 0,
 status: isOccupied ? 'Ocupada · En exhibición' : 'Libre para montaje',
 description: `Bahía de exhibición retail en piso de venta (${warehouseName}).`,
 });
 };

 const handlePrintLocationQr = () => {
 setSelectedPrintLocationQr({
 code: bay.code,
 name: `${bay.name} · ${warehouseName}`,
 type: 'SHOWROOM',
 warehouseName,
 warehouseCode,
 capacity: 1,
 currentUnits: isOccupied ? 1 : 0,
 status: isOccupied ? 'Ocupada · En exhibición' : 'Libre para montaje',
 description: `Bahía de exhibición retail en piso de venta (${warehouseName}).`,
 });
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Modal Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-mono font-black text-sm shadow-md shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-purple-500 shadow-2xs">
 {bay.code}
 </span>
 <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted">
 Showroom Retail
 </span>
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 isOccupied
 ? 'border-purple-500'
 : 'border-emerald-600 '
 }`}>
 {isOccupied ? 'Ocupada · En exhibición' : 'Bahía Libre'}
 </span>
 </div>
 <h2 className="text-sm font-black text-theme-main mt-0.5">
 {bay.name} &middot; {warehouseName}
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

 {/* Modal Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* Card 1: Datos de la Ubicación Física (Showroom) */}
 <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Store className="w-4 h-4 text-purple-600" />
 <span className="font-bold text-theme-main text-xs">
 Espacio Físico de Exhibición
 </span>
 </div>
 <span className="font-mono text-[10px] text-theme-muted">
 {warehouseCode} &bull; {bay.code}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
 <div>
 <span className="text-theme-muted block text-[10px] uppercase font-bold">Tipo de Ubicación</span>
 <strong className="text-theme-main">Showroom / Piso de Venta</strong>
 </div>
 <div>
 <span className="text-theme-muted block text-[10px] uppercase font-bold">Sucursal</span>
 <strong className="text-theme-main">{warehouseName}</strong>
 </div>
 </div>

 {/* Location QR Actions */}
 <div className="flex items-center justify-between pt-2 border-t border-purple-500/20 text-xs">
 <span className="text-theme-muted text-[11px]">Código QR del espacio físico:</span>
 <div className="flex items-center gap-2">
 <button
 onClick={handleOpenLocationQr}
 className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all text-xs"
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>Ver QR ubicación</span>
 </button>
 <button
 onClick={handlePrintLocationQr}
 className="px-2.5 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main font-semibold border border-theme-subtle flex items-center gap-1.5 cursor-pointer transition-all text-xs"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR ubicación</span>
 </button>
 </div>
 </div>
 </div>

 {/* Card 2: Contenido / Colchón Exhibido */}
 {isOccupied && mattress ? (
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-4 shadow-xs">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
 <BedDouble className="w-4 h-4" />
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Colchón en Exhibición</span>
 <h3 className="text-xs font-black text-theme-main">{mattress.productName}</h3>
 </div>
 </div>

 <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 border border-purple-500/30">
 {mattress.status}
 </span>
 </div>

 {/* Product Specifications Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
 <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">SKU</span>
 <strong className="font-mono text-xs font-black text-theme-primary block">{mattress.sku}</strong>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Marca</span>
 <strong className="text-xs font-bold text-theme-main block">{mattress.brand}</strong>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Medida</span>
 <strong className="text-xs font-bold text-theme-main block">{mattress.size}</strong>
 </div>

 <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Lote</span>
 <strong className="font-mono text-xs text-theme-muted block">{mattress.lotNumber}</strong>
 </div>
 </div>

 {/* Serial & Dates */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-theme-muted text-[11px]">Número de Serie / UID:</span>
 <span className="font-mono text-xs font-black text-theme-main bg-theme-surface px-2.5 py-1 rounded-lg border border-theme-subtle">
 {mattress.uid}
 </span>
 </div>

 <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1 border-t border-theme-subtle">
 <span className="flex items-center gap-1">
 <Calendar className="w-3.5 h-3.5" />
 <span>Fecha de Ingreso: {mattress.entryDate}</span>
 </span>
 <span className="flex items-center gap-1 font-mono">
 <Clock className="w-3.5 h-3.5" />
 <span>{mattress.ageDays} días en tienda</span>
 </span>
 </div>
 </div>

 {/* Unit QR Actions */}
 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle text-xs">
 <span className="text-theme-muted text-[11px]">Código QR de la unidad serializada:</span>
 <div className="flex items-center gap-2">
 <button
 onClick={() => setSelectedQrUnit(mattress)}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-purple-700 hover:text-purple-800 font-bold border border-purple-200/50 flex items-center gap-1.5 cursor-pointer text-xs transition-all"
 >
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>QR Unidad</span>
 </button>
 <button
 onClick={() => setSelectedPrintUnit(mattress)}
 className="px-2.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs transition-all shadow-xs"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir QR Unidad</span>
 </button>
 </div>
 </div>
 </div>
 ) : (
 <div className="p-8 text-center rounded-3xl border border-dashed border-theme-subtle bg-theme-muted/20 space-y-2">
 <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
 <p className="text-xs font-bold text-theme-main">Esta bahía de showroom se encuentra disponible</p>
 <p className="text-[11px] text-theme-muted">
 Espacio listo para montaje de un nuevo colchón de exhibición mediante movimiento de inventario.
 </p>
 </div>
 )}
 </div>

 {/* Modal Footer */}
 <div className="px-6 py-3 border-t border-theme-subtle bg-theme-muted/30 flex items-center justify-between text-xs text-theme-muted">
 <span>Ubicación de Piso de Venta &bull; {bay.code}</span>
 <button
 onClick={onClose}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* Sub-modals for Location and Unit QRs */}
 <LocationQrModal
 location={selectedLocationQr}
 onClose={() => setSelectedLocationQr(null)}
 onPrint={(loc) => setSelectedPrintLocationQr(loc)}
 />

 <PrintLocationQrModal
 location={selectedPrintLocationQr}
 onClose={() => setSelectedPrintLocationQr(null)}
 />

 <QrModal
 unit={selectedQrUnit}
 warehouseName={warehouseName}
 onClose={() => setSelectedQrUnit(null)}
 onPrint={(u) => setSelectedPrintUnit(u)}
 />

 <PrintQrModal
 unit={selectedPrintUnit}
 warehouseName={warehouseName}
 onClose={() => setSelectedPrintUnit(null)}
 />
 </>
 );
};
