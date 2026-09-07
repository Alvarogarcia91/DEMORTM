import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  Clock,
  Layers,
  PackageCheck,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { QualityRelease, QualityStatus } from '../../data/mockCalidadData';

interface Props {
  releases: QualityRelease[];
  onOpenRelease: (release: QualityRelease) => void;
  onOpenLabelPreview?: (opFolio: string, client: string, part: string, lot: string) => void;
}

export const LiberacionesWorkspace: React.FC<Props> = ({
  releases,
  onOpenRelease,
  onOpenLabelPreview,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'Todas' | 'Primera pieza' | 'Auditoría final' | 'En proceso'>('Todas');

  const filteredReleases = releases.filter((r) => {
    const matchesQuery =
      `${r.op} ${r.cliente} ${r.part} ${r.event}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesType =
      filterType === 'Todas' ||
      (filterType === 'Primera pieza' && r.event === 'Primera pieza') ||
      (filterType === 'Auditoría final' && (r.event === 'Auditoría final' || r.event === 'Liberación PT')) ||
      (filterType === 'En proceso' && (r.event.includes('Control') || r.event.includes('bobina')));
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-theme-primary" />
            <h2 className="text-base font-black text-theme-main">
              Centro de Liberaciones de Calidad (Gates Operativos)
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Autorización mandatoria de primeras piezas para arrancar tiraje y liberación final de lotes para traspaso a PT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar orden o cliente..."
              className="w-48 sm:w-64 rounded-xl border border-theme-subtle bg-theme-surface py-2 pl-8 pr-3 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
          >
            <option value="Todas">Todas las liberaciones</option>
            <option value="Primera pieza">Primera pieza (Gate arranque)</option>
            <option value="Auditoría final">Auditoría final (Liberación PT)</option>
            <option value="En proceso">En proceso (&gt;2h, bobina)</option>
          </select>
        </div>
      </div>

      {/* Tabla de liberaciones */}
      <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
        <table className="w-full min-w-[1000px] text-xs">
          <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3.5 text-left">Evento de Liberación</th>
              <th className="p-3.5 text-left">Orden / Pedido</th>
              <th className="p-3.5 text-left">Cliente / No. Parte</th>
              <th className="p-3.5 text-left">Línea & Operador</th>
              <th className="p-3.5 text-left">Lote & Auditor</th>
              <th className="p-3.5 text-left">Espera</th>
              <th className="p-3.5 text-left">Estado</th>
              <th className="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {filteredReleases.map((release) => {
              const isPending = release.status === 'Pendiente' || release.status === 'En inspección';
              const isLiberado = release.status === 'Liberado' || release.status === 'Conforme';
              const isReject = release.status === 'No conforme';

              return (
                <tr key={release.id} className="hover:bg-theme-muted/10 transition-colors">
                  <td className="p-3.5">
                    <b className="text-theme-main block font-bold text-xs">{release.event}</b>
                    <small className="font-mono text-theme-muted">{release.id}</small>
                  </td>

                  <td className="p-3.5 font-mono">
                    <b className="text-theme-main block">{release.op}</b>
                    <small className="text-theme-muted">{release.pedido}</small>
                  </td>

                  <td className="p-3.5">
                    <b className="text-theme-main block font-bold">{release.cliente}</b>
                    <small className="text-theme-muted block">
                      {release.part} · {release.revision}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span className="text-theme-main font-bold block">{release.line}</span>
                    <small className="text-theme-muted block">
                      {release.area} · Op: {release.operator}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span className="font-mono font-bold text-theme-main block text-[11px]">
                      {release.lot}
                    </span>
                    <small className="text-theme-muted block">Aud: {release.auditor}</small>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`font-bold ${
                        release.waiting.includes('min') ? 'text-amber-700' : 'text-theme-muted'
                      }`}
                    >
                      {release.waiting}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isReject
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      ● {release.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isLiberado && onOpenLabelPreview && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenLabelPreview(
                              release.op,
                              release.cliente,
                              release.part,
                              release.lot
                            )
                          }
                          title="Imprimir etiquetas Zebra"
                          className="rounded-xl border border-theme-subtle p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-muted/30"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onOpenRelease(release)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition-all ${
                          isPending
                            ? 'bg-theme-primary text-white hover:bg-theme-primary/90'
                            : 'border border-theme-subtle bg-theme-surface text-theme-main hover:bg-theme-muted/30'
                        }`}
                      >
                        {isPending ? 'Dictaminar' : 'Ver detalle'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
