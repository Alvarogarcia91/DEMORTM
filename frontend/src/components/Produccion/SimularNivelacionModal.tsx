import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Layers, Clock, Sliders } from 'lucide-react';
import { ProductionMachine } from '../../data/mockProduccionData';

interface SimularNivelacionModalProps {
  machines: ProductionMachine[];
  onClose: () => void;
  onApplyRebalance: (sourceId: string, targetId: string) => void;
  onNotice?: (msg: string) => void;
}

export const SimularNivelacionModal: React.FC<SimularNivelacionModalProps> = ({
  machines,
  onClose,
  onApplyRebalance,
  onNotice,
}) => {
  // Saturated source machine: Mark Andy 830 10" or machine with highest load
  const sourceMachine = machines.find((m) => m.name.includes('830 10”')) || machines.find((m) => m.load > 90) || machines[0];
  // Target alternate machine: Mark Andy Scout 10"
  const targetMachine = machines.find((m) => m.name.includes('Scout 10”')) || machines.find((m) => m.name !== sourceMachine.name && m.area === sourceMachine.area) || machines[1];

  const [applied, setApplied] = useState<boolean>(false);
  const [selectedOps, setSelectedOps] = useState<string[]>(['OP-2026-95249']);

  const candidateOps = [
    {
      folio: 'OP-2026-95249',
      partNumber: '70-1525',
      client: 'FRESENIUS MEDICAL',
      qty: '45,000 pzas',
      hours: 7.2,
      process: 'Flexo 3 tintas + Barniz + Troquel',
      compatible: true,
    },
    {
      folio: 'OP-2026-95251',
      partNumber: 'IS-2420',
      client: 'TYCO ELECTRONICS',
      qty: '30,000 pzas',
      hours: 4.8,
      process: 'Flexo 4 tintas + Laminado + Troquel',
      compatible: true,
    },
  ];

  const handleToggleOp = (folio: string) => {
    if (selectedOps.includes(folio)) {
      setSelectedOps(selectedOps.filter((f) => f !== folio));
    } else {
      setSelectedOps([...selectedOps, folio]);
    }
  };

  const divertedHours = candidateOps
    .filter((op) => selectedOps.includes(op.folio))
    .reduce((sum, op) => sum + op.hours, 0);

  const sourceCurrentHours = (sourceMachine.load / 100) * (sourceMachine.weeklyCapacityHours || 40);
  const targetCurrentHours = (targetMachine.load / 100) * (targetMachine.weeklyCapacityHours || 40);

  const sourceProjectedHours = Math.max(0, sourceCurrentHours - divertedHours);
  const targetProjectedHours = Math.min(40, targetCurrentHours + divertedHours);

  const sourceProjectedLoad = Math.round((sourceProjectedHours / (sourceMachine.weeklyCapacityHours || 40)) * 100);
  const targetProjectedLoad = Math.round((targetProjectedHours / (targetMachine.weeklyCapacityHours || 40)) * 100);

  const handleExecute = () => {
    onApplyRebalance(sourceMachine.id, targetMachine.id);
    setApplied(true);
    if (onNotice) {
      onNotice(`Nivelación aplicada: ${selectedOps.length} OPs desviadas de ${sourceMachine.name} a ${targetMachine.name}. Carga balanceada a ${sourceProjectedLoad}%.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden text-theme-main flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-theme-subtle bg-purple-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                Sugerencia del sistema &bull; Balanceo de Capacidad
              </span>
              <h3 className="text-lg sm:text-xl font-black text-theme-main">
                Simular Nivelación de Carga Flexográfica
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-theme-muted/50 hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          
          {/* Banner de Diagnóstico */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-rose-900 dark:text-rose-200">
                Cuello de botella detectado en {sourceMachine.name} ({sourceMachine.load}% de carga)
              </div>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                La prensa tiene comprometidas {sourceCurrentHours.toFixed(1)} h de su capacidad regular semanal (40h).
                {targetMachine.name} cuenta con {((40 - targetCurrentHours)).toFixed(1)} h disponibles y es 100% compatible con las especificaciones de troquel y tintas.
              </p>
            </div>
          </div>

          {/* Selección de Órdenes a Desviar */}
          <div className="space-y-2.5">
            <span className="font-bold text-xs uppercase text-theme-muted tracking-wider block">
              Seleccionar órdenes para desvío a {targetMachine.name}:
            </span>

            <div className="space-y-2">
              {candidateOps.map((op) => {
                const isChecked = selectedOps.includes(op.folio);
                return (
                  <div
                    key={op.folio}
                    onClick={() => handleToggleOp(op.folio)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-purple-500/5 border-purple-500/40 shadow-xs'
                        : 'bg-theme-surface border-theme-subtle hover:border-theme-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="rounded text-purple-600 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-theme-primary">{op.folio}</span>
                          <span className="text-theme-muted">&bull;</span>
                          <span className="font-bold text-theme-main">{op.client}</span>
                          <span className="text-theme-muted font-mono">({op.partNumber})</span>
                        </div>
                        <span className="text-[11px] text-theme-muted block mt-0.5">
                          {op.process} &bull; Tiraje: {op.qty}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-theme-main">
                      +{op.hours} h
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparativa Visual Antes vs Después */}
          <div className="p-4 rounded-3xl bg-theme-muted/20 border border-theme-subtle space-y-4">
            <span className="font-bold text-xs uppercase tracking-wider text-theme-main block">
              Proyección de Balance de Carga Semanal
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Fuente: Mark Andy 830 */}
              <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-theme-main">{sourceMachine.name}</span>
                  <span className="font-mono text-xs font-bold text-theme-muted">
                    {sourceMachine.load}% &rarr; <b className="text-emerald-600 font-black">{sourceProjectedLoad}%</b>
                  </span>
                </div>

                <div className="w-full bg-theme-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, sourceProjectedLoad)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-theme-muted">
                  <span>Horas: {sourceProjectedHours.toFixed(1)} h</span>
                  <span className="text-emerald-600 font-bold">-{divertedHours.toFixed(1)} h liberadas</span>
                </div>
              </div>

              {/* Destino: Mark Andy Scout */}
              <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-theme-main">{targetMachine.name}</span>
                  <span className="font-mono text-xs font-bold text-theme-muted">
                    {targetMachine.load}% &rarr; <b className="text-purple-600 font-black">{targetProjectedLoad}%</b>
                  </span>
                </div>

                <div className="w-full bg-theme-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, targetProjectedLoad)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-theme-muted">
                  <span>Horas: {targetProjectedHours.toFixed(1)} h</span>
                  <span className="text-purple-600 font-bold">Capacidad Óptima</span>
                </div>
              </div>

            </div>
          </div>

          {applied && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-xs">
                ¡Nivelación aplicada en la sesión! Las órdenes fueron transferidas a la cola de {targetMachine.name}.
              </span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-subtle bg-theme-muted/20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer"
          >
            {applied ? 'Cerrar' : 'Cancelar'}
          </button>

          {!applied ? (
            <button
              onClick={handleExecute}
              disabled={selectedOps.length === 0}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Aplicar Rebalanceo Demo</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
            >
              Aceptar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
