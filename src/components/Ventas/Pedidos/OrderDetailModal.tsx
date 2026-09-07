import React, { useState } from 'react';
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
  Send,
  Printer,
  Sparkles,
  Sliders,
  AlertCircle
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
  onNavigateToRequisitions?: (preloadedSku?: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenAuthorizationModal,
  onAuthorizeOrder,
  onNavigateToQuote,
  onNavigateToRequisitions,
}) => {
  const [productionPreparedSuccess, setProductionPreparedSuccess] = useState(false);

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
  const totalUnitsOrdered = order.items.reduce((acc, i) => acc + i.quantity, 0);

  const customerPo = order.customerPo || 'PO-SBD-2026-9921';
  const partNumber = order.partNumber || order.items[0]?.sku || 'NA472050';
  const revision = order.revision || 'Rev 08/23';
  const technology = order.technology || (order.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');
  const isObsoleteRevision = Boolean(order.isObsoleteRevision);
  const hasMaterialAlert = Boolean(order.hasMaterialAlert);

  // PT Inventory Availability figures
  const ptAvailable = order.finishedGoodsStock !== undefined ? order.finishedGoodsStock : 5000;
  const reservableQty = order.reservableQuantity !== undefined ? order.reservableQuantity : Math.min(totalUnitsOrdered, ptAvailable);
  const missingToProduce = order.missingToProduce !== undefined ? order.missingToProduce : Math.max(0, totalUnitsOrdered - reservableQty);

  // Stages in industrial print workflow
  const stages = [
    { label: 'Autorización', sub: 'Comercial' },
    { label: 'Disponibilidad PT', sub: 'Inventario' },
    { label: 'Planeación / OP', sub: 'Offset / Flexo' },
    { label: 'Acabados', sub: 'Corte y Empaque' },
    { label: 'Almacén PT', sub: 'Listo para Entrega' },
    { label: 'Embarque', sub: 'Destino Cliente' },
  ];

  const getStageIndex = (status: SalesOrder['status']): number => {
    switch (status) {
      case 'Pendiente de autorización':
        return 0;
      case 'Autorizado':
      case 'Pendiente de surtido':
        return 1;
      case 'En preparación':
      case 'Surtido parcial':
        return 2;
      case 'Surtido completo':
      case 'En verificación de salida':
        return 3;
      case 'Lista para carga':
        return 4;
      case 'En ruta':
      case 'Entregado':
        return 5;
      default:
        return 1;
    }
  };

  const currentStage = getStageIndex(order.status);

  const handlePrepareForProduction = () => {
    setProductionPreparedSuccess(true);
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-4xl max-h-[92vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-2xs text-theme-primary flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-theme-primary" />
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
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20 shadow-2xs">
                    {technology}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-300 shadow-2xs">
                    PO Cliente: {customerPo}
                  </span>
                  {order.originQuoteFolio && (
                    <button
                      type="button"
                      onClick={() => onNavigateToQuote && onNavigateToQuote(order.originQuoteFolio!)}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-theme-primary/40 shadow-2xs hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-theme-primary" />
                      <span>Cotización: {order.originQuoteFolio}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {order.customerName} &bull; Planta Principal RTM &bull; Fecha requerida: {formatDateMX(order.targetDeliveryDate)}
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
          <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0 text-xs">
            
            {/* Warning: Obsolete Revision */}
            {isObsoleteRevision && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 shadow-xs flex items-start gap-3 animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <span className="font-bold text-amber-900 text-xs block">
                    ¡Atención! La revisión solicitada ({revision}) está marcada como OBSOLETA en el Catálogo RTM.
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Existe una versión vigente más reciente para este número de parte. Se requiere validación formal del cliente antes de liberar la orden a programación de prensas.
                  </p>
                </div>
              </div>
            )}

            {/* Alert: Material Insuficiente */}
            {hasMaterialAlert && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-rose-900 text-xs block">
                      Alerta de Material: Inventario insuficiente para tiraje completo
                    </span>
                    <p className="text-[11px] text-rose-800">
                      Requerimiento estimado para demo: Faltan <strong className="font-mono">4 tarimas</strong> de Papel Couché 90 g (MP-COU-090).
                    </p>
                  </div>
                </div>

                {onNavigateToRequisitions && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToRequisitions('MP-COU-090');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                  >
                    <span>Enviar a Compras</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Production Prepared Success Toast */}
            {productionPreparedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-400 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-emerald-900 text-xs block">
                      Orden preparada para programación de producción.
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Tiraje faltante de <strong className="font-mono">{formatUnits(missingToProduce)} pzas</strong> preasignado tentativamente a línea {technology === 'Offset' ? 'Prensa Heidelberg Speedmaster' : 'Prensa Flexográfica Mark Andy'}. (Demo de preparación comercial).
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-900 border border-emerald-500 shadow-2xs whitespace-nowrap">
                  Pendiente de planeación
                </span>
              </div>
            )}

            {/* BLOQUE DE DISPONIBILIDAD PT & PRODUCCIÓN (FASE 3) */}
            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-theme-primary" />
                  Disponibilidad de Producto Terminado (PT) & Faltante por Producir
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                  Cruce de Inventario RTM
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Cantidad Pedida */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cantidad Pedida</span>
                  <span className="text-xl font-black font-mono text-zinc-900 block">
                    {formatUnits(totalUnitsOrdered)}
                  </span>
                  <span className="text-[10px] text-zinc-400">Total requerido</span>
                </div>

                {/* 2. PT Disponible */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">PT en Almacén</span>
                  <span className="text-xl font-black font-mono text-emerald-600 block">
                    {formatUnits(ptAvailable)}
                  </span>
                  <span className="text-[10px] text-zinc-400">Existencia física</span>
                </div>

                {/* 3. Reservable */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cantidad Reservable</span>
                  <span className="text-xl font-black font-mono text-blue-600 block">
                    {formatUnits(reservableQty)}
                  </span>
                  <span className="text-[10px] text-zinc-400">Asignable de inmediato</span>
                </div>

                {/* 4. Faltante por Producir */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-theme-primary/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-theme-primary block">Faltante por Producir</span>
                  <span className="text-xl font-black font-mono text-theme-primary block">
                    {formatUnits(missingToProduce)}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">Requiere tiraje nuevo</span>
                </div>
              </div>

              {missingToProduce > 0 ? (
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-amber-900 font-medium">
                    {formatUnits(reservableQty)} pzas pueden cubrirse desde producto terminado. Restan {formatUnits(missingToProduce)} pzas por producir.
                  </span>
                  <button
                    type="button"
                    onClick={handlePrepareForProduction}
                    className="px-4 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-center flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Preparar para Producción</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% cubierto con Producto Terminado disponible en Almacén Principal RTM. Listo para empaque y despacho.</span>
                </div>
              )}
            </div>

            {/* Workflow Pipeline Stepper */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">
                  Pipeline Operativo Industrial
                </span>
                <span className="text-[11px] font-bold text-zinc-700">
                  Etapa {Math.min(6, Math.max(1, currentStage + 1))} de 6
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
                          ? 'bg-theme-primary/10 border-theme-primary text-theme-primary font-bold shadow-2xs'
                          : isDone
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 font-semibold'
                          : 'bg-white border-zinc-200 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-theme-primary shrink-0 animate-pulse" />
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

            {/* Customer & Technical Specs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cliente Industrial</span>
                <p className="font-bold text-zinc-900">{order.customerName}</p>
                <p className="text-[11px] font-mono text-zinc-600">RFC: {order.customerRfc}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-white border border-zinc-300 text-zinc-900 mt-1">
                  Convenio Industrial
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Especificación Técnica</span>
                <p className="font-mono font-bold text-theme-primary">{partNumber}</p>
                <p className="text-[11px] text-zinc-800 font-semibold">
                  {revision} &bull; Tecnología: {technology}
                </p>
                <p className="text-[10px] text-zinc-500">PO Cliente: {customerPo}</p>
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
                  Unidades Totales: <strong>{formatUnits(totalUnitsOrdered)} pzas</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Artículo / Descripción</th>
                      <th className="py-2.5 px-2 text-center">Cant. Solicitada</th>
                      <th className="py-2.5 px-3 text-right">P. Unitario</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-2 text-center">Stock PT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/60">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-zinc-900 block">{item.sku}</span>
                          <span className="text-zinc-700 text-[11px] font-medium block">{item.productName}</span>
                          <span className="text-[10px] text-zinc-500">{item.brand} &bull; {item.size}</span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-zinc-900">
                          {formatUnits(item.quantity)} pzas
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-900">
                          {formatCurrencyMXN(item.unitPrice, true, false)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-zinc-900">
                          {formatCurrencyMXN(item.subtotal, true, false)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                            ptAvailable >= item.quantity ? 'border-emerald-600' : 'border-amber-500'
                          }`}>
                            {formatUnits(ptAvailable)} disp. PT
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
                  * Margen paramétrico para control de ventas industriales en Impresos RTM.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Subtotal Partidas:</span>
                  <span className="font-mono font-semibold">{formatCurrencyMXN(order.financials.subtotal)}</span>
                </div>
                {order.financials.discountAmount > 0 && (
                  <div className="flex justify-between text-theme-primary text-xs font-semibold">
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
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Bitácora de Autorización Comercial</span>
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
            <div className="flex items-center gap-2">
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

              {missingToProduce > 0 && !isPendingAuth && (
                <button
                  type="button"
                  onClick={handlePrepareForProduction}
                  className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Preparar para Producción ({formatUnits(missingToProduce)} pzas)</span>
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
