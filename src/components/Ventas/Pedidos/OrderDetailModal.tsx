import React from 'react';
import {
  X,
  ShoppingBag,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  FileText,
  UserCheck,
  Package,
  Boxes,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  Send
} from 'lucide-react';
import { SalesOrder } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import { ModalPortal } from '../../common/ModalPortal';
import {
  formatCurrencyMXN,
  formatPercentage,
  formatUnits,
  formatDateMX,
} from '../../../utils/formatters';

interface OrderDetailModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthorizationModal?: (order: SalesOrder) => void;
  onAuthorizeOrder?: (orderId: string) => void;
  onNavigateToQuote?: (quoteFolio: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenAuthorizationModal,
  onAuthorizeOrder,
  onNavigateToQuote,
}) => {
  if (!isOpen || !order) return null;

  const getSemanticTone = (status: SalesOrder['status']) => {
    switch (status) {
      case 'Pendiente de autorización':
        return 'warning';
      case 'Autorizado':
        return 'info';
      case 'Pendiente de surtido':
        return 'smart';
      case 'En preparación':
        return 'smart';
      case 'Surtido parcial':
        return 'warning';
      case 'Surtido completo':
        return 'success';
      case 'En verificación de salida':
        return 'info';
      case 'Lista para carga':
        return 'success';
      case 'En ruta':
        return 'info';
      case 'Entregado':
        return 'success';
      case 'Entrega parcial':
        return 'warning';
      case 'Con incidencia':
      case 'Cancelado':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const isPendingAuth = order.status === 'Pendiente de autorización';

  // Determine active pipeline stage index (0 to 5)
  const getStageIndex = (status: SalesOrder['status']): number => {
    switch (status) {
      case 'Pendiente de autorización':
        return 0;
      case 'Autorizado':
      case 'Pendiente de surtido':
        return 1;
      case 'En preparación':
      case 'Surtido parcial':
      case 'Surtido completo':
        return 2;
      case 'En verificación de salida':
      case 'Lista para carga':
        return 3;
      case 'En ruta':
      case 'Entrega parcial':
      case 'Con incidencia':
        return 4;
      case 'Entregado':
        return 5;
      case 'Cancelado':
        return -1;
      default:
        return 1;
    }
  };

  const currentStage = getStageIndex(order.status);

  const stages = [
    { label: 'Autorización', sub: 'Comercial' },
    { label: 'Recolección', sub: 'Mesa Picking' },
    { label: 'Verificación', sub: 'Salida / UIDs' },
    { label: 'Carga', sub: 'Órdenes Salida' },
    { label: 'En ruta', sub: 'Transporte' },
    { label: 'Entregado', sub: 'Destino Final' },
  ];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-2xs text-theme-primary flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-base font-black text-theme-primary">
                    {order.folio}
                  </span>
                  <SemanticBadge
                    tone={getSemanticTone(order.status) as any}
                    label={order.status}
                    size="sm"
                  />
                  {order.originQuoteFolio && (
                    <button
                      type="button"
                      onClick={() => onNavigateToQuote && onNavigateToQuote(order.originQuoteFolio!)}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-purple-600" />
                      <span>Origen: {order.originQuoteFolio}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {order.customerName} &bull; {order.branchName} {order.fulfillmentOriginName && ` &bull; Surtido: ${order.fulfillmentOriginName}`} &bull; Creado: {formatDateMX(order.createdAt)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
            
            {/* Operational Pipeline Stepper */}
            {order.status !== 'Cancelado' && (
              <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">
                    Pipeline Operativo del Pedido
                  </span>
                  <span className="text-[11px] font-bold text-zinc-700">
                    Paso {Math.min(6, Math.max(1, currentStage + 1))} de 6
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {stages.map((stg, idx) => {
                    const isDone = currentStage > idx;
                    const isCurrent = currentStage === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isCurrent
                            ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                            : isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-white border-zinc-200 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 animate-pulse" />
                          ) : (
                            <span className="text-[9px] font-mono text-zinc-400">{idx + 1}</span>
                          )}
                        </div>
                        <span className="text-[10px] block leading-tight truncate">{stg.label}</span>
                        <span className="text-[8px] text-zinc-400 block leading-none truncate">{stg.sub}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status banner */}
            {isPendingAuth ? (
              <div className="p-4 rounded-2xl bg-white border border-amber-500 shadow-2xs flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <span className="font-bold text-zinc-900 text-xs block">
                    Pedido Pendiente de Autorización Comercial
                  </span>
                  <p className="text-[11px] text-zinc-600">
                    {order.authorizationLog?.policyReason || 'Requiere confirmación de gerencia para autorizar el descuento y liberar la orden para surtido.'}
                  </p>
                </div>
              </div>
            ) : order.status === 'Cancelado' ? (
              <div className="p-4 rounded-2xl bg-white border border-rose-500 shadow-2xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-zinc-900 text-xs block">
                    Pedido Cancelado
                  </span>
                  <p className="text-[11px] text-zinc-600">
                    {order.notes || 'El pedido fue cancelado y el inventario reservado fue liberado al almacén.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-emerald-600 shadow-2xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-zinc-900 text-xs block">
                    Pedido Autorizado y en Flujo Operativo
                  </span>
                  <p className="text-[11px] text-zinc-600">
                    Pedido vinculado directamente a la Mesa de Verificación y Embarques para surtido y entrega física.
                  </p>
                </div>
              </div>
            )}

            {/* Operational Links Bar */}
            {order.operationalLinks && Object.keys(order.operationalLinks).length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Documentos Operativos Vinculados
                </span>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {order.operationalLinks.pickOrderFolio && (
                    <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-300 text-sky-900 font-medium flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-sky-600" />
                      <span>Recolección: <strong>{order.operationalLinks.pickOrderFolio}</strong></span>
                    </div>
                  )}
                  {order.operationalLinks.outboundOrderFolio && (
                    <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 font-medium flex items-center gap-1.5">
                      <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Orden Salida: <strong>{order.operationalLinks.outboundOrderFolio}</strong></span>
                    </div>
                  )}
                  {order.operationalLinks.remisionFolio && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Remisión: <strong>{order.operationalLinks.remisionFolio}</strong></span>
                    </div>
                  )}
                  {order.operationalLinks.routeFolio && (
                    <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-medium flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-theme-primary" />
                      <span>Ruta Despacho: <strong>{order.operationalLinks.routeFolio}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cliente</span>
                <p className="font-bold text-zinc-900">{order.customerName}</p>
                <p className="text-[11px] font-mono text-zinc-600">RFC: {order.customerRfc}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-white border border-zinc-300 text-zinc-900 mt-1">
                  Tipo: {order.customerType}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Sucursal & Origen Surtido</span>
                <p className="font-bold text-zinc-900">{order.branchName}</p>
                <p className="text-[11px] text-zinc-600 font-medium text-rose-700">
                  {order.fulfillmentOriginName || 'CEDIS Monterrey Norte'}
                </p>
                <p className="text-[10px] text-zinc-500">Vendedor: {order.sellerName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Entrega & Pago</span>
                <p className="font-semibold text-zinc-900">{order.paymentConditions}</p>
                <p className="text-[11px] text-zinc-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </p>
                <p className="text-[10px] text-zinc-500">Fecha compromiso: {formatDateMX(order.targetDeliveryDate)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <div className="p-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                <span className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                  Partidas del Pedido ({order.items.length})
                </span>
                <span className="text-[11px] text-zinc-500">
                  Unidades Totales: <strong>{formatUnits(order.items.reduce((a, b) => a + b.quantity, 0))}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Artículo</th>
                      <th className="py-2.5 px-2 text-center">Cant.</th>
                      <th className="py-2.5 px-3 text-right">P. Unitario</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-2 text-center">Existencia Local</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/60">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-zinc-900 block">{item.sku}</span>
                          <span className="text-zinc-600 text-[11px] block">{item.productName}</span>
                          <span className="text-[10px] text-zinc-500">{item.brand} &bull; {item.size}</span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-zinc-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-900">
                          {formatCurrencyMXN(item.unitPrice, true, false)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-zinc-900">
                          {formatCurrencyMXN(item.subtotal, true, false)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                            item.localStock >= item.quantity ? 'border-emerald-600' : 'border-amber-500'
                          }`}>
                            {formatUnits(item.localStock)} disp.
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financials & Margins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Rentabilidad Comercial del Pedido</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Venta Neta:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {formatCurrencyMXN(order.financials.subtotal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Costo de Ventas:</span>
                    <span className="font-mono font-bold text-zinc-600">
                      {formatCurrencyMXN(order.financials.estimatedCost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Margen Bruto $:</span>
                    <span className="font-mono font-extrabold text-emerald-700">
                      +{formatCurrencyMXN(order.financials.estimatedMarginAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Margen Bruto %:</span>
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      {formatPercentage(order.financials.estimatedMarginPct, 1)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 italic border-t border-zinc-200 pt-2">
                  * Margen estimado para fines de control comercial.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Subtotal Partidas:</span>
                  <span className="font-mono font-semibold">{formatCurrencyMXN(order.financials.subtotal)}</span>
                </div>
                {order.financials.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 text-xs font-semibold">
                    <span>Descuento Comercial:</span>
                    <span className="font-mono">-{formatCurrencyMXN(order.financials.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>IVA (16%):</span>
                  <span className="font-mono">{formatCurrencyMXN(order.financials.taxIva)}</span>
                </div>
                <div className="flex justify-between text-zinc-900 font-black text-base border-t border-zinc-200 pt-2">
                  <span>Total Pedido:</span>
                  <span className="font-mono text-theme-primary">{formatCurrencyMXN(order.financials.total)}</span>
                </div>
              </div>
            </div>

            {/* Authorization Log */}
            {order.authorizationLog && (
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Bitácora de Autorización</span>
                <p className="text-zinc-900 font-medium">
                  Estado: <strong>{order.authorizationLog.status}</strong> {order.authorizationLog.authorizedBy && `por ${order.authorizationLog.authorizedBy}`} {order.authorizationLog.authorizedAt && `(${order.authorizationLog.authorizedAt})`}
                </p>
                {order.authorizationLog.policyReason && (
                  <p className="text-[11px] text-amber-800 font-medium bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    Motivo: {order.authorizationLog.policyReason}
                  </p>
                )}
                {order.authorizationLog.notes && (
                  <p className="text-[11px] text-zinc-600 italic bg-zinc-50 p-2 rounded-xl border border-zinc-200 mt-1">
                    "{order.authorizationLog.notes}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-3">
            <div>
              {isPendingAuth && onOpenAuthorizationModal && (
                <button
                  type="button"
                  onClick={() => onOpenAuthorizationModal(order)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-amber-500 text-zinc-900 font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Revisar y Autorizar Pedido</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
