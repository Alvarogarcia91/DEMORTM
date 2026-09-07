import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  Gauge,
  History,
  Info,
  Sparkles,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { PeriodicControl } from '../../data/mockCalidadData';

interface Props {
  control: PeriodicControl;
  onClose: () => void;
  onSave: (
    controlId: string,
    value: number,
    observation: string,
    generateAlert: boolean
  ) => void;
}

export const CapturaMedicionModal: React.FC<Props> = ({
  control,
  onClose,
  onSave,
}) => {
  const [valueStr, setValueStr] = useState(control.lastValue.toString());
  const [observation, setObservation] = useState('');
  const [hasEvidence, setHasEvidence] = useState(false);

  const numVal = parseFloat(valueStr);
  const isValidNumber = !isNaN(numVal);
  const isOutOfRange = isValidNumber && (numVal < control.minVal || numVal > control.maxVal);

  const handleSave = (createAlert: boolean) => {
    if (!isValidNumber) return;
    onSave(control.id, numVal, observation, createAlert || isOutOfRange);
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-theme-subtle bg-theme-surface p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-theme-primary/10 p-2.5 text-theme-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                  CAPTURA DE CONTROL OPERATIVO
                </span>
                <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[10px] font-mono font-bold text-theme-muted">
                  {control.id}
                </span>
              </div>
              <h2 className="text-base font-black text-theme-main mt-0.5">
                {control.name}
              </h2>
              <p className="text-xs text-theme-muted">
                {control.location} · Auditor: <b className="text-theme-main">{control.auditor}</b>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Frecuencia (aclaración Demo configurable según Iván) */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-300/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-blue-950 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <b>Frecuencia de monitoreo:</b> {control.frequency}
              </span>
            </div>
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
              Configurable en SGC
            </span>
          </div>

          {/* Instrumento y Metrología */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-theme-main uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-theme-primary" />
                Instrumento de Medición Asociado:
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                Calibración Vigente ✓
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-theme-main">
              <p>
                <b className="text-theme-muted">Equipo:</b> {control.instrument}
              </p>
              <p>
                <b className="text-theme-muted">Vencimiento calibración:</b>{' '}
                <span className="font-mono font-bold text-theme-main">
                  {control.instrumentCalibrationDue}
                </span>
              </p>
            </div>
          </div>

          {/* Rango esperado y Captura */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <span className="text-theme-muted uppercase tracking-wider text-[10px] font-bold">
                  Parámetro de Control
                </span>
                <p className="font-bold text-theme-main text-sm mt-0.5">
                  {control.parameter}
                </p>
              </div>
              <div className="text-right">
                <span className="text-theme-muted text-[10px] font-bold uppercase">
                  Rango Especificado
                </span>
                <p className="font-mono text-theme-main font-black text-sm mt-0.5">
                  {control.minVal} – {control.maxVal} {control.unit}
                </p>
              </div>
            </div>

            {/* Input de Valor Medido */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-theme-main">
                Valor Actual Medido ({control.unit}):
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.1"
                    value={valueStr}
                    onChange={(e) => setValueStr(e.target.value)}
                    placeholder={`Ej: ${control.targetVal}`}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-4 py-3 font-mono text-lg font-black text-theme-main focus:border-theme-primary focus:outline-none"
                  />
                  <span className="absolute right-4 top-3.5 font-bold text-theme-muted text-sm">
                    {control.unit}
                  </span>
                </div>

                {/* Botones de ajuste rápido para demo */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setValueStr(control.targetVal.toString())}
                    title="Cargar valor óptimo conforme"
                    className="rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                  >
                    Óptimo ({control.targetVal})
                  </button>
                  <button
                    type="button"
                    onClick={() => setValueStr((control.maxVal + 1.8).toFixed(1))}
                    title="Simular desviación fuera de rango"
                    className="rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-3 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                  >
                    Fuera de rango ({(control.maxVal + 1.8).toFixed(1)})
                  </button>
                </div>
              </div>
            </div>

            {/* Comparación Automática en Vivo */}
            <div
              className={`rounded-2xl border p-4 transition-all ${
                !isValidNumber
                  ? 'border-theme-subtle bg-theme-muted/10 text-theme-muted'
                  : isOutOfRange
                  ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200'
                  : 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOutOfRange ? (
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <b className="text-sm">
                      {isOutOfRange ? '⚠ MEDICIóN FUERA DE ESPECIFICACIóN' : '✓ CONFORME DENTRO DE RANGO'}
                    </b>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isOutOfRange
                        ? `El valor capturado (${numVal} ${control.unit}) rebasa el límite permitido (${control.minVal}–${control.maxVal} ${control.unit}). Requiere atención o alerta operativa.`
                        : `El valor capturado (${numVal} ${control.unit}) se encuentra dentro del estándar operativo RTM.`}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-black uppercase ${
                    isOutOfRange
                      ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                      : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                  }`}
                >
                  {isOutOfRange ? 'Desviación' : 'Conforme'}
                </span>
              </div>
            </div>

            {/* Observaciones y Evidencia */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-theme-muted block">
                Observaciones del Auditor:
              </label>
              <textarea
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Detalles sobre condiciones ambientales, acción correctiva preventiva o equipo..."
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
              />

              {/* Botón de Evidencia Fotográfica Demo */}
              <div className="flex items-center justify-between rounded-xl border border-dashed border-theme-subtle p-3">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Upload className="h-4 w-4" />
                  <span>
                    {hasEvidence
                      ? 'Foto adjunta: termohigrometro_lectura_07sep.jpg'
                      : 'Evidencia fotográfica digital (Opcional)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasEvidence(!hasEvidence)}
                  className="rounded-lg border border-theme-subtle px-2.5 py-1 text-[11px] font-bold text-theme-main hover:bg-theme-muted/30"
                >
                  {hasEvidence ? 'Quitar foto' : 'Simular fotografía'}
                </button>
              </div>
            </div>
          </div>

          {/* Historial previo */}
          <div className="space-y-2">
            <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Lecturas Registradas Recientemente ({control.history.length}):
            </span>
            <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface">
              {control.history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-theme-main">
                      {item.value} {control.unit}
                    </span>
                    <small className="block text-theme-muted">
                      {item.timestamp} · {item.auditor}
                      {item.observation && ` · ${item.observation}`}
                    </small>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'Conforme'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer de Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main"
            >
              Cancelar
            </button>
            <div className="flex gap-2">
              {isOutOfRange && (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-xs"
                >
                  Guardar y generar alerta preventiva
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="rounded-xl bg-theme-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
              >
                Guardar captura
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
