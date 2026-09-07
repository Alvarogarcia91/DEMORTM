import React from 'react';
import {
  FileText,
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Building2,
  Lock,
} from 'lucide-react';
import { ControlledDocument, DocumentRevision, DocumentDestructionEvidence } from '../../data/mockCalidadData';

interface Props {
  document: ControlledDocument;
  revision: DocumentRevision;
  evidence: DocumentDestructionEvidence;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ActaDestruccionModal: React.FC<Props> = ({
  document,
  revision,
  evidence,
  onClose,
  onToast,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-4 bg-theme-muted/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400">
                  {evidence.certificateNumber}
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-bold">
                  Acta Oficial de Destrucción
                </span>
              </div>
              <h3 className="font-black text-sm text-theme-main">
                Evidencia de Retiro y Destrucción de Documentación Obsoleta
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Official Certificate Framing */}
          <div className="rounded-2xl border-2 border-dashed border-theme-subtle bg-theme-surface p-5 space-y-4">
            {/* Header RTM SGC */}
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <b className="text-xs font-black text-theme-main tracking-wider uppercase">
                  RTM Manufactura de Etiquetas S.A. de C.V.
                </b>
                <p className="text-[10px] text-theme-muted">
                  Sistema de Gestión de la Calidad (ISO 9001:2015 § 7.5.3.2 / IATF 16949)
                </p>
              </div>
              <div className="text-right font-mono">
                <small className="text-[9px] text-theme-muted uppercase block">Folio SGC:</small>
                <b className="text-xs font-black text-rose-600">{evidence.certificateNumber}</b>
              </div>
            </div>

            {/* Statement */}
            <p className="text-xs leading-relaxed text-theme-main">
              Por medio de la presente acta se certifica que la documentación técnica e instructivos detallados a continuación han sido retirados en su totalidad de las estaciones de trabajo en piso y destruidos conforme al procedimiento de control de información documentada de RTM.
            </p>

            {/* Document Data Grid */}
            <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-theme-muted/10 p-3.5 border border-theme-subtle">
              <div>
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Código del Documento:</span>
                <b className="font-mono text-xs text-theme-main">{document.code}</b>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Revisión Obsoleta:</span>
                <b className="font-mono text-xs text-rose-600">{revision.revision}</b>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Título:</span>
                <b className="text-xs text-theme-main">{document.title}</b>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Fecha de Ejecución:</span>
                <span className="font-mono text-xs text-theme-main">{evidence.date}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Responsable de Destrucción:</span>
                <span className="text-xs font-bold text-theme-main">{evidence.destroyedBy}</span>
              </div>
            </div>

            {/* Evidence Specifics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-theme-subtle p-3 bg-theme-surface space-y-1">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Copias Físicas Recuperadas:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-theme-main">
                    {evidence.physicalCopiesRetrieved}
                  </span>
                  <span className="text-[10px] text-theme-muted">ejemplares impresos</span>
                </div>
                <small className="text-[10px] text-theme-muted block">
                  Ubicación de recolección: <b>{evidence.retrievalLocation}</b>
                </small>
              </div>

              <div className="rounded-xl border border-theme-subtle p-3 bg-theme-surface space-y-1">
                <span className="text-[9px] uppercase font-bold text-theme-muted block">Método de Destrucción:</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>{evidence.destructionMethod}</span>
                </div>
                <small className="text-[10px] text-theme-muted block">
                  Conforme a normativa de no proliferación de versiones obsoletas.
                </small>
              </div>
            </div>

            {/* Notes */}
            {evidence.notes && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">
                  Observaciones de Auditoría:
                </span>
                <p className="text-xs text-theme-main mt-0.5">{evidence.notes}</p>
              </div>
            )}

            {/* Signatures & Seal */}
            <div className="pt-4 border-t border-theme-subtle grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center">
                  <span className="font-serif italic text-xs text-theme-muted">Alicia Ramírez</span>
                </div>
                <div className="border-t border-theme-subtle pt-1">
                  <b className="text-[10px] text-theme-main block">Aseguramiento de Calidad</b>
                  <small className="text-[9px] text-theme-muted">Firma de Entrega / Certificación</small>
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center">
                  <span className="font-serif italic text-xs text-theme-muted">Comité de Control SGC</span>
                </div>
                <div className="border-t border-theme-subtle pt-1">
                  <b className="text-[10px] text-theme-main block">Auditoría Interna</b>
                  <small className="text-[9px] text-theme-muted">Validación de Destrucción</small>
                </div>
              </div>
            </div>

            {/* Digital Verification Hash */}
            <div className="flex items-center justify-between rounded-xl bg-theme-muted/10 p-2.5 font-mono text-[9px] text-theme-muted border border-theme-subtle">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>SHA-256 Sello Digital: <b className="text-theme-main">d9f4c8b21...e67a01</b></span>
              </div>
              <span className="text-emerald-600 font-bold">100% Verificado</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
          <span className="text-[11px] text-theme-muted">
            Folio permanente en el archivo digital SGC de RTM.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToast(`✓ Imprimiendo copia certificada de ${evidence.certificateNumber}...`)}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir Acta
            </button>
            <button
              type="button"
              onClick={() => onToast(`✓ Acta ${evidence.certificateNumber} descargada en PDF con firma digital.`)}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
