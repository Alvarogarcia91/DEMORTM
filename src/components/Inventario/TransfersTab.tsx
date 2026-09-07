import React, { useState } from 'react';
import { 
 ArrowLeftRight, 
 Search, 
 Plus, 
 Eye, 
 Building2, 
 Truck, 
 Calendar, 
 User, 
 X, 
 QrCode, 
 CheckCircle2,
 Clock,
 Printer,
 ChevronRight,
 Sparkles,
 Store,
 AlertTriangle,
 Boxes,
 PackageCheck,
 ShieldCheck
} from 'lucide-react';
import { 
 MOCK_TRANSFERS, 
 MOCK_STOCK_ITEMS, 
 MOCK_INVENTORY_MOVEMENTS,
 InventoryTransferOrder, 
 PositionSerializedMattress,
 InventoryMovement
} from '../../data/mockInventoryData';
import { UnitDetailModal, TransferRouteMeta } from './UnitDetailModal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';
import { CreateTransferWizardModal } from './CreateTransferWizardModal';
import { PrepareTransferModal } from './PrepareTransferModal';
import { ReceiveTransferModal } from './ReceiveTransferModal';
import { ModalPortal } from '../common/ModalPortal';
import { StatusBadge } from '../common/StatusBadge';

interface TransfersTabProps {
 onShowToast?: (msg: string) => void;
}

export const TransfersTab: React.FC<TransfersTabProps> = ({ onShowToast }) => {
 const [transfers, setTransfers] = useState<InventoryTransferOrder[]>(MOCK_TRANSFERS);
 const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransferOrder | null>(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [filterStatus, setFilterStatus] = useState('all');
 const [filterType, setFilterType] = useState('all');

 // Modal states
 const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
 const [wizardPrefill, setWizardPrefill] = useState<{
 sourceId: string;
 destinationId: string;
 sku: string;
 quantity: number;
 } | null>(null);

 const [orderToPrepare, setOrderToPrepare] = useState<InventoryTransferOrder | null>(null);
 const [orderToReceive, setOrderToReceive] = useState<InventoryTransferOrder | null>(null);

 // Sub-modals for clicking individual serialized units
 const [selectedUnit, setSelectedUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedUnitRoute, setSelectedUnitRoute] = useState<TransferRouteMeta | null>(null);
 const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedMattress | null>(null);

 const getTransferType = (t: InventoryTransferOrder) => {
 const isSourceCedis = t.sourceWarehouseName.includes('CEDIS');
 const isDestCedis = t.destinationWarehouseName.includes('CEDIS');
 
 if (isSourceCedis && !isDestCedis) return 'CEDIS → Sucursal';
 if (isSourceCedis && isDestCedis) return 'CEDIS → CEDIS';
 if (!isSourceCedis && isDestCedis) return 'Sucursal → CEDIS';
 return 'Sucursal → Sucursal';
 };

 const filteredTransfers = transfers.filter((t) => {
 const matchesSearch = 
 t.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.sourceWarehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.destinationWarehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (t.driver && t.driver.toLowerCase().includes(searchTerm.toLowerCase()));

 const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
 const matchesType = filterType === 'all' || getTransferType(t) === filterType;

 return matchesSearch && matchesStatus && matchesType;
 });

 const getStatusBadge = (status: string) => {
 switch (status) {
 case 'Recibido':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'En tránsito':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'Preparando':
 case 'Listo para salida':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'Con incidencia':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 case 'Borrador':
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 // Open individual unit details from UID click
 const handleOpenUnit = (uid: string, item: any, transfer: InventoryTransferOrder) => {
 const stockItem = MOCK_STOCK_ITEMS.find(i => i.uid === uid);
 const isInTransit = transfer.status === 'En tránsito';

 const mattress: PositionSerializedMattress = {
 uid: uid,
 sku: item.sku,
 productName: item.productName,
 brand: stockItem?.brand || 'Bio-Pappel',
 size: stockItem?.size || 'Individual',
 levelCode: 'A',
 locationCode: isInTransit ? 'EN_TRANSITO' : (stockItem?.location || 'A-A-01'),
 lotNumber: stockItem?.lotNumber || 'LOTE-2026-W34',
 entryDate: stockItem?.entryDate || '27 Ago 2026',
 ageDays: stockItem?.ageDays || 1,
 status: (isInTransit ? 'En tránsito' : (stockItem?.status || 'Disponible')) as any,
 classification: 'Producto Terminado / Calidad A',
 notes: `Unidad asignada a orden de traspaso ${transfer.folio} (${transfer.sourceWarehouseName} → ${transfer.destinationWarehouseName}).`,
 };

 setSelectedUnit(mattress);
 setSelectedUnitRoute({
 origin: transfer.sourceWarehouseName,
 destination: transfer.destinationWarehouseName,
 status: transfer.status,
 departureDate: transfer.departureDate || transfer.plannedDate,
 arrivalDate: transfer.arrivalDate,
 plates: transfer.truckPlates,
 driver: transfer.driver,
 folio: transfer.folio,
 });
 };

 // Handle New Transfer Created
 const handleTransferCreated = (newOrder: InventoryTransferOrder) => {
 setTransfers(prev => [newOrder, ...prev]);
 if (onShowToast) {
 const colText = newOrder.collectionFolio ? ` y Recolección ${newOrder.collectionFolio}` : '';
 onShowToast(`Orden de traspaso ${newOrder.folio}${colText} generada (${newOrder.sourceWarehouseName} → ${newOrder.destinationWarehouseName})`);
 }
 };

 // Handle Confirmation of Departure (En Tránsito)
 const handleConfirmDeparture = (updatedOrder: InventoryTransferOrder) => {
 setTransfers(prev => prev.map(t => t.id === updatedOrder.id ? updatedOrder : t));
 
 // Update unit status in stocks
 updatedOrder.items.forEach(item => {
 item.serials.forEach(s => {
 const match = MOCK_STOCK_ITEMS.find(u => u.uid === s);
 if (match) {
 match.status = 'En tránsito';
 match.location = `Tránsito: ${updatedOrder.sourceWarehouseName} → ${updatedOrder.destinationWarehouseName}`;
 }
 });
 });

 if (onShowToast) {
 onShowToast(`Traspaso ${updatedOrder.folio} ahora EN TRÁNSITO con chofer ${updatedOrder.driver}`);
 }
 };

 // Handle Confirmation of Reception
 const handleConfirmReceived = (updatedOrder: InventoryTransferOrder, hadIncidence: boolean, missingUid?: string) => {
 setTransfers(prev => prev.map(t => t.id === updatedOrder.id ? updatedOrder : t));

 // Update units into destination warehouse
 updatedOrder.items.forEach(item => {
 item.serials.forEach(s => {
 if (s !== missingUid) {
 const match = MOCK_STOCK_ITEMS.find(u => u.uid === s);
 if (match) {
 match.warehouseId = updatedOrder.destinationWarehouseId;
 match.warehouseName = updatedOrder.destinationWarehouseName;
 match.location = 'REC-VO (Área de Recepción)';
 match.status = 'Disponible';
 }
 }
 });
 });

 // Record movement in Kardex
 const newMovement: InventoryMovement = {
 id: `mov-${Date.now()}`,
 timestamp: '28 Ago 14:20',
 uid: updatedOrder.items[0]?.serials[0] || 'TAR-RTM-2026-000171',
 sku: updatedOrder.items[0]?.sku || 'PT-MAN-001',
 productName: updatedOrder.items[0]?.productName || 'Manual Instructivo 24 Páginas Black & Decker',
 movementType: 'TRASPASO',
 origin: updatedOrder.sourceWarehouseName,
 destination: updatedOrder.destinationWarehouseName,
 user: updatedOrder.driver || 'Roberto Garza (Logística)',
 notes: `Traspaso inter-almacenes ${updatedOrder.folio} recibido ${hadIncidence ? 'CON INCIDENCIA' : 'COMPLETO'}.`,
 };
 MOCK_INVENTORY_MOVEMENTS.unshift(newMovement);

 if (onShowToast) {
 onShowToast(`Traspaso ${updatedOrder.folio} RECIBIDO en ${updatedOrder.destinationWarehouseName}`);
 }
 };

 // Preload and Open Suggested Transfer
 const handleOpenSuggestedTransfer = () => {
 setWizardPrefill({
 sourceId: 'wh-mty-norte',
 destinationId: 'wh-suc-valle-oriente',
 sku: 'PT-MAN-001',
 quantity: 5,
 });
 setIsCreateWizardOpen(true);
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full">
 
 {/* ========================================================================= */}
 {/* PLUS DEMO: TARJETA DE SUGERENCIA DE ABASTECIMIENTO AUTOMÁTICO */}
 {/* ========================================================================= */}
 <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/25 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <div className="flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-2xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shadow-md shrink-0">
 <Sparkles className="w-6 h-6" />
 </div>
 <div className="space-y-0.5">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
 Sugerencia Inteligente de Abasto
 </span>
 <span className="text-xs font-bold text-theme-main">
 Almacén Auxiliar Reynosa &middot; PT-MAN-001
 </span>
 </div>
 <p className="text-xs text-theme-muted leading-relaxed">
 Stock actual: <strong className="text-rose-600 font-mono">2 pzas</strong> &middot; Demanda proyectada 7 días: <strong className="text-theme-main font-mono">6 pzas</strong> (cobertura &lt; 3 días). El sistema recomienda transferir <strong className="text-purple-700 dark:text-purple-400 font-mono">5 piezas</strong> desde <strong className="text-theme-main">Almacén Principal RTM</strong> (24 disponibles).
 </p>
 </div>
 </div>

 <button
 onClick={handleOpenSuggestedTransfer}
 className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
 >
 <Sparkles className="w-4 h-4" />
 <span>Crear traspaso sugerido</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Helper Informativo de Planeación */}
 <div className="flex items-center justify-between px-2 text-xs text-theme-muted">
 <span className="font-semibold text-theme-main">
 Órdenes de Traspaso &middot; Planeación y Seguimiento entre Instalaciones
 </span>
 <span className="text-[11px] hidden sm:inline-block text-theme-muted">
 La preparación física y recepción de traspasos será gestionada en los módulos de Recolección y Verificación.
 </span>
 </div>

 {/* ========================================================================= */}
 {/* TOOLBAR: NUEVO TRASPASO, BUSCADOR & FILTROS */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
 
 {/* Left: Button & Search */}
 <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
 <button
 onClick={() => {
 setWizardPrefill(null);
 setIsCreateWizardOpen(true);
 }}
 className="w-full sm:w-auto px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
 >
 <Plus className="w-4 h-4" />
 <span>Nuevo traspaso</span>
 </button>

 <div className="relative w-full sm:w-64">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por folio, destino, chofer..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>
 </div>

 {/* Right: Filters */}
 <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
 {/* Tipo de Traspaso */}
 <select
 value={filterType}
 onChange={(e) => setFilterType(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los tipos</option>
 <option value="CEDIS → Sucursal">CEDIS → Sucursal</option>
 <option value="CEDIS → CEDIS">CEDIS → CEDIS</option>
 <option value="Sucursal → CEDIS">Sucursal → CEDIS</option>
 <option value="Sucursal → Sucursal">Sucursal → Sucursal</option>
 </select>

 {/* Estado */}
 <select
 value={filterStatus}
 onChange={(e) => setFilterStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los estados</option>
 <option value="Preparando">Preparando</option>
 <option value="En tránsito">En tránsito</option>
 <option value="Recibido">Recibido</option>
 <option value="Con incidencia">Con incidencia</option>
 <option value="Borrador">Borrador</option>
 </select>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* TABLA PRINCIPAL DE TRASPASOS */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Tipo</th>
 <th className="py-3 px-4">Origen</th>
 <th className="py-3 px-4">Destino</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3">Fecha Planeada</th>
 <th className="py-3 px-4">Chofer / Unidad</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredTransfers.length === 0 ? (
 <tr>
 <td colSpan={9} className="py-12 text-center text-theme-muted text-xs">
 No hay órdenes de traspaso registradas con los filtros aplicados.
 </td>
 </tr>
 ) : (
 filteredTransfers.map((t) => {
 const type = getTransferType(t);

 return (
 <tr key={t.id} className="hover:bg-theme-muted/40 transition-colors">
 {/* Folio */}
 <td className="py-3 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {t.folio}
 </td>

 {/* Tipo */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 type === 'CEDIS → Sucursal'
 ? 'border-purple-500'
 : type === 'CEDIS → CEDIS'
 ? 'border-blue-500'
 : 'border-amber-500'
 }`}>
 {type}
 </span>
 </td>

 {/* Origen */}
 <td className="py-3 px-4 font-medium text-theme-main whitespace-nowrap">
 <div className="flex items-center gap-1.5">
 <Building2 className="w-3.5 h-3.5 text-theme-muted shrink-0" />
 <span>{t.sourceWarehouseName}</span>
 </div>
 </td>

 {/* Destino */}
 <td className="py-3 px-4 font-semibold text-theme-primary whitespace-nowrap">
 <div className="flex items-center gap-1.5">
 {t.destinationWarehouseName.includes('Sucursal') ? (
 <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
 ) : (
 <Building2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 )}
 <span>{t.destinationWarehouseName}</span>
 </div>
 </td>

 {/* Unidades */}
 <td className="py-3 px-3 font-mono font-bold text-theme-main text-center whitespace-nowrap">
 {t.totalUnits} pzas
 </td>

 {/* Fecha Planeada */}
 <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
 {t.plannedDate}
 </td>

 {/* Chofer / Unidad */}
 <td className="py-3 px-4 text-theme-main font-medium whitespace-nowrap">
 {t.driver ? (
 <div className="flex items-center gap-1">
 <Truck className="w-3.5 h-3.5 text-theme-muted shrink-0" />
 <span>{t.driver}</span>
 </div>
 ) : (
 <span className="text-theme-muted italic">Por asignar</span>
 )}
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 t.status === 'Recibido'
 ? 'success'
 : t.status === 'En tránsito'
 ? 'info'
 : t.status === 'Preparando' || t.status === 'Listo para salida'
 ? 'warning'
 : t.status === 'Con incidencia'
 ? 'danger'
 : 'neutral'
 }
 label={t.status}
 size="sm"
 />
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 {/* Ver Detalle */}
 <button
 onClick={() => setSelectedTransfer(t)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-xs font-bold text-theme-main transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-theme-subtle shadow-2xs"
 >
 <Eye className="w-3.5 h-3.5 text-theme-primary" />
 <span>Detalle</span>
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* MODAL DETALLE DE TRASPASO CON UIDS INTERACTIVOS */}
 {/* ========================================================================= */}
 {selectedTransfer && (
 <ModalPortal onClose={() => setSelectedTransfer(null)}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Modal Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center">
 <ArrowLeftRight className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-sm font-bold text-theme-main">
 {selectedTransfer.folio}
 </span>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedTransfer.status)}`}>
 {selectedTransfer.status}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-700 border border-indigo-500/20">
 {getTransferType(selectedTransfer)}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted">
 Ruta: <strong className="text-theme-main">{selectedTransfer.sourceWarehouseName}</strong> &rarr; <strong className="text-theme-main">{selectedTransfer.destinationWarehouseName}</strong>
 </p>
 </div>
 </div>

 <button
 onClick={() => setSelectedTransfer(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
 
 {/* Transport & Schedule Details */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Fecha Salida</span>
 <span className="font-semibold text-theme-main">{selectedTransfer.departureDate || selectedTransfer.plannedDate}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Fecha Llegada</span>
 <span className="font-semibold text-theme-main">{selectedTransfer.arrivalDate || 'En tránsito'}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidad & Placas</span>
 <span className="font-mono font-semibold text-theme-primary">{selectedTransfer.truckPlates || 'NL-8842-A'}</span>
 </div>
 </div>

 {/* Items in Transfer */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Artículos Incluidos en la Orden ({selectedTransfer.totalUnits} unidades totales)
 </span>
 <span className="text-[10px] font-mono text-purple-600 font-bold">
 Clic en cualquier UID para ver detalle individual
 </span>
 </div>

 <div className="space-y-3">
 {selectedTransfer.items.map((item, idx) => (
 <div key={idx} className="p-3.5 rounded-xl border border-theme-subtle bg-theme-surface space-y-2 shadow-xs">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-theme-primary">{item.sku}</span>
 <span className="font-mono text-xs font-bold text-theme-main">{item.quantity} pzas</span>
 </div>
 <p className="text-xs font-bold text-theme-main">{item.productName}</p>

 {item.serials.length > 0 && (
 <div className="pt-2 border-t border-theme-subtle space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Números de Serie Escaneados ({item.serials.length} de {item.quantity}):
 </span>
 <div className="flex flex-wrap gap-1.5">
 {item.serials.map((s, sIdx) => (
 <button
 key={sIdx}
 onClick={() => handleOpenUnit(s, item, selectedTransfer)}
 className="font-mono text-[10px] bg-theme-muted hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-700 px-2.5 py-1 rounded-lg border border-theme-subtle font-bold text-theme-main flex items-center gap-1.5 transition-all cursor-pointer group shadow-2xs"
 title={`Ver ficha individual de unidad ${s}`}
 >
 <QrCode className="w-3 h-3 text-theme-primary group-hover:text-purple-600 transition-colors shrink-0" />
 <span>{s}</span>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Modal Footer */}
 <div className="px-6 py-3 border-t border-theme-subtle flex items-center justify-end bg-theme-muted/40">
 <button
 onClick={() => setSelectedTransfer(null)}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* ========================================================================= */}
 {/* WIZARD DE NUEVO TRASPASO */}
 {/* ========================================================================= */}
 <CreateTransferWizardModal
 isOpen={isCreateWizardOpen}
 onClose={() => {
 setIsCreateWizardOpen(false);
 setWizardPrefill(null);
 }}
 onCreated={handleTransferCreated}
 onNavigateToCollection={(colFolio) => {
 if (onShowToast) {
 onShowToast(`Navegando a Orden de Recolección ${colFolio} (Cola de surtido en almacén)`);
 }
 }}
 prefillData={wizardPrefill}
 />

 {/* ========================================================================= */}
 {/* MODAL DE PREPARACIÓN & SALIDA */}
 {/* ========================================================================= */}
 <PrepareTransferModal
 order={orderToPrepare}
 onClose={() => setOrderToPrepare(null)}
 onConfirmDeparture={handleConfirmDeparture}
 />

 {/* ========================================================================= */}
 {/* MODAL DE RECEPCIÓN EN DESTINO */}
 {/* ========================================================================= */}
 <ReceiveTransferModal
 order={orderToReceive}
 onClose={() => setOrderToReceive(null)}
 onConfirmReceived={handleConfirmReceived}
 />

 {/* ========================================================================= */}
 {/* MODAL APILADO: FICHA INDIVIDUAL DE MATERIAL / TARIMA (Z-INDEX 60) */}
 {/* ========================================================================= */}
 <UnitDetailModal
 unit={selectedUnit}
 warehouseName={selectedUnitRoute ? `${selectedUnitRoute.origin} → ${selectedUnitRoute.destination}` : 'Almacén Principal RTM'}
 transferRoute={selectedUnitRoute}
 onClose={() => {
 setSelectedUnit(null);
 setSelectedUnitRoute(null);
 }}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* MODAL APILADO: VISOR DE CÓDIGO QR (Z-INDEX 70) */}
 {/* ========================================================================= */}
 <QrModal
 unit={selectedQrUnit}
 warehouseName={selectedUnitRoute ? `${selectedUnitRoute.origin} → ${selectedUnitRoute.destination}` : 'Almacén Principal RTM'}
 onClose={() => setSelectedQrUnit(null)}
 onPrint={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* MODAL APILADO: IMPRESIÓN DE ETIQUETA TÉRMICA (Z-INDEX 80) */}
 {/* ========================================================================= */}
 <PrintQrModal
 unit={selectedPrintUnit}
 warehouseName={selectedUnitRoute ? `${selectedUnitRoute.origin} → ${selectedUnitRoute.destination}` : 'Almacén Principal RTM'}
 onClose={() => setSelectedPrintUnit(null)}
 />
 </div>
 );
};
