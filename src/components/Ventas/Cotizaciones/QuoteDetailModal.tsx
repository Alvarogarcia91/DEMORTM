import React, { useState } from 'react';
import {
  X,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  XCircle,
  Package,
  UserCheck,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Printer,
  Sliders
} from 'lucide-react';
import { SalesQuote } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import {
  formatCurrencyMXN,
  formatPercentage,
  formatUnits,
  formatDateMX,
} from '../../../utils/formatters';

interface QuoteDetailModalProps {
  quote: SalesQuote | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthorizationModal?: (quote: SalesQuote) => void;
  onUpdateQuoteStatus?: (quoteId: string, newStatus: SalesQuote['status'], extra?: Partial<SalesQuote>) => void;
  onGenerateOrder?: (quote: SalesQuote) => void;
  onNavigateToOrder?: (orderFolio: string) => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  quote,
  isOpen,
  onClose,
  onOpenAuthorizationModal,
  onUpdateQuoteStatus,
  onGenerateOrder,
  onNavigateToOrder,
}) => {
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);

  if (!isOpen || !quote) return null;

  const getSemanticTone = (status: SalesQuote['status']) => {
    switch (status) {
      case 'Borrador':
        return 'neutral';
      case 'Pendiente de autorización':
        return 'warning';
      case 'Autorizada':
        return 'success';
      case 'Enviada al cliente':
        return 'info';
      case 'Aceptada':
        return 'success';
      case 'Rechazada':
        return 'danger';
      case 'Vencida':
        return 'neutral';
      case 'Convertida en pedido':
        return 'smart';
      default:
        return 'neutral';
    }
  };

  const isPendingAuth = quote.status === 'Pendiente de autorización';
  const isAuthorized = quote.status === 'Autorizada';
  const isSent = quote.status === 'Enviada al cliente';
  const isAccepted = quote.status === 'Aceptada';
  const isConverted = quote.status === 'Convertida en pedido' || Boolean(quote.generatedOrderFolio);

  const handleGenerateOrderClick = () => {
    if (onGenerateOrder) {
      onGenerateOrder(quote);
      setOrderCreatedSuccess(true);
    }
  };

  const totalUnits = quote.items.reduce((acc, i) => acc + i.quantity, 0);
  const technology = quote.technology || (quote.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');
  const partNumber = quote.partNumber || quote.items[0]?.sku || 'BD-MAN-024';
  const revision = quote.revision || 'Rev B';
  const specSummary = quote.specSummary || 'Interiores papel couché 90 g a 1x1 tintas, portada couché 150 g a 4x4 tintas con barniz UV brillante. Doblez y grapa a caballo.';
  const requiredDate = quote.requiredDate || '30 Ago 2026';

  // Costing Estimate Mock
  const costing = quote.costingEstimate || {
    materialsCost: Math.round(quote.financials.estimatedCost * 0.52),
    processMachineCost: Math.round(quote.financials.estimatedCost * 0.28),
    finishesCost: Math.round(quote.financials.estimatedCost * 0.12),
    setupCost: Math.round(quote.financials.estimatedCost * 0.08),
    estimatedWasteCost: Math.round(quote.financials.estimatedCost * 0.05),
    estimatedTotalCost: quote.financials.estimatedCost,
    targetMarginPct: quote.financials.estimatedMarginPct,
    proposedPrice: quote.financials.subtotalNet,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-2xs text-theme-primary flex items-center justify-center">
              <Printer className="w-6 h-6 text-theme-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-base font-black text-theme-primary">
                  {quote.folio}
                </span>
                <SemanticBadge
                  tone={getSemanticTone(quote.status) as any}
                  label={quote.status}
                  size="sm"
                />
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20 shadow-2xs">
                  {technology}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                  {quote.priceListName}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {quote.customerName} &bull; Planta Principal RTM &bull; Emisión: {formatDateMX(quote.createdAt)}
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
          
          {/* Order Created Success Banner */}
          {orderCreatedSuccess && (
            <div className="p-4 rounded-2xl bg-white border border-theme-primary shadow-2xs flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-theme-primary shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-zinc-900 text-xs block">
                  Pedido comercial generado a partir de esta cotización.
                </span>
                <p className="text-[11px] text-zinc-500">
                  El pedido ha quedado vinculado con el folio <strong className="text-zinc-900 font-mono">{quote.generatedOrderFolio || 'PED-RTM-2026-0142'}</strong> y está disponible en la vista de Pedidos para análisis de disponibilidad PT.
                </p>
              </div>
              {onNavigateToOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToOrder(quote.generatedOrderFolio || 'PED-RTM-2026-0142');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Pedido</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Industrial Work Specification Banner */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-theme-primary" />
                Especificación Técnica del Trabajo
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-theme-primary bg-white px-2 py-0.5 rounded-md border border-theme-primary/30">
                  Parte: {partNumber}
                </span>
                <span className="font-mono text-xs font-black text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-zinc-300">
                  {revision}
                </span>
                <span className="font-mono text-xs text-zinc-600 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                  Tecnología: {technology}
                </span>
              </div>
            </div>
            <p className="text-zinc-800 text-xs leading-relaxed font-medium">
              {specSummary}
            </p>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200">
              <span>Fecha requerida por cliente: <strong className="text-zinc-900">{requiredDate}</strong></span>
              <span>Tiraje cotizado: <strong className="text-zinc-900 font-mono">{formatUnits(totalUnits)} pzas</strong></span>
            </div>
          </div>

          {/* Customer & Commercial Conditions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Cliente */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cliente Industrial</span>
              <p className="font-bold text-zinc-900">{quote.customerName}</p>
              <p className="text-[11px] font-mono text-zinc-600">RFC: {quote.customerRfc}</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-zinc-300 text-zinc-900 mt-1 shadow-2xs">
                Convenio Industrial
              </span>
            </div>

            {/* 2. Planta / Tarifa */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Planta & Tarifa Comercial</span>
              <p className="font-bold text-zinc-900">Planta Principal RTM (Guadalupe)</p>
              <p className="text-[11px] font-semibold text-zinc-800">{quote.priceListName}</p>
              <p className="text-[10px] text-zinc-500 pt-0.5">Tarifa vigente aplicada al cliente</p>
              <p className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-100">
                Ejecutivo: <span className="font-medium text-zinc-800">{quote.sellerName}</span>
              </p>
            </div>

            {/* 3. Condiciones & Vigencia */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Condiciones & Vigencia</span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Condición de pago</span>
                  <p className="text-zinc-900 font-bold">{quote.paymentConditions || 'Crédito a 30 días'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Vigencia</span>
                  <p className="text-zinc-800 font-semibold">Hasta {formatDateMX(quote.validUntil)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Tiempo estimado de entrega</span>
                  <p className="text-zinc-600 font-medium">{quote.estimatedDeliveryDays || 5} días hábiles tras Vo.Bo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                Partidas Cotizadas ({quote.items.length})
              </h4>
              <span className="text-[11px] font-medium text-zinc-500">
                Total Piezas: <strong className="text-zinc-900 font-bold">{formatUnits(totalUnits)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Artículo / Descripción</th>
                    <th className="py-2.5 px-2 text-center">Tiraje Solicitado</th>
                    <th className="py-2.5 px-3 text-right">Precio Lista</th>
                    <th className="py-2.5 px-2 text-center">Descuento</th>
                    <th className="py-2.5 px-3 text-right">Precio Unitario</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-2 text-center">Stock PT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {quote.items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-zinc-900 block">{item.sku}</span>
                        <span className="text-zinc-700 font-medium text-xs block">{item.productName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-zinc-500">{item.brand} &bull; {item.size}</span>
                          {item.hasVolumeTierApplied && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-theme-primary text-zinc-900 shadow-2xs">
                              Escala por volumen
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold font-mono text-zinc-900">
                        {formatUnits(item.quantity)} pzas
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-600">
                        {formatCurrencyMXN(item.listPrice, true, false)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {item.discountPct > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-theme-primary text-zinc-900 shadow-2xs whitespace-nowrap">
                            {formatPercentage(item.discountPct, 0)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">
                        {formatCurrencyMXN(item.netPrice, true, false)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-zinc-900">
                        {formatCurrencyMXN(item.subtotal, true, false)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          title={`${item.localStock} piezas en almacén PT`}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 whitespace-nowrap ${
                            item.localStock >= item.quantity ? 'border-emerald-600' : 'border-amber-500'
                          }`}
                        >
                          {formatUnits(item.localStock)} disp. PT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen Estimado de Costeo Industrial (MOCK FASE 3) */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-theme-primary" />
                Resumen Estimado de Costeo Industrial (MOCK Demo)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                Modelo Paramétrico RTM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">1. Materiales</span>
                <span className="font-mono font-black text-zinc-900 text-sm block">
                  {formatCurrencyMXN(costing.materialsCost)}
                </span>
                <span className="text-[10px] text-zinc-400">Papel, tintas, barniz, placas</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">2. Proceso / Máquina</span>
                <span className="font-mono font-black text-zinc-900 text-sm block">
                  {formatCurrencyMXN(costing.processMachineCost)}
                </span>
                <span className="text-[10px] text-zinc-400">Horas prensa Offset / Flexo</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">3. Acabados</span>
                <span className="font-mono font-black text-zinc-900 text-sm block">
                  {formatCurrencyMXN(costing.finishesCost)}
                </span>
                <span className="text-[10px] text-zinc-400">Corte, doblez, grapa, empaque</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">4. Setup & Merma</span>
                <span className="font-mono font-black text-zinc-900 text-sm block">
                  {formatCurrencyMXN((costing.setupCost || 0) + (costing.estimatedWasteCost || 0))}
                </span>
                <span className="text-[10px] text-zinc-400">Puesta a punto y merma estimada</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/60 border border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 text-[11px] block">Costo Estimado Total:</span>
                <span className="font-mono font-bold text-zinc-900 text-base">
                  {formatCurrencyMXN(costing.estimatedTotalCost)}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px] block">Margen Objetivo:</span>
                <span className="font-mono font-extrabold text-emerald-700 text-base">
                  {formatPercentage(costing.targetMarginPct || 0, 1)} ({formatCurrencyMXN((costing.proposedPrice || 0) - (costing.estimatedTotalCost || 0))})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px] block">Precio Propuesto (Neto):</span>
                <span className="font-mono font-black text-theme-primary text-base">
                  {formatCurrencyMXN(costing.proposedPrice)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 italic">
              * Estimación demo. El costeo productivo definitivo será parametrizado con reglas, capacidades, materiales y tiempos RTM.
            </p>
          </div>

          {/* Totals Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs space-y-2 max-w-md ml-auto">
            <div className="flex justify-between text-zinc-600 text-xs">
              <span>Subtotal lista:</span>
              <span className="font-mono font-semibold text-zinc-900">{formatCurrencyMXN(quote.financials.subtotalList)}</span>
            </div>
            {quote.financials.totalDiscountAmount > 0 && (
              <div className="flex justify-between text-zinc-600 text-xs">
                <span>Descuento acordado:</span>
                <span className="font-mono font-semibold text-theme-primary">-{formatCurrencyMXN(quote.financials.totalDiscountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200 text-xs">
              <span>Subtotal neto:</span>
              <span className="font-mono">{formatCurrencyMXN(quote.financials.subtotalNet)}</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-xs">
              <span>IVA (16%):</span>
              <span className="font-mono">{formatCurrencyMXN(quote.financials.taxIva)}</span>
            </div>
            <div className="flex justify-between font-black text-zinc-900 text-sm pt-1 border-t border-zinc-200">
              <span>Total cotización:</span>
              <span className="font-mono text-base text-theme-primary">{formatCurrencyMXN(quote.financials.total)}</span>
            </div>
          </div>

          {/* Authorization Log (if exists) */}
          {quote.authorizationLog && (
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Bitácora de Dictamen Comercial</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">
                  {quote.authorizationLog.action} por {quote.authorizationLog.authorizedBy}
                </span>
                <span className="font-mono text-zinc-500">{quote.authorizationLog.authorizedAt}</span>
              </div>
              {quote.authorizationLog.notes && (
                <p className="text-zinc-600 text-[11px] italic bg-zinc-50 p-2 rounded-xl border border-zinc-200 mt-1">
                  "{quote.authorizationLog.notes}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isPendingAuth && onOpenAuthorizationModal && (
              <button
                type="button"
                onClick={() => onOpenAuthorizationModal(quote)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-amber-500 text-zinc-900 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Dictaminar / Autorizar</span>
              </button>
            )}

            {isAuthorized && onUpdateQuoteStatus && (
              <button
                type="button"
                onClick={() => onUpdateQuoteStatus(quote.id, 'Enviada al cliente')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-blue-500 text-zinc-900 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Marcar como Enviada al Cliente</span>
              </button>
            )}

            {isSent && onUpdateQuoteStatus && (
              <button
                type="button"
                onClick={() => onUpdateQuoteStatus(quote.id, 'Aceptada')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-emerald-600 text-zinc-900 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Marcar como Aceptada por Cliente</span>
              </button>
            )}

            {isAccepted && !isConverted && onGenerateOrder && (
              <button
                type="button"
                onClick={handleGenerateOrderClick}
                className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Convertir en Pedido</span>
              </button>
            )}

            {isConverted && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-theme-primary shadow-2xs">
                <ShoppingBag className="w-4 h-4 text-theme-primary" />
                <span className="text-zinc-600 font-medium text-xs">Pedido generado:</span>
                <span className="font-mono font-bold text-theme-primary text-xs">{quote.generatedOrderFolio || 'PED-RTM-2026-0142'}</span>
              </div>
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
  );
};
