import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Clock,
  Layers,
  Sparkles,
  Settings,
  Download,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Percent,
  CheckCircle2,
  Package,
  Wrench,
  Flame,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { ProductionOrder } from '../../../data/mockProduccionData';
import { SalesOrder } from '../../../data/mockSalesData';
import {
  ProductionCostConfig,
  DEFAULT_PRODUCTION_COST_CONFIG,
  ProductionCostPeriodFilter,
  calculateProductionCostDashboard,
  ProductionOrderCostSnapshot,
} from '../../../data/mockProductionCostData';
import { ProductionCostConfigModal } from './ProductionCostConfigModal';

interface Props {
  orders: ProductionOrder[];
  salesOrders: SalesOrder[];
  onOpenOrderCost: (order: ProductionOrder) => void;
  onNavigateToTab?: (tab: string) => void;
  onNavigateToSalesOrder?: (folio: string) => void;
}

export const ProductionCostWorkspace: React.FC<Props> = ({
  orders,
  salesOrders,
  onOpenOrderCost,
  onNavigateToTab,
  onNavigateToSalesOrder,
}) => {
  // Config state
  const [costConfig, setCostConfig] = useState<ProductionCostConfig>(DEFAULT_PRODUCTION_COST_CONFIG);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Filter state
  const [period, setPeriod] = useState<ProductionCostPeriodFilter>('30d');
  const [areaFilter, setAreaFilter] = useState<string>('Todas');
  const [clientFilter, setClientFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableRiskFilter, setTableRiskFilter] = useState<'all' | 'critical' | 'healthy' | 'scrap'>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Clients list for selector
  const availableClients = useMemo(() => {
    const clients = new Set<string>();
    orders.forEach((o) => clients.add(o.cliente));
    return Array.from(clients).sort();
  }, [orders]);

  // Dashboard calculation
  const dashboard = useMemo(() => {
    return calculateProductionCostDashboard(
      orders,
      salesOrders,
      period,
      areaFilter,
      clientFilter,
      statusFilter,
      costConfig
    );
  }, [orders, salesOrders, period, areaFilter, clientFilter, statusFilter, costConfig]);

  // Filtered rows for the protagonist table
  const tableRows = useMemo(() => {
    let rows = dashboard.activeMarginControl;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.orderFolio.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.partNumber.toLowerCase().includes(q) ||
          (r.salesOrderFolio && r.salesOrderFolio.toLowerCase().includes(q))
      );
    }

    if (tableRiskFilter === 'critical') {
      rows = rows.filter((r) => r.marginStatus === 'Erosión Crítica' || r.marginStatus === 'En Riesgo');
    } else if (tableRiskFilter === 'healthy') {
      rows = rows.filter((r) => r.marginStatus === 'Saludable' || r.marginStatus === 'Ahorro');
    } else if (tableRiskFilter === 'scrap') {
      rows = rows.filter((r) => r.incrementalScrap.actual > r.incrementalScrap.standard);
    }

    return rows;
  }, [dashboard.activeMarginControl, searchQuery, tableRiskFilter]);

  const handleExport = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    setExportNotice(`✓ Reporte ejecutivo de costeo exportado a Excel/PDF (${dateStr})`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              MÓDULO DE COSTEO REAL
            </span>
            <span className="text-[11px] font-mono text-theme-muted">
              Pilar: Cotizado ↔ Estándar ↔ Proyección al Cierre
            </span>
          </div>
          <h2 className="text-2xl font-black text-theme-main tracking-tight">
            Costeo Real y Proyectado de Órdenes de Producción
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">
            Monitoreo económico OP a OP: control de mano de obra directa ($
            {costConfig.laborHourlyRate}/h), máquina activa, scrap, materia prima y carga fabril ({costConfig.overheadPercentage}%).
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/20 shadow-xs transition-colors"
          >
            <Settings className="w-4 h-4 text-theme-muted" />
            <span>Configurar Tarifas Demo</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Análisis</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-200 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="font-bold underline hover:no-underline"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
        {/* Period Pills */}
        <div className="flex items-center gap-1 bg-theme-muted/10 p-1 rounded-xl border border-theme-subtle">
          {(['7d', '30d', '60d', '90d'] as ProductionCostPeriodFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              {p === '7d' ? '7 Días' : p === '30d' ? '30 Días' : p === '60d' ? '60 Días' : '90 Días'}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Area Filter */}
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <span className="text-[11px] font-bold">Área:</span>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              aria-label="Filtrar por Área"
              className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-medium text-theme-main focus:outline-hidden focus:ring-2 focus:ring-theme-primary"
            >
              <option value="Todas">Todas las áreas</option>
              <option value="Offset">Offset</option>
              <option value="Flexografía">Flexografía</option>
            </select>
          </div>

          {/* Client Filter */}
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <span className="text-[11px] font-bold">Cliente:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              aria-label="Filtrar por Cliente"
              className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-medium text-theme-main focus:outline-hidden focus:ring-2 focus:ring-theme-primary max-w-[160px] truncate"
            >
              <option value="Todos">Todos los clientes</option>
              {availableClients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <span className="text-[11px] font-bold">Estado OP:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por Estado"
              className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-medium text-theme-main focus:outline-hidden focus:ring-2 focus:ring-theme-primary"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activas">Activas en Piso</option>
              <option value="Terminadas">Terminadas / Liberadas</option>
            </select>
          </div>

          {(areaFilter !== 'Todas' || clientFilter !== 'Todos' || statusFilter !== 'Todos') && (
            <button
              type="button"
              onClick={() => {
                setAreaFilter('Todas');
                setClientFilter('Todos');
                setStatusFilter('Todos');
              }}
              className="text-xs font-bold text-theme-primary hover:underline px-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Costo Acumulado / Proyectado */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Costo Proyectado
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-theme-main">
              ${dashboard.kpis.accumulatedPeriodCost.toLocaleString('es-MX')}
            </div>
            <div className="text-[11px] text-theme-muted mt-0.5">
              Estándar: ${dashboard.kpis.standardPeriodCost.toLocaleString('es-MX')}
            </div>
          </div>
        </div>

        {/* KPI 2: Variación Neta vs Estándar */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Variación Neta
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                dashboard.kpis.varianceVsStandardPct > 0
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {dashboard.kpis.varianceVsStandardPct > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-black ${
                dashboard.kpis.varianceVsStandardPct > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {dashboard.kpis.varianceVsStandardPct > 0 ? '+' : ''}
              {dashboard.kpis.varianceVsStandardPct.toFixed(1)}%
            </div>
            <div className="text-[11px] font-semibold mt-0.5 text-theme-muted">
              vs presupuesto estándar
            </div>
          </div>
        </div>

        {/* KPI 3: Costo Promedio por Unidad */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Costo Unit. Promedio
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-theme-main">
              ${dashboard.kpis.averageUnitCost.toFixed(3)}
            </div>
            <div className="text-[11px] text-theme-muted mt-0.5">
              Por pza / pliego producido
            </div>
          </div>
        </div>

        {/* KPI 4: Scrap Fuera de Estándar */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Scrap Extra
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              ${dashboard.kpis.outOfSpecScrapAmount.toLocaleString('es-MX')}
            </div>
            <div className="text-[11px] text-theme-muted mt-0.5">
              {dashboard.kpis.outOfSpecScrapCount} órdenes con merma extra
            </div>
          </div>
        </div>

        {/* KPI 5: Margen Proyectado */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Margen Ponderado
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-theme-main">
              {dashboard.kpis.projectedPeriodMarginPct.toFixed(1)}%
            </div>
            <div className="text-[11px] text-theme-muted mt-0.5">
              Erosión:{' '}
              <span className="text-rose-500 font-bold">
                {dashboard.kpis.projectedPeriodMarginDiffPts.toFixed(1)} pts
              </span>
            </div>
          </div>
        </div>

        {/* KPI 6: OPs con Erosión Crítica */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              Erosión de Margen
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                dashboard.kpis.criticalErosionCount > 0
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-black ${
                dashboard.kpis.criticalErosionCount > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {dashboard.kpis.criticalErosionCount} OPs
            </div>
            <div className="text-[11px] text-theme-muted mt-0.5">
              con desvío crítico de rentabilidad
            </div>
          </div>
        </div>
      </div>

      {/* SMART Suggestions Block (Enterprise Purple) */}
      {dashboard.suggestions.length > 0 && (
        <div className="rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-500/5 via-theme-surface to-indigo-500/5 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main tracking-tight flex items-center gap-2">
                  ✦ SUGERENCIAS DEL SISTEMA
                  <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-black text-purple-700 dark:text-purple-300">
                    IA DE COSTOS & EFICIENCIA
                  </span>
                </h3>
                <p className="text-xs text-theme-muted">
                  Detección proactiva de erosión de margen, desvíos de setup y oportunidades de optimización en piso.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {dashboard.suggestions.map((sugg) => (
              <div
                key={sugg.id}
                className="rounded-2xl border border-purple-500/15 bg-theme-surface/80 dark:bg-theme-surface/40 p-4 shadow-xs flex flex-col justify-between hover:border-purple-500/35 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                        sugg.type === 'margen' || sugg.type === 'setup'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          : sugg.type === 'scrap'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {sugg.type.toUpperCase()}
                    </span>
                    {sugg.impactAmount > 0 && (
                      <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 font-mono">
                        ${sugg.impactAmount.toLocaleString()} MXN
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-theme-main">{sugg.title}</h4>
                  <p className="text-xs text-theme-muted leading-relaxed">{sugg.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-theme-subtle flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-theme-muted font-bold">
                    {sugg.orderFolio}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (sugg.primaryActionTarget === 'Costeo' && sugg.orderFolio) {
                        const target = orders.find((o) => o.folio === sugg.orderFolio);
                        if (target) onOpenOrderCost(target);
                      } else if (sugg.primaryActionTarget === 'Scrap y pérdidas') {
                        onNavigateToTab?.('Scrap y pérdidas');
                      } else if (sugg.orderFolio) {
                        const target = orders.find((o) => o.folio === sugg.orderFolio);
                        if (target) onOpenOrderCost(target);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    <span>{sugg.primaryActionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protagonist Table: Control de Margen · Órdenes de Producción */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs overflow-hidden">
        <div className="p-6 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-theme-main tracking-tight">
                Control de Margen · Órdenes de Producción
              </h3>
              <span className="rounded-full bg-theme-muted/20 px-2 py-0.5 text-xs font-bold text-theme-muted">
                {tableRows.length} órdenes
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">
              Presupuesto cotizado vs costo estándar de ingeniería vs real acumulado / proyección al cierre.
            </p>
          </div>

          {/* Table Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar OP, cliente, pedido..."
                className="rounded-xl border border-theme-subtle bg-theme-surface pl-8.5 pr-3 py-1.5 text-xs text-theme-main placeholder:text-theme-muted focus:outline-hidden focus:ring-2 focus:ring-theme-primary w-48 sm:w-56"
              />
            </div>

            {/* Quick Risk Pills */}
            <div className="flex items-center gap-1 bg-theme-muted/10 p-1 rounded-xl border border-theme-subtle">
              <button
                type="button"
                onClick={() => setTableRiskFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  tableRiskFilter === 'all'
                    ? 'bg-theme-surface text-theme-main shadow-xs'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setTableRiskFilter('critical')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  tableRiskFilter === 'critical'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-theme-muted hover:text-rose-600'
                }`}
              >
                En Riesgo
              </button>
              <button
                type="button"
                onClick={() => setTableRiskFilter('healthy')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  tableRiskFilter === 'healthy'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-theme-muted hover:text-emerald-600'
                }`}
              >
                Saludables
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-theme-subtle bg-theme-muted/10 text-theme-muted uppercase tracking-wider text-[10px] font-black">
                <th className="py-3 px-4">Orden / Origen</th>
                <th className="py-3 px-4">Cliente / Parte</th>
                <th className="py-3 px-3 text-right">Venta Cotizada</th>
                <th className="py-3 px-3 text-right">Costo Estándar</th>
                <th className="py-3 px-3 text-right">Costo Proyectado</th>
                <th className="py-3 px-3 text-right">Variación</th>
                <th className="py-3 px-3 text-center">Margen Cot → Proy</th>
                <th className="py-3 px-3 text-center">Estado OP</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-theme-muted text-xs">
                    No se encontraron órdenes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                tableRows.map((row) => {
                  const correspondingOrder = orders.find((o) => o.folio === row.orderFolio);
                  const varColor =
                    row.totalCostVariancePct > 5
                      ? 'text-rose-600 dark:text-rose-400 font-black'
                      : row.totalCostVariancePct < -2
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-theme-main font-medium';

                  return (
                    <tr
                      key={row.orderFolio}
                      onClick={() => {
                        if (correspondingOrder) onOpenOrderCost(correspondingOrder);
                      }}
                      className="hover:bg-theme-muted/10 cursor-pointer transition-colors group"
                    >
                      {/* OP & Origin */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-theme-main group-hover:text-theme-primary transition-colors">
                            {row.orderFolio}
                          </span>
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-theme-muted/20 text-theme-muted">
                            {row.area}
                          </span>
                        </div>
                        {row.salesOrderFolio ? (
                          <div className="flex items-center gap-1 text-[10px] text-theme-primary font-mono mt-0.5">
                            <span>{row.salesOrderFolio}</span>
                            {onNavigateToSalesOrder && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToSalesOrder(row.salesOrderFolio!);
                                }}
                                title="Ver pedido comercial"
                                className="hover:text-theme-primary/80"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-theme-muted italic">Stock / Directa</div>
                        )}
                      </td>

                      {/* Cliente / Parte */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-bold text-theme-main truncate">{row.client}</div>
                        <div className="text-[10px] text-theme-muted truncate">{row.partNumber} · {row.revision}</div>
                      </td>

                      {/* Venta Cotizada */}
                      <td className="py-3.5 px-3 text-right font-mono text-theme-muted">
                        ${row.commercialSaleTotal.toLocaleString('es-MX')}
                      </td>

                      {/* Costo Estándar */}
                      <td className="py-3.5 px-3 text-right font-mono text-theme-muted">
                        ${row.totalStandardCost.toLocaleString('es-MX')}
                      </td>

                      {/* Costo Proyectado */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-black text-theme-main">
                          ${row.totalProjectedCost.toLocaleString('es-MX')}
                        </div>
                        <div className="text-[9px] text-theme-muted">
                          {row.isClosed ? 'Costo Final' : 'Proyección al cierre'}
                        </div>
                      </td>

                      {/* Variación */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className={varColor}>
                          {row.totalCostVarianceAmount > 0 ? '+' : ''}$
                          {Math.abs(row.totalCostVarianceAmount).toLocaleString('es-MX')}
                        </div>
                        <div className={`text-[10px] ${varColor}`}>
                          {row.totalCostVariancePct > 0 ? '+' : ''}
                          {row.totalCostVariancePct.toFixed(1)}%
                        </div>
                      </td>

                      {/* Margen Cot -> Proy */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-mono text-theme-muted text-[11px]">
                            {row.commercialMarginPct.toFixed(1)}%
                          </span>
                          <span className="text-theme-muted text-[10px]">→</span>
                          <span
                            className={`font-mono font-black text-xs px-2 py-0.5 rounded-full ${
                              row.marginStatus === 'Erosión Crítica'
                                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                : row.marginStatus === 'En Riesgo'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {row.projectedMarginPct.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Estado OP */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                            row.isClosed
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : row.status === 'Detenida'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (correspondingOrder) onOpenOrderCost(correspondingOrder);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-theme-subtle px-2.5 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 group-hover:border-theme-primary/40 transition-colors"
                        >
                          <span>Ver Costeo</span>
                          <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-primary" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anatomy of Cost & Main Variances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Anatomy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                Anatomía del Costo de Fabricación
              </h3>
              <span className="text-xs font-mono font-bold text-theme-muted">
                ${dashboard.kpis.accumulatedPeriodCost.toLocaleString('es-MX')}
              </span>
            </div>
            <p className="text-xs text-theme-muted mb-4">
              Participación porcentual de los 6 componentes de costo industrial acumulados en el período.
            </p>

            {/* Visual Stacked Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-theme-muted/20 mb-5">
              {dashboard.costAnatomy.map((cat, idx) => (
                <div
                  key={idx}
                  style={{ width: `${cat.percentage}%` }}
                  className={`${cat.color} h-full`}
                  title={`${cat.category}: ${cat.percentage}%`}
                />
              ))}
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {dashboard.costAnatomy.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-xs ${cat.color} shrink-0`} />
                    <span className="font-bold text-theme-main">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-theme-muted">
                      ${cat.amount.toLocaleString('es-MX')}
                    </span>
                    <span className="font-bold text-theme-main w-12 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-theme-subtle text-[11px] text-theme-muted flex items-center justify-between">
            <span>MOD activa: ${costConfig.laborHourlyRate}/h</span>
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="text-theme-primary font-bold hover:underline"
            >
              Modificar parámetros demo
            </button>
          </div>
        </div>

        {/* Variaciones Principales por Dimensión (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider mb-1">
              Mayores Desvíos de Costo por Dimensión
            </h3>
            <p className="text-xs text-theme-muted mb-4">
              Insumos con mayor variación de precio/consumo y máquinas con sobre-tiempos de operación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Material Variances */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                  Materiales con Mayor Desvío
                </span>
                <div className="space-y-2">
                  {dashboard.materialVariances.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-theme-subtle p-3 bg-theme-surface hover:bg-theme-muted/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-theme-main truncate max-w-[140px]">
                          {item.name}
                        </span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            item.impact > 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {item.impact > 0 ? '+' : ''}$
                          {Math.abs(item.impact).toLocaleString('es-MX')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-theme-muted mt-1 font-mono">
                        <span>{item.standardQty} std → {item.actualQty} real</span>
                        <span>{item.variancePct > 0 ? '+' : ''}{item.variancePct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machine Time Variances */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                  Máquinas con Desvío de Tiempo
                </span>
                <div className="space-y-2">
                  {dashboard.machineTimeVariances.slice(0, 3).map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-theme-subtle p-3 bg-theme-surface hover:bg-theme-muted/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-theme-main truncate max-w-[140px]">
                          {m.machine}
                        </span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            m.impact > 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {m.impact > 0 ? '+' : ''}$
                          {Math.abs(m.impact).toLocaleString('es-MX')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-theme-muted mt-1 font-mono">
                        <span>
                          {m.diffMin > 0 ? `+${m.diffMin} min` : `${m.diffMin} min`} vs std
                        </span>
                        <span>{m.actualMin} min totales</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-theme-subtle flex items-center justify-between text-xs">
            <span className="text-theme-muted">
              Scrap fuera de estándar: <b className="text-theme-main">${dashboard.kpis.outOfSpecScrapAmount.toLocaleString()} MXN</b>
            </span>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('Scrap y pérdidas')}
                className="text-theme-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Ver Módulo Scrap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top 5 Margin Erosion vs Top 5 Efficiency Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Erosion */}
        <div className="rounded-3xl border border-rose-500/20 bg-theme-surface p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-theme-main tracking-tight">
                Top 5 · Mayor Erosión de Margen
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Impacto Negativo
            </span>
          </div>

          <div className="divide-y divide-theme-subtle">
            {dashboard.topErosion.length === 0 ? (
              <div className="py-6 text-center text-xs text-theme-muted">
                No hay órdenes con erosión de margen significativa.
              </div>
            ) : (
              dashboard.topErosion.map((item) => {
                const targetOrder = orders.find((o) => o.folio === item.orderFolio);
                return (
                  <div
                    key={item.orderFolio}
                    onClick={() => {
                      if (targetOrder) onOpenOrderCost(targetOrder);
                    }}
                    className="py-3 flex items-center justify-between hover:bg-theme-muted/10 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-theme-main">
                          {item.orderFolio}
                        </span>
                        <span className="text-xs text-theme-muted truncate max-w-[130px]">
                          {item.client}
                        </span>
                      </div>
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                        Erosión: -{item.marginErosionPct.toFixed(1)}% · {item.drivers[0]?.title || 'Sobrecosto en piso'}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                        {item.projectedMarginPct.toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-theme-muted">
                        Cotizado: {item.commercialMarginPct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top 5 Efficiency Savings */}
        <div className="rounded-3xl border border-emerald-500/20 bg-theme-surface p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-theme-main tracking-tight">
                Top 5 · Mayor Ahorro & Eficiencia
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Sobre-margen
            </span>
          </div>

          <div className="divide-y divide-theme-subtle">
            {dashboard.topSavings.length === 0 ? (
              <div className="py-6 text-center text-xs text-theme-muted">
                Todas las órdenes operan dentro de los parámetros estándar.
              </div>
            ) : (
              dashboard.topSavings.map((item) => {
                const targetOrder = orders.find((o) => o.folio === item.orderFolio);
                return (
                  <div
                    key={item.orderFolio}
                    onClick={() => {
                      if (targetOrder) onOpenOrderCost(targetOrder);
                    }}
                    className="py-3 flex items-center justify-between hover:bg-theme-muted/10 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-theme-main">
                          {item.orderFolio}
                        </span>
                        <span className="text-xs text-theme-muted truncate max-w-[130px]">
                          {item.client}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Ahorro neto en operación
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {item.projectedMarginPct.toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-theme-muted">
                        Cotizado: {item.commercialMarginPct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Production Cost Config Modal */}
      {isConfigModalOpen && (
        <ProductionCostConfigModal
          config={costConfig}
          onClose={() => setIsConfigModalOpen(false)}
          onSaveConfig={(updated) => setCostConfig(updated)}
        />
      )}
    </div>
  );
};
