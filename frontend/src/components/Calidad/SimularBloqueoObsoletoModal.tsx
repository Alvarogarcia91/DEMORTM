import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  Wrench,
  X,
} from 'lucide-react';
import { ControlledDocument } from '../../data/mockCalidadData';

interface Props {
  document?: ControlledDocument;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const SimularBloqueoObsoletoModal: React.FC<Props> = ({
  document,
  onClose,
  onToast,
}) => {
  // Demo simulation state
  const [selectedRevision, setSelectedRevision] = useState<'Rev F' | 'Rev G'>('Rev F');
  const [machineLocked, setMachineLocked] = useState<boolean>(true);
  const [overrideGranted, setOverrideGranted] = useState<boolean>(false);

  const docCode = document?.code || 'PCP-526412';
  const docTitle = document?.title || 'Plan de Control: Etiqueta Panasonic 526412';
  const linkedOp = 'OP-2026-95250';
  const lineMachine = 'Prensa Flexo Mark Andy Scout';

  const handleSelectRevision = (rev: 'Rev F' | 'Rev G') => {
    setSelectedRevision(rev);
    if (rev === 'Rev F') {
      setMachineLocked(true);
      setOverrideGranted(false);
      onToast('⚠️ ALERTA: Intento de uso de revisión OBSOLETA en piso.');
    } else {
      setMachineLocked(false);
      setOverrideGranted(true);
      onToast('✓ Revisión Vigente Rev G validada. Terminal de piso liberada.');
    }
  };

  const handleAutoSwitchToVigente = () => {
    setSelectedRevision('Rev G');
    setMachineLocked(false);
    setOverrideGranted(true);
    onToast('✓ Actualizado automáticamente a Rev G (Vigente). Máquina desbloqueada en piso.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-4 bg-theme-muted/10">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${
                machineLocked
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
            >
              {machineLocked ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-theme-main">
                  Simulador de Integridad en Piso
                </span>
                <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.2 text-[9px] font-bold">
                  Gate-Check IATF 16949
                </span>
              </div>
              <h3 className="font-black text-sm text-theme-main">
                Protección Automática contra Documentación Obsoleta
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

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Context Banner */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2">
            <b className="text-theme-main text-xs font-bold block">
              Escenario de Prueba Operativa en Terminal de Operador:
            </b>
            <p className="text-theme-muted text-xs leading-relaxed">
              En la orden <b className="font-mono text-theme-main">{linkedOp}</b> en la máquina{' '}
              <b className="text-theme-main">{lineMachine}</b>, el operador intenta registrar o escanear el Plan de Control{' '}
              <b className="font-mono text-theme-main">{docCode}</b>. El sistema evalúa instantáneamente si la versión es vigente o está obsoleta.
            </p>
          </div>

          {/* Interactive Revision Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
              Seleccionar Revisión que el Operador intenta usar en Máquina:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Obsolete */}
              <button
                type="button"
                onClick={() => handleSelectRevision('Rev F')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRevision === 'Rev F'
                    ? 'border-rose-500/50 bg-rose-500/10 shadow-xs'
                    : 'border-theme-subtle bg-theme-surface hover:bg-theme-muted/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <b className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                    Rev F (OBSOLETA)
                  </b>
                  <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-bold">
                    Destruida 06 Sep
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted">
                  Versión anterior. Reemplazada por rediseño de Panasonic Industrial.
                </p>
                <small className="text-[9px] text-rose-600 block mt-1 font-mono">
                  Acta de Destrucción: ACT-DEST-2026-088
                </small>
              </button>

              {/* Option B: Vigente */}
              <button
                type="button"
                onClick={() => handleSelectRevision('Rev G')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRevision === 'Rev G'
                    ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xs'
                    : 'border-theme-subtle bg-theme-surface hover:bg-theme-muted/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <b className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Rev G (VIGENTE)
                  </b>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                    Autorizada
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted">
                  Versión oficial en vigor desde el 05 Sep 2026 con tolerancia de radio de esquina.
                </p>
                <small className="text-[9px] text-emerald-600 block mt-1 font-mono">
                  Aprobó: Alicia Ramírez & Iván Estrada
                </small>
              </button>
            </div>
          </div>

          {/* Floor Gate Check Response */}
          {machineLocked ? (
            <div className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 p-4.5 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white shadow-md">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <b className="text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider block">
                    ¡BLOQUEO CRÍTICO DE CALIDAD — MÁQUINA DETENIDA!
                  </b>
                  <p className="text-xs text-rose-950 dark:text-rose-100 leading-relaxed font-semibold">
                    El sistema detectó que el operador está intentando cargar el documento{' '}
                    <span className="font-mono underline">{docCode} Rev F</span>, el cual fue clasificado como{' '}
                    <span className="uppercase font-bold">OBSOLETO</span> y destruido físicamente.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-theme-surface/80 p-3 text-[11px] space-y-1 border border-rose-500/20">
                <div className="flex justify-between">
                  <span className="text-theme-muted">Estado en Terminal de Piso:</span>
                  <b className="font-mono text-rose-600">HOLD OPERATIVO — ARRANQUE PROHIBIDO</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Liberación de 1ra Pieza:</span>
                  <b className="font-mono text-rose-600">DESHABILITADA</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Acción requerida:</span>
                  <span className="text-theme-main font-bold">
                    Sustituir por Rev G autorizada por Calidad.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-rose-500/20">
                <span className="text-[10px] text-theme-muted italic">
                  Evento auditado registrado con ID: <b>AUD-BLOQ-2026-95250</b>
                </span>
                <button
                  type="button"
                  onClick={handleAutoSwitchToVigente}
                  className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-md cursor-pointer transition-all"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Cargar Rev G Vigente y Desbloquear Piso</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-4.5 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
                  <Unlock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <b className="text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider block">
                    DOCUMENTACIÓN VIGENTE — TERMINAL DE PISO HABILITADA
                  </b>
                  <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-semibold">
                    El documento <span className="font-mono underline">{docCode} Rev G</span> corresponde con la revisión autorizada en el SGC para la orden {linkedOp}.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-theme-surface/80 p-3 text-[11px] space-y-1 border border-emerald-500/20">
                <div className="flex justify-between">
                  <span className="text-theme-muted">Estado en Terminal de Piso:</span>
                  <b className="font-mono text-emerald-600">LIBERADA PARA ARRANQUE</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Checklist de 1ra Pieza:</span>
                  <b className="font-mono text-emerald-600">LISTO PARA AUDITORÍA QA</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Cumplimiento Normativo:</span>
                  <span className="text-theme-main font-bold">
                    ISO 9001:2015 § 7.5.3 (Cero desviaciones documentales)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Audit Log representation */}
          <div className="rounded-2xl border border-theme-subtle p-3.5 bg-theme-muted/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
              Registro Automático de Audit Trail (No Repudio):
            </span>
            <div className="font-mono text-[10px] text-theme-muted space-y-1">
              <p>
                [07-SEP-2026 12:45:01] SYS_CHECK: {linkedOp} - {docCode} - Rev:{' '}
                <b className={selectedRevision === 'Rev F' ? 'text-rose-600' : 'text-emerald-600'}>
                  {selectedRevision}
                </b>{' '}
                - Status: {machineLocked ? 'REJECTED_OBSOLETE_HOLD' : 'APPROVED_VIGENTE'}
              </p>
              <p>
                [07-SEP-2026 12:45:02] MES_GATEWAY: Prensa Mark Andy Scout - Interlock signal:{' '}
                {machineLocked ? 'TRIPPED (STOP)' : 'NORMAL (RUN)'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
          <span className="text-[11px] text-theme-muted">
            Validación de control de cambios en tiempo real.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-theme-surface border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs cursor-pointer"
          >
            Cerrar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
