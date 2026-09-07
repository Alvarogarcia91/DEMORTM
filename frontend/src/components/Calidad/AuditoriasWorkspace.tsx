import React, { useMemo, useState } from 'react';
import {
  FileCheck2,
  Filter,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { QualityAuditItem, QualityStatus } from '../../data/mockCalidadData';

interface Props {
  audits: QualityAuditItem[];
  onOpenAudit: (audit: QualityAuditItem) => void;
  onStartNewAudit: () => void;
  onOpenLabelPreview?: (opFolio: string, client: string, part: string, lot: string) => void;
}

export const AuditoriasWorkspace: React.FC<Props> = ({
  audits,
  onOpenAudit,
  onStartNewAudit,
  onOpenLabelPreview,
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todas' | QualityStatus>('Todas');
  const [typeFilter, setTypeFilter] = useState<string>('Todas');

  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchesQuery =
        `${a.folio} ${a.origin} ${a.client} ${a.part} ${a.type}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'Todas' || a.status === statusFilter;
      const matchesType = typeFilter === 'Todas' || a.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [audits, query, statusFilter, typeFilter]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header y Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-theme-primary" />
            <h2 className="text-base font-black text-theme-main">
              Workspace de Auditorías de Calidad
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Registro, ejecución y dictamen de primeras piezas, controles en proceso (&gt;2h), auditorías finales e incoming.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar folio, OP, cliente..."
              className="w-44 sm:w-56 rounded-xl border border-theme-subtle bg-theme-surface py-2 pl-8 pr-3 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
          >
            <option value="Todas">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En inspección">En inspección</option>
            <option value="Conforme">Conforme</option>
            <option value="No conforme">No conforme / HOLD</option>
            <option value="Liberado">Liberado</option>
          </select>

          {/* Filtro por tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
          >
            <option value="Todas">Todos los tipos</option>
            <option value="Primera pieza">Primera pieza</option>
            <option value="Control > 2 horas">Control &gt; 2 horas</option>
            <option value="Auditoría final">Auditoría final</option>
            <option value="Incoming">Incoming</option>
            <option value="Validación de remanente">Validación de remanente</option>
            <option value="Preimpresión">Preimpresión</option>
          </select>

          <button
            type="button"
            onClick={onStartNewAudit}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
          >
            <Plus className="h-4 w-4" /> Nueva Auditoría
          </button>
        </div>
      </div>

      {/* Tabla de auditorías */}
      <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
        <table className="w-full min-w-[1000px] text-xs">
          <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3.5 text-left">Folio / Tipo</th>
              <th className="p-3.5 text-left">Origen (OP / OC)</th>
              <th className="p-3.5 text-left">Cliente / Parte</th>
              <th className="p-3.5 text-left">Área / Línea</th>
              <th className="p-3.5 text-left">Auditor</th>
              <th className="p-3.5 text-left">Hora / Espera</th>
              <th className="p-3.5 text-left">Estado</th>
              <th className="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {filteredAudits.map((audit) => {
              const isPending = audit.status === 'Pendiente' || audit.status === 'En inspección';
              const isReject = audit.status === 'No conforme';
              const isApproved = audit.status === 'Conforme' || audit.status === 'Liberado';

              return (
                <tr key={audit.id} className="hover:bg-theme-muted/10 transition-colors">
                  <td className="p-3.5">
                    <b className="font-mono text-theme-primary block font-black">{audit.folio}</b>
                    <span className="font-bold text-theme-main text-xs">{audit.type}</span>
                  </td>

                  <td className="p-3.5 font-mono">
                    <b className="text-theme-main text-xs">{audit.origin}</b>
                    <small className="block text-theme-muted">{audit.operationType}</small>
                  </td>

                  <td className="p-3.5">
                    <b className="text-theme-main block font-bold">{audit.client}</b>
                    <small className="text-theme-muted block">
                      {audit.part} · {audit.revision}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span className="text-theme-main font-bold block">{audit.line}</span>
                    <small className="text-theme-muted block">{audit.area}</small>
                  </td>

                  <td className="p-3.5">
                    <span className="text-theme-main font-bold">{audit.auditor}</span>
                    <small className="block text-theme-muted">Op: {audit.operator}</small>
                  </td>

                  <td className="p-3.5">
                    <span className="font-mono font-bold text-theme-main block">{audit.scheduledAt}</span>
                    <small
                      className={`block ${
                        audit.waitingMinutes > 15 ? 'text-amber-700 font-bold' : 'text-theme-muted'
                      }`}
                    >
                      {audit.waitingMinutes > 0 ? `Espera: ${audit.waitingMinutes} min` : 'Atendida'}
                    </small>
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
                      ● {audit.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isApproved && onOpenLabelPreview && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenLabelPreview(
                              audit.origin,
                              audit.client,
                              audit.part,
                              `PT-${audit.folio}`
                            )
                          }
                          title="Imprimir etiquetas térmicas Zebra"
                          className="rounded-xl border border-theme-subtle p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-muted/30"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onOpenAudit(audit)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition-all ${
                          isPending
                            ? 'bg-theme-primary text-white hover:bg-theme-primary/90'
                            : 'border border-theme-subtle bg-theme-surface text-theme-main hover:bg-theme-muted/30'
                        }`}
                      >
                        {isPending ? 'Auditar' : 'Ver dictamen'}
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
