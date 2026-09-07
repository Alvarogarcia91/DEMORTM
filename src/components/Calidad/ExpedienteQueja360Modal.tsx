import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSearch,
  FileText,
  History,
  Layers,
  Lock,
  MessageSquare,
  Plus,
  Printer,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  UserCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import {
  CustomerComplaint,
  ComplaintQaEvaluation,
  ComplaintRmaDetails,
  ComplaintEvidence,
} from '../../data/mockCustomerQualityData';

interface Props {
  complaint: CustomerComplaint;
  onClose: () => void;
  onUpdateComplaint: (updated: CustomerComplaint) => void;
  onToast: (msg: string) => void;
  activeRole: string;
}

export const ExpedienteQueja360Modal: React.FC<Props> = ({
  complaint: initialComplaint,
  onClose,
  onUpdateComplaint,
  onToast,
  activeRole,
}) => {
  const [complaint, setComplaint] = useState<CustomerComplaint>(initialComplaint);
  const [activeTab, setActiveTab] = useState<
    'resumen' | 'trazabilidad' | 'evaluacion' | 'rma' | 'acciones' | 'evidencias' | 'historial'
  >('resumen');

  // Evaluation Form State
  const [evalDecision, setEvalDecision] = useState<'Procedente' | 'No Procedente'>(
    complaint.qaEvaluation?.decision === 'No Procedente' ? 'No Procedente' : 'Procedente'
  );
  const [evalDiagnosis, setEvalDiagnosis] = useState(
    complaint.qaEvaluation?.technicalDiagnosis ||
      'Evaluación técnica de muestras realizada en laboratorio QA.'
  );
  const [eval4M, setEval4M] = useState<'Mano de obra' | 'Maquinaria' | 'Material' | 'Método'>(
    complaint.qaEvaluation?.fourMCause || 'Material'
  );
  const [evalRejectionReason, setEvalRejectionReason] = useState(
    complaint.qaEvaluation?.rejectionReason || ''
  );

  // RMA Reinspection State
  const [reinspectionResult, setReinspectionResult] = useState<
    'Defecto Confirmado - Scrap Técnico' | 'Reparable en Acabados' | 'Conforme - Reingreso a Inventario'
  >(complaint.rmaDetails?.reinspectionResult || 'Defecto Confirmado - Scrap Técnico');
  const [reinspectionNotes, setReinspectionNotes] = useState(
    complaint.rmaDetails?.reinspectionNotes || 'Inspección de 100% de cajas recibidas en cuarentena.'
  );

  // New Evidence State
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceNotes, setNewEvidenceNotes] = useState('');
  const [showAddEvidenceForm, setShowAddEvidenceForm] = useState(false);

  // Resolution Warning Modal
  const [showCloseWarning, setShowCloseWarning] = useState<string | null>(null);

  // Handlers
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDACIÓN OBLIGATORIA P0: Rechazo exige motivo
    if (evalDecision === 'No Procedente' && !evalRejectionReason.trim()) {
      onToast('⚠️ ERROR: Si la queja se dictamina como No Procedente, es OBLIGATORIO ingresar el motivo técnico de rechazo.');
      return;
    }

    const newEvaluation: ComplaintQaEvaluation = {
      evaluatedBy: activeRole,
      evaluationDate: '07 Sep 2026',
      decision: evalDecision,
      technicalDiagnosis: evalDiagnosis,
      fourMCause: eval4M,
      rejectionReason: evalDecision === 'No Procedente' ? evalRejectionReason : undefined,
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: activeRole,
      role: 'Aseguramiento de Calidad',
      action: 'Dictamen de Evaluación QA',
      notes: `Dictamen emitido: ${evalDecision}. Causa 4M: ${eval4M}. ${
        evalDecision === 'No Procedente' ? `Motivo de rechazo: ${evalRejectionReason}` : ''
      }`,
    };

    const updated: CustomerComplaint = {
      ...complaint,
      status: evalDecision === 'No Procedente' ? 'Rechazada' : complaint.rmaNumber ? 'RMA Aprobado' : 'En evaluación QA',
      qaEvaluation: newEvaluation,
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ Dictamen técnico guardado: ${evalDecision}.`);
  };

  const handleRegisterRmaReceipt = () => {
    if (!complaint.rmaDetails) return;

    const updatedRma: ComplaintRmaDetails = {
      ...complaint.rmaDetails,
      receivedAtWarehouse: true,
      receivedDate: '07 Sep 2026 · 14:00',
      physicalQuantityReceived: complaint.claimedQuantity,
      quarantineLocation: 'Almacén Cuarentena / Bahía QA-01',
      resolutionStatus: 'En Reinspección Cuarentena',
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · 14:00',
      user: activeRole,
      role: 'Logística / Calidad',
      action: 'Recepción Física de RMA',
      notes: `Recepción confirmada de ${complaint.claimedQuantity} piezas en Almacén de Cuarentena.`,
    };

    const updated: CustomerComplaint = {
      ...complaint,
      status: 'En Reinspección',
      rmaDetails: updatedRma,
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ Retorno físico recibido en Almacén de Cuarentena (${complaint.claimedQuantity} pzas).`);
  };

  const handleSaveReinspection = () => {
    if (!complaint.rmaDetails) return;

    const updatedRma: ComplaintRmaDetails = {
      ...complaint.rmaDetails,
      reinspectionResult,
      reinspectionNotes,
      resolutionStatus:
        reinspectionResult === 'Reparable en Acabados'
          ? 'En Reparación'
          : 'Reemplazo Liberado',
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · 14:30',
      user: activeRole,
      role: 'Aseguramiento de Calidad',
      action: 'Dictamen de Reinspección',
      notes: `Resultado: ${reinspectionResult}. ${reinspectionNotes}`,
    };

    const updated: CustomerComplaint = {
      ...complaint,
      status: reinspectionResult === 'Reparable en Acabados' ? 'En Reinspección' : 'Reemplazo Emitido',
      rmaDetails: updatedRma,
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ Dictamen de reinspección registrado: ${reinspectionResult}.`);
  };

  const handleGenerateReplacementOp = () => {
    if (!complaint.rmaDetails) return;

    const replacementOp = `OP-2026-952${Math.floor(60 + Math.random() * 20)}`;

    const updatedRma: ComplaintRmaDetails = {
      ...complaint.rmaDetails,
      replacementOpFolio: replacementOp,
      resolutionStatus: 'Reemplazo Liberado',
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · 15:00',
      user: activeRole,
      role: 'Planeación / Calidad',
      action: 'Generación OP de Reemplazo',
      notes: `Orden de reposición urgente generada: ${replacementOp} por ${complaint.claimedQuantity} piezas.`,
    };

    const updated: CustomerComplaint = {
      ...complaint,
      status: 'Reemplazo Emitido',
      rmaDetails: updatedRma,
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ OP de Reemplazo Urgente ${replacementOp} generada en el sistema.`);
  };

  const handleLinkIcar = () => {
    const newIcarId = `ICAR-2026-0${Math.floor(25 + Math.random() * 50)}`;

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: activeRole,
      role: 'Calidad SGC',
      action: 'Apertura de ICAR',
      notes: `Acción correctiva formal aperturada en SGC: ${newIcarId}.`,
    };

    const updated: CustomerComplaint = {
      ...complaint,
      linkedIcarId: newIcarId,
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ Acción Correctiva ${newIcarId} vinculada exitosamente con el expediente.`);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle.trim()) return;

    const newEvidence: ComplaintEvidence = {
      id: `ev-${Date.now()}`,
      title: newEvidenceTitle,
      fileType: 'IMG',
      uploadDate: '07 Sep 2026',
      uploader: activeRole,
      notes: newEvidenceNotes || 'Evidencia técnica incorporada al expediente.',
    };

    const updated: CustomerComplaint = {
      ...complaint,
      evidences: [...complaint.evidences, newEvidence],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    setNewEvidenceTitle('');
    setNewEvidenceNotes('');
    setShowAddEvidenceForm(false);
    onToast('✓ Evidencia adjuntada al expediente 360.');
  };

  // VALIDACIÓN OBLIGATORIA P0: No cerrar sin resolución
  const handleAttemptClose = () => {
    // 1. Debe existir evaluación QA
    if (!complaint.qaEvaluation) {
      setShowCloseWarning(
        'La queja aún no cuenta con Dictamen Técnico de Calidad. Es obligatorio realizar la evaluación QA antes del cierre.'
      );
      return;
    }

    // 2. Si fue procedente y tiene RMA, debe tener resolución final
    if (complaint.qaEvaluation.decision === 'Procedente' && complaint.rmaDetails) {
      if (
        complaint.rmaDetails.resolutionStatus === 'Pendiente Retorno' ||
        complaint.rmaDetails.resolutionStatus === 'En Reinspección Cuarentena'
      ) {
        setShowCloseWarning(
          `El RMA ${complaint.rmaDetails.rmaNumber} aún se encuentra en estado '${complaint.rmaDetails.resolutionStatus}'. Debe completarse la reinspección y el reemplazo/disposición antes de cerrar el caso.`
        );
        return;
      }
    }

    // Si cumple todas las condiciones de resolución:
    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: activeRole,
      role: 'Aseguramiento de Calidad',
      action: 'Cierre Definitivo de Queja',
      notes: 'Caso resuelto satisfactoriamente conforme a procedimientos SGC ISO 9001.',
    };

    const updated: CustomerComplaint = {
      ...complaint,
      status: 'Cerrada',
      closedDate: '07 Sep 2026',
      closedBy: activeRole,
      resolutionNotes:
        complaint.resolutionNotes ||
        'Caso cerrado con satisfacción de cliente y plan correctivo implementado.',
      auditTrail: [newAudit, ...complaint.auditTrail],
    };

    setComplaint(updated);
    onUpdateComplaint(updated);
    onToast(`✓ Queja ${complaint.id} cerrada formalmente.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Abierta':
        return (
          <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-bold">
            Abierta
          </span>
        );
      case 'En evaluación QA':
        return (
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
            En evaluación QA
          </span>
        );
      case 'RMA Aprobado':
        return (
          <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-black">
            RMA Aprobado
          </span>
        );
      case 'En Reinspección':
        return (
          <span className="rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-0.5 text-[10px] font-bold">
            En Reinspección
          </span>
        );
      case 'Reemplazo Emitido':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
            Reemplazo Emitido
          </span>
        );
      case 'Rechazada':
        return (
          <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 text-[10px] font-black">
            Rechazada
          </span>
        );
      case 'Cerrada':
        return (
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black">
            Cerrada
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
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-theme-subtle p-5 bg-theme-muted/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-black text-sm text-theme-main">
                  {complaint.id}
                </span>
                {complaint.rmaNumber && (
                  <span className="rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.2 font-mono text-[10px] font-black border border-purple-500/20">
                    {complaint.rmaNumber}
                  </span>
                )}
                <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[10px] font-bold text-theme-muted">
                  {complaint.client}
                </span>
                {getStatusBadge(complaint.status)}
              </div>
              <h2 className="font-black text-base text-theme-main mt-0.5">
                {complaint.partDescription} ({complaint.partNumber})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {complaint.status !== 'Cerrada' && (
              <button
                type="button"
                onClick={handleAttemptClose}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Cerrar Caso</span>
              </button>
            )}
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
        <div className="flex border-b border-theme-subtle bg-theme-surface px-5 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'resumen' as const, label: 'Resumen 360', icon: FileText },
            { id: 'trazabilidad' as const, label: 'Trazabilidad', icon: Layers },
            { id: 'evaluacion' as const, label: 'Evaluación QA & 4M', icon: ShieldCheck },
            { id: 'rma' as const, label: `Flujo RMA ${complaint.rmaNumber ? `(${complaint.rmaNumber})` : ''}`, icon: RotateCcw },
            { id: 'acciones' as const, label: 'ICAR & MNC', icon: Award },
            { id: 'evidencias' as const, label: `Evidencias (${complaint.evidences.length})`, icon: FileSearch },
            { id: 'historial' as const, label: `Audit Trail (${complaint.auditTrail.length})`, icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
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

        {/* Tab Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* TAB 1: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Defect Highlight Banner */}
              <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Defecto Reportado por el Cliente:
                  </span>
                  <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 text-[9px] font-black">
                    Severidad: {complaint.severity}
                  </span>
                </div>
                <p className="text-xs font-semibold text-rose-950 dark:text-rose-100 leading-relaxed">
                  {complaint.defectType}
                </p>
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Cliente:</span>
                  <b className="text-xs font-bold text-theme-main mt-0.5 block truncate">{complaint.client}</b>
                  <small className="text-[10px] text-theme-muted">{complaint.clientContact}</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Cantidad Reclamada:</span>
                  <b className="font-mono text-base font-black text-theme-main mt-0.5 block">
                    {complaint.claimedQuantity.toLocaleString()} pzas
                  </b>
                  <small className="text-[10px] text-theme-muted">Unidades afectadas</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Impacto Reclamado:</span>
                  <b className="font-mono text-base font-black text-rose-600 mt-0.5 block">
                    ${complaint.claimedValue.toLocaleString()} MXN
                  </b>
                  <small className="text-[10px] text-theme-muted">Costo estimado no calidad</small>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Estatus Actual:</span>
                  <div className="mt-1.5">{getStatusBadge(complaint.status)}</div>
                  <small className="text-[10px] text-theme-muted block mt-1">Fecha: {complaint.date}</small>
                </div>
              </div>

              {/* Status & Resolution Summary */}
              {complaint.resolutionNotes && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                  <b className="text-emerald-800 dark:text-emerald-300 text-xs font-bold block flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Resolución y Disposición Final:
                  </b>
                  <p className="text-xs text-theme-main">{complaint.resolutionNotes}</p>
                  {complaint.closedDate && (
                    <small className="text-[10px] text-emerald-700 block mt-1">
                      Cerrado el: {complaint.closedDate} por {complaint.closedBy}
                    </small>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRAZABILIDAD 360 */}
          {activeTab === 'trazabilidad' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5">
                <b className="text-theme-main text-xs font-bold block">
                  Trazabilidad Completa (Producción &rarr; Calidad &rarr; Embarque)
                </b>
                <p className="text-theme-muted text-[11px]">
                  Datos canónicos extraídos directamente de la orden y el embarque para identificar la corrida de producción exacta sin duplicar tablas.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Orden de Producción:</span>
                  <b className="font-mono text-xs text-theme-main block">{complaint.traceability.opFolio}</b>
                  <span className="text-[9px] text-theme-primary font-bold">Producción RTM</span>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Lote de PT:</span>
                  <b className="font-mono text-xs text-theme-main block">{complaint.traceability.lotNumber}</b>
                  <span className="text-[9px] text-theme-muted">Inspección final conforme</span>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Folio de Embarque:</span>
                  <b className="font-mono text-xs text-theme-main block">{complaint.traceability.shipmentFolio}</b>
                  <span className="text-[9px] text-theme-muted">Salida andén PT</span>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Factura Comercial:</span>
                  <b className="font-mono text-xs text-theme-main block">{complaint.traceability.invoiceNumber}</b>
                  <span className="text-[9px] text-theme-muted">Módulo Facturación</span>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Línea / Máquina:</span>
                  <b className="text-xs font-bold text-theme-main block">{complaint.traceability.productionLine}</b>
                  <span className="text-[9px] text-theme-muted">Piso de impresión</span>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 shadow-2xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Operador Responsable:</span>
                  <b className="text-xs font-bold text-theme-main block">{complaint.traceability.operator}</b>
                  <span className="text-[9px] text-theme-muted">Turno A</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVALUACIÓN QA & 4M */}
          {activeTab === 'evaluacion' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Form de Evaluación Técnica */}
              <form onSubmit={handleSaveEvaluation} className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                  <div>
                    <b className="text-theme-main text-xs font-bold block">
                      Dictamen Técnico de Calidad (Alicia Ramírez)
                    </b>
                    <p className="text-theme-muted text-[11px]">
                      Dictamina si el reclamo es procedente y clasifica la causa raíz según la metodología 4M.
                    </p>
                  </div>
                  <span className="rounded-full bg-theme-muted/20 px-2 py-0.5 font-mono text-[9px] font-bold text-theme-muted">
                    IATF 16949 § 10.2
                  </span>
                </div>

                {/* Decisión: Procedente vs No Procedente */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-theme-muted block">
                    Dictamen de Calidad:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEvalDecision('Procedente')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        evalDecision === 'Procedente'
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-theme-subtle bg-theme-muted/10'
                      }`}
                    >
                      <b className="text-xs font-bold text-emerald-600 block mb-0.5">
                        ✓ Procedente (Reclamo Válido)
                      </b>
                      <p className="text-[10px] text-theme-muted">
                        Se confirma defecto imputable al proceso o materiales de RTM. Se autoriza RMA / reemplazo.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEvalDecision('No Procedente')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        evalDecision === 'No Procedente'
                          ? 'border-rose-500/50 bg-rose-500/10'
                          : 'border-theme-subtle bg-theme-muted/10'
                      }`}
                    >
                      <b className="text-xs font-bold text-rose-600 block mb-0.5">
                        ✕ No Procedente (Rechazo Técnico)
                      </b>
                      <p className="text-[10px] text-theme-muted">
                        El producto cumple con especificaciones contractuales. Requiere justificación obligatoria.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Causa 4M */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Causa Raíz Principal (Metodología 4M):
                  </label>
                  <select
                    value={eval4M}
                    onChange={(e) => setEval4M(e.target.value as any)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                  >
                    <option value="Material">Material (Materia prima, sustrato o tinta fuera de especificación)</option>
                    <option value="Maquinaria">Maquinaria (Desajuste, desgaste mecánico de suaje o rodillo)</option>
                    <option value="Mano de obra">Mano de obra (Omisión de inspección, ajuste incorrecto en arranque)</option>
                    <option value="Método">Método (Procedimiento, arte o archivo obsoleto sin validación)</option>
                  </select>
                </div>

                {/* Diagnóstico Técnico */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Diagnóstico Técnico Detallado:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={evalDiagnosis}
                    onChange={(e) => setEvalDiagnosis(e.target.value)}
                    placeholder="Resultados de pruebas de laboratorio, frotado, densitometría, medición de delta E..."
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>

                {/* CAMPO OBLIGATORIO SI NO PROCEDENTE: RECHAZO EXIGE MOTIVO */}
                {evalDecision === 'No Procedente' && (
                  <div className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 p-4 space-y-2 animate-in fade-in">
                    <label className="text-xs font-black uppercase text-rose-700 dark:text-rose-300 block flex items-center gap-1.5">
                      <AlertOctagon className="h-4 w-4" />
                      Motivo Técnico Obligatorio de Rechazo (Justificación al Cliente):
                    </label>
                    <p className="text-[11px] text-rose-950 dark:text-rose-100">
                      Indica las mediciones de laboratorio o cláusulas de especificación que sustentan que el lote está conforme. No se permitirá guardar sin este campo.
                    </p>
                    <textarea
                      rows={2}
                      required
                      value={evalRejectionReason}
                      onChange={(e) => setEvalRejectionReason(e.target.value)}
                      placeholder="Ej. Medición con espectrofotómetro X-Rite arrojó ΔE = 1.08 dentro de tolerancia contractual de 2.0..."
                      className="w-full rounded-xl border border-rose-500/30 bg-theme-surface p-3 text-xs text-theme-main focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Guardar Dictamen Técnico QA</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: FLUJO RMA */}
          {activeTab === 'rma' && (
            <div className="space-y-4 animate-in fade-in">
              {complaint.rmaDetails ? (
                <div className="space-y-4">
                  {/* RMA Stepper Header */}
                  <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-purple-600">
                          {complaint.rmaDetails.rmaNumber}
                        </span>
                        <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.2 text-[9px] font-bold">
                          {complaint.rmaDetails.rmaType}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-theme-main">
                        Estatus: {complaint.rmaDetails.resolutionStatus}
                      </span>
                    </div>

                    {/* Stepper Steps */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-theme-subtle text-center">
                      {[
                        { step: '1. Retorno', active: true, done: complaint.rmaDetails.receivedAtWarehouse },
                        { step: '2. Reinspección', active: complaint.rmaDetails.receivedAtWarehouse, done: !!complaint.rmaDetails.reinspectionResult },
                        { step: '3. Reparación', active: complaint.rmaDetails.reinspectionResult === 'Reparable en Acabados', done: false },
                        { step: '4. Reemplazo', active: true, done: !!complaint.rmaDetails.replacementOpFolio },
                      ].map((s, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border text-[11px] font-bold ${
                            s.done
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                              : s.active
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300'
                              : 'bg-theme-surface border-theme-subtle text-theme-muted opacity-60'
                          }`}
                        >
                          {s.done ? `✓ ${s.step}` : s.step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FASE 1: Retorno Físico */}
                  <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <b className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-theme-primary" />
                        Fase 1: Retorno y Recepción en Cuarentena
                      </b>
                      {complaint.rmaDetails.receivedAtWarehouse ? (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                          Recibido en Almacén
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.2 text-[9px] font-bold">
                          En Tránsito
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-theme-muted block">Transportista:</span>
                        <b className="text-theme-main">{complaint.rmaDetails.carrierName || 'Castores'}</b>
                      </div>
                      <div>
                        <span className="text-theme-muted block">Guía de Rastreo:</span>
                        <b className="font-mono text-theme-main">{complaint.rmaDetails.trackingGuide || 'S/N'}</b>
                      </div>
                      <div>
                        <span className="text-theme-muted block">Ubicación Cuarentena:</span>
                        <b className="text-theme-main">{complaint.rmaDetails.quarantineLocation || 'Rampa QA'}</b>
                      </div>
                    </div>

                    {!complaint.rmaDetails.receivedAtWarehouse && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleRegisterRmaReceipt}
                          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md cursor-pointer"
                        >
                          <Box className="h-4 w-4" />
                          <span>Confirmar Recepción de Retorno Físico en Cuarentena</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* FASE 2: Reinspección Técnica */}
                  {complaint.rmaDetails.receivedAtWarehouse && (
                    <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                      <b className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                        <FileSearch className="h-4 w-4 text-theme-primary" />
                        Fase 2: Dictamen de Reinspección en Planta
                      </b>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                            Resultado de Reinspección:
                          </label>
                          <select
                            value={reinspectionResult}
                            onChange={(e) => setReinspectionResult(e.target.value as any)}
                            className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                          >
                            <option value="Defecto Confirmado - Scrap Técnico">
                              Defecto Confirmado - Scrap Técnico (Triturar lote)
                            </option>
                            <option value="Reparable en Acabados">
                              Reparable en Acabados (Reacondicionar / Rebobinar)
                            </option>
                            <option value="Conforme - Reingreso a Inventario">
                              Conforme - Reingreso a Inventario (Falso positivo)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                            Notas de la Inspección de Muestras:
                          </label>
                          <input
                            type="text"
                            value={reinspectionNotes}
                            onChange={(e) => setReinspectionNotes(e.target.value)}
                            className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveReinspection}
                        className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-theme-primary" />
                        <span>Actualizar Dictamen de Reinspección</span>
                      </button>
                    </div>
                  )}

                  {/* FASE 4: Reemplazo / Reposición */}
                  <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <b className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-emerald-600" />
                        Fase 4: Reposición / OP de Reemplazo
                      </b>
                      {complaint.rmaDetails.replacementOpFolio ? (
                        <span className="font-mono font-bold text-xs text-emerald-600">
                          {complaint.rmaDetails.replacementOpFolio}
                        </span>
                      ) : (
                        <span className="text-theme-muted text-[10px]">Sin reposición emitida</span>
                      )}
                    </div>

                    {complaint.rmaDetails.replacementOpFolio ? (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-between">
                        <div>
                          <b className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
                            {complaint.rmaDetails.replacementOpFolio} (Producción Urgente)
                          </b>
                          <p className="text-[10px] text-theme-muted mt-0.5">
                            Reposición programada con prioridad ALTA en Flexografía para cumplir con el cliente.
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[9px] font-bold">
                          En Proceso
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGenerateReplacementOp}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Generar OP de Reemplazo Urgente ({complaint.claimedQuantity} pzas)</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 rounded-2xl border border-theme-subtle bg-theme-surface space-y-2">
                  <p className="text-theme-muted text-xs">Esta queja no tiene solicitud de retorno RMA asociada.</p>
                  <button
                    type="button"
                    onClick={() => {
                      const newRmaNum = `RMA-2026-0${Math.floor(25 + Math.random() * 50)}`;
                      const updated: CustomerComplaint = {
                        ...complaint,
                        rmaNumber: newRmaNum,
                        rmaDetails: {
                          rmaNumber: newRmaNum,
                          rmaType: 'Retorno y Reemplazo',
                          approvalDate: '07 Sep 2026',
                          approvedBy: activeRole,
                          receivedAtWarehouse: false,
                          resolutionStatus: 'Pendiente Retorno',
                        },
                      };
                      setComplaint(updated);
                      onUpdateComplaint(updated);
                      onToast(`✓ Solicitud de ${newRmaNum} activada.`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
                  >
                    Activar Flujo de RMA para este Caso
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCIONES CORRECTIVAS (ICAR & MNC) */}
          {activeTab === 'acciones' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* MNC Vinculado */}
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-rose-500" />
                    Material No Conforme (MNC):
                  </b>
                  {complaint.linkedMncId ? (
                    <div className="rounded-xl border border-theme-subtle bg-theme-muted/10 p-3 space-y-1">
                      <b className="font-mono text-xs text-rose-600 block">{complaint.linkedMncId}</b>
                      <p className="text-[10px] text-theme-muted">
                        Etiquetado en cuarentena física con bloqueo en inventario.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-theme-muted">Sin folio MNC directo asignado.</p>
                  )}
                </div>

                {/* ICAR Acción Correctiva */}
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <b className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-theme-primary" />
                    Acción Correctiva SGC (ICAR):
                  </b>
                  {complaint.linkedIcarId ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1">
                      <b className="font-mono text-xs text-emerald-600 block">{complaint.linkedIcarId}</b>
                      <p className="text-[10px] text-theme-muted">
                        Registrado en el plan de acciones correctivas de la revisión gerencial SGC.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-theme-muted">No se ha abierto un ICAR para esta queja.</p>
                      <button
                        type="button"
                        onClick={handleLinkIcar}
                        className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Abrir Acción Correctiva ICAR</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EVIDENCIAS */}
          {activeTab === 'evidencias' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <b className="text-theme-main text-xs font-bold">
                  Archivos y Reportes Fotográficos Adjuntos
                </b>
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceForm(!showAddEvidenceForm)}
                  className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5 text-theme-primary" />
                  <span>Adjuntar Evidencia</span>
                </button>
              </div>

              {/* Form to add evidence */}
              {showAddEvidenceForm && (
                <form onSubmit={handleAddEvidence} className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase text-theme-muted block">
                    Nueva Evidencia Técnica:
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Título del documento / foto (ej. Foto de código en microscopio)..."
                    value={newEvidenceTitle}
                    onChange={(e) => setNewEvidenceTitle(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                  <input
                    type="text"
                    placeholder="Observaciones de laboratorio..."
                    value={newEvidenceNotes}
                    onChange={(e) => setNewEvidenceNotes(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvidenceForm(false)}
                      className="px-3 py-1.5 rounded-xl border border-theme-subtle text-xs text-theme-muted cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold cursor-pointer"
                    >
                      Guardar Archivo
                    </button>
                  </div>
                </form>
              )}

              {complaint.evidences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complaint.evidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 flex items-start gap-3 shadow-2xs"
                    >
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0 font-mono text-[10px] font-bold">
                        {ev.fileType}
                      </div>
                      <div className="flex-1 min-w-0">
                        <b className="text-xs font-bold text-theme-main block truncate">{ev.title}</b>
                        <p className="text-[11px] text-theme-muted mt-0.5">{ev.notes}</p>
                        <small className="text-[9px] text-theme-muted block mt-1">
                          Subido por: {ev.uploader} ({ev.uploadDate})
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <p className="text-theme-muted text-xs">Sin evidencias adjuntas registradas.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: HISTORIAL / AUDIT TRAIL */}
          {activeTab === 'historial' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 flex items-center justify-between">
                <div>
                  <b className="text-theme-main text-xs font-bold block">
                    Bitácora Inmutable del Caso (Audit Trail)
                  </b>
                  <p className="text-theme-muted text-[11px]">
                    Registro cronológico de movimientos, dictámenes técnicos y autorizaciones SGC.
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-600">
                  Integridad Verificada
                </span>
              </div>

              <div className="space-y-2">
                {complaint.auditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-xs text-theme-main">{entry.action}</b>
                        <span className="text-[10px] text-theme-muted">· {entry.user} ({entry.role})</span>
                      </div>
                      <p className="text-xs text-theme-muted mt-0.5">{entry.notes}</p>
                    </div>
                    <span className="font-mono text-[10px] text-theme-muted shrink-0">
                      {entry.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
          <span className="text-[11px] text-theme-muted">
            Customer Quality — ISO 9001:2015 § 8.2.1 Comunicación con el Cliente & 10.2
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToast(`✓ Exportando expediente 360 de ${complaint.id} en PDF...`)}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Expediente</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Warning Modal if Attempted Close without Resolution (P0 Rule) */}
      {showCloseWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border-2 border-rose-500 bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <b className="text-xs font-black text-rose-600 uppercase tracking-wider block">
                  Bloqueo SGC: No Cerrar sin Resolución
                </b>
                <h3 className="font-bold text-sm text-theme-main">
                  Requisito de Cumplimiento Normativo
                </h3>
              </div>
            </div>

            <p className="text-xs text-theme-main leading-relaxed">
              {showCloseWarning}
            </p>

            <div className="rounded-xl bg-theme-muted/10 p-3 text-[11px] text-theme-muted">
              <b>Norma ISO 9001 § 10.2:</b> Las no conformidades del cliente solo pueden cerrarse cuando exista dictamen técnico y la acción correctiva o de reposición haya concluido.
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowCloseWarning(null)}
                className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Entendido, Continuar Resolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
