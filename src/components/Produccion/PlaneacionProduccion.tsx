import React, { useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronRight, Clock, RefreshCw, X } from 'lucide-react';
import { PRODUCTION_MACHINES, ProductionArea, ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, StatusBadge } from './productionUi';
import { ModalPortal } from '../common/ModalPortal';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onMoveOrder: (order: ProductionOrder, newMachine?: string, newDate?: string, reason?: string) => void;
}

export const PlaneacionProduccion: React.FC<Props> = ({ orders, onOpenOrder, onMoveOrder }) => {
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

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
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
            Semana 37 · Matriz de Carga de Máquinas, Setup y Disponibilidad RTM
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-theme-muted">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-rose-400 bg-rose-50" /> Borde rojo = Insumo/suaje pendiente
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-theme-primary/40 bg-theme-primary/10" /> Azul = Programada Ok
          </span>
        </div>
      </div>

      {/* Matriz Gantt / Semanal de Carga */}
      <ProductionCard>
        <div className="overflow-x-auto">
          <div className="min-w-[1080px]">
            <div className="grid grid-cols-[240px_repeat(5,1fr)] border-b border-theme-subtle text-[10px] font-bold uppercase text-theme-muted">
              <span className="p-3">Máquina / Capacidad Semanal</span>
              {days.map((day) => (
                <span className="p-3 text-center" key={day}>
                  {day}
                </span>
              ))}
            </div>

            {machines.map((machine, row) => {
              const machineOrders = orders.filter((order) => order.machine === machine.name);
              const order = machineOrders[0];

              return (
                <div
                  className="grid grid-cols-[240px_repeat(5,1fr)] border-b border-theme-subtle text-xs hover:bg-theme-muted/10 transition-colors"
                  key={machine.id}
                >
                  <span className="p-3">
                    <b className="text-theme-main text-xs">{machine.name}</b>
                    <small className="mt-1 block text-theme-muted">
                      {machine.area} · <span className={machine.load > 90 ? 'text-rose-600 font-bold' : ''}>{machine.load}% carga</span> · {machine.status}
                    </small>
                  </span>

                  {days.map((day, column) => (
                    <div className="min-h-24 border-l border-theme-subtle p-2" key={day}>
                      {order && column === row % days.length && (
                        <div
                          className={`rounded-xl border p-2.5 transition-all shadow-2xs ${
                            order.materialAlert
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
                              <b className="font-mono text-[11px] text-theme-main">{order.folio}</b>
                              <span className="text-[10px] text-theme-muted font-mono">{order.due}</span>
                            </div>
                            <small className="mt-1 block font-bold text-theme-main truncate">
                              {order.cliente}
                            </small>
                            <small className="block text-[10px] text-theme-muted">
                              {order.partNumber} · {order.quantity.toLocaleString('es-MX')} ejs
                            </small>
                          </button>

                          <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-theme-subtle/60">
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
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </ProductionCard>

      {/* Modal de Reprogramación (Sección 14 del doc) */}
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

              {/* Impacto en carga y fecha estimada */}
              <div className="rounded-xl border border-theme-primary/30 bg-theme-primary/5 p-3.5 space-y-1.5 text-[11px]">
                <span className="font-bold text-theme-primary">Impacto Técnico Estimado:</span>
                <p className="text-theme-muted">
                  • Carga semanal de <b>{targetMachine}</b>: se mantendrá dentro del rango operativo (&lt; 85%).
                </p>
                <p className="text-theme-muted">
                  • Riesgo de entrega con fecha {targetDate}: <b>Bajo</b> (cumple antes de fecha cliente {reprogramOrder.due}).
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
