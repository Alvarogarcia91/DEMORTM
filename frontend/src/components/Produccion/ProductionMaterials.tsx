import React, { useState } from 'react';
import { MaterialDeviation, ProductionMaterialItem, ToolingRequirement } from '../../data/mockProduccionData';
import { AlertTriangle, CheckCircle2, FileSignature, ShieldAlert, XCircle } from 'lucide-react';

interface Props {
  materials: ProductionMaterialItem[];
  onChangeMaterials: (materials: ProductionMaterialItem[]) => void;
  tooling: ToolingRequirement[];
  isFlexo: boolean;
  activeDeviation?: MaterialDeviation;
  onApplyDeviation?: (deviation: MaterialDeviation) => void;
}

export const ProductionMaterials: React.FC<Props> = ({
  materials,
  onChangeMaterials,
  tooling,
  isFlexo,
  activeDeviation,
  onApplyDeviation,
}) => {
  const [deviationModalItem, setDeviationModalItem] = useState<ProductionMaterialItem | null>(null);
  const [substituteInput, setSubstituteInput] = useState('Papel Bond 70g 57x87 cm');
  const [deviationReason, setDeviationReason] = useState('Desabasto de fabricante en gramaje 60g. Sustituto con calibre equivalente aprobado.');

  const hasShortage = materials.some((m) => m.status === 'Insuficiente' || m.status === 'Parcial');
  const hasToolingPending = tooling.some((t) => t.status === 'Pendiente');

  const updateMaterialStatus = (id: string, status: 'Disponible' | 'Parcial' | 'Insuficiente') => {
    const updated = materials.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status,
          reserved: status === 'Insuficiente' ? '0 kg / m' : m.required,
          delivered: status === 'Insuficiente' ? '0 kg / m' : m.required,
        };
      }
      return m;
    });
    onChangeMaterials(updated);
  };

  const handleCreateDeviation = () => {
    if (!deviationModalItem || !onApplyDeviation) return;
    const newDev: MaterialDeviation = {
      id: `dev-${Date.now()}`,
      deviationNumber: `DV-2026-${Math.floor(100 + Math.random() * 900)}`,
      originalMaterial: deviationModalItem.item,
      substituteMaterial: substituteInput,
      reason: deviationReason,
      requestedBy: 'Planner Producción RTM',
      authorizedBy: 'Alicia Ramírez (Calidad)',
      status: 'Aprobada por Calidad/Cliente',
      date: '07 Sep 2026',
      notes: 'Autorizada corrida con sustituto técnico. OP desbloqueada.',
    };

    onApplyDeviation(newDev);

    // Actualizar el material a disponible con el sustituto
    const updated = materials.map((m) => {
      if (m.id === deviationModalItem.id) {
        return {
          ...m,
          item: `${substituteInput} (Sustituto bajo ${newDev.deviationNumber})`,
          status: 'Disponible' as const,
          reserved: m.required,
        };
      }
      return m;
    });
    onChangeMaterials(updated);
    setDeviationModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Alerta si falta algún insumo */}
      {hasShortage && !activeDeviation && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/80 bg-rose-50/70 dark:bg-rose-950/30 p-4 text-xs text-rose-900 dark:text-rose-200">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <b className="font-bold text-sm">OP BLOQUEADA PARA LIBERAR A PISO (Falta de Insumos)</b>
            <p>
              Existen insumos no disponibles en inventario. Para desbloquear la orden se requiere generar orden de compra a Compras o tramitar una <b>Desviación de Proceso/Material</b> con Calidad.
            </p>
          </div>
        </div>
      )}

      {/* Desviación Aprobada Banner */}
      {activeDeviation && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/80 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <b className="font-bold text-sm">
              Desviación {activeDeviation.deviationNumber} · {activeDeviation.status}
            </b>
            <p className="mt-0.5 text-[11px]">
              Sustituto: <b>{activeDeviation.substituteMaterial}</b> en reemplazo de <i>{activeDeviation.originalMaterial}</i>. Autorizado por {activeDeviation.authorizedBy}.
            </p>
          </div>
        </div>
      )}

      {hasToolingPending && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/80 bg-rose-50/70 dark:bg-rose-950/30 p-4 text-xs text-rose-900 dark:text-rose-200">
          <XCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <b className="font-bold text-sm">Herramental Pendiente de Liberación</b>
            <p className="mt-1">
              El suaje rotativo o placas/grabado están pendientes en taller. No podrá marcarse como "Lista para producir" en Piso sin liberación técnica.
            </p>
          </div>
        </div>
      )}

      {/* Tabla de Materiales e Insumos */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
              Insumos Calculados y Disponibilidad de Inventario
            </h3>
            <p className="text-xs text-theme-muted">
              Validación de stock disponible vs tiraje requerido. Si falta material se bloquea pase a piso o se genera desviación.
            </p>
          </div>
          <span className="rounded-lg bg-theme-muted/50 px-2.5 py-1 text-xs font-mono font-bold text-theme-main">
            {materials.length} Insumos críticos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-xs">
            <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-3 text-left">Insumo</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Requerido</th>
                <th className="p-3 text-left">Reservado</th>
                <th className="p-3 text-left">Disponible</th>
                <th className="p-3 text-left">Lote Asignado</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acciones / Sustituto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-theme-muted/20">
                  <td className="p-3 font-bold text-theme-main">
                    {m.item}
                    {m.substituteAuthorized && (
                      <span className="block text-[10px] font-normal text-amber-600 dark:text-amber-400 mt-0.5">
                        Sustituto sugerido: {m.substituteAuthorized}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-theme-muted">{m.type}</td>
                  <td className="p-3 font-mono font-bold">{m.required}</td>
                  <td className="p-3 font-mono text-theme-main">{m.reserved}</td>
                  <td className="p-3 font-mono text-theme-muted">{m.available}</td>
                  <td className="p-3 font-mono text-[11px] text-theme-muted">{m.lot ?? 'Por asignar'}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        m.status === 'Disponible'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                          : m.status === 'Parcial'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                      }`}
                    >
                      {m.status === 'Disponible' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-rose-600" />
                      )}
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <select
                        value={m.status}
                        onChange={(e) => updateMaterialStatus(m.id, e.target.value as any)}
                        className="rounded-lg border border-theme-subtle bg-theme-surface p-1 text-[10px]"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Parcial">Parcial</option>
                        <option value="Insuficiente">Insuficiente</option>
                      </select>

                      {m.status !== 'Disponible' && onApplyDeviation && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeviationModalItem(m);
                            setSubstituteInput(m.substituteAuthorized || 'Papel Bond 70g 57x87 cm');
                          }}
                          className="rounded-lg bg-amber-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-amber-700"
                        >
                          Evaluar Desviación
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para tramitar Desviación de Material (Sección 4 de la auditoría) */}
      {deviationModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-theme-subtle pb-3">
              <div>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-amber-600">
                  GESTIÓN DE DESVIACIONES · CONTROL DE CALIDAD
                </span>
                <h3 className="text-base font-black text-theme-main mt-1">
                  Evaluar Sustituto de Material / Desviación
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeviationModalItem(null)}
                className="text-theme-muted hover:text-theme-main"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-3">
                <span className="text-theme-muted">Material Original (Insuficiente):</span>
                <b className="block text-theme-main mt-0.5">{deviationModalItem.item}</b>
              </div>

              <label className="block">
                <span className="font-semibold text-theme-muted">Material Sustituto Autorizable</span>
                <input
                  type="text"
                  value={substituteInput}
                  onChange={(e) => setSubstituteInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-main"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-theme-muted">Motivo / Causa Técnica de la Desviación</span>
                <textarea
                  rows={2}
                  value={deviationReason}
                  onChange={(e) => setDeviationReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
                />
              </label>

              <div className="rounded-xl border border-blue-400/40 bg-blue-50/40 dark:bg-blue-950/20 p-3 text-[11px] text-blue-900 dark:text-blue-200">
                <FileSignature className="h-4 w-4 inline mr-1 text-blue-600" />
                Al aprobar la desviación demo, se registrará el folio DV con firma de Calidad (Alicia Ramírez) y la orden quedará habilitada para programarse en Planeación y Piso.
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-theme-subtle pt-4">
              <button
                type="button"
                onClick={() => setDeviationModalItem(null)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateDeviation}
                className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                ✓ Aprobar Desviación y Asignar Sustituto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Herramental requerido */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
          <div>
            <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
              Herramental y Utillaje
            </h3>
            <p className="text-xs text-theme-muted">
              {isFlexo
                ? 'Validación de grabado (clichés polímeros) y suaje rotativo RTM'
                : 'Validación de placas CTP agfa y herramental de encuadernación'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-theme-primary">
            {tooling.length} Items
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {tooling.map((tool) => (
            <div
              key={tool.id}
              className="flex items-start justify-between rounded-xl border border-theme-subtle bg-theme-muted/20 p-3.5 text-xs"
            >
              <div>
                <span className="font-bold text-theme-main">{tool.name}</span>
                <span className="block text-[11px] text-theme-muted mt-1">{tool.details}</span>
                {tool.teethOrRepeat && (
                  <span className="mt-1 block font-mono text-[11px] text-theme-primary font-semibold">
                    {tool.teethOrRepeat}
                  </span>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tool.status === 'Disponible' || tool.status === 'Liberado'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                }`}
              >
                ● {tool.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
