import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Layers,
  Search,
  Shield,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import {
  PpapCase,
  PpapProcessArea,
  PpapStatus,
  filterPpapCases,
} from '../../../data/mockPpapData';

interface Props {
  cases: PpapCase[];
  onOpenCase: (ppapCase: PpapCase, initialTab?: string) => void;
}

export const PpapCasesList: React.FC<Props> = ({ cases, onOpenCase }) => {
  const [clientFilter, setClientFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Clientes únicos
  const clients = useMemo(() => {
    const set = new Set(cases.map((c) => c.client));
    return ['Todos', ...Array.from(set)];
  }, [cases]);

  // Casos filtrados
  const filteredCases = useMemo(() => {
    return filterPpapCases(cases, clientFilter, statusFilter, areaFilter, searchQuery);
  }, [cases, clientFilter, statusFilter, areaFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Búsqueda */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-theme-muted" />
            <input
              type="text"
              placeholder="Buscar por parte, cliente, folio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-theme-subtle bg-theme-base pl-9 pr-8 py-2 text-xs text-theme-main placeholder:text-theme-muted focus:outline-hidden focus:ring-1 focus:ring-theme-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-main"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filtro Cliente */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="rounded-xl border border-theme-subtle bg-theme-base px-3 py-2 text-xs font-semibold text-theme-main focus:outline-hidden"
          >
            {clients.map((c) => (
              <option key={c} value={c}>
                {c === 'Todos' ? 'Todos los Clientes' : c}
              </option>
            ))}
          </select>

          {/* Filtro Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-theme-subtle bg-theme-base px-3 py-2 text-xs font-semibold text-theme-main focus:outline-hidden"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="En preparación">En preparación</option>
            <option value="En revisión con Calidad">En revisión con Calidad</option>
            <option value="Pendiente de información">Pendiente de información</option>
            <option value="Pendiente del cliente">Pendiente del cliente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Requiere actualización">Requiere actualización</option>
          </select>

          {/* Filtro Proceso */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-xl border border-theme-subtle bg-theme-base px-3 py-2 text-xs font-semibold text-theme-main focus:outline-hidden"
          >
            <option value="Todas">Todos los Procesos</option>
            <option value="Flexografía">Flexografía</option>
            <option value="Offset">Offset</option>
            <option value="Acabados">Acabados</option>
          </select>
        </div>

        <span className="text-[11px] font-bold text-theme-muted shrink-0">
          Mostrando <b className="text-theme-main">{filteredCases.length}</b> de {cases.length} expedientes
        </span>
      </div>

      {/* Tabla / Lista de Expedientes */}
      <div className="overflow-hidden rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-muted/10 text-[10px] uppercase font-black tracking-wider text-theme-muted border-b border-theme-subtle">
              <tr>
                <th className="p-3.5">Expediente / Cliente</th>
                <th className="p-3.5">Parte / Revisión</th>
                <th className="p-3.5">Nivel & Proceso</th>
                <th className="p-3.5">Avance</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5">Responsable</th>
                <th className="p-3.5">Fecha Meta</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredCases.map((item) => {
                const isComplete = item.completionPercentage === 100;
                const isWarning = item.status === 'Requiere actualización' || item.status === 'En preparación';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onOpenCase(item)}
                    className="hover:bg-theme-muted/15 transition-colors cursor-pointer group"
                  >
                    {/* Folio & Cliente */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary/10 text-theme-primary font-bold text-[10px]">
                          {item.processArea === 'Flexografía' ? 'FLX' : 'OFS'}
                        </span>
                        <div>
                          <p className="font-bold text-theme-main">{item.client}</p>
                          <span className="font-mono text-[10px] text-theme-muted font-medium">
                            {item.folio} · {item.family}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Parte / Revisión */}
                    <td className="p-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-black text-theme-main">{item.partNumber}</span>
                        <span className="rounded bg-theme-muted/30 px-1.5 py-0.2 text-[9px] font-bold text-theme-main">
                          {item.revision}
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-muted line-clamp-1 max-w-[220px]">
                        {item.partName}
                      </p>
                    </td>

                    {/* Nivel & Proceso */}
                    <td className="p-3.5">
                      <span className="font-semibold text-theme-main block">
                        Nivel {item.submissionLevel} · {item.processArea}
                      </span>
                      <span className="text-[10px] text-theme-muted">
                        {item.submissionReason}
                      </span>
                    </td>

                    {/* Avance */}
                    <td className="p-3.5 w-36">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-theme-main">{item.completionPercentage}%</span>
                          <span className="text-theme-muted">
                            {isComplete ? 'Completo ✓' : `${Math.round(item.checklist.filter(c => c.status === 'Completo').length)}/18 items`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-theme-muted/20">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isComplete
                                ? 'bg-emerald-500'
                                : item.completionPercentage >= 80
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                          item.status === 'Aprobado'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.status === 'Pendiente del cliente'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : item.status === 'En revisión con Calidad'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : item.status === 'Pendiente de información'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Responsable */}
                    <td className="p-3.5">
                      <span className="text-[11px] font-medium text-theme-main block">
                        {item.owner}
                      </span>
                      <span className="text-[10px] text-theme-muted">
                        Act: {item.lastUpdated.split('·')[0]}
                      </span>
                    </td>

                    {/* Fecha Meta */}
                    <td className="p-3.5 font-mono text-xs font-semibold text-theme-main">
                      {item.targetDate}
                    </td>

                    {/* Acción */}
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onOpenCase(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-base px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-primary hover:text-white transition-all shadow-2xs group-hover:border-theme-primary"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver 360
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-theme-muted">
                    No se encontraron expedientes con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
