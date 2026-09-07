import React, { useState } from 'react';
import { AlertTriangle, Pause, Play, Wrench, ShieldCheck, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, StatusBadge, formatNumber } from './productionUi';
import { SolicitarMaterialExtraModal } from './SolicitarMaterialExtraModal';
import { ReporteDiarioOperadorModal } from './ReporteDiarioOperadorModal';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onUpdate: (id: string, patch: Partial<ProductionOrder>) => void;
  onIncident: (order: ProductionOrder) => void;
}

export const PisoProduccion: React.FC<Props> = ({ orders, onOpenOrder, onUpdate, onIncident }) => {
  const [materialOrder, setMaterialOrder] = useState<ProductionOrder | null>(null);
  const [reportOrder, setReportOrder] = useState<ProductionOrder | null>(null);
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});

  const handleRequestMaterialExtra = (
    order: ProductionOrder,
    materialName: string,
    quantity: string,
    reason: string,
    category4M: string,
    comment: string
  ) => {
    const updatedScrap = order.scrap + 150;
    const newTraceabilityEvent = {
      id: `tr-mat-${Date.now()}`,
      timestamp: '07 Sep · 10:45',
      user: order.operator,
      station: order.machine,
      event: `Material extra solicitado: ${quantity} de ${materialName}`,
      notes: `Motivo 4M (${category4M}): ${reason} · ${comment}`,
      badgeTone: 'warning' as const,
    };

    onUpdate(order.id, {
      scrap: updatedScrap,
      traceability: [newTraceabilityEvent, ...(order.traceability ?? [])],
    });
    setMaterialOrder(null);
  };

  const handleApproveFirstPiece = (order: ProductionOrder) => {
    onUpdate(order.id, {
      qualityGates: {
        ...(order.qualityGates ?? { prepressReleased: true, finalAuditApproved: false }),
        firstPieceReleased: true,
        firstPieceApprover: 'Alicia Ramírez (Calidad)',
      },
      status: 'En proceso',
      progress: Math.max(order.progress, 15),
      traceability: [
        {
          id: `tr-qp-${Date.now()}`,
          timestamp: '07 Sep · 09:30',
          user: 'Alicia Ramírez (Calidad)',
          station: order.machine,
          event: 'Primera Pieza Liberada por Calidad',
          notes: 'Inspección de registro, tono, código de barras y corte conforme a máster',
          badgeTone: 'success',
        },
        ...(order.traceability ?? []),
      ],
    });
  };

  return (
    <div className="space-y-4">
      {/* Botones rápidos superiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4">
        <div>
          <h2 className="text-sm font-black text-theme-main uppercase tracking-wider">
            Consola Operativa de Piso de Planta (RTM)
          </h2>
          <p className="text-xs text-theme-muted">
            Ejecución en vivo de órdenes, control de setup, cronómetros, primera pieza y reporte diario de operador.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReportOrder(orders[0] || null)}
          className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
        >
          <FileText className="h-4 w-4" /> Capturar Reporte Diario de Operador
        </button>
      </div>

      {/* Grid de órdenes activas en piso */}
      <div className="grid gap-4 lg:grid-cols-2">
        {orders
          .filter((order) =>
            ['En proceso', 'En preparación', 'Detenida', 'Lista para producir', 'Planeada'].includes(order.status)
          )
          .slice(0, 8)
          .map((order) => {
            const isFirstPiecePending = !order.qualityGates?.firstPieceReleased;

            return (
              <ProductionCard key={order.id}>
                <div className="p-5">
                  {/* Header de la tarjeta */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-theme-primary">
                          {order.machine}
                        </span>
                        <span className="text-[11px] font-mono text-theme-muted">{order.area}</span>
                      </div>
                      <b className="mt-1 block text-sm text-theme-main">
                        {order.folio} · {order.cliente}
                      </b>
                      <small className="block text-theme-muted">
                        Parte: <b>{order.partNumber}</b> ({order.revision}) · Operador: <b>{order.operator}</b> · Siguiente en cola: {order.nextJob}
                      </small>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Métricas de producción */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      ['Objetivo', formatNumber(order.quantity)],
                      ['Buenas', formatNumber(order.good)],
                      ['Scrap', formatNumber(order.scrap)],
                      ['Tiempo', `${order.elapsedMinutes}/${order.standardMinutes} min`],
                    ].map(([label, value]) => (
                      <span className="rounded-xl bg-theme-muted/40 p-2 text-xs" key={label}>
                        <small className="text-theme-muted">{label}</small>
                        <b className="block font-mono text-theme-main">{value}</b>
                      </span>
                    ))}
                  </div>

                  {/* Quality Gate: Primera pieza */}
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`h-4 w-4 ${
                          isFirstPiecePending ? 'text-amber-500' : 'text-emerald-600'
                        }`}
                      />
                      <span>
                        Primera Pieza:{' '}
                        {isFirstPiecePending ? (
                          <b className="text-amber-700 dark:text-amber-300">Pendiente de Aprobación</b>
                        ) : (
                          <b className="text-emerald-700 dark:text-emerald-300">
                            Liberada ({order.qualityGates?.firstPieceApprover ?? 'Alicia Ramírez'})
                          </b>
                        )}
                      </span>
                    </div>

                    {isFirstPiecePending && (
                      <button
                        type="button"
                        onClick={() => handleApproveFirstPiece(order)}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                      >
                        ✓ Liberar 1ra Pieza
                      </button>
                    )}
                  </div>

                  {/* Insumos y Herramental */}
                  <div className="mt-3 grid gap-2 text-xs">
                    <p
                      className={`rounded-xl border p-2.5 ${
                        order.materialAlert ? 'border-rose-400 text-rose-700 dark:text-rose-300 bg-rose-50/40' : 'border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-50/20'
                      }`}
                    >
                      {order.materialAlert ? (
                        <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                      )}
                      Insumos:{' '}
                      {order.materialAlert
                        ? 'Barniz UV sin reserva completa; sustituto autorizado disponible.'
                        : '100% de insumos y bobinas entregados en máquina.'}
                    </p>

                    <p className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
                      <Wrench className="mr-1 inline h-3.5 w-3.5 text-theme-primary" />
                      {order.tooling} · setup estándar: {order.setupMinutes} min
                    </p>
                  </div>

                  {/* Botones de acción operativa */}
                  <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-theme-subtle">
                    {order.status === 'En proceso' ? (
                      <button
                        type="button"
                        onClick={() => onUpdate(order.id, { status: 'Detenida' })}
                        className="rounded-xl border border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-200"
                      >
                        <Pause className="mr-1 inline h-3.5 w-3.5" /> Pausar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate(order.id, {
                            status: 'En proceso',
                            progress: Math.max(order.progress, 10),
                          })
                        }
                        className="rounded-xl bg-theme-primary px-3 py-2 text-xs font-bold text-white hover:bg-theme-primary/90"
                      >
                        <Play className="mr-1 inline h-3.5 w-3.5" />
                        {order.status === 'En preparación' ? 'Iniciar producción' : 'Iniciar preparación'}
                      </button>
                    )}

                    {/* Botón Material Adicional (Sección 17) */}
                    <button
                      type="button"
                      onClick={() => setMaterialOrder(order)}
                      className="rounded-xl border border-amber-400 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50/50"
                    >
                      + Solicitar material adicional
                    </button>

                    <button
                      type="button"
                      onClick={() => onIncident(order)}
                      className="rounded-xl border border-rose-400 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50/50"
                    >
                      Reportar paro 4M
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdate(order.id, {
                          status: 'Pendiente de calidad',
                          progress: 96,
                          good: Math.round(order.quantity * 0.98),
                        })
                      }
                      className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
                    >
                      Terminar operación
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenOrder(order)}
                      className="px-2 text-xs font-bold text-theme-primary hover:underline"
                    >
                      Detalle OP
                    </button>
                  </div>
                </div>
              </ProductionCard>
            );
          })}
      </div>

      {/* Modal para solicitar material adicional */}
      {materialOrder && (
        <SolicitarMaterialExtraModal
          order={materialOrder}
          onClose={() => setMaterialOrder(null)}
          onConfirm={(matName, qty, rsn, cat, cmt) =>
            handleRequestMaterialExtra(materialOrder, matName, qty, rsn, cat, cmt)
          }
        />
      )}

      {/* Modal para captura de reporte diario */}
      {reportOrder && (
        <ReporteDiarioOperadorModal
          order={reportOrder}
          onClose={() => setReportOrder(null)}
          onSaveReport={(entry) => {
            setReportOrder(null);
          }}
        />
      )}
    </div>
  );
};
