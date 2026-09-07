import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileSearch,
  FileText,
  Filter,
  History,
  Layers,
  Link as LinkIcon,
  Lock,
  Package,
  Printer,
  QrCode,
  RotateCcw,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  INITIAL_TRACEABILITY_DOSSIERS,
  TraceabilityDossier,
  TraceabilityChainNode,
  TraceabilitySystemSuggestion,
  findTraceabilityDossiers,
} from '../../../data/mockTraceabilityData';
import { ProductionOrder } from '../../../data/mockProduccionData';
import { TraceabilityExportModal } from './TraceabilityExportModal';

type TraceabilitySubtab =
  | 'Resumen'
  | 'Materiales'
  | 'Proceso'
  | 'Calidad'
  | 'Embarque'
  | 'Documentos'
  | 'Incidencias'
  | 'Historial';

interface Props {
  orders?: ProductionOrder[];
  initialQuery?: string;
  onNavigateToProduccion?: (opFolio?: string) => void;
  onOpenQualityRelease?: (opFolio: string) => void;
  onOpenLabelPreview?: (op: string, cli: string, part: string, lot: string) => void;
  onNavigateToEmbarques?: () => void;
  onToast?: (msg: string) => void;
}

export const Traceability360Workspace: React.FC<Props> = ({
  orders,
  initialQuery,
  onNavigateToProduccion,
  onOpenQualityRelease,
  onOpenLabelPreview,
  onNavigateToEmbarques,
  onToast,
}) => {
  // Estado del buscador universal
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'OP-2026-95250');
  const [activeDossierId, setActiveDossierId] = useState<string>('TRZ-2026-95250');
  const [activeSubtab, setActiveSubtab] = useState<TraceabilitySubtab>('Resumen');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  // Búsqueda en los expedientes demo
  const searchResults = useMemo(() => {
    return findTraceabilityDossiers(searchQuery);
  }, [searchQuery]);

  // Dossier seleccionado
  const currentDossier: TraceabilityDossier = useMemo(() => {
    const found = INITIAL_TRACEABILITY_DOSSIERS.find((d) => d.id === activeDossierId);
    if (found) return found;
    if (searchResults.length > 0) return searchResults[0];
    return INITIAL_TRACEABILITY_DOSSIERS[0];
  }, [activeDossierId, searchResults]);

  // Selección rápida de expediente demo
  const handleSelectDemo = (opFolio: string) => {
    setSearchQuery(opFolio);
    const match = INITIAL_TRACEABILITY_DOSSIERS.find((d) => d.opFolio === opFolio);
    if (match) {
      setActiveDossierId(match.id);
      onToast?.(`✓ Expediente cargado: ${match.opFolio} · ${match.cliente}`);
    }
  };

  const handleSubtabClick = (tab: TraceabilitySubtab) => {
    setActiveSubtab(tab);
  };

  const handleNodeClick = (node: TraceabilityChainNode) => {
    if (node.targetTab) {
      setActiveSubtab(node.targetTab);
      onToast?.(`Navegando a: ${node.targetTab} (${node.label})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Universal Search Bar & Quick Demo Chips */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="text-base font-black text-theme-main tracking-tight">
                Trazabilidad 360° Enterprise
              </h2>
              <span className="rounded-full bg-theme-primary/10 px-2.5 py-0.5 text-[10px] font-black text-theme-primary border border-theme-primary/20">
                DHR / DMR Digital
              </span>
            </div>
            <p className="text-xs text-theme-muted">
              Reconstrucción genealógica end-to-end: materias primas, máquinas, operadores, gates QA, baches PT, embarques y facturas.
            </p>
          </div>

          {/* Buscador Universal */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por OP (95250), lote (BCH-44951), parte (526412), pedido, remisión o RMA..."
              className="w-full rounded-2xl border border-theme-subtle bg-theme-surface pl-10 pr-24 py-2.5 text-xs font-medium text-theme-main focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-main p-1 rounded-lg hover:bg-theme-muted/20"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Demo Chips para validación ejecutiva rápida */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-theme-subtle">
          <span className="text-[10px] font-black uppercase text-theme-muted flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-purple-600" />
            Expedientes de Demostración:
          </span>
          <button
            type="button"
            onClick={() => handleSelectDemo('OP-2026-95250')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              currentDossier.opFolio === 'OP-2026-95250'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-xs'
                : 'border border-theme-subtle bg-theme-muted/10 text-theme-muted hover:text-theme-main'
            }`}
          >
            <span className="font-mono text-[11px] font-black">OP-2026-95250</span>
            <span>· Panasonic (RMA-2026-014)</span>
            <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-black">
              Investigación
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemo('OP-2026-95249')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              currentDossier.opFolio === 'OP-2026-95249'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
                : 'border border-theme-subtle bg-theme-muted/10 text-theme-muted hover:text-theme-main'
            }`}
          >
            <span className="font-mono text-[11px] font-black">OP-2026-95249</span>
            <span>· Black & Decker (Offset)</span>
            <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[9px] font-black">
              145 en HOLD
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemo('OP-2026-95256')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              currentDossier.opFolio === 'OP-2026-95256'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                : 'border border-theme-subtle bg-theme-muted/10 text-theme-muted hover:text-theme-main'
            }`}
          >
            <span className="font-mono text-[11px] font-black">OP-2026-95256</span>
            <span>· Tyco Electronics (Conforme)</span>
            <span className="rounded-full bg-emerald-500 text-white px-1.5 py-0.2 text-[9px] font-black">
              100% Conforme
            </span>
          </button>
        </div>
      </div>

      {/* Banner de Contexto si está en Investigación de Queja/RMA */}
      {currentDossier.complaintId && (
        <div className="rounded-3xl border-2 border-rose-500/30 bg-rose-500/10 p-4 shadow-sm animate-in fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white shrink-0 shadow-md shadow-rose-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-xs font-black text-rose-800 dark:text-rose-200 uppercase tracking-wide">
                  MODO INVESTIGACIÓN ACTIVO DE CALIDAD DE CLIENTE
                </b>
                <span className="rounded-md bg-rose-200 text-rose-900 px-2 py-0.2 font-mono text-[10px] font-black">
                  {currentDossier.complaintId}
                </span>
                {currentDossier.complaintSeverity && (
                  <span className="rounded-md bg-purple-200 text-purple-900 px-2 py-0.2 font-mono text-[10px] font-black">
                    Severidad {currentDossier.complaintSeverity}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-950 dark:text-rose-100 mt-1">
                <b>Reclamo:</b> {currentDossier.complaintSummary || 'Desprendimiento de tinta negra y sangrado bajo calor continuo.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-rose-800 dark:text-rose-300 mt-1">
                <span><b>Lote PT:</b> {currentDossier.finishedBatch}</span>
                <span><b>Factura:</b> {currentDossier.invoiceFolio}</span>
                <span><b>MNC Vinculada:</b> MNC-000342</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubtab('Incidencias')}
              className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Ver Reclamo 4M & RMA</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Premium del Expediente */}
      <div className="rounded-3xl border border-theme-subtle bg-gradient-to-br from-theme-surface via-theme-surface to-theme-muted/10 p-6 shadow-sm space-y-6">
        {/* Fila superior: Identidad del Lote y Acciones */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-xl bg-theme-primary/10 px-3 py-1 font-mono text-sm font-black text-theme-primary border border-theme-primary/20">
                {currentDossier.opFolio}
              </span>
              <span className="font-mono text-xs font-black text-theme-muted">
                Lote PT: <b className="text-theme-main">{currentDossier.finishedBatch}</b>
              </span>
              <span className={`rounded-full px-3 py-0.5 text-xs font-black ${
                currentDossier.status === 'Liberada'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : currentDossier.status === 'Detenida (HOLD)'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {currentDossier.status}
              </span>
              <span className="rounded-full bg-theme-muted/20 px-2.5 py-0.5 text-[11px] font-bold text-theme-muted">
                {currentDossier.area} · {currentDossier.machine}
              </span>
            </div>

            <h1 className="text-xl font-black text-theme-main tracking-tight">
              {currentDossier.partDescription}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-theme-muted">
              <span>Cliente: <b className="text-theme-main">{currentDossier.cliente}</b></span>
              <span>·</span>
              <span>N° Parte: <b className="font-mono text-theme-main">{currentDossier.partNumber}</b></span>
              <span>·</span>
              <span>Pedido: <b className="font-mono text-theme-main">{currentDossier.pedido}</b></span>
              <span>·</span>
              <span>Entrega: <b className="text-theme-main">{currentDossier.due}</b></span>
            </div>
          </div>

          {/* Botones de Acción Primarios */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
            >
              <FileCheck className="h-4 w-4" />
              <span>Exportar Expediente Oficial (PDF)</span>
            </button>

            {onNavigateToProduccion && (
              <button
                type="button"
                onClick={() => onNavigateToProduccion(currentDossier.opFolio)}
                className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-all cursor-pointer shadow-2xs"
              >
                <ExternalLink className="h-3.5 w-3.5 text-theme-muted" />
                <span>Ver OP en Producción</span>
              </button>
            )}

            {onOpenLabelPreview && (
              <button
                type="button"
                onClick={() =>
                  onOpenLabelPreview(
                    currentDossier.opFolio,
                    currentDossier.cliente,
                    currentDossier.partNumber,
                    currentDossier.finishedBatch
                  )
                }
                className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-all cursor-pointer shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5 text-theme-muted" />
                <span>Etiqueta Zebra PT</span>
              </button>
            )}
          </div>
        </div>

        {/* Fila inferior del Hero: Scorecard de Integridad & Métricas de Corrida */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 border-t border-theme-subtle pt-4">
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Integridad Documental
            </span>
            <div className="flex items-baseline gap-1">
              <b className="font-mono text-lg font-black text-theme-main">
                {currentDossier.health.documentationValid ? '100%' : '80%'}
              </b>
              <span className={`text-[10px] font-bold ${currentDossier.health.documentationValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {currentDossier.health.documentationValid ? '100% OK' : 'Pendiente'}
              </span>
            </div>
            <div className="w-full bg-theme-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: currentDossier.health.documentationValid ? '100%' : '80%' }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Genealogía Insumos
            </span>
            <div className="flex items-baseline gap-1">
              <b className="font-mono text-lg font-black text-theme-main">
                {currentDossier.health.lotsIdentified ? '100%' : '75%'}
              </b>
              <span className="text-[10px] text-theme-muted font-bold">
                {currentDossier.materials.length} lotes
              </span>
            </div>
            <div className="w-full bg-theme-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: currentDossier.health.lotsIdentified ? '100%' : '75%' }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Ruta Operativa
            </span>
            <div className="flex items-baseline gap-1">
              <b className="font-mono text-lg font-black text-theme-main">
                {currentDossier.health.routeComplete ? '100%' : '85%'}
              </b>
              <span className="text-[10px] text-theme-muted font-bold">
                {currentDossier.routing.length} etapas
              </span>
            </div>
            <div className="w-full bg-theme-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: currentDossier.health.routeComplete ? '100%' : '85%' }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Gates de Calidad
            </span>
            <div className="flex items-baseline gap-1">
              <b className={`font-mono text-lg font-black ${
                !currentDossier.health.qaGatesComplete ? 'text-rose-600' : 'text-theme-main'
              }`}>
                {currentDossier.health.qaGatesComplete ? '100%' : '75%'}
              </b>
              <span className="text-[10px] text-theme-muted font-bold">
                {currentDossier.qualityGates.length} gates
              </span>
            </div>
            <div className="w-full bg-theme-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  !currentDossier.health.qaGatesComplete ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: currentDossier.health.qaGatesComplete ? '100%' : '75%' }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Despacho & Embarque
            </span>
            <b className={`font-mono text-sm font-black block truncate ${
              currentDossier.health.shippingIdentified
                ? 'text-emerald-600'
                : 'text-amber-600'
            }`}>
              {currentDossier.health.shippingIdentified ? 'Conforme' : 'En andén'}
            </b>
            <small className="text-[10px] text-theme-muted block truncate">
              {currentDossier.remisionFolio}
            </small>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">
              Volumen Producido
            </span>
            <b className="font-mono text-sm font-black text-theme-main block">
              {currentDossier.good.toLocaleString()} pzas
            </b>
            <small className="text-[10px] text-theme-muted block">
              Scrap: <b className="text-rose-600">{currentDossier.scrap.toLocaleString()} ({currentDossier.scrapPercent}%)</b>
            </small>
          </div>
        </div>
      </div>

      {/* 3. Cadena Visual End-to-End: 10 Nodos Interactivos */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-theme-primary" />
              Cadena de Trazabilidad 360° (Haz clic en un eslabón para profundizar)
            </span>
          </div>
          <span className="text-[10px] font-bold text-theme-muted">
            {currentDossier.chainNodes.length} Nodos Integrados
          </span>
        </div>

        {/* Stepper Scrollable */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-[980px]">
            {currentDossier.chainNodes.map((node, idx) => {
              const isLast = idx === currentDossier.chainNodes.length - 1;
              const isDanger = node.status === 'danger';
              const isWarning = node.status === 'warning';
              const isOk = node.status === 'ok';

              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => handleNodeClick(node)}
                    className={`flex-1 rounded-2xl p-2.5 text-left border transition-all cursor-pointer group hover:scale-[1.02] ${
                      isDanger
                        ? 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20'
                        : isWarning
                        ? 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20'
                        : isOk
                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'border-theme-subtle bg-theme-muted/10 hover:bg-theme-muted/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-tight text-theme-muted group-hover:text-theme-main">
                        {node.label}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${
                        isDanger ? 'bg-rose-500 animate-pulse' : isWarning ? 'bg-amber-500' : isOk ? 'bg-emerald-500' : 'bg-theme-muted'
                      }`} />
                    </div>
                    <b className="font-mono text-xs font-black block truncate text-theme-main">
                      {node.folio}
                    </b>
                    <span className="text-[10px] text-theme-muted block truncate mt-0.5">
                      {node.detail}
                    </span>
                  </button>

                  {!isLast && (
                    <ChevronRight className="h-4 w-4 text-theme-muted/40 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Barra de 8 Subtabs Especializadas */}
      <div className="flex border-b border-theme-subtle bg-theme-surface rounded-2xl px-3 gap-1 overflow-x-auto shadow-2xs">
        {[
          { id: 'Resumen' as const, label: 'Resumen', icon: FileText },
          { id: 'Materiales' as const, label: `Materiales (${currentDossier.materials.length})`, icon: Layers },
          { id: 'Proceso' as const, label: `Procesos (${currentDossier.routing.length})`, icon: Wrench },
          { id: 'Calidad' as const, label: `Calidad (${currentDossier.qualityGates.length})`, icon: ShieldCheck },
          { id: 'Embarque' as const, label: 'Embarque & Factura', icon: Truck },
          { id: 'Documentos' as const, label: `Documentos (${currentDossier.documents.length})`, icon: FileCheck },
          { id: 'Incidencias' as const, label: `Incidencias (${currentDossier.incidents.length})`, icon: AlertTriangle },
          { id: 'Historial' as const, label: `Timeline (${currentDossier.timeline.length})`, icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSubtabClick(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubtab === tab.id
                ? 'border-theme-primary text-theme-primary bg-theme-primary/5'
                : 'border-transparent text-theme-muted hover:text-theme-main hover:bg-theme-muted/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 5. Contenido de las 8 Subtabs */}
      <div className="space-y-6">
        {/* SUBTAB 1: RESUMEN */}
        {activeSubtab === 'Resumen' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Sugerencias del Sistema (Moradas & Inteligentes) */}
            {currentDossier.systemSuggestions.length > 0 && (
              <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-purple-950 dark:text-purple-100 flex items-center gap-2">
                    Sugerencias del Sistema & Hallazgos Automáticos de Trazabilidad
                    <span className="rounded-full bg-purple-600 text-white px-2 py-0.2 text-[9px] font-black">
                      AI Quality Insight
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {currentDossier.systemSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 font-mono text-[10px] font-black border border-purple-500/20">
                            {sug.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-bold text-purple-600">
                            Sugerencia inteligente
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-theme-main">
                          {sug.title}
                        </h4>
                        <p className="text-[11px] text-theme-muted leading-relaxed">
                          {sug.explanation}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (sug.targetTab) {
                            setActiveSubtab(sug.targetTab as TraceabilitySubtab);
                          }
                          onToast?.(`✓ Acción iniciada: ${sug.actionLabel}`);
                        }}
                        className="flex items-center justify-between w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-800 dark:text-purple-200 hover:bg-purple-500/20 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>{sug.actionLabel}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid 3 Columnas: Resumen Técnico, Genealogía Express y Logística */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Ficha Técnica de Corrida */}
              <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2.5">
                  <b className="text-xs font-black text-theme-main flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-theme-primary" />
                    Parámetros de Fabricación
                  </b>
                  <span className="font-mono text-[10px] text-theme-muted">{currentDossier.machine}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Área Productiva:</span>
                    <b className="font-bold text-theme-main">{currentDossier.area}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Operador Principal:</span>
                    <b className="font-bold text-theme-main">{currentDossier.operator}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Revisión Ingeniería:</span>
                    <b className="font-bold text-theme-main font-mono">Rev. {currentDossier.revision}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Ubicación PT:</span>
                    <b className="font-bold text-theme-main font-mono">{currentDossier.ptLocation}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Tiempo Total Corrida:</span>
                    <b className="font-mono font-bold text-theme-main">
                      {currentDossier.routing.reduce((acc, r) => acc + r.runMinutesReal, 0)} min
                    </b>
                  </div>
                </div>
              </div>

              {/* Card 2: Lotes Clave de Materia Prima */}
              <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2.5">
                  <b className="text-xs font-black text-theme-main flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    Insumos Críticos del Lote
                  </b>
                  <button
                    type="button"
                    onClick={() => setActiveSubtab('Materiales')}
                    className="text-[10px] text-theme-primary font-bold hover:underline cursor-pointer"
                  >
                    Ver todos ({currentDossier.materials.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {currentDossier.materials.slice(0, 3).map((mat) => (
                    <div key={mat.id} className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-theme-muted block">{mat.type}</span>
                        <b className="font-mono text-[11px] text-theme-main block">{mat.lotNumber}</b>
                        <small className="text-[10px] text-theme-muted block truncate max-w-[170px]">{mat.name}</small>
                      </div>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                        {mat.incomingQaStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Datos de Despacho y Entrega */}
              <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2.5">
                  <b className="text-xs font-black text-theme-main flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    Despacho & Facturación
                  </b>
                  <button
                    type="button"
                    onClick={() => setActiveSubtab('Embarque')}
                    className="text-[10px] text-theme-primary font-bold hover:underline cursor-pointer"
                  >
                    Detalles
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Remisión:</span>
                    <b className="font-mono font-bold text-theme-main">{currentDossier.remisionFolio}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Factura SAT:</span>
                    <b className="font-mono font-bold text-theme-main">{currentDossier.invoiceFolio}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Vehículo / Chofer:</span>
                    <b className="font-bold text-theme-main truncate max-w-[150px]">{currentDossier.shipping.carrierVehicle}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Estado Entrega:</span>
                    <b className="font-bold text-emerald-600 truncate max-w-[150px]">{currentDossier.shipping.deliveryStatus}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Receptor Cliente:</span>
                    <b className="font-bold text-theme-main truncate max-w-[150px]">{currentDossier.shipping.recipientName || 'En tránsito'}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: MATERIALES (Genealogía de Lotes) */}
        {activeSubtab === 'Materiales' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <Layers className="h-4 w-4 text-theme-primary" />
                    Genealogía Ascendente de Lotes de Materia Prima & Certificados CoA
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Insumos empleados en la fabricación del lote PT {currentDossier.finishedBatch}.
                  </p>
                </div>
                <span className="rounded-full bg-theme-muted/20 px-3 py-1 font-mono text-xs font-bold text-theme-muted">
                  {currentDossier.materials.length} Insumos Trazados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[850px]">
                  <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                    <tr>
                      <th className="p-3 text-left">Tipo Insumo</th>
                      <th className="p-3 text-left">Descripción & SKU</th>
                      <th className="p-3 text-left">Lote Proveedor</th>
                      <th className="p-3 text-left">Proveedor</th>
                      <th className="p-3 text-right">Cant. Consumida</th>
                      <th className="p-3 text-left">Certificado Calidad (CoA)</th>
                      <th className="p-3 text-center">Estado Inspección</th>
                      <th className="p-3 text-right">Recepción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {currentDossier.materials.map((m) => (
                      <tr key={m.id} className="hover:bg-theme-muted/10 transition-colors">
                        <td className="p-3">
                          <span className="rounded-lg bg-theme-primary/10 px-2 py-0.5 text-[10px] font-bold text-theme-primary">
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <b className="text-theme-main block">{m.name}</b>
                          <small className="text-theme-muted block">SKU: {m.sku}</small>
                        </td>
                        <td className="p-3 font-mono">
                          <b className="text-indigo-600 dark:text-indigo-400 font-bold block">{m.lotNumber}</b>
                          <small className="text-theme-muted block">OC: {m.poFolio || 'PO-2026-0812'}</small>
                        </td>
                        <td className="p-3 font-medium text-theme-main">
                          {m.supplier}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-theme-main">
                          {m.consumed}
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          {m.coaFolio ? (
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <FileCheck className="h-3.5 w-3.5" />
                              {m.coaFolio}
                            </span>
                          ) : (
                            <span className="text-theme-muted italic">No requerido</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                            {m.incomingQaStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-theme-muted text-[11px]">
                          {m.incomingDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PROCESO (Routing Autorizado vs Ejecutado) */}
        {activeSubtab === 'Proceso' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-theme-primary" />
                    Ruta de Manufactura: Autorizada vs Ejecutada en Piso
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Comparativa de máquinas, operadores, tiempos de corrida y generación de scrap por centro de trabajo.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-theme-muted/20 px-2.5 py-0.5 text-[10px] font-bold text-theme-muted">
                    Tolerancia Scrap: &lt;2.0%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {currentDossier.routing.map((step) => {
                  const durationDelta = step.runMinutesReal - step.runMinutesStandard;
                  const isDurationHigher = durationDelta > 0;

                  return (
                    <div
                      key={step.stepNumber}
                      className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-theme-primary/10 font-mono text-xs font-black text-theme-primary">
                            0{step.stepNumber}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <b className="text-sm font-bold text-theme-main">{step.process}</b>
                              <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 font-mono text-[10px] font-bold text-theme-muted">
                                {step.machine}
                              </span>
                              <span className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                                step.status === 'Completada'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}>
                                {step.status}
                              </span>
                            </div>
                            <p className="text-xs text-theme-muted mt-0.5">
                              Operador: <b className="text-theme-main">{step.operator}</b> · Horario: {step.startTime} - {step.endTime}
                            </p>
                          </div>
                        </div>

                        {/* Tiempos y Scrap */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-theme-muted block">Corrida:</span>
                            <div className="flex items-baseline gap-1">
                              <b className="font-black text-theme-main">{step.runMinutesReal} min</b>
                              <span className={`text-[10px] font-bold ${isDurationHigher ? 'text-amber-600' : 'text-emerald-600'}`}>
                                ({isDurationHigher ? `+${durationDelta}` : durationDelta} min vs std {step.runMinutesStandard}m)
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-theme-muted block">Scrap:</span>
                            <b className="font-black text-rose-600">
                              {step.scrapQty} {step.scrapUom} ({step.scrapCause || 'Arranque'})
                            </b>
                          </div>
                        </div>
                      </div>

                      {/* Parámetros Operativos Registrados */}
                      {step.deviationNote && (
                        <div className="rounded-xl bg-theme-muted/10 p-2.5 border border-theme-subtle text-[11px]">
                          <span className="text-theme-muted font-bold">Nota operativa: </span>
                          <span className="text-theme-main">{step.deviationNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: CALIDAD (Gates y Auditorías de Piso) */}
        {activeSubtab === 'Calidad' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-theme-primary" />
                    Gates de Inspección & Certificación de Calidad en Piso
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Puntos de control estandarizados bajo IATF 16949 / ISO 9001: Preimpresión, Primeras Piezas, Controles y Auditoría Final.
                  </p>
                </div>

                {onOpenQualityRelease && (
                  <button
                    type="button"
                    onClick={() => onOpenQualityRelease(currentDossier.opFolio)}
                    className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 transition-colors shadow-xs cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Abrir Auditoría en Calidad</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDossier.qualityGates.map((gate) => {
                  const isConforme = gate.dictamen === 'Conforme' || gate.dictamen === 'Aprobado';

                  return (
                    <div
                      key={gate.id}
                      className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <b className="text-sm font-bold text-theme-main block">
                            {gate.gate}
                          </b>
                          <p className="text-[11px] text-theme-muted mt-0.5">
                            Auditor: <b>{gate.auditor}</b> · {gate.timestamp}
                          </p>
                        </div>

                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                          isConforme
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {gate.dictamen}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-theme-muted/10 border border-theme-subtle text-xs space-y-1">
                        <span className="text-[10px] font-bold text-theme-muted uppercase block">Notas & Hallazgos:</span>
                        <p className="text-theme-main leading-relaxed">
                          {gate.notes}
                        </p>
                      </div>

                      {/* Mediciones de laboratorio */}
                      {gate.measurements && gate.measurements.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-theme-muted block">
                            Mediciones Instrumentales:
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {gate.measurements.map((m, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs space-y-0.5"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-theme-muted text-[10px]">{m.parameter}</span>
                                  <span className={`text-[10px] font-bold ${m.status === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {m.status === 'ok' ? '✓ OK' : '✗ Alerta'}
                                  </span>
                                </div>
                                <b className="font-mono text-xs text-theme-main block">
                                  {m.actual}
                                </b>
                                <small className="text-[9px] text-theme-muted block truncate">
                                  Estándar: {m.standard}
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: EMBARQUE & FACTURACIÓN */}
        {activeSubtab === 'Embarque' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <Truck className="h-4 w-4 text-theme-primary" />
                    Custodia Logística, Despacho & Facturación Comercial
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Conexión entre el lote de PT {currentDossier.finishedBatch}, la salida de almacén y el comprobante SAT.
                  </p>
                </div>

                {onNavigateToEmbarques && (
                  <button
                    type="button"
                    onClick={onNavigateToEmbarques}
                    className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-theme-muted" />
                    <span>Ir a Embarques</span>
                  </button>
                )}
              </div>

              {/* Tarjetas de Datos Logísticos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-1 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Remisión de Entrega:</span>
                  <b className="font-mono text-sm font-black text-theme-primary block">
                    {currentDossier.remisionFolio}
                  </b>
                  <small className="text-[10px] text-theme-muted block">Folio oficial de transporte</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-1 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Factura Comercial SAT:</span>
                  <b className="font-mono text-sm font-black text-theme-main block">
                    {currentDossier.invoiceFolio}
                  </b>
                  <small className="text-[10px] text-theme-muted block">
                    Total: ${currentDossier.invoiceTotal.toLocaleString()} MXN ({currentDossier.invoiceDate})
                  </small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-1 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Transporte & Chofer:</span>
                  <b className="text-xs font-bold text-theme-main block truncate">
                    {currentDossier.shipping.carrierVehicle}
                  </b>
                  <small className="text-[10px] text-theme-muted block font-mono">
                    Operador: {currentDossier.shipping.driver}
                  </small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-1 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Estado de Entrega:</span>
                  <b className="text-xs font-bold text-theme-main block">
                    {currentDossier.shipping.deliveryStatus}
                  </b>
                  <small className="text-[10px] text-emerald-600 font-bold block">
                    {currentDossier.shipping.recipientName ? `Recibió: ${currentDossier.shipping.recipientName}` : 'En ruta'}
                  </small>
                </div>
              </div>

              {/* Detalle de Embalaje y Almacén */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2">
                <b className="text-xs font-bold text-theme-main block">
                  Configuración de Paletizado & Ubicación de Almacén PT:
                </b>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-theme-muted text-[10px] block">Almacén PT:</span>
                    <b className="font-mono text-theme-main">{currentDossier.ptWarehouse}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted text-[10px] block">Ubicación Andén:</span>
                    <b className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{currentDossier.ptLocation}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted text-[10px] block">Embalaje:</span>
                    <b className="font-mono text-theme-main">{currentDossier.shipping.packagingSummary}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted text-[10px] block">Dirección de Destino:</span>
                    <b className="font-mono text-theme-main truncate block">{currentDossier.shipping.deliveryAddress}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: DOCUMENTOS (Bóveda Documental) */}
        {activeSubtab === 'Documentos' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-theme-primary" />
                    Bóveda Documental Digital del Lote
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Documentos controlados, certificados, hojas técnicas y reportes firmados electrónicamente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimir Expediente Completo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentDossier.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 font-mono text-[9px] font-bold text-theme-muted">
                          {doc.type}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                          {doc.status}
                        </span>
                      </div>
                      <b className="text-xs font-bold text-theme-main block">
                        {doc.title}
                      </b>
                      <p className="text-[11px] text-theme-muted">
                        Código: <b className="font-mono text-theme-main">{doc.code} (Rev. {doc.revision})</b>
                      </p>
                      <small className="text-[10px] text-theme-muted block">
                        Autor: {doc.author} · {doc.date}
                      </small>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-theme-subtle">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocPreview(doc.title);
                          onToast?.(`✓ Previsualizando documento: ${doc.title}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-theme-subtle bg-theme-muted/10 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-theme-muted" />
                        <span>Ver</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onToast?.(`✓ Descargando archivo firmado: ${doc.code}.${doc.fileFormat.toLowerCase()}`);
                        }}
                        className="p-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/20 transition-colors text-theme-muted hover:text-theme-main cursor-pointer"
                        title="Descargar archivo original"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 7: INCIDENCIAS & NO CONFORMIDADES */}
        {activeSubtab === 'Incidencias' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-theme-primary" />
                    Incidencias, Desviaciones, No Conformidades y Reclamos
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Historial de eventos de calidad vinculados a esta orden y lote.
                  </p>
                </div>
                <span className="rounded-full bg-theme-muted/20 px-3 py-1 font-mono text-xs font-bold text-theme-muted">
                  {currentDossier.incidents.length} Eventos Registrados
                </span>
              </div>

              {currentDossier.incidents.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                  <b className="text-sm font-bold text-theme-main block">
                    Cero incidencias registradas en este expediente
                  </b>
                  <p className="text-xs text-theme-muted">
                    El lote se fabricó y liberó sin no conformidades (MNC), quejas ni desviaciones.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDossier.incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                            inc.severity === 'Crítica'
                              ? 'bg-rose-500 text-white'
                              : inc.severity === 'Media'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {inc.type} · {inc.severity}
                          </span>
                          <b className="font-mono text-xs font-bold text-theme-main">{inc.id}</b>
                          <span className="text-xs text-theme-muted font-semibold">
                            {inc.title}
                          </span>
                        </div>

                        <span className="font-mono text-[10px] text-theme-muted">
                          {inc.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-theme-main leading-relaxed">
                        <b>Impacto:</b> {inc.impact}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-theme-muted/10 p-3 text-xs">
                        <div>
                          <span className="text-[10px] text-theme-muted uppercase font-bold block">Resolución / Acción:</span>
                          <b className="text-theme-main">{inc.resolution}</b>
                        </div>
                        <div>
                          <span className="text-[10px] text-theme-muted uppercase font-bold block">Responsable:</span>
                          <b className="text-theme-main">{inc.responsible}</b>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 8: HISTORIAL & TIMELINE END-TO-END */}
        {activeSubtab === 'Historial' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
                    <History className="h-4 w-4 text-theme-primary" />
                    Línea de Tiempo End-to-End (Custodia Digital)
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Secuencia cronológica verificada de eventos desde la orden de venta hasta el despacho y seguimiento.
                  </p>
                </div>
                <span className="rounded-full bg-theme-muted/20 px-3 py-1 font-mono text-xs font-bold text-theme-muted">
                  {currentDossier.timeline.length} Hitos Registrados
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-theme-subtle">
                {currentDossier.timeline.map((event) => {
                  const isDanger = event.badgeTone === 'danger';
                  const isWarning = event.badgeTone === 'warning';
                  const isSuccess = event.badgeTone === 'success';

                  return (
                    <div key={event.id} className="relative group">
                      {/* Dot Icon */}
                      <span className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-theme-surface ${
                        isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isSuccess ? 'bg-emerald-500' : 'bg-theme-primary'
                      }`} />

                      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 font-mono text-[9px] font-bold text-theme-muted">
                              {event.category}
                            </span>
                            <b className="text-xs font-bold text-theme-main">{event.title}</b>
                          </div>
                          <span className="font-mono text-[10px] text-theme-muted">
                            {event.time}
                          </span>
                        </div>

                        <p className="text-xs text-theme-muted leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-theme-subtle text-[10px] text-theme-muted">
                          <span>Responsable: <b className="text-theme-main">{event.user}</b></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Previsualización de Documento */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-5 w-5 text-theme-primary" />
                <b className="text-sm font-bold text-theme-main">{selectedDocPreview}</b>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="rounded-xl p-1 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-theme-muted/10 border border-theme-subtle text-center space-y-3">
              <FileCheck className="h-12 w-12 text-theme-primary mx-auto" />
              <b className="text-sm font-black text-theme-main block">
                Documento Digital Verificado & Firmado
              </b>
              <p className="text-xs text-theme-muted max-w-md mx-auto">
                El archivo cuenta con hash criptográfico SHA-256 válido y custodia digital conforme a la norma ISO 9001:2015 sección 7.5 (Información documentada).
              </p>
              <div className="font-mono text-[10px] text-theme-muted">
                Hash: <span className="text-theme-main">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => {
                  onToast?.(`✓ Descargando archivo ${selectedDocPreview}`);
                  setSelectedDocPreview(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Descargar Copia Certificada</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exportación Oficial / Imprimir */}
      {isExportModalOpen && (
        <TraceabilityExportModal
          dossier={currentDossier}
          onClose={() => setIsExportModalOpen(false)}
          onToast={onToast}
        />
      )}
    </div>
  );
};
