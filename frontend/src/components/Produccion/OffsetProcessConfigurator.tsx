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
  // Preset templates según sección 10 de auditoría
  const applyPreset = (type: 'manual-grapado' | 'grapado-esquina' | 'instructivo' | 'pegado') => {
    if (type === 'manual-grapado') {
      onChangeSpecs({
        pages: 64,
        folded: true,
        stapled: true,
        stapleType: 'Grapado al lomo / tipo libro',
      });
      onChangeRouting([
        { stepNumber: 1, process: 'Preimpresión CTP', machine: 'CTP Agfa', setupMinutes: 20, runMinutes: 30, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 2, process: 'Impresión Offset', machine: selectedMachine || 'Heidelberg Speedmaster', alternativeMachine: 'Conserver 8 colores', setupMinutes: 40, runMinutes: 160, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 3, process: 'Guillotina', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 45, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 4, process: 'Doblado', machine: 'Stahl 2', setupMinutes: 25, runMinutes: 60, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 5, process: 'Intercalado / Alzado', machine: 'Muller Martini', setupMinutes: 20, runMinutes: 50, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 6, process: 'Grapado al Lomo', machine: 'Muller Martini', setupMinutes: 25, runMinutes: 60, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 7, process: 'Empaque', machine: 'Mesa Empaque', setupMinutes: 10, runMinutes: 30, status: 'Pendiente', requiresFirstPieceQuality: false },
      ]);
    } else if (type === 'grapado-esquina') {
      onChangeSpecs({
        pages: 16,
        folded: false,
        stapled: true,
        stapleType: 'Grapado en esquina',
      });
      onChangeRouting([
        { stepNumber: 1, process: 'Preimpresión CTP', machine: 'CTP Agfa', setupMinutes: 15, runMinutes: 20, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 2, process: 'Impresión Offset', machine: selectedMachine || 'Conserver 3–4', setupMinutes: 30, runMinutes: 70, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 3, process: 'Guillotina', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 30, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 4, process: 'Intercalado', machine: 'Muller Martini', setupMinutes: 15, runMinutes: 35, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 5, process: 'Grapado en Esquina', machine: 'Muller Martini', setupMinutes: 15, runMinutes: 40, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 6, process: 'Empaque', machine: 'Mesa Empaque', setupMinutes: 10, runMinutes: 20, status: 'Pendiente', requiresFirstPieceQuality: false },
      ]);
    } else if (type === 'instructivo') {
      onChangeSpecs({
        pages: 8,
        folded: true,
        stapled: false,
        stapleType: 'Sin grapa',
      });
      onChangeRouting([
        { stepNumber: 1, process: 'Preimpresión CTP', machine: 'CTP Agfa', setupMinutes: 15, runMinutes: 20, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 2, process: 'Impresión Offset', machine: selectedMachine || 'Conserver 3–4', alternativeMachine: 'Ryobi 1–2', setupMinutes: 30, runMinutes: 80, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 3, process: 'Guillotina', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 30, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 4, process: 'Doblado Acordeón', machine: 'Stahl 2', setupMinutes: 20, runMinutes: 40, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 5, process: 'Empaque', machine: 'Mesa Empaque', setupMinutes: 10, runMinutes: 20, status: 'Pendiente', requiresFirstPieceQuality: false },
      ]);
    } else if (type === 'pegado') {
      onChangeSpecs({
        pages: 96,
        folded: true,
        stapled: false,
        stapleType: 'Pegado / Hotmelt',
      });
      onChangeRouting([
        { stepNumber: 1, process: 'Preimpresión CTP', machine: 'CTP Agfa', setupMinutes: 25, runMinutes: 40, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 2, process: 'Impresión Offset', machine: selectedMachine || 'Heidelberg Speedmaster', setupMinutes: 45, runMinutes: 210, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 3, process: 'Guillotina', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 45, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 4, process: 'Doblado', machine: 'Stahl 2', setupMinutes: 30, runMinutes: 75, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 5, process: 'Intercalado', machine: 'Muller Martini', setupMinutes: 20, runMinutes: 60, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 6, process: 'Pegado Hotmelt Lomo', machine: 'Muller Martini', setupMinutes: 35, runMinutes: 90, status: 'Pendiente', requiresFirstPieceQuality: true },
        { stepNumber: 7, process: 'Trimeado Trilateral', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 40, status: 'Pendiente', requiresFirstPieceQuality: false },
        { stepNumber: 8, process: 'Empaque', machine: 'Mesa Empaque', setupMinutes: 10, runMinutes: 30, status: 'Pendiente', requiresFirstPieceQuality: false },
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
      {/* 4 Plantillas predefinidas según auditoría de Iván */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-muted/20 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-theme-main">
            Variantes de Acabado y Routing Offset (Sección 10):
          </span>
          <span className="text-[11px] text-theme-muted">Configura estaciones y tiempos estándar</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { id: 'manual-grapado', label: '1. Manual Grapado al Lomo (64p)' },
            { id: 'grapado-esquina', label: '2. Grapado Esquina (16p)' },
            { id: 'instructivo', label: '3. Instructivo Plegado (8p)' },
            { id: 'pegado', label: '4. Libro Pegado Hotmelt (96p)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => applyPreset(item.id as any)}
              className="rounded-xl border border-theme-subtle bg-theme-surface p-2.5 text-center text-xs font-bold text-theme-main hover:border-theme-primary transition-all"
            >
              {item.label}
            </button>
          ))}
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
                  {p} páginas {p === 24 ? '(Caso Iván: 16+8)' : ''}
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
              <option value={70}>70 g/m² (Sustituto habitual)</option>
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
                  stapled: e.target.value.includes('Grapado'),
                })
              }
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            >
              <option value="Sin grapa">Sin grapa (Plegado simple/acordeón)</option>
              <option value="Grapado al lomo / tipo libro">Grapado al lomo / tipo libro</option>
              <option value="Grapado en esquina">Grapado en esquina</option>
              <option value="Grapado frontal">Grapado frontal</option>
              <option value="Pegado / Hotmelt">Pegado al lomo / Hotmelt</option>
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

      {/* Optimizador de paginación dinámico (con reglas de máquina de Iván) */}
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
              Etapas del proceso Offset (Intercalado, Alzado, Grapado/Pegado y Trimeado incluidos).
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
                  <td className="p-2.5 text-theme-muted">{step.alternativeMachine ?? '—'}</td>
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
                      onChange={(e) => updateRoutingStep(idx, { requiresFirstPieceQuality: e.target.checked })}
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
