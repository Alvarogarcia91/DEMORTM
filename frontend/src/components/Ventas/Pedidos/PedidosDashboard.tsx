import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Building2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Printer,
  Sliders,
  AlertCircle
} from 'lucide-react';
import {
  SalesOrder,
  MOCK_HIGH_DEMAND_LOW_STOCK_DATA
} from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import {
  formatCurrencyMXN,
  formatKpiCurrency,
  formatPercentage,
  formatUnits,
  formatDateMX,
} from '../../../utils/formatters';

interface PedidosDashboardProps {
  orders: SalesOrder[];
  onNavigateToPendingAuth: () => void;
  onNavigateToOrdersList: () => void;
  onNavigateToRequisitions?: (preloadedSku?: string) => void;
}

export const PedidosDashboard: React.FC<PedidosDashboardProps> = ({
  orders,
  onNavigateToPendingAuth,
  onNavigateToOrdersList,
  onNavigateToRequisitions,
}) => {
  const [period, setPeriod] = useState<'hoy' | '7d' | '30d' | '90d' | '6m'>('30d');
  const [techFilter, setTechFilter] = useState<'all' | 'Offset' | 'Flexografía'>('all');

  // Filter orders by technology
  const filteredOrders = orders.filter((o) => {
    if (techFilter !== 'all') {
      const qTech = o.technology || (o.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');
      if (qTech !== techFilter) return false;
    }
    return true;
  });

  // Calculate core KPIs dynamically from filteredOrders
  const totalOrdersCount = filteredOrders.length;
  const totalUnitsSold = filteredOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const totalSalesAmount = filteredOrders.reduce((acc, o) => acc + o.financials.total, 0);
  const totalCostAmount = filteredOrders.reduce((acc, o) => acc + o.financials.estimatedCost, 0);
  const totalMarginAmount = Math.max(0, totalSalesAmount - totalCostAmount);
  const avgMarginPct = totalSalesAmount > 0 ? (totalMarginAmount / totalSalesAmount) * 100 : 0;
  const avgTicket = totalOrdersCount > 0 ? totalSalesAmount / totalOrdersCount : 0;
  
  // Real pending auth count
  const pendingAuthCount = orders.filter(
    (o) => o.status === 'Pendiente de autorización'
  ).length;

  // Technology breakdown
  const offsetOrders = filteredOrders.filter((o) => {
    const qTech = o.technology || (o.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');
    return qTech === 'Offset';
  });
  const flexoOrders = filteredOrders.filter((o) => {
    const qTech = o.technology || (o.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');
    return qTech === 'Flexografía';
  });

  const offsetSales = offsetOrders.reduce((acc, o) => acc + o.financials.total, 0);
  const flexoSales = flexoOrders.reduce((acc, o) => acc + o.financials.total, 0);

  const offsetUnits = offsetOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const flexoUnits = flexoOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Availability and production demand aggregations
  const totalPtStock = filteredOrders.reduce((acc, o) => acc + (o.finishedGoodsStock || 0), 0);
  const totalMissingToProduce = filteredOrders.reduce((acc, o) => acc + (o.missingToProduce || 0), 0);
  const ordersWithMaterialAlert = filteredOrders.filter((o) => o.hasMaterialAlert);

  // Dynamic Product Stats Aggregation from filteredOrders
  const productStatsMap = new Map<string, {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    unitsSold: number;
    totalRevenue: number;
    totalCost: number;
    marginAmount: number;
    marginPct: number;
  }>();

  filteredOrders.forEach((o) => {
    o.items.forEach((it) => {
      const existing = productStatsMap.get(it.sku);
      const revenue = it.subtotal;
      const cost = (it.costReference || 0) * it.quantity;
      if (!existing) {
        productStatsMap.set(it.sku, {
          sku: it.sku,
          productName: it.productName,
          brand: it.brand,
          size: it.size,
          unitsSold: it.quantity,
          totalRevenue: revenue,
          totalCost: cost,
          marginAmount: revenue - cost,
          marginPct: revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0,
        });
      } else {
        existing.unitsSold += it.quantity;
        existing.totalRevenue += revenue;
        existing.totalCost += cost;
        existing.marginAmount = existing.totalRevenue - existing.totalCost;
        existing.marginPct = existing.totalRevenue > 0 ? (existing.marginAmount / existing.totalRevenue) * 100 : 0;
      }
    });
  });

  const productStatsList = Array.from(productStatsMap.values());

  const topSeller = productStatsList.length > 0
    ? [...productStatsList].sort((a, b) => b.unitsSold - a.unitsSold)[0]
    : null;

  const topMargin = productStatsList.length > 0
    ? [...productStatsList].sort((a, b) => b.marginPct - a.marginPct)[0]
    : null;

  const trendingArticle = productStatsList.length > 1
    ? [...productStatsList].sort((a, b) => b.unitsSold - a.unitsSold)[1]
    : topSeller;

  return (
    <div className="space-y-6">
      {/* Top Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Periodo:</span>
          <div className="flex items-center p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200 text-xs">
            {(['hoy', '7d', '30d', '90d', '6m'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-theme-primary text-white shadow-xs font-black'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'hoy' ? 'Hoy' : p === '7d' ? '7 días' : p === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline-block">Tecnología:</span>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value as any)}
            className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-bold shadow-2xs cursor-pointer focus:outline-none"
          >
            <option value="all">Todas las tecnologías</option>
            <option value="Offset">Offset (Prensas Planas)</option>
            <option value="Flexografía">Flexografía (Rollos / Etiquetas)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* KPI 1: PEDIDOS ACTIVOS */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-theme-primary" />
              Total Pedidos
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {totalOrdersCount}
          </span>
          <span className="text-[10px] text-zinc-500">En cartera comercial</span>
        </div>

        {/* KPI 2: PENDIENTES DE AUTORIZACIÓN */}
        <div
          onClick={onNavigateToPendingAuth}
          className="p-4 rounded-2xl bg-white border border-amber-500/50 shadow-2xs space-y-1 cursor-pointer hover:border-amber-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Por Autorizar
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {pendingAuthCount}
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">Requiere dictamen</span>
        </div>

        {/* KPI 3: VOLUMEN TOTAL */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              Volumen Piezas
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {formatUnits(totalUnitsSold)}
          </span>
          <span className="text-[10px] text-zinc-500">Tiraje total pedido</span>
        </div>

        {/* KPI 4: FALTANTE POR PRODUCIR */}
        <div className="p-4 rounded-2xl bg-white border border-theme-primary/40 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-theme-primary" />
              Por Producir
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-theme-primary block">
            {formatUnits(totalMissingToProduce)}
          </span>
          <span className="text-[10px] text-theme-primary font-medium">Demanda neta a prensas</span>
        </div>

        {/* KPI 5: VENTA TOTAL */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-theme-primary" />
              Venta Total
            </span>
          </div>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(totalSalesAmount)}>
            {formatKpiCurrency(totalSalesAmount)}
          </span>
          <span className="text-[10px] text-zinc-500">Facturación global</span>
        </div>

        {/* KPI 6: MARGEN PROMEDIO */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Margen Prom.
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-600 block">
            {formatPercentage(avgMarginPct, 1)}
          </span>
          <span className="text-[10px] text-zinc-500">Rentabilidad de cartera</span>
        </div>
      </div>

      {/* DEMANDA DE PRODUCCIÓN & DISPONIBILIDAD PT (Reemplaza Showroom) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4 text-theme-primary" />
              Demanda de Producción & Disponibilidad de Producto Terminado (PT)
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Monitoreo operativo: Cruce de pedidos autorizados contra existencias en Almacén Principal RTM y requerimientos de producción.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 border border-theme-primary/30 text-theme-primary self-start shadow-2xs">
            Enlace Comercial &rarr; Planta
          </span>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[780px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Pedido / PO Cliente</th>
                  <th className="py-3 px-3">Cliente & Trabajo</th>
                  <th className="py-3 px-2 text-center">Tecnología</th>
                  <th className="py-3 px-2 text-center">Cant. Pedida</th>
                  <th className="py-3 px-2 text-center">PT Disponible</th>
                  <th className="py-3 px-2 text-center">Faltante a Producir</th>
                  <th className="py-3 px-3 text-center">Alerta de Material</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredOrders.map((order) => {
                  const totalUnits = order.items.reduce((acc, i) => acc + i.quantity, 0);
                  const pt = order.finishedGoodsStock !== undefined ? order.finishedGoodsStock : 5000;
                  const missing = order.missingToProduce !== undefined ? order.missingToProduce : Math.max(0, totalUnits - pt);
                  const tech = order.technology || (order.items[0]?.sku?.startsWith('PT-ETQ') ? 'Flexografía' : 'Offset');

                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-theme-primary block">{order.folio}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">PO: {order.customerPo || 'PO-2026-9921'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-zinc-900 block">{order.customerName}</strong>
                        <span className="text-[11px] text-zinc-600 block truncate max-w-xs">{order.items[0]?.productName}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{order.partNumber || order.items[0]?.sku} &bull; {order.revision || 'Rev B'}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                          {tech}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-zinc-900">
                        {formatUnits(totalUnits)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-emerald-600">
                        {formatUnits(pt)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-black text-theme-primary">
                        {missing > 0 ? `${formatUnits(missing)} pzas` : 'Cubierto 100%'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {order.hasMaterialAlert ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-rose-500 text-rose-700 shadow-2xs">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Couché 90g (-4 tarimas)</span>
                          </div>
                        ) : order.isObsoleteRevision ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-amber-500 text-amber-700 shadow-2xs">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Rev A Obsoleta</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-600 text-emerald-700 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Insumos OK</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Desempeño por Tecnología (Offset vs Flexografía) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
          <span>Distribución de Demanda por Línea Tecnológica</span>
          <Sliders className="w-4 h-4 text-zinc-400" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Offset */}
          <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-theme-primary inline-block" />
                Prensa Offset Plana (Manuales, Blister Cards, Folletos)
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-theme-primary text-zinc-900 shadow-2xs">
                Líder en Facturación
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Pedidos</span>
                <span className="font-bold text-zinc-900">{offsetOrders.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Tiraje</span>
                <span className="font-bold text-zinc-900">{formatUnits(offsetUnits)}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Venta Total</span>
                <span className="font-extrabold text-theme-primary">{formatCurrencyMXN(offsetSales, false)}</span>
              </div>
            </div>
          </div>

          {/* Flexografía */}
          <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                Flexografía Rotativa (Etiquetas en Rollo, Tags Continuos)
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-blue-500 text-zinc-900 shadow-2xs">
                Alto Volumen
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Pedidos</span>
                <span className="font-bold text-zinc-900">{flexoOrders.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Tiraje</span>
                <span className="font-bold text-zinc-900">{formatUnits(flexoUnits)}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Venta Total</span>
                <span className="font-extrabold text-blue-600">{formatCurrencyMXN(flexoSales, false)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
