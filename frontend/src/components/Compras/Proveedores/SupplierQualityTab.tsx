import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FileCheck2,
  FileWarning,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ChevronRight,
  Filter,
  Layers,
  Calendar,
  UserCheck,
  Building,
  CheckCircle,
  HelpCircle,
  Eye,
  RefreshCw,
  Award
} from 'lucide-react';
import { SupplierMaster } from '../../../data/mockSuppliersData';
import {
  SupplierCorrectiveAction,
  SupplierScorecardItem,
  SupplierQualityPeriod,
  calculateSupplierScorecard
} from '../../../data/mockSupplierQualityData';
import { IncomingInspection } from '../../../data/mockCalidadData';
import { NuevaAccionCorrectivaModal } from './CalidadEvaluacion/NuevaAccionCorrectivaModal';

interface SupplierQualityTabProps {
  supplier: SupplierMaster;
  incomings: IncomingInspection[];
  correctiveActions: SupplierCorrectiveAction[];
  onAddCorrectiveAction: (action: Omit<SupplierCorrectiveAction, 'id'>) => void;
  onUpdateCorrectiveAction?: (action: SupplierCorrectiveAction) => void;
  onNavigateToIncoming?: (folio: string) => void;
}

export const SupplierQualityTab: React.FC<SupplierQualityTabProps> = ({
  supplier,
  incomings,
  correctiveActions,
  onAddCorrectiveAction,
  onUpdateCorrectiveAction,
  onNavigateToIncoming,
}) => {
  const [period, setPeriod] = useState<SupplierQualityPeriod>('90d');
  const [subTab, setSubTab] = useState<'lotes' | 'ncs' | 'acps' | 'docs' | 'historial'>('lotes');
  const [lotFilter, setLotFilter] = useState<'todos' | 'liberados' | 'rechazos'>('todos');
  const [isNewAcpModalOpen, setIsNewAcpModalOpen] = useState(false);
  const [selectedAcpForDetail, setSelectedAcpForDetail] = useState<SupplierCorrectiveAction | null>(null);

  // Compute scorecard for this supplier
  const scorecardItem: SupplierScorecardItem = useMemo(() => {
    const { scorecards } = calculateSupplierScorecard([supplier], incomings, correctiveActions, period);
    const found = scorecards.find(
      (item: SupplierScorecardItem) =>
        item.supplierId === supplier.id ||
        item.supplierName.toLowerCase() === supplier.tradeName.toLowerCase() ||
        item.supplierName.toLowerCase() === supplier.legalName.toLowerCase()
    );

    if (found) return found;

    // Fallback if supplier has no incoming data yet
    return {
      supplierId: supplier.id,
      supplierCode: supplier.code || 'PROV-RTM',
      supplierName: supplier.tradeName,
      category: supplier.type,
      qualityScore: 100,
      deliveryScore: 100,
      docsScore: 100,
      responseScore: 100,
      totalScore: 100,
      status: 'Aprobado',
      trend: 'stable',
      trendDiff: 0,
      inspectedLots: 0,
      conformingLots: 0,
      rejectedLots: 0,
      holdLots: 0,
      onTimeDeliveriesPct: 100,
      openCorrectiveActions: 0,
      resolvedCorrectiveActions: 0,
      lastAuditDate: 'N/A',
      notes: 'Sin lotes evaluados en el periodo seleccionado.',
    };
  }, [incomings, correctiveActions, period, supplier]);

  // Filter incomings for this supplier
  const supplierIncomings = useMemo(() => {
    return incomings.filter(
      (inc) =>
        inc.supplier.toLowerCase().includes(supplier.tradeName.toLowerCase()) ||
        inc.supplier.toLowerCase().includes(supplier.legalName.toLowerCase()) ||
        supplier.tradeName.toLowerCase().includes(inc.supplier.toLowerCase())
    );
  }, [incomings, supplier]);

  const filteredIncomings = useMemo(() => {
    if (lotFilter === 'liberados') {
      return supplierIncomings.filter((inc) => inc.status === 'Liberado');
    }
    if (lotFilter === 'rechazos') {
      return supplierIncomings.filter((inc) => inc.status.includes('Rechazado') || inc.status.includes('HOLD'));
    }
    return supplierIncomings;
  }, [supplierIncomings, lotFilter]);

  // Filter ACPs for this supplier
  const supplierAcps = useMemo(() => {
    return correctiveActions.filter(
      (acp) =>
        acp.supplierId === supplier.id ||
        acp.supplierName.toLowerCase().includes(supplier.tradeName.toLowerCase()) ||
        supplier.tradeName.toLowerCase().includes(acp.supplierName.toLowerCase())
    );
  }, [correctiveActions, supplier]);

  // Derive NCs from rejected / HOLD lots
  const derivedNcs = useMemo(() => {
    return supplierIncomings
      .filter((inc) => inc.status.includes('Rechazado') || inc.status.includes('HOLD'))
      .map((inc, index) => {
        return {
          id: `NC-${inc.id.replace('INC-', '')}`,
          incomingId: inc.id,
          date: inc.date,
          lot: inc.supplierLot || inc.rtmLot,
          material: inc.material,
          defect: inc.notes || 'Incumplimiento dimensional de especificación crítica.',
          disposition: 'HOLD / Cuarentena & Devolución a proveedor',
          estimatedImpact: '$18,500 MXN (Material + Paro potencial)',
          status: index === 0 ? 'Abierta' : 'En análisis',
          auditor: inc.auditor,
        };
      });
  }, [supplierIncomings]);

  // Helper status badge styling
  const getStatusBadge = (status: SupplierScorecardItem['status']) => {
    switch (status) {
      case 'Aprobado':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          label: 'Aprobado (Conforme)',
        };
      case 'Monitoreo':
        return {
          bg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30',
          dot: 'bg-sky-500',
          icon: Clock,
          label: 'En Monitoreo',
        };
      case 'Condicionado':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'Condicionado',
        };
      case 'Bloqueado':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500',
          icon: ShieldAlert,
          label: 'Bloqueado Temporalmente',
        };
    }
  };

  const statusConfig = getStatusBadge(scorecardItem.status);
  const StatusIcon = statusConfig.icon;

  // Pipeline phases for ACP
  const acpPhases = [
    'Detectada',
    'Enviada al proveedor',
    'Respuesta recibida',
    'En verificación',
    'Cerrada',
  ] as const;

  const handleAdvanceAcp = (acp: SupplierCorrectiveAction) => {
    if (!onUpdateCorrectiveAction) return;
    const currentIndex = acpPhases.indexOf(acp.status);
    if (currentIndex < acpPhases.length - 1) {
      const nextStatus = acpPhases[currentIndex + 1];
      const updated: SupplierCorrectiveAction = {
        ...acp,
        status: nextStatus,
        closedAt: nextStatus === 'Cerrada' ? 'Hoy' : acp.closedAt,
      };
      onUpdateCorrectiveAction(updated);
      if (selectedAcpForDetail?.id === acp.id) {
        setSelectedAcpForDetail(updated);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 8.1 HEADER DE CALIDAD DEL PROVEEDOR */}
      <div className="p-5 rounded-3xl bg-linear-to-br from-theme-surface via-theme-surface to-theme-muted/40 border border-theme-subtle shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Score & Status */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border shadow-inner ${
                  scorecardItem.totalScore >= 85
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : scorecardItem.totalScore >= 70
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                }`}
              >
                <span className="text-3xl font-black tracking-tight leading-none">
                  {scorecardItem.totalScore}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">
                  / 100 pts
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Score de Calidad Nexora
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black border ${statusConfig.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </span>
              </div>
              <h3 className="text-base font-black text-theme-main flex items-center gap-2">
                {supplier.tradeName}
                <span className="text-xs font-mono font-medium text-theme-muted">
                  ({supplier.code})
                </span>
              </h3>
              <div className="flex items-center gap-3 text-xs text-theme-muted">
                <span className="flex items-center gap-1">
                  {scorecardItem.trend === 'up' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +{scorecardItem.trendDiff}%
                    </span>
                  )}
                  {scorecardItem.trend === 'down' && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" /> {scorecardItem.trendDiff}%
                    </span>
                  )}
                  {scorecardItem.trend === 'stable' && (
                    <span className="text-zinc-500 font-bold flex items-center">
                      <Minus className="w-3.5 h-3.5" /> Estable
                    </span>
                  )}
                  <span className="text-[11px] text-theme-muted">vs periodo anterior</span>
                </span>
                <span>&bull;</span>
                <span>{scorecardItem.inspectedLots} lotes evaluados en {period}</span>
              </div>
            </div>
          </div>

          {/* Right Action & Period selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period selector */}
            <div className="flex items-center bg-theme-muted/60 p-1 rounded-2xl border border-theme-subtle">
              {(['30d', '60d', '90d', '6m', '12m'] as SupplierQualityPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    period === p
                      ? 'bg-theme-surface text-theme-main shadow-xs font-black'
                      : 'text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* + Nueva Acción Correctiva */}
            <button
              type="button"
              onClick={() => setIsNewAcpModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva acción correctiva</span>
            </button>
          </div>
        </div>

        {/* 4 Dimension Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-theme-subtle/60">
          {/* Calidad 40% */}
          <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-theme-muted">Calidad (40%)</span>
              <strong className="text-xs font-black text-theme-main font-mono">
                {scorecardItem.qualityScore} / 100
              </strong>
            </div>
            <div className="w-full h-1.5 bg-theme-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  scorecardItem.qualityScore >= 80 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${scorecardItem.qualityScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono">
              <span>{scorecardItem.conformingLots}/{scorecardItem.inspectedLots} conformes</span>
              <span>{scorecardItem.rejectedLots} rechazo(s)</span>
            </div>
          </div>

          {/* Entrega 25% */}
          <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-theme-muted">Entrega (25%)</span>
              <strong className="text-xs font-black text-theme-main font-mono">
                {scorecardItem.deliveryScore} / 100
              </strong>
            </div>
            <div className="w-full h-1.5 bg-theme-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  scorecardItem.deliveryScore >= 85 ? 'bg-sky-500' : 'bg-amber-500'
                }`}
                style={{ width: `${scorecardItem.deliveryScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono">
              <span>OTD: {scorecardItem.onTimeDeliveriesPct}% a tiempo</span>
              <span>Lead: {supplier.estimatedLeadDays}d</span>
            </div>
          </div>

          {/* Documentos 15% */}
          <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-theme-muted">Documentos (15%)</span>
              <strong className="text-xs font-black text-theme-main font-mono">
                {scorecardItem.docsScore} / 100
              </strong>
            </div>
            <div className="w-full h-1.5 bg-theme-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${scorecardItem.docsScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono">
              <span>COA requerido</span>
              <span>{supplier.documents?.length || 0} docs vigentes</span>
            </div>
          </div>

          {/* Respuesta 20% */}
          <div className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-theme-muted">Respuesta (20%)</span>
              <strong className="text-xs font-black text-theme-main font-mono">
                {scorecardItem.responseScore} / 100
              </strong>
            </div>
            <div className="w-full h-1.5 bg-theme-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${scorecardItem.responseScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-theme-muted font-mono">
              <span>{scorecardItem.openCorrectiveActions} ACPs abiertas</span>
              <span>{scorecardItem.resolvedCorrectiveActions} cerradas</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR */}
      <div className="flex items-center gap-2 border-b border-theme-subtle pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubTab('lotes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'lotes'
              ? 'bg-theme-main text-theme-inverse'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Incoming & Lotes ({supplierIncomings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('ncs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'ncs'
              ? 'bg-theme-main text-theme-inverse'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>No Conformidades ({derivedNcs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('acps')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'acps'
              ? 'bg-theme-main text-theme-inverse'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Acciones Correctivas ({supplierAcps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('docs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'docs'
              ? 'bg-theme-main text-theme-inverse'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Certificados & Documentos</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('historial')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'historial'
              ? 'bg-theme-main text-theme-inverse'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Historial & Tendencia</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 8.2 SUB-SECCIÓN 1: INCOMING & LOTES */}
      {/* ===================================================================== */}
      {subTab === 'lotes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLotFilter('todos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  lotFilter === 'todos'
                    ? 'bg-theme-muted text-theme-main'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Todos ({supplierIncomings.length})
              </button>
              <button
                type="button"
                onClick={() => setLotFilter('liberados')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  lotFilter === 'liberados'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Liberados ({supplierIncomings.filter((i) => i.status === 'Liberado').length})
              </button>
              <button
                type="button"
                onClick={() => setLotFilter('rechazos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  lotFilter === 'rechazos'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Rechazos / HOLD ({supplierIncomings.filter((i) => i.status.includes('Rechazado') || i.status.includes('HOLD')).length})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-theme-muted">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lotes vinculados en tiempo real desde Calidad Incoming</span>
            </div>
          </div>

          {filteredIncomings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-theme-surface border border-theme-subtle text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-theme-main">No hay lotes que coincidan con el filtro</p>
              <p className="text-xs text-theme-muted">
                Todos los lotes recibidos de {supplier.tradeName} se reflejan aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="border border-theme-subtle rounded-2xl overflow-hidden bg-theme-surface shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/50 text-theme-muted font-bold border-b border-theme-subtle uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3.5">Folio / Fecha</th>
                      <th className="py-2.5 px-3.5">OC / Material</th>
                      <th className="py-2.5 px-3.5">Lote Proveedor</th>
                      <th className="py-2.5 px-3.5 text-center">CoA</th>
                      <th className="py-2.5 px-3.5">Espesor / Pruebas</th>
                      <th className="py-2.5 px-3.5 text-center">Estado</th>
                      <th className="py-2.5 px-3.5">Auditor</th>
                      <th className="py-2.5 px-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle/60">
                    {filteredIncomings.map((inc) => {
                      const isRejected = inc.status.includes('Rechazado') || inc.status.includes('HOLD');
                      return (
                        <tr
                          key={inc.id}
                          className={`hover:bg-theme-muted/20 transition-colors ${
                            isRejected ? 'bg-rose-500/5' : ''
                          }`}
                        >
                          <td className="py-3 px-3.5">
                            <div className="font-mono font-bold text-theme-main flex items-center gap-1.5">
                              {inc.id}
                              {isRejected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              )}
                            </div>
                            <span className="text-[10px] text-theme-muted block">{inc.date}</span>
                          </td>

                          <td className="py-3 px-3.5 max-w-xs">
                            <span className="font-mono font-bold text-theme-primary block text-[11px]">
                              {inc.poFolio}
                            </span>
                            <span className="text-theme-main font-medium block truncate" title={inc.material}>
                              {inc.material}
                            </span>
                            <span className="text-[10px] text-theme-muted font-mono block">
                              Recibido: {inc.receivedQty}
                            </span>
                          </td>

                          <td className="py-3 px-3.5">
                            <span className="font-mono text-theme-main font-bold block">
                              {inc.supplierLot || 'N/A'}
                            </span>
                            <span className="text-[10px] font-mono text-theme-muted">
                              RTM: {inc.rtmLot}
                            </span>
                          </td>

                          <td className="py-3 px-3.5 text-center">
                            {inc.coaAttached ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <FileCheck2 className="w-3 h-3" /> Conforme
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <FileWarning className="w-3 h-3" /> Faltante
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3.5 max-w-[180px]">
                            {inc.thicknessMeasured ? (
                              <span
                                className={`text-[11px] block font-mono font-bold ${
                                  !inc.specConforming
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-theme-main'
                                }`}
                              >
                                {inc.thicknessMeasured}
                              </span>
                            ) : (
                              <span className="text-theme-muted text-[11px]">Dentro de norma</span>
                            )}
                            {inc.notes && (
                              <span className="text-[10px] text-theme-muted block truncate" title={inc.notes}>
                                {inc.notes}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                isRejected
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {isRejected ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {inc.status}
                            </span>
                          </td>

                          <td className="py-3 px-3.5 text-theme-muted text-[11px] font-medium">
                            {inc.auditor}
                          </td>

                          <td className="py-3 px-3.5 text-right">
                            {onNavigateToIncoming ? (
                              <button
                                type="button"
                                onClick={() => onNavigateToIncoming(inc.id)}
                                className="px-2.5 py-1 rounded-lg text-theme-primary hover:bg-theme-primary/10 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                title="Ver detalle en módulo Calidad > Incoming"
                              >
                                <span>Ver en Incoming</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-theme-muted text-[10px]">Auditado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8.3 SUB-SECCIÓN 2: NO CONFORMIDADES DEL PROVEEDOR */}
      {/* ===================================================================== */}
      {subTab === 'ncs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Registro de No Conformidades asociadas al proveedor
            </h4>
            <span className="text-xs font-bold text-theme-main">
              Total: {derivedNcs.length} eventos de calidad adversos
            </span>
          </div>

          {derivedNcs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-theme-surface border border-theme-subtle text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-theme-main">0 No Conformidades registradas</p>
              <p className="text-xs text-theme-muted">
                Este proveedor no cuenta con rechazos ni desviaciones críticas en el periodo analizado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {derivedNcs.map((nc) => (
                <div
                  key={nc.id}
                  className="p-4 rounded-2xl bg-theme-surface border border-rose-500/30 hover:border-rose-500/50 shadow-xs space-y-3 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs">
                        {nc.id}
                      </span>
                      <span className="text-xs font-bold text-theme-main">
                        Lote: <strong className="font-mono">{nc.lot}</strong>
                      </span>
                      <span className="text-xs text-theme-muted">&bull; {nc.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {nc.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-theme-muted">
                        Auditor: {nc.auditor}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-theme-muted/30 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">
                        Causa Raíz / Desviación
                      </span>
                      <strong className="text-theme-main block">{nc.defect}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-theme-muted/30 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">
                        Disposición
                      </span>
                      <strong className="text-theme-main block">{nc.disposition}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-theme-muted/30 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">
                        Impacto Estimado
                      </span>
                      <strong className="text-rose-600 dark:text-rose-400 font-mono block">
                        {nc.estimatedImpact}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-theme-subtle">
                    <span className="text-[11px] text-theme-muted">
                      Material: <strong className="text-theme-main">{nc.material}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNewAcpModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Vincular / Abrir ACP a proveedor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8.4 SUB-SECCIÓN 3: ACCIONES CORRECTIVAS (SCAR / ACP) */}
      {/* ===================================================================== */}
      {subTab === 'acps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Planes de Acción Correctiva de Proveedor (SCAR)
            </h4>
            <button
              type="button"
              onClick={() => setIsNewAcpModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Emitir nueva ACP</span>
            </button>
          </div>

          {supplierAcps.length === 0 ? (
            <div className="p-8 rounded-2xl bg-theme-surface border border-theme-subtle text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-theme-main">No hay acciones correctivas abiertas</p>
              <p className="text-xs text-theme-muted">
                El proveedor mantiene cumplimiento satisfactorio en sus entregas y especificaciones.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supplierAcps.map((acp) => {
                const currentPhaseIdx = acpPhases.indexOf(acp.status);
                return (
                  <div
                    key={acp.id}
                    className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4"
                  >
                    {/* Header ACP */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-sm text-theme-main">
                          {acp.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            acp.severity === 'Crítica'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : acp.severity === 'Mayor'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {acp.severity}
                        </span>
                        <span className="text-xs text-theme-muted font-mono">
                          Origen: {acp.sourceType} ({acp.sourceFolio})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-theme-muted font-mono">
                          Compromiso: <strong className="text-theme-main">{acp.commitmentDate}</strong>
                        </span>
                        {acp.status === 'Cerrada' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                            Cerrada
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdvanceAcp(acp)}
                            className="px-2.5 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-[11px] border border-theme-subtle flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Avanzar fase</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stepper Pipeline */}
                    <div className="py-2">
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {acpPhases.map((phase, pIdx) => {
                          const isDone = pIdx <= currentPhaseIdx;
                          const isCurrent = pIdx === currentPhaseIdx;
                          return (
                            <div key={phase} className="space-y-1">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isCurrent
                                    ? 'bg-indigo-600 ring-2 ring-indigo-400/30'
                                    : isDone
                                    ? 'bg-emerald-500'
                                    : 'bg-theme-muted'
                                }`}
                              />
                              <span
                                className={`text-[10px] block truncate ${
                                  isCurrent
                                    ? 'font-black text-indigo-600 dark:text-indigo-400'
                                    : isDone
                                    ? 'font-bold text-theme-main'
                                    : 'text-theme-muted'
                                }`}
                              >
                                {phase}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Defect, Evidence & Containment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-theme-muted block">
                          Defecto Detectado
                        </span>
                        <p className="font-semibold text-theme-main leading-relaxed">{acp.defect}</p>
                        <p className="text-[10px] text-theme-muted font-mono">
                          Lote: {acp.lotNumber} &bull; Afectado: {acp.affectedQty}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-theme-muted block">
                          Contención RTM
                        </span>
                        <p className="font-semibold text-theme-main leading-relaxed">
                          {acp.containment}
                        </p>
                        <p className="text-[10px] text-theme-muted">{acp.containmentNotes}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-theme-muted block">
                          Respuesta del Proveedor & Causa Raíz
                        </span>
                        <p className="font-semibold text-theme-main leading-relaxed">
                          {acp.rootCause || 'En espera de informe 8D / 5 Porqués del proveedor.'}
                        </p>
                        <p className="text-[10px] text-theme-muted font-mono">
                          Contacto: {acp.supplierContact}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-theme-muted pt-1 border-t border-theme-subtle">
                      <span>Responsable RTM: <strong className="text-theme-main">{acp.rtmResponsible}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedAcpForDetail(acp)}
                        className="text-theme-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver expediente completo</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8.5 SUB-SECCIÓN 4: DOCUMENTACIÓN DE CALIDAD */}
      {/* ===================================================================== */}
      {subTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Certificaciones, Fichas Técnicas y COAs Registrados
            </h4>
            <span className="text-xs text-theme-muted">
              Auditoría y control de vigencias
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Certificado ISO */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <strong className="text-xs font-bold text-theme-main">
                    Certificación ISO 9001:2015
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Vigente
                </span>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                Sistema de gestión de la calidad avalado para manufactura de sustratos flexibles.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted pt-1 border-t border-theme-subtle">
                <span>Vence: 14 Dic 2027</span>
                <span className="text-theme-primary hover:underline cursor-pointer">Ver PDF</span>
              </div>
            </div>

            {/* Certificado Inocuidad FSSC */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                  <strong className="text-xs font-bold text-theme-main">
                    FSSC 22000 / FDA Food Contact
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Por vencer (28d)
                </span>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                Declaración de conformidad para contacto directo con alimentos y fármacos.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted pt-1 border-t border-theme-subtle">
                <span>Vence: 05 Oct 2026</span>
                <span className="text-amber-600 font-bold hover:underline cursor-pointer">Solicitar renovación</span>
              </div>
            </div>

            {/* Ficha Técnica Master */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-500" />
                  <strong className="text-xs font-bold text-theme-main">
                    Ficha Técnica de Materiales (TDS)
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Vigente
                </span>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                Especificaciones de calibre, tensión superficial (dynas), gramaje y elongación.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted pt-1 border-t border-theme-subtle">
                <span>Rev. 4.2 · Mayo 2026</span>
                <span className="text-theme-primary hover:underline cursor-pointer">Descargar</span>
              </div>
            </div>

            {/* Política de Garantía */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-zinc-500" />
                  <strong className="text-xs font-bold text-theme-main">
                    Acuerdo de Calidad & Devoluciones (SLA)
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Firmado
                </span>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                Reposición garantizada de material en &le;72h ante rechazo en Incoming o Línea.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted pt-1 border-t border-theme-subtle">
                <span>Vigencia indefinida</span>
                <span className="text-theme-primary hover:underline cursor-pointer">Ver acuerdo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8.6 SUB-SECCIÓN 5: HISTORIAL DE DESEMPEÑO */}
      {/* ===================================================================== */}
      {subTab === 'historial' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Evolución del Score en los últimos 6 meses
            </h4>
            <div className="grid grid-cols-6 gap-2 text-center pt-2">
              {[
                { month: 'Abr', score: 88, status: 'Aprobado' },
                { month: 'May', score: 86, status: 'Aprobado' },
                { month: 'Jun', score: 85, status: 'Aprobado' },
                { month: 'Jul', score: 82, status: 'Aprobado' },
                { month: 'Ago', score: 79, status: 'Monitoreo' },
                { month: 'Sep (Actual)', score: scorecardItem.totalScore, status: scorecardItem.status },
              ].map((m) => (
                <div key={m.month} className="space-y-1.5 p-2 rounded-xl bg-theme-muted/30">
                  <span className="text-[10px] font-bold text-theme-muted block">{m.month}</span>
                  <div
                    className={`text-sm font-black font-mono ${
                      m.score >= 85 ? 'text-emerald-600' : m.score >= 70 ? 'text-amber-600' : 'text-rose-600'
                    }`}
                  >
                    {m.score}
                  </div>
                  <span className="text-[9px] font-bold block text-theme-muted truncate">{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Cronología de Eventos de Calidad
            </h4>
            <div className="space-y-2">
              {supplierIncomings.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-xl bg-theme-surface border border-theme-subtle flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    {inc.status.includes('Rechazado') || inc.status.includes('HOLD') ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="text-theme-main block">
                        Inspección {inc.id}: {inc.status}
                      </strong>
                      <p className="text-theme-muted text-[11px]">
                        Lote {inc.supplierLot || inc.rtmLot} &bull; {inc.material}
                      </p>
                      {inc.notes && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                          {inc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-theme-muted whitespace-nowrap">
                    {inc.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Acción Correctiva */}
      {isNewAcpModalOpen && (
        <NuevaAccionCorrectivaModal
          suppliers={[supplier]}
          incomings={incomings}
          initialSupplierId={supplier.id}
          onClose={() => setIsNewAcpModalOpen(false)}
          onSaveAction={(action: SupplierCorrectiveAction) => {
            onAddCorrectiveAction(action);
            setIsNewAcpModalOpen(false);
          }}
        />
      )}

      {/* MODAL: Detalle de ACP */}
      {selectedAcpForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <h3 className="text-base font-black text-theme-main">
                  Expediente {selectedAcpForDetail.id}
                </h3>
                <span className="text-xs text-theme-muted">
                  Proveedor: {selectedAcpForDetail.supplierName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAcpForDetail(null)}
                className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Defecto</span>
                <p className="text-theme-main font-bold">{selectedAcpForDetail.defect}</p>
                <p className="text-theme-muted font-mono">
                  Lote: {selectedAcpForDetail.lotNumber} &bull; Material: {selectedAcpForDetail.material}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Contención</span>
                <p className="text-theme-main font-bold">{selectedAcpForDetail.containment}</p>
                <p className="text-theme-muted">{selectedAcpForDetail.containmentNotes}</p>
              </div>

              <div className="p-3 rounded-xl bg-theme-muted/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Evidencia & Seguimiento</span>
                <p className="text-theme-main">{selectedAcpForDetail.evidence}</p>
                <p className="text-theme-muted font-mono pt-1">
                  Contacto: {selectedAcpForDetail.supplierContact} &bull; RTM: {selectedAcpForDetail.rtmResponsible}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setSelectedAcpForDetail(null)}
                className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
