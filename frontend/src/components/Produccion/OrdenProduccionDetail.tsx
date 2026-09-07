import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  X,
  AlertTriangle,
  ShieldCheck,
  Clock,
  FileText,
  Printer,
  Sparkles,
  Tag,
  Layers,
  Lock,
  Unlock,
  Package,
  Truck,
  ArrowRight,
} from 'lucide-react';
import {
  PRODUCTION_INCIDENTS,
  ProductionOrder,
  RoutingStep,
  ToolingRequirement,
  ProcessQaControl,
  getDefaultQaControls,
} from '../../data/mockProduccionData';
import { CUSTOMER_REQUIREMENTS, CustomerQualityRequirement } from '../../data/mockCalidadData';
import { FinishedGoodsRelease } from '../../data/mockFinishedGoodsData';
import { FichaLotePtModal } from './FichaLotePtModal';
import { SalesOrder } from '../../data/mockSalesData';
import { ProductionCostConfig } from '../../data/mockProductionCostData';
import { ProductionOrderCostTab } from './Costeo/ProductionOrderCostTab';
import { ModalPortal } from '../common/ModalPortal';
import { ProductionCard, StatusBadge, formatNumber } from './productionUi';
import { ScrapLedgerPorEtapa } from './ScrapLedgerPorEtapa';

interface Props {
  order: ProductionOrder;
  onClose: () => void;
  onIncident: () => void;
  onRelease: () => void;
  onAdvanceOperation?: (stepNumber: number) => void;
  onRequestMaterialExtra?: () => void;
  onPrintSheet?: (order: ProductionOrder) => void;
  salesOrders?: SalesOrder[];
  onNavigateToSalesOrder?: (folio: string) => void;
  initialTab?: string;
  costConfig?: ProductionCostConfig;
  finishedGoods?: FinishedGoodsRelease[];
  onNavigateToEmbarques?: () => void;
  onOpenPtDetail?: (pt: FinishedGoodsRelease) => void;
  onNavigateToMrp?: (opFolio?: string) => void;
}

export const OrdenProduccionDetail: React.FC<Props> = ({
  order,
  onClose,
  onIncident,
  onRelease,
  onAdvanceOperation,
  onRequestMaterialExtra,
  onPrintSheet,
  salesOrders,
  onNavigateToSalesOrder,
  initialTab,
  costConfig,
  finishedGoods,
  onNavigateToEmbarques,
  onOpenPtDetail,
  onNavigateToMrp,
}) => {
  const [tab, setTab] = useState<
    | 'Resumen'
    | 'Costeo'
    | 'Routing'
    | 'Paginación / Flexo'
    | 'Materiales'
    | 'Herramental'
    | 'Controles QA'
    | 'Incidencias'
    | 'Trazabilidad'
  >((initialTab as any) || 'Resumen');
  const [showCsrModal, setShowCsrModal] = useState(false);
  const [localPtModal, setLocalPtModal] = useState<FinishedGoodsRelease | null>(null);

  const matchingPt = finishedGoods?.find(
    (pt) => pt.opFolio === order.folio || pt.opId === order.id
  );

  const clientReqs: CustomerQualityRequirement[] = CUSTOMER_REQUIREMENTS.filter(
    (c) =>
      order.cliente.toLowerCase().includes(c.client.toLowerCase()) ||
      c.client.toLowerCase().includes(order.cliente.toLowerCase())
  );

  const routingSteps: RoutingStep[] = order.routing && order.routing.length > 0
    ? order.routing
    : order.area === 'Flexografía'
    ? [
        {
          stepNumber: 1,
          process: 'Prensa Flexo (Impresión + Barniz + Troquel)',
          machine: order.machine,
          setupMinutes: 35,
          runMinutes: 180,
          status: 'En proceso',
          requiresFirstPieceQuality: true,
          firstPieceApproved: true,
          firstPieceApprover: 'Alicia Ramírez (Calidad)',
          subOperations: ['Impresión 4 tintas UV', 'Barniz Sobreimpresión', 'Troquelado rotativo', 'Laminado BOPP'],
        },
        {
          stepNumber: 2,
          process: 'Rebobinado e Inspección Rotoflex',
          machine: 'Rotoflex I',
          setupMinutes: 15,
          runMinutes: 60,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 3,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 4,
          process: 'Empaque',
          machine: 'Estación Empaque',
          setupMinutes: 10,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ]
    : [
        {
          stepNumber: 1,
          process: 'Preimpresión CTP',
          machine: 'CTP Agfa',
          setupMinutes: 20,
          runMinutes: 30,
          status: 'Completada',
          requiresFirstPieceQuality: true,
          firstPieceApproved: true,
        },
        {
          stepNumber: 2,
          process: 'Impresión Offset',
          machine: order.machine,
          setupMinutes: 40,
          runMinutes: 160,
          status: 'En proceso',
          requiresFirstPieceQuality: true,
          firstPieceApproved: true,
          firstPieceApprover: 'Alicia Ramírez (Calidad)',
        },
        {
          stepNumber: 3,
          process: 'Guillotina',
          machine: 'Guillotina 2',
          setupMinutes: 15,
          runMinutes: 45,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 4,
          process: 'Doblado',
          machine: 'Stahl 2',
          setupMinutes: 25,
          runMinutes: 60,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 5,
          process: 'Grapado y Alzado',
          machine: 'Muller Martini',
          setupMinutes: 30,
          runMinutes: 70,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 6,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 7,
          process: 'Empaque',
          machine: 'Mesa Empaque',
          setupMinutes: 10,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ];

  const materials = order.materials && order.materials.length > 0
    ? order.materials
    : [
        { id: 'm-1', item: 'Papel Bond 60g 57x87 cm', type: 'Papel/Bobina' as const, required: '14,200 pliegos', reserved: '14,200 pliegos', delivered: '14,200 pliegos', available: '85,000 pliegos', status: 'Disponible' as const },
        { id: 'm-2', item: 'Tinta Negra Offset', type: 'Tinta' as const, required: '3.4 kg', reserved: '3.4 kg', delivered: '3.4 kg', available: '18 kg', status: 'Disponible' as const },
        { id: 'm-3', item: 'Barniz UV', type: 'Barniz' as const, required: '2.1 kg', reserved: order.materialAlert ? '0 kg' : '2.1 kg', delivered: order.materialAlert ? '0 kg' : '2.1 kg', available: order.materialAlert ? '0.8 kg' : '8 kg', status: order.materialAlert ? 'Insuficiente' as const : 'Disponible' as const, substituteAuthorized: order.materialAlert ? 'Barniz UV 804-AX' : undefined },
      ];

  const qaControls: ProcessQaControl[] =
    order.qaControls ??
    getDefaultQaControls(
      order.folio,
      order.area,
      order.progress,
      order.status === 'Detenida' || order.status === 'Pendiente de calidad'
    );

  const tabs = [
    'Resumen',
    'Costeo',
    'Routing',
    order.area === 'Offset' ? 'Paginación / Offset' : 'Operaciones Flexo',
    'Materiales',
    'Herramental',
    'Controles QA',
    'Incidencias',
    'Trazabilidad',
  ] as const;

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header con Folio y Datos */}
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-theme-subtle bg-theme-surface p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                ORDEN DE PRODUCCIÓN {order.area.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-theme-muted">
                {order.folio} · Pedido {order.pedido}
              </span>
            </div>
            <h2 className="text-xl font-black text-theme-main mt-1">
              {order.partNumber} · {order.cliente}
            </h2>
            <p className="text-xs text-theme-muted">
              {order.revision} · Compromiso cliente: <b className="text-theme-main">{order.due}</b> · Máquina: <b className="text-theme-main">{order.machine}</b>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex overflow-x-auto gap-1 border-b border-theme-subtle p-3 bg-theme-muted/10">
          {tabs.map((item) => {
            const mappedKey = item.includes('Paginación') || item.includes('Operaciones Flexo') ? 'Paginación / Flexo' : item;
            const isSelected = tab === mappedKey;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTab(mappedKey as any)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/30'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* 1. RESUMEN */}
          {tab === 'Resumen' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-5 text-xs">
                {[
                  ['Cantidad Solicitada', formatNumber(order.quantity)],
                  ['Stock PT Comprometido', formatNumber(order.stockCommitted)],
                  ['A Producir (Neto)', formatNumber(order.quantity - order.stockCommitted)],
                  ['Avance General', `${order.progress}%`],
                  ['Prioridad', order.priority],
                ].map(([label, value]) => (
                  <ProductionCard key={label}>
                    <div className="p-3 text-xs">
                      <small className="text-theme-muted">{label}</small>
                      <b className="mt-1 block font-mono text-base text-theme-main">{value}</b>
                    </div>
                  </ProductionCard>
                ))}
              </div>

              {/* Quality Gates Banner (Sección 19 del doc) */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 p-4 text-xs">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-theme-main">Control de Calidad en Producción:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        ✓ Preimpresión Liberada
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.qualityGates?.firstPieceReleased
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {order.qualityGates?.firstPieceReleased
                          ? `✓ Primera Pieza Liberada (${order.qualityGates.firstPieceApprover ?? 'Alicia Ramírez'})`
                          : '● Primera Pieza Pendiente de Calidad'}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.qualityGates?.finalAuditApproved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-theme-muted text-theme-muted'
                        }`}
                      >
                        {order.qualityGates?.finalAuditApproved
                          ? '✓ Auditoría Final Aprobada'
                          : '○ Auditoría Final'}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Banner de Requisitos Específicos del Cliente (CSR - Sección 16) */}
              {clientReqs.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-400/50 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 text-xs text-blue-950 dark:text-blue-200">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">CSR</span>
                    <div>
                      <span className="font-bold text-theme-main">Requisitos Específicos del Cliente Aplicables:</span>
                      <p className="text-[11px] text-theme-muted">
                        Esta orden tiene {clientReqs.length} requisitos específicos de cliente ({order.cliente}) auditables por Calidad.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCsrModal(true)}
                    className="rounded-xl border border-blue-400 bg-white dark:bg-blue-900/60 px-3 py-1.5 text-xs font-bold text-blue-800 dark:text-blue-200 hover:bg-blue-100 shadow-xs"
                  >
                    Ver requisitos aplicables
                  </button>
                </div>
              )}

              {/* 5/5 CIERRE DE MANUFACTURA · PRODUCTO TERMINADO DISPONIBLE PARA EMBARQUES (v14) */}
              {(order.status === 'Liberada' || order.qualityGates?.finalAuditApproved || matchingPt) && (
                <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 text-xs shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                            CIERRE DE MANUFACTURA CONFORME
                          </span>
                          <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 text-[10px]">
                            Disponible para Embarques
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black text-xs">
                            {matchingPt?.lotNumber || `PT-260907-${order.folio.slice(-3)}`}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-theme-main">
                          Lote de Producto Terminado Ubicado en Almacén
                        </h4>
                        <p className="text-theme-muted text-[11px] leading-relaxed max-w-2xl">
                          Inspección final de calidad AQL 0.65 concluida. Producto físico identificado, estibado en Almacén PT (<b className="text-theme-main font-mono">{matchingPt?.location || 'PT-A-03'}</b>) y registrado en el listado de Órdenes de Salida de Logística/Embarques.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px]">
                          <div>
                            <span className="text-theme-muted">Cantidad Conforme: </span>
                            <b className="font-mono text-theme-main font-bold">
                              {formatNumber(matchingPt?.finishedQty || order.good || order.quantity)} pzas
                            </b>
                            {order.scrap ? (
                              <span className="text-theme-muted text-[10px] ml-1.5">
                                ({formatNumber(order.scrap)} scrap)
                              </span>
                            ) : null}
                          </div>
                          <div className="h-3 w-px bg-theme-subtle" />
                          <div>
                            <span className="text-theme-muted">Presentación: </span>
                            <b className="text-theme-main font-bold">
                              {matchingPt?.packageCount || Math.max(1, Math.round((order.good || order.quantity) / 1000))} bultos corrugados
                            </b>
                          </div>
                          <div className="h-3 w-px bg-theme-subtle" />
                          <div>
                            <span className="text-theme-muted">Liberado por: </span>
                            <b className="text-theme-main font-bold">
                              {matchingPt?.releasedBy || 'Alicia Ramírez (Calidad)'}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const ptData: FinishedGoodsRelease = matchingPt || {
                            id: `pt-rel-${order.id}`,
                            opId: order.id,
                            opFolio: order.folio,
                            pedido:
                              order.cliente === 'Fresenius Kabi'
                                ? 'PED-RTM-2026-86153'
                                : `PED-RTM-2026-${order.folio.slice(-4)}`,
                            client: order.cliente,
                            partNumber: order.partNumber,
                            revision: order.revision,
                            area: (order.area as any) || 'Flexografía',
                            finishedQty: order.good || order.quantity,
                            lotNumber: `PT-260907-${order.folio.slice(-3)}`,
                            packageCount: Math.max(1, Math.round((order.good || order.quantity) / 1000)),
                            unitsPerPackage: 1000,
                            warehouseId: 'alm-rtm-pt',
                            warehouseName: 'Almacén Producto Terminado',
                            location: 'PT-A-03',
                            releasedBy: 'Alicia Ramírez (Calidad)',
                            releasedAt: '07 Sep · 14:45',
                            status: 'Disponible para embarque',
                            traceabilityNotes: 'Inspección AQL 0.65 conforme. Traspaso formal a Almacén PT-A-03.',
                            isRecentRelease: true,
                          };
                          if (onOpenPtDetail) {
                            onOpenPtDetail(ptData);
                          } else {
                            setLocalPtModal(ptData);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-theme-surface px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 shadow-xs transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Ver Ficha Lote PT
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToEmbarques?.();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Ir a Embarques
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Si la OP está en HOLD por rechazo en calidad */}
              {order.status === 'Detenida' && (
                <div className="rounded-3xl border-2 border-rose-500/30 bg-rose-500/5 p-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                          EN HOLD POR CALIDAD
                        </span>
                        <span className="font-bold text-rose-700 dark:text-rose-400">
                          No disponible para Producto Terminado ni Embarques
                        </span>
                      </div>
                      <p className="text-theme-muted text-[11px] mt-1">
                        La orden presenta hallazgos de auditoría no conformes o se encuentra detenida por contención técnica. Los baches físicos no pueden ingresar a Almacén de PT hasta que se emita disposición de Calidad (MNC).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <span className="font-bold text-theme-main uppercase tracking-wider text-[11px]">
                    Datos de Operación y Piso
                  </span>
                  <p><b className="text-theme-muted">Operador Actual:</b> {order.operator}</p>
                  <p><b className="text-theme-muted">Máquina Asignada:</b> {order.machine}</p>
                  <p><b className="text-theme-muted">Setup Estándar:</b> {order.setupMinutes} minutos</p>
                  <p><b className="text-theme-muted">Corrida Estándar:</b> {order.standardMinutes} minutos</p>
                  <p><b className="text-theme-muted">Tiempo Transcurrido:</b> {order.elapsedMinutes} minutos</p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <span className="font-bold text-theme-main uppercase tracking-wider text-[11px]">
                    Estado de Materiales y Utillaje
                  </span>
                  <p>
                    <b className="text-theme-muted">Insumos:</b>{' '}
                    {order.materialAlert ? (
                      <span className="text-rose-600 font-bold">Reserva con alerta (Barniz UV)</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">100% Reservado en Almacén</span>
                    )}
                  </p>
                  <p><b className="text-theme-muted">Herramental:</b> {order.tooling}</p>
                  <p><b className="text-theme-muted">Próxima OP en cola:</b> {order.nextJob}</p>
                  <p><b className="text-theme-muted">Riesgo de Entrega:</b> {order.deliveryRisk ?? 'Bajo'}</p>
                  {onNavigateToMrp && (
                    <button
                      type="button"
                      onClick={() => onNavigateToMrp(order.folio)}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-theme-primary hover:underline"
                    >
                      Ver cobertura en MRP Materiales &rarr;
                    </button>
                  )}
                </div>
              </div>

              {/* Estado de Hoja Física Impresa */}
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 text-xs gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-theme-primary" />
                  <span className="text-theme-muted">
                    Hoja de OP Física para Piso:{' '}
                    <b className="text-theme-main">
                      {order.sheetPrintedStatus?.isPrinted
                        ? `Impresa ✓ (${order.sheetPrintedStatus.printedAt || '07 Sep · 10:30'} por ${order.sheetPrintedStatus.printedBy || 'Planner RTM'})`
                        : 'No impresa (Pendiente entrega a operador)'}
                    </b>
                  </span>
                  {order.sheetPrintedStatus?.reprintCount ? (
                    <span className="rounded-md bg-theme-muted/30 px-2 py-0.5 text-[10px] font-bold text-theme-muted">
                      {order.sheetPrintedStatus.reprintCount} reimpresiones
                    </span>
                  ) : null}
                </div>

                {onPrintSheet && (
                  <button
                    type="button"
                    onClick={() => onPrintSheet(order)}
                    className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    {order.sheetPrintedStatus?.isPrinted ? 'Ver / Reimprimir Hoja OP' : '🖨 Imprimir Hoja OP'}
                  </button>
                )}
              </div>

              {/* OP Expeditada Banner (si aplica) */}
              {order.expedited && (
                <div className="rounded-2xl border-2 border-amber-500/80 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[9px] font-black uppercase text-white">
                        ⚡ OP EXPEDITADA (SOBRETIEMPO AUTORIZADO)
                      </span>
                    </div>
                    <p className="mt-1 text-xs">
                      <b>Motivo:</b> {order.expeditedReason || 'Compromiso comercial estratégico con cliente'}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white text-[11px]">
                    Fecha Viable ✓
                  </span>
                </div>
              )}

              {/* Desviación Técnica de Material Activa (si existe) */}
              {order.activeDeviation && (
                <div className="rounded-2xl border border-amber-400/70 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      Desviación Técnica Autorizada: {order.activeDeviation.deviationNumber}
                    </span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                      Aprobada por {order.activeDeviation.authorizedBy ?? 'Alicia Ramírez (Calidad)'}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-[11px]">
                    <p className="text-theme-main">
                      <b>Material Original:</b> {order.activeDeviation.originalMaterial}
                    </p>
                    <p className="text-theme-main">
                      <b>Sustituto Aprobado:</b> <span className="font-bold text-amber-800 dark:text-amber-300">{order.activeDeviation.substituteMaterial}</span>
                    </p>
                  </div>
                  <p className="text-theme-muted text-[11px]">
                    <b>Justificación Técnica:</b> {order.activeDeviation.reason} · <b>Alcance:</b> {order.activeDeviation.notes ?? 'Lote actual únicamente'}
                  </p>
                </div>
              )}

              {/* Remanente de Bobina Asignado (si existe) */}
              {order.selectedRemnant && (
                <div className="rounded-2xl border border-blue-400/70 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950 dark:text-blue-200">
                      Remanente de Bobina Asignado ({order.selectedRemnant.remnantCode || order.selectedRemnant.id})
                    </span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                      {order.selectedRemnant.remainingFt.toLocaleString()} ft disponibles
                    </span>
                  </div>
                  <p className="text-theme-muted text-[11px]">
                    <b>Material:</b> {order.selectedRemnant.substrate} ({order.selectedRemnant.widthMm} mm) · <b>Ubicación:</b> {order.selectedRemnant.location} · <b>Lote:</b> {order.selectedRemnant.lot}.
                    Priorizado para tiro inicial antes de abrir rollo virgen.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* COSTEO REAL Y PROYECTADO */}
          {tab === 'Costeo' && (
            <ProductionOrderCostTab
              order={order}
              salesOrders={salesOrders}
              onNavigateToSalesOrder={onNavigateToSalesOrder}
              onNavigateToInternalTab={(targetTab) => setTab(targetTab)}
              costConfig={costConfig}
            />
          )}

          {/* 2. ROUTING (Sección 18 del doc) */}
          {tab === 'Routing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Hoja de Ruta / Avance por Operación
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Entrada, buenas, scrap y aprobación de calidad por estación.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-theme-primary">
                  {routingSteps.length} Operaciones
                </span>
              </div>

              <div className="space-y-3">
                {routingSteps.map((step, index) => {
                  const isCompleted = step.status === 'Completada' || index < 1;
                  const isCurrent = step.status === 'En proceso' || index === 1;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`rounded-2xl border p-4 text-xs transition-all ${
                        isCompleted
                          ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10'
                          : isCurrent
                          ? 'border-theme-primary bg-theme-primary/5 ring-1 ring-theme-primary/20'
                          : 'border-theme-subtle bg-theme-surface opacity-80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary text-[10px] font-bold text-white shrink-0">
                              ●
                            </span>
                          ) : (
                            <Circle className="h-5 w-5 text-theme-muted shrink-0" />
                          )}
                          <div>
                            <span className="font-bold text-theme-main text-sm">
                              #{step.stepNumber} {step.process}
                            </span>
                            <span className="ml-2 font-mono text-xs text-theme-muted">
                              ({step.machine})
                            </span>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                              : isCurrent
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                              : 'bg-theme-muted text-theme-muted'
                          }`}
                        >
                          {isCompleted ? 'Completada ✓' : isCurrent ? 'En Proceso' : 'Pendiente'}
                        </span>
                      </div>

                      {/* Suboperaciones en Flexo */}
                      {step.subOperations && step.subOperations.length > 0 && (
                        <div className="mt-3 ml-8 flex flex-wrap gap-1.5">
                          {step.subOperations.map((sub, i) => (
                            <span
                              key={i}
                              className="rounded-md border border-theme-subtle bg-theme-surface px-2 py-0.5 text-[10px] font-medium text-theme-muted"
                            >
                              ✓ {sub}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Registro de métricas de la operación (Sección 18) */}
                      <div className="mt-3 ml-8 grid grid-cols-2 gap-2 sm:grid-cols-4 rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-[11px]">
                        <div>
                          <span className="text-theme-muted">Entrada:</span>
                          <b className="block font-mono text-theme-main">
                            {step.inQuantity ? formatNumber(step.inQuantity) : formatNumber(order.quantity + 200)}
                          </b>
                        </div>
                        <div>
                          <span className="text-theme-muted">Buenas:</span>
                          <b className="block font-mono text-emerald-600">
                            {step.goodQuantity ? formatNumber(step.goodQuantity) : formatNumber(order.good || order.quantity)}
                          </b>
                        </div>
                        <div>
                          <span className="text-theme-muted">Scrap:</span>
                          <b className="block font-mono text-rose-600">
                            {formatNumber(step.scrapQuantity ?? order.scrap)} {step.scrapUom || (order.area === 'Offset' ? 'pliegos' : 'm')}
                            {step.scrapPercentContribution !== undefined && (
                              <span className="ml-1 text-[10px] font-normal text-rose-500">
                                ({step.scrapPercentContribution.toFixed(1)}%)
                              </span>
                            )}
                          </b>
                        </div>
                        <div>
                          <span className="text-theme-muted">Tiempo:</span>
                          <b className="block font-mono text-theme-muted">
                            {step.setupMinutes + step.runMinutes} min est.
                          </b>
                        </div>
                      </div>

                      {/* Primera pieza de calidad si aplica */}
                      {step.requiresFirstPieceQuality && (
                        <div className="mt-2 ml-8 text-[11px] text-theme-muted flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            Primera pieza: {step.firstPieceApproved ? '✓ Liberada por Calidad (Alicia Ramírez · 09:27)' : '● Pendiente'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scrap Ledger por Etapa & Consumo de Margen */}
              <div className="mt-5">
                <ScrapLedgerPorEtapa order={order} />
              </div>
            </div>
          )}

          {/* 3. PAGINACIÓN / FLEXO DETALLE */}
          {tab === 'Paginación / Flexo' && (
            <div className="space-y-4">
              {order.area === 'Offset' ? (
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4 text-xs">
                  <div className="border-b border-theme-subtle pb-3">
                    <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                      Detalle de Master Paginación RTM
                    </h3>
                    <p className="text-theme-muted">
                      Configuración de pliegos, formas e imposición de páginas.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Páginas Totales:</span>
                      <b className="block font-mono text-base text-theme-main">
                        {order.offsetSpecs?.pages ?? 64} págs
                      </b>
                    </div>
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Formas Requeridas:</span>
                      <b className="block font-mono text-base text-theme-primary">
                        {order.offsetSpecs?.formCount ?? 2} Formas (32+32)
                      </b>
                    </div>
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Tamaño Pliego:</span>
                      <b className="block text-theme-main">{order.offsetSpecs?.sheetSize ?? '57 x 87 cm'}</b>
                    </div>
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Pliegos Calculados:</span>
                      <b className="block font-mono text-theme-main">
                        {order.offsetSpecs?.estimatedSheets?.toLocaleString('es-MX') ?? formatNumber(Math.round(order.quantity / 2))}
                      </b>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-theme-subtle bg-theme-muted/20 p-4">
                    <span className="font-bold text-theme-main">Desglose de Formas:</span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {(order.offsetSpecs?.formsDetail ?? ['Forma 1 (32 págs)', 'Forma 2 (32 págs)']).map((f, i) => (
                        <div key={i} className="rounded-xl border border-emerald-400/40 bg-theme-surface p-3">
                          <b className="text-emerald-700 dark:text-emerald-300">{f}</b>
                          <p className="text-[11px] text-theme-muted mt-0.5">
                            Frente y Vuelta calibrado en {order.machine}. Placas Agfa térmicas verificadas.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4 text-xs">
                  <div className="border-b border-theme-subtle pb-3">
                    <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                      Operaciones en Tren Flexográfico ({order.machine})
                    </h3>
                    <p className="text-theme-muted">
                      Capacidades integradas en la misma prensa flexográfica.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Sustrato Bobina:</span>
                      <b className="block text-theme-main">{order.flexoSpecs?.substrate ?? 'BOPP Blanco Brillante'}</b>
                    </div>
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Tintas / Colores:</span>
                      <b className="block font-mono text-theme-primary">
                        {order.flexoSpecs?.inksCount ?? 4} tintas UV ({order.flexoSpecs?.cmykOrPantone ?? 'CMYK'})
                      </b>
                    </div>
                    <div className="rounded-xl border border-theme-subtle p-3">
                      <span className="text-theme-muted">Etiquetas / Rollo:</span>
                      <b className="block font-mono text-theme-main">
                        {order.flexoSpecs?.quantityPerRoll?.toLocaleString('es-MX') ?? '1,000'}
                      </b>
                    </div>
                  </div>

                  <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-4">
                    <span className="font-bold text-theme-main">Estaciones Activas en la Prensa:</span>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {[
                        '✓ Impresión UV (4 colores)',
                        '✓ Barniz Sobreimpresión Gloss',
                        '✓ Troquelado rotativo corte al liner',
                        '✓ Laminado BOPP transparente',
                        '✓ Tratamiento Corona',
                        '✓ Precorte longitudinal',
                      ].map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-theme-subtle bg-theme-surface p-2 text-[11px] font-semibold text-theme-main">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. MATERIALES (Sección 12 del doc) */}
          {tab === 'Materiales' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Insumos Calculados y Reservas
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Balance de inventario para la orden de producción.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onNavigateToMrp && (
                    <button
                      type="button"
                      onClick={() => onNavigateToMrp(order.folio)}
                      className="rounded-xl border border-theme-primary/30 bg-theme-primary/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors"
                    >
                      📊 Ver Planeación MRP
                    </button>
                  )}
                  {onRequestMaterialExtra && (
                    <button
                      type="button"
                      onClick={onRequestMaterialExtra}
                      className="rounded-xl border border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-100"
                    >
                      + Solicitar Material Adicional / Merma
                    </button>
                  )}
                </div>
              </div>

              {order.activeDeviation && (
                <div className="rounded-xl border border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      <b>Desviación Técnica Autorizada ({order.activeDeviation.deviationNumber}):</b> Sustitución de{' '}
                      <span className="line-through text-theme-muted">{order.activeDeviation.originalMaterial}</span> por{' '}
                      <b className="text-amber-800 dark:text-amber-300">{order.activeDeviation.substituteMaterial}</b>.
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 font-bold text-[10px] text-emerald-800 dark:text-emerald-300">
                    Aprobó: {order.activeDeviation.authorizedBy ?? 'Alicia Ramírez (Calidad)'}
                  </span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-xs">
                  <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
                    <tr>
                      <th className="p-3 text-left">Insumo</th>
                      <th className="p-3 text-left">Requerido</th>
                      <th className="p-3 text-left">Reservado</th>
                      <th className="p-3 text-left">Entregado</th>
                      <th className="p-3 text-left">Disponible</th>
                      <th className="p-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {materials.map((m) => (
                      <tr key={m.id} className="hover:bg-theme-muted/20">
                        <td className="p-3 font-bold text-theme-main">
                          {m.item}
                          {m.substituteAuthorized && (
                            <span className="block text-[10px] font-normal text-amber-600 dark:text-amber-400">
                              Sustituto: {m.substituteAuthorized}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{m.required}</td>
                        <td className="p-3 font-mono">{m.reserved}</td>
                        <td className="p-3 font-mono">{m.delivered}</td>
                        <td className="p-3 font-mono text-theme-muted">{m.available}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              m.status === 'Disponible'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                            }`}
                          >
                            ● {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. HERRAMENTAL */}
          {tab === 'Herramental' && (
            <div className="space-y-4">
              <div className="border-b border-theme-subtle pb-3">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Herramental y Utillaje Asignado
                </h3>
                <p className="text-xs text-theme-muted">
                  Placas, clichés fotopolímeros, cilindros de suaje y cabezales mecánicos.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {((order.toolingItems && order.toolingItems.length > 0
                  ? order.toolingItems
                  : [
                      { id: 't-1', name: order.area === 'Offset' ? 'Placas CTP Agfa' : 'Clichés Fotopolímero 1.14mm', type: order.area === 'Offset' ? 'Placas Offset' : 'Grabado/Cliché', status: 'Liberado' as const, details: 'Verificado para la orden de trabajo', teethOrRepeat: undefined },
                      { id: 't-2', name: order.area === 'Offset' ? 'Cabezal Grapador' : 'Suaje Rotativo Flexible 84 Dientes', type: order.area === 'Offset' ? 'Grapador' : 'Suaje Rotativo', status: 'Disponible' as const, details: 'Montado en máquina y calibrado', teethOrRepeat: '84 dientes · 10.5”' },
                    ]
                ) as ToolingRequirement[]).map((tool) => (
                  <div key={tool.id} className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                    <div className="flex items-center justify-between">
                      <b className="text-theme-main">{tool.name}</b>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        ● {tool.status}
                      </span>
                    </div>
                    <p className="mt-2 text-theme-muted">{tool.details}</p>
                    {tool.teethOrRepeat && (
                      <span className="mt-2 block font-mono font-bold text-theme-primary">
                        {tool.teethOrRepeat}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. INCIDENCIAS */}
          {tab === 'Incidencias' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Registro de Incidencias 4M y Tiempos Muertos
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Control de paros no programados y causas raíz en piso.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onIncident}
                  className="rounded-xl border border-rose-400 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-200"
                >
                  + Reportar Incidencia 4M
                </button>
              </div>

              <div className="space-y-2">
                {PRODUCTION_INCIDENTS.filter((inc) => inc.op === order.folio).map((inc) => (
                  <div key={inc.id} className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <b className="text-theme-main text-sm">
                        {inc.category} · {inc.text}
                      </b>
                      <span className="font-mono font-bold text-rose-600">
                        {inc.minutes} min perdidos
                      </span>
                    </div>
                    <p className="mt-1 text-theme-muted">Folio de incidencia: {inc.id}</p>
                  </div>
                ))}

                {PRODUCTION_INCIDENTS.filter((inc) => inc.op === order.folio).length === 0 && (
                  <p className="rounded-xl border border-dashed border-theme-subtle p-6 text-center text-xs text-theme-muted">
                    No hay incidencias reportadas en esta orden. Operación en tiempo estándar.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 6. CONTROLES QA DEL PROCESO (Docs produccion-disparadores-qa-v13) */}
          {tab === 'Controles QA' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-subtle pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-purple-600/10 dark:bg-purple-900/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Disparadores y Calidad en Línea
                    </span>
                    <span className="text-xs font-mono text-theme-muted">
                      Matriz de 7 Eventos de Control
                    </span>
                  </div>
                  <h3 className="text-base font-black text-theme-main mt-1">
                    Controles QA del Proceso de Fabricación
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Puntos críticos de inspección durante la corrida. Los eventos marcados como bloqueantes detienen el tiraje hasta dictamen técnico de Calidad.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    ✓ {qaControls.filter((c) => c.status === 'Liberada').length} Liberados
                  </span>
                  <span className="rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    ● {qaControls.filter((c) => c.status === 'Solicitada' || c.status === 'En revisión' || c.status === 'No conforme / HOLD').length} En Atención
                  </span>
                </div>
              </div>

              {/* Lista de Controles */}
              <div className="space-y-3">
                {qaControls.map((ctrl, index) => {
                  const isLiberada = ctrl.status === 'Liberada';
                  const isHold = ctrl.status === 'No conforme / HOLD';
                  const isSolicitada = ctrl.status === 'Solicitada' || ctrl.status === 'En revisión';

                  return (
                    <div
                      key={ctrl.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        isHold
                          ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                          : isSolicitada
                          ? 'border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-950/20'
                          : isLiberada
                          ? 'border-theme-subtle bg-theme-surface'
                          : 'border-theme-subtle bg-theme-surface opacity-80'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                              isLiberada
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isHold
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : isSolicitada
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                                : 'bg-theme-muted/40 text-theme-muted'
                            }`}
                          >
                            {isLiberada ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : isHold ? (
                              <AlertTriangle className="h-5 w-5" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <b className="text-sm font-black text-theme-main">{ctrl.trigger}</b>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isLiberada
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : isHold
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                    : isSolicitada
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-theme-muted/50 text-theme-muted'
                                }`}
                              >
                                {ctrl.status}
                              </span>
                              {ctrl.isBlocking ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                  <Lock className="h-3 w-3" /> BLOQUEA PRODUCCIÓN
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-theme-muted/30 px-1.5 py-0.5 text-[10px] font-medium text-theme-muted">
                                  <Unlock className="h-3 w-3" /> No bloqueante
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-theme-muted">
                              <b className="text-theme-main">Cuándo se dispara:</b> {ctrl.timingDescription}
                            </p>

                            {ctrl.evidenceNotes && (
                              <p className="mt-1 text-[11px] text-theme-muted italic">
                                Evidencia: "{ctrl.evidenceNotes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-left md:text-right text-xs shrink-0 space-y-1">
                          <div>
                            <span className="text-[10px] text-theme-muted uppercase font-bold block">Responsable</span>
                            <span className="font-bold text-theme-main">{ctrl.responsible}</span>
                          </div>
                          {ctrl.lastVerifiedAt && (
                            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                              ✓ Verificado: {ctrl.lastVerifiedAt}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nota de Procedimiento Operativo */}
              <div className="rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 p-4 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <b className="font-bold text-purple-950 dark:text-purple-100">
                    Procedimiento de Calidad en Planta (ISO 9001:2015 · FM-CAL-004)
                  </b>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                    Toda desviación o disparo de control bloqueante requiere presencia física del auditor asignado (Alicia Ramírez) y firma digital en la terminal de Calidad antes de que el operador pueda registrar piezas buenas o continuar la velocidad nominal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 7. TRAZABILIDAD COMPLETA (Sección 20 del doc y Disparadores QA v13) */}
          {tab === 'Trazabilidad' && (
            <div className="space-y-4">
              <div className="border-b border-theme-subtle pb-3">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Trazabilidad de Punta a Punta RTM
                </h3>
                <p className="text-xs text-theme-muted">
                  Bitácora inmutable de eventos con segregación de fases: Producción, Disparadores QA (alertas / bloqueos) y Dictámenes de Calidad.
                </p>
              </div>

              <div className="relative border-l-2 border-theme-subtle pl-4 ml-2 space-y-4 text-xs">
                {(order.traceability ?? [
                  { id: '1', timestamp: '07 Sep · 07:15', user: 'Ventas Básico', station: 'Sistema Ventas', event: 'Pedido recibido', notes: `Pedido ${order.pedido} creado y validado`, category: 'production' },
                  { id: '2', timestamp: '07 Sep · 07:45', user: 'Planner RTM', station: 'Configurador Técnico', event: 'OP creada y proceso configurado', notes: `Routing de ${routingSteps.length} etapas confirmado`, category: 'production' },
                  { id: '3', timestamp: '07 Sep · 08:00', user: 'Almacén MP', station: 'Inventario', event: 'Materiales reservados', notes: 'Papel/bobina y tintas asignados con lote', category: 'production' },
                  { id: '4', timestamp: '07 Sep · 08:30', user: 'Taller Suajes', station: 'Herramental', event: 'Herramental liberado', notes: order.tooling, category: 'production' },
                  { id: '5', timestamp: '07 Sep · 09:15', user: 'Operador Piso', station: order.machine, event: 'Inicio preparación y setup', notes: `Setup estándar ${order.setupMinutes} min`, category: 'production' },
                  { id: '6', timestamp: '07 Sep · 09:27', user: 'Alicia Ramírez', station: 'Control Calidad', event: 'Primera pieza liberada', notes: 'Tono, registro y corte aprobados', category: 'quality' },
                ]).map((event, index) => {
                  const isQaTrigger = event.category === 'qa_trigger' || event.event.includes('QA TRIGGER:');
                  const isQuality = event.category === 'quality' || event.event.includes('CALIDAD:');
                  const isBlocking = event.isBlocking;

                  return (
                    <div key={event.id || index} className="relative group">
                      <span
                        className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full ring-4 ring-theme-surface ${
                          isQuality
                            ? 'bg-emerald-500'
                            : isQaTrigger
                            ? isBlocking
                              ? 'bg-rose-500 animate-pulse'
                              : 'bg-amber-500'
                            : 'bg-theme-primary'
                        }`}
                      />
                      <div
                        className={`rounded-xl border p-3.5 transition-all ${
                          isQuality
                            ? 'border-emerald-300/60 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/15'
                            : isQaTrigger
                            ? isBlocking
                              ? 'border-rose-300 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-950/20'
                              : 'border-amber-300 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/15'
                            : 'border-theme-subtle bg-theme-surface hover:bg-theme-muted/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {isQuality ? (
                              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> CALIDAD
                              </span>
                            ) : isQaTrigger ? (
                              <span
                                className={`rounded-md px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase flex items-center gap-1 ${
                                  isBlocking ? 'bg-rose-600' : 'bg-amber-600'
                                }`}
                              >
                                <AlertTriangle className="h-3 w-3" /> QA TRIGGER {isBlocking ? '· BLOQUEANTE' : ''}
                              </span>
                            ) : (
                              <span className="rounded-md bg-theme-primary/20 px-2 py-0.5 text-[9px] font-black tracking-wider text-theme-primary uppercase">
                                PRODUCCIÓN
                              </span>
                            )}
                            <b className="text-theme-main text-xs">{event.event}</b>
                          </div>
                          <span className="font-mono text-theme-muted">{event.timestamp}</span>
                        </div>
                        <p className="mt-1.5 text-theme-muted text-[11px]">
                          Responsable: <b className="text-theme-main">{event.user}</b> · Estación: <i>{event.station}</i>
                        </p>
                        {event.notes && (
                          <p
                            className={`mt-1.5 text-[11px] font-medium ${
                              isQuality
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : isQaTrigger
                                ? isBlocking
                                  ? 'text-rose-700 dark:text-rose-300'
                                  : 'text-amber-700 dark:text-amber-300'
                                : 'text-theme-primary'
                            }`}
                          >
                            {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer de Acciones */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-4">
            <div className="flex gap-2">
              {order.status === 'Pendiente de calidad' && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-200">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Pendiente de Dictamen y Liberación Final por Calidad (Alicia Ramírez)</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
            >
              Cerrar Detalle
            </button>
          </div>
          {/* Modal Requisitos Específicos del Cliente (CSR) */}
          {showCsrModal && (
            <ModalPortal onClose={() => setShowCsrModal(false)}>
              <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-xl bg-blue-600 px-2.5 py-1 text-xs font-black text-white">CSR</span>
                    <div>
                      <h3 className="font-black text-sm text-theme-main">
                        Requisitos Específicos del Cliente: {order.cliente}
                      </h3>
                      <small className="text-theme-muted font-mono">
                        Auditable según IATF 16949 / ISO 9001 · OP {order.folio}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCsrModal(false)}
                    className="rounded-xl p-1.5 text-theme-muted hover:text-theme-main hover:bg-theme-muted/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted block">
                    Matriz de Requisitos Mandatorios ({clientReqs.length}):
                  </span>
                  <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden">
                    {clientReqs.map((req) => (
                      <div key={req.id} className="p-3.5 space-y-1 text-xs hover:bg-theme-muted/10">
                        <div className="flex items-center justify-between">
                          <b className="text-theme-main font-bold">{req.requirement}</b>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            req.status === 'Cumple'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-theme-muted text-[11px]">{req.standard}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-theme-muted font-mono pt-1">
                          <span>Código: <b className="text-theme-main">{req.code}</b></span>
                          <span>Dueño: <b className="text-theme-main">{req.owner}</b></span>
                          <span>Evidencia: <b className="text-theme-primary">{req.auditEvidence}</b></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCsrModal(false)}
                    className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </ModalPortal>
          )}

          {/* Modal Ficha de Lote PT */}
          {localPtModal && (
            <FichaLotePtModal
              release={localPtModal}
              onClose={() => setLocalPtModal(null)}
              onNavigateToEmbarques={() => {
                setLocalPtModal(null);
                onClose();
                onNavigateToEmbarques?.();
              }}
            />
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
