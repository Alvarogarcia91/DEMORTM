import React, { useState } from 'react';
import {
  MASTER_RECIPES,
  MasterManufacturingRecipe,
  OffsetSpecs,
  FlexoSpecs,
} from '../../data/mockProduccionData';
import { ProductionCard } from './productionUi';
import { BookOpen, CheckCircle2, ChevronRight, Layers, Sliders, Wrench } from 'lucide-react';

interface Props {
  onSelectRecipeForNewOrder?: (recipe: MasterManufacturingRecipe) => void;
}

export const ConfiguracionFabricacion: React.FC<Props> = ({ onSelectRecipeForNewOrder }) => {
  const [recipes] = useState<MasterManufacturingRecipe[]>(MASTER_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<MasterManufacturingRecipe>(recipes[0]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header explicativo */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
              INGENIERÍA DE PROCESOS · RTM
            </span>
            <span className="text-xs text-theme-muted">
              Configuración Maestra de Fabricación (Recetas de Artículo)
            </span>
          </div>
          <h2 className="text-xl font-black text-theme-main mt-1">
            Catálogo de Procesos y Rutas Maestras
          </h2>
          <p className="text-xs text-theme-muted">
            Define una sola vez cómo se fabrica cada producto (specs, máquinas, routing, herramental e insumos estándar). Las órdenes de producción nuevas heredan automáticamente estos parámetros sin recaptura.
          </p>
        </div>

        {onSelectRecipeForNewOrder && (
          <button
            type="button"
            onClick={() => onSelectRecipeForNewOrder(selectedRecipe)}
            className="flex items-center gap-1.5 w-fit rounded-xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-theme-primary/90"
          >
            <BookOpen className="h-4 w-4" /> Generar OP con esta Receta
          </button>
        )}
      </div>

      {/* Selector de Recetas */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((rec) => {
          const isSelected = selectedRecipe.id === rec.id;
          return (
            <button
              key={rec.id}
              type="button"
              onClick={() => setSelectedRecipe(rec)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-theme-primary bg-theme-primary/10 ring-2 ring-theme-primary/20 shadow-xs'
                  : 'border-theme-subtle bg-theme-surface hover:bg-theme-muted/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    rec.area === 'Offset'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                  }`}
                >
                  {rec.area}
                </span>
                <span className="font-mono text-[10px] text-theme-muted">{rec.revision}</span>
              </div>

              <b className="mt-2 block text-xs font-black text-theme-main truncate">{rec.name}</b>
              <span className="block font-mono text-[11px] text-theme-muted">
                {rec.client} · {rec.partNumber}
              </span>

              <div className="mt-3 flex items-center justify-between text-[10px] text-theme-muted pt-2 border-t border-theme-subtle/50">
                <span>{rec.routing.length} operaciones</span>
                <span className="font-bold text-theme-primary">Ver detalle →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle de la Receta Maestra Seleccionada */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Columna Izquierda: Especificaciones Técnicas */}
        <div className="space-y-4">
          <ProductionCard>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-theme-muted">Especificación Maestra</span>
                  <h3 className="text-sm font-black text-theme-main">{selectedRecipe.partNumber}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-theme-primary">{selectedRecipe.area}</span>
              </div>

              <p className="text-xs text-theme-muted">{selectedRecipe.description}</p>

              {/* Offset Specs */}
              {selectedRecipe.offsetSpecs && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Páginas:</span>
                    <b className="font-mono text-theme-main">{selectedRecipe.offsetSpecs.pages} págs</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Paginación Máster:</span>
                    <b className="text-theme-primary">{selectedRecipe.offsetSpecs.formCount} Formas ({selectedRecipe.offsetSpecs.formsDetail?.join(', ')})</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Tamaño final:</span>
                    <b className="font-mono text-theme-main">
                      {selectedRecipe.offsetSpecs.finalWidthMm} x {selectedRecipe.offsetSpecs.finalHeightMm} mm
                    </b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Papel / Gramaje:</span>
                    <b className="text-theme-main">{selectedRecipe.offsetSpecs.paperWeightGsm}g {selectedRecipe.offsetSpecs.paperType}</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Acabado / Grapado:</span>
                    <b className="text-theme-main">{selectedRecipe.offsetSpecs.stapleType}</b>
                  </div>
                </div>
              )}

              {/* Flexo Specs */}
              {selectedRecipe.flexoSpecs && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Sustrato / Bobina:</span>
                    <b className="text-theme-main">{selectedRecipe.flexoSpecs.substrate}</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Tintas UV:</span>
                    <b className="font-mono text-theme-primary">{selectedRecipe.flexoSpecs.inksCount} colores ({selectedRecipe.flexoSpecs.cmykOrPantone})</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Suaje rotativo:</span>
                    <b className="text-theme-main">{selectedRecipe.flexoSpecs.dieTeeth} dientes ({selectedRecipe.flexoSpecs.dieRepeat})</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Grabado Casetera:</span>
                    <b className="font-mono text-theme-main">{selectedRecipe.flexoSpecs.engravingRef}</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle/60">
                    <span className="text-theme-muted">Cantidad x Rollo:</span>
                    <b className="font-mono text-theme-main">{selectedRecipe.flexoSpecs.quantityPerRoll.toLocaleString('es-MX')} ejs</b>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-3 text-xs space-y-1">
                <span className="font-bold text-theme-main">Estándares de Ingeniería:</span>
                <p className="text-theme-muted">• Setup estándar: <b>{selectedRecipe.standardSetupMinutes} min</b></p>
                <p className="text-theme-muted">• Merma técnica estimada: <b>{selectedRecipe.standardScrapRatePercent}%</b></p>
                <p className="text-theme-muted">• Máquina preferente: <b>{selectedRecipe.defaultMachine}</b></p>
              </div>
            </div>
          </ProductionCard>
        </div>

        {/* Columna Centro y Derecha: Routing e Insumos Estándar */}
        <div className="lg:col-span-2 space-y-4">
          <ProductionCard>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-theme-muted">Secuencia Operativa</span>
                  <h3 className="text-sm font-black text-theme-main">
                    Routing Maestro ({selectedRecipe.routing.length} Etapas)
                  </h3>
                </div>
                <span className="text-xs text-theme-muted">
                  Máquinas compatibles: {selectedRecipe.compatibleMachines.join(', ')}
                </span>
              </div>

              <div className="space-y-2">
                {selectedRecipe.routing.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-theme-primary/10 font-mono text-[11px] font-bold text-theme-primary">
                        {step.stepNumber}
                      </span>
                      <div>
                        <b className="text-theme-main">{step.process}</b>
                        <span className="block text-[11px] text-theme-muted">
                          Máquina: <b>{step.machine}</b>
                          {step.alternativeMachine && ` (Alt: ${step.alternativeMachine})`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="font-mono text-theme-muted">
                        Setup {step.setupMinutes}m · Corrida {step.runMinutes}m
                      </span>
                      {step.requiresFirstPieceQuality && (
                        <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          ✓ Gate 1ra Pieza
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProductionCard>

          {/* Insumos y Herramental Estándar */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ProductionCard>
              <div className="p-4 space-y-3">
                <span className="text-xs font-black uppercase text-theme-main">Insumos y Materiales Base</span>
                <div className="space-y-1.5 text-xs">
                  {selectedRecipe.standardMaterials.map((m) => (
                    <div key={m.id} className="rounded-lg border border-theme-subtle bg-theme-muted/10 p-2">
                      <b className="text-theme-main">{m.item}</b>
                      <span className="block text-[10px] text-theme-muted">Tipo: {m.type} · Ratio est.: {m.required}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ProductionCard>

            <ProductionCard>
              <div className="p-4 space-y-3">
                <span className="text-xs font-black uppercase text-theme-main">Herramental y Utillaje Requerido</span>
                <div className="space-y-1.5 text-xs">
                  {selectedRecipe.standardTooling.map((t) => (
                    <div key={t.id} className="rounded-lg border border-theme-subtle bg-theme-muted/10 p-2">
                      <b className="text-theme-main">{t.name}</b>
                      <span className="block text-[10px] text-theme-muted">{t.details}</span>
                      {t.teethOrRepeat && (
                        <span className="block font-mono text-[10px] text-theme-primary font-bold">{t.teethOrRepeat}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ProductionCard>
          </div>
        </div>
      </div>
    </div>
  );
};
