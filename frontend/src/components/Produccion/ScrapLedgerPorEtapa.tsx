import React from 'react';
import { AlertTriangle, CheckCircle2, Flame, Layers, Info, Sparkles, Scale, Scissors, Printer, Sliders } from 'lucide-react';
import { ProductionOrder, RoutingStep } from '../../data/mockProduccionData';

interface ScrapLedgerPorEtapaProps {
  order: ProductionOrder;
}

export const ScrapLedgerPorEtapa: React.FC<ScrapLedgerPorEtapaProps> = ({ order }) => {
  const isFlexo = order.area === 'Flexografía';
  const isOffset = order.area === 'Offset';

  // Routing steps de la orden
  const steps: RoutingStep[] = order.routing && order.routing.length > 0
    ? order.routing
    : isOffset
    ? [
        { stepNumber: 1, process: 'Impresión Offset', machine: 'Heidelberg Speedmaster', setupMinutes: 40, runMinutes: 160, status: 'Completada', requiresFirstPieceQuality: true, scrapQuantity: 240, scrapUom: 'pliegos', scrapPercentContribution: 1.80 },
        { stepNumber: 2, process: 'Guillotina Polar', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 45, status: 'Completada', requiresFirstPieceQuality: false, scrapQuantity: 42, scrapUom: 'pliegos', scrapPercentContribution: 0.31 },
        { stepNumber: 3, process: 'Doblado Stahl', machine: 'Stahl 2', setupMinutes: 25, runMinutes: 60, status: 'Completada', requiresFirstPieceQuality: false, scrapQuantity: 95, scrapUom: 'piezas', scrapPercentContribution: 0.71 },
        { stepNumber: 4, process: 'Intercalado y Alzado', machine: 'Muller Martini', setupMinutes: 20, runMinutes: 50, status: 'Completada', requiresFirstPieceQuality: false, scrapQuantity: 28, scrapUom: 'piezas', scrapPercentContribution: 0.21 },
        { stepNumber: 5, process: 'Grapado al Lomo', machine: 'Muller Martini', setupMinutes: 25, runMinutes: 60, status: 'Completada', requiresFirstPieceQuality: true, scrapQuantity: 54, scrapUom: 'piezas', scrapPercentContribution: 0.40 },
      ]
    : [
        { stepNumber: 1, process: 'Arranque / Setup Flexo', machine: 'Mark Andy Scout 10"', setupMinutes: 30, runMinutes: 40, status: 'Completada', requiresFirstPieceQuality: true, scrapQuantity: 85, scrapUom: 'm', scrapPercentContribution: 0.72 },
        { stepNumber: 2, process: 'Corrida de Impresión & Troquel', machine: 'Mark Andy Scout 10"', setupMinutes: 0, runMinutes: 120, status: 'En proceso', requiresFirstPieceQuality: true, scrapQuantity: 190, scrapUom: 'm', scrapPercentContribution: 1.61 },
        { stepNumber: 3, process: 'Ajuste de Registro en Prensa', machine: 'Mark Andy Scout 10"', setupMinutes: 15, runMinutes: 20, status: 'Completada', requiresFirstPieceQuality: false, scrapQuantity: 120, scrapUom: 'm', scrapPercentContribution: 1.02 },
        { stepNumber: 4, process: 'Rebobinado e Inspección', machine: 'Rotoflex I', setupMinutes: 15, runMinutes: 60, status: 'Pendiente', requiresFirstPieceQuality: false, scrapQuantity: 46, scrapUom: 'm', scrapPercentContribution: 0.39 },
      ];

  // Cálculo de scrap acumulado normalizado demo
  const totalScrapContribution = parseFloat(
    steps.reduce((acc, step) => acc + (step.scrapPercentContribution || 0), 0).toFixed(2)
  );
  const scrapLimit = 5.0;
  const remainingMargin = parseFloat((scrapLimit - totalScrapContribution).toFixed(2));
  const isExceeded = totalScrapContribution > scrapLimit;
  const isNearLimit = totalScrapContribution >= 4.0 && !isExceeded;

  return (
    <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
      {/* Header del Ledger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-theme-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
              Ledger Operativo de Merma &bull; Producción v12
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
              UOM Contextual
            </span>
          </div>
          <h3 className="text-sm font-black text-theme-main uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-theme-primary" />
            <span>Scrap Acumulado por Operación ({order.folio})</span>
          </h3>
        </div>

        {/* Resumen del Límite 5% */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right">
            <span className="text-[10px] text-theme-muted uppercase font-bold block">Scrap Acumulado OP</span>
            <span className={`font-mono text-lg font-black ${
              isExceeded ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {totalScrapContribution}%
            </span>
          </div>

          <div className="h-8 w-px bg-theme-subtle" />

          <div className="text-left">
            <span className="text-[10px] text-theme-muted uppercase font-bold block">Límite Permitido</span>
            <span className="font-mono text-xs font-bold text-theme-main block">
              {scrapLimit.toFixed(2)}%
            </span>
            <span className={`text-[10px] font-bold ${
              isExceeded ? 'text-rose-600' : remainingMargin < 1.0 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {isExceeded ? `Excedido +${Math.abs(remainingMargin)} pts` : `${remainingMargin} pts margen`}
            </span>
          </div>
        </div>
      </div>

      {/* Barra Visual de Consumo del Margen de Merma (0 a 5%) */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-theme-muted font-bold">Consumo del margen de merma presupuestado:</span>
          <span className="font-mono font-bold text-theme-main">
            {totalScrapContribution}% de {scrapLimit}% máximo
          </span>
        </div>

        <div className="w-full bg-theme-muted rounded-full h-3 overflow-hidden flex">
          {steps.map((st, idx) => {
            const pct = st.scrapPercentContribution || 0;
            const widthPct = (pct / scrapLimit) * 100;
            const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
            return (
              <div
                key={idx}
                className={`${colors[idx % colors.length]} h-3 transition-all`}
                style={{ width: `${Math.min(100, widthPct)}%` }}
                title={`${st.process}: ${pct}% aporte`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono pt-0.5">
          <span>0.0% (Inicio)</span>
          <span className="text-amber-600 font-bold">4.0% (Precaución)</span>
          <span className="text-rose-600 font-black">5.0% (Límite Máximo)</span>
        </div>
      </div>

      {/* Alerta si supera 5.0% */}
      {isExceeded && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 flex items-start gap-2.5 text-xs">
          <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <b className="font-bold block">Scrap Fuera de Estándar ({totalScrapContribution}%)</b>
            <span className="text-[11px] text-theme-muted">
              Esta orden ha superado el límite demo del 5.0%. Las mermas subsecuentes requieren autorización expresa del supervisor de turno.
            </span>
          </div>
        </div>
      )}

      {/* Tabla del Ledger por Etapa */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-theme-muted/30 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Paso</th>
              <th className="py-2.5 px-3">Operación / Proceso</th>
              <th className="py-2.5 px-3">Máquina Asignada</th>
              <th className="py-2.5 px-3 text-right">Cantidad Física</th>
              <th className="py-2.5 px-2 text-center">UOM</th>
              <th className="py-2.5 px-3 text-right">% Contribución</th>
              <th className="py-2.5 px-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {steps.map((step, idx) => (
              <tr key={idx} className="hover:bg-theme-muted/20 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-theme-muted">
                  #{step.stepNumber || idx + 1}
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-bold text-theme-main block">{step.process}</span>
                  {step.subOperations && step.subOperations.length > 0 && (
                    <span className="text-[10px] text-theme-muted block line-clamp-1">
                      {step.subOperations.join(' · ')}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-theme-muted font-medium">
                  {step.machine}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                  {step.scrapQuantity !== undefined ? step.scrapQuantity.toLocaleString() : '—'}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-theme-muted text-theme-main border border-theme-subtle">
                    {step.scrapUom || (isOffset ? 'pliegos' : 'm')}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-theme-main">
                  {step.scrapPercentContribution !== undefined ? `+${step.scrapPercentContribution}%` : '—'}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    step.status === 'Completada'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : step.status === 'En proceso'
                      ? 'bg-blue-500/10 text-blue-600'
                      : 'bg-zinc-500/10 text-zinc-600'
                  }`}>
                    {step.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalle Específico Flexo (Setup vs Corrida vs Ajuste vs Rebobinado) */}
      {isFlexo && (
        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold uppercase text-[11px]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Desglose por Fase Flexográfica (P0 Metros / Kg)</span>
            </div>
            <span className="text-[10px] font-mono text-theme-muted">
              Sustrato: BOPP Blanco &bull; Lote: PPBC-260721
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
              <span className="text-[10px] text-theme-muted uppercase font-bold block">1. Arranque</span>
              <strong className="font-mono font-black text-theme-main block">85 m</strong>
              <span className="text-[10px] text-theme-muted">0.72% aporte</span>
            </div>
            <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
              <span className="text-[10px] text-theme-muted uppercase font-bold block">2. Corrida Tiraje</span>
              <strong className="font-mono font-black text-theme-main block">190 m</strong>
              <span className="text-[10px] text-theme-muted">1.61% aporte</span>
            </div>
            <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
              <span className="text-[10px] text-theme-muted uppercase font-bold block">3. Ajuste Registro</span>
              <strong className="font-mono font-black text-amber-600 block">120 m</strong>
              <span className="text-[10px] text-theme-muted">1.02% aporte</span>
            </div>
            <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
              <span className="text-[10px] text-theme-muted uppercase font-bold block">4. Rebobinado</span>
              <strong className="font-mono font-black text-theme-main block">46 m</strong>
              <span className="text-[10px] text-theme-muted">0.39% aporte</span>
            </div>
          </div>
        </div>
      )}

      {/* Regla de Oro Mariana & Iván: Separación de Conceptos */}
      <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-theme-muted text-[11px]">
          <Info className="w-4 h-4 text-theme-primary shrink-0" />
          <span>
            <b>Regla RTM:</b> Las unidades físicas son heterogéneas (pliegos, metros, piezas) y no se suman directamente entre sí. El acumulado de la OP se mide como porcentaje normalizado de pérdida.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-500/20">
            Remanente &ne; Scrap
          </span>
          <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-500/20">
            Material Extra &ne; Scrap
          </span>
        </div>
      </div>
    </div>
  );
};
