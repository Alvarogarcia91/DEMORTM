import React from 'react';
import {
  X,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { TrafficNodeDetail } from '../../../data/mockProductionDashboardV8';

interface Props {
  node: TrafficNodeDetail;
  onClose: () => void;
  onNavigateToPlanning: (opFolio?: string) => void;
  onOpenOrder: (folio: string) => void;
}

export const PlantTrafficDetailModal: React.FC<Props> = ({
  node,
  onClose,
  onNavigateToPlanning,
  onOpenOrder,
}) => {
  const isDelayed = node.deviationMinutes > 0;

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${
              node.isStopped
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                : isDelayed
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                : 'bg-theme-primary/10 text-theme-primary'
            }`}>
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
                  DETALLE DE TRÁFICO · ETAPA WIP
                </span>
                <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[9px] font-bold text-theme-muted">
                  {node.area}
                </span>
              </div>
              <h2 className="text-lg font-black text-theme-main">{node.stageName}</h2>
              <p className="text-xs text-theme-muted">
                Máquina Activa: <b className="text-theme-main">{node.activeMachine}</b>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-theme-muted hover:text-theme-main hover:bg-theme-muted/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Estatus Operativo Actual */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px]">
              Orden en Ejecución Inmediata:
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
              node.isStopped
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}>
              {node.isStopped ? '🔴 Máquina Detenida' : '● En Proceso'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
            <div>
              <button
                type="button"
                onClick={() => onOpenOrder(node.currentOpFolio)}
                className="font-mono text-base font-black text-theme-primary hover:underline"
              >
                {node.currentOpFolio}
              </button>
              <p className="font-bold text-theme-main text-xs">{node.client}</p>
              <small className="text-theme-muted block">{node.partNumber}</small>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-theme-muted block">Avance de Estación</span>
              <span className="font-mono text-lg font-black text-theme-main">
                {node.progressPercent}%
              </span>
            </div>
          </div>

          {/* Comparativa Tiempos vs Estándar */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="rounded-xl border border-theme-subtle bg-theme-surface p-2">
              <small className="text-[10px] text-theme-muted block">Inicio</small>
              <b className="text-xs text-theme-main">{node.startTime}</b>
            </div>
            <div className="rounded-xl border border-theme-subtle bg-theme-surface p-2">
              <small className="text-[10px] text-theme-muted block">Fin Estimado</small>
              <b className="text-xs text-theme-main">{node.estimatedEndTime}</b>
            </div>
            <div className={`rounded-xl border p-2 ${
              isDelayed
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                : 'border-theme-subtle bg-theme-surface text-theme-main'
            }`}>
              <small className="text-[10px] text-theme-muted block">Desviación Std</small>
              <b className="text-xs">
                {node.deviationMinutes > 0 ? `+${node.deviationMinutes} min` : 'En estándar'}
              </b>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1">
            <span>Tiempo estándar catálogo: <b>{node.standardMinutes} min</b></span>
            <span>Tiempo estimado total: <b>{node.actualEstimatedMinutes} min</b></span>
          </div>
        </div>

        {/* Cola de Trabajo en Espera */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-theme-primary" />
              Cola de Trabajo en Espera ({node.queueOrders.length} OP):
            </span>
            <span className="font-mono text-[11px] font-bold text-theme-muted">
              Capacidad restante hoy: <b className="text-theme-main">{node.remainingCapacityToday}</b>
            </span>
          </div>

          <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden text-xs">
            {node.queueOrders.map((ord, idx) => (
              <div
                key={ord.folio}
                className="flex items-center justify-between p-3 hover:bg-theme-muted/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-theme-muted w-5">
                    #{idx + 1}
                  </span>
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenOrder(ord.folio)}
                      className="font-mono font-bold text-theme-main hover:text-theme-primary hover:underline"
                    >
                      {ord.folio}
                    </button>
                    <small className="block text-theme-muted">{ord.client}</small>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-theme-main">
                    {ord.quantity.toLocaleString('es-MX')} pz
                  </span>
                  <span className={`ml-2 rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                    ord.priority === 'Alta'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-theme-muted/20 text-theme-muted'
                  }`}>
                    {ord.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToPlanning(node.currentOpFolio);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
          >
            <span>Ver en Planeación</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
