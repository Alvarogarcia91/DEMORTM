import React from 'react';
import { FlexoSpecs, ProductionMachine, RoutingStep, ToolingRequirement } from '../../data/mockProduccionData';

interface Props {
  specs: FlexoSpecs;
  onChangeSpecs: (patch: Partial<FlexoSpecs>) => void;
  selectedMachine: string;
  onSelectMachine: (machine: string) => void;
  machines: ProductionMachine[];
  routing: RoutingStep[];
  onChangeRouting: (routing: RoutingStep[]) => void;
  tooling: ToolingRequirement[];
  onChangeTooling: (tooling: ToolingRequirement[]) => void;
}

export const FlexoProcessConfigurator: React.FC<Props> = ({
  specs,
  onChangeSpecs,
  selectedMachine,
  onSelectMachine,
  machines,
  routing,
  onChangeRouting,
  tooling,
  onChangeTooling,
}) => {
  const flexoPresses = machines.filter((m) => m.area === 'Flexografía' && m.maxColors && m.maxColors > 0);

  // Active in-line operations inside the press
  const inLineOperations = [
    { key: 'requiresPrint', label: 'Impresión', active: specs.requiresPrint },
    { key: 'requiresDieCut', label: 'Troquelado', active: specs.requiresDieCut },
    { key: 'requiresVarnish', label: 'Barniz UV', active: specs.requiresVarnish },
    { key: 'requiresLaminate', label: 'Laminado BOPP', active: specs.requiresLaminate },
    { key: 'requiresCorona', label: 'Tratamiento Corona', active: specs.requiresCorona },
    { key: 'requiresPrecut', label: 'Precorte', active: specs.requiresPrecut },
  ];

  const toggleInlineOp = (key: string, val: boolean) => {
    onChangeSpecs({ [key]: val } as any);
    // update press routing sub-operations
    const updatedRouting = routing.map((step) => {
      if (step.process.includes('Prensa')) {
        const subOps: string[] = [];
        if (key === 'requiresPrint' ? val : specs.requiresPrint) subOps.push(`Impresión (${specs.inksCount} tintas)`);
        if (key === 'requiresDieCut' ? val : specs.requiresDieCut) subOps.push('Troquelado rotativo');
        if (key === 'requiresVarnish' ? val : specs.requiresVarnish) subOps.push('Barniz sobreimpresión');
        if (key === 'requiresLaminate' ? val : specs.requiresLaminate) subOps.push('Laminado');
        if (key === 'requiresCorona' ? val : specs.requiresCorona) subOps.push('Corona');
        if (key === 'requiresPrecut' ? val : specs.requiresPrecut) subOps.push('Precorte');
        return { ...step, subOperations: subOps };
      }
      return step;
    });
    onChangeRouting(updatedRouting);
  };

  // Machine compatibility evaluator
  const evaluateMachineCompatibility = (m: ProductionMachine) => {
    const reasons: string[] = [];
    let compatible = true;

    // Check inks
    if ((m.maxColors ?? 0) < specs.inksCount) {
      compatible = false;
      reasons.push(`No cumple tintas (Máx: ${m.maxColors}, Req: ${specs.inksCount})`);
    } else {
      reasons.push(`Cumple tintas requeridas (${m.maxColors} colores disp.)`);
    }

    // Check dieCut
    if (specs.requiresDieCut && !m.features?.dieCut) {
      compatible = false;
      reasons.push('No soporta troquelado en línea');
    } else if (specs.requiresDieCut) {
      reasons.push('Cumple troquelado');
    }

    // Check varnish
    if (specs.requiresVarnish && !m.features?.varnish) {
      compatible = false;
      reasons.push('No tiene estación de barniz');
    } else if (specs.requiresVarnish) {
      reasons.push('Cumple barniz');
    }

    // Check laminate
    if (specs.requiresLaminate && !m.features?.laminate) {
      compatible = false;
      reasons.push('No soporta laminado');
    }

    return { compatible, reasons };
  };

  return (
    <div className="space-y-6">
      {/* 1. Especificaciones de etiqueta Flexo */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
          1. Especificaciones de Etiqueta Flexográfica
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
            <span className="font-semibold text-theme-muted">Sustrato / Bobina</span>
            <select
              value={specs.substrate}
              onChange={(e) => onChangeSpecs({ substrate: e.target.value })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
            >
              <option value="BOPP Blanco Brillante">BOPP Blanco Brillante</option>
              <option value="BOPP Transparente">BOPP Transparente</option>
              <option value="Papel Semigloss Autoadherible">Papel Semigloss Autoadherible</option>
              <option value="Polipropileno Térmico">Polipropileno Térmico Directo</option>
              <option value="Poliéster Plata">Poliéster Plata Mate</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="font-semibold text-theme-muted">Ancho (mm)</span>
              <input
                type="number"
                value={specs.widthMm}
                onChange={(e) => onChangeSpecs({ widthMm: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
            <label>
              <span className="font-semibold text-theme-muted">Largo (mm)</span>
              <input
                type="number"
                value={specs.lengthMm}
                onChange={(e) => onChangeSpecs({ lengthMm: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>
          </div>

          <label>
            <span className="font-semibold text-theme-muted">Cantidad por Rollo</span>
            <input
              type="number"
              value={specs.quantityPerRoll}
              onChange={(e) => onChangeSpecs({ quantityPerRoll: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
            />
          </label>

          <label>
            <span className="font-semibold text-theme-muted">Número de Tintas</span>
            <select
              value={specs.inksCount}
              onChange={(e) => onChangeSpecs({ inksCount: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-primary"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'tinta' : 'tintas'}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="font-semibold text-theme-muted">Descripción Tintas / Colores</span>
            <input
              type="text"
              value={specs.cmykOrPantone}
              onChange={(e) => onChangeSpecs({ cmykOrPantone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              placeholder="Ej. CMYK UV + Pantone 186 C"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="font-semibold text-theme-muted">Observaciones Técnicas / Embobinado</span>
            <input
              type="text"
              value={specs.technicalNotes ?? ''}
              onChange={(e) => onChangeSpecs({ technicalNotes: e.target.value })}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              placeholder="Ej. Embobinado exterior #4, corte al liner sin daño a respaldo"
            />
          </label>
        </div>

        {/* Operaciones en línea (Sección 9 del doc) */}
        <div className="mt-4 rounded-xl border border-theme-subtle bg-theme-muted/30 p-4">
          <span className="block text-xs font-bold text-theme-main">
            Operaciones en Línea dentro de la Prensa Flexográfica:
          </span>
          <p className="text-[11px] text-theme-muted mb-3">
            En flexografía, las operaciones se integran en estaciones modulares sobre el mismo tren de máquina.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 text-xs">
            {inLineOperations.map((op) => (
              <label
                key={op.key}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all ${
                  op.active
                    ? 'border-theme-primary bg-theme-primary/10 text-theme-primary font-bold'
                    : 'border-theme-subtle bg-theme-surface text-theme-muted'
                }`}
              >
                <span>{op.label}</span>
                <input
                  type="checkbox"
                  checked={op.active}
                  onChange={(e) => toggleInlineOp(op.key, e.target.checked)}
                  className="h-4 w-4 rounded text-theme-primary"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Compatibilidad de Máquinas Flexo (Sección 10 del doc) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
              2. Matriz de Compatibilidad de Prensas Flexo
            </h3>
            <p className="text-xs text-theme-muted">
              El sistema filtra prensas compatibles considerando tintas, troquel, barniz y capacidad semanal.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flexoPresses.map((m) => {
            const { compatible, reasons } = evaluateMachineCompatibility(m);
            const isSelected = selectedMachine === m.name;

            return (
              <div
                key={m.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 text-xs transition-all ${
                  isSelected
                    ? 'border-theme-primary bg-theme-primary/10 ring-2 ring-theme-primary/20 shadow-xs'
                    : compatible
                    ? 'border-theme-subtle bg-theme-surface hover:border-theme-primary/50'
                    : 'border-rose-300 bg-rose-50/40 dark:bg-rose-950/20 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-main">{m.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        compatible ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                      }`}
                    >
                      {compatible ? '✓ Compatible' : '✕ No cumple'}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-theme-muted">
                    <span>Ancho: {m.supportedWidthInches}” · </span>
                    <span>Máx tintas: {m.maxColors} · </span>
                    <span className={m.load > 85 ? 'text-amber-600 font-bold' : ''}>
                      Carga: {m.load}%
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    {reasons.map((reason, idx) => (
                      <p
                        key={idx}
                        className={`text-[11px] ${
                          reason.startsWith('Cumple')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400 font-medium'
                        }`}
                      >
                        {reason.startsWith('Cumple') ? '✓ ' : '✕ '}
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!compatible}
                  onClick={() => onSelectMachine(m.name)}
                  className={`mt-4 w-full rounded-xl py-2 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-theme-primary text-white'
                      : compatible
                      ? 'border border-theme-subtle bg-theme-surface hover:bg-theme-muted/30 text-theme-main'
                      : 'cursor-not-allowed border border-rose-300 text-rose-400'
                  }`}
                >
                  {isSelected ? 'Prensa Seleccionada' : compatible ? 'Seleccionar Prensa' : 'Incompatible'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Suaje y Grabado (Herramental, Sección 11 del doc) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
              3. Herramental Flexográfico (Suaje y Grabado)
            </h3>
            <p className="text-xs text-theme-muted">
              Vinculado a especificaciones técnicas de suaje rotativo y clichés polímeros.
            </p>
          </div>
          {specs.dieStatus === 'Pendiente' && (
            <span className="rounded-md bg-amber-100 dark:bg-amber-900/50 px-2 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-200">
              ⚠ Herramental pendiente genera alerta
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          {/* Bloque Grabado */}
          <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-theme-main">Grabado / Clichés Digitales</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  specs.engravingStatus === 'Liberado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                ● {specs.engravingStatus}
              </span>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-theme-muted">Referencia de Grabado / Casetera:</span>
                <input
                  type="text"
                  value={specs.engravingRef}
                  onChange={(e) => onChangeSpecs({ engravingRef: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                />
              </label>

              <label className="block">
                <span className="text-theme-muted">Estado del grabado:</span>
                <select
                  value={specs.engravingStatus}
                  onChange={(e) => onChangeSpecs({ engravingStatus: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                >
                  <option value="Liberado">Liberado por Preprensa</option>
                  <option value="Pendiente">Pendiente de montaje / elaboración</option>
                </select>
              </label>
            </div>
          </div>

          {/* Bloque Suaje */}
          <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-theme-main">Suaje Rotativo RTM</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  specs.dieStatus === 'Disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                ● {specs.dieStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="text-theme-muted">Tipo de suaje:</span>
                <select
                  value={specs.dieType}
                  onChange={(e) => onChangeSpecs({ dieType: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                >
                  <option value="Flexible">Flexible (Magnético)</option>
                  <option value="Sólido">Sólido mecanizado</option>
                </select>
              </label>

              <label>
                <span className="text-theme-muted">Dientes:</span>
                <input
                  type="number"
                  value={specs.dieTeeth}
                  onChange={(e) => onChangeSpecs({ dieTeeth: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                />
              </label>

              <label>
                <span className="text-theme-muted">Repeat (Pulgadas):</span>
                <input
                  type="text"
                  value={specs.dieRepeat}
                  onChange={(e) => onChangeSpecs({ dieRepeat: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                />
              </label>

              <label>
                <span className="text-theme-muted">Carriles / Salidas:</span>
                <input
                  type="number"
                  value={specs.dieLanes}
                  onChange={(e) => onChangeSpecs({ dieLanes: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-theme-muted">Disponibilidad en Taller de Suajes:</span>
              <select
                value={specs.dieStatus}
                onChange={(e) => onChangeSpecs({ dieStatus: e.target.value as any })}
                className="mt-1 w-full rounded-lg border border-theme-subtle bg-theme-surface p-2 font-bold"
              >
                <option value="Disponible">Disponible en Rack B-3</option>
                <option value="Pendiente">Pendiente de afilar / recibir</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
