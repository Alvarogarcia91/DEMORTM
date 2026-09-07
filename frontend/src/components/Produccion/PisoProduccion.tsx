import React, { useState, useEffect } from 'react';
import { AlertTriangle, Pause, Play, Wrench, ShieldCheck, Plus, FileText, CheckCircle2, Clock } from 'lucide-react';
import { OperatorDailyReportEntry, ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, StatusBadge, formatNumber } from './productionUi';
import { SolicitarMaterialExtraModal } from './SolicitarMaterialExtraModal';
import { ReporteDiarioOperadorModal } from './ReporteDiarioOperadorModal';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onUpdate: (id: string, patch: Partial<ProductionOrder>) => void;
  onIncident: (order: ProductionOrder) => void;
  onSaveDailyReport?: (entry: OperatorDailyReportEntry) => void;
  dailyReports?: OperatorDailyReportEntry[];
}

export const PisoProduccion: React.FC<Props> = ({
  orders,
  onOpenOrder,
  onUpdate,
  onIncident,
  onSaveDailyReport,
  dailyReports = [],
}) => {
  const [materialOrder, setMaterialOrder] = useState<ProductionOrder | null>(null);
  const [reportOrder, setReportOrder] = useState<ProductionOrder | null>(null);
  const [activeTimerOrderId, setActiveTimerOrderId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(1420); // Simulación de tiempo transcurrido en vivo

  // Cronómetro visual para la orden en proceso (Sección 13.1 de la auditoría)
  useEffect(() => {
    let interval: any;
    if (activeTimerOrderId) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimerOrderId]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // V5: Material adicional actualiza entrega acumulada y solo suma scrap si aplica (P1 Sección 8)
  const handleRequestMaterialExtra = (
    order: ProductionOrder,
    materialName: string,
    quantity: string,
    reason: string,
    category4M: string,
    comment: string
  ) => {
    const extraNum = parseInt(quantity.replace(/[^0-9]/g, ''), 10) || 500;
    const isFaltante = reason.toLowerCase().includes('faltante') || reason.toLowerCase().includes('almacén');
    const isDefectOrMerma =
      (category4M === 'Material' || category4M === 'Mano de obra' || reason.toLowerCase().includes('merma') || reason.toLowerCase().includes('desperdicio')) &&
      !isFaltante;

    const scrapIncrement = isDefectOrMerma ? Math.min(extraNum, 200) : 0; // Si motivo = faltante de almacén, 0 scrap

    const updatedMaterials = (order.materials ?? []).map((m) => {
      if (m.item === materialName) {
        const currentNum = parseInt(m.delivered.replace(/[^0-9]/g, ''), 10) || 0;
        const newTotal = currentNum + extraNum;
        return {
          ...m,
          delivered: `${newTotal.toLocaleString('es-MX')} (acumulado +${extraNum.toLocaleString('es-MX')} extra)`,
        };
      }
      return m;
    });

    const newTraceabilityEvent = {
      id: `tr-mat-${Date.now()}`,
      timestamp: '07 Sep · 10:45',
      user: order.operator,
      station: order.machine,
      event: `Material adicional entregado: ${quantity} de ${materialName}`,
      notes: `Motivo 4M (${category4M}): ${reason} · ${comment} | Entrega acumulada actualizada en máquina${
        scrapIncrement > 0 ? ` (+${scrapIncrement} piezas registradas en scrap)` : ' (Sin incremento de scrap: faltante de almacén)'
      }`,
      badgeTone: 'warning' as const,
    };

    onUpdate(order.id, {
      materials: updatedMaterials,
      scrap: order.scrap + scrapIncrement,
      traceability: [newTraceabilityEvent, ...(order.traceability ?? [])],
    });
    setMaterialOrder(null);
  };

  // Simulación de solicitud de primera pieza a Calidad (Sección 13.4 de la auditoría)
  const handleRequestFirstPiece = (order: ProductionOrder) => {
    onUpdate(order.id, {
      qualityGates: {
        ...(order.qualityGates ?? { prepressReleased: true, finalAuditApproved: false, firstPieceReleased: false }),
        firstPieceRequested: true,
      },
      traceability: [
        {
          id: `tr-qp-req-${Date.now()}`,
          timestamp: '07 Sep · 09:20',
          user: order.operator,
          station: order.machine,
          event: 'Primera Pieza enviada a inspección de Calidad',
          notes: 'Esperando liberación en mesa de calidad de Alicia Ramírez',
          badgeTone: 'primary',
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
            Ejecución en vivo, cronómetro operativo, solicitud de 1ra pieza a QA, material adicional sin scrap arbitrario y reporte diario.
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
            ['En proceso', 'En preparación', 'Detenida', 'Lista para producir', 'Material surtido'].includes(order.status)
          )
          .slice(0, 8)
          .map((order) => {
            const isFirstPieceReleased = order.qualityGates?.firstPieceReleased;
            const isFirstPieceRequested = order.qualityGates?.firstPieceRequested;
            const isTimerRunning = activeTimerOrderId === order.id;

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
                        {/* Cronómetro visual si está activo */}
                        {isTimerRunning && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-200 animate-pulse">
                            <Clock className="h-3 w-3" /> {formatTimer(timerSeconds)}
                          </span>
                        )}
                      </div>
                      <b className="mt-1 block text-sm text-theme-main">
                        {order.folio} · {order.cliente}
                      </b>
                      <small className="block text-theme-muted">
                        Parte: <b>{order.partNumber}</b> ({order.revision}) · Operador: <b>{order.operator}</b> · Siguiente: {order.nextJob}
                      </small>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Métricas de producción */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      ['Objetivo', formatNumber(order.quantity)],
                      ['Buenas', formatNumber(order.good)],
                      ['Scrap', `${formatNumber(order.scrap)} ejs`],
                      ['Tiempo', `${order.elapsedMinutes}/${order.standardMinutes} min`],
                    ].map(([label, value]) => (
                      <span className="rounded-xl bg-theme-muted/40 p-2 text-xs" key={label}>
                        <small className="text-theme-muted">{label}</small>
                        <b className="block font-mono text-theme-main">{value}</b>
                      </span>
                    ))}
                  </div>

                  {/* Quality Gate: Solicitud y Aprobación de Primera Pieza (Sección 13.4) */}
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`h-4 w-4 ${
                          isFirstPieceReleased ? 'text-emerald-600' : isFirstPieceRequested ? 'text-blue-500 animate-bounce' : 'text-amber-500'
                        }`}
                      />
                      <span>
                        Primera Pieza:{' '}
                        {isFirstPieceReleased ? (
                          <b className="text-emerald-700 dark:text-emerald-300">
                            Liberada ({order.qualityGates?.firstPieceApprover ?? 'Alicia Ramírez'})
                          </b>
                        ) : isFirstPieceRequested ? (
                          <b className="text-blue-700 dark:text-blue-300">En revisión por Calidad (Alicia Ramírez)</b>
                        ) : (
                          <b className="text-amber-700 dark:text-amber-300">Pendiente de Aprobación</b>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isFirstPieceReleased && !isFirstPieceRequested && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRequestFirstPiece(order)}
                            className="rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-100 flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Solicitar auditoría QA
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestFirstPiece(order)}
                            className="rounded-lg border border-theme-subtle px-2 py-1 text-[10px] font-bold text-theme-main hover:bg-theme-muted/30"
                          >
                            Pieza lista para revisión
                          </button>
                        </div>
                      )}

                      {!isFirstPieceReleased && isFirstPieceRequested && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                            <Clock className="h-3 w-3" /> Esperando dictamen de Calidad (Alicia Ramírez)
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenOrder(order)}
                            className="rounded-lg border border-theme-subtle px-2 py-0.5 text-[10px] font-bold text-theme-main hover:bg-theme-muted/30"
                          >
                            Ver auditoría
                          </button>
                        </div>
                      )}

                      {isFirstPieceReleased && (
                        <button
                          type="button"
                          onClick={() => onOpenOrder(order)}
                          className="rounded-lg border border-emerald-400/50 bg-emerald-50/50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                        >
                          Ver auditoría
                        </button>
                      )}
                    </div>
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
                        onClick={() => {
                          setActiveTimerOrderId(null);
                          onUpdate(order.id, { status: 'Detenida' });
                        }}
                        className="rounded-xl border border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-200"
                      >
                        <Pause className="mr-1 inline h-3.5 w-3.5" /> Pausar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTimerOrderId(order.id);
                          onUpdate(order.id, {
                            status: 'En proceso',
                            progress: Math.max(order.progress, 10),
                          });
                        }}
                        className="rounded-xl bg-theme-primary px-3 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
                      >
                        <Play className="mr-1 inline h-3.5 w-3.5" />
                        {order.status === 'En preparación' ? 'Iniciar producción' : 'Iniciar preparación y timer'}
                      </button>
                    )}

                    {/* Botón Material Adicional (Sección 17 y 13.3) */}
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
                      onClick={() => {
                        setActiveTimerOrderId(null);
                        onUpdate(order.id, {
                          status: 'Pendiente de calidad',
                          progress: 96,
                          good: Math.round(order.quantity * 0.98),
                        });
                      }}
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

      {/* V5: Historial de Reportes Diarios de Operador Persistidos (P1 Sección 9) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-theme-primary" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Historial de Reportes Diarios de Operador (Turnos Recientes RTM)
              </h3>
              <p className="text-[11px] text-theme-muted">
                Registros de horas productivas, tiempos muertos y códigos oficiales 100/200/300/400.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
            {dailyReports.length} reportes persistidos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-2.5 text-left">Fecha / Turno</th>
                <th className="p-2.5 text-left">Operador</th>
                <th className="p-2.5 text-left">Máquina</th>
                <th className="p-2.5 text-left">Horario</th>
                <th className="p-2.5 text-left">Código RTM</th>
                <th className="p-2.5 text-left">OP / Cliente</th>
                <th className="p-2.5 text-right">Cant. Producida</th>
                <th className="p-2.5 text-left">Comentarios Técnicos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {dailyReports.map((r) => (
                <tr key={r.id} className="hover:bg-theme-muted/20">
                  <td className="p-2.5">
                    <b>{r.date}</b>
                    <small className="block text-theme-muted">{r.shift}</small>
                  </td>
                  <td className="p-2.5 font-bold text-theme-main">{r.operator}</td>
                  <td className="p-2.5">{r.areaMachine}</td>
                  <td className="p-2.5 font-mono text-[11px]">
                    {r.startTime} - {r.endTime}
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                        r.code === '100'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : r.code === '200'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                          : r.code === '300'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}
                    >
                      {r.code}
                    </span>
                    <small className="block text-theme-muted text-[10px]">{r.codeDescription}</small>
                  </td>
                  <td className="p-2.5">
                    <b className="font-mono text-theme-primary">{r.opFolio}</b>
                    <small className="block text-theme-muted truncate max-w-28">{r.client}</small>
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-theme-main">
                    {r.producedQuantity.toLocaleString('es-MX')} ejs
                  </td>
                  <td className="p-2.5 text-theme-muted text-[11px] max-w-xs truncate">
                    {r.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            if (onSaveDailyReport) onSaveDailyReport(entry);
            setReportOrder(null);
          }}
        />
      )}
    </div>
  );
};
