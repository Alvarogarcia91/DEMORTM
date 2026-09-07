import React from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ClientCapacityItem,
  DeliveryComplianceSummary,
  DelayedOpItem,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionDeliveryAnalyticsProps {
  clientCapacity: ClientCapacityItem[];
  deliveryCompliance: DeliveryComplianceSummary;
  topDelayedOps: DelayedOpItem[];
  onOpenOrder?: (folio: string) => void;
}

export const ProductionDeliveryAnalytics: React.FC<ProductionDeliveryAnalyticsProps> = ({
  clientCapacity,
  deliveryCompliance,
  topDelayedOps,
  onOpenOrder,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. HORAS DE PLANTA CONSUMIDAS POR CLIENTE */}
      <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-theme-primary" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                CAPACIDAD CONSUMIDA POR CLIENTE
              </h3>
            </div>
            <span className="text-[10px] text-theme-muted font-bold font-mono">
              Total: 509 h planta
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Horas efectivas de máquina y volumen de manufactura asignado a cada cuenta.
          </p>
        </div>

        {/* Client Rows */}
        <div className="space-y-3 pt-1">
          {clientCapacity.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-theme-main block font-semibold">{item.client}</strong>
                  <span className="text-[10px] text-theme-muted font-mono">
                    {item.producedVolume.toLocaleString('es-MX')} unidades &middot; {item.opsCount} órdenes
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-theme-primary text-sm">
                    {item.plantHours.toFixed(1)} h
                  </span>
                  <span className="text-[10px] text-theme-muted block font-mono">
                    {item.percentOfTotalCapacity.toFixed(1)}% capacidad
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                <div
                  className="bg-theme-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.percentOfTotalCapacity * 3}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle text-[11px] text-theme-muted flex items-center justify-between">
          <span>Cuenta principal: Black & Decker</span>
          <strong className="text-theme-main font-mono text-xs">28.5% de planta</strong>
        </div>
      </div>

      {/* 2. LEAD TIME / CUMPLIMIENTO DE ENTREGA */}
      <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                CUMPLIMIENTO DE ENTREGA &middot; LEAD TIME
              </h3>
            </div>
            <span className="font-mono text-sm font-black text-emerald-600">
              {deliveryCompliance.onTimePercent.toFixed(0)}% a tiempo
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Distribución de cumplimiento de fecha prometida al cliente y órdenes con desviación.
          </p>
        </div>

        {/* 4 Buckets Pills */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
              A tiempo
            </span>
            <strong className="text-base font-mono font-black text-emerald-700 dark:text-emerald-300">
              {deliveryCompliance.onTimeOpsCount} OP
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
              1 día tarde
            </span>
            <strong className="text-base font-mono font-black text-amber-700 dark:text-amber-300">
              {deliveryCompliance.oneDayLateCount} OP
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[9px] uppercase font-bold text-rose-700 dark:text-rose-400 block">
              2-3 d tarde
            </span>
            <strong className="text-base font-mono font-black text-rose-700 dark:text-rose-300">
              {deliveryCompliance.twoToThreeDaysLateCount} OP
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle">
            <span className="text-[9px] uppercase font-bold text-theme-muted block">
              &gt;3 d tarde
            </span>
            <strong className="text-base font-mono font-black text-theme-muted">
              {deliveryCompliance.moreThanThreeDaysLateCount} OP
            </strong>
          </div>
        </div>

        {/* Top Delayed OPs breakdown */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider">
            Detalle de Órdenes Fuera de Compromiso
          </h4>

          {topDelayedOps.map((op) => (
            <div
              key={op.opFolio}
              className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-theme-primary">{op.opFolio}</span>
                    <span className="text-theme-muted">&middot;</span>
                    <span className="font-semibold text-theme-main">{op.client}</span>
                  </div>
                  <span className="text-[10px] text-theme-muted font-mono">
                    Compromiso: {op.promisedDate} | Real: {op.actualDate}
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400">
                    +{op.deviationDays} días tarde
                  </span>
                </div>
              </div>

              {/* Causes list */}
              <div className="bg-theme-surface p-2 rounded-xl border border-theme-subtle space-y-1">
                <span className="text-[10px] font-bold text-theme-muted uppercase block">
                  Causas registradas:
                </span>
                {op.causes.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-theme-main">&bull; {c.description}</span>
                    <span className="text-theme-muted font-mono">{c.impact}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenOrder) onOpenOrder(op.opFolio);
                  }}
                  className="text-theme-primary hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Abrir trazabilidad de OP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
