import React from 'react';
import { X, Scale, AlertTriangle, CheckCircle2, Factory, Clock, FileText, AlertCircle } from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { ProductionReconciliation } from '../../data/mockNominaData';

interface ProductionReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reconciliations: ProductionReconciliation[];
}

export const ProductionReconciliationModal: React.FC<ProductionReconciliationModalProps> = ({
  isOpen,
  onClose,
  reconciliations,
}) => {
  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950">
                  Conciliación RTM: Asistencia (Reloj) vs Producción (Piso)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-theme-primary shadow-2xs">
                  EXCLUSIVO RTM
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Cruce de marcajes biométricos contra horas reportadas en órdenes de producción y máquinas Flexo / Offset
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Important Operational Notice Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-xs text-amber-950">
                Regla Operativa RTM (Tolerancia y Validación de Piso)
              </strong>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Diferencias superiores a la tolerancia configurada (0.75 h) generan una alerta de piso para verificar paros de máquina, capacitación, tiempos no productivos o captura faltante en la orden de producción. <strong>Esta diferencia no se convierte automáticamente en descuento salarial</strong>; es una herramienta de supervisión operativa.
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Colaborador / Puesto</th>
                    <th className="px-4 py-3">Máquina / OP</th>
                    <th className="px-4 py-3 text-center">1. Reloj Biométrico</th>
                    <th className="px-4 py-3 text-center">2. Reporte Producción</th>
                    <th className="px-4 py-3 text-center">Diferencia</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {reconciliations.map((rec) => {
                    const isDiff = rec.estado === 'requiere_revision';
                    return (
                      <tr key={rec.id} className={`hover:bg-zinc-50/70 transition-colors ${isDiff ? 'bg-rose-50/20' : ''}`}>
                        {/* Colaborador */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-zinc-900">{rec.empleadoNombre}</div>
                          <div className="text-[10px] text-zinc-500">{rec.puesto}</div>
                        </td>

                        {/* Máquina / OP */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                            <Factory className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{rec.maquina}</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">{rec.ordenProduccion} · {rec.actividad}</div>
                        </td>

                        {/* Reloj */}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-zinc-900">
                          {rec.horasReloj.toFixed(2)} h
                        </td>

                        {/* Producción */}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-blue-700">
                          {rec.horasProduccion.toFixed(2)} h
                        </td>

                        {/* Diferencia */}
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          <span className={isDiff ? 'text-rose-700' : 'text-zinc-600'}>
                            {rec.diferencia > 0 ? `+${rec.diferencia.toFixed(2)} h` : `${rec.diferencia.toFixed(2)} h`}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3 text-center">
                          {rec.estado === 'dentro_tolerancia' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>En Tolerancia</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Revisar Paro</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Individual Highlight Note */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 block">
              Caso Destacado del Periodo Demo
            </span>
            <p className="text-zinc-800 text-xs">
              <strong>Miguel Ángel Treviño (RTM-003):</strong> Registró 9.10 h en reloj el 02-sep pero reportó 6.75 h activas en la Mark Andy Scout sobre la orden OP-95839. Auditoría interna de planta confirmó un <em>paro no programado de 2 horas por falta de tinta Pantone 485 C en andén</em>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Conciliación
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
