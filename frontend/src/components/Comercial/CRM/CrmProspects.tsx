import React, { useState, useMemo } from 'react';
import {
  UserPlus, Search, Filter, ShieldCheck, ArrowRight,
  Phone, Mail, Building2, Calendar, Star, CheckCircle2,
  XCircle, Clock, AlertTriangle, ArrowUpRight, Sparkles,
  ChevronRight, RefreshCw, FileText
} from 'lucide-react';
import { CrmProspect, CrmLine } from '../../../data/mockCrmData';

interface CrmProspectsProps {
  prospects: CrmProspect[];
  onOpenNewProspect: () => void;
  onUpdateProspectStatus: (id: string, status: CrmProspect['status']) => void;
  onConvertToOpportunity?: (prospect: CrmProspect) => void;
  onSelectProspect?: (prospect: CrmProspect) => void;
}

export const CrmProspects: React.FC<CrmProspectsProps> = ({
  prospects,
  onOpenNewProspect,
  onUpdateProspectStatus,
  onConvertToOpportunity,
  onSelectProspect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedLine, setSelectedLine] = useState<string>('Todas');
  const [selectedSeller, setSelectedSeller] = useState<string>('Todos');
  const [scoreFilter, setScoreFilter] = useState<'Todos' | 'Alto' | 'Medio' | 'Bajo'>('Todos');
  const [viewDetailProspect, setViewDetailProspect] = useState<CrmProspect | null>(null);

  // Filter prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const matchSearch =
        p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.contactName || p.contact || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.folio || p.id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'Todos' || p.status === selectedStatus;
      const matchLine = selectedLine === 'Todas' || p.line === selectedLine;
      const matchSeller = selectedSeller === 'Todos' || p.seller === selectedSeller;

      let matchScore = true;
      if (scoreFilter === 'Alto') matchScore = p.score >= 70;
      if (scoreFilter === 'Medio') matchScore = p.score >= 40 && p.score < 70;
      if (scoreFilter === 'Bajo') matchScore = p.score < 40;

      return matchSearch && matchStatus && matchLine && matchSeller && matchScore;
    });
  }, [prospects, searchTerm, selectedStatus, selectedLine, selectedSeller, scoreFilter]);

  // Unique sellers
  const sellers = useMemo(() => {
    return Array.from(new Set(prospects.map((p) => p.seller))).filter(Boolean);
  }, [prospects]);

  // Counters
  const counts = useMemo(() => {
    return {
      total: prospects.length,
      nuevos: prospects.filter((p) => p.status === 'Nuevo').length,
      contacto: prospects.filter((p) => p.status === 'En contacto').length,
      calificados: prospects.filter((p) => p.status === 'Calificado').length,
      convertidos: prospects.filter((p) => p.status === 'Convertido').length,
      descartados: prospects.filter((p) => p.status === 'Descartado').length,
      hotLeads: prospects.filter((p) => p.score >= 75 && p.status !== 'Convertido' && p.status !== 'Descartado').length,
    };
  }, [prospects]);

  const getStatusBadge = (status: CrmProspect['status']) => {
    switch (status) {
      case 'Nuevo':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'En contacto':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Calificado':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Convertido':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Descartado':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (score >= 45) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / KPIs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-xs text-theme-muted font-medium block">Total Leads</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-theme-primary">{counts.total}</span>
            <span className="text-[11px] text-theme-muted font-mono">100%</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-xs text-theme-muted font-medium block">Nuevos sin contactar</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{counts.nuevos}</span>
            <span className="text-[11px] text-blue-500 font-mono">Por atender</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-xs text-theme-muted font-medium block">En contacto</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{counts.contacto}</span>
            <span className="text-[11px] text-amber-500 font-mono">En llamada/visita</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-xs text-theme-muted font-medium block">Calificados</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{counts.calificados}</span>
            <span className="text-[11px] text-purple-500 font-mono">Listos p/ oport.</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-xs text-theme-muted font-medium block">Convertidos a Opp</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{counts.convertidos}</span>
            <span className="text-[11px] text-emerald-600 font-mono">
              {counts.total > 0 ? Math.round((counts.convertidos / counts.total) * 100) : 0}% conv.
            </span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-900/10 dark:to-indigo-900/10">
          <span className="text-xs text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Hot Leads (≥75)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-purple-700 dark:text-purple-300">{counts.hotLeads}</span>
            <span className="text-[11px] text-purple-600 font-mono">Alta prioridad</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
            <input
              type="text"
              placeholder="Buscar por empresa, contacto, correo o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-theme-base border border-theme-subtle rounded-lg text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('Todos');
                setSelectedLine('Todas');
                setSelectedSeller('Todos');
                setScoreFilter('Todos');
              }}
              className="p-2 text-theme-muted hover:text-theme-primary hover:bg-theme-base rounded-lg border border-theme-subtle transition-colors text-xs flex items-center gap-1.5"
              title="Limpiar filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>

            <button
              onClick={onOpenNewProspect}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm shadow-purple-600/20 transition-all hover:scale-[1.01]"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nuevo prospecto</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-theme-subtle text-xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="text-theme-muted font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Estado:
            </span>
            {['Todos', 'Nuevo', 'En contacto', 'Calificado', 'Convertido', 'Descartado'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-theme-base text-theme-muted hover:text-theme-primary hover:bg-theme-muted/10 border border-theme-subtle'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-theme-subtle mx-1 hidden lg:block" />

          {/* Line Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Línea:</span>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todas">Todas las líneas</option>
              <option value="Maquinado CNC">Maquinado CNC</option>
              <option value="Fabricación y Soldadura">Fabricación y Soldadura</option>
              <option value="Automatización">Automatización</option>
              <option value="Pintura y Recubrimientos">Pintura y Recubrimientos</option>
              <option value="Ensamble e Integración">Ensamble e Integración</option>
            </select>
          </div>

          {/* Seller Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Vendedor:</span>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todos">Todos</option>
              {sellers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Score filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Score:</span>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todos">Todos</option>
              <option value="Alto">Alto (≥70)</option>
              <option value="Medio">Medio (40-69)</option>
              <option value="Bajo">Bajo (&lt;40)</option>
            </select>
          </div>

          <span className="ml-auto text-xs text-theme-muted font-mono">
            {filteredProspects.length} de {prospects.length} resultados
          </span>
        </div>
      </div>

      {/* Prospects Table */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-theme-base/60 border-b border-theme-subtle text-theme-muted font-semibold">
                <th className="py-3 px-4">Empresa / Contacto</th>
                <th className="py-3 px-3">Línea de Interés</th>
                <th className="py-3 px-3">Origen</th>
                <th className="py-3 px-3">Vendedor</th>
                <th className="py-3 px-3 text-center">Score BANT</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Próximo paso</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-theme-muted">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-sm">No se encontraron prospectos con los filtros seleccionados</p>
                    <p className="text-xs text-theme-muted mt-1">Prueba cambiando los filtros o registra uno nuevo</p>
                    <button
                      onClick={onOpenNewProspect}
                      className="mt-3 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> + Registrar prospecto
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProspects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-theme-base/50 transition-colors group cursor-pointer"
                    onClick={() => setViewDetailProspect(p)}
                  >
                    {/* Empresa y Contacto */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-xs border border-purple-200 dark:border-purple-800">
                          {p.company.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-theme-primary text-xs group-hover:text-purple-600 transition-colors">
                              {p.company}
                            </span>
                            <span className="text-[10px] text-theme-muted font-mono">{p.folio}</span>
                          </div>
                          <div className="text-theme-muted text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{p.contactName}</span>
                            {p.email && (
                              <span className="flex items-center gap-0.5 text-theme-muted">
                                <Mail className="w-3 h-3" /> {p.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Línea de Interés */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-theme-base border border-theme-subtle text-theme-primary">
                        {p.line}
                      </span>
                      <span className="block text-[10px] text-theme-muted mt-0.5 truncate max-w-[140px]">
                        {p.industry}
                      </span>
                    </td>

                    {/* Origen */}
                    <td className="py-3 px-3">
                      <span className="text-theme-primary font-medium">{p.source}</span>
                      <span className="block text-[10px] text-theme-muted font-mono">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : (p.last || 'Reciente')}
                      </span>
                    </td>

                    {/* Vendedor */}
                    <td className="py-3 px-3">
                      <span className="text-theme-primary font-medium">{p.seller}</span>
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex flex-col items-center group/score relative">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs border ${getScoreColor(p.score)}`}>
                          {p.score} pts
                        </span>
                        {/* Tooltip on hover */}
                        <div className="hidden group-hover/score:block absolute bottom-full mb-1 z-30 w-48 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] left-1/2 -translate-x-1/2 pointer-events-none">
                          <b className="block text-purple-300 mb-1 border-b border-slate-700 pb-0.5">Factores BANT:</b>
                          {((p.scoreFactors || p.scoreReasons) && (p.scoreFactors || p.scoreReasons)!.length > 0) ? (
                            <ul className="space-y-0.5">
                              {(p.scoreFactors || p.scoreReasons)!.map((f: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <span className="text-emerald-400">✓</span> {f}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-400">Sin factores registrados</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Próximo paso */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] text-theme-primary font-medium truncate max-w-[150px]">
                        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{p.nextFollowUp || 'Sin agendar'}</span>
                      </div>
                      <span className="text-[10px] text-theme-muted block font-mono">
                        Últ: {p.lastContactDate || 'Nunca'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {p.status !== 'Convertido' && p.status !== 'Descartado' && (
                          <>
                            {p.status === 'Nuevo' && (
                              <button
                                onClick={() => onUpdateProspectStatus(p.id, 'En contacto')}
                                className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded text-[11px] font-medium transition-colors"
                                title="Marcar como contactado"
                              >
                                Contactar
                              </button>
                            )}

                            {p.status === 'En contacto' && (
                              <button
                                onClick={() => onUpdateProspectStatus(p.id, 'Calificado')}
                                className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded text-[11px] font-medium transition-colors"
                                title="Calificar prospecto"
                              >
                                Calificar
                              </button>
                            )}

                            {p.status === 'Calificado' && onConvertToOpportunity && (
                              <button
                                onClick={() => onConvertToOpportunity(p)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shadow-xs"
                                title="Convertir a Oportunidad"
                              >
                                <span>Convertir</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => setViewDetailProspect(p)}
                          className="p-1 text-theme-muted hover:text-theme-primary hover:bg-theme-base rounded transition-colors"
                          title="Ver detalle"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prospect Quick Preview Drawer / Modal */}
      {viewDetailProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-theme-card border border-theme-subtle rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-theme-subtle flex items-center justify-between bg-theme-base/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm border border-purple-200 dark:border-purple-800">
                  {viewDetailProspect.company.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-theme-primary">{viewDetailProspect.company}</h3>
                    <span className="text-xs text-theme-muted font-mono">{viewDetailProspect.folio}</span>
                  </div>
                  <p className="text-xs text-theme-muted">{viewDetailProspect.industry} · {viewDetailProspect.line}</p>
                </div>
              </div>
              <button
                onClick={() => setViewDetailProspect(null)}
                className="p-1.5 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-base"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Status and Score Banner */}
              <div className="flex items-center justify-between p-3.5 bg-theme-base rounded-xl border border-theme-subtle">
                <div>
                  <span className="text-theme-muted font-medium block">Estado del Lead</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1 ${getStatusBadge(viewDetailProspect.status)}`}>
                    {viewDetailProspect.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-theme-muted font-medium block">Calificación BANT</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-mono border mt-1 ${getScoreColor(viewDetailProspect.score)}`}>
                    <Star className="w-3.5 h-3.5 fill-current" /> {viewDetailProspect.score} pts
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3 bg-theme-card p-4 rounded-xl border border-theme-subtle">
                <div>
                  <span className="text-theme-muted text-[11px] block">Contacto</span>
                  <span className="text-theme-primary font-semibold block mt-0.5">{viewDetailProspect.contactName}</span>
                </div>
                <div>
                  <span className="text-theme-muted text-[11px] block">Vendedor Asignado</span>
                  <span className="text-theme-primary font-semibold block mt-0.5">{viewDetailProspect.seller}</span>
                </div>
                <div>
                  <span className="text-theme-muted text-[11px] block">Correo Electrónico</span>
                  <span className="text-theme-primary font-mono block mt-0.5">{viewDetailProspect.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-theme-muted text-[11px] block">Teléfono</span>
                  <span className="text-theme-primary font-mono block mt-0.5">{viewDetailProspect.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-theme-muted text-[11px] block">Origen / Canal</span>
                  <span className="text-theme-primary block mt-0.5">{viewDetailProspect.source}</span>
                </div>
                <div>
                  <span className="text-theme-muted text-[11px] block">Próximo seguimiento</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium block mt-0.5">{viewDetailProspect.nextFollowUp || 'No programado'}</span>
                </div>
              </div>

              {/* BANT Score Factors */}
              <div>
                <span className="text-theme-primary font-semibold block mb-2">Factores de Calificación Detectados:</span>
                <div className="space-y-1.5">
                  {((viewDetailProspect.scoreFactors || viewDetailProspect.scoreReasons) && (viewDetailProspect.scoreFactors || viewDetailProspect.scoreReasons)!.length > 0) ? (
                    (viewDetailProspect.scoreFactors || viewDetailProspect.scoreReasons)!.map((factor: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-theme-muted italic">Sin factores registrados todavía.</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-theme-primary font-semibold block mb-1">Notas Comerciales:</span>
                <div className="p-3 bg-theme-base rounded-xl border border-theme-subtle text-theme-primary leading-relaxed">
                  {viewDetailProspect.notes || 'Sin notas registradas.'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-theme-subtle bg-theme-base/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {viewDetailProspect.status !== 'Descartado' && (
                  <button
                    onClick={() => {
                      onUpdateProspectStatus(viewDetailProspect.id, 'Descartado');
                      setViewDetailProspect(null);
                    }}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Descartar Lead
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {viewDetailProspect.status !== 'Calificado' && viewDetailProspect.status !== 'Convertido' && (
                  <button
                    onClick={() => {
                      onUpdateProspectStatus(viewDetailProspect.id, 'Calificado');
                      setViewDetailProspect(null);
                    }}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Marcar Calificado
                  </button>
                )}

                {viewDetailProspect.status === 'Calificado' && onConvertToOpportunity && (
                  <button
                    onClick={() => {
                      onConvertToOpportunity(viewDetailProspect);
                      setViewDetailProspect(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Convertir en Oportunidad</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
