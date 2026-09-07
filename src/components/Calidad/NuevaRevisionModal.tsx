import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FilePlus2,
  FileText,
  Lock,
  Printer,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { ControlledDocument, DocumentRevision, DocumentAuditTrailEntry } from '../../data/mockCalidadData';

interface Props {
  document?: ControlledDocument;
  allDocuments: ControlledDocument[];
  onClose: () => void;
  onSave: (docCode: string, newRevision: DocumentRevision, auditEntry: DocumentAuditTrailEntry, newPhysicalCount?: number, newLocations?: string[]) => void;
  onToast: (msg: string) => void;
}

export const NuevaRevisionModal: React.FC<Props> = ({
  document,
  allDocuments,
  onClose,
  onSave,
  onToast,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDocCode, setSelectedDocCode] = useState<string>(
    document?.code || allDocuments[0]?.code || 'FM-QA-153'
  );

  const selectedDoc = allDocuments.find((d) => d.code === selectedDocCode) || document || allDocuments[0];

  // Form states
  const [revisionNumber, setRevisionNumber] = useState<string>('Rev 5');
  const [effectiveDate, setEffectiveDate] = useState<string>('07 Sep 2026');
  const [changeDescription, setChangeDescription] = useState<string>(
    'Actualización de especificación y ajuste de layout para cumplimiento con nuevo requerimiento de cliente.'
  );
  const [releasedBy, setReleasedBy] = useState<string>('Alicia Ramírez');
  const [approvedBy, setApprovedBy] = useState<string>('Iván Estrada (Producción)');
  const [immediateActivation, setImmediateActivation] = useState<boolean>(true);

  // Physical copies state
  const [copiesCount, setCopiesCount] = useState<number>(selectedDoc?.physicalCopiesCount || 3);
  const [locations, setLocations] = useState<string>(
    selectedDoc?.physicalLocations?.join(', ') || 'Prensa Mark Andy Scout, Mesa de Inspección Final, Oficina Calidad'
  );
  const [retireOldCopies, setRetireOldCopies] = useState<boolean>(true);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRevStatus: 'Vigente' | 'En revisión' = immediateActivation ? 'Vigente' : 'En revisión';

    const newRevision: DocumentRevision = {
      revision: revisionNumber,
      effectiveDate: immediateActivation ? effectiveDate : 'Por autorizar',
      releasedBy,
      approvedBy: immediateActivation ? approvedBy : 'Pendiente Calidad',
      changeDescription,
      status: newRevStatus,
    };

    const auditEntry: DocumentAuditTrailEntry = {
      id: `aud-${Date.now()}`,
      timestamp: '07 Sep 2026 · 13:00',
      action: immediateActivation ? 'Puesta en Vigor' : 'Nueva Revisión',
      user: releasedBy,
      role: 'Aseguramiento de Calidad',
      notes: `${immediateActivation ? 'Puesta en vigor' : 'Registro de nueva propuesta'} de ${revisionNumber}: ${changeDescription}`,
      revision: revisionNumber,
    };

    const parsedLocations = locations.split(',').map((s) => s.trim()).filter(Boolean);

    onSave(selectedDocCode, newRevision, auditEntry, copiesCount, parsedLocations);
    onToast(`✓ Nueva revisión ${revisionNumber} registrada exitosamente para ${selectedDocCode}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-4 bg-theme-muted/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-theme-primary">
                  SGC § 7.5.3
                </span>
                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.2 text-[9px] font-bold">
                  Asistente de Control de Cambios
                </span>
              </div>
              <h3 className="font-black text-sm text-theme-main">
                Crear / Liberar Nueva Revisión de Documento
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Stepper */}
        <div className="flex items-center justify-between border-b border-theme-subtle bg-theme-surface px-6 py-2.5">
          {[
            { num: 1, label: 'Datos Revisión' },
            { num: 2, label: 'Copias en Piso' },
            { num: 3, label: 'Obsolescencia' },
            { num: 4, label: 'Firma y Vigor' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[10px] ${
                  step === s.num
                    ? 'bg-theme-primary text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-theme-muted/20 text-theme-muted'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-[10px] hidden sm:inline ${
                  step === s.num ? 'font-bold text-theme-main' : 'text-theme-muted'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Content / Step Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-5 space-y-4 flex-1">
            {/* STEP 1: Datos de la Revisión */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Documento Controlado Base:
                  </label>
                  <select
                    value={selectedDocCode}
                    onChange={(e) => {
                      setSelectedDocCode(e.target.value);
                      const d = allDocuments.find((doc) => doc.code === e.target.value);
                      if (d) {
                        setCopiesCount(d.physicalCopiesCount || 3);
                        setLocations(d.physicalLocations?.join(', ') || 'Prensa Flexo, Tablero QA');
                      }
                    }}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                  >
                    {allDocuments.map((doc) => (
                      <option key={doc.code} value={doc.code}>
                        {doc.code} — {doc.title} ({doc.revision})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Nueva Revisión:
                    </label>
                    <input
                      type="text"
                      required
                      value={revisionNumber}
                      onChange={(e) => setRevisionNumber(e.target.value)}
                      placeholder="Ej. Rev 5 o Rev H"
                      className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Fecha Efectiva:
                    </label>
                    <input
                      type="text"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono text-theme-main focus:outline-none focus:border-theme-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Motivo del Cambio / Justificación Técnica:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    placeholder="Detalla qué secciones o tolerancias se modificaron y por qué..."
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                  <small className="text-[10px] text-theme-muted mt-1 block">
                    Este texto quedará indexado permanentemente en la tabla histórica de revisiones y el Audit Trail.
                  </small>
                </div>
              </div>
            )}

            {/* STEP 2: Control de Copias Físicas */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-1">
                  <b className="text-theme-main text-xs font-bold block">
                    Distribución Controlada de Copias en Piso:
                  </b>
                  <p className="text-theme-muted text-xs leading-relaxed">
                    Para evitar que el personal use versiones desactualizadas, cada copia física autorizada debe tener un sello rojo de "COPIA CONTROLADA" y una ubicación asignada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Cantidad de Copias Impresas en Piso:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={copiesCount}
                      onChange={(e) => setCopiesCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Sello de Seguridad Requerido:
                    </label>
                    <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-theme-subtle bg-theme-muted/10 text-emerald-600 font-bold text-xs">
                      <ShieldCheck className="h-4 w-4" />
                      <span>COPIA CONTROLADA N° SGC</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Ubicaciones Físicas de Distribución (Separadas por coma):
                  </label>
                  <textarea
                    rows={2}
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    placeholder="Prensa Mark Andy Scout, Mesa de Inspección Final, Oficina Calidad..."
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                  <small className="text-[10px] text-theme-muted mt-1 block">
                    El auditor verificará la presencia exclusiva de esta revisión en los puntos registrados.
                  </small>
                </div>
              </div>
            )}

            {/* STEP 3: Obsolescencia y Destrucción */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-xs uppercase tracking-wider">
                    <Trash2 className="h-4 w-4" />
                    <span>Política de Obsolescencia Inmediata (ISO 9001 § 7.5.3.2)</span>
                  </div>
                  <p className="text-xs text-rose-950 dark:text-rose-100 leading-relaxed font-medium">
                    Al poner en vigor <b className="font-mono">{revisionNumber}</b>, la versión anterior{' '}
                    <b className="font-mono">{selectedDoc?.revision}</b> pasará automáticamente a estado{' '}
                    <b className="text-rose-600 uppercase">OBSOLETA</b>.
                  </p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retireOldCopies}
                      onChange={(e) => setRetireOldCopies(e.target.checked)}
                      className="mt-0.5 rounded border-theme-subtle text-theme-primary focus:ring-theme-primary"
                    />
                    <div>
                      <b className="text-theme-main text-xs font-bold block">
                        Generar orden de retiro físico y Acta de Destrucción
                      </b>
                      <p className="text-[11px] text-theme-muted mt-0.5">
                        Se asignará una tarea a Calidad para recoger las copias de la versión anterior en piso y destruirlas mediante triturado de alta seguridad.
                      </p>
                    </div>
                  </label>

                  <div className="rounded-xl bg-theme-muted/10 p-3 border border-theme-subtle text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-theme-muted">Folio de Acta asignado:</span>
                      <b className="font-mono text-theme-main">ACT-DEST-2026-092 (Automático)</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">Método de disposición:</span>
                      <span className="font-bold text-rose-600">Triturado mecánico en presencia de Calidad</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Firmas y Vigor */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Elaboró / Solicitó:
                    </label>
                    <input
                      type="text"
                      value={releasedBy}
                      onChange={(e) => setReleasedBy(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                      Aprobador Asignado:
                    </label>
                    <input
                      type="text"
                      value={approvedBy}
                      onChange={(e) => setApprovedBy(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                    Modo de Puesta en Vigor:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setImmediateActivation(true)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        immediateActivation
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-theme-subtle bg-theme-muted/10'
                      }`}
                    >
                      <b className="text-xs font-bold text-emerald-600 block mb-1">
                        Poner en Vigor Inmediato
                      </b>
                      <p className="text-[10px] text-theme-muted">
                        Firma aprobada en sesión. El documento se vuelve vigente hoy y actualiza el piso de planta.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImmediateActivation(false)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        !immediateActivation
                          ? 'border-amber-500/50 bg-amber-500/10'
                          : 'border-theme-subtle bg-theme-muted/10'
                      }`}
                    >
                      <b className="text-xs font-bold text-amber-600 block mb-1">
                        Enviar a Revisión SGC
                      </b>
                      <p className="text-[10px] text-theme-muted">
                        Queda en estado "En revisión" hasta que el comité o Alicia Ramírez emita la firma de aprobación.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="rounded-xl border border-theme-subtle bg-theme-muted/10 p-3 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Documento:</span>
                    <b className="text-theme-main font-mono">{selectedDocCode}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Revisión a publicar:</span>
                    <b className="text-emerald-600 font-mono font-bold">{revisionNumber}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Copias controladas en piso:</span>
                    <span className="text-theme-main font-bold">{copiesCount} ejemplares</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-muted hover:text-theme-main cursor-pointer"
              >
                Cancelar
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirmar y Registrar Revisión</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
