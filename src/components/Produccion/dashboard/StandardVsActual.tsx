import React from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Wrench,
  Info,
} from 'lucide-react';
import { STANDARD_VS_ACTUAL_METRICS_V8 } from '../../../data/mockProductionDashboardV8';

interface Props {
  onAnalyze4M: (metricName: string) => void;
}

export const StandardVsActual: React.FC<Props> = ({ onAnalyze4M }) => {
  const metrics = STANDARD_VS_ACTUAL_METRICS_V8;

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-main">
              Desempeño Operativo Contra Estándar de Catálogo
            </h3>
            <p className="text-xs text-theme-muted">
              Velocidades mecánicas y tiempos de setup/corrida auditados en piso.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-theme-muted/10 border border-theme-subtle px-2.5 py-0.5 text-[10px] font-mono text-theme-muted">
          Estándares de recetas V6
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
        <table className="w-full text-xs">
          <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3 text-left">Máquina / Proceso</th>
              <th className="p-3 text-left">Área</th>
              <th className="p-3 text-left">Operación</th>
              <th className="p-3 text-right">Estándar Catálogo</th>
              <th className="p-3 text-right">Velocidad / Tiempo Real</th>
              <th className="p-3 text-right">Eficiencia</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {metrics.map((item) => {
              const isLow = item.efficiencyPercent < 90;
              const isSuper = item.efficiencyPercent >= 100;

              return (
                <tr key={item.id} className="hover:bg-theme-muted/10 transition-colors">
                  <td className="p-3 font-bold text-theme-main">
                    {item.machineOrProcess}
                  </td>
                  <td className="p-3 text-theme-muted text-[11px]">
                    {item.area}
                  </td>
                  <td className="p-3 text-theme-main text-[11px]">
                    {item.operationName}
                  </td>
                  <td className="p-3 text-right font-mono text-theme-muted">
                    {item.standardSpeed}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-theme-main">
                    {item.actualSpeed}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono font-black ${
                        isLow
                          ? 'text-amber-600 dark:text-amber-400'
                          : isSuper
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-theme-main'
                      }`}
                    >
                      {item.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                      {item.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                      {item.trend === 'stable' && <Minus className="h-3 w-3" />}
                      {item.efficiencyPercent}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {isLow ? (
                      <button
                        type="button"
                        onClick={() => onAnalyze4M(item.machineOrProcess)}
                        className="rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-1 text-[10px] font-bold hover:bg-amber-200 transition-colors"
                      >
                        [Analizar 4M]
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ En estándar
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-theme-muted pt-1">
        <span className="flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-theme-muted" />
          Eficiencia = Salida Real / Salida Estándar · Desviación = Tiempo Real - Tiempo Estándar
        </span>
        <span className="text-[10px] font-mono text-theme-muted">
          Datos auditables por Calidad e Ingeniería
        </span>
      </div>
    </div>
  );
};
