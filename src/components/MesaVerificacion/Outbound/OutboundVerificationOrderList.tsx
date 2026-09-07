import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  MapPin, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  FileText,
  Printer
} from 'lucide-react';
import { OutboundVerificationOrder } from '../../../data/mockOutboundVerificationData';
import { getOrCreateRemisionForOrder, OutboundRemision } from '../../../data/mockRemisionesData';
import { StatusBadge } from '../../common/StatusBadge';
import { RemisionPreviewModal } from './RemisionPreviewModal';

interface OutboundVerificationOrderListProps {
  orders: OutboundVerificationOrder[];
  onSelectOrder: (order: OutboundVerificationOrder) => void;
}

export const OutboundVerificationOrderList: React.FC<OutboundVerificationOrderListProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewRemisionOrder, setPreviewRemisionOrder] = useState<OutboundVerificationOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const rem = getOrCreateRemisionForOrder(o);
    return (
      !q ||
      o.folio.toLowerCase().includes(q) ||
      o.pickOrderFolio.toLowerCase().includes(q) ||
      o.referenceFolio.toLowerCase().includes(q) ||
      o.destinationName.toLowerCase().includes(q) ||
      o.assignedLane.toLowerCase().includes(q) ||
      o.operatorAssigned.toLowerCase().includes(q) ||
      rem.folio.toLowerCase().includes(q) ||
      o.items.some((it) => it.uid.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por folio VS, remisión (REM-...), recolección, carril o destino..."
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
      </div>

      {/* Orders Table */}
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Folio Salida / Remisión</th>
                <th className="py-3 px-3">Recolección / Ref</th>
                <th className="py-3 px-3">Origen</th>
                <th className="py-3 px-3">Destino</th>
                <th className="py-3 px-3">Carril</th>
                <th className="py-3 px-3 text-center">Unidades</th>
                <th className="py-3 px-3 text-center">Validadas</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle font-sans">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-theme-muted">
                    No se encontraron órdenes de verificación de salida registradas.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const rem = getOrCreateRemisionForOrder(order);
                  const isComplete = order.status === 'Lista para carga';

                  return (
                    <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-black text-theme-primary block">
                          {order.folio}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewRemisionOrder(order)}
                          className="font-mono text-[10px] text-zinc-700 hover:text-theme-primary flex items-center gap-1 cursor-pointer font-bold mt-0.5"
                          title="Ver remisión"
                        >
                          <FileText className="w-3 h-3 text-theme-primary" />
                          <span>{rem.folio}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-theme-primary block">{order.pickOrderFolio}</span>
                        <span className="font-mono text-[10px] text-theme-muted">{order.referenceFolio}</span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-bold text-theme-main">
                        {order.warehouseName}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-extrabold text-theme-main">
                        {order.destinationName}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
                          {order.assignedLane}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
                        {order.totalUnits} u.
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
                        {order.validatedUnits} / {order.totalUnits}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge
                          variant={
                            order.status === 'Lista para carga'
                              ? 'success'
                              : order.status === 'En validación'
                              ? 'info'
                              : order.status === 'Con diferencia'
                              ? 'warning'
                              : order.status === 'Cancelada'
                              ? 'neutral'
                              : 'warning'
                          }
                          label={order.status}
                          size="sm"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
                        {order.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isComplete && (
                            <button
                              type="button"
                              onClick={() => setPreviewRemisionOrder(order)}
                              className="p-1.5 rounded-xl bg-white hover:bg-theme-muted text-theme-main border border-theme-subtle transition-all shadow-xs cursor-pointer"
                              title="Vista previa e imprimir remisión"
                            >
                              <Printer className="w-3.5 h-3.5 text-theme-primary" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-theme-primary" />
                            <span>{order.status === 'Lista para carga' ? 'Detalle' : 'Continuar'}</span>
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

      {/* Remisión Preview Modal triggered from list */}
      {previewRemisionOrder && (
        <RemisionPreviewModal
          remision={getOrCreateRemisionForOrder(previewRemisionOrder)}
          isOrderComplete={previewRemisionOrder.status === 'Lista para carga'}
          onClose={() => setPreviewRemisionOrder(null)}
        />
      )}
    </div>
  );
};
