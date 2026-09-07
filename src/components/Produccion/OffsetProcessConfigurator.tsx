import React from 'react';
import { OffsetSpecs, ProductionMachine, RoutingStep } from '../../data/mockProduccionData';
import { ProductionPaginationOptimizer } from './ProductionPaginationOptimizer';

interface Props {
  specs: OffsetSpecs;
  onChangeSpecs: (patch: Partial<OffsetSpecs>) => void;
  selectedMachine: string;
  onSelectMachine: (machine: string) => void;
  machines: ProductionMachine[];
  routing: RoutingStep[];
  onChangeRouting: (routing: RoutingStep[]) => void;
  quantity: number;
}

export const OffsetProcessConfigurator: React.FC<Props> = ({
  specs,
  onChangeSpecs,
  selectedMachine,
  onSelectMachine,
  machines,
  routing,
  onChangeRouting,
  quantity,
}) => {
  // Preset templates
  const applyPreset = (type: 'manual' | 'instructivo') => {
    if (type === 'manual') {
      onChangeSpecs({
        pages: 64,
        folded: true,
        stapled: true,
        stapleType: 'Grapado al lomo / tipo libro',
      });
      onChangeRouting([
        {
          stepNumber: 1,
          process: 'Preimpresión CTP',
          machine: 'CTP Agfa',
          setupMinutes: 20,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 2,
          process: 'Impresión Offset',
          machine: selectedMachine || 'Heidelberg Speedmaster XL 75',
          alternativeMachine: 'Conserver 8 colores',
          setupMinutes: 40,
          runMinutes: 160,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 3,
          process: 'Guillotina',
          machine: 'Guillotina 2',
          setupMinutes: 15,
          runMinutes: 45,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 4,
          process: 'Doblado',
          machine: 'Stahl 2',
          setupMinutes: 25,
          runMinutes: 60,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 5,
          process: 'Grapado y Alzado',
          machine: 'Muller Martini',
          setupMinutes: 30,
          runMinutes: 70,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 6,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 7,
          process: 'Empaque',
          machine: 'Mesa Empaque',
          setupMinutes: 10,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ]);
    } else {
      onChangeSpecs({
        pages: 8,
        folded: true,
        stapled: false,
        stapleType: 'Sin grapa',
      });
      onChangeRouting([
        {
          stepNumber: 1,
          process: 'Preimpresión CTP',
          machine: 'CTP Agfa',
          setupMinutes: 15,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 2,
          process: 'Impresión Offset',
          machine: selectedMachine || 'Conserver 3–4',
          alternativeMachine: 'Ryobi 1–2',
          setupMinutes: 30,
          runMinutes: 90,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 3,
          process: 'Guillotina',
          machine: 'Guillotina 2',
          setupMinutes: 15,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 4,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 15,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 5,
          process: 'Empaque',
          machine: 'Mesa Empaque',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ]);
    }
  };

  const updateRoutingStep = (index: number, patch: Partial<RoutingStep>) => {
    const updated = [...routing];
    updated[index] = { ...updated[index], ...patch };
    onChangeRouting(updated);
  };

  return (
    <div className="space-y-6">
      {/* Plantillas predefinidas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 p-4">
        <div>
          <span className="text-xs font-bold text-theme-main">Plantillas de Proceso Offset:</span>
          <p className="text-[11px] text-theme-muted">
            Cargar routing estándar según la complejidad del instructivo.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => applyPreset('manual')}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              specs.stapled
                ? 'bg-theme-primary text-white'
                : 'border border-theme-subtle bg-theme-surface text-theme-main hover:bg-theme-muted/30'
            }`}
          >
            Manual Completo (64 págs + Grapado)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('instructivo')}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              !specs.stapled
                ? 'bg-theme-primary text-white'
                : 'border border-theme-subtle bg-theme-surface text-theme-main hover:bg-theme-muted/30'
            }`}
          >
            Instructivo Sencillo (8 págs sin grapa)
          </button>
        </div>
      </div>

      {/* Especificaciones de producto */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
          1. Especificaciones Técnicas del Producto
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <label>
            <span className="font-semibold text-theme-muted">Familia de Producto</span>
            <input
              type="text"
              value={specs.productFamily}
              onChange={(e) => onChangeSpecs({ productFamily: e.target.value })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-medium"
            />
          </label>

          <label>
            <span className="font-semibold text-theme-muted">Número de Páginas</span>
            <select
              value={specs.pages}
              onChange={(e) => onChangeSpecs({ pages: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
            >
              {[8, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 60, 64, 72, 80, 96].map((p) => (
                <option key={p} value={p}>
                  {p} páginas
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="font-semibold text-theme-muted">Ancho (mm)</span>
              <input
                type="number"
                value={specs.finalWidthMm}
                onChange={(e) => onChangeSpecs({ finalWidthMm: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
            <label>
              <span className="font-semibold text-theme-muted">Largo (mm)</span>
              <input
                type="number"
                value={specs.finalHeightMm}
                onChange={(e) => onChangeSpecs({ finalHeightMm: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
          </div>

          <label>
            <span className="font-semibold text-theme-muted">Tipo de Papel / Sustrato</span>
            <select
              value={specs.paperType}
              onChange={(e) => onChangeSpecs({ paperType: e.target.value })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            >
              <option value="Bond Blanco">Bond Blanco</option>
              <option value="Couché Brillante">Couché Brillante</option>
              <option value="Couché Mate">Couché Mate</option>
              <option value="Offset Crema">Offset Crema</option>
            </select>
          </label>

          <label>
            <span className="font-semibold text-theme-muted">Gramaje</span>
            <select
              value={specs.paperWeightGsm}
              onChange={(e) => onChangeSpecs({ paperWeightGsm: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            >
              <option value={50}>50 g/m²</option>
              <option value={60}>60 g/m² (Estándar Manuales)</option>
              <option value={75}>75 g/m²</option>
              <option value={90}>90 g/m²</option>
              <option value={115}>115 g/m²</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="font-semibold text-theme-muted">Tintas Frente</span>
              <input
                type="number"
                min={1}
                max={6}
                value={specs.inksFront}
                onChange={(e) => onChangeSpecs({ inksFront: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
            <label>
              <span className="font-semibold text-theme-muted">Tintas Vuelta</span>
              <input
                type="number"
                min={0}
                max={6}
                value={specs.inksBack}
                onChange={(e) => onChangeSpecs({ inksBack: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
          </div>

          <label>
            <span className="font-semibold text-theme-muted">Tipo de Acabado / Grapado</span>
            <select
              value={specs.stapleType}
              onChange={(e) =>
                onChangeSpecs({
                  stapleType: e.target.value as any,
                  stapled: e.target.value !== 'Sin grapa',
                })
              }
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            >
              <option value="Sin grapa">Sin grapa</option>
              <option value="Grapado al lomo / tipo libro">Grapado al lomo / tipo libro</option>
              <option value="Grapado en esquina">Grapado en esquina</option>
              <option value="Grapado frontal">Grapado frontal</option>
            </select>
          </label>

          <label>
            <span className="font-semibold text-theme-muted">Cantidad por Paquete</span>
            <input
              type="number"
              value={specs.packQuantity}
              onChange={(e) => onChangeSpecs({ packQuantity: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            />
          </label>
        </div>
      </div>

      {/* Optimizador de paginación (Sección 8 del doc) */}
      <ProductionPaginationOptimizer
        specs={specs}
        onChange={onChangeSpecs}
        selectedMachine={selectedMachine}
        machines={machines}
        onSelectMachine={onSelectMachine}
        quantity={quantity}
      />

      {/* Routing propuesto editable */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
              2. Routing y Secuencia de Producción
            </h3>
            <p className="text-xs text-theme-muted">
              Etapas calculadas para el proceso Offset. El planner puede ajustar máquinas y tiempos.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-theme-primary">
            {routing.length} operaciones
          </span>
        </div>

        <div className="divide-y divide-theme-subtle overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-2.5 text-left">Paso</th>
                <th className="p-2.5 text-left">Proceso</th>
                <th className="p-2.5 text-left">Máquina Asignada</th>
                <th className="p-2.5 text-left">Alternativa</th>
                <th className="p-2.5 text-left">Setup (min)</th>
                <th className="p-2.5 text-left">Corrida (min)</th>
                <th className="p-2.5 text-center">1ra Pieza Calidad</th>
              </tr>
            </thead>
            <tbody>
              {routing.map((step, idx) => (
                <tr key={idx} className="hover:bg-theme-muted/20">
                  <td className="p-2.5 font-mono font-bold text-theme-muted">#{step.stepNumber}</td>
                  <td className="p-2.5 font-bold text-theme-main">{step.process}</td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={step.machine}
                      onChange={(e) => updateRoutingStep(idx, { machine: e.target.value })}
                      className="rounded-lg border border-theme-subtle bg-theme-surface px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5 text-theme-muted">
                    {step.alternativeMachine ?? '—'}
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={step.setupMinutes}
                      onChange={(e) => updateRoutingStep(idx, { setupMinutes: Number(e.target.value) })}
                      className="w-16 rounded-lg border border-theme-subtle bg-theme-surface px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={step.runMinutes}
                      onChange={(e) => updateRoutingStep(idx, { runMinutes: Number(e.target.value) })}
                      className="w-16 rounded-lg border border-theme-subtle bg-theme-surface px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={step.requiresFirstPieceQuality}
                      onChange={(e) =>
                        updateRoutingStep(idx, { requiresFirstPieceQuality: e.target.checked })
                      }
                      className="h-4 w-4 rounded text-theme-primary"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
