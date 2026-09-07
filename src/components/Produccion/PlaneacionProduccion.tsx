import React, { useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronRight, Clock, PackageCheck, RefreshCw, X, ArrowDownCircle } from 'lucide-react';
import { PRODUCTION_MACHINES, ProductionArea, ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, StatusBadge } from './productionUi';
import { ModalPortal } from '../common/ModalPortal';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onMoveOrder: (order: ProductionOrder, newMachine?: string, newDate?: string, reason?: string) => void;
  onMarkMaterialDelivered?: (order: ProductionOrder) => void;
}

export const PlaneacionProduccion: React.FC<Props> = ({
  orders,
  onOpenOrder,
  onMoveOrder,
  onMarkMaterialDelivered,
}) => {
  const [area, setArea] = useState<'Todas' | ProductionArea>('Todas');
  const [reprogramOrder, setReprogramOrder] = useState<ProductionOrder | null>(null);

  // Reprogram modal fields
  const [targetMachine, setTargetMachine] = useState('');
  const [targetDate, setTargetDate] = useState('12 Sep');
  const [targetReason, setTargetReason] = useState('Nivelación de carga en prensa');

  const machines = PRODUCTION_MACHINES.filter((machine) => area === 'Todas' || machine.area === area);
  const days = ['Lun 07', 'Mar 08', 'Mié 09', 'Jue 10', 'Vie 11'];

  const handleOpenReprogram = (order: ProductionOrder) => {
    setReprogramOrder(order);
    setTargetMachine(order.machine);
    setTargetDate('12 Sep');
    setTargetReason('Nivelación de carga y optimización de setup');
  };

  const handleConfirmReprogram = () => {
    if (!reprogramOrder) return;
    onMoveOrder(reprogramOrder, targetMachine, targetDate, targetReason);
    setReprogramOrder(null);
  };

  // Cálculo real de horas planeadas y disponibles por máquina (P0 Sección 6)
  const getMachineHoursSummary = (machineName: string) => {
    const machineOrders = orders.filter((o) => o.machine === machineName && !['Terminada', 'Liberada'].includes(o.status));
    const totalMinutes = machineOrders.reduce((sum, o) => sum + (o.setupMinutes + o.standardMinutes), 0);
    const plannedHours = (totalMinutes / 60);
    const capacityHours = 40.0; // Semana laboral estándar 40h
    const availableHours = Math.max(0, capacityHours - plannedHours);
    const utilizationPercent = Math.min(100, Math.round((plannedHours / capacityHours) * 100));

    return {
      machineOrders,
      plannedHours: plannedHours.toFixed(1),
      availableHours: availableHours.toFixed(1),
      capacityHours,
      utilizationPercent,
    };
  };

  // Órdenes en programa de surtido próximas 24h (P1 Sección 7)
  const next24hOrders = orders
    .filter((o) => ['Por surtir', 'Material surtido', 'Lista para producir'].includes(o.status))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Programa de Surtido a 24 Horas (Dolencia concreta de Iván - Sección 7) */}
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                PROGRAMA DE SURTIDO A 24 HORAS · ALMACÉN MP
              </span>
              <span className="text-xs text-theme-muted">Anticipación de insumos para arranque de turno</span>
            </div>
            <h3 className="text-sm font-black text-theme-main mt-1">
              Materiales Requeridos para Próximas Órdenes en Máquina
            </h3>
          </div>
          <span className="text-xs text-theme-muted">
            {next24hOrders.length} Órdenes programadas en ventana crítica
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {next24hOrders.map((o, idx) => {
            const isReady = o.status === 'Material surtido' || o.status === 'Lista para producir';
            const firstMat = o.materials?.[0]?.item ?? (o.area === 'Offset' ? 'Papel Bond 60g' : 'Bobina Bopp Blanco 7”');
            const qtyNeeded = o.materials?.[0]?.required ?? `${(o.quantity / 2).toLocaleString()} unids`;

            return (
              <div
                key={o.id}
                className={`rounded-xl border p-3.5 text-xs transition-all ${
                  isReady
                    ? 'border-emerald-500/40 bg-theme-surface shadow-2xs'
                    : 'border-amber-400/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-theme-main">{o.folio}</span>
                  <span className="font-mono text-[10px] text-theme-muted">{idx === 0 ? '07:30' : '09:30'}</span>
                </div>

                <b className="mt-1 block text-theme-main truncate">{o.machine}</b>
                <span className="block text-[11px] text-theme-muted truncate">{o.cliente}</span>

                <div className="mt-2 text-[11px] rounded-lg bg-theme-muted/30 p-2">
                  <span className="text-theme-muted block">{firstMat}</span>
                  <b className="font-mono text-theme-main">Req: {qtyNeeded}</b>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isReady ? '✓ Material surtido' : '⚠ Por surtir'}
                  </span>

                  {!isReady && onMarkMaterialDelivered && (
                    <button
                      type="button"
                      onClick={() => onMarkMaterialDelivered(o)}
                      className="rounded-lg bg-theme-primary px-2.5 py-1 text-[10px] font-bold text-white hover:bg-theme-primary/90"
                    >
                      Marcar surtido
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Controles de Filtrado y Semáforo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-theme-primary" />
          <select
            value={area}
            onChange={(event) => setArea(event.target.value as 'Todas' | ProductionArea)}
            className="rounded-xl border border-theme-subtle bg-theme-surface p-2 text-xs font-bold"
          >
            <option>Todas</option>
            <option>Offset</option>
            <option>Flexografía</option>
            <option>Acabados</option>
          </select>
          <span className="text-xs text-theme-muted">
            Semana 37 · Matriz de Carga de Máquinas, Setup y Cola con Horas Reales (40 h estándar)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-theme-muted">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-rose-400 bg-rose-50" /> Borde rojo = Insumo/bloqueada
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-theme-primary/40 bg-theme-primary/10" /> Azul = Programada
          </span>
        </div>
      </div>

      {/* 3. Matriz de Carga Semanal con Horas Calculadas y Múltiples OP (P0 Sección 6) */}
      <ProductionCard>
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[260px_repeat(5,1fr)] border-b border-theme-subtle text-[10px] font-bold uppercase text-theme-muted">
              <span className="p-3">Máquina / Horas Reales (Cap. 40h)</span>
              {days.map((day) => (
                <span className="p-3 text-center" key={day}>
                  {day}
                </span>
              ))}
            </div>

            {machines.map((machine, row) => {
              const { machineOrders, plannedHours, availableHours, utilizationPercent } = getMachineHoursSummary(machine.name);

              return (
                <div
                  className="grid grid-cols-[260px_repeat(5,1fr)] border-b border-theme-subtle text-xs hover:bg-theme-muted/10 transition-colors"
                  key={machine.id}
                >
                  {/* Encabezado por máquina con horas calculadas según auditoría */}
                  <span className="p-3 bg-theme-surface">
                    <b className="text-theme-main text-xs block truncate">{machine.name}</b>
                    <div className="mt-1 text-[11px] text-theme-muted space-y-0.5">
                      <div>Plan: <b className="font-mono text-theme-main">{plannedHours} h</b> · Disp: <b className="font-mono text-emerald-600">{availableHours} h</b></div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span>Utilización:</span>
                        <b className={utilizationPercent > 85 ? 'text-rose-600' : 'text-theme-primary'}>
                          {utilizationPercent}%
                        </b>
                      </div>
                    </div>
                  </span>

                  {/* Días de la semana con soporte para múltiples OP en cola */}
                  {days.map((day, column) => {
                    // Colocar las OP de la máquina en los días correspondientes
                    const dayOrders = machineOrders.filter((_, idx) => (row + idx) % days.length === column);

                    return (
                      <div className="min-h-28 border-l border-theme-subtle p-2 space-y-2" key={day}>
                        {dayOrders.map((order) => (
                          <div
                            key={order.id}
                            className={`rounded-xl border p-2.5 transition-all shadow-2xs ${
                              order.status === 'Bloqueada por material' || order.materialAlert
                                ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                                : 'border-theme-primary/40 bg-theme-surface hover:border-theme-primary'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => onOpenOrder(order)}
                              className="w-full text-left"
                            >
                              <div className="flex items-center justify-between">
                                <b className="font-mono text-[10px] text-theme-main">{order.folio}</b>
                                <span className="text-[9px] text-theme-muted font-mono">{order.due}</span>
                              </div>
                              <small className="mt-0.5 block font-bold text-theme-main truncate text-[11px]">
                                {order.cliente}
                              </small>
                              <small className="block text-[10px] text-theme-muted font-mono">
                                {( (order.setupMinutes + order.standardMinutes) / 60 ).toFixed(1)}h · {order.quantity.toLocaleString('es-MX')} ejs
                              </small>
                            </button>

                            <div className="mt-2 flex items-center justify-between pt-1 border-t border-theme-subtle/60">
                              <StatusBadge status={order.status} />
                              <button
                                type="button"
                                onClick={() => handleOpenReprogram(order)}
                                className="inline-flex items-center text-[10px] font-bold text-theme-primary hover:underline"
                              >
                                Reprogramar <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </ProductionCard>

      {/* Modal de Reprogramación con recálculo dinámico de impacto */}
      {reprogramOrder && (
        <ModalPortal onClose={() => setReprogramOrder(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
              <div>
                <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                  PLANEACIÓN DE PRODUCCIÓN RTM
                </span>
                <h3 className="text-base font-black text-theme-main mt-1">
                  Reprogramar Orden de Producción ({reprogramOrder.folio})
                </h3>
                <p className="text-xs text-theme-muted">
                  {reprogramOrder.cliente} · {reprogramOrder.partNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReprogramOrder(null)}
                className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <label className="block">
                <span className="font-semibold text-theme-muted">Nueva Máquina Asignada</span>
                <select
                  value={targetMachine}
                  onChange={(e) => setTargetMachine(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
                >
                  {PRODUCTION_MACHINES.filter((m) => m.area === reprogramOrder.area).map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.load}% carga semanal · {m.status})
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-semibold text-theme-muted">Nueva Fecha de Entrega Interna</span>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
                  />
                </label>

                <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-2.5">
                  <span className="text-theme-muted">Fecha Requerida Cliente:</span>
                  <b className="mt-1 block text-theme-main">{reprogramOrder.due}</b>
                </div>
              </div>

              <label className="block">
                <span className="font-semibold text-theme-muted">Motivo de Reprogramación</span>
                <input
                  type="text"
                  value={targetReason}
                  onChange={(e) => setTargetReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
                  placeholder="Ej. Nivelación de carga en prensa o mantenimiento preventivo"
                />
              </label>

              {/* Impacto calculado real en horas */}
              <div className="rounded-xl border border-theme-primary/30 bg-theme-primary/5 p-3.5 space-y-1.5 text-[11px]">
                <span className="font-bold text-theme-primary">Impacto Técnico Calculado:</span>
                <p className="text-theme-muted">
                  • Transferencia de orden a <b>{targetMachine}</b>: añade {((reprogramOrder.setupMinutes + reprogramOrder.standardMinutes) / 60).toFixed(1)} horas a la máquina destino.
                </p>
                <p className="text-theme-muted">
                  • Comparación de fecha: Entrega interna {targetDate} vs compromiso cliente {reprogramOrder.due}.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-theme-subtle pt-4">
              <button
                type="button"
                onClick={() => setReprogramOrder(null)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReprogram}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
              >
                <RefreshCw className="h-4 w-4" /> Confirmar Reprogramación
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
