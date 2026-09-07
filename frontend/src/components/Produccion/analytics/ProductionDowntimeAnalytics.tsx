import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  Wrench,
  ChevronRight,
  X,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  MachineDowntimeSummary,
  DowntimeCauseItem,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionDowntimeAnalyticsProps {
  machineDowntime: MachineDowntimeSummary[];
  downtimeCauses: DowntimeCauseItem[];
  onOpenOrder?: (folio: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const ProductionDowntimeAnalytics: React.FC<ProductionDowntimeAnalyticsProps> = ({
  machineDowntime,
  downtimeCauses,
  onOpenOrder,
  onNavigateTab,
}) => {
  const [selectedMachineDetail, setSelectedMachineDetail] = useState<MachineDowntimeSummary | null>(null);

  const totalLostMinutes = machineDowntime.reduce((acc, curr) => acc + curr.totalDowntimeMinutes, 0);

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Paros por Máquina & Causas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PAROS POR MÁQUINA */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  TIEMPO DE PARO POR MÁQUINA
                </h3>
              </div>
              <span className="font-mono text-[11px] font-bold text-rose-600">
                {totalLostMinutes} min acumulados
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Minutos no productivos registrados por paros operativos o mecánicos.
            </p>
          </div>

          {/* Machine Downtime Bars */}
          <div className="space-y-3 pt-1">
            {machineDowntime.map((item) => {
              const maxMin = Math.max(...machineDowntime.map((m) => m.totalDowntimeMinutes));
              const percent = (item.totalDowntimeMinutes / maxMin) * 100;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMachineDetail(item)}
                  className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/60 border border-theme-subtle transition-all cursor-pointer space-y-1.5 text-xs group"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-theme-main group-hover:text-theme-primary transition-colors">
                        {item.machineName}
                      </span>
                      <span className="text-[10px] text-theme-muted">({item.stopsCount} paros)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-600">
                        {item.totalDowntimeMinutes} min
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-main transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-theme-muted">
                    <span>Promedio: {item.avgDurationMinutes.toFixed(1)} min/paro</span>
                    <span className="text-theme-primary font-medium">Ver desglose &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-theme-muted italic">
            * Haz clic en cualquier estación para abrir el desglose de causas y órdenes afectadas.
          </p>
        </div>

        {/* PRINCIPALES CAUSAS DE PARO */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  PRINCIPALES CAUSAS DE PARO
                </h3>
              </div>
              <span className="text-[10px] text-theme-muted font-bold">
                Codificación 4M / 100-400
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Ranking de motivos que más tiempo restaron a la operación en el periodo.
            </p>
          </div>

          {/* Causes List */}
          <div className="space-y-2.5 pt-1">
            {downtimeCauses.map((c, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-theme-surface border border-theme-subtle text-[10px] font-mono font-bold flex items-center justify-center text-theme-muted">
                    {c.code}
                  </span>
                  <div>
                    <span className="text-theme-main font-semibold block">{c.cause}</span>
                    <span className="text-[9px] text-theme-muted uppercase font-bold">
                      4M {c.category4M}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-theme-main text-xs block">
                    {c.minutes} min
                  </span>
                  <span className="text-[10px] text-theme-muted font-mono">
                    {c.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              Ajuste de registro y Material representan más del 48% del tiempo muerto total.
            </span>
          </div>
        </div>
      </div>

      {/* TABLA DE DURACIÓN PROMEDIO POR PARO */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              DURACIÓN PROMEDIO POR PARO &middot; BENCHMARK POR ESTACIÓN
            </h3>
            <p className="text-[11px] text-theme-muted">
              Frecuencia y tiempo medio por interrupción de ciclo productivo.
            </p>
          </div>
          <span className="text-[10px] text-theme-muted font-bold font-mono">
            * No llamar MTTR globalmente (solo aplica a fallas mecánicas).
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                <th className="pb-2">Máquina</th>
                <th className="pb-2">Área</th>
                <th className="pb-2 text-center">No. Paros</th>
                <th className="pb-2 text-right">Promedio / Paro</th>
                <th className="pb-2 text-right">Tiempo Total</th>
                <th className="pb-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle/60">
              {machineDowntime.map((item) => (
                <tr key={item.id} className="hover:bg-theme-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-theme-main">{item.machineName}</td>
                  <td className="py-2.5 text-theme-muted text-[11px]">{item.area}</td>
                  <td className="py-2.5 text-center font-mono font-bold text-theme-main">
                    {item.stopsCount}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-amber-600">
                    {item.avgDurationMinutes.toFixed(1)} min
                  </td>
                  <td className="py-2.5 text-right font-mono font-black text-rose-600">
                    {item.totalDowntimeMinutes} min
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedMachineDetail(item)}
                      className="px-2.5 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle font-bold text-[11px] text-theme-main transition-colors cursor-pointer"
                    >
                      Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRILL-DOWN MODAL: DETALLE DE PAROS POR MÁQUINA */}
      {selectedMachineDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Detalle de Paros &middot; {selectedMachineDetail.area}
                </span>
                <h3 className="text-lg font-black text-theme-main">
                  {selectedMachineDetail.machineName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMachineDetail(null)}
                className="text-theme-muted hover:text-theme-main p-1 rounded-xl hover:bg-theme-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Minutos</span>
                <strong className="text-base font-mono font-black text-rose-600">
                  {selectedMachineDetail.totalDowntimeMinutes}m
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Eventos</span>
                <strong className="text-base font-mono font-black text-theme-main">
                  {selectedMachineDetail.stopsCount}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Promedio</span>
                <strong className="text-base font-mono font-black text-amber-600">
                  {selectedMachineDetail.avgDurationMinutes.toFixed(1)}m
                </strong>
              </div>
            </div>

            {/* Causes Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider">
                Principales Motivos Registrados
              </h4>
              <div className="space-y-1.5">
                {selectedMachineDetail.mainCauses.map((mc, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-theme-main font-semibold block">{mc.cause}</span>
                      <span className="text-[9px] text-theme-muted uppercase font-bold">
                        4M {mc.category4M}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-theme-main">{mc.minutes} min</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected OPs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider">
                Órdenes de Producción Afectadas
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedMachineDetail.affectedOps.map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => {
                      setSelectedMachineDetail(null);
                      if (onOpenOrder) onOpenOrder(op);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-mono font-bold text-xs border border-theme-primary/20 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{op}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-theme-subtle flex items-center justify-end gap-2">
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMachineDetail(null);
                    onNavigateTab('Máquinas');
                  }}
                  className="px-4 py-2 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 cursor-pointer"
                >
                  Ir a pestaña Máquinas
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedMachineDetail(null)}
                className="px-4 py-2 rounded-xl border border-theme-subtle font-bold text-xs text-theme-muted hover:text-theme-main cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
