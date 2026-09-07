import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FilePlus2,
  FileText,
  HelpCircle,
  History,
  Info,
  Layers,
  Link as LinkIcon,
  Lock,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  Wrench,
  X,
} from 'lucide-react';
import {
  MrpMaterialPlanningItem,
  MrpHorizon,
} from '../../../data/mockMrpData';

type MaterialDrawerTab =
  | 'Resumen'
  | 'Demanda'
  | 'Existencias'
  | 'Compras abiertas'
  | 'Proveedores'
  | 'Historial';

interface Props {
  material: MrpMaterialPlanningItem;
  horizon: MrpHorizon;
  onClose: () => void;
  onNavigateToOp?: (opFolio: string) => void;
  onNavigateToPurchaseOrder?: (poFolio: string) => void;
  onCreateRequisition?: (prefill: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    note: string;
    targetWarehouseId?: string;
  }) => void;
  onToast?: (msg: string) => void;
}

export const Material360Drawer: React.FC<Props> = ({
  material,
  horizon,
  onClose,
  onNavigateToOp,
  onNavigateToPurchaseOrder,
  onCreateRequisition,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<MaterialDrawerTab>('Resumen');
  const [showCalculationTooltip, setShowCalculationTooltip] = useState(false);

  const handleCreateRequisitionClick = () => {
    const suggestedQty = material.netGapQuantity > 0 ? material.netGapQuantity : material.moq;
    const prefill = {
      sku: material.sku,
      productName: material.name,
      brand: material.preferredSupplier,
      quantity: suggestedQty,
      note: `Generada desde MRP por cobertura de ${material.coverageDays} días. Demanda ${horizon}: ${material.demandsByHorizon[horizon].toLocaleString()} ${material.uom}; Inventario útil: ${material.usefulStock.toLocaleString()} ${material.uom}; Compras abiertas: ${material.confirmedSupply.toLocaleString()} ${material.uom}.`,
      targetWarehouseId: 'ALM-RTM',
    };

    if (onCreateRequisition) {
      onCreateRequisition(prefill);
    } else {
      onToast?.(`✓ Requisición precargada iniciada para ${material.sku} por ${suggestedQty.toLocaleString()} ${material.uom}`);
    }
  };

  const getStatusBadge = (status: MrpMaterialPlanningItem['status']) => {
    switch (status) {
      case 'Cubierto':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black">
            Cubierto
          </span>
        );
      case 'Próximo a mínimo':
        return (
          <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-bold">
            Próximo a mínimo
          </span>
        );
      case 'Cobertura insuficiente':
      case 'Riesgo':
        return (
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black">
            Riesgo de Suministro
          </span>
        );
      case 'Faltante':
        return (
          <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 text-[10px] font-black">
            Faltante Crítico
          </span>
        );
      case 'Sobreinventario':
        return (
          <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-bold">
            Sobreinventario
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header Drawer */}
        <div className="flex flex-wrap items-center justify-between border-b border-theme-subtle p-5 bg-theme-muted/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-black text-sm text-theme-main">
                  {material.sku}
                </span>
                <span className="rounded-md bg-theme-primary/10 px-2 py-0.2 font-mono text-[10px] font-bold text-theme-primary">
                  {material.area}
                </span>
                <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 text-[10px] font-bold text-theme-muted">
                  {material.category}
                </span>
                {getStatusBadge(material.status)}
              </div>
              <h2 className="font-black text-base text-theme-main mt-0.5">
                {material.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateRequisitionClick}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm cursor-pointer transition-all"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Crear Requisición</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme-subtle bg-theme-surface px-5 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'Resumen' as const, label: 'Resumen 360', icon: FileText },
            { id: 'Demanda' as const, label: `Demanda (${material.demandingOps.length} OPs)`, icon: Layers },
            { id: 'Existencias' as const, label: `Existencias (${material.lots.length} Lotes)`, icon: Box },
            { id: 'Compras abiertas' as const, label: `Compras abiertas (${material.openPurchaseOrders.length})`, icon: Truck },
            { id: 'Proveedores' as const, label: 'Proveedor & Condiciones', icon: Building2 },
            { id: 'Historial' as const, label: `Timeline (${material.timeline.length})`, icon: History },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === t.id
                  ? 'border-theme-primary text-theme-primary'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* TAB 1: RESUMEN */}
          {activeTab === 'Resumen' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Alert Banner si hay gap o HOLD */}
              {material.holdStock > 0 && (
                <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      LOTE RETENIDO EN CUARENTENA / HOLD POR CALIDAD (FUERA DE INVENTARIO ÚTIL)
                    </span>
                    <span className="rounded-full bg-rose-200 text-rose-900 px-2 py-0.5 text-[9px] font-black">
                      {material.holdStock.toLocaleString()} {material.uom} Retenidos
                    </span>
                  </div>
                  <p className="text-xs text-rose-950 dark:text-rose-100">
                    {material.holdReason}
                  </p>
                </div>
              )}

              {material.temporalGapDays && material.temporalGapDays > 0 && (
                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      GAP TEMPORAL DE SUMINISTRO DETECTADO ({material.temporalGapDays} DÍAS DE RETRASO)
                    </span>
                    <span className="rounded-full bg-amber-200 text-amber-900 px-2 py-0.5 text-[9px] font-black">
                      Desfase Crítico
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-100">
                    La primera OP que requiere este material arranca el <b>{material.firstNeedDate}</b>, pero la orden de compra abierta tiene fecha prometida de entrega para el <b>{material.openPurchaseOrders[0]?.promisedDate}</b>.
                  </p>
                </div>
              )}

              {/* Grid 4 Columnas: Fórmulas de Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Inventario Físico:</span>
                  <b className="font-mono text-base font-black text-theme-main mt-0.5 block">
                    {material.physicalStock.toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-theme-muted">En almacén ALM-RTM</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Comprometido OPs:</span>
                  <b className="font-mono text-base font-black text-amber-600 mt-0.5 block">
                    {material.committedStock.toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-theme-muted">En preparación de corrida</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Retenido Calidad (HOLD):</span>
                  <b className={`font-mono text-base font-black mt-0.5 block ${material.holdStock > 0 ? 'text-rose-600' : 'text-theme-muted'}`}>
                    {material.holdStock.toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-theme-muted">Excluido de cobertura</small>
                </div>

                <div className="rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/5 p-3.5 shadow-2xs relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-indigo-700 dark:text-indigo-300 block">
                      Inventario Útil:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCalculationTooltip(!showCalculationTooltip)}
                      className="text-indigo-600 hover:text-indigo-800 p-0.5 rounded cursor-pointer"
                      title="¿Cómo se calculó?"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <b className="font-mono text-lg font-black text-indigo-700 dark:text-indigo-300 mt-0.5 block">
                    {material.usefulStock.toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
                    {material.coverageDays.toFixed(1)} días de cobertura
                  </small>

                  {/* Tooltip explicativo */}
                  {showCalculationTooltip && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-indigo-500/40 bg-theme-surface p-2.5 text-[10px] text-theme-main shadow-lg space-y-1 animate-in fade-in">
                      <b className="block font-bold text-indigo-600">Fórmula de Inventario Útil:</b>
                      <p className="font-mono text-[9px] text-theme-muted">
                        Útil = max(0, Físico ({material.physicalStock}) - Comprometido ({material.committedStock}) - HOLD ({material.holdStock})) = {material.usefulStock} {material.uom}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fila secundaria de Métricas y Parámetros */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 shadow-2xs space-y-0.5">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Demanda Horizonte ({horizon}):</span>
                  <b className="font-mono text-sm font-black text-theme-main block">
                    {material.demandsByHorizon[horizon].toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-theme-muted block">Consumo: ~{material.dailyConsumption} {material.uom}/día</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 shadow-2xs space-y-0.5">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Compras Abiertas (OC):</span>
                  <b className="font-mono text-sm font-black text-theme-main block">
                    {material.confirmedSupply.toLocaleString()} {material.uom}
                  </b>
                  <small className="text-[10px] text-theme-muted block">{material.openPurchaseOrders.length} OC(s) emitidas</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 shadow-2xs space-y-0.5">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Proveedor Principal:</span>
                  <b className="text-xs font-bold text-theme-main block truncate">
                    {material.preferredSupplier}
                  </b>
                  <small className="text-[10px] text-emerald-600 font-bold block">
                    Score QA: {material.supplierQualityScore}%
                  </small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 shadow-2xs space-y-0.5">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Lead Time & Precio:</span>
                  <b className="text-xs font-bold text-theme-main block">
                    {material.leadTimeDays} días hábiles
                  </b>
                  <small className="text-[10px] text-theme-muted block font-mono">
                    ${material.unitPrice.toFixed(2)} {material.currency} / {material.uom}
                  </small>
                </div>
              </div>

              {/* Remanente compatible disponible si existe */}
              {material.compatibleRemnants && material.compatibleRemnants.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Remanente de Bobina Compatible en Almacén
                    </b>
                    <span className="rounded-full bg-emerald-200 text-emerald-900 px-2 py-0.2 text-[9px] font-black">
                      Apto 100% Calidad
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-950 dark:text-emerald-100">
                    Código: <b>{material.compatibleRemnants[0].remnantCode}</b> · {material.compatibleRemnants[0].description} · <b>{material.compatibleRemnants[0].quantity} {material.compatibleRemnants[0].unit}</b> en {material.compatibleRemnants[0].location}. Puede reutilizarse para evitar compras innecesarias.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEMANDA POR OP */}
          {activeTab === 'Demanda' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <div>
                  <b className="text-xs font-bold text-theme-main block">
                    Órdenes de Producción que Demandan este Material
                  </b>
                  <p className="text-[11px] text-theme-muted">
                    Consolidación de requerimientos de receta estándar e insumos de corrida.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-theme-muted">
                  Total {horizon}: {material.demandsByHorizon[horizon].toLocaleString()} {material.uom}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-theme-subtle">
                <table className="w-full text-xs">
                  <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                    <tr>
                      <th className="p-2.5 text-left">Orden Producción</th>
                      <th className="p-2.5 text-left">Cliente</th>
                      <th className="p-2.5 text-left">Parte / Producto</th>
                      <th className="p-2.5 text-left">Fecha Requerida</th>
                      <th className="p-2.5 text-right">Cantidad Insumo</th>
                      <th className="p-2.5 text-center">Estado Cobertura</th>
                      <th className="p-2.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {material.demandingOps.map((op) => (
                      <tr key={op.opFolio} className="hover:bg-theme-muted/10 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-theme-primary">{op.opFolio}</td>
                        <td className="p-2.5 font-medium">{op.client}</td>
                        <td className="p-2.5 font-mono text-[11px]">{op.partNumber}</td>
                        <td className="p-2.5 text-theme-main font-bold">{op.requiredDate}</td>
                        <td className="p-2.5 text-right font-mono font-bold">{op.quantityRequired.toLocaleString()} {op.unit}</td>
                        <td className="p-2.5 text-center">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                            op.status === 'Cubierto'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : op.status === 'En riesgo'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {op.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {onNavigateToOp && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigateToOp(op.opFolio);
                              }}
                              className="rounded-lg p-1 text-theme-muted hover:text-theme-main hover:bg-theme-muted/20 cursor-pointer"
                              title="Ver orden en Producción"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXISTENCIAS (LOTES Y HOLD) */}
          {activeTab === 'Existencias' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <div>
                  <b className="text-xs font-bold text-theme-main block">
                    Lotes en Almacén e Inventario Físico Detallado
                  </b>
                  <p className="text-[11px] text-theme-muted">
                    Ubicaciones físicas, estatus de cuarentena y certificados de calidad de proveedor.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {material.lots.map((lot) => {
                  const isHold = lot.status === 'Cuarentena / HOLD';
                  const isCommitted = lot.status === 'Comprometido';

                  return (
                    <div
                      key={lot.lotNumber}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isHold
                          ? 'border-rose-500/40 bg-rose-500/10'
                          : isCommitted
                          ? 'border-amber-500/30 bg-amber-500/5'
                          : 'border-theme-subtle bg-theme-surface shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-theme-main">
                            {lot.lotNumber}
                          </span>
                          <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 font-mono text-[10px] text-theme-muted">
                            {lot.warehouse} · {lot.location}
                          </span>
                        </div>

                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isHold
                            ? 'bg-rose-500 text-white'
                            : isCommitted
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {lot.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span>
                          Cantidad: <b className="font-mono">{lot.quantity.toLocaleString()} {lot.unit}</b>
                        </span>
                        {lot.coaFolio && (
                          <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                            <FileCheck className="h-3.5 w-3.5" />
                            {lot.coaFolio}
                          </span>
                        )}
                      </div>

                      {lot.qaNotes && (
                        <p className="text-[10px] text-rose-800 dark:text-rose-200 mt-1 italic">
                          {lot.qaNotes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: COMPRAS ABIERTAS */}
          {activeTab === 'Compras abiertas' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <div>
                  <b className="text-xs font-bold text-theme-main block">
                    Órdenes de Compra Abiertas & Entradas Confirmadas
                  </b>
                  <p className="text-[11px] text-theme-muted">
                    Suministro en tránsito o pendiente de recepción por compras.
                  </p>
                </div>
              </div>

              {material.openPurchaseOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Truck className="h-10 w-10 text-theme-muted mx-auto" />
                  <b className="text-sm font-bold text-theme-main block">
                    Sin órdenes de compra abiertas
                  </b>
                  <p className="text-xs text-theme-muted">
                    No existen recepciones programadas para este SKU actualmente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {material.openPurchaseOrders.map((po) => (
                    <div
                      key={po.poFolio}
                      className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-theme-primary">
                            {po.poFolio}
                          </span>
                          <span className="text-theme-muted">·</span>
                          <b className="text-theme-main">{po.supplier}</b>
                        </div>

                        <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[9px] font-bold">
                          {po.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-theme-muted block text-[10px]">Cantidad Pedida:</span>
                          <b className="font-mono">{po.quantity.toLocaleString()} {po.unit}</b>
                        </div>
                        <div>
                          <span className="text-theme-muted block text-[10px]">Fecha Prometida:</span>
                          <b className="text-theme-main font-bold">{po.promisedDate}</b>
                        </div>
                        <div>
                          <span className="text-theme-muted block text-[10px]">Puntualidad OP:</span>
                          <b className={po.deliversOnTime ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {po.deliversOnTime ? '✓ Llega a tiempo' : '⚠ Llega con retraso'}
                          </b>
                        </div>
                      </div>

                      {po.targetOps && po.targetOps.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-theme-subtle text-[10px] text-theme-muted">
                          <span>Destinada a cubrir:</span>
                          {po.targetOps.map((target) => (
                            <span key={target} className="font-mono font-bold text-theme-primary">
                              {target}
                            </span>
                          ))}
                        </div>
                      )}

                      {onNavigateToPurchaseOrder && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToPurchaseOrder(po.poFolio);
                            }}
                            className="flex items-center gap-1 text-[11px] text-theme-primary font-bold hover:underline cursor-pointer"
                          >
                            <span>Ver orden de compra en Compras</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROVEEDORES */}
          {activeTab === 'Proveedores' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-theme-primary" />
                    <div>
                      <b className="text-sm font-bold text-theme-main block">
                        {material.preferredSupplier}
                      </b>
                      <small className="text-[10px] text-theme-muted">Proveedor Maestro Certificado</small>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-black">
                    Score Calidad: {material.supplierQualityScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-theme-muted block">Lead Time:</span>
                    <b className="text-theme-main">{material.leadTimeDays} días hábiles</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted block">Precio Base:</span>
                    <b className="font-mono text-theme-main">${material.unitPrice.toFixed(2)} {material.currency}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted block">Pedido Mínimo (MOQ):</span>
                    <b className="font-mono text-theme-main">{material.moq.toLocaleString()} {material.uom}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted block">Condición:</span>
                    <b className="text-theme-main">Crédito 30 días</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HISTORIAL / TIMELINE */}
          {activeTab === 'Historial' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <b className="text-xs font-bold text-theme-main block">
                  Línea Temporal de Demanda y Suministro
                </b>
                <span className="font-mono text-xs text-theme-muted">{material.timeline.length} eventos</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-theme-subtle">
                {material.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-theme-surface ${
                      item.alert
                        ? 'bg-rose-500'
                        : item.type === 'supply'
                        ? 'bg-emerald-500'
                        : item.type === 'demand'
                        ? 'bg-indigo-500'
                        : 'bg-theme-muted'
                    }`} />

                    <div className="rounded-xl border border-theme-subtle bg-theme-surface p-3 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-theme-muted">{item.date}</span>
                        <b className="text-xs font-bold text-theme-main">{item.title}</b>
                        {item.quantity && (
                          <span className={`font-mono text-xs font-bold ${item.alert ? 'text-rose-600' : 'text-theme-main'}`}>
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-theme-muted">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Drawer */}
        <div className="flex items-center justify-between border-t border-theme-subtle bg-theme-muted/10 px-6 py-3 text-xs">
          <span className="text-theme-muted text-[11px]">
            SKU: <b>{material.sku}</b> · Cobertura: <b>{material.coverageDays.toFixed(1)} días</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateRequisitionClick}
              className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              <span>Crear Requisición Precargada</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 font-bold text-theme-main hover:bg-theme-muted/20 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
