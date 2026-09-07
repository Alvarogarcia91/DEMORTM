import React, { useMemo, useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  FileCheck2,
  FileText,
  Filter,
  Layers,
  PackageCheck,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import {
  INCOMING_INSPECTIONS,
  REMNANT_VALIDATIONS,
  IncomingInspection,
  QualityAuditItem,
  QualityStatus,
  RemnantValidation,
} from '../../data/mockCalidadData';

interface Props {
  audits: QualityAuditItem[];
  onOpenAudit: (audit: QualityAuditItem) => void;
  onStartNewAudit: () => void;
  onOpenLabelPreview?: (opFolio: string, client: string, part: string, lot: string) => void;
  onToast?: (msg: string) => void;
}

export const AuditoriasWorkspace: React.FC<Props> = ({
  audits,
  onOpenAudit,
  onStartNewAudit,
  onOpenLabelPreview,
  onToast = () => {},
}) => {
  const [viewMode, setViewMode] = useState<'auditorias' | 'baches' | 'incoming' | 'remanentes'>('auditorias');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todas' | QualityStatus>('Todas');
  const [typeFilter, setTypeFilter] = useState<string>('Todas');
  const [incomings, setIncomings] = useState<IncomingInspection[]>(INCOMING_INSPECTIONS);
  const [remnants, setRemnants] = useState<RemnantValidation[]>(REMNANT_VALIDATIONS);

  // Baches y muestras (Sección 11)
  const batchList = useMemo(() => {
    const list = [
      { id: 'bch-44947', number: 'BCH-44947', op: 'OP-2026-95249', client: 'BLACK & DECKER', part: 'NA472050', produced: 145, partial: 145, sample: 3, defects: 3, status: 'No conforme' as const, packages: '5 paquetes (29 c/u)' },
      { id: 'bch-44948', number: 'BCH-44948', op: 'OP-2026-95252', client: 'TYCO Electronics', part: 'IS-2420', produced: 220, partial: 0, sample: 5, defects: 0, status: 'Pendiente' as const, packages: '8 rollos (27 c/u)' },
      { id: 'bch-44930', number: 'BCH-44930', op: 'OP-2026-95256', client: 'Pentair', part: 'A163833BHA', produced: 500, partial: 500, sample: 13, defects: 0, status: 'Conforme' as const, packages: '20 paquetes (25 c/u)' },
      { id: 'bch-44951', number: 'BCH-44951', op: 'OP-2026-95250', client: 'Panasonic', part: '526412 | G |', produced: 1000, partial: 1000, sample: 13, defects: 0, status: 'Conforme' as const, packages: '10 rollos (100 c/u)' },
    ];
    return list;
  }, []);

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
            Inspección operativa: primeras piezas, controles en proceso (&gt;2h), baches/muestreo AQL, incoming y remanentes.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewAudit}
          className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
        >
          <Plus className="h-4 w-4" /> Nueva Auditoría
        </button>
      </div>

      {/* Sub-Pills de Vista Operativa */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto">
          {[
            { id: 'auditorias', label: 'Auditorías de Proceso & Gates', count: audits.length },
            { id: 'baches', label: 'Baches & Muestras AQL', count: batchList.length },
            { id: 'incoming', label: 'Incoming / Materia Prima', count: incomings.length },
            { id: 'remanentes', label: 'Validación de Remanentes', count: remnants.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewMode(tab.id as any)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                viewMode === tab.id
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'border border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/30'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 rounded-full bg-theme-muted/30 px-1.5 py-0.2 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Búsqueda rápida si está en modo auditorías */}
        {viewMode === 'auditorias' && (
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        )}
      </div>

      {/* VISTA 1: TABLA DE AUDITORÍAS */}
      {viewMode === 'auditorias' && (
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
      )}

      {/* VISTA 2: BACHES Y MUESTREO AQL (Sección 11 del documento) */}
      {viewMode === 'baches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-theme-primary" />
              <span className="font-bold text-theme-main">Plan de Muestreo AQL 0.65 (Nivel Especial S-3 / Normal G-II · Demo RTM)</span>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Control por bache independiente</span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
            <table className="w-full min-w-[900px] text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Bache / Identificador</th>
                  <th className="p-3 text-left">Orden & Cliente</th>
                  <th className="p-3 text-left">Cantidad Producida</th>
                  <th className="p-3 text-left">Parcial Entregado</th>
                  <th className="p-3 text-left">Muestra AQL</th>
                  <th className="p-3 text-left">Resultado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {batchList.map((b) => (
                  <tr key={b.id} className="hover:bg-theme-muted/10 transition-colors">
                    <td className="p-3">
                      <b className="font-mono text-theme-primary font-black text-xs block">{b.number}</b>
                      <small className="text-theme-muted block">{b.packages}</small>
                    </td>

                    <td className="p-3">
                      <b className="font-mono text-theme-main block">{b.op}</b>
                      <span className="text-theme-muted text-[11px] block">{b.client} · {b.part}</span>
                    </td>

                    <td className="p-3 font-mono font-bold text-theme-main">
                      {b.produced.toLocaleString()} ejs
                    </td>

                    <td className="p-3 font-mono">
                      <span className={b.partial > 0 ? 'text-emerald-600 font-bold' : 'text-theme-muted'}>
                        {b.partial.toLocaleString()} ejs
                      </span>
                    </td>

                    <td className="p-3 font-mono">
                      <span className="rounded-md bg-theme-muted/20 px-2 py-0.5 font-bold text-theme-main">
                        {b.sample} muestras
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          b.status === 'No conforme'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : b.status === 'Pendiente'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        ● {b.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenLabelPreview && (
                          <button
                            type="button"
                            onClick={() => onOpenLabelPreview(b.op, b.client, b.part, b.number)}
                            className="rounded-xl border border-theme-subtle p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-muted/30"
                            title="Imprimir etiqueta de bache Zebra"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const aud = audits.find((a) => a.origin === b.op);
                            if (aud) onOpenAudit(aud);
                            else onToast(`Bache ${b.number} abierto para inspección AQL.`);
                          }}
                          className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
                        >
                          {b.status === 'Pendiente' ? '[Auditar muestra]' : '[Ver bache]'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: INCOMING / INSPECCIÓN DE MATERIA PRIMA (Sección 8 del documento) */}
      {viewMode === 'incoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-theme-primary" />
              <span className="font-bold text-theme-main">Inspección de Entrada (Materia Prima / Sustratos y Tintas)</span>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Control de recepción en andén</span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
            <table className="w-full min-w-[950px] text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Folio & Proveedor</th>
                  <th className="p-3 text-left">Material & Lote Prov.</th>
                  <th className="p-3 text-left">Lote RTM & Recibido</th>
                  <th className="p-3 text-left">CoA / Certificado</th>
                  <th className="p-3 text-left">Espesor / Viscosidad</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {incomings.map((inc) => (
                  <tr key={inc.id} className="hover:bg-theme-muted/10 transition-colors">
                    <td className="p-3">
                      <b className="font-mono text-theme-primary font-bold block">{inc.id}</b>
                      <span className="font-bold text-theme-main block">{inc.supplier}</span>
                      <small className="font-mono text-theme-muted">{inc.poFolio}</small>
                    </td>

                    <td className="p-3">
                      <b className="text-theme-main block">{inc.material}</b>
                      <small className="font-mono text-theme-muted">Lote Prov: {inc.supplierLot}</small>
                    </td>

                    <td className="p-3 font-mono">
                      <b className="text-theme-main block text-[11px]">{inc.rtmLot}</b>
                      <small className="text-theme-muted block">{inc.receivedQty} de {inc.orderedQty}</small>
                    </td>

                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        inc.coaAttached ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {inc.coaAttached ? '✓ CoA Válido' : 'Falta CoA'}
                      </span>
                    </td>

                    <td className="p-3 font-mono">
                      <span className="text-theme-main block">{inc.thicknessMeasured}</span>
                    </td>

                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        inc.status === 'Liberado'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : inc.status === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        ● {inc.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {inc.status === 'Pendiente' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIncomings((prev) =>
                                prev.map((i) => (i.id === inc.id ? { ...i, status: 'Liberado' } : i))
                              );
                              onToast(`✓ Lote ${inc.rtmLot} (${inc.material}) liberado para producción.`);
                            }}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                          >
                            Liberar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIncomings((prev) =>
                                prev.map((i) => (i.id === inc.id ? { ...i, status: 'HOLD / Rechazado' } : i))
                              );
                              onToast(`⚠️ Lote ${inc.rtmLot} enviado a HOLD / Cuarentena.`);
                            }}
                            className="rounded-xl border border-rose-400 px-2.5 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50"
                          >
                            HOLD
                          </button>
                        </div>
                      ) : (
                        <span className="text-theme-muted font-bold text-[11px]">Dictamen emitido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 4: VALIDACIÓN DE REMANENTES (Sección 9 del documento) */}
      {viewMode === 'remanentes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-theme-primary" />
              <span className="font-bold text-theme-main">Validación Técnica de Remanentes (Dictamen de Calidad)</span>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Calidad autoriza aptitud para reutilizar</span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
            <table className="w-full min-w-[950px] text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Código Remanente</th>
                  <th className="p-3 text-left">Sustrato & Lote</th>
                  <th className="p-3 text-left">Metraje & Ancho</th>
                  <th className="p-3 text-left">Condición & Tack</th>
                  <th className="p-3 text-left">Restricción Cliente</th>
                  <th className="p-3 text-left">Dictamen QA</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {remnants.map((rem) => (
                  <tr key={rem.id} className="hover:bg-theme-muted/10 transition-colors">
                    <td className="p-3 font-mono">
                      <b className="text-theme-primary font-bold block">{rem.remnantCode}</b>
                      <small className="text-theme-muted">OP Origen: {rem.originOp}</small>
                    </td>

                    <td className="p-3">
                      <b className="text-theme-main block">{rem.substrate}</b>
                      <small className="font-mono text-theme-muted">Lote: {rem.lot}</small>
                    </td>

                    <td className="p-3 font-mono font-bold text-theme-main">
                      {rem.remainingFt} ft ({rem.widthMm} mm)
                    </td>

                    <td className="p-3">
                      <span className="text-theme-main font-bold block">{rem.visualCondition}</span>
                      <small className={rem.adhesiveTested ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {rem.adhesiveTested ? '✓ Adhesión verificada' : 'Sin prueba de adhesión'}
                      </small>
                    </td>

                    <td className="p-3 text-theme-muted max-w-xs text-[11px]">
                      {rem.clientRestriction}
                    </td>

                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rem.dictamen === 'Apto para reutilizar'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : rem.dictamen === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        ● {rem.dictamen}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {rem.dictamen === 'Pendiente' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setRemnants((prev) =>
                                prev.map((r) => (r.id === rem.id ? { ...r, dictamen: 'Apto para reutilizar' } : r))
                              );
                              onToast(`✓ Remanente ${rem.remnantCode} dictaminado APTO para reutilizar.`);
                            }}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                          >
                            Apto
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRemnants((prev) =>
                                prev.map((r) => (r.id === rem.id ? { ...r, dictamen: 'No apto / Scrap' } : r))
                              );
                              onToast(`⚠️ Remanente ${rem.remnantCode} dictaminado NO APTO (Scrap).`);
                            }}
                            className="rounded-xl border border-rose-400 px-2.5 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50"
                          >
                            Scrap
                          </button>
                        </div>
                      ) : (
                        <span className="text-theme-muted font-bold text-[11px]">{rem.destination}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
