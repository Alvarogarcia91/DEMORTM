import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Filter,
  PackageX,
  Printer,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { NonConformance } from '../../data/mockCalidadData';

interface Props {
  nonConformances: NonConformance[];
  onOpenLabelPreview?: (opFolio: string, client: string, part: string, lot: string) => void;
  onOpenIcarModal?: (mnc: NonConformance) => void;
  onToast: (msg: string) => void;
}

export const NoConformesWorkspace: React.FC<Props> = ({
  nonConformances,
  onOpenLabelPreview,
  onOpenIcarModal,
  onToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('Todas');

  const filtered = nonConformances.filter(
    (n) => filterStatus === 'Todas' || n.status === filterStatus
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h2 className="text-base font-black text-theme-main">
              Gestión de Material No Conforme (MNC) y Cuarentena HOLD
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Lotes bloqueados visualmente por desviaciones dimensionales, de color, texto o troquel en proceso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
          >
            <option value="Todas">Todas las disposiciones</option>
            <option value="Hold">En Cuarentena (HOLD)</option>
            <option value="Retrabajo">Enviado a Retrabajo</option>
            <option value="Scrap">Baja a Scrap</option>
          </select>
        </div>
      </div>

      {/* Tabla de no conformidades */}
      <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
        <table className="w-full min-w-[950px] text-xs">
          <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3.5 text-left">Folio MNC</th>
              <th className="p-3.5 text-left">Orden / Cliente</th>
              <th className="p-3.5 text-left">Área / Ubicación</th>
              <th className="p-3.5 text-left">Defecto / Causa Raíz</th>
              <th className="p-3.5 text-left">Cantidad</th>
              <th className="p-3.5 text-left">Disposición Actual</th>
              <th className="p-3.5 text-left">Estado</th>
              <th className="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {filtered.map((mnc) => (
              <tr key={mnc.id} className="hover:bg-theme-muted/10 transition-colors">
                <td className="p-3.5">
                  <b className="font-mono text-rose-700 dark:text-rose-400 font-bold block">
                    {mnc.id}
                  </b>
                  <small className="text-theme-muted">{mnc.date || '07 Sep · 09:30'}</small>
                </td>

                <td className="p-3.5">
                  <b className="font-mono text-theme-main block">{mnc.op}</b>
                  <span className="text-theme-muted">{mnc.client}</span>
                </td>

                <td className="p-3.5">
                  <span className="font-bold text-theme-main block">{mnc.area}</span>
                  <small className="text-theme-muted block">{mnc.location}</small>
                </td>

                <td className="p-3.5">
                  <b className="text-theme-main block">{mnc.defect}</b>
                  <small className="text-theme-muted">Severidad: {mnc.severity || 'Mayor'}</small>
                </td>

                <td className="p-3.5 font-mono font-bold text-theme-main">
                  {mnc.quantity.toLocaleString('es-MX')} pzas
                </td>

                <td className="p-3.5">
                  <span className="text-theme-muted text-[11px] block max-w-xs">
                    {mnc.disposition || 'En evaluación técnica con Alicia Ramírez'}
                  </span>
                </td>

                <td className="p-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      mnc.status === 'Hold'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : mnc.status === 'Retrabajo'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    ● {mnc.status}
                  </span>
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {onOpenLabelPreview && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenLabelPreview(
                            mnc.op,
                            mnc.client,
                            mnc.defect,
                            mnc.id
                          )
                        }
                        title="Imprimir rótulo de HOLD FM-QA-180"
                        className="rounded-xl border border-rose-400 p-1.5 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onToast(`Reinspección programada para ${mnc.id} en ${mnc.location}.`)
                      }
                      className="rounded-xl border border-theme-subtle px-2.5 py-1 text-[11px] font-bold text-theme-main hover:bg-theme-muted/30"
                    >
                      Reinspeccionar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenIcarModal) {
                          onOpenIcarModal(mnc);
                        } else {
                          onToast(`Acción Correctiva ICAR abierta formalmente para ${mnc.id}.`);
                        }
                      }}
                      className="rounded-xl border border-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-800 dark:text-rose-200 hover:bg-rose-100"
                    >
                      Abrir ICAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
