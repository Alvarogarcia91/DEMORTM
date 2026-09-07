import React from 'react';
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  DELIVERY_RISK_ORDERS_V8,
  DeliveryRiskItem,
} from '../../../data/mockProductionDashboardV8';

interface Props {
  onOpenOrder: (opFolio: string) => void;
  onReprogramOrder: (opFolio: string) => void;
}

export const DeliveryRisk: React.FC<Props> = ({
  onOpenOrder,
  onReprogramOrder,
}) => {
  const items = DELIVERY_RISK_ORDERS_V8;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">Riesgo de Entrega de Pedidos</h3>
            <p className="text-xs text-theme-muted">
              Fechas cliente comprometidas vs estimación actual de planta.
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] font-bold text-amber-600">
          {items.filter((i) => i.riskLevel === 'Crítico' || i.riskLevel === 'Alto').length} Críticas
        </span>
      </div>

      <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden text-xs">
        {items.map((item) => {
          const isCrit = item.riskLevel === 'Crítico';
          const isHigh = item.riskLevel === 'Alto';
          const isMed = item.riskLevel === 'Medio';

          return (
            <div key={item.id} className="p-3.5 space-y-2 hover:bg-theme-muted/10 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenOrder(item.opFolio)}
                      className="font-mono font-black text-theme-primary hover:underline text-xs"
                    >
                      {item.opFolio}
                    </button>
                    <span className="text-theme-muted text-xs">·</span>
                    <span className="font-bold text-theme-main text-xs">{item.client}</span>
                    <span className="rounded-md bg-theme-muted/20 px-1.5 py-0.2 text-[10px] font-bold text-theme-muted">
                      {item.area}
                    </span>
                  </div>
                  <small className="block text-theme-muted font-mono text-[10px] mt-0.5">
                    {item.partNumber} · {item.machine}
                  </small>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      isCrit
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : isMed
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    Riesgo {item.riskLevel}
                  </span>
                </div>
              </div>

              {/* Tiempos de Entrega */}
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-theme-subtle bg-theme-muted/10 p-2 text-center font-mono text-[11px]">
                <div>
                  <small className="text-[9px] text-theme-muted uppercase block font-bold">Fecha RTM</small>
                  <b className="text-theme-main">{item.rtmDueDate}</b>
                </div>
                <div>
                  <small className="text-[9px] text-theme-muted uppercase block font-bold">Fecha Cliente</small>
                  <b className="text-theme-main">{item.clientDueDate}</b>
                </div>
                <div className={isCrit || isHigh ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-theme-main'}>
                  <small className="text-[9px] text-theme-muted uppercase block font-bold">Estimada</small>
                  <b>{item.estimatedDeliveryDate}</b>
                </div>
              </div>

              {/* Causa y Acciones */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <p className="text-theme-muted">
                  <b className="text-theme-main">Causa:</b> {item.cause}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onReprogramOrder(item.opFolio)}
                    className="rounded-lg border border-theme-subtle px-2.5 py-1 font-bold text-theme-main hover:bg-theme-muted/30 text-[11px]"
                  >
                    Reprogramar
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenOrder(item.opFolio)}
                    className="rounded-lg bg-theme-primary px-2.5 py-1 font-bold text-white shadow-2xs hover:bg-theme-primary/90 text-[11px]"
                  >
                    Abrir OP
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
