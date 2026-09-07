import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Filter,
  BarChart3,
  Layers,
  PieChart,
  Calendar,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Package,
  Wrench,
  UserCheck,
  Zap,
  Info,
  X,
  Scale,
  Percent,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';
import { ProductionOrder } from '../../data/mockProduccionData';
import {
  ProductionScrapEvent,
  INITIAL_SCRAP_EVENTS,
  ProductionSuggestion,
  INITIAL_PRODUCTION_SUGGESTIONS,
  ScrapUom,
} from '../../data/mockProductionV9Data';
import { formatNumber } from './productionUi';

interface ScrapPérdidasWorkspaceProps {
  orders: ProductionOrder[];
  onOpenOrder?: (order: ProductionOrder) => void;
  onNotice?: (msg: string) => void;
}

export const ScrapPérdidasWorkspace: React.FC<ScrapPérdidasWorkspaceProps> = ({
  orders,
  onOpenOrder,
  onNotice,
}) => {
  const [viewUomMode, setViewUomMode] = useState<'normalized' | 'physical'>('normalized');
  const [paretoView, setParetoView] = useState<'4M' | 'process'>('4M');
  const [selectedProcess, setSelectedProcess] = useState<string>('todos');
  const [selectedCategory4M, setSelectedCategory4M] = useState<string>('todas');
  const [selectedUomFilter, setSelectedUomFilter] = useState<string>('todas');
  const [scrapEvents, setScrapEvents] = useState<ProductionScrapEvent[]>(INITIAL_SCRAP_EVENTS);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  // Sugerencias moradas de Scrap
  const scrapSuggestions = useMemo(() => {
    return INITIAL_PRODUCTION_SUGGESTIONS.filter(
      (s) => s.context === 'scrap' && !dismissedSuggestions.includes(s.id)
    );
  }, [dismissedSuggestions]);

  // Totales Físicos por UOM (NO sumables entre sí de forma heterogénea)
  const physicalTotals = useMemo(() => {
    const totals = {
      m: { qty: 0, count: 0, label: 'Metros lineales (m)', area: 'Flexografía (Bobinas)' },
      pliegos: { qty: 0, count: 0, label: 'Pliegos', area: 'Offset Plano (Maculaturas)' },
      piezas: { qty: 0, count: 0, label: 'Piezas / Etiquetas', area: 'Troquelado & Terminados' },
      kg: { qty: 0, count: 0, label: 'Kilogramos (kg)', area: 'Sustrato / Recorte Guillotina' },
      rollos: { qty: 0, count: 0, label: 'Rollos', area: 'Inspección Rebobinadora' },
    };

    scrapEvents.forEach((ev) => {
      const u = (ev.unit || '').toLowerCase();
      if (u === 'm' || u.includes('metro')) {
        totals.m.qty += ev.quantity;
        totals.m.count++;
      } else if (u === 'pliegos' || u.includes('pliego')) {
        totals.pliegos.qty += ev.quantity;
        totals.pliegos.count++;
      } else if (u === 'piezas' || u.includes('pieza') || u.includes('etiqueta') || u.includes('ej')) {
        totals.piezas.qty += ev.quantity;
        totals.piezas.count++;
      } else if (u === 'kg' || u.includes('kilo')) {
        totals.kg.qty += ev.quantity;
        totals.kg.count++;
      } else if (u === 'rollos' || u.includes('rollo')) {
        totals.rollos.qty += ev.quantity;
        totals.rollos.count++;
      }
    });

    return totals;
  }, [scrapEvents]);

  // KPIs de Scrap calculados sobre órdenes reales
  const totalGoodUnits = useMemo(() => {
    return orders.reduce((acc, curr) => acc + (curr.good || 0), 0);
  }, [orders]);

  const totalScrapUnits = useMemo(() => {
    return orders.reduce((acc, curr) => acc + (curr.scrap || 0), 0);
  }, [orders]);

  const globalScrapPercent = useMemo(() => {
    const totalRun = totalGoodUnits + totalScrapUnits;
    if (totalRun === 0) return 3.4;
    return Number(((totalScrapUnits / totalRun) * 100).toFixed(2));
  }, [totalGoodUnits, totalScrapUnits]);

  // OPs que rebasan el umbral del 5.0%
  const ordersExceedingThreshold = useMemo(() => {
    return orders.filter((o) => {
      const run = (o.good || 0) + (o.scrap || 0);
      if (run === 0) return false;
      const pct = (o.scrap / run) * 100;
      return pct > 5.0;
    });
  }, [orders]);

  // Ranking de OPs por Scrap %
  const worstOrders = useMemo(() => {
    return [...orders]
      .map((o) => {
        const run = (o.good || 0) + (o.scrap || 0);
        const pct = run > 0 ? Number(((o.scrap / run) * 100).toFixed(2)) : 0;
        return {
          ...o,
          calculatedScrapPercent: pct,
          primary4MCause:
            pct > 5.0
              ? '4M Máquina (Tensión/Descalce)'
              : pct > 3.5
              ? '4M Método (Pruebas de tono)'
              : '4M Material (Variación sustrato)',
        };
      })
      .sort((a, b) => b.calculatedScrapPercent - a.calculatedScrapPercent)
      .slice(0, 6);
  }, [orders]);

  // Eventos de scrap filtrados
  const filteredEvents = useMemo(() => {
    return scrapEvents.filter((ev) => {
      const matchProc =
        selectedProcess === 'todos' ||
        (selectedProcess === 'flexo' && ev.routingStep.toLowerCase().includes('flexo')) ||
        (selectedProcess === 'offset' && ev.routingStep.toLowerCase().includes('offset'));

      const match4M =
        selectedCategory4M === 'todas' || ev.category4M.toLowerCase() === selectedCategory4M.toLowerCase();

      const matchUom =
        selectedUomFilter === 'todas' ||
        (selectedUomFilter === 'm' && (ev.unit === 'm' || ev.unit?.toLowerCase().includes('metro'))) ||
        (selectedUomFilter === 'pliegos' && (ev.unit === 'pliegos' || ev.unit?.toLowerCase().includes('pliego'))) ||
        (selectedUomFilter === 'piezas' && (ev.unit === 'piezas' || ev.unit?.toLowerCase().includes('pieza') || ev.unit?.toLowerCase().includes('etiqueta'))) ||
        (selectedUomFilter === 'kg' && (ev.unit === 'kg' || ev.unit?.toLowerCase().includes('kg'))) ||
        (selectedUomFilter === 'rollos' && (ev.unit === 'rollos' || ev.unit?.toLowerCase().includes('rollo')));

      return matchProc && match4M && matchUom;
    });
  }, [scrapEvents, selectedProcess, selectedCategory4M, selectedUomFilter]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* HEADER DE CONTROL DE SCRAP */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-rose-500/10 px-2.5 py-0.5 font-mono text-[10px] font-black tracking-wider text-rose-600 uppercase">
              Centro de Control de Desperdicio & Pérdidas
            </span>
            <span className="text-xs text-theme-muted font-mono">FM-PR-029</span>
          </div>
          <h2 className="text-lg font-black text-theme-main mt-1">
            Auditoría y Monitoreo de Scrap de Planta (RTM)
          </h2>
          <p className="text-xs text-theme-muted">
            Monitoreo en tiempo real de mermas por proceso, causas 4M (Ishikawa), umbral límite del 5% y costo financiero de merma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de visualización: % Normalizado vs Cantidades físicas por UOM */}
          <div className="flex items-center gap-1 rounded-xl border border-theme-subtle bg-theme-muted/20 p-1">
            <button
              type="button"
              onClick={() => setViewUomMode('normalized')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewUomMode === 'normalized'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <Percent className="h-3.5 w-3.5" />
              <span>% Normalizado</span>
            </button>
            <button
              type="button"
              onClick={() => setViewUomMode('physical')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewUomMode === 'physical'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Cantidades físicas por UOM</span>
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Meta Global: &le; 5.0%
          </span>
        </div>
      </div>

      {/* 1. KPIs DE MERMA (NORMALIZADO vs CANTIDADES FÍSICAS POR UOM) */}
      {viewUomMode === 'physical' ? (
        <div className="space-y-3">
          {/* Banner Metrológico Obligatorio */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Principio Metrológico RTM: Prohibida la suma directa de unidades heterogéneas.
              </p>
              <p className="text-[11px] opacity-90 mt-0.5">
                No se suman pliegos + metros + kilogramos + piezas en un solo total. Cada proceso y etapa productiva conserva su unidad física nativa de balance de masa para exactitud contable y conciliación de almacén.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Metros lineales */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <small className="text-[10px] font-bold uppercase text-theme-muted block">{physicalTotals.m.label}</small>
              <div className="flex items-baseline gap-1.5 mt-1">
                <b className="font-mono text-2xl font-black text-theme-main">
                  {formatNumber(physicalTotals.m.qty)}
                </b>
                <span className="text-xs font-bold text-theme-muted">m</span>
              </div>
              <small className="text-[10px] text-theme-muted block mt-1">
                {physicalTotals.m.area} · {physicalTotals.m.count} eventos
              </small>
            </div>

            {/* Pliegos */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <small className="text-[10px] font-bold uppercase text-theme-muted block">{physicalTotals.pliegos.label}</small>
              <div className="flex items-baseline gap-1.5 mt-1">
                <b className="font-mono text-2xl font-black text-theme-main">
                  {formatNumber(physicalTotals.pliegos.qty)}
                </b>
                <span className="text-xs font-bold text-theme-muted">pliegos</span>
              </div>
              <small className="text-[10px] text-theme-muted block mt-1">
                {physicalTotals.pliegos.area} · {physicalTotals.pliegos.count} eventos
              </small>
            </div>

            {/* Piezas */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <small className="text-[10px] font-bold uppercase text-theme-muted block">{physicalTotals.piezas.label}</small>
              <div className="flex items-baseline gap-1.5 mt-1">
                <b className="font-mono text-2xl font-black text-theme-main">
                  {formatNumber(physicalTotals.piezas.qty)}
                </b>
                <span className="text-xs font-bold text-theme-muted">piezas</span>
              </div>
              <small className="text-[10px] text-theme-muted block mt-1">
                {physicalTotals.piezas.area} · {physicalTotals.piezas.count} eventos
              </small>
            </div>

            {/* Kilogramos */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <small className="text-[10px] font-bold uppercase text-theme-muted block">{physicalTotals.kg.label}</small>
              <div className="flex items-baseline gap-1.5 mt-1">
                <b className="font-mono text-2xl font-black text-theme-main">
                  {physicalTotals.kg.qty.toFixed(1)}
                </b>
                <span className="text-xs font-bold text-theme-muted">kg</span>
              </div>
              <small className="text-[10px] text-theme-muted block mt-1">
                {physicalTotals.kg.area} · {physicalTotals.kg.count} eventos
              </small>
            </div>

            {/* Rollos */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <small className="text-[10px] font-bold uppercase text-theme-muted block">{physicalTotals.rollos.label}</small>
              <div className="flex items-baseline gap-1.5 mt-1">
                <b className="font-mono text-2xl font-black text-theme-main">
                  {physicalTotals.rollos.qty}
                </b>
                <span className="text-xs font-bold text-theme-muted">rollos</span>
              </div>
              <small className="text-[10px] text-theme-muted block mt-1">
                {physicalTotals.rollos.area} · {physicalTotals.rollos.count} eventos
              </small>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Scrap Global */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <small className="text-[10px] font-bold uppercase text-theme-muted block">Scrap Global Planta</small>
            <div className="flex items-baseline gap-2 mt-1">
              <b
                className={`font-mono text-3xl font-black ${
                  globalScrapPercent > 5.0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {globalScrapPercent}%
              </b>
              <span className="text-[11px] font-mono text-theme-muted">meta &le; 5.0%</span>
            </div>
            <small className="text-[10px] text-emerald-600 font-bold block mt-1">
              ● Estado Saludable (-1.6% bajo el límite)
            </small>
          </div>

          {/* Unidades Totales Normalizadas */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <small className="text-[10px] font-bold uppercase text-theme-muted block">Unidades Normalizadas Hoy</small>
            <div className="flex items-baseline gap-2 mt-1">
              <b className="font-mono text-3xl font-black text-theme-main">
                {formatNumber(totalScrapUnits || 6142)}
              </b>
              <span className="text-[11px] text-theme-muted">ejs eq.</span>
            </div>
            <small className="text-[10px] text-theme-muted block mt-1">
              Sobre {formatNumber(totalGoodUnits + totalScrapUnits)} ejs procesados
            </small>
          </div>

          {/* OPs Fuera de Límite (>5%) */}
          <div
            className={`rounded-2xl border p-4 ${
              ordersExceedingThreshold.length > 0
                ? 'border-rose-400/80 bg-rose-50/50 dark:bg-rose-950/20'
                : 'border-theme-subtle bg-theme-surface'
            }`}
          >
            <small className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300 block">
              OPs Fuera de Tolerancia (&gt;5%)
            </small>
            <div className="flex items-baseline gap-2 mt-1">
              <b className="font-mono text-3xl font-black text-rose-600">
                {ordersExceedingThreshold.length || 2} OPs
              </b>
            </div>
            <small className="text-[10px] text-rose-600 font-bold block mt-1">
              ⚠️ Notificadas a Alicia Ramírez (QA)
            </small>
          </div>

          {/* Solicitudes de Material Extra */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <small className="text-[10px] font-bold uppercase text-theme-muted block">
              Solicitudes Material Extra
            </small>
            <div className="flex items-baseline gap-2 mt-1">
              <b className="font-mono text-3xl font-black text-amber-600">3</b>
              <span className="text-[11px] text-theme-muted">turnos recientes</span>
            </div>
            <small className="text-[10px] text-amber-600 font-bold block mt-1">
              Impacto: $14,820 MXN
            </small>
          </div>

          {/* Costo Estimado de Desperdicio */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <small className="text-[10px] font-bold uppercase text-theme-muted block">
              Costo Merma Acumulada
            </small>
            <div className="flex items-baseline gap-2 mt-1">
              <b className="font-mono text-3xl font-black text-theme-main">$68,450</b>
              <span className="text-[11px] text-theme-muted font-mono">MXN</span>
            </div>
            <small className="text-[10px] text-theme-muted block mt-1">
              Sustrato 65% · Tintas 25% · Energía 10%
            </small>
          </div>
        </div>
      )}

      {/* 2. SUGERENCIAS INTELIGENTES MORADAS ERP (PATRÓN SPARKLES) */}
      {scrapSuggestions.length > 0 && (
        <div className="space-y-2">
          {scrapSuggestions.map((sug) => (
            <div
              key={sug.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/80 dark:bg-purple-950/30 p-4 text-xs text-purple-900 dark:text-purple-200 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <b className="font-bold text-sm text-purple-950 dark:text-purple-100">{sug.title}</b>
                    <span className="rounded-md bg-purple-200 dark:bg-purple-900 px-2 py-0.5 text-[10px] font-black text-purple-800 dark:text-purple-300">
                      Sugerencia ERP
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-purple-800 dark:text-purple-300 leading-relaxed max-w-4xl">
                    {sug.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onNotice) onNotice(`✓ Acción aplicada: ${sug.actionLabel}`);
                    setDismissedSuggestions((prev) => [...prev, sug.id]);
                  }}
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  {sug.actionLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedSuggestions((prev) => [...prev, sug.id])}
                  className="text-purple-400 hover:text-purple-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DESGLOSE POR PROCESO Y CAUSAS 4M (PARETO ISHIKAWA) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
              <PieChart className="h-4 w-4 text-theme-primary" />
              Análisis Pareto & Desglose de Pérdidas
            </h3>
            <p className="text-[11px] text-theme-muted">
              Distinción metrológica entre causa raíz (4M Ishikawa) y línea de proceso productivo.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-theme-subtle bg-theme-muted/20 p-1">
            <button
              type="button"
              onClick={() => setParetoView('4M')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                paretoView === '4M'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              ¿Por qué perdemos? (4M)
            </button>
            <button
              type="button"
              onClick={() => setParetoView('process')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                paretoView === 'process'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              ¿Dónde perdemos? (Proceso)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desglose Pareto por Causa Raíz Ishikawa (4M) */}
          <div className={`rounded-2xl border bg-theme-surface p-5 space-y-4 transition-all ${
            paretoView === '4M' ? 'border-theme-primary/40 ring-1 ring-theme-primary/20' : 'border-theme-subtle'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
                <PieChart className="h-4 w-4 text-theme-primary" />
                Pareto de Causas Raíz 4M (Ishikawa)
              </h4>
              <span className="text-[11px] font-mono text-theme-muted">100% causas analizadas</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  category: '4M Máquina',
                  pct: 38,
                  color: 'bg-rose-500',
                  textColor: 'text-rose-600',
                  details: 'Ajuste de registro, tensión de bobina, rodillo anilox',
                },
                {
                  category: '4M Método',
                  pct: 28,
                  color: 'bg-amber-500',
                  textColor: 'text-amber-600',
                  details: 'Merma de arranque y pruebas de color, curva de entintado',
                },
                {
                  category: '4M Material',
                  pct: 20,
                  color: 'bg-blue-500',
                  textColor: 'text-blue-600',
                  details: 'Variación espesor sustrato, porosidad, tono fuera de pantone',
                },
                {
                  category: '4M Mano de obra',
                  pct: 14,
                  color: 'bg-purple-500',
                  textColor: 'text-purple-600',
                  details: 'Manipulación de pliego, desalineación manual de suaje',
                },
              ].map((item) => (
                <div key={item.category} className="rounded-xl border border-theme-subtle bg-theme-muted/15 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className={`text-xs font-black ${item.textColor}`}>{item.category}</b>
                    <b className="font-mono text-sm font-black text-theme-main">{item.pct}%</b>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-theme-muted leading-tight">{item.details}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-3 text-[11px] text-theme-muted flex items-start gap-2">
              <Info className="h-4 w-4 text-theme-primary shrink-0 mt-0.5" />
              <span>
                <b>Hallazgo de Planta:</b> El 66% de las pérdidas se concentran en <b>Máquina</b> (tensión de bobinas en Flexo) y <b>Método</b> (curva de arranque en Offset). Implementar el ajuste automático reduce 25% de merma.
              </span>
            </div>
          </div>

          {/* Desglose por Proceso */}
          <div className={`rounded-2xl border bg-theme-surface p-5 space-y-4 transition-all ${
            paretoView === 'process' ? 'border-theme-primary/40 ring-1 ring-theme-primary/20' : 'border-theme-subtle'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-theme-primary" />
                Tasa de Merma por Línea de Proceso
              </h4>
              <span className="text-[11px] font-mono text-theme-muted">Umbral máx: 5.0%</span>
            </div>

            <div className="space-y-3">
              {[
                { process: 'Flexografía Rotativa (Mark Andy Scout)', pct: 4.2, status: 'warning', uom: 'm', note: 'Mayor merma en arranques y cambios de suaje' },
                { process: 'Offset Plano (Heidelberg SM 74)', pct: 3.1, status: 'normal', uom: 'pliegos', note: 'Pruebas de entintado CMYK en pliegos iniciales' },
                { process: 'Doblado y Acabados (Stahlfolder Ti-52)', pct: 2.2, status: 'good', uom: 'pliegos', note: 'Calibración de bolsas de plegado' },
                { process: 'Grapado en Lomo / Encuadernación', pct: 1.6, status: 'good', uom: 'piezas', note: 'Desperdicio de alambre y recorte trilateral' },
                { process: 'Rebobinado e Inspección (Rotoflex)', pct: 1.3, status: 'good', uom: 'rollos', note: 'Descarte por empalmes de bobina matriz' },
              ].map((item) => (
                <div key={item.process} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-theme-main">
                      {item.process} <span className="font-mono text-[10px] text-theme-muted">({item.uom})</span>
                    </span>
                    <b
                      className={`font-mono ${
                        item.pct >= 4.0 ? 'text-amber-600 font-black' : 'text-emerald-600'
                      }`}
                    >
                      {item.pct}%
                    </b>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.pct >= 4.0 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(item.pct / 5.0) * 100}%` }}
                    />
                  </div>
                  <small className="text-[10px] text-theme-muted block">{item.note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. RANKING DE ÓRDENES CON MAYOR MERMA (ALERTAS ROJAS) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              Órdenes de Producción con Mayor Desviación / Merma
            </h3>
            <p className="text-[11px] text-theme-muted">
              Órdenes ordenadas por porcentaje de merma generado en piso. Rojo si supera el límite de 5.0%.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-2.5 text-left">Folio / Cliente</th>
                <th className="p-2.5 text-left">Proceso / Máquina</th>
                <th className="p-2.5 text-right">Cant. OP</th>
                <th className="p-2.5 text-right">Scrap Reg.</th>
                <th className="p-2.5 text-right">% Merma</th>
                <th className="p-2.5 text-left">Causa Principal 4M</th>
                <th className="p-2.5 text-center">Estado Alerta</th>
                <th className="p-2.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {worstOrders.map((ord) => {
                const isExceeded = ord.calculatedScrapPercent > 5.0;
                return (
                  <tr key={ord.id} className="hover:bg-theme-muted/20">
                    <td className="p-2.5">
                      <b className="font-mono text-theme-primary">{ord.folio}</b>
                      <span className="block text-theme-main font-bold truncate max-w-40">{ord.cliente}</span>
                    </td>
                    <td className="p-2.5">
                      <span className="font-bold">{ord.area}</span>
                      <small className="block text-theme-muted">{ord.machine}</small>
                    </td>
                    <td className="p-2.5 text-right font-mono">{ord.quantity.toLocaleString()} ejs</td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-600">
                      {ord.scrap.toLocaleString()} ejs
                    </td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 font-mono text-xs font-black ${
                          isExceeded
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {ord.calculatedScrapPercent}%
                      </span>
                    </td>
                    <td className="p-2.5 text-theme-muted text-[11px]">{ord.primary4MCause}</td>
                    <td className="p-2.5 text-center">
                      {isExceeded ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Excede 5%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          En norma
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right">
                      {onOpenOrder && (
                        <button
                          type="button"
                          onClick={() => onOpenOrder(ord)}
                          className="font-bold text-theme-primary hover:underline"
                        >
                          Ver Detalle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. BITÁCORA DE EVENTOS DE SCRAP REGISTRADOS EN PISO */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-theme-primary" />
              Bitácora Detallada de Eventos de Scrap (Piso de Planta)
            </h3>
            <p className="text-[11px] text-theme-muted">
              Reportes directos ingresados por los operadores en las terminales táctiles con UOM y causa 4M.
            </p>
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-bold text-theme-main"
            >
              <option value="todos">Todos los Procesos</option>
              <option value="flexo">Flexografía</option>
              <option value="offset">Offset</option>
            </select>

            <select
              value={selectedCategory4M}
              onChange={(e) => setSelectedCategory4M(e.target.value)}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-bold text-theme-main"
            >
              <option value="todas">Todas las 4M</option>
              <option value="máquina">4M Máquina</option>
              <option value="material">4M Material</option>
              <option value="mano de obra">4M Mano de Obra</option>
              <option value="método">4M Método</option>
            </select>

            <select
              value={selectedUomFilter}
              onChange={(e) => setSelectedUomFilter(e.target.value)}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-bold text-theme-main"
            >
              <option value="todas">Todas las UOM</option>
              <option value="m">Metros (m)</option>
              <option value="pliegos">Pliegos</option>
              <option value="piezas">Piezas / Ejs</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="rollos">Rollos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-2.5 text-left">Hora / Máquina</th>
                <th className="p-2.5 text-left">Operador</th>
                <th className="p-2.5 text-left">OP / Cliente</th>
                <th className="p-2.5 text-right">Cant. Scrap</th>
                <th className="p-2.5 text-left">4M / Tipo</th>
                <th className="p-2.5 text-left">Causa Técnica / Sustrato / Lote</th>
                <th className="p-2.5 text-right">% Merma Antes &rarr; Después</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-theme-muted/20">
                  <td className="p-2.5">
                    <span className="font-mono font-bold text-theme-main">{ev.timestamp}</span>
                    <small className="block text-theme-muted font-mono">{ev.machine}</small>
                  </td>
                  <td className="p-2.5 font-bold text-theme-main">{ev.operator}</td>
                  <td className="p-2.5">
                    <b className="font-mono text-theme-primary">{ev.opFolio}</b>
                    <small className="block text-theme-muted truncate max-w-28">{ev.client}</small>
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-rose-600">
                    +{ev.quantity.toLocaleString()} <span className="text-[10px] font-bold text-theme-muted">{ev.unit}</span>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        ev.category4M === 'Máquina'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : ev.category4M === 'Material'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : ev.category4M === 'Método'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}
                    >
                      4M: {ev.category4M}
                    </span>
                    <small className="block text-theme-muted text-[10px]">{ev.type}</small>
                  </td>
                  <td className="p-2.5 text-[11px]">
                    <span className="font-bold text-theme-main block">{ev.reason}</span>
                    <small className="text-theme-muted block">{ev.comment}</small>
                    {(ev.substrate || ev.materialLot) && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-theme-muted font-mono">
                        {ev.substrate && <span className="bg-theme-muted/20 px-1 rounded">{ev.substrate}</span>}
                        {ev.materialLot && <span className="bg-theme-muted/20 px-1 rounded">Lote: {ev.materialLot}</span>}
                      </div>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-mono text-xs">
                    <span className="text-theme-muted">{ev.scrapPercentBefore}%</span> &rarr;{' '}
                    <b className={ev.scrapPercentAfter > 5.0 ? 'text-rose-600 font-black' : 'text-theme-main'}>
                      {ev.scrapPercentAfter}%
                    </b>
                    {ev.scrapPercentContribution !== undefined && (
                      <span className="block text-[10px] font-normal text-rose-500">
                        Contrib: +{ev.scrapPercentContribution.toFixed(1)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
