import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Package,
  Wrench,
  Percent,
  RefreshCw,
  Info,
  Flame,
  Shuffle,
} from 'lucide-react';
import { ProductionOrder } from '../../../data/mockProduccionData';
import { SalesOrder } from '../../../data/mockSalesData';
import {
  ProductionCostConfig,
  DEFAULT_PRODUCTION_COST_CONFIG,
  getProductionOrderCostSnapshot,
  simulateAlternativeMachineCost,
} from '../../../data/mockProductionCostData';

interface Props {
  order: ProductionOrder;
  salesOrders?: SalesOrder[];
  onNavigateToSalesOrder?: (folio: string) => void;
  onNavigateToInternalTab?: (
    tab: 'Resumen' | 'Routing' | 'Paginación / Flexo' | 'Materiales' | 'Herramental' | 'Controles QA' | 'Incidencias' | 'Trazabilidad'
  ) => void;
  costConfig?: ProductionCostConfig;
}

export const ProductionOrderCostTab: React.FC<Props> = ({
  order,
  salesOrders = [],
  onNavigateToSalesOrder,
  onNavigateToInternalTab,
  costConfig = DEFAULT_PRODUCTION_COST_CONFIG,
}) => {
  const snapshot = useMemo(() => {
    return getProductionOrderCostSnapshot(order, salesOrders, costConfig);
  }, [order, salesOrders, costConfig]);

  const isClosed = snapshot.isClosed;

  // Alternative machine simulation state
  const [selectedSimMachine, setSelectedSimMachine] = useState<string>(() => {
    const area = order.area;
    const current = order.machine;
    const compatible = costConfig.machineRates.filter((m) => m.area === area && m.machineName !== current);
    return compatible[0]?.machineName || '';
  });

  const simulation = useMemo(() => {
    if (!selectedSimMachine) return null;
    return simulateAlternativeMachineCost(order, selectedSimMachine, costConfig);
  }, [order, selectedSimMachine, costConfig]);

  const simulatedMarginPct = useMemo(() => {
    if (!simulation || snapshot.commercialSaleTotal <= 0) return 0;
    const marginAmount = snapshot.commercialSaleTotal - simulation.simulatedTotalCost;
    return +((marginAmount / snapshot.commercialSaleTotal) * 100).toFixed(1);
  }, [simulation, snapshot.commercialSaleTotal]);

  const compatibleMachines = useMemo(() => {
    return costConfig.machineRates.filter((m) => m.area === order.area && m.machineName !== order.machine);
  }, [costConfig.machineRates, order.area, order.machine]);

  // Format currency
  const fmtInt = (val: number) =>
    `$${Math.round(val).toLocaleString('es-MX')}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Status Banner & Economic Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                isClosed
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
              }`}
            >
              {isClosed ? 'COSTO REAL FINAL · Orden Cerrada' : 'EN PROCESO · Proyección al Cierre'}
            </span>
            <span className="text-xs text-theme-muted font-mono">
              Base: {order.quantity.toLocaleString()} pzas
            </span>
          </div>
          <h3 className="text-lg font-black text-theme-main mt-1">
            Resumen Económico OP {order.folio}
          </h3>
          <p className="text-xs text-theme-muted">
            {isClosed
              ? 'Liquidación final de costos basada en consumos y tiempos registrados en piso.'
              : 'Acumulado a la fecha sumado a la estimación paramétrica de operaciones pendientes.'}
          </p>
        </div>

        {/* Commercial Order Link Badge */}
        {snapshot.salesOrderFolio ? (
          <div className="flex items-center gap-3 rounded-xl border border-theme-primary/20 bg-theme-primary/5 p-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-theme-primary">
                Origen Comercial
              </div>
              <div className="font-mono text-xs font-black text-theme-main">
                {snapshot.salesOrderFolio}
              </div>
              <div className="text-[10px] text-theme-muted">
                Cotización: {snapshot.originQuoteFolio || 'Directa'}
              </div>
            </div>
            {onNavigateToSalesOrder && (
              <button
                type="button"
                onClick={() => onNavigateToSalesOrder(snapshot.salesOrderFolio!)}
                className="flex items-center gap-1 rounded-lg bg-theme-primary px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90 transition-colors shrink-0"
              >
                <span>Ver Pedido</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-theme-subtle p-3 text-right">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">
              Tipo de Fabricación
            </span>
            <span className="text-xs font-bold text-theme-main">Orden de Stock / Catálogo</span>
          </div>
        )}
      </div>

      {/* 2. Top 6 Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Venta Cotizada */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Venta Cotizada
          </span>
          <div className="text-base font-black text-theme-main mt-1 font-mono">
            {fmtInt(snapshot.commercialSaleTotal)}
          </div>
          <span className="text-[10px] text-theme-muted">
            PVP Unit: ${(snapshot.commercialSaleTotal / (order.quantity || 1)).toFixed(2)}
          </span>
        </div>

        {/* Costo Cotizado */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Costo Cotizado
          </span>
          <div className="text-base font-black text-theme-muted mt-1 font-mono">
            {fmtInt(snapshot.totalQuotedCost)}
          </div>
          <span className="text-[10px] text-theme-muted">
            Margen Cot: {snapshot.commercialMarginPct.toFixed(1)}%
          </span>
        </div>

        {/* Costo Estándar */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Costo Estándar
          </span>
          <div className="text-base font-black text-theme-main mt-1 font-mono">
            {fmtInt(snapshot.totalStandardCost)}
          </div>
          <span className="text-[10px] text-theme-muted">
            Unit: ${snapshot.unitCostStandard.toFixed(3)}
          </span>
        </div>

        {/* Real Acumulado */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Real Acumulado
          </span>
          <div className="text-base font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {fmtInt(snapshot.totalActualCost)}
          </div>
          <span className="text-[10px] text-theme-muted">
            A la fecha en piso
          </span>
        </div>

        {/* Proyección al Cierre */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            {isClosed ? 'Costo Final' : 'Proy. al Cierre'}
          </span>
          <div className="text-base font-black text-theme-main mt-1 font-mono">
            {fmtInt(snapshot.totalProjectedCost)}
          </div>
          <span
            className={`text-[10px] font-bold ${
              snapshot.totalCostVarianceAmount > 0 ? 'text-rose-500' : 'text-emerald-500'
            }`}
          >
            {snapshot.totalCostVarianceAmount > 0 ? '+' : ''}
            {snapshot.totalCostVariancePct.toFixed(1)}% vs est.
          </span>
        </div>

        {/* Margen Proyectado */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Margen Proy.
          </span>
          <div
            className={`text-base font-black mt-1 font-mono ${
              snapshot.marginStatus === 'Erosión Crítica'
                ? 'text-rose-600 dark:text-rose-400'
                : snapshot.marginStatus === 'En Riesgo'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {snapshot.projectedMarginPct.toFixed(1)}%
          </div>
          <span className="text-[10px] text-theme-muted">
            Erosión:{' '}
            <b
              className={
                snapshot.marginErosionPct > 0 ? 'text-rose-500' : 'text-emerald-500'
              }
            >
              {snapshot.marginErosionPct > 0 ? '-' : '+'}
              {Math.abs(snapshot.marginErosionPct).toFixed(1)}%
            </b>
          </span>
        </div>
      </div>

      {/* 3. Detailed 3-Pillar Comparison Table */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface shadow-xs overflow-hidden">
        <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-theme-main">
              Comparativa por Componente de Costo Industrial
            </h4>
            <p className="text-xs text-theme-muted">
              Cotizado vs Estándar de Fabricación vs Real Acumulado / Proyección al Cierre.
            </p>
          </div>
          <span className="text-[11px] font-mono text-theme-muted">
            Moneda: MXN · Unidades: {order.quantity.toLocaleString()} pzas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-theme-subtle bg-theme-muted/10 text-theme-muted uppercase tracking-wider text-[10px] font-black">
                <th className="py-2.5 px-4">Componente</th>
                <th className="py-2.5 px-3 text-right">Cotizado</th>
                <th className="py-2.5 px-3 text-right">Estándar</th>
                <th className="py-2.5 px-3 text-right">Real Acumulado</th>
                <th className="py-2.5 px-3 text-right">Proy. al Cierre</th>
                <th className="py-2.5 px-3 text-right">Variación vs Est.</th>
                <th className="py-2.5 px-4 text-right">Costo Unitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {/* Materia Prima */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                  <span>Materia Prima Directa</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.materials.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.materials.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.materials.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.materials.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.materials.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.materials.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.materials.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.materials.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* Mano de Obra Directa */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>Mano de Obra Directa (MOD)</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.directLabor.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.directLabor.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.directLabor.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.directLabor.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.directLabor.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.directLabor.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.directLabor.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.directLabor.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* Hora Máquina */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
                  <span>Hora Máquina (Run)</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.machineProcess.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.machineProcess.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.machineProcess.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.machineProcess.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.machineProcess.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.machineProcess.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.machineProcess.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.machineProcess.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* Setup / Puesta a Punto */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span>Setup / Puesta a Punto</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.setup.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.setup.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.setup.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.setup.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.setup.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.setup.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.setup.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.setup.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* Scrap / Merma */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  <span>Scrap y Mermas</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.incrementalScrap.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.incrementalScrap.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.incrementalScrap.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.incrementalScrap.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.incrementalScrap.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.incrementalScrap.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.incrementalScrap.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.incrementalScrap.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* Carga Fabril (Overhead) */}
              <tr className="hover:bg-theme-muted/10 transition-colors">
                <td className="py-2.5 px-4 font-bold text-theme-main flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-xs bg-purple-500" />
                  <span>Carga Fabril ({costConfig.overheadPercentage}%)</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.overhead.quoted)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.overhead.standard)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.overhead.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {fmtInt(snapshot.overhead.projected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.overhead.varianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.overhead.varianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.overhead.varianceAmount)}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-theme-main">
                  ${(snapshot.overhead.projected / (order.quantity || 1)).toFixed(4)}
                </td>
              </tr>

              {/* TOTAL ROW */}
              <tr className="bg-theme-muted/15 font-black text-xs border-t-2 border-theme-subtle">
                <td className="py-3 px-4 text-theme-main">TOTAL COSTO INDUSTRIAL</td>
                <td className="py-3 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.totalQuotedCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-theme-muted">
                  {fmtInt(snapshot.totalStandardCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {fmtInt(snapshot.totalActualCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-theme-main">
                  {fmtInt(snapshot.totalProjectedCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <span
                    className={
                      snapshot.totalCostVarianceAmount > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {snapshot.totalCostVarianceAmount > 0 ? '+' : ''}
                    {fmtInt(snapshot.totalCostVarianceAmount)} ({snapshot.totalCostVariancePct.toFixed(1)}%)
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-theme-primary font-black">
                  ${snapshot.unitCostProjected.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Drivers of Variation (¿Qué está moviendo el costo?) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-black text-theme-main tracking-tight">
              Drivers de Variación · ¿Qué está moviendo el costo?
            </h4>
            <p className="text-xs text-theme-muted">
              Causas ordenadas por impacto financiero directo sobre el margen de la orden.
            </p>
          </div>
          <span className="text-[11px] font-bold text-theme-muted">
            {snapshot.drivers.length} factores detectados
          </span>
        </div>

        <div className="space-y-3">
          {snapshot.drivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-xl border border-theme-subtle p-3.5 bg-theme-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-theme-muted/10 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${
                      driver.impactAmount > 2000
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        : driver.impactAmount > 0
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {driver.impactAmount > 2000
                      ? 'Desvío Crítico'
                      : driver.impactAmount > 0
                      ? 'Desvío Moderado'
                      : 'Favorable / Ahorro'}
                  </span>
                  <span className="text-xs font-bold text-theme-main">{driver.category}</span>
                </div>
                <h5 className="text-xs font-bold text-theme-main">{driver.title}</h5>
                <p className="text-xs text-theme-muted">{driver.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <div
                    className={`text-xs font-black ${
                      driver.impactAmount > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {driver.impactAmount > 0 ? '+' : ''}
                    {fmtInt(driver.impactAmount)}
                  </div>
                  <div className="text-[10px] text-theme-muted">
                    Impacto en costo
                  </div>
                </div>

                {driver.targetTab && onNavigateToInternalTab && (
                  <button
                    type="button"
                    onClick={() => {
                      if (driver.targetTab === 'Materiales') onNavigateToInternalTab('Materiales');
                      else if (driver.targetTab === 'Routing') onNavigateToInternalTab('Routing');
                      else if (driver.targetTab === 'Incidencias') onNavigateToInternalTab('Incidencias');
                      else onNavigateToInternalTab('Resumen');
                    }}
                    className="flex items-center gap-1 rounded-lg border border-theme-subtle px-2.5 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors"
                  >
                    <span>Ver {driver.targetTab}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Economic Timeline During Execution */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-xs">
        <h4 className="text-sm font-black text-theme-main mb-1">
          Línea de Tiempo Económica por Etapa de Fabricación
        </h4>
        <p className="text-xs text-theme-muted mb-4">
          Costos presupuestados vs ejecutados acumulados en cada fase del proceso productivo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {snapshot.economicTimeline.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3.5 flex flex-col justify-between ${
                step.tone === 'danger'
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : step.tone === 'warning'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : step.tone === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-theme-subtle bg-theme-surface'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-theme-muted font-bold">
                    {step.time}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      step.tone === 'danger'
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        : step.tone === 'warning'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : step.tone === 'success'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-theme-muted/20 text-theme-muted'
                    }`}
                  >
                    {step.tone === 'danger'
                      ? 'Desvío'
                      : step.tone === 'warning'
                      ? 'Alerta'
                      : step.tone === 'success'
                      ? 'Conforme'
                      : 'Proceso'}
                  </span>
                </div>
                <div className="font-bold text-xs text-theme-main">{step.event}</div>
                <div className="text-[10px] text-theme-muted mt-1 leading-relaxed">{step.detail}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-theme-subtle font-mono text-right">
                <div className="text-xs font-black text-theme-main">{fmtInt(step.accumulatedCost)}</div>
                {step.varianceImpact !== undefined && (
                  <div
                    className={`text-[10px] font-bold ${
                      step.varianceImpact > 0 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {step.varianceImpact > 0 ? '+' : ''}
                    {fmtInt(step.varianceImpact)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Materials Consumption Drilldown */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-black text-theme-main">
              Desglose de Consumo de Insumos & Materiales
            </h4>
            <p className="text-xs text-theme-muted">
              Cálculo paramétrico según lista de materiales (BOM) asignada a la orden.
            </p>
          </div>
          {onNavigateToInternalTab && (
            <button
              type="button"
              onClick={() => onNavigateToInternalTab('Materiales')}
              className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
            >
              <span>Ver BOM en Materiales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-theme-subtle bg-theme-muted/10 text-theme-muted uppercase tracking-wider text-[10px] font-black">
                <th className="py-2.5 px-3">Insumo / Descripción</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3 text-right">Cant. Estándar</th>
                <th className="py-2.5 px-3 text-right">Cant. Consumida</th>
                <th className="py-2.5 px-3 text-right">Costo Unit. Ref</th>
                <th className="py-2.5 px-3 text-right">Costo Acumulado</th>
                <th className="py-2.5 px-3 text-right">Variación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {snapshot.materialsBreakdown.map((mat) => (
                <tr key={mat.id} className="hover:bg-theme-muted/10 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-theme-main">{mat.name}</td>
                  <td className="py-2.5 px-3 text-theme-muted">{mat.type}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                    {mat.standardQty.toLocaleString()} {mat.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                    {mat.consumedQty.toLocaleString()} {mat.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-theme-muted">
                    ${mat.unitPriceRef.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-theme-main">
                    {fmtInt(mat.actualCost)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span
                      className={
                        mat.varianceAmount > 0
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : mat.varianceAmount < 0
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'text-theme-muted'
                      }
                    >
                      {mat.varianceAmount > 0 ? '+' : ''}
                      {fmtInt(mat.varianceAmount)} ({mat.variancePct > 0 ? '+' : ''}{mat.variancePct.toFixed(1)}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. What-If Machine Simulator */}
      <div className="rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 via-theme-surface to-purple-500/5 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-theme-main tracking-tight">
                Simulador What-If · Máquina Alternativa Compatible
              </h4>
              <p className="text-xs text-theme-muted">
                Evalúa el impacto inmediato en costo y margen si esta orden se corriera en otra máquina del área {order.area}.
              </p>
            </div>
          </div>

          {/* Machine Selector */}
          {compatibleMachines.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-theme-muted">Probar en:</span>
              <select
                value={selectedSimMachine}
                onChange={(e) => setSelectedSimMachine(e.target.value)}
                aria-label="Seleccionar Máquina Alternativa"
                className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main focus:outline-hidden focus:ring-2 focus:ring-theme-primary"
              >
                {compatibleMachines.map((m) => (
                  <option key={m.machineName} value={m.machineName}>
                    {m.machineName} (${m.hourlyRate}/h)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {simulation ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-theme-surface/70 rounded-xl p-4 border border-theme-subtle">
            {/* Máquina Actual vs Simulada */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Máquina
              </span>
              <div className="text-xs font-bold text-theme-main mt-1">
                {order.machine} → <b className="text-indigo-600">{simulation.targetMachine}</b>
              </div>
              <span className="text-[10px] text-theme-muted font-mono">
                ${simulation.currentMachineRate}/h → ${simulation.targetMachineRate}/h
              </span>
            </div>

            {/* Total Simulado */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Costo Simulado
              </span>
              <div className="text-xs font-bold text-theme-main mt-1 font-mono">
                {fmtInt(simulation.simulatedTotalCost)}
              </div>
              <span className="text-[10px] text-theme-muted">
                Actual: {fmtInt(simulation.currentTotalCost)}
              </span>
            </div>

            {/* Delta Costo Industrial */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Impacto en Costo
              </span>
              <div
                className={`text-sm font-black mt-1 font-mono ${
                  simulation.differenceAmount < 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {simulation.differenceAmount < 0 ? '-' : '+'}
                {fmtInt(Math.abs(simulation.differenceAmount))}
              </div>
              <span className="text-[10px] text-theme-muted">
                {simulation.differenceAmount < 0 ? 'Ahorro proyectado' : 'Sobrecosto estimado'} ({simulation.differencePct > 0 ? '+' : ''}{simulation.differencePct}%)
              </span>
            </div>

            {/* Impacto en Margen */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Margen Simulado
              </span>
              <div
                className={`text-sm font-black mt-1 font-mono ${
                  simulatedMarginPct >= snapshot.projectedMarginPct
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {simulatedMarginPct.toFixed(1)}%
              </div>
              <span className="text-[10px] text-theme-muted">
                vs {snapshot.projectedMarginPct.toFixed(1)}% actual (
                <b
                  className={
                    simulatedMarginPct >= snapshot.projectedMarginPct
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }
                >
                  {simulatedMarginPct >= snapshot.projectedMarginPct ? '+' : ''}
                  {(simulatedMarginPct - snapshot.projectedMarginPct).toFixed(1)}%
                </b>
                )
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-theme-muted">
            No hay máquinas alternativas compatibles registradas para esta área de proceso.
          </div>
        )}
      </div>
    </div>
  );
};
