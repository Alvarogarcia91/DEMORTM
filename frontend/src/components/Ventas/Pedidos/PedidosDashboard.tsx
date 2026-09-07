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
  Clock
} from 'lucide-react';
import {
  SalesOrder,
  MOCK_SHOWROOM_IMPACT_DATA,
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
  const [branchFilter, setBranchFilter] = useState('all');

  // Filter orders by branch
  const filteredOrders = orders.filter((o) => {
    if (branchFilter !== 'all' && o.branchId !== branchFilter) return false;
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
    (o) => o.status === 'Pendiente de autorización' && (branchFilter === 'all' || o.branchId === branchFilter)
  ).length;

  // Branch breakdown
  const voOrders = filteredOrders.filter((o) => o.branchId === 'wh-suc-valle-oriente');
  const cumbresOrders = filteredOrders.filter((o) => o.branchId === 'wh-suc-cumbres');

  const voSales = voOrders.reduce((acc, o) => acc + o.financials.total, 0);
  const cumbresSales = cumbresOrders.reduce((acc, o) => acc + o.financials.total, 0);

  const voUnits = voOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const cumbresUnits = cumbresOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);

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

  // 1. Más vendido (Top seller)
  const topSeller = productStatsList.length > 0
    ? [...productStatsList].sort((a, b) => b.unitsSold - a.unitsSold)[0]
    : null;

  // 2. Menor movimiento (Lowest mover)
  const lowestSeller = productStatsList.length > 0
    ? [...productStatsList].sort((a, b) => a.unitsSold - b.unitsSold)[0]
    : null;

  // 3. Mayor margen (Top margin %)
  const topMargin = productStatsList.length > 0
    ? [...productStatsList].sort((a, b) => b.marginPct - a.marginPct)[0]
    : null;

  // 4. En tendencia (Second highest mover or top mover)
  const trendingArticle = productStatsList.length > 1
    ? [...productStatsList].sort((a, b) => b.unitsSold - a.unitsSold)[1]
    : topSeller;

  // Filtered Showroom & High Demand data
  const filteredShowroomData = MOCK_SHOWROOM_IMPACT_DATA.filter((s) => {
    if (branchFilter !== 'all' && s.branchId !== branchFilter) return false;
    return true;
  });

  const filteredHighDemandData = MOCK_HIGH_DEMAND_LOW_STOCK_DATA.filter((h) => {
    if (branchFilter !== 'all' && h.branchId !== branchFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
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
                    ? 'bg-white text-rose-600 border border-rose-500/30 shadow-2xs font-black'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'hoy' ? 'Hoy' : p === '7d' ? '7 días' : p === '30d' ? '30 días' : p === '90d' ? '90 días' : '6 meses'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline-block">Sucursal:</span>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs cursor-pointer focus:outline-none"
          >
            <option value="all">Todas las sucursales</option>
            <option value="wh-suc-valle-oriente">Sucursal Valle Oriente</option>
            <option value="wh-suc-cumbres">Sucursal Cumbres</option>
          </select>
        </div>
      </div>

      {/* KPIs 6 Grid (100% White + Semantic Borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Pedidos Totales</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{totalOrdersCount}</span>
          <span className="text-[10px] text-zinc-500">Pedidos del periodo</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Unidades Vendidas</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{formatUnits(totalUnitsSold)}</span>
          <span className="text-[10px] text-zinc-500">Unidades del periodo</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Venta Estimada</span>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(totalSalesAmount, false)}>
            {formatKpiCurrency(totalSalesAmount)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">+18% vs. periodo anterior</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-600/50 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Margen Bruto</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {formatPercentage(avgMarginPct, 1)}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Rentabilidad comercial</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Ticket Promedio</span>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(avgTicket, false)}>
            {formatCurrencyMXN(avgTicket, false)}
          </span>
          <span className="text-[10px] text-zinc-500">Por pedido cerrado</span>
        </div>

        <div
          onClick={onNavigateToPendingAuth}
          className="p-4 rounded-2xl bg-white border border-amber-500/60 shadow-2xs space-y-1 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Pendientes de Autorización</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{pendingAuthCount}</span>
          <span className="text-[10px] text-amber-700 font-bold underline">Ver pendientes &rarr;</span>
        </div>
      </div>

      {/* Highlights 4 Cards (Dynamically calculated from active filtered orders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topSeller ? (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-600 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Más Vendido
            </span>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs truncate" title={topSeller.productName}>
                {topSeller.productName}
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 block">{topSeller.sku}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-zinc-200">
              <span className="font-bold text-zinc-900">{formatUnits(topSeller.unitsSold)}</span>
              <span className="font-extrabold text-rose-600">{formatCurrencyMXN(topSeller.totalRevenue, false)}</span>
              <span className="text-emerald-600 font-bold">{formatPercentage(topSeller.marginPct, 1)}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-zinc-400">
            <span className="text-[10px] uppercase font-bold block">Más Vendido</span>
            <p className="text-xs italic">Sin datos en el periodo.</p>
          </div>
        )}

        {lowestSeller ? (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Menor Movimiento
            </span>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs truncate" title={lowestSeller.productName}>
                {lowestSeller.productName}
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 block">{lowestSeller.sku}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-zinc-200">
              <span className="text-zinc-700 font-bold">{formatUnits(lowestSeller.unitsSold)}</span>
              <span className="text-amber-600 font-semibold text-[11px]">Baja rotación</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-zinc-400">
            <span className="text-[10px] uppercase font-bold block">Menor Movimiento</span>
            <p className="text-xs italic">Sin datos en el periodo.</p>
          </div>
        )}

        {trendingArticle ? (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-purple-600 block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              En Tendencia
            </span>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs truncate" title={trendingArticle.productName}>
                {trendingArticle.productName}
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 block">{trendingArticle.sku}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-zinc-200">
              <span className="text-zinc-900 font-bold">{formatUnits(trendingArticle.unitsSold)}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-600 text-zinc-900 shadow-2xs">
                +25% vs. periodo anterior
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-zinc-400">
            <span className="text-[10px] uppercase font-bold block">En Tendencia</span>
            <p className="text-xs italic">Sin datos en el periodo.</p>
          </div>
        )}

        {topMargin ? (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Mayor Margen
            </span>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs truncate" title={topMargin.productName}>
                {topMargin.productName}
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 block">{topMargin.sku}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-zinc-200">
              <span className="text-zinc-600">{formatCurrencyMXN(topMargin.totalRevenue, false)}</span>
              <span className="font-black text-emerald-600">{formatPercentage(topMargin.marginPct, 1)} margen</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-zinc-400">
            <span className="text-[10px] uppercase font-bold block">Mayor Margen</span>
            <p className="text-xs italic">Sin datos en el periodo.</p>
          </div>
        )}
      </div>

      {/* Ventas por Sucursal Comparativo */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
          <span>Desempeño Comercial por Sucursal</span>
          <Building2 className="w-4 h-4 text-zinc-400" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-900 text-sm">Sucursal Valle Oriente</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-rose-500 text-zinc-900 shadow-2xs">
                Líder en volumen
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Pedidos</span>
                <span className="font-bold text-zinc-900">{voOrders.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Unidades</span>
                <span className="font-bold text-zinc-900">{formatUnits(voUnits)}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Venta Total</span>
                <span className="font-extrabold text-rose-600">{formatCurrencyMXN(voSales, false)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-900 text-sm">Sucursal Cumbres</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-purple-500 text-zinc-900 shadow-2xs">
                Ticket promedio alto
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Pedidos</span>
                <span className="font-bold text-zinc-900">{cumbresOrders.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Unidades</span>
                <span className="font-bold text-zinc-900">{formatUnits(cumbresUnits)}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-500 block">Venta Total</span>
                <span className="font-extrabold text-purple-600">{formatCurrencyMXN(cumbresSales, false)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWROOM — EFECTIVIDAD & DESEMPEÑO OBSERVADO */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Efectividad de Showroom &bull; Desempeño Observado después de Exhibición
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Comparativa independiente: 30 días antes vs. 30 días después de exhibición física en bahías de showroom.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-zinc-300 text-zinc-900 self-start shadow-2xs">
            Impacto Demo
          </span>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Sucursal / Bahía</th>
                  <th className="py-3 px-3">Artículo Exhibido</th>
                  <th className="py-3 px-2 text-center">Antes (30d)</th>
                  <th className="py-3 px-2 text-center">Después (30d)</th>
                  <th className="py-3 px-2 text-center">Variación</th>
                  <th className="py-3 px-2 text-center">Margen</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredShowroomData.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-900 block">{item.branchName}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{item.bayCode} &bull; {item.bayName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-zinc-900 block">{item.productName}</strong>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.sku}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-zinc-500 font-bold">
                      {formatUnits(item.unitsSoldBefore30d)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-black text-zinc-900">
                      {formatUnits(item.unitsSoldAfter30d)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-emerald-600">
                      +{formatPercentage(item.variationPct, 1)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-semibold text-zinc-900">
                      {formatPercentage(item.marginPct, 1)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                        item.status === 'Alto impacto'
                          ? 'border-emerald-600'
                          : item.status === 'Impacto positivo'
                          ? 'border-blue-500'
                          : 'border-zinc-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BUENA VENTA + BAJA EXISTENCIA */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alta Demanda Comercial & Baja Existencia Local
            </h3>
            <p className="text-[11px] text-zinc-500">
              Artículos con alta tasa de venta reciente y cobertura de inventario menor a 7 días en sucursal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHighDemandData.map((hls) => (
            <div
              key={hls.id}
              className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-rose-600">{hls.sku}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                    hls.urgency === 'Alta' ? 'border-rose-500' : 'border-amber-500'
                  }`}>
                    Urgencia {hls.urgency}
                  </span>
                </div>
                <h4 className="font-bold text-zinc-900 text-xs">{hls.productName}</h4>
                <p className="text-[11px] text-zinc-500">{hls.branchName}</p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-200">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Venta 30d</span>
                    <span className="font-bold text-zinc-900">{formatUnits(hls.recentSales30d)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Disp. Local</span>
                    <span className="font-bold text-rose-600">{formatUnits(hls.availableStock)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Cobertura</span>
                    <span className="font-bold text-amber-600">{hls.coverageDays} días</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">
                  Sugerido: <strong>+{formatUnits(hls.suggestedRequisitionQty, 'pza', 'pzas')}</strong>
                </span>
                {onNavigateToRequisitions && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRequisitions(hls.sku)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Crear requisición</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OBSERVACIONES DEL PERIODO */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
        <span className="text-xs font-black text-zinc-900 uppercase tracking-wider block">
          Observaciones del Periodo Comercial
        </span>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-700">
          <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Artículo más vendido:</strong> {topSeller ? topSeller.productName : 'Línea Nayt'} concentra la mayor rotación del periodo con {topSeller ? formatUnits(topSeller.unitsSold) : '0 unidades'}.
            </span>
          </li>
          <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2">
            <Building2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              <strong>Sucursal líder en ticket:</strong> Cumbres registra un ticket promedio superior impulsado por pedidos corporativos y residenciales.
            </span>
          </li>
          <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Líder en rentabilidad:</strong> {topMargin ? topMargin.productName : 'Línea King Size'} aporta el mayor margen comercial ({topMargin ? formatPercentage(topMargin.marginPct, 1) : '53,6 %'}).
            </span>
          </li>
          <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Showroom destacado:</strong> Bahía SHOW-02 en Valle Oriente duplicó la tasa de cierre en la misma visita de clientes.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
