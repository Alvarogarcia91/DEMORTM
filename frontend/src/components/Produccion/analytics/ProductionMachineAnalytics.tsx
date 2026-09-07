import React from 'react';
import {
  Clock,
  Gauge,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
} from 'lucide-react';
import {
  MachineProductiveHours,
  MachineEfficiencyItem,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionMachineAnalyticsProps {
  topMachines: MachineProductiveHours[];
  efficiencyList: MachineEfficiencyItem[];
  onSelectMachine: (machineName: string) => void;
}

export const ProductionMachineAnalytics: React.FC<ProductionMachineAnalyticsProps> = ({
  topMachines,
  efficiencyList,
  onSelectMachine,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. TOP 5 MÁQUINAS · HORAS PRODUCTIVAS */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-theme-primary" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                TOP 5 MÁQUINAS &middot; HORAS PRODUCTIVAS
              </h3>
            </div>
            <span className="text-[10px] text-theme-muted font-bold font-mono">
              Base: 192h mensuales
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Ranking de estaciones por tiempo efectivo de tiraje continuo.
          </p>
        </div>

        {/* Machine Hours List */}
        <div className="space-y-3 pt-1">
          {topMachines.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => onSelectMachine(m.machineName)}
              className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/60 border border-theme-subtle transition-all cursor-pointer space-y-1.5 text-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-theme-surface border border-theme-subtle flex items-center justify-center font-bold text-[10px] text-theme-muted group-hover:border-theme-primary group-hover:text-theme-primary">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-theme-main block font-semibold">{m.machineName}</strong>
                    <span className="text-[10px] text-theme-muted">{m.area}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-theme-primary text-sm">
                    {m.productiveHours.toFixed(1)} h
                  </span>
                  <span className="text-[10px] text-theme-muted block">
                    {m.utilizationPercent.toFixed(1)}% carga
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                <div
                  className="bg-theme-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${m.utilizationPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guidance Note */}
        <div className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle flex items-center gap-2 text-[11px] text-theme-muted">
          <Info className="w-4 h-4 text-theme-primary shrink-0" />
          <span>
            <strong className="text-theme-main font-semibold">Criterio RTM: </strong>
            Una máquina más usada no necesariamente es más eficiente. Cruzar siempre horas productivas con paros y velocidad real.
          </span>
        </div>
      </div>

      {/* 2. EFICIENCIA POR MÁQUINA (ESTÁNDAR VS REAL) */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                EFICIENCIA POR MÁQUINA &middot; ESTÁNDAR VS REAL
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Demo configurable
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Comparativa de velocidad nominal vs velocidad promedio alcanzada en piso.
          </p>
        </div>

        {/* Efficiency Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                <th className="pb-2">Máquina</th>
                <th className="pb-2 text-right">Estándar</th>
                <th className="pb-2 text-right">Real</th>
                <th className="pb-2 text-right">Eficiencia</th>
                <th className="pb-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle/60">
              {efficiencyList.map((item) => {
                const isHealthy = item.efficiencyPercent >= 95;
                const isWarning = item.efficiencyPercent >= 85 && item.efficiencyPercent < 95;
                const isCritical = item.efficiencyPercent < 85;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectMachine(item.machineName)}
                    className="hover:bg-theme-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5">
                      <strong className="text-theme-main block font-semibold group-hover:text-theme-primary">
                        {item.machineName}
                      </strong>
                      <span className="text-[10px] text-theme-muted">{item.area}</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-theme-muted text-[11px]">
                      {item.standardSpeed}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-theme-main text-[11px]">
                      {item.realSpeed}
                    </td>
                    <td className="py-2.5 text-right font-mono font-black text-sm">
                      <span
                        className={
                          isHealthy
                            ? 'text-emerald-600'
                            : isWarning
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {item.efficiencyPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHealthy
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : isWarning
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {isHealthy && <CheckCircle2 className="w-3 h-3" />}
                        {isWarning && <AlertTriangle className="w-3 h-3" />}
                        {isCritical && <AlertTriangle className="w-3 h-3" />}
                        <span>
                          {isHealthy ? 'Saludable' : isWarning ? 'Atención' : 'Crítico'}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend / Semaphores */}
        <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[10px] text-theme-muted flex-wrap gap-2">
          <span>Semáforo: &ge;95% Saludable &middot; 85-94% Atención &middot; &lt;85% Crítico</span>
          <span className="font-semibold text-theme-primary">Clic en fila para filtrar</span>
        </div>
      </div>
    </div>
  );
};
