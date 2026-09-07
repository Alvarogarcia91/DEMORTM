import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FilePlus2,
  FileSearch,
  FileText,
  Filter,
  Layers,
  PieChart,
  Plus,
  Printer,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Users,
} from 'lucide-react';
import {
  CustomerComplaint,
  INITIAL_CUSTOMER_COMPLAINTS,
  CUSTOMER_QUALITY_ANALYTICS,
} from '../../data/mockCustomerQualityData';
import { ExpedienteQueja360Modal } from './ExpedienteQueja360Modal';
import { NuevaQuejaModal } from './NuevaQuejaModal';

interface Props {
  onToast: (msg: string) => void;
  activeRole: string;
}

export const CustomerQualityWorkspace: React.FC<Props> = ({
  onToast,
  activeRole,
}) => {
  // Master complaints state initialized from INITIAL_CUSTOMER_COMPLAINTS
  const [complaints, setComplaints] = useState<CustomerComplaint[]>(INITIAL_CUSTOMER_COMPLAINTS);

  // View state: Casos vs Analítica
  const [activeView, setActiveView] = useState<'casos' | 'analitica'>('casos');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedSeverity, setSelectedSeverity] = useState('Todas');
  const [selectedClient, setSelectedClient] = useState('Todos');

  // Modals state
  const [selectedComplaintForDetail, setSelectedComplaintForDetail] = useState<CustomerComplaint | null>(null);
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);

  // KPIs
  const totalComplaints = complaints.length;
  const activeComplaints = complaints.filter(
    (c) => c.status !== 'Cerrada' && c.status !== 'Rechazada'
  ).length;
  const approvedRmas = complaints.filter((c) => !!c.rmaNumber).length;
  const totalClaimedValue = complaints.reduce((sum, c) => sum + c.claimedValue, 0);
  const totalClaimedUnits = complaints.reduce((sum, c) => sum + c.claimedQuantity, 0);
  const acceptedRate = '83.3%';

  // Update complaint in state
  const handleUpdateComplaint = (updated: CustomerComplaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSaveNewComplaint = (newComplaint: CustomerComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Status filter
      if (selectedStatus !== 'Todos' && c.status !== selectedStatus) return false;

      // Severity filter
      if (selectedSeverity !== 'Todas' && c.severity !== selectedSeverity) return false;

      // Client filter
      if (selectedClient !== 'Todos' && !c.client.includes(selectedClient)) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchRma = c.rmaNumber?.toLowerCase().includes(q) || false;
        const matchClient = c.client.toLowerCase().includes(q);
        const matchPart = c.partNumber.toLowerCase().includes(q);
        const matchDefect = c.defectType.toLowerCase().includes(q);
        const matchOp = c.traceability.opFolio.toLowerCase().includes(q);
        const matchLot = c.traceability.lotNumber.toLowerCase().includes(q);
        const matchInvoice = c.traceability.invoiceNumber.toLowerCase().includes(q);

        return (
          matchId ||
          matchRma ||
          matchClient ||
          matchPart ||
          matchDefect ||
          matchOp ||
          matchLot ||
          matchInvoice
        );
      }

      return true;
    });
  }, [complaints, selectedStatus, selectedSeverity, selectedClient, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Abierta':
        return (
          <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 text-[9px] font-bold">
            Abierta
          </span>
        );
      case 'En evaluación QA':
        return (
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 text-[9px] font-bold">
            En evaluación QA
          </span>
        );
      case 'RMA Aprobado':
        return (
          <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 text-[9px] font-black">
            RMA Aprobado
          </span>
        );
      case 'En Reinspección':
        return (
          <span className="rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 text-[9px] font-bold">
            En Reinspección
          </span>
        );
      case 'Reemplazo Emitido':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-bold">
            Reemplazo Emitido
          </span>
        );
      case 'Rechazada':
        return (
          <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 text-[9px] font-black">
            Rechazada
          </span>
        );
      case 'Cerrada':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-black">
            Cerrada
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-theme-muted/20 text-theme-muted px-2 py-0.5 text-[9px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-xs">
      {/* 1. Header Ejecutivo & Botones de Acción */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-base font-black text-theme-main">
              Customer Quality: Quejas de Clientes & Flujo RMA
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Gestión de no conformidades externas, trazabilidad a OP/lote/embarque/factura, evaluación 4M y ciclo de retorno/reemplazo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Casos vs Analítica */}
          <div className="flex rounded-2xl border border-theme-subtle bg-theme-muted/10 p-1">
            <button
              type="button"
              onClick={() => setActiveView('casos')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'casos'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Casos ({complaints.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('analitica')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'analitica'
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analítica RMA</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onToast('✓ Reporte gerencial de Quejas & RMA exportado en PDF para revisión mensual.')}
            className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-theme-primary" />
            <span className="hidden sm:inline">Exportar Reporte SGC</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewComplaintModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Nueva Queja</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPIs Customer Quality */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Quejas Registradas
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-theme-main">
            {totalComplaints}
          </b>
          <small className="text-[10px] text-theme-muted mt-0.5 block">En periodo de evaluación</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Casos Activos / En Evaluación
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-amber-600">
            {activeComplaints}
          </b>
          <small className="text-[10px] text-amber-600 font-bold mt-0.5 block">Requieren seguimiento QA</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            RMAs Autorizados
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-purple-600">
            {approvedRmas}
          </b>
          <small className="text-[10px] text-purple-600 font-bold mt-0.5 block">En retorno o reinspección</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Tasa Aceptación Técnica
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-emerald-600">
            {acceptedRate}
          </b>
          <small className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Reclamos procedentes</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Monto Total Reclamado
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-rose-600">
            ${totalClaimedValue.toLocaleString()} MXN
          </b>
          <small className="text-[10px] text-theme-muted mt-0.5 block">
            {totalClaimedUnits.toLocaleString()} pzas afectadas
          </small>
        </div>
      </div>

      {/* 3. Sugerencias del Sistema SMART (Moradas y Accionables) */}
      <div className="bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 border border-purple-500/30 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                Sugerencias SMART de Customer Quality
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                  Acciones Críticas
                </span>
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                Intervenciones preventivas y operativas para salvaguardar la relación con el cliente y blindar auditorías IATF 16949.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Actionable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: RMA Panasonic */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300">
                  RMA-2026-014
                </span>
                <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.2 text-[9px] font-bold">
                  Cuarentena
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                Panasonic: 15,000 etiquetas recibidas
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                Retorno físico arribó por Castores a Rampa QA-02. Requiere dictamen de reinspección para liberar la OP de reposición urgente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const target = complaints.find((c) => c.id === 'QJ-2026-014');
                if (target) setSelectedComplaintForDetail(target);
              }}
              className="flex items-center justify-between w-full rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 cursor-pointer transition-all"
            >
              <span>Gestionar Reinspección RMA</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: B&D Arte Obsoleto */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400">
                  QJ-2026-018
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-bold">
                  Crítica
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                BLACK & DECKER: Error de Arte UL
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                Defecto confirmado en texto de seguridad. Vinculado a MNC-000348. Se sugiere abrir acción correctiva ICAR inmediata en SGC.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const target = complaints.find((c) => c.id === 'QJ-2026-018');
                if (target) setSelectedComplaintForDetail(target);
              }}
              className="flex items-center justify-between w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 shadow-2xs cursor-pointer transition-all"
            >
              <span>Abrir Expediente & Vincular ICAR</span>
              <ShieldAlert className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Caso Nuevo Truper */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                  QJ-2026-020
                </span>
                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.2 text-[9px] font-bold">
                  Nueva
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                Truper: Reclamo de Tensión en Bobina
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                Reportado hoy en OP-2026-95254 (12,000 pzas). Pendiente emitir dictamen técnico de evaluación QA bajo metodología 4M.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const target = complaints.find((c) => c.id === 'QJ-2026-020');
                if (target) setSelectedComplaintForDetail(target);
              }}
              className="flex items-center justify-between w-full rounded-xl border border-theme-subtle bg-theme-muted/10 hover:bg-theme-muted/30 px-3 py-2 text-xs font-bold text-theme-main shadow-2xs cursor-pointer transition-all"
            >
              <span>Dictaminar Caso con Causa 4M</span>
              <ShieldCheck className="h-3.5 w-3.5 text-theme-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. VISTA CASOS: Tabla Master y Filtros */}
      {activeView === 'casos' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Barra de Filtros */}
          <div className="flex flex-col gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Buscador */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por folio queja, RMA, cliente, N° parte, OP (95250), lote, factura..."
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface pl-9 pr-3 py-2 text-xs font-medium text-theme-main focus:outline-none focus:border-theme-primary"
                />
              </div>

              {/* Filtro por Cliente */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-theme-muted">Cliente:</span>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                >
                  <option value="Todos">Todos los clientes</option>
                  <option value="Panasonic">Panasonic Industrial</option>
                  <option value="TYCO">TYCO Electronics</option>
                  <option value="BLACK & DECKER">BLACK & DECKER</option>
                  <option value="Medifarma">Laboratorios Medifarma</option>
                  <option value="Siemens">Siemens Healthcare</option>
                  <option value="Truper">Truper Herramientas</option>
                </select>
              </div>
            </div>

            {/* Pills de Estado y Severidad */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-3">
              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-theme-muted mr-1">Estado:</span>
                {[
                  'Todos',
                  'Abierta',
                  'En evaluación QA',
                  'RMA Aprobado',
                  'En Reinspección',
                  'Reemplazo Emitido',
                  'Rechazada',
                  'Cerrada',
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      selectedStatus === st
                        ? 'bg-theme-primary text-white shadow-xs'
                        : 'bg-theme-muted/10 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main border border-theme-subtle'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Severity Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-theme-muted mr-1">Severidad:</span>
                {['Todas', 'Crítica', 'Mayor', 'Menor'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSelectedSeverity(sev)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSeverity === sev
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-theme-muted/10 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main border border-theme-subtle'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-theme-main">
                  Registro Maestro de Reclamos y Solicitudes de RMA
                </h3>
                <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[10px] font-mono font-bold text-theme-main">
                  {filteredComplaints.length} de {complaints.length}
                </span>
              </div>
              <span className="text-[11px] text-theme-muted hidden sm:inline">
                Clic en cualquier fila para abrir el Expediente 360
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-xs">
                <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                  <tr>
                    <th className="p-3 text-left">Folio Queja & RMA</th>
                    <th className="p-3 text-left">Cliente & Contacto</th>
                    <th className="p-3 text-left">Producto / N° Parte</th>
                    <th className="p-3 text-left">Defecto Reportado</th>
                    <th className="p-3 text-left">Trazabilidad (OP / Lote)</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-right">Reclamado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-theme-muted/10 transition-colors group cursor-pointer"
                      onClick={() => setSelectedComplaintForDetail(c)}
                    >
                      {/* Folio Queja & RMA */}
                      <td className="p-3 font-mono">
                        <b className="text-theme-main font-bold block text-xs">{c.id}</b>
                        {c.rmaNumber ? (
                          <span className="rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 text-[9px] font-black border border-purple-500/20">
                            {c.rmaNumber}
                          </span>
                        ) : (
                          <span className="text-theme-muted text-[10px] italic">Sin RMA</span>
                        )}
                        <small className="text-theme-muted block mt-0.5">{c.date}</small>
                      </td>

                      {/* Cliente & Contacto */}
                      <td className="p-3">
                        <strong className="text-theme-main font-bold block text-xs group-hover:text-theme-primary transition-colors">
                          {c.client}
                        </strong>
                        <small className="text-theme-muted block text-[10px] truncate max-w-[160px]">
                          {c.clientContact}
                        </small>
                      </td>

                      {/* Producto / N° Parte */}
                      <td className="p-3 font-mono">
                        <b className="text-theme-main block text-xs">{c.partNumber}</b>
                        <small className="text-theme-muted block text-[10px] truncate max-w-[160px]">
                          {c.partDescription}
                        </small>
                      </td>

                      {/* Defecto Reportado */}
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                              c.severity === 'Crítica'
                                ? 'bg-rose-500 text-white'
                                : c.severity === 'Mayor'
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {c.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-theme-main line-clamp-2 leading-relaxed">
                          {c.defectType}
                        </p>
                      </td>

                      {/* Trazabilidad */}
                      <td className="p-3 font-mono" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-0.5">
                          <span className="rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 text-[9px] font-black block w-fit">
                            {c.traceability.opFolio}
                          </span>
                          <small className="text-theme-muted block text-[9px]">
                            Lote: {c.traceability.lotNumber}
                          </small>
                          <small className="text-theme-muted block text-[9px]">
                            Emb: {c.traceability.shipmentFolio}
                          </small>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="p-3">
                        {getStatusBadge(c.status)}
                        {c.rmaDetails && (
                          <small className="text-[9px] text-purple-600 block mt-0.5 font-bold">
                            {c.rmaDetails.resolutionStatus}
                          </small>
                        )}
                      </td>

                      {/* Reclamado */}
                      <td className="p-3 text-right font-mono">
                        <b className="text-rose-600 block text-xs font-bold">
                          ${c.claimedValue.toLocaleString()}
                        </b>
                        <small className="text-theme-muted block text-[10px]">
                          {c.claimedQuantity.toLocaleString()} pzas
                        </small>
                      </td>

                      {/* Acciones */}
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* Ver Expediente */}
                          <button
                            type="button"
                            onClick={() => setSelectedComplaintForDetail(c)}
                            className="rounded-lg p-1.5 text-theme-muted hover:bg-theme-muted/30 hover:text-theme-main transition-colors cursor-pointer"
                            title="Ver expediente 360"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Gestionar RMA */}
                          {c.rmaNumber && (
                            <button
                              type="button"
                              onClick={() => setSelectedComplaintForDetail(c)}
                              className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-500/10 transition-colors cursor-pointer"
                              title="Gestionar flujo RMA"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}

                          {/* Dictaminar */}
                          {!c.qaEvaluation && (
                            <button
                              type="button"
                              onClick={() => setSelectedComplaintForDetail(c)}
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                              title="Dictaminar con causa 4M"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. VISTA ANALÍTICA RMA & CUSTOMER QUALITY */}
      {activeView === 'analitica' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Pareto de Defectos */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-theme-primary" />
                <div>
                  <h3 className="font-black text-sm text-theme-main">
                    Análisis de Pareto: Defectos Más Reclamados por Clientes
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Regla 80/20: concentración de no conformidades para orientar planes de control y acciones correctivas.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-theme-muted/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-theme-main">
                Total acumulado: 100%
              </span>
            </div>

            <div className="space-y-3">
              {CUSTOMER_QUALITY_ANALYTICS.paretoDefects.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-theme-main">{item.defect}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className={item.tone}><b>{item.count} casos</b> ({item.percentage}%)</span>
                      <span className="text-theme-muted text-[10px]">Acumulado: {item.cumulative}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-theme-muted/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-rose-600'
                          : idx === 1
                          ? 'bg-amber-500'
                          : idx === 2
                          ? 'bg-purple-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Desglose por Cliente & Disposición RMA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Desglose por Cliente */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
              <b className="text-xs font-bold text-theme-main flex items-center gap-1.5 border-b border-theme-subtle pb-3">
                <Building2 className="h-4 w-4 text-theme-primary" />
                Desempeño y Reclamos por Cuenta de Cliente
              </b>
              <div className="space-y-2">
                {CUSTOMER_QUALITY_ANALYTICS.byClient.map((client, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3 flex items-center justify-between"
                  >
                    <div>
                      <b className="text-theme-main block text-xs">{client.client}</b>
                      <span className="text-[10px] text-theme-muted">
                        {client.units.toLocaleString()} pzas reclamadas · {client.rmaCount} RMA emitido
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <b className="text-rose-600 block text-xs">${client.value.toLocaleString()} MXN</b>
                      <span
                        className={`text-[9px] font-bold ${
                          client.status === 'Crítico'
                            ? 'text-rose-600'
                            : client.status === 'Atención'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disposición de RMA */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
              <b className="text-xs font-bold text-theme-main flex items-center gap-1.5 border-b border-theme-subtle pb-3">
                <RotateCcw className="h-4 w-4 text-purple-600" />
                Destino y Disposición de Producto Retornado (RMA)
              </b>
              <div className="space-y-3">
                {CUSTOMER_QUALITY_ANALYTICS.rmaDispositions.map((disp, idx) => (
                  <div key={idx} className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <b className="text-theme-main">{disp.disposition}</b>
                      <span className="font-mono font-bold text-purple-600">{disp.percentage}%</span>
                    </div>
                    <p className="text-[11px] text-theme-muted">{disp.note}</p>
                    <div className="h-1.5 w-full rounded-full bg-theme-muted/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-600"
                        style={{ width: `${disp.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Expediente 360 */}
      {selectedComplaintForDetail && (
        <ExpedienteQueja360Modal
          complaint={selectedComplaintForDetail}
          onClose={() => setSelectedComplaintForDetail(null)}
          onUpdateComplaint={handleUpdateComplaint}
          onToast={onToast}
          activeRole={activeRole}
        />
      )}

      {/* MODAL 2: Nueva Queja */}
      {showNewComplaintModal && (
        <NuevaQuejaModal
          onClose={() => setShowNewComplaintModal(false)}
          onSave={handleSaveNewComplaint}
          onToast={onToast}
        />
      )}
    </div>
  );
};
