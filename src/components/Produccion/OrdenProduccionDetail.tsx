import React, { useState } from 'react';
import { CheckCircle2, Circle, X, AlertTriangle, ShieldCheck, Clock, FileText } from 'lucide-react';
import { PRODUCTION_INCIDENTS, ProductionOrder, RoutingStep, ToolingRequirement } from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { ProductionCard, StatusBadge, formatNumber } from './productionUi';

interface Props {
  order: ProductionOrder;
  onClose: () => void;
  onIncident: () => void;
  onRelease: () => void;
  onAdvanceOperation?: (stepNumber: number) => void;
  onRequestMaterialExtra?: () => void;
}

export const OrdenProduccionDetail: React.FC<Props> = ({
  order,
  onClose,
  onIncident,
  onRelease,
  onAdvanceOperation,
  onRequestMaterialExtra,
}) => {
  const [tab, setTab] = useState<'Resumen' | 'Routing' | 'Paginación / Flexo' | 'Materiales' | 'Herramental' | 'Incidencias' | 'Trazabilidad'>('Resumen');

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

  const tabs = [
    'Resumen',
    'Routing',
    order.area === 'Offset' ? 'Paginación / Offset' : 'Operaciones Flexo',
    'Materiales',
    'Herramental',
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
                </div>
              </div>

              {/* Estado de Hoja Física Impresa */}
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-theme-primary" />
                  <span className="text-theme-muted">
                    Hoja de OP Física para Piso:{' '}
                    <b className="text-theme-main">
                      {order.sheetPrintedStatus?.isPrinted
                        ? `Impresa ✓ (${order.sheetPrintedStatus.printedAt || '07 Sep · 10:30'} por ${order.sheetPrintedStatus.printedBy || 'Supervisor RTM'})`
                        : 'No impresa (Pendiente entrega a operador)'}
                    </b>
                  </span>
                </div>
                {order.sheetPrintedStatus?.reprintCount ? (
                  <span className="rounded-md bg-theme-muted/30 px-2 py-0.5 text-[10px] font-bold text-theme-muted">
                    {order.sheetPrintedStatus.reprintCount} reimpresiones registradas
                  </span>
                ) : null}
              </div>

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
                            {step.scrapQuantity ?? order.scrap} piezas
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

          {/* 7. TRAZABILIDAD COMPLETA (Sección 20 del doc) */}
          {tab === 'Trazabilidad' && (
            <div className="space-y-4">
              <div className="border-b border-theme-subtle pb-3">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Trazabilidad de Punta a Punta RTM
                </h3>
                <p className="text-xs text-theme-muted">
                  Bitácora inmutable de eventos: pedido → configuración → planeación → ejecución → calidad → entrega.
                </p>
              </div>

              <div className="relative border-l-2 border-theme-subtle pl-4 ml-2 space-y-4 text-xs">
                {(order.traceability ?? [
                  { id: '1', timestamp: '07 Sep · 07:15', user: 'Ventas Básico', station: 'Sistema Ventas', event: 'Pedido recibido', notes: `Pedido ${order.pedido} creado y validado` },
                  { id: '2', timestamp: '07 Sep · 07:45', user: 'Planner RTM', station: 'Configurador Técnico', event: 'OP creada y proceso configurado', notes: `Routing de ${routingSteps.length} etapas confirmado` },
                  { id: '3', timestamp: '07 Sep · 08:00', user: 'Almacén MP', station: 'Inventario', event: 'Materiales reservados', notes: 'Papel/bobina y tintas asignados con lote' },
                  { id: '4', timestamp: '07 Sep · 08:30', user: 'Taller Suajes', station: 'Herramental', event: 'Herramental liberado', notes: order.tooling },
                  { id: '5', timestamp: '07 Sep · 09:15', user: 'Operador Piso', station: order.machine, event: 'Inicio preparación y setup', notes: `Setup estándar ${order.setupMinutes} min` },
                  { id: '6', timestamp: '07 Sep · 09:27', user: 'Alicia Ramírez', station: 'Control Calidad', event: 'Primera pieza liberada', notes: 'Tono, registro y corte aprobados' },
                ]).map((event, index) => (
                  <div key={event.id} className="relative group">
                    <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-theme-primary ring-4 ring-theme-surface" />
                    <div className="rounded-xl border border-theme-subtle bg-theme-surface p-3 hover:bg-theme-muted/20 transition-all">
                      <div className="flex items-center justify-between text-[11px]">
                        <b className="text-theme-main text-xs">{event.event}</b>
                        <span className="font-mono text-theme-muted">{event.timestamp}</span>
                      </div>
                      <p className="mt-1 text-theme-muted">
                        Responsable: <b className="text-theme-main">{event.user}</b> · Estación: <i>{event.station}</i>
                      </p>
                      {event.notes && (
                        <p className="mt-1 text-[11px] text-theme-primary font-medium">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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
        </div>
      </div>
    </ModalPortal>
  );
};
