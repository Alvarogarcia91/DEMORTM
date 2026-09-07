import React, { useState } from 'react';
import { X, Settings, DollarSign, Clock, Layers, Sparkles, Check } from 'lucide-react';
import { ProductionCostConfig, DEFAULT_PRODUCTION_COST_CONFIG } from '../../../data/mockProductionCostData';

interface Props {
  config: ProductionCostConfig;
  onClose: () => void;
  onSaveConfig: (updated: ProductionCostConfig) => void;
}

export const ProductionCostConfigModal: React.FC<Props> = ({
  config,
  onClose,
  onSaveConfig,
}) => {
  const [laborRate, setLaborRate] = useState<number>(config.laborHourlyRate);
  const [overheadPct, setOverheadPct] = useState<number>(config.overheadPercentage);
  const [scrapCost, setScrapCost] = useState<number>(config.defaultScrapCostPerUnit);
  const [machineRates, setMachineRates] = useState(config.machineRates);

  const handleUpdateMachineRate = (machineName: string, newRate: number) => {
    setMachineRates((prev) =>
      prev.map((m) => (m.machineName === machineName ? { ...m, hourlyRate: newRate, setupHourlyRate: Math.round(newRate * 1.08) } : m))
    );
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      laborHourlyRate: laborRate,
      overheadPercentage: overheadPct,
      defaultScrapCostPerUnit: scrapCost,
      machineRates,
    });
    onClose();
  };

  const handleReset = () => {
    setLaborRate(DEFAULT_PRODUCTION_COST_CONFIG.laborHourlyRate);
    setOverheadPct(DEFAULT_PRODUCTION_COST_CONFIG.overheadPercentage);
    setScrapCost(DEFAULT_PRODUCTION_COST_CONFIG.defaultScrapCostPerUnit);
    setMachineRates(DEFAULT_PRODUCTION_COST_CONFIG.machineRates);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-theme-main">
                Configuración de Tarifas y Carga Fabril
              </h3>
              <p className="text-xs text-theme-muted">
                Parámetros industriales demo para cálculo de hora máquina, MOD y sobrecostos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* General Demo Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                Tarifas industriales demo configurables
              </span>
              <p className="text-theme-muted leading-relaxed text-[11px]">
                Los importes de mano de obra y horas máquina corresponden a estándares de simulación operativa. Modificar estos valores recalculará inmediatamente los costos estándar y proyectados en todo el workspace.
              </p>
            </div>
          </div>

          {/* Global Rates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-theme-muted block">
                Mano de Obra Directa (MOD)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-theme-muted">$</span>
                <input
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-theme-main"
                />
              </div>
              <span className="text-[10px] text-theme-muted block font-mono">MXN / hora operario</span>
            </div>

            <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-theme-muted block">
                Carga Fabril Demo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={overheadPct}
                  onChange={(e) => setOverheadPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-theme-main"
                />
                <span className="text-xs font-mono font-bold text-theme-muted">%</span>
              </div>
              <span className="text-[10px] text-theme-muted block font-mono">Sobre costo de conversión</span>
            </div>

            <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-theme-muted block">
                Costo Base de Scrap
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-theme-muted">$</span>
                <input
                  type="number"
                  step="0.1"
                  value={scrapCost}
                  onChange={(e) => setScrapCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-theme-main"
                />
              </div>
              <span className="text-[10px] text-theme-muted block font-mono">MXN / unidad o metro</span>
            </div>
          </div>

          {/* Machine Rates Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-muted block">
              Tarifas Horarias por Máquina (Corrida / Setup)
            </span>
            <div className="border border-theme-subtle rounded-2xl overflow-hidden bg-theme-surface shadow-2xs max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-muted/50 text-[10px] font-bold uppercase text-theme-muted border-b border-theme-subtle sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Máquina</th>
                    <th className="py-2 px-3">Área</th>
                    <th className="py-2 px-3 text-right">Tarifa Corrida ($/h)</th>
                    <th className="py-2 px-3 text-right">Tarifa Setup ($/h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle/60 font-mono">
                  {machineRates.slice(0, 10).map((m) => (
                    <tr key={m.machineName} className="hover:bg-theme-muted/20">
                      <td className="py-2 px-3 font-sans font-bold text-theme-main">{m.machineName}</td>
                      <td className="py-2 px-3 text-theme-muted font-sans text-[11px]">{m.area}</td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={m.hourlyRate}
                          onChange={(e) => handleUpdateMachineRate(m.machineName, parseFloat(e.target.value) || 0)}
                          className="w-20 text-right bg-theme-muted/30 border border-theme-subtle rounded px-1.5 py-0.5 text-xs font-bold text-theme-main"
                        />
                      </td>
                      <td className="py-2 px-3 text-right text-theme-muted font-bold">${m.setupHourlyRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-subtle bg-theme-muted/20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-theme-muted hover:text-theme-main hover:underline cursor-pointer"
          >
            Restablecer valores predeterminados
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-theme-muted hover:text-theme-main text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-xs hover:bg-theme-primary-hover flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar tarifas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
