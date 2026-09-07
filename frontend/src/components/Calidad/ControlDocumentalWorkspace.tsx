import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
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
  GitBranch,
  History,
  Layers,
  Lock,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  CONTROLLED_DOCUMENTS,
  ControlledDocument,
  DocumentRevision,
  DocumentAuditTrailEntry,
  DocumentDestructionEvidence,
} from '../../data/mockCalidadData';
import { ControlledDocumentDetailModal } from './ControlledDocumentDetailModal';
import { NuevaRevisionModal } from './NuevaRevisionModal';
import { ActaDestruccionModal } from './ActaDestruccionModal';
import { SimularBloqueoObsoletoModal } from './SimularBloqueoObsoletoModal';

interface Props {
  onToast: (msg: string) => void;
  activeRole: string;
}

export const ControlDocumentalWorkspace: React.FC<Props> = ({
  onToast,
  activeRole,
}) => {
  // Master document state initialized from CONTROLLED_DOCUMENTS
  const [documents, setDocuments] = useState<ControlledDocument[]>(CONTROLLED_DOCUMENTS);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [filterLinkedOnly, setFilterLinkedOnly] = useState<boolean>(false);

  // Modals state
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<ControlledDocument | null>(null);
  const [selectedDocForNewRev, setSelectedDocForNewRev] = useState<ControlledDocument | null>(null);
  const [showNewRevWizard, setShowNewRevWizard] = useState<boolean>(false);
  const [selectedDestructionModal, setSelectedDestructionModal] = useState<{
    doc: ControlledDocument;
    rev: DocumentRevision;
    evidence: DocumentDestructionEvidence;
  } | null>(null);
  const [showSimulateBlockModal, setShowSimulateBlockModal] = useState<boolean>(false);
  const [docForBlockSimulation, setDocForBlockSimulation] = useState<ControlledDocument | undefined>(undefined);

  // KPIs
  const totalDocs = documents.length;
  const vigentesCount = documents.filter((d) => d.status === 'Vigente').length;
  const enRevisionCount = documents.filter((d) => d.status === 'En revisión').length;
  const obsoletosCount = documents.filter((d) => d.status === 'Obsoleto').length;
  const totalPhysicalCopies = documents.reduce((acc, d) => acc + (d.physicalCopiesCount || 0), 0);

  // Handlers for state updates
  const handleApproveRevision = (docCode: string, revisionId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.code !== docCode) return doc;

        const updatedRevisions = doc.revisions.map((rev) => {
          if (rev.revision === revisionId) {
            return {
              ...rev,
              status: 'Vigente' as const,
              approvedBy: 'Alicia Ramírez (Calidad)',
              effectiveDate: '07 Sep 2026',
            };
          }
          if (rev.status === 'Vigente') {
            return {
              ...rev,
              status: 'Obsoleta' as const,
              destructionEvidence: {
                certificateNumber: `ACT-DEST-2026-095`,
                date: '07 Sep 2026',
                destroyedBy: 'Alicia Ramírez',
                physicalCopiesRetrieved: doc.physicalCopiesCount || 2,
                destructionMethod: 'Triturado mecánico de alta seguridad' as const,
                retrievalLocation: doc.physicalLocations?.join(', ') || 'Piso de Producción',
                notes: 'Retiro y triturado automático al aprobar nueva revisión.',
              },
            };
          }
          return rev;
        });

        const newAuditEntry: DocumentAuditTrailEntry = {
          id: `aud-${Date.now()}`,
          timestamp: '07 Sep 2026 · 13:10',
          action: 'Puesta en Vigor',
          user: 'Alicia Ramírez',
          role: 'Aseguramiento de Calidad',
          notes: `Aprobación y puesta en vigor de ${revisionId}. Versión previa enviada a destrucción física.`,
          revision: revisionId,
        };

        return {
          ...doc,
          revision: revisionId,
          status: 'Vigente' as const,
          effectiveDate: '07 Sep 2026',
          revisions: updatedRevisions,
          auditTrail: [newAuditEntry, ...doc.auditTrail],
        };
      })
    );
  };

  const handleSaveNewRevision = (
    docCode: string,
    newRevision: DocumentRevision,
    auditEntry: DocumentAuditTrailEntry,
    newPhysicalCount?: number,
    newLocations?: string[]
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.code !== docCode) return doc;

        let updatedRevisions = [...doc.revisions];
        if (newRevision.status === 'Vigente') {
          updatedRevisions = updatedRevisions.map((rev) =>
            rev.status === 'Vigente'
              ? {
                  ...rev,
                  status: 'Obsoleta' as const,
                  destructionEvidence: {
                    certificateNumber: `ACT-DEST-2026-099`,
                    date: '07 Sep 2026',
                    destroyedBy: 'Alicia Ramírez',
                    physicalCopiesRetrieved: doc.physicalCopiesCount || 2,
                    destructionMethod: 'Triturado mecánico de alta seguridad' as const,
                    retrievalLocation: doc.physicalLocations?.join(', ') || 'Prensas y Mesas QA',
                    notes: 'Versión previa sustituida por nueva revisión.',
                  },
                }
              : rev
          );
        }

        updatedRevisions.unshift(newRevision);

        return {
          ...doc,
          revision: newRevision.status === 'Vigente' ? newRevision.revision : doc.revision,
          status: newRevision.status === 'Vigente' ? ('Vigente' as const) : ('En revisión' as const),
          effectiveDate: newRevision.status === 'Vigente' ? newRevision.effectiveDate : doc.effectiveDate,
          physicalCopiesCount: newPhysicalCount ?? doc.physicalCopiesCount,
          physicalLocations: newLocations ?? doc.physicalLocations,
          revisions: updatedRevisions,
          auditTrail: [auditEntry, ...doc.auditTrail],
        };
      })
    );
  };

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Type filter
      if (selectedType !== 'Todos') {
        if (selectedType === 'Formatos' && doc.type !== 'Formato') return false;
        if (selectedType === 'WIs / Procedimientos' && doc.type !== 'WI') return false;
        if (selectedType === 'Planos' && doc.type !== 'Plano') return false;
        if (selectedType === 'Planes de Control' && doc.type !== 'Plan de Control') return false;
        if (selectedType === 'PFMEA' && doc.type !== 'PFMEA') return false;
      }

      // Status filter
      if (selectedStatus !== 'Todos' && doc.status !== selectedStatus) {
        return false;
      }

      // Linked filter
      if (filterLinkedOnly && (!doc.linkedOps || doc.linkedOps.length === 0)) {
        return false;
      }

      // Search query
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchCode = doc.code.toLowerCase().includes(q);
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchOwner = doc.owner.toLowerCase().includes(q);
        const matchArea = doc.applicableArea.toLowerCase().includes(q);
        const matchPart = doc.linkedParts?.some((p) => p.toLowerCase().includes(q));
        const matchOp = doc.linkedOps?.some((o) => o.toLowerCase().includes(q));
        const matchClient = doc.linkedClients?.some((c) => c.toLowerCase().includes(q));

        return matchCode || matchTitle || matchOwner || matchArea || matchPart || matchOp || matchClient;
      }

      return true;
    });
  }, [documents, selectedType, selectedStatus, filterLinkedOnly, searchTerm]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-xs">
      {/* 1. Header Ejecutivo & Botones de Acción */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-theme-primary" />
            <h2 className="text-base font-black text-theme-main">
              Biblioteca y Control Documental SGC (ISO 9001 / IATF 16949 § 7.5.3)
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Gobernanza de versiones vigentes, control de copias físicas en planta, aprobación de cambios y trazabilidad inmutable de destrucción.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDocForBlockSimulation(documents.find((d) => d.code === 'PCP-526412'));
              setShowSimulateBlockModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 shadow-2xs cursor-pointer transition-colors"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Simular Bloqueo en OP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const docWithEvidence = documents.find((d) =>
                d.revisions.some((r) => r.destructionEvidence)
              );
              if (docWithEvidence) {
                const revWithEvidence = docWithEvidence.revisions.find((r) => r.destructionEvidence);
                if (revWithEvidence) {
                  setSelectedDestructionModal({
                    doc: docWithEvidence,
                    rev: revWithEvidence,
                    evidence: revWithEvidence.destructionEvidence!,
                  });
                }
              } else {
                onToast('No hay actas registradas.');
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
          >
            <FileCheck2 className="h-4 w-4 text-theme-primary" />
            <span>Ver Actas de Destrucción</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDocForNewRev(documents[0]);
              setShowNewRevWizard(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Nueva Revisión / Doc</span>
          </button>
        </div>
      </div>

      {/* 2. Grid de KPIs Superiores */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Total Documentos SGC
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-theme-main">
            {totalDocs}
          </b>
          <small className="text-[10px] text-theme-muted mt-0.5 block">Formatos, WIs, Planos y PFMEA</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Vigentes en Piso
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-emerald-600">
            {vigentesCount}
          </b>
          <small className="text-[10px] text-emerald-600 font-bold mt-0.5 block">100% autorizados</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            En Flujo / Revisión
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-amber-600">
            {enRevisionCount}
          </b>
          <small className="text-[10px] text-amber-600 font-bold mt-0.5 block">Pendiente firma Calidad</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Obsoletos Retirados
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-rose-600">
            {obsoletosCount}
          </b>
          <small className="text-[10px] text-rose-600 font-bold mt-0.5 block">Con Acta de Destrucción</small>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
            Copias Físicas Rastreables
          </span>
          <b className="mt-1.5 block font-mono text-xl font-black text-theme-primary">
            {totalPhysicalCopies}
          </b>
          <small className="text-[10px] text-theme-muted mt-0.5 block">En prensas y mesas de inspección</small>
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
                Sugerencias SMART de Control Documental
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                  Acciones Recomendadas
                </span>
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                Auditoría preventiva de integridad documental para blindar la operación contra no conformidades de auditoría.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Actionable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Aprobar WI-OF-008 Rev 4 */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300">
                  WI-OF-008 Rev 4
                </span>
                <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.2 text-[9px] font-bold">
                  En revisión
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                Lavado de Batería Heidelberg CD 102
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                Propuesta técnica elaborada por J. Salinas (Operador Líder). Requiere firma de Aseguramiento de Calidad para sustituir Rev 3 en piso.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const targetDoc = documents.find((d) => d.code === 'WI-OF-008');
                if (targetDoc) {
                  setSelectedDocForDetail(targetDoc);
                }
              }}
              className="flex items-center justify-between w-full rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 cursor-pointer transition-all"
            >
              <span>Revisar y Aprobar Rev 4</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Simular Bloqueo en OP */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300">
                  PCP-526412 Rev G
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                  Vigente en OP-95250
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                Prueba de Interlock en Piso
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                Demostración de seguridad: valida cómo el sistema detiene el arranque en la prensa Mark Andy Scout si un operador intenta cargar la Rev F obsoleta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDocForBlockSimulation(documents.find((d) => d.code === 'PCP-526412'));
                setShowSimulateBlockModal(true);
              }}
              className="flex items-center justify-between w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 shadow-2xs cursor-pointer transition-all"
            >
              <span>Simular Bloqueo de Rev F</span>
              <ShieldAlert className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Acta de Destrucción Certificada */}
          <div className="rounded-2xl border border-purple-500/20 bg-theme-surface p-4 flex flex-col justify-between shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300">
                  ACT-DEST-2026-042
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-bold">
                  Certificado
                </span>
              </div>
              <strong className="text-xs font-bold text-theme-main block">
                Destrucción de FM-QA-153 Rev 3
              </strong>
              <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                4 copias físicas retiradas de mesa de empaque y destruidas mediante triturado mecánico. Acta oficial con firma de Alicia Ramírez.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const fmDoc = documents.find((d) => d.code === 'FM-QA-153');
                const rev3 = fmDoc?.revisions.find((r) => r.revision === 'Rev 3');
                if (fmDoc && rev3 && rev3.destructionEvidence) {
                  setSelectedDestructionModal({
                    doc: fmDoc,
                    rev: rev3,
                    evidence: rev3.destructionEvidence,
                  });
                }
              }}
              className="flex items-center justify-between w-full rounded-xl border border-theme-subtle bg-theme-muted/10 hover:bg-theme-muted/30 px-3 py-2 text-xs font-bold text-theme-main shadow-2xs cursor-pointer transition-all"
            >
              <span>Consultar Acta Oficial</span>
              <FileCheck2 className="h-3.5 w-3.5 text-theme-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, título, N° parte (526412), OP (95250), cliente..."
              className="w-full rounded-xl border border-theme-subtle bg-theme-surface pl-9 pr-3 py-2 text-xs font-medium text-theme-main focus:outline-none focus:border-theme-primary"
            />
          </div>

          {/* Quick toggle: Solo Vinculados a OP */}
          <button
            type="button"
            onClick={() => setFilterLinkedOnly(!filterLinkedOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              filterLinkedOnly
                ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                : 'border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Solo con OP Activa</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-3">
          {/* Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-theme-muted mr-1">Tipo:</span>
            {['Todos', 'Formatos', 'WIs / Procedimientos', 'Planos', 'Planes de Control', 'PFMEA'].map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-theme-primary text-white shadow-xs'
                      : 'bg-theme-muted/10 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main border border-theme-subtle'
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-theme-muted mr-1">Estado:</span>
            {['Todos', 'Vigente', 'En revisión', 'Obsoleto'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-muted/10 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main border border-theme-subtle'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Master Table de Control Documental */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-theme-main">
              Catálogo Maestro de Información Documentada
            </h3>
            <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[10px] font-mono font-bold text-theme-main">
              {filteredDocuments.length} de {documents.length}
            </span>
          </div>

          <span className="text-[11px] text-theme-muted hidden sm:inline">
            Clic en cualquier documento para ver historial, actas de destrucción y audit trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
              <tr>
                <th className="p-3 text-left">Código & Tipo</th>
                <th className="p-3 text-left">Título & Norma ISO</th>
                <th className="p-3 text-left">Revisión Vigente</th>
                <th className="p-3 text-left">Propietario / Área</th>
                <th className="p-3 text-left">Artículos & OPs</th>
                <th className="p-3 text-center">Copias Físicas</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.code}
                  className="hover:bg-theme-muted/10 transition-colors group cursor-pointer"
                  onClick={() => setSelectedDocForDetail(doc)}
                >
                  {/* Código & Tipo */}
                  <td className="p-3 font-mono">
                    <b className="text-theme-main font-bold block text-xs">{doc.code}</b>
                    <span className="rounded bg-theme-muted/20 px-1.5 py-0.2 text-[9px] font-bold text-theme-muted">
                      {doc.type}
                    </span>
                  </td>

                  {/* Título & Norma */}
                  <td className="p-3 max-w-xs">
                    <strong className="text-theme-main font-bold block text-xs group-hover:text-theme-primary transition-colors">
                      {doc.title}
                    </strong>
                    {doc.isoStandard && (
                      <small className="text-theme-muted block font-mono text-[10px] mt-0.5">
                        {doc.isoStandard}
                      </small>
                    )}
                  </td>

                  {/* Revisión Vigente & Fecha */}
                  <td className="p-3 font-mono">
                    <span className="rounded-md bg-theme-primary/10 text-theme-primary px-2 py-0.5 font-bold text-[11px] inline-block">
                      {doc.revision}
                    </span>
                    <small className="text-theme-muted block mt-0.5 text-[10px]">
                      {doc.effectiveDate}
                    </small>
                  </td>

                  {/* Propietario / Área */}
                  <td className="p-3">
                    <span className="text-theme-main font-medium block">{doc.owner}</span>
                    <small className="text-theme-muted block text-[10px]">{doc.applicableArea}</small>
                  </td>

                  {/* Artículos & OPs Vinculadas */}
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {doc.linkedParts?.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSearchTerm(p)}
                          className="rounded bg-theme-muted/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-theme-main hover:bg-theme-primary/20 hover:text-theme-primary transition-colors cursor-pointer"
                          title="Filtrar por esta parte"
                        >
                          {p}
                        </button>
                      ))}
                      {doc.linkedOps?.map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setSearchTerm(op)}
                          className="rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 font-mono text-[9px] font-black hover:bg-blue-500/20 transition-colors cursor-pointer"
                          title="Filtrar por esta OP"
                        >
                          {op}
                        </button>
                      ))}
                      {(!doc.linkedParts || doc.linkedParts.length === 0) &&
                        (!doc.linkedOps || doc.linkedOps.length === 0) && (
                          <span className="text-theme-muted text-[10px] italic">General de planta</span>
                        )}
                    </div>
                  </td>

                  {/* Copias Físicas */}
                  <td className="p-3 text-center">
                    {doc.physicalCopiesCount && doc.physicalCopiesCount > 0 ? (
                      <span className="rounded-full bg-theme-muted/20 text-theme-main px-2 py-0.5 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {doc.physicalCopiesCount} en piso
                      </span>
                    ) : (
                      <span className="text-theme-muted text-[10px]">Solo digital</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="p-3">
                    {doc.status === 'Vigente' && (
                      <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-black inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Vigente
                      </span>
                    )}
                    {doc.status === 'En revisión' && (
                      <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 text-[9px] font-black inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        En revisión
                      </span>
                    )}
                    {doc.status === 'Obsoleto' && (
                      <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 text-[9px] font-black inline-flex items-center gap-1">
                        <Trash2 className="h-3 w-3" />
                        Obsoleto
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver Ficha */}
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        className="rounded-lg p-1.5 text-theme-muted hover:bg-theme-muted/30 hover:text-theme-main transition-colors cursor-pointer"
                        title="Ver ficha técnica y revisiones"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* + Nueva Rev */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocForNewRev(doc);
                          setShowNewRevWizard(true);
                        }}
                        className="rounded-lg p-1.5 text-theme-muted hover:bg-theme-primary/10 hover:text-theme-primary transition-colors cursor-pointer"
                        title="Crear nueva revisión"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      {/* Ver Acta de Destrucción si tiene evidencia */}
                      {doc.revisions.some((r) => r.destructionEvidence) && (
                        <button
                          type="button"
                          onClick={() => {
                            const rev = doc.revisions.find((r) => r.destructionEvidence);
                            if (rev) {
                              setSelectedDestructionModal({
                                doc,
                                rev,
                                evidence: rev.destructionEvidence!,
                              });
                            }
                          }}
                          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Ver acta de destrucción de versiones obsoletas"
                        >
                          <FileCheck2 className="h-4 w-4" />
                        </button>
                      )}

                      {/* Simular Bloqueo si tiene OPs o Rev F */}
                      {doc.linkedOps && doc.linkedOps.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocForBlockSimulation(doc);
                            setShowSimulateBlockModal(true);
                          }}
                          className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Simular bloqueo de revisión obsoleta en piso"
                        >
                          <ShieldAlert className="h-4 w-4" />
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

      {/* MODAL 1: Detalle por Documento */}
      {selectedDocForDetail && (
        <ControlledDocumentDetailModal
          document={selectedDocForDetail}
          allDocuments={documents}
          onClose={() => setSelectedDocForDetail(null)}
          onApproveRevision={handleApproveRevision}
          onSaveNewRevision={handleSaveNewRevision}
          onToast={onToast}
          activeRole={activeRole}
        />
      )}

      {/* MODAL 2: Nueva Revisión Wizard */}
      {showNewRevWizard && (
        <NuevaRevisionModal
          document={selectedDocForNewRev || documents[0]}
          allDocuments={documents}
          onClose={() => {
            setShowNewRevWizard(false);
            setSelectedDocForNewRev(null);
          }}
          onSave={handleSaveNewRevision}
          onToast={onToast}
        />
      )}

      {/* MODAL 3: Acta de Destrucción */}
      {selectedDestructionModal && (
        <ActaDestruccionModal
          document={selectedDestructionModal.doc}
          revision={selectedDestructionModal.rev}
          evidence={selectedDestructionModal.evidence}
          onClose={() => setSelectedDestructionModal(null)}
          onToast={onToast}
        />
      )}

      {/* MODAL 4: Simular Bloqueo Obsoleto */}
      {showSimulateBlockModal && (
        <SimularBloqueoObsoletoModal
          document={docForBlockSimulation}
          onClose={() => {
            setShowSimulateBlockModal(false);
            setDocForBlockSimulation(undefined);
          }}
          onToast={onToast}
        />
      )}
    </div>
  );
};
