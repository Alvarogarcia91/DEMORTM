import React, { useState, useMemo } from 'react';
import {
  Kanban, Filter, Search, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle, AlertTriangle, FileText, User,
  Calendar, ArrowRight, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { CrmOpportunity, CrmStage, CrmLine, formatMxn } from '../../../data/mockCrmData';

interface CrmPipelineProps {
  opportunities: CrmOpportunity[];
  onSelectOpportunity: (opportunity: CrmOpportunity) => void;
  onUpdateStage: (id: string, stage: CrmStage) => void;
  onStartQuote?: (opp: CrmOpportunity) => void;
  onOpenQuote?: (quoteId: string) => void;
}

const STAGES: { key: CrmStage; label: string; color: string; bgBadge: string }[] = [
  { key: 'Calificado', label: '1. Calificado', color: 'border-t-blue-500', bgBadge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  { key: 'Levantamiento', label: '2. Levantamiento', color: 'border-t-amber-500', bgBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  { key: 'Cotización', label: '3. Cotización', color: 'border-t-purple-500', bgBadge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  { key: 'Negociación', label: '4. Negociación', color: 'border-t-indigo-500', bgBadge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  { key: 'Ganada', label: '5. Cierre / Ganada', color: 'border-t-emerald-500', bgBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
];

export const CrmPipeline: React.FC<CrmPipelineProps> = ({
  opportunities,
  onSelectOpportunity,
  onUpdateStage,
  onStartQuote,
  onOpenQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [selectedLine, setSelectedLine] = useState('Todas');
  const [showLostList, setShowLostList] = useState(false);

  // Filtered opps
  const filteredOpps = useMemo(() => {
    return opportunities.filter((o) => {
      const matchSearch =
        o.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.folio.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSeller = selectedSeller === 'Todos' || o.seller === selectedSeller;
      const matchLine = selectedLine === 'Todas' || o.line === selectedLine;

      return matchSearch && matchSeller && matchLine;
    });
  }, [opportunities, searchTerm, selectedSeller, selectedLine]);

  // Sellers
  const sellers = useMemo(() => {
    return Array.from(new Set(opportunities.map((o) => o.seller))).filter(Boolean);
  }, [opportunities]);

  // Lost opportunities
  const lostOpps = useMemo(() => {
    return filteredOpps.filter((o) => o.stage === 'Perdida');
  }, [filteredOpps]);

  const activeOpps = useMemo(() => {
    return filteredOpps.filter((o) => o.stage !== 'Perdida');
  }, [filteredOpps]);

  // Stage advancement helper
  const getNextStage = (current: CrmStage): CrmStage | null => {
    const sequence: CrmStage[] = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada'];
    const idx = sequence.indexOf(current);
    if (idx >= 0 && idx < sequence.length - 1) return sequence[idx + 1];
    return null;
  };

  const getPrevStage = (current: CrmStage): CrmStage | null => {
    const sequence: CrmStage[] = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada'];
    const idx = sequence.indexOf(current);
    if (idx > 0) return sequence[idx - 1];
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
            <input
              type="text"
              placeholder="Buscar en pipeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Line Filter */}
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todas">Todas las líneas</option>
            <option value="Maquinado CNC">Maquinado CNC</option>
            <option value="Fabricación y Soldadura">Fabricación y Soldadura</option>
            <option value="Automatización">Automatización</option>
            <option value="Pintura y Recubrimientos">Pintura y Recubrimientos</option>
            <option value="Ensamble e Integración">Ensamble e Integración</option>
          </select>

          {/* Seller Filter */}
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todos">Todos los vendedores</option>
            {sellers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {(searchTerm || selectedSeller !== 'Todos' || selectedLine !== 'Todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSeller('Todos');
                setSelectedLine('Todas');
              }}
              className="p-1.5 text-theme-muted hover:text-theme-primary rounded border border-theme-subtle text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        {/* Toggle Lost view */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLostList(!showLostList)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              showLostList
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300'
                : 'bg-theme-base border-theme-subtle text-theme-muted hover:text-theme-primary'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Oportunidades Perdidas ({lostOpps.length})</span>
          </button>
        </div>
      </div>

      {/* Lost opportunities banner drawer if active */}
      {showLostList && (
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                Auditoría de Oportunidades Perdidas ({lostOpps.length})
              </h4>
            </div>
            <span className="text-xs text-rose-700 dark:text-rose-400 font-mono">
              Total perdido: {formatMxn(lostOpps.reduce((sum, o) => sum + o.amount, 0))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lostOpps.length === 0 ? (
              <p className="text-xs text-theme-muted py-4 col-span-3 text-center">
                No hay oportunidades marcadas como perdidas con estos filtros.
              </p>
            ) : (
              lostOpps.map((o) => (
                <div
                  key={o.id}
                  onClick={() => onSelectOpportunity(o)}
                  className="bg-theme-card border border-rose-200 dark:border-rose-900/40 rounded-xl p-3.5 shadow-xs cursor-pointer hover:border-rose-400 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-theme-primary text-xs block">{o.title}</span>
                      <span className="text-[11px] text-theme-muted">{o.account} · {o.folio}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {formatMxn(o.amount)}
                    </span>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-theme-subtle text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">Motivo de pérdida:</span>
                      <span className="font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 rounded">
                        {o.lostReason || o.lossReason || 'No especificado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-theme-muted">
                      <span>Vendedor: {o.seller}</span>
                      <span>{o.line}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {STAGES.map((st) => {
          const colOpps = activeOpps.filter((o) => o.stage === st.key);
          const colTotal = colOpps.reduce((sum, o) => sum + o.amount, 0);
          const colWeighted = colOpps.reduce((sum, o) => sum + (o.amount * o.probability) / 100, 0);

          return (
            <div
              key={st.key}
              className={`bg-theme-card border border-theme-subtle rounded-xl shadow-sm overflow-hidden flex flex-col border-t-4 ${st.color}`}
            >
              {/* Column Header */}
              <div className="p-3 bg-theme-base/60 border-b border-theme-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-theme-primary">{st.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.bgBadge}`}>
                    {colOpps.length}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="font-mono font-bold text-theme-primary">{formatMxn(colTotal)}</span>
                  <span className="text-[10px] text-theme-muted font-mono" title="Ponderado">
                    Pond: {formatMxn(colWeighted)}
                  </span>
                </div>
              </div>

              {/* Column Cards List */}
              <div className="p-2 space-y-2.5 min-h-[450px] max-h-[750px] overflow-y-auto">
                {colOpps.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center p-4 text-xs text-theme-muted border border-dashed border-theme-subtle rounded-lg">
                    <span>Sin oportunidades en esta etapa</span>
                  </div>
                ) : (
                  colOpps.map((opp) => {
                    const next = getNextStage(opp.stage);
                    const prev = getPrevStage(opp.stage);
                    const isRisk = opp.risk === 'Alto' || opp.risk === 'Crítico';

                    return (
                      <div
                        key={opp.id}
                        onClick={() => onSelectOpportunity(opp)}
                        className={`bg-theme-base border rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-purple-400 ${
                          isRisk
                            ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                            : 'border-theme-subtle'
                        }`}
                      >
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono text-theme-muted">{opp.folio}</span>
                          {isRisk && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.2 rounded">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {opp.risk}
                            </span>
                          )}
                        </div>

                        {/* Title & Account */}
                        <h4 className="text-xs font-bold text-theme-primary mt-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {opp.title}
                        </h4>
                        <span className="text-[11px] font-medium text-theme-muted block truncate mt-0.5">
                          {opp.account}
                        </span>

                        {/* Amount & Prob */}
                        <div className="mt-2.5 pt-2 border-t border-theme-subtle flex items-baseline justify-between">
                          <span className="text-xs font-mono font-bold text-theme-primary">
                            {formatMxn(opp.amount)}
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 font-mono">
                            {opp.probability}%
                          </span>
                        </div>

                        {/* Line & Seller badge */}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-theme-muted">
                          <span className="px-1.5 py-0.5 rounded bg-theme-card border border-theme-subtle truncate max-w-[110px]">
                            {opp.line}
                          </span>
                          <span>{opp.seller}</span>
                        </div>

                        {/* Stage age & Quote tag */}
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className={`${(opp.daysInStage ?? opp.days ?? 0) > 14 ? 'text-amber-600 font-bold' : 'text-theme-muted'}`}>
                            {(opp.daysInStage ?? opp.days ?? 0)}d en etapa
                          </span>
                          {opp.quoteFolio && (
                            <span className="inline-flex items-center gap-0.5 text-purple-600 font-mono font-medium">
                              <FileText className="w-2.5 h-2.5" /> {opp.quoteFolio}
                            </span>
                          )}
                        </div>

                        {/* Quick Card Controls (Move forward / backward) */}
                        <div
                          className="mt-3 pt-2 border-t border-theme-subtle flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            {prev && (
                              <button
                                onClick={() => onUpdateStage(opp.id, prev)}
                                className="p-1 text-theme-muted hover:text-theme-primary hover:bg-theme-card rounded border border-theme-subtle transition-colors"
                                title={`Regresar a ${prev}`}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {opp.stage !== 'Ganada' && (
                              <button
                                onClick={() => onUpdateStage(opp.id, 'Ganada')}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                                title="Marcar como Ganada"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}

                            {next && (
                              <button
                                onClick={() => onUpdateStage(opp.id, next)}
                                className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                                title={`Avanzar a ${next}`}
                              >
                                <span>Avanzar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
