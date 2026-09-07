import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FilePlus2,
  FileText,
  Filter,
  HelpCircle,
  History,
  Layers,
  Link as LinkIcon,
  Lock,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  INITIAL_MRP_MATERIALS,
  INITIAL_MRP_SYSTEM_SUGGESTIONS,
  MrpMaterialPlanningItem,
  MrpHorizon,
  MrpArea,
  MrpStatus,
  filterMrpMaterials,
} from '../../../data/mockMrpData';
import { ProductionOrder } from '../../../data/mockProduccionData';
import { Material360Drawer } from './Material360Drawer';

interface Props {
  orders?: ProductionOrder[];
  onNavigateToOp?: (opFolio: string) => void;
  onNavigateToPurchaseOrder?: (poFolio: string) => void;
  onNavigateToRequisitions?: (prefill: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    note?: string;
    targetWarehouseId?: string;
  }) => void;
  onNotice?: (msg: string) => void;
  onToast?: (msg: string) => void;
}

export const MaterialesMrpWorkspace: React.FC<Props> = ({
  orders,
  onNavigateToOp,
  onNavigateToPurchaseOrder,
  onNavigateToRequisitions,
  onNotice,
  onToast,
}) => {
  // Filtros globales
  const [horizon, setHorizon] = useState<MrpHorizon>('30d');
  const [area, setArea] = useState<MrpArea>('Todas');
  const [statusFilter, setStatusFilter] = useState<MrpStatus>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Selector de vista: Cobertura vs Matriz OP x Material vs Timeline
  const [activeView, setActiveView] = useState<'cobertura' | 'matriz' | 'timeline'>('cobertura');

  // Estado del Drawer 360
  const [selectedMaterial, setSelectedMaterial] = useState<MrpMaterialPlanningItem | null>(null);

  // Materiales filtrados
  const filteredMaterials = useMemo(() => {
    return filterMrpMaterials(INITIAL_MRP_MATERIALS, horizon, area, statusFilter, searchTerm);
  }, [horizon, area, statusFilter, searchTerm]);

  // Cálculos de KPIs Ejecutivos
  const kpiData = useMemo(() => {
    const atRisk = INITIAL_MRP_MATERIALS.filter(
      (m) => m.status === 'Riesgo' || m.status === 'Cobertura insuficiente'
    ).length;

    const stockouts = INITIAL_MRP_MATERIALS.filter((m) => m.status === 'Faltante').length;

    // Calcular OPs únicas afectadas por faltantes o riesgos
    const opsSet = new Set<string>();
    INITIAL_MRP_MATERIALS.forEach((m) => {
      if (m.status === 'Riesgo' || m.status === 'Cobertura insuficiente' || m.status === 'Faltante') {
        m.demandingOps.forEach((op) => {
          if (op.status !== 'Cubierto') opsSet.add(op.opFolio);
        });
      }
    });

    // Valor de compra sugerido (gap neto * precio unitario)
    const suggestedPurchaseValue = INITIAL_MRP_MATERIALS.reduce((sum, m) => {
      if (m.netGapQuantity > 0) {
        return sum + m.netGapQuantity * m.unitPrice;
      }
      return sum;
    }, 0);

    // Cobertura promedio ponderada en días
    const avgCoverage =
      INITIAL_MRP_MATERIALS.reduce((acc, m) => acc + m.coverageDays, 0) / INITIAL_MRP_MATERIALS.length;

    // Conteo de OCs abiertas
    const totalOpenPos = INITIAL_MRP_MATERIALS.reduce((sum, m) => sum + m.openPurchaseOrders.length, 0);

    return {
      atRisk,
      stockouts,
      affectedOpsCount: opsSet.size,
      suggestedPurchaseValue,
      avgCoverage,
      totalOpenPos,
    };
  }, []);

  // Materiales de mayor riesgo para el bloque protagonista ("Requiere tu atención")
  const criticalRiskMaterials = useMemo(() => {
    return INITIAL_MRP_MATERIALS.filter(
      (m) => m.status === 'Riesgo' || m.status === 'Cobertura insuficiente' || m.status === 'Faltante'
    );
  }, []);

  // Handler de actualización demo
  const handleRefresh = () => {
    onToast?.('✓ Planeación de materiales MRP recalculada con demandas actualizadas.');
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'SKU,Material,Area,Fisico,Comprometido,HOLD,Util,Demanda,OC_Abierta,Dias_Cobertura,Estado\n' +
      filteredMaterials
        .map(
          (m) =>
            `"${m.sku}","${m.name}","${m.area}",${m.physicalStock},${m.committedStock},${m.holdStock},${m.usefulStock},${m.demandsByHorizon[horizon]},${m.confirmedSupply},${m.coverageDays.toFixed(1)},"${m.status}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MRP_Planeacion_Materiales_${horizon}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onToast?.(`✓ Archivo exportado: MRP_Planeacion_Materiales_${horizon}.csv`);
  };

  const handleApplySuggestion = (sug: typeof INITIAL_MRP_SYSTEM_SUGGESTIONS[0]) => {
    if (sug.actionType === 'requisition' && sug.prefillData && onNavigateToRequisitions) {
      onNavigateToRequisitions(sug.prefillData);
    } else {
      onToast?.(`✓ Acción iniciada: ${sug.actionLabel}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Premium & Filtros Reactivos */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-theme-main tracking-tight flex items-center gap-2">
                  Planeación de Materiales · MRP
                  <span className="rounded-full bg-theme-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-theme-primary border border-theme-primary/20">
                    Producción RTM
                  </span>
                </h1>
                <p className="text-xs text-theme-muted">
                  Demanda próxima, cobertura, órdenes abiertas y riesgo de suministro para las órdenes de producción RTM.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5 text-theme-muted" />
              <span>Actualizar planeación</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros: Horizonte, Área, Estado y Buscador */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle">
          {/* Horizonte */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-theme-muted block">
              Horizonte Temporal:
            </label>
            <div className="flex rounded-xl bg-theme-muted/15 p-1 border border-theme-subtle text-xs">
              {(['7d', '14d', '30d', '60d', '90d'] as MrpHorizon[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    horizon === h
                      ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
                      : 'text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {h === '7d' ? '7 días' : h === '14d' ? '14d' : h === '30d' ? '30d (std)' : h === '60d' ? '60d' : '90d'}
                </button>
              ))}
            </div>
          </div>

          {/* Área */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-theme-muted block">
              Área de Fabricación:
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value as MrpArea)}
              className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer shadow-2xs"
            >
              <option value="Todas">Todas las áreas</option>
              <option value="Offset">Offset (Prensa Plana)</option>
              <option value="Flexografía">Flexografía (Bobina)</option>
              <option value="Acabados">Acabados & Empaque</option>
            </select>
          </div>

          {/* Estado de Suministro */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-theme-muted block">
              Estado de Cobertura:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MrpStatus)}
              className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer shadow-2xs"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Riesgo">En Riesgo / Cobertura insuficiente</option>
              <option value="Faltante">Faltantes confirmados</option>
              <option value="Cubierto">Cubiertos / Próximos</option>
              <option value="Sobreinventario">Sobreinventario</option>
            </select>
          </div>

          {/* Buscador Universal SKU/Nombre */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-theme-muted block">
              Buscador de Insumos:
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar SKU, sustrato, tinta, proveedor..."
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface pl-9 pr-3 py-2 text-xs font-medium text-theme-main focus:outline-none focus:border-theme-primary shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPIs Ejecutivos (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Materiales con Riesgo
          </span>
          <b className="font-mono text-xl font-black text-amber-600 block">
            {kpiData.atRisk}
          </b>
          <small className="text-[10px] text-amber-600 font-bold block">
            Cobertura insuficiente
          </small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Faltantes Confirmados
          </span>
          <b className="font-mono text-xl font-black text-rose-600 block">
            {kpiData.stockouts}
          </b>
          <small className="text-[10px] text-rose-600 font-bold block">
            Demanda &gt; Útil + OC
          </small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Órdenes en Riesgo
          </span>
          <b className="font-mono text-xl font-black text-theme-main block">
            {kpiData.affectedOpsCount} OPs
          </b>
          <small className="text-[10px] text-theme-muted block">
            Bloqueadas por insumo
          </small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Valor Compra Sugerido
          </span>
          <b className="font-mono text-xl font-black text-indigo-600 block">
            ${kpiData.suggestedPurchaseValue.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </b>
          <small className="text-[10px] text-theme-muted block">
            MXN en requisiciones
          </small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Cobertura Promedio
          </span>
          <b className="font-mono text-xl font-black text-emerald-600 block">
            {kpiData.avgCoverage.toFixed(1)} días
          </b>
          <small className="text-[10px] text-emerald-600 font-bold block">
            Inventario útil ponderado
          </small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">
            Compras Abiertas (OC)
          </span>
          <b className="font-mono text-xl font-black text-theme-main block">
            {kpiData.totalOpenPos} OCs
          </b>
          <small className="text-[10px] text-theme-muted block">
            Recepciones en camino
          </small>
        </div>
      </div>

      {/* 3. Bloque Protagonista: Riesgos Críticos de Suministro ("Requiere tu atención") */}
      {criticalRiskMaterials.length > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-rose-500/10 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  Riesgos de Suministro Críticos
                  <span className="rounded-full bg-amber-500 text-white px-2 py-0.2 text-[9px] font-black">
                    Requiere Atención Inmediata
                  </span>
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  Materiales con desfase de entrega respecto al arranque de producción o retenidos por Calidad.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
              {criticalRiskMaterials.length} casos activos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalRiskMaterials.map((mat) => (
              <div
                key={mat.sku}
                className="rounded-2xl border border-amber-500/30 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-theme-primary">
                          {mat.sku}
                        </span>
                        <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 text-[9px] font-bold text-theme-muted">
                          {mat.area}
                        </span>
                        <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-black">
                          {mat.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-theme-main mt-1">
                        {mat.name}
                      </h4>
                    </div>

                    <span className="font-mono text-xs font-black text-amber-600 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      {mat.coverageDays.toFixed(1)} días cob.
                    </span>
                  </div>

                  {/* Detalle de Físico, Comprometido, HOLD y Útil */}
                  <div className="grid grid-cols-4 gap-2 rounded-xl bg-theme-muted/10 p-2.5 text-center text-xs">
                    <div>
                      <span className="text-[9px] text-theme-muted block">Físico:</span>
                      <b className="font-mono">{mat.physicalStock.toLocaleString()}</b>
                    </div>
                    <div>
                      <span className="text-[9px] text-theme-muted block">Comprometido:</span>
                      <b className="font-mono text-amber-600">{mat.committedStock.toLocaleString()}</b>
                    </div>
                    <div>
                      <span className="text-[9px] text-theme-muted block">HOLD QA:</span>
                      <b className={`font-mono ${mat.holdStock > 0 ? 'text-rose-600 font-black' : 'text-theme-muted'}`}>
                        {mat.holdStock.toLocaleString()}
                      </b>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-600 font-bold block">Útil:</span>
                      <b className="font-mono text-indigo-600 font-black">{mat.usefulStock.toLocaleString()}</b>
                    </div>
                  </div>

                  {/* Explicación del Gap o Faltante */}
                  <div className="text-[11px] text-theme-muted space-y-1">
                    <div className="flex justify-between">
                      <span>Demanda ({horizon}): <b className="text-theme-main font-mono">{mat.demandsByHorizon[horizon].toLocaleString()} {mat.uom}</b></span>
                      <span>OC Abierta: <b className="text-theme-main font-mono">{mat.confirmedSupply.toLocaleString()} {mat.uom}</b></span>
                    </div>

                    {mat.temporalGapDays && mat.temporalGapDays > 0 ? (
                      <div className="rounded-lg bg-rose-500/10 p-2 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-[10px]">
                        <b>⚠ Gap temporal: {mat.temporalGapDays} días de retraso.</b> La OP arranca el {mat.firstNeedDate} pero la OC llega el {mat.openPurchaseOrders[0]?.promisedDate}.
                      </div>
                    ) : (
                      <div className="rounded-lg bg-amber-500/10 p-2 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px]">
                        <b>Déficit proyectado:</b> Requiere requisición complementaria por {mat.netGapQuantity.toLocaleString()} {mat.uom}.
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones de la Card de Riesgo */}
                <div className="flex items-center gap-2 pt-2 border-t border-theme-subtle">
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className="flex-1 rounded-xl border border-theme-subtle bg-theme-muted/10 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors cursor-pointer text-center"
                  >
                    Ver cálculo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToRequisitions) {
                        onNavigateToRequisitions({
                          sku: mat.sku,
                          productName: mat.name,
                          brand: mat.preferredSupplier,
                          quantity: mat.netGapQuantity > 0 ? mat.netGapQuantity : mat.moq,
                          note: `Requisición preventiva MRP por riesgo de suministro en horizonte ${horizon}.`,
                          targetWarehouseId: 'ALM-RTM',
                        });
                      } else {
                        onToast?.(`✓ Requisición precargada iniciada para ${mat.sku}`);
                      }
                    }}
                    className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
                  >
                    Crear requisición
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Sugerencias del Sistema (Moradas SMART) */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-purple-950 dark:text-purple-100 flex items-center gap-2">
                Sugerencias del Sistema
                <span className="rounded-full bg-purple-600 text-white px-2 py-0.2 text-[9px] font-black">
                  Decisiones SMART
                </span>
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                Recomendaciones preventivas generadas a partir del cruce de demanda, stock útil y órdenes de compra.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {INITIAL_MRP_SYSTEM_SUGGESTIONS.map((sug) => (
            <div
              key={sug.id}
              className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 font-mono text-[10px] font-black border border-purple-500/20">
                    {sug.sku}
                  </span>
                  <span className="text-[10px] font-bold text-purple-600">
                    Acción preventiva
                  </span>
                </div>
                <h4 className="text-xs font-bold text-theme-main">
                  {sug.title}
                </h4>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  {sug.explanation}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="flex items-center justify-between w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-800 dark:text-purple-200 hover:bg-purple-500/20 transition-all cursor-pointer shadow-2xs"
              >
                <span>{sug.actionLabel}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Selector de Vistas: Cobertura vs Matriz vs Timeline */}
      <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
        <div className="flex rounded-2xl bg-theme-muted/15 p-1 border border-theme-subtle text-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveView('cobertura')}
            className={`rounded-xl px-4 py-2 font-bold transition-all cursor-pointer ${
              activeView === 'cobertura'
                ? 'bg-theme-surface text-theme-main shadow-2xs'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            Cobertura de Materiales ({filteredMaterials.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('matriz')}
            className={`rounded-xl px-4 py-2 font-bold transition-all cursor-pointer ${
              activeView === 'matriz'
                ? 'bg-theme-surface text-theme-main shadow-2xs'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            Matriz OP × Material
          </button>
          <button
            type="button"
            onClick={() => setActiveView('timeline')}
            className={`rounded-xl px-4 py-2 font-bold transition-all cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-theme-surface text-theme-main shadow-2xs'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            Timeline Demanda vs Suministro
          </button>
        </div>

        <span className="text-xs text-theme-muted hidden sm:inline">
          Mostrando datos para horizonte de <b>{horizon}</b>
        </span>
      </div>

      {/* 6. VISTA 1: TABLA DATA-GRID DE COBERTURA */}
      {activeView === 'cobertura' && (
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4 animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[950px]">
              <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Material / SKU</th>
                  <th className="p-3 text-left">Tipo & Área</th>
                  <th className="p-3 text-right">Existencia Fís.</th>
                  <th className="p-3 text-right">Comprometido</th>
                  <th className="p-3 text-right">HOLD (QA)</th>
                  <th className="p-3 text-right">Inventario Útil</th>
                  <th className="p-3 text-right">Demanda ({horizon})</th>
                  <th className="p-3 text-right">OC Abierta</th>
                  <th className="p-3 text-center">Cobertura</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {filteredMaterials.map((mat) => {
                  const isCritical = mat.status === 'Faltante' || mat.status === 'Cobertura insuficiente';

                  return (
                    <tr
                      key={mat.sku}
                      onClick={() => setSelectedMaterial(mat)}
                      className="hover:bg-theme-muted/10 transition-colors cursor-pointer group"
                    >
                      {/* Material / SKU */}
                      <td className="p-3">
                        <b className="text-theme-main block font-bold text-xs group-hover:text-theme-primary transition-colors">
                          {mat.name}
                        </b>
                        <span className="font-mono text-[10px] text-theme-muted">
                          {mat.sku} · {mat.preferredSupplier}
                        </span>
                      </td>

                      {/* Tipo & Área */}
                      <td className="p-3">
                        <span className="rounded-md bg-theme-muted/20 px-2 py-0.5 text-[9px] font-bold text-theme-muted block w-fit">
                          {mat.area}
                        </span>
                        <small className="text-[10px] text-theme-muted block mt-0.5">
                          {mat.category}
                        </small>
                      </td>

                      {/* Físico */}
                      <td className="p-3 text-right font-mono">
                        {mat.physicalStock.toLocaleString()} {mat.uom}
                      </td>

                      {/* Comprometido */}
                      <td className="p-3 text-right font-mono text-amber-600">
                        {mat.committedStock.toLocaleString()}
                      </td>

                      {/* HOLD QA */}
                      <td className="p-3 text-right font-mono">
                        {mat.holdStock > 0 ? (
                          <span className="rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 text-[10px] font-bold border border-rose-500/20">
                            {mat.holdStock.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-theme-muted">0</span>
                        )}
                      </td>

                      {/* Útil */}
                      <td className="p-3 text-right font-mono font-black text-indigo-700 dark:text-indigo-300">
                        {mat.usefulStock.toLocaleString()}
                      </td>

                      {/* Demanda */}
                      <td className="p-3 text-right font-mono font-bold text-theme-main">
                        {mat.demandsByHorizon[horizon].toLocaleString()}
                      </td>

                      {/* OC Abierta */}
                      <td className="p-3 text-right font-mono">
                        {mat.confirmedSupply > 0 ? (
                          <span className="text-emerald-600 font-bold">
                            +{mat.confirmedSupply.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-theme-muted">0</span>
                        )}
                      </td>

                      {/* Cobertura */}
                      <td className="p-3 text-center font-mono">
                        <b className={isCritical ? 'text-rose-600 font-black' : 'text-theme-main'}>
                          {mat.coverageDays.toFixed(1)} d
                        </b>
                      </td>

                      {/* Estado */}
                      <td className="p-3 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black ${
                          mat.status === 'Cubierto'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : mat.status === 'Próximo a mínimo'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : mat.status === 'Cobertura insuficiente' || mat.status === 'Riesgo'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : mat.status === 'Faltante'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}>
                          {mat.status}
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className="rounded-lg p-1.5 text-theme-muted hover:text-theme-main hover:bg-theme-muted/30 transition-colors cursor-pointer"
                          title="Ver detalle 360"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. VISTA 2: MATRIZ OP × MATERIAL */}
      {activeView === 'matriz' && (
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div>
              <b className="text-sm font-bold text-theme-main block">
                Matriz de Bloqueo: Órdenes de Producción vs Insumos Críticos
              </b>
              <p className="text-xs text-theme-muted">
                Identifica de inmediato qué material específico está deteniendo o arriesgando la entrega de cada orden.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span>✓</span> Cubierto
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <span>◐</span> Parcial
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <span>!</span> Faltante
              </span>
              <span className="flex items-center gap-1 text-theme-muted">
                <span>○</span> No aplica
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[850px]">
              <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Orden Producción</th>
                  <th className="p-3 text-left">Cliente & N° Parte</th>
                  <th className="p-3 text-center">BOPP Blanco</th>
                  <th className="p-3 text-center">Papel Bond</th>
                  <th className="p-3 text-center">Couche 130g</th>
                  <th className="p-3 text-center">Sulfatada</th>
                  <th className="p-3 text-center">Tintas UV</th>
                  <th className="p-3 text-center">Barniz UV</th>
                  <th className="p-3 text-center">Placas / Cliché</th>
                  <th className="p-3 text-center">Empaque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {[
                  { op: 'OP-2026-95250', cli: 'Panasonic', part: '526412 | G |', bopp: '!', bond: '○', couche: '○', sulf: '○', tinta: '✓', barniz: '◐', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95249', cli: 'Black & Decker', part: 'NA472050', bopp: '○', bond: '✓', couche: '○', sulf: '○', tinta: '✓', barniz: '○', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95258', cli: 'Tyco Electronics', part: 'IS-2420', bopp: '◐', bond: '○', couche: '○', sulf: '○', tinta: '✓', barniz: '✓', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95252', cli: 'Medifarma', part: 'MED-EMB-04', bopp: '○', bond: '○', couche: '○', sulf: '✓', tinta: '✓', barniz: '○', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95257', cli: 'Fresenius Kabi', part: 'FK-EMP-09', bopp: '○', bond: '○', couche: '○', sulf: '◐', tinta: '✓', barniz: '○', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95260', cli: 'Truper', part: 'TRUP-BOX-12', bopp: '○', bond: '○', couche: '○', sulf: '!', tinta: '✓', barniz: '○', placa: '✓', emp: '✓' },
                  { op: 'OP-2026-95251', cli: 'Siemens', part: 'SM-INST-03', bopp: '○', bond: '○', couche: '✓', sulf: '○', tinta: '✓', barniz: '○', placa: '✓', emp: '✓' },
                ].map((row) => (
                  <tr key={row.op} className="hover:bg-theme-muted/10 transition-colors">
                    <td className="p-3 font-mono font-bold text-theme-primary">{row.op}</td>
                    <td className="p-3">
                      <b className="text-theme-main block">{row.cli}</b>
                      <small className="text-theme-muted block">{row.part}</small>
                    </td>

                    {[row.bopp, row.bond, row.couche, row.sulf, row.tinta, row.barniz, row.placa, row.emp].map((val, idx) => (
                      <td key={idx} className="p-3 text-center">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-black ${
                          val === '✓'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : val === '◐'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : val === '!'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'text-theme-muted/40'
                        }`}>
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. VISTA 3: TIMELINE DEMANDA VS SUMINISTRO */}
      {activeView === 'timeline' && (
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-theme-subtle pb-3">
            <b className="text-sm font-bold text-theme-main block">
              Proyección Temporal de Cobertura y Fechas de Quiebre
            </b>
            <p className="text-xs text-theme-muted">
              Líneas temporales mostrando cuándo se presentarán las necesidades de las OPs y cuándo ingresarán las OCs de proveedores.
            </p>
          </div>

          {/* Timeline Caso Crítico 1: BOPP Blanco */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-theme-primary">MP-BOPP-050</span>
                <b className="text-xs text-theme-main">BOPP Blanco Brillante 50 micras</b>
              </div>
              <span className="rounded-full bg-rose-500 text-white px-2 py-0.2 text-[9px] font-black">
                Gap de 2 Días Detectado
              </span>
            </div>

            {/* Stepper Horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">07 Sep (Hoy)</span>
                <b className="text-xs font-bold text-theme-main block">Stock Útil: 900 m</b>
                <small className="text-[10px] text-emerald-600 block">Disponible para setup</small>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 space-y-1">
                <span className="font-mono text-[10px] text-rose-800 dark:text-rose-200 block font-bold">11 Sep (Primera Necesidad)</span>
                <b className="text-xs font-bold text-rose-900 dark:text-rose-100 block">OP-2026-95250 (Panasonic)</b>
                <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-bold inline-block">
                  Déficit: 1,900 m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">13 Sep (Llegada OC)</span>
                <b className="text-xs font-bold text-theme-main block">OC-2026-0089: +4,000 m</b>
                <small className="text-[10px] text-theme-muted block">Avery Dennison</small>
              </div>

              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">15 Sep (Segunda Necesidad)</span>
                <b className="text-xs font-bold text-theme-main block">OP-2026-95258 (Tyco)</b>
                <small className="text-[10px] text-emerald-600 block">Cubierto con saldo OC</small>
              </div>
            </div>
          </div>

          {/* Timeline Caso 2: Cartulina Sulfatada */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-theme-primary">MP-SULF-014</span>
                <b className="text-xs text-theme-main">Cartulina Sulfatada 1 Cara 14 pts</b>
              </div>
              <span className="rounded-full bg-amber-500 text-white px-2 py-0.2 text-[9px] font-black">
                Déficit Neto 4,000 pliegos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">07 Sep (Hoy)</span>
                <b className="text-xs font-bold text-theme-main block">Stock Útil: 2,500 plg</b>
                <small className="text-[10px] text-theme-muted block">En rack PAP-C-02</small>
              </div>

              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">09 Sep (Llegada OC)</span>
                <b className="text-xs font-bold text-theme-main block">OC-2026-0081: +12,000 plg</b>
                <small className="text-[10px] text-theme-muted block">Papelera Del Plata</small>
              </div>

              <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
                <span className="font-mono text-[10px] text-theme-muted block">09-10 Sep (Consumos)</span>
                <b className="text-xs font-bold text-theme-main block">Medifarma & Fresenius</b>
                <small className="text-[10px] text-theme-muted block">Consumen 13,500 plg</small>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 space-y-1">
                <span className="font-mono text-[10px] text-rose-800 dark:text-rose-200 block font-bold">12 Sep (Quiebre Truper)</span>
                <b className="text-xs font-bold text-rose-900 dark:text-rose-100 block">OP-2026-95260 (Truper)</b>
                <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-bold inline-block">
                  Faltan 4,000 plg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Drawer / Modal Detalle 360 del Material */}
      {selectedMaterial && (
        <Material360Drawer
          material={selectedMaterial}
          horizon={horizon}
          onClose={() => setSelectedMaterial(null)}
          onNavigateToOp={onNavigateToOp}
          onNavigateToPurchaseOrder={onNavigateToPurchaseOrder}
          onCreateRequisition={onNavigateToRequisitions}
          onToast={onToast}
        />
      )}
    </div>
  );
};
