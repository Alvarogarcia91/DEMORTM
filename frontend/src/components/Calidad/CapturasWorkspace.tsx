import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  Info,
  Plus,
  Search,
  Wrench,
} from 'lucide-react';
import { PeriodicControl } from '../../data/mockCalidadData';

interface Props {
  controls: PeriodicControl[];
  onOpenControl: (control: PeriodicControl) => void;
}

export const CapturasWorkspace: React.FC<Props> = ({
  controls,
  onOpenControl,
}) => {
  const [query, setQuery] = useState('');
  const [selectedControlForHistory, setSelectedControlForHistory] = useState<PeriodicControl | null>(null);

  const filteredControls = controls.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase()) ||
      c.parameter.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header explicativo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-theme-primary" />
            <h2 className="text-base font-black text-theme-main">
              Controles Periódicos y Capturas Operativas
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Monitoreo rutinario de cuartos climatizados, humedad, viscosidad de tintas y tolerancias de proceso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar control o área..."
              className="w-48 sm:w-64 rounded-xl border border-theme-subtle bg-theme-surface py-2 pl-8 pr-3 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => onOpenControl(controls[0])}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
          >
            <Plus className="h-4 w-4" /> Capturar Medición
          </button>
        </div>
      </div>

      {/* Banner de aclaración RTM (Demo configurable) */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-blue-300/60 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 text-xs text-blue-950 dark:text-blue-200">
        <Info className="h-4 w-4 text-blue-600 shrink-0" />
        <div>
          <b>Parámetros de Frecuencia RTM:</b> El personal de calidad confirmó el control manual del cuarto de materiales con adhesivo en hojas físicas.
          Cualquier intervalo numérico se presenta con fines de <b>Demo configurable</b> en el Sistema de Gestión.
        </div>
      </div>

      {/* Tabla de controles */}
      <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
        <table className="w-full min-w-[950px] text-xs">
          <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
            <tr>
              <th className="p-3.5 text-left">Control / Ubicación</th>
              <th className="p-3.5 text-left">Parámetro & Rango</th>
              <th className="p-3.5 text-left">Frecuencia</th>
              <th className="p-3.5 text-left">Última Captura</th>
              <th className="p-3.5 text-left">Próxima</th>
              <th className="p-3.5 text-left">Instrumento</th>
              <th className="p-3.5 text-left">Estado</th>
              <th className="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {filteredControls.map((control) => {
              const isOutOfRange = control.status === 'Fuera de rango';

              return (
                <tr
                  key={control.id}
                  className={`hover:bg-theme-muted/10 transition-colors ${
                    isOutOfRange ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                  }`}
                >
                  <td className="p-3.5">
                    <b className="text-theme-main block font-bold">{control.name}</b>
                    <small className="text-theme-muted block">{control.location}</small>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-theme-main">{control.parameter}</span>
                    <small className="block font-mono text-theme-muted">
                      {control.minVal} – {control.maxVal} {control.unit}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span className="rounded-full bg-theme-muted/20 px-2 py-0.5 text-[10px] font-bold text-theme-muted">
                      {control.frequency}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`font-mono font-bold ${
                        isOutOfRange
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-theme-main'
                      }`}
                    >
                      {control.lastValue} {control.unit}
                    </span>
                    <small className="block text-theme-muted">
                      {control.lastCapturedAt} por {control.auditor}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`font-bold ${
                        control.nextDueAt.includes('Vencida')
                          ? 'text-rose-600 font-mono'
                          : 'text-theme-main'
                      }`}
                    >
                      {control.nextDueAt}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-theme-main block">{control.instrument}</span>
                    <small className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
                      Vence: {control.instrumentCalibrationDue}
                    </small>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isOutOfRange
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : control.status === 'Vencida'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      ● {control.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedControlForHistory(control)}
                        title="Ver historial de lecturas"
                        className="rounded-xl border border-theme-subtle p-1.5 text-theme-muted hover:text-theme-main hover:bg-theme-muted/30"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenControl(control)}
                        className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
                      >
                        Capturar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Historial */}
      {selectedControlForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <h3 className="font-bold text-sm text-theme-main">
                Historial de Capturas: {selectedControlForHistory.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedControlForHistory(null)}
                className="rounded-xl p-1 text-theme-muted hover:bg-theme-muted/30"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-theme-subtle max-h-72 overflow-y-auto text-xs">
              {selectedControlForHistory.history.map((h) => (
                <div key={h.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-theme-main">
                      {h.value} {selectedControlForHistory.unit}
                    </span>
                    <small className="block text-theme-muted">
                      {h.timestamp} · {h.auditor}
                    </small>
                    {h.observation && (
                      <p className="text-[11px] text-theme-muted mt-0.5">{h.observation}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      h.status === 'Conforme'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedControlForHistory(null)}
                className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white"
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
