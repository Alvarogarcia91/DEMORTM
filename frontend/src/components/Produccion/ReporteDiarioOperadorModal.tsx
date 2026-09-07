import React, { useState } from 'react';
import { OperatorDailyReportEntry, ProductionOrder } from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { Clock, FileText, Plus, X } from 'lucide-react';

interface Props {
  order?: ProductionOrder;
  onClose: () => void;
  onSaveReport: (entry: OperatorDailyReportEntry) => void;
}

export const ReporteDiarioOperadorModal: React.FC<Props> = ({ order, onClose, onSaveReport }) => {
  const [date] = useState('07/09/2026');
  const [shift, setShift] = useState<'Turno A (Matutino)' | 'Turno B (Vespertino)' | 'Turno C (Nocturno)'>('Turno A (Matutino)');
  const [operator, setOperator] = useState(order?.operator || 'J. Salinas');
  const [areaMachine, setAreaMachine] = useState(order?.machine || 'Heidelberg Speedmaster XL 75');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('14:30');
  const [code, setCode] = useState('100');
  const [finishType, setFinishType] = useState(order?.area === 'Offset' ? 'Manual 64 págs' : 'Etiqueta Bopp UV');
  const [quantity, setQuantity] = useState(order ? order.good || 5000 : 5000);
  const [comments, setComments] = useState('Corrida de producción normal. Primera pieza liberada a primera hora por Calidad.');

  const codeMap: Record<string, string> = {
    '100': '100 Inicio de turno y corrida continua',
    '200': '200 Problemas mecánicos / ajuste de registro',
    '300': '300 No hay trabajo / espera de materiales',
    '400': '400 Junta / capacitación de seguridad',
  };

  const handleSave = () => {
    const newEntry: OperatorDailyReportEntry = {
      id: `REP-${Date.now()}`,
      date,
      shift,
      operator,
      areaMachine,
      startTime,
      endTime,
      code,
      codeDescription: codeMap[code] || code,
      opFolio: order?.folio || 'OP-2026-95240',
      client: order?.cliente || 'BLACK & DECKER',
      partNumber: order?.partNumber || 'NA472050',
      finishType,
      producedQuantity: Number(quantity) || 0,
      comments,
    };
    onSaveReport(newEntry);
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-2xl rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                FORMATO OFICIAL RTM DIGITALIZADO
              </span>
            </div>
            <h2 className="text-base font-black text-theme-main mt-1">
              Reporte Diario de Operador (Piso y Máquina)
            </h2>
            <p className="text-xs text-theme-muted">
              Captura de horas productivas, tiempos muertos y código de actividad según estándar RTM.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="block">
              <span className="font-semibold text-theme-muted">Fecha</span>
              <input
                type="text"
                disabled
                value={date}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-muted/30 p-2.5 font-bold"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="font-semibold text-theme-muted">Turno de Trabajo</span>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
              >
                <option value="Turno A (Matutino)">Turno A (Matutino 07:00 - 15:00)</option>
                <option value="Turno B (Vespertino)">Turno B (Vespertino 15:00 - 23:00)</option>
                <option value="Turno C (Nocturno)">Turno C (Nocturno 23:00 - 07:00)</option>
              </select>
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Operador</span>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="font-semibold text-theme-muted">Área / Máquina</span>
              <input
                type="text"
                value={areaMachine}
                onChange={(e) => setAreaMachine(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Hora Inicio</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Hora Fin</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
              />
            </label>
          </div>

          {/* Códigos RTM Documentados */}
          <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-3.5 space-y-2">
            <span className="font-bold text-theme-main">Código de Actividad Documentado RTM:</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { code: '100', text: '100 Inicio turno' },
                { code: '200', text: '200 Prob. mecánicos' },
                { code: '300', text: '300 No hay trabajo' },
                { code: '400', text: '400 Junta / entreno' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCode(c.code)}
                  className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                    code === c.code
                      ? 'border-theme-primary bg-theme-primary text-white shadow-xs'
                      : 'border-theme-subtle bg-theme-surface text-theme-muted hover:bg-theme-muted/30'
                  }`}
                >
                  {c.text}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="font-semibold text-theme-muted">Orden de Producción</span>
              <input
                type="text"
                disabled
                value={order?.folio || 'OP-2026-95240'}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-muted/30 p-2.5 font-mono font-bold"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Tipo de Acabado</span>
              <input
                type="text"
                value={finishType}
                onChange={(e) => setFinishType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Cantidad Producida</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold text-theme-primary"
              />
            </label>
          </div>

          <label className="block">
            <span className="font-semibold text-theme-muted">Comentarios / Bitácora del Operador:</span>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-theme-subtle pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
          >
            <Plus className="h-4 w-4" /> Guardar Reporte Diario
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
