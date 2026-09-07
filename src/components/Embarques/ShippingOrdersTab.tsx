import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Eye, 
  Truck, 
  User, 
  Send, 
  FileText, 
  Printer, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { 
  ShippingOutboundOrder, 
  INITIAL_MOCK_SHIPPING_ORDERS, 
  getShippingOrdersList,
  assignTransportToOrder 
} from '../../data/mockShippingData';
import { 
  FinishedGoodsRelease, 
  finishedGoodToShippingOrder 
} from '../../data/mockFinishedGoodsData';
import { getRemisionForOutboundOrder, OutboundRemision, getRemisionesList } from '../../data/mockRemisionesData';
import { StatusBadge } from '../common/StatusBadge';
import { AssignTransportModal } from './AssignTransportModal';
import { ShippingOrderDetailModal } from './ShippingOrderDetailModal';
import { ShippingLoadWizardModal } from './ShippingLoadWizardModal';
import { RemisionPreviewModal } from '../MesaVerificacion/Outbound/RemisionPreviewModal';

interface ShippingOrdersTabProps {
  onNavigateToInRoute?: () => void;
  releasedFinishedGoods?: FinishedGoodsRelease[];
  onOpenPtDetail?: (pt: FinishedGoodsRelease) => void;
}

export const ShippingOrdersTab: React.FC<ShippingOrdersTabProps> = ({
  onNavigateToInRoute,
  releasedFinishedGoods,
  onOpenPtDetail,
}) => {
  const [orders, setOrders] = useState<ShippingOutboundOrder[]>(() => {
    const base = getShippingOrdersList();
    if (releasedFinishedGoods && releasedFinishedGoods.length > 0) {
      const mapped = releasedFinishedGoods.map((pt, idx) => finishedGoodToShippingOrder(pt, idx));
      const existing = new Set(mapped.map((m) => m.folio));
      return [...mapped, ...base.filter((b) => !existing.has(b.folio))];
    }
    return base;
  });

  React.useEffect(() => {
    if (releasedFinishedGoods && releasedFinishedGoods.length > 0) {
      setOrders((prev) => {
        const mapped = releasedFinishedGoods.map((pt, idx) => finishedGoodToShippingOrder(pt, idx));
        const existing = new Set(prev.map((p) => p.folio));
        const newItems = mapped.filter((m) => !existing.has(m.folio));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    }
  }, [releasedFinishedGoods]);

  const recentPt = releasedFinishedGoods?.find((pt) => pt.isRecentRelease) || releasedFinishedGoods?.[0];
  const matchingRecentOrder = recentPt ? orders.find((o) => o.folio === `OS-${recentPt.lotNumber}`) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Venta' | 'Traspaso'>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('Todos');
  const [driverFilter, setDriverFilter] = useState<string>('Todos');
  const [vehicleFilter, setVehicleFilter] = useState<string>('Todos');

  // Modals state
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<ShippingOutboundOrder | null>(null);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<ShippingOutboundOrder | null>(null);
  const [selectedOrderForLoad, setSelectedOrderForLoad] = useState<ShippingOutboundOrder | null>(null);
  const [selectedRemisionForPreview, setSelectedRemisionForPreview] = useState<OutboundRemision | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      o.folio.toLowerCase().includes(q) ||
      o.sourceDocumentFolio.toLowerCase().includes(q) ||
      o.destinationName.toLowerCase().includes(q) ||
      o.remisionFolio.toLowerCase().includes(q) ||
      (o.assignedVehicleName && o.assignedVehicleName.toLowerCase().includes(q)) ||
      (o.assignedDriverName && o.assignedDriverName.toLowerCase().includes(q)) ||
      o.items.some((it) => it.sku.toLowerCase().includes(q) || it.productName.toLowerCase().includes(q));

    const matchType = typeFilter === 'Todos' || o.type === typeFilter;
    const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
    const matchWarehouse = warehouseFilter === 'Todos' || o.originWarehouseName === warehouseFilter;
    const matchDriver = driverFilter === 'Todos' || o.assignedDriverName === driverFilter;
    const matchVehicle = vehicleFilter === 'Todos' || o.assignedVehicleName === vehicleFilter;

    return matchSearch && matchType && matchStatus && matchWarehouse && matchDriver && matchVehicle;
  });

  const handleConfirmAssignTransport = (
    orderId: string,
    vehicleId: string,
    driverId: string,
    plannedDate: string,
    plannedTime: string,
    notes?: string
  ) => {
    const updated = assignTransportToOrder(orderId, vehicleId, driverId, plannedDate, plannedTime, notes);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...updated } : o)));
      if (selectedOrderForDetail && selectedOrderForDetail.id === orderId) {
        setSelectedOrderForDetail({ ...updated });
      }
      setSelectedOrderForAssign(null);
      showToast(`✓ Transporte y chofer asignados a orden ${updated.folio}.`);
    }
  };

  // Helper to open Remisión preview for an order
  const handleOpenRemisionForOrder = (order: ShippingOutboundOrder) => {
    const remList = getRemisionesList();
    const foundRem = remList.find((r) => r.folio === order.remisionFolio || r.sourceDocumentFolio === order.sourceDocumentFolio);
    
    if (foundRem) {
      setSelectedRemisionForPreview(foundRem);
    } else {
      // Fallback synthetic remision if not found
      const isTransfer = order.type === 'Traspaso';
      const fallbackRem: OutboundRemision = {
        id: `rem-gen-${order.id}`,
        folio: order.remisionFolio,
        type: order.type,
        status: 'Remisión generada',
        outboundOrderFolio: order.folio,
        sourceDocumentFolio: order.sourceDocumentFolio,
        sourceDocumentType: order.sourceDocumentType,
        createdAt: order.createdAt,
        originWarehouseId: order.originWarehouseId,
        originWarehouseName: order.originWarehouseName,
        destinationName: order.destinationName,
        destinationAddress: isTransfer ? undefined : order.destinationAddress,
        destinationFacility: isTransfer ? order.destinationFacility : undefined,
        assignedLane: order.assignedLane,
        operatorAssigned: order.assignedDriverName || 'Operador Mesa de Salida',
        totalUnits: order.totalUnits,
        observations: order.notes,
        qrPayload: `REM=${order.remisionFolio}|TYPE=${isTransfer ? 'TRANSFER' : 'SALE'}|REF=${order.sourceDocumentFolio}`,
        items: order.items.map((it) => ({
          sku: it.sku,
          productName: it.productName,
          brand: it.brand,
          size: it.size,
          quantity: it.quantity,
          uids: it.uids,
        })),
        signatures: {
          deliveredByLabel: isTransfer ? 'Entregó (CEDIS Emisor)' : 'Entregó (Chofer / Mesa de Salida)',
          deliveredByName: order.assignedDriverName || 'Mesa de Salida',
          receivedByLabel: isTransfer ? 'Recibió en instalación' : 'Recibió de conformidad',
          receivedByName: order.destinationName,
          signeeNameLabel: isTransfer ? 'Responsable de Sucursal' : 'Nombre del Receptor',
          signeeName: order.destinationName,
          dateTimeLabel: isTransfer ? 'Fecha y hora de recepción' : 'Fecha y hora de entrega',
        },
      };
      setSelectedRemisionForPreview(fallbackRem);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar orden, pedido, traspaso, cliente, destino o remisión..."
            className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          
          {/* Filter Tipo */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 block">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
                <option value="Todos">Todos los tipos</option>
                <option value="Venta">Venta</option>
                <option value="Traspaso">Traspaso</option>
                <option value="Despacho B2B">Despacho B2B</option>
              </select>
          </div>

          {/* Filter Estado */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 block">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Lista para carga">Lista para carga</option>
              <option value="Transporte asignado">Transporte asignado</option>
              <option value="Preparando carga">Preparando carga</option>
              <option value="En ruta">En ruta</option>
            </select>
          </div>

          {/* Filter Origen */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 block">Origen</label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="Todos">Todos los CEDIS</option>
              <option value="Almacén Principal RTM">Almacén Principal RTM</option>
              <option value="Almacén Producto Terminado">Almacén Producto Terminado</option>
            </select>
          </div>

          {/* Filter Chofer */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 block">Chofer</label>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="Todos">Todos los choferes</option>
              <option value="Roberto Garza">Roberto Garza</option>
              <option value="Luis Herrera">Luis Herrera</option>
              <option value="Javier Salinas">Javier Salinas</option>
              <option value="Carlos Medina">Carlos Medina</option>
            </select>
          </div>

          {/* Filter Vehículo */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 block">Vehículo</label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="Todos">Todos los vehículos</option>
              <option value="Camión #08 · Isuzu NPR">Camión #08 · Isuzu NPR</option>
              <option value="Camión #12 · Hino 300">Camión #12 · Hino 300</option>
              <option value="Unidad #15 · Freightliner M2">Unidad #15 · Freightliner M2</option>
              <option value="Unidad #04 · Nissan Cabstar">Unidad #04 · Nissan Cabstar</option>
            </select>
          </div>

        </div>

      </div>

      {/* Featured Card: Lote PT recién liberado por Calidad */}
      {recentPt && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 text-xs shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                    ✓ RECIÉN LIBERADO POR CALIDAD
                  </span>
                  <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 text-[10px]">
                    Listo para Carga y Despacho
                  </span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-black text-xs">
                    Lote: {recentPt.lotNumber}
                  </span>
                  <span className="font-mono text-theme-muted text-[11px]">
                    Orden Salida: OS-{recentPt.lotNumber}
                  </span>
                </div>

                <h3 className="text-base font-black text-theme-main">
                  {recentPt.client} · {recentPt.partNumber} ({recentPt.finishedQty.toLocaleString()} pzas)
                </h3>

                <p className="text-theme-muted text-[11px] leading-relaxed max-w-3xl">
                  Inspección final de calidad AQL 0.65 concluida por <b className="text-theme-main">{recentPt.releasedBy}</b>. Baches estibados en <b className="font-mono text-theme-main">{recentPt.warehouseName} ({recentPt.location})</b>. Orden de salida lista para asignación y validación de carga.
                </p>

                <div className="pt-1.5 flex flex-wrap items-center gap-3 text-[11px]">
                  <div>
                    <span className="text-theme-muted">Presentación: </span>
                    <b className="text-theme-main font-bold">{recentPt.packageCount || 50} bultos tarimados</b>
                  </div>
                  <div className="h-3 w-px bg-theme-subtle" />
                  <div>
                    <span className="text-theme-muted">Pedido Origen: </span>
                    <b className="font-mono text-theme-main font-bold">{recentPt.pedido}</b>
                  </div>
                  <div className="h-3 w-px bg-theme-subtle" />
                  <div>
                    <span className="text-theme-muted">OP Fabril: </span>
                    <b className="font-mono text-theme-main font-bold">{recentPt.opFolio}</b>
                  </div>
                  <div className="h-3 w-px bg-theme-subtle" />
                  <div>
                    <span className="text-theme-muted">Andén Sugerido: </span>
                    <b className="font-mono text-theme-main font-bold">EMB-02 (Rampa PT)</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const targetOrder = matchingRecentOrder || finishedGoodToShippingOrder(recentPt);
                  setSelectedOrderForLoad(targetOrder);
                }}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-black shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Preparar salida
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPtDetail?.(recentPt)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/40 text-theme-main px-3 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-theme-primary" />
                  Ver Ficha PT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const targetOrder = matchingRecentOrder || finishedGoodToShippingOrder(recentPt);
                    setSelectedOrderForAssign(targetOrder);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/40 text-theme-main px-3 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-theme-primary" />
                  Asignar Unidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sugerencia del sistema morada (IA Logística) */}
      <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-600 px-2 py-0.5 text-[9px] font-black uppercase text-white">
                SISTEMA
              </span>
              <span className="font-bold text-purple-900 dark:text-purple-300">
                Consolidación Inteligente de Salidas de Producto Terminado
              </span>
            </div>
            <p className="text-theme-muted text-[11px] mt-1">
              Se detectaron baches de Fresenius Kabi y Black & Decker listos en Almacén PT Nave 1. Puedes despacharlos en la ruta de las 16:00 h (Camión #08 · Isuzu NPR) ahorrando 45 minutos de recorrido metropolitano.
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Orden de Salida</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Doc. Origen</th>
                <th className="py-3 px-3">Cliente / Destino</th>
                <th className="py-3 px-3">Origen</th>
                <th className="py-3 px-3 text-center">Unidades</th>
                <th className="py-3 px-3">Remisión</th>
                <th className="py-3 px-3">Unidad de Transporte</th>
                <th className="py-3 px-3">Chofer</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle font-sans">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-theme-muted">
                    No se encontraron órdenes de salida con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isLoadReady = Boolean(order.assignedVehicleId && order.assignedDriverId && order.remisionFolio);

                  return (
                    <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
                      
                      {/* Folio */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-black text-theme-primary">
                        {order.folio}
                      </td>

                      {/* Tipo */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                          order.type === 'Venta'
                            ? 'border-blue-500 text-blue-800'
                            : order.type === 'Despacho B2B'
                            ? 'border-emerald-500 text-emerald-800'
                            : 'border-purple-500 text-purple-800'
                        }`}>
                          {order.type}
                        </span>
                      </td>

                      {/* Doc Origen */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-theme-primary">
                        {order.sourceDocumentFolio}
                      </td>

                      {/* Cliente / Destino */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-extrabold text-theme-main max-w-[200px] truncate" title={order.destinationName}>
                        {order.destinationName}
                      </td>

                      {/* Origen */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-theme-muted font-medium">
                        {order.originWarehouseName}
                      </td>

                      {/* Unidades */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
                        {order.totalUnits} u.
                      </td>

                      {/* Remisión */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenRemisionForOrder(order)}
                          className="font-mono text-[11px] font-bold text-zinc-800 hover:text-theme-primary flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-zinc-300 shadow-2xs"
                          title="Ver documento oficial de remisión"
                        >
                          <FileText className="w-3 h-3 text-theme-primary shrink-0" />
                          <span>{order.remisionFolio}</span>
                        </button>
                      </td>

                      {/* Unidad de Transporte */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {order.assignedVehicleName ? (
                          <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <span>{order.assignedVehicleName}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-500 border border-zinc-300 shadow-2xs">
                            Sin asignar
                          </span>
                        )}
                      </td>

                      {/* Chofer */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {order.assignedDriverName ? (
                          <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <span>{order.assignedDriverName}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-500 border border-zinc-300 shadow-2xs">
                            Sin asignar
                          </span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge
                          variant={
                            order.status === 'Lista para carga'
                              ? 'success'
                              : order.status === 'Transporte asignado'
                              ? 'info'
                              : order.status === 'Preparando carga'
                              ? 'smart'
                              : 'neutral'
                          }
                          label={order.status}
                          size="sm"
                        />
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Detalle */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForDetail(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Ver detalle de orden"
                          >
                            <Eye className="w-3.5 h-3.5 text-theme-primary" />
                            <span>Detalle</span>
                          </button>

                          {/* Asignar transporte */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForAssign(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Asignar o cambiar unidad vehicular y chofer"
                          >
                            <Truck className="w-3.5 h-3.5 text-theme-primary" />
                            <span>{order.assignedVehicleId ? 'Cambiar' : 'Asignar'}</span>
                          </button>

                          {/* Cargar */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForLoad(order)}
                            disabled={!isLoadReady}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                              isLoadReady
                                ? 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-md'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
                            }`}
                            title={
                              isLoadReady
                                ? 'Iniciar proceso de carga'
                                : 'Requiere transporte asignado, chofer y remisión válida'
                            }
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Cargar</span>
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

      {/* Modals */}
      {selectedOrderForDetail && (
        <ShippingOrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onOpenAssignTransport={() => {
            setSelectedOrderForAssign(selectedOrderForDetail);
          }}
          onOpenLoadStep={() => {
            setSelectedOrderForLoad(selectedOrderForDetail);
          }}
          onOpenRemision={() => {
            handleOpenRemisionForOrder(selectedOrderForDetail);
          }}
        />
      )}

      {selectedOrderForAssign && (
        <AssignTransportModal
          order={selectedOrderForAssign}
          onClose={() => setSelectedOrderForAssign(null)}
          onConfirm={handleConfirmAssignTransport}
        />
      )}

      {selectedOrderForLoad && (
        <ShippingLoadWizardModal
          order={selectedOrderForLoad}
          onClose={() => setSelectedOrderForLoad(null)}
          onCompleteWizard={(updated, createdRoute) => {
            setOrders(getShippingOrdersList());
            setSelectedOrderForLoad(null);
            showToast(`✓ Carga confirmada. Ruta ${createdRoute ? createdRoute.folio : ''} en curso.`);
          }}
          onNavigateToInRoute={() => {
            setSelectedOrderForLoad(null);
            if (onNavigateToInRoute) {
              onNavigateToInRoute();
            }
          }}
        />
      )}

      {selectedRemisionForPreview && (
        <RemisionPreviewModal
          remision={selectedRemisionForPreview}
          isOrderComplete={true}
          onClose={() => setSelectedRemisionForPreview(null)}
          onPrinted={(updated) => {
            showToast(`✓ Remisión ${updated.folio} impresa.`);
          }}
        />
      )}

    </div>
  );
};
