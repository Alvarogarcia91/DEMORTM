import React from 'react';
import { ProductionMaterialItem, ToolingRequirement } from '../../data/mockProduccionData';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  materials: ProductionMaterialItem[];
  onChangeMaterials: (materials: ProductionMaterialItem[]) => void;
  tooling: ToolingRequirement[];
  isFlexo: boolean;
}

export const ProductionMaterials: React.FC<Props> = ({
  materials,
  onChangeMaterials,
  tooling,
  isFlexo,
}) => {
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

  return (
    <div className="space-y-6">
      {/* Alerta si falta algún insumo */}
      {hasShortage && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/80 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <b className="font-bold text-sm">Alerta de Insumos / Reserva Parcial</b>
            <p className="mt-1">
              Existen insumos no disponibles en inventario. La OP puede guardarse en Planeación pero se marcará con riesgo de abastecimiento hasta liberar reserva o autorizar sustitutos técnicos.
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
              Validación de stock disponible vs tiraje requerido antes de enviar a planeación.
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
                <th className="p-3 text-center">Simular Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-theme-muted/20">
                  <td className="p-3 font-bold text-theme-main">
                    {m.item}
                    {m.substituteAuthorized && (
                      <span className="block text-[10px] font-normal text-amber-600 dark:text-amber-400 mt-0.5">
                        Sustituto aut.: {m.substituteAuthorized}
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
                    <select
                      value={m.status}
                      onChange={(e) => updateMaterialStatus(m.id, e.target.value as any)}
                      className="rounded-lg border border-theme-subtle bg-theme-surface p-1 text-[11px]"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Parcial">Parcial</option>
                      <option value="Insuficiente">Insuficiente</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
