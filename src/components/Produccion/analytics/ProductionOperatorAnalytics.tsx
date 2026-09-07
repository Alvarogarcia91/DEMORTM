import React, { useState } from 'react';
import {
  Users,
  PieChart,
  X,
  Info,
  CheckCircle2,
  Clock,
  Wrench,
  Trash2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  OperatorPerformanceItem,
  OperatorTimeDistributionItem,
} from '../../../data/mockProduccionAnaliticaData';

interface ProductionOperatorAnalyticsProps {
  operators: OperatorPerformanceItem[];
  timeDistribution: OperatorTimeDistributionItem[];
  onOpenOrder?: (folio: string) => void;
}

export const ProductionOperatorAnalytics: React.FC<ProductionOperatorAnalyticsProps> = ({
  operators,
  timeDistribution,
  onOpenOrder,
}) => {
  const [selectedOperator, setSelectedOperator] = useState<OperatorPerformanceItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DESEMPEÑO POR OPERADOR */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                  DESEMPEÑO POR OPERADOR &middot; LECTURA CON CONTEXTO
                </h3>
              </div>
              <span className="text-[10px] text-theme-muted font-bold">
                5 Operadores monitoreados
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Métricas ponderadas dentro del mismo proceso. No atribuir variaciones mecánicas al operador sin evaluar herramental.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                  <th className="pb-2">Operador</th>
                  <th className="pb-2">Máquina Asignada</th>
                  <th className="pb-2 text-right">Eficiencia</th>
                  <th className="pb-2 text-right">Scrap</th>
                  <th className="pb-2 text-right">T. Productivo</th>
                  <th className="pb-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle/60">
                {operators.map((op) => (
                  <tr
                    key={op.id}
                    onClick={() => setSelectedOperator(op)}
                    className="hover:bg-theme-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5">
                      <strong className="text-theme-main block font-semibold group-hover:text-theme-primary">
                        {op.name}
                      </strong>
                      <span className="text-[10px] text-theme-muted font-mono">
                        No. {op.employeeNo}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-theme-main block font-medium">{op.primaryMachine}</span>
                      <span className="text-[10px] text-theme-muted">{op.area}</span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-theme-main">
                      {op.efficiencyPercent.toFixed(0)}%
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`font-mono font-bold ${
                          op.scrapPercent > 3.5 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {op.scrapPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-theme-primary">
                      {op.productiveTimePercent.toFixed(0)}%
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOperator(op);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle font-bold text-[11px] text-theme-main transition-colors cursor-pointer"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle flex items-center gap-2 text-[11px] text-theme-muted">
            <Info className="w-4 h-4 text-theme-primary shrink-0" />
            <span>
              <strong>Política RTM de no sanción preventiva: </strong>
              Cualquier desviación en scrap superior al 4% requiere primero auditoría de insumos y herramental antes de abrir acción correctiva a personal.
            </span>
          </div>
        </div>

        {/* DISTRIBUCIÓN DEL TIEMPO DEL OPERADOR */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-theme-primary" />
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                DISTRIBUCIÓN DEL TIEMPO
              </h3>
            </div>
            <p className="text-[11px] text-theme-muted">
              Porcentaje consolidado según Reporte Diario de Operador en planta.
            </p>
          </div>

          {/* Time concepts */}
          <div className="space-y-2.5 pt-1">
            {timeDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-main font-medium">{item.concept}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <strong className="text-theme-main">{item.percentage}%</strong>
                    <span className="text-[10px] text-theme-muted">({item.hours.toFixed(1)}h)</span>
                  </div>
                </div>
                <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.colorClass} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[10px] text-theme-muted">
            <span>Producción neta: 71% del tiempo</span>
            <span className="text-emerald-600 font-bold">Tiempo productivo sano</span>
          </div>
        </div>
      </div>

      {/* OPERATOR DETAIL MODAL / DRAWER */}
      {selectedOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wider">
                  Ficha Analítica de Operador &middot; {selectedOperator.area}
                </span>
                <h3 className="text-lg font-black text-theme-main">
                  {selectedOperator.name}
                </h3>
                <span className="text-xs text-theme-muted">
                  Empleado No. {selectedOperator.employeeNo} &middot; Estación habitual: {selectedOperator.primaryMachine}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOperator(null)}
                className="text-theme-muted hover:text-theme-main p-1 rounded-xl hover:bg-theme-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Turnos</span>
                <strong className="text-base font-mono font-bold text-theme-main">
                  {selectedOperator.shiftsCount}
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">OPs Listas</span>
                <strong className="text-base font-mono font-bold text-emerald-600">
                  {selectedOperator.completedOps}
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Eficiencia</span>
                <strong className="text-base font-mono font-bold text-blue-600">
                  {selectedOperator.efficiencyPercent.toFixed(0)}%
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-center">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Scrap</span>
                <strong
                  className={`text-base font-mono font-bold ${
                    selectedOperator.scrapPercent > 3.5 ? 'text-rose-600' : 'text-theme-main'
                  }`}
                >
                  {selectedOperator.scrapPercent.toFixed(1)}%
                </strong>
              </div>
            </div>

            {/* Secondary KPIs */}
            <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-theme-muted">Variación Setup vs Estándar:</span>
                <strong className="font-mono text-theme-main">
                  {selectedOperator.setupVsStdMinutes > 0
                    ? `+${selectedOperator.setupVsStdMinutes} min arriba`
                    : `${selectedOperator.setupVsStdMinutes} min ahorro`}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-theme-muted">Paros de máquina reportados:</span>
                <strong className="font-mono text-theme-main">
                  {selectedOperator.reportedStopsCount} eventos en el periodo
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-theme-muted">Porcentaje productivo de turno:</span>
                <strong className="font-mono text-theme-primary">
                  {selectedOperator.productiveTimePercent.toFixed(0)}%
                </strong>
              </div>
            </div>

            {/* Context Note */}
            <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-1 text-xs">
              <span className="font-bold text-purple-700 dark:text-purple-300 block">
                Contexto operativo registrado:
              </span>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                {selectedOperator.contextNotes}
              </p>
            </div>

            {/* Close action */}
            <div className="pt-3 border-t border-theme-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOperator(null)}
                className="px-4 py-2 rounded-xl bg-theme-main text-white font-bold text-xs hover:opacity-90 cursor-pointer"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
