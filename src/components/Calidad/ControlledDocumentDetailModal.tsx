import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  GitBranch,
  History,
  Layers,
  Lock,
  Plus,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  ControlledDocument,
  DocumentRevision,
  DocumentAuditTrailEntry,
  DocumentDestructionEvidence,
} from '../../data/mockCalidadData';
import { ActaDestruccionModal } from './ActaDestruccionModal';
import { SimularBloqueoObsoletoModal } from './SimularBloqueoObsoletoModal';
import { NuevaRevisionModal } from './NuevaRevisionModal';

interface Props {
  document: ControlledDocument;
  allDocuments: ControlledDocument[];
  onClose: () => void;
  onApproveRevision: (docCode: string, revisionId: string) => void;
  onSaveNewRevision: (
    docCode: string,
    newRevision: DocumentRevision,
    auditEntry: DocumentAuditTrailEntry,
    newPhysicalCount?: number,
    newLocations?: string[]
  ) => void;
  onToast: (msg: string) => void;
  activeRole: string;
}

export const ControlledDocumentDetailModal: React.FC<Props> = ({
  document: initialDoc,
  allDocuments,
  onClose,
  onApproveRevision,
  onSaveNewRevision,
  onToast,
  activeRole,
}) => {
  const [doc, setDoc] = useState<ControlledDocument>(initialDoc);
  const [activeTab, setActiveTab] = useState<'ficha' | 'revisiones' | 'audittrail'>('ficha');

  // Submodals
  const [selectedDestruction, setSelectedDestruction] = useState<{
    rev: DocumentRevision;
    evidence: DocumentDestructionEvidence;
  } | null>(null);
  const [showSimulateBlock, setShowSimulateBlock] = useState<boolean>(false);
  const [showNewRevisionWizard, setShowNewRevisionWizard] = useState<boolean>(false);

  // Sync if initialDoc changes
  React.useEffect(() => {
    const updated = allDocuments.find((d) => d.code === initialDoc.code);
    if (updated) {
      setDoc(updated);
    } else {
      setDoc(initialDoc);
    }
  }, [allDocuments, initialDoc]);

  const handleApprove = (revId: string) => {
    onApproveRevision(doc.code, revId);
    onToast(`✓ Revisión ${revId} de ${doc.code} aprobada formalmente. Puesta en vigor autorizada.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Vigente':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Vigente
          </span>
        );
      case 'En revisión':
        return (
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En revisión
          </span>
        );
      case 'Obsoleto':
      case 'Obsoleta':
        return (
          <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 text-[10px] font-black flex items-center gap-1">
            <Trash2 className="h-3 w-3" />
            Obsoleto
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-theme-muted/20 text-theme-muted px-2.5 py-0.5 text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-theme-subtle p-5 bg-theme-muted/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary border border-theme-primary/20 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-black text-sm text-theme-main">
                  {doc.code}
                </span>
                <span className="rounded-md bg-theme-muted/20 px-2 py-0.2 font-mono text-[10px] font-bold text-theme-muted">
                  {doc.type}
                </span>
                <span className="rounded-md bg-theme-primary/10 text-theme-primary px-2 py-0.2 font-mono text-[10px] font-black">
                  {doc.revision}
                </span>
                {getStatusBadge(doc.status)}
              </div>
              <h2 className="font-black text-base text-theme-main mt-0.5">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSimulateBlock(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 shadow-2xs cursor-pointer transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Simular Bloqueo Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNewRevisionWizard(true)}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nueva Revisión</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme-subtle bg-theme-surface px-5 pt-2 gap-2">
          {[
            { id: 'ficha' as const, label: 'Ficha Técnica & Enlaces', icon: FileCheck2 },
            { id: 'revisiones' as const, label: `Historial de Revisiones (${doc.revisions.length})`, icon: GitBranch },
            { id: 'audittrail' as const, label: `Audit Trail & Firmas (${doc.auditTrail.length})`, icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-theme-primary text-theme-primary'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* TAB 1: FICHA TÉCNICA */}
          {activeTab === 'ficha' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Description & Standard */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                  Descripción Operativa del Documento:
                </span>
                <p className="text-xs text-theme-main leading-relaxed">
                  {doc.description || 'Documento controlado bajo el Sistema de Gestión de la Calidad de RTM.'}
                </p>
                {doc.isoStandard && (
                  <div className="pt-2 border-t border-theme-subtle flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-theme-primary shrink-0" />
                    <span className="text-[11px] font-bold text-theme-main">
                      Norma de Referencia: <span className="font-mono text-theme-primary">{doc.isoStandard}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Revisión Vigente:</span>
                  <b className="font-mono text-base font-black text-theme-main mt-0.5 block">{doc.revision}</b>
                  <small className="text-[10px] text-theme-muted">Desde: {doc.effectiveDate}</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Propietario / Emisor:</span>
                  <b className="text-xs font-bold text-theme-main mt-0.5 block truncate">{doc.owner}</b>
                  <small className="text-[10px] text-theme-muted">Área: {doc.applicableArea}</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Copias en Piso:</span>
                  <b className="font-mono text-base font-black text-theme-primary mt-0.5 block">
                    {doc.physicalCopiesCount || 0} copias
                  </b>
                  <small className="text-[10px] text-theme-muted">Selladas y controladas</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Estado General:</span>
                  <div className="mt-1.5">{getStatusBadge(doc.status)}</div>
                  {doc.pendingApprover && (
                    <small className="text-[9px] text-amber-600 block mt-1">Pendiente: {doc.pendingApprover}</small>
                  )}
                </div>
              </div>

              {/* Physical Copies Distribution */}
              {doc.physicalLocations && doc.physicalLocations.length > 0 && (
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-theme-main text-xs font-bold flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-theme-primary" />
                    Ubicaciones Físicas Controladas en Planta ({doc.physicalCopiesCount} ejemplares):
                  </b>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {doc.physicalLocations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl border border-theme-subtle bg-theme-muted/10 px-3 py-1.5 font-bold text-xs text-theme-main flex items-center gap-1.5"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Integration with Artículos & Producción */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Artículos Vinculados */}
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-theme-main text-xs font-bold flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-theme-primary" />
                    Artículos Vinculados:
                  </b>
                  {doc.linkedParts && doc.linkedParts.length > 0 ? (
                    <div className="space-y-1.5">
                      {doc.linkedParts.map((part) => (
                        <div
                          key={part}
                          className="flex items-center justify-between rounded-xl bg-theme-muted/10 p-2 border border-theme-subtle"
                        >
                          <span className="font-mono font-bold text-xs text-theme-main">{part}</span>
                          <span className="text-[9px] font-bold text-theme-primary">Catálogo</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-theme-muted">Documento de uso general de planta.</p>
                  )}
                </div>

                {/* OPs Activas Vinculadas */}
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-theme-main text-xs font-bold flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-500" />
                    Órdenes de Producción (OPs):
                  </b>
                  {doc.linkedOps && doc.linkedOps.length > 0 ? (
                    <div className="space-y-1.5">
                      {doc.linkedOps.map((op) => (
                        <div
                          key={op}
                          className="flex items-center justify-between rounded-xl bg-theme-muted/10 p-2 border border-theme-subtle"
                        >
                          <span className="font-mono font-black text-xs text-theme-main">{op}</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                            En Proceso
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-theme-muted">Sin OP activa en este instante.</p>
                  )}
                </div>

                {/* Clientes Vinculados */}
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-theme-main text-xs font-bold flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-purple-500" />
                    Clientes Asociados:
                  </b>
                  {doc.linkedClients && doc.linkedClients.length > 0 ? (
                    <div className="space-y-1.5">
                      {doc.linkedClients.map((client) => (
                        <div
                          key={client}
                          className="rounded-xl bg-theme-muted/10 p-2 border border-theme-subtle"
                        >
                          <span className="font-bold text-xs text-theme-main block">{client}</span>
                          <span className="text-[9px] text-theme-muted">Especificación aprobada</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-theme-muted">Estándar transversal interno.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORIAL DE REVISIONES */}
          {activeTab === 'revisiones' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 flex items-center justify-between">
                <div>
                  <b className="text-theme-main text-xs font-bold block">
                    Gobernanza de Revisiones SGC
                  </b>
                  <p className="text-theme-muted text-[11px]">
                    Control estricto de vigencia. Cualquier revisión obsoleta cuenta con trazabilidad de retiro y acta de destrucción.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewRevisionWizard(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Nueva Revisión</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-theme-subtle">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                    <tr>
                      <th className="p-3">Revisión</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Fecha Efectiva</th>
                      <th className="p-3">Elaboró / Aprobó</th>
                      <th className="p-3">Motivo / Descripción de Cambio</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle bg-theme-surface">
                    {doc.revisions.map((rev) => (
                      <tr key={rev.revision} className="hover:bg-theme-muted/10 transition-colors">
                        <td className="p-3 font-mono font-black text-xs text-theme-main">
                          {rev.revision}
                        </td>
                        <td className="p-3">{getStatusBadge(rev.status)}</td>
                        <td className="p-3 font-mono text-theme-muted">{rev.effectiveDate}</td>
                        <td className="p-3">
                          <b className="text-theme-main block">{rev.releasedBy}</b>
                          <small className="text-theme-muted block mt-0.5">
                            Aprobó: {rev.approvedBy}
                          </small>
                        </td>
                        <td className="p-3 max-w-xs">
                          <p className="text-[11px] text-theme-main leading-relaxed">
                            {rev.changeDescription}
                          </p>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Action if Pending Approval */}
                            {rev.status === 'En revisión' && (
                              <button
                                type="button"
                                onClick={() => handleApprove(rev.revision)}
                                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Aprobar y Poner en Vigor</span>
                              </button>
                            )}

                            {/* Action if Obsolete with destruction evidence */}
                            {rev.destructionEvidence && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDestruction({
                                    rev,
                                    evidence: rev.destructionEvidence!,
                                  })
                                }
                                className="flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 cursor-pointer shadow-2xs"
                              >
                                <FileCheck2 className="h-3.5 w-3.5" />
                                <span>Ver Acta Destrucción</span>
                              </button>
                            )}

                            {/* Standard download */}
                            <button
                              type="button"
                              onClick={() =>
                                onToast(`✓ Descargando archivo técnico de ${doc.code} (${rev.revision})...`)
                              }
                              className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted/20 transition-colors"
                              title="Descargar documento"
                            >
                              <ExternalLink className="h-4 w-4" />
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

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audittrail' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 flex items-center justify-between">
                <div>
                  <b className="text-theme-main text-xs font-bold block">
                    Trazabilidad de No Repudio (Audit Trail SGC)
                  </b>
                  <p className="text-theme-muted text-[11px]">
                    Registro inmutable de creación, revisiones, aprobaciones de Calidad y destrucción física en piso.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Lock className="h-3 w-3" />
                  <span>Cifrado SHA-256</span>
                </div>
              </div>

              {doc.auditTrail.length > 0 ? (
                <div className="space-y-2.5">
                  {doc.auditTrail.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-2 rounded-xl border shrink-0 ${
                            entry.action === 'Acta de Destrucción'
                              ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              : entry.action === 'Puesta en Vigor' || entry.action === 'Aprobación'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          }`}
                        >
                          {entry.action === 'Acta de Destrucción' ? (
                            <Trash2 className="h-4 w-4" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-xs text-theme-main">{entry.action}</b>
                            <span className="font-mono text-[10px] rounded bg-theme-muted/20 px-1.5 py-0.2 font-bold text-theme-muted">
                              {entry.revision}
                            </span>
                          </div>
                          <p className="text-xs text-theme-muted mt-0.5">{entry.notes}</p>
                          <small className="text-[10px] text-theme-muted block mt-1">
                            Ejecutado por: <b className="text-theme-main">{entry.user}</b> ({entry.role})
                          </small>
                        </div>
                      </div>

                      <div className="text-right sm:shrink-0 font-mono text-[10px] text-theme-muted">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {entry.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <p className="text-theme-muted text-xs">Sin registros de auditoría adicionales.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
          <div className="flex items-center gap-2 text-theme-muted text-[11px]">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Control documental auditado conforme a ISO 9001:2015 § 7.5.3</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onToast(`✓ Exportando ficha técnica completa de ${doc.code} en PDF...`)
              }
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Ficha</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Submodal: Acta de Destrucción */}
      {selectedDestruction && (
        <ActaDestruccionModal
          document={doc}
          revision={selectedDestruction.rev}
          evidence={selectedDestruction.evidence}
          onClose={() => setSelectedDestruction(null)}
          onToast={onToast}
        />
      )}

      {/* Submodal: Simular Bloqueo */}
      {showSimulateBlock && (
        <SimularBloqueoObsoletoModal
          document={doc}
          onClose={() => setShowSimulateBlock(false)}
          onToast={onToast}
        />
      )}

      {/* Submodal: Nueva Revisión Wizard */}
      {showNewRevisionWizard && (
        <NuevaRevisionModal
          document={doc}
          allDocuments={allDocuments}
          onClose={() => setShowNewRevisionWizard(false)}
          onSave={onSaveNewRevision}
          onToast={onToast}
        />
      )}
    </div>
  );
};
