import React from 'react';
import { 
  X, 
  Truck, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Printer, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  MapPin,
  QrCode,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ShippingOutboundOrder } from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';

interface ShippingOrderDetailModalProps {
  order: ShippingOutboundOrder;
  onClose: () => void;
  onOpenAssignTransport: () => void;
  onOpenLoadStep: () => void;
  onOpenRemision: () => void;
}

export const ShippingOrderDetailModal: React.FC<ShippingOrderDetailModalProps> = ({
  order,
  onClose,
  onOpenAssignTransport,
  onOpenLoadStep,
  onOpenRemision,
}) => {
  const isLoadReady = Boolean(order.assignedVehicleId && order.assignedDriverId && order.remisionFolio);
  const isTransfer = order.type === 'Traspaso';

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-black text-theme-primary">
                  {order.folio}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                  order.status === 'Lista para carga'
                    ? 'border-emerald-600 text-emerald-700'
                    : order.status === 'Transporte asignado'
                    ? 'border-blue-500 text-blue-700'
                    : order.status === 'Preparando carga'
                    ? 'border-purple-500 text-purple-700'
                    : 'border-zinc-400 text-zinc-700'
                }`}>
                  {order.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-zinc-300 shadow-2xs bg-white text-zinc-900">
                  {order.type}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Ref: <strong>{order.sourceDocumentFolio}</strong> &bull; Remisión: <strong>{order.remisionFolio}</strong> &rarr; {order.destinationName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRemision}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-theme-primary" />
              <span>Ver remisión</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Info Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Origen</span>
              <strong className="text-zinc-900 text-xs block">{order.originWarehouseName}</strong>
              <span className="text-[10px] font-mono text-zinc-500 block">Carril: {order.assignedLane || 'EMB-01'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                {isTransfer ? 'Instalación Destino' : 'Cliente / Destino'}
              </span>
              <strong className="text-zinc-900 text-xs block">{order.destinationName}</strong>
              <span className="text-[10px] text-zinc-500 truncate block">
                {isTransfer ? order.destinationFacility : order.destinationAddress}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Unidad de Transporte</span>
              <strong className="text-zinc-900 text-xs block">
                {order.assignedVehicleName || 'Sin asignar'}
              </strong>
              <span className="text-[10px] text-zinc-500 block font-mono">
                {order.assignedVehicleId ? 'Vehículo verificado' : 'Requiere asignación'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Chofer Asignado</span>
              <strong className="text-zinc-900 text-xs block">
                {order.assignedDriverName || 'Sin asignar'}
              </strong>
              <span className="text-[10px] text-zinc-500 block font-mono">
                {order.plannedDate ? `${order.plannedDate} ${order.plannedTime || ''}` : 'Fecha pendiente'}
              </span>
            </div>
          </div>

          {/* Transport & Remisión Status Banner */}
          <div className={`p-4 rounded-2xl bg-white border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLoadReady ? 'border-emerald-600' : 'border-amber-400'
          }`}>
            <div className="flex items-center gap-2.5">
              {isLoadReady ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-zinc-900">
                  {isLoadReady
                    ? 'Requisitos completos: Listo para secuenciación de carga'
                    : 'Faltan requisitos para iniciar carga (Transporte o Chofer sin asignar)'}
                </p>
                <p className="text-[11px] text-zinc-600">
                  Remisión amparada: <strong>{order.remisionFolio}</strong> &bull; Total: <strong>{order.totalUnits} piezas</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenAssignTransport}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-zinc-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-theme-primary" />
                <span>{order.assignedVehicleId ? 'Cambiar transporte' : 'Asignar transporte'}</span>
              </button>

              <button
                onClick={onOpenLoadStep}
                disabled={!isLoadReady}
                className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isLoadReady
                    ? 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-md'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Cargar</span>
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">
                Partidas & UIDs Asignados ({order.items.length} productos)
              </h4>
              <span className="font-mono font-bold text-zinc-900 text-xs">
                Total: {order.totalUnits} unidades
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">SKU / Artículo</th>
                    <th className="py-2.5 px-3">Marca & Medida</th>
                    <th className="py-2.5 px-3 text-center">Cantidad</th>
                    <th className="py-2.5 px-3">UIDs Serializados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-sans">
                  {order.items.map((it) => (
                    <tr key={it.sku} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-3">
                        <strong className="text-zinc-900 block">{it.productName}</strong>
                        <span className="font-mono text-[10px] text-zinc-500">{it.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-600">
                        {it.brand} &bull; {it.size}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-zinc-900">
                        {it.quantity} u.
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {it.uids.map((uid) => (
                            <span 
                              key={uid}
                              className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-zinc-900 border border-zinc-300"
                            >
                              {uid}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes if present */}
          {order.notes && (
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-0.5">
              <span className="font-bold text-zinc-500 text-[10px] uppercase block">Observaciones</span>
              <p className="text-zinc-800 text-[11px]">{order.notes}</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-surface text-xs">
          <span className="font-mono text-zinc-500 text-[11px]">
            Embarques & Entregas &bull; Impresos RTM ERP
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </ModalPortal>
  );
};
