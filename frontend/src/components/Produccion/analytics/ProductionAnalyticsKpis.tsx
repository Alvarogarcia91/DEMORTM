import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Gauge,
  Trash2,
  Clock,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { GlobalAnalyticsKpis } from '../../../data/mockProduccionAnaliticaData';

interface ProductionAnalyticsKpisProps {
  kpis: GlobalAnalyticsKpis;
  comparePrevious: boolean;
}

export const ProductionAnalyticsKpis: React.FC<ProductionAnalyticsKpisProps> = ({
  kpis,
  comparePrevious,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Cumplimiento del Plan */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Cumplimiento Plan
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-theme-primary" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block mt-1">
            {kpis.planCompliance.toFixed(1)}%
          </strong>
        </div>
        {comparePrevious ? (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{kpis.planComplianceDelta.toFixed(1)} pts vs ant.</span>
          </span>
        ) : (
          <span className="text-[10px] text-theme-muted">Meta mensual: 90%</span>
        )}
      </div>

      {/* 2. Eficiencia Productiva */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Eficiencia Prod.
            </span>
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-blue-600 block mt-1">
            {kpis.productiveEfficiency.toFixed(1)}%
          </strong>
        </div>
        {comparePrevious ? (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{kpis.productiveEfficiencyDelta.toFixed(1)} pts</span>
          </span>
        ) : (
          <span className="text-[10px] text-theme-muted">Output real / estándar</span>
        )}
      </div>

      {/* 3. Scrap / Merma */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Scrap / Merma
            </span>
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block mt-1">
            {kpis.scrapRate.toFixed(1)}%
          </strong>
        </div>
        {comparePrevious ? (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            <span>{kpis.scrapRateDelta.toFixed(1)} pts &middot; Meta &le;5%</span>
          </span>
        ) : (
          <span className="text-[10px] text-emerald-600 font-bold">Objetivo &le;{kpis.scrapTarget}% (Saludable)</span>
        )}
      </div>

      {/* 4. Tiempo Perdido */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Tiempo Perdido
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-amber-600 block mt-1">
            {kpis.lostTimeFormatted}
          </strong>
        </div>
        {comparePrevious ? (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            <span>{kpis.lostTimeDeltaFormatted} &middot; {kpis.lostTimeIncidents} paros</span>
          </span>
        ) : (
          <span className="text-[10px] text-theme-muted">{kpis.lostTimeIncidents} incidencias en piso</span>
        )}
      </div>

      {/* 5. OP a Tiempo */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              OP a Tiempo
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block mt-1">
            {kpis.onTimeOpsRate.toFixed(0)}%
          </strong>
        </div>
        <span className="text-[10px] text-theme-muted">
          {kpis.onTimeOpsCount} de {kpis.totalOpsCount} órdenes ({comparePrevious ? `+${kpis.onTimeOpsDelta} pts` : 'Cumplidas'})
        </span>
      </div>

      {/* 6. Setup vs Estándar */}
      <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
              Setup vs Estándar
            </span>
            <Wrench className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-purple-600 block mt-1">
            +{kpis.setupVariationRate.toFixed(1)}%
          </strong>
        </div>
        <span className="text-[10px] text-amber-600 font-medium">
          +{kpis.setupAvgMinutesOver} min prom. arriba
        </span>
      </div>
    </div>
  );
};
