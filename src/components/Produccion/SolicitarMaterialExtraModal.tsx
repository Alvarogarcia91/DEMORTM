import React, { useState } from 'react';
import { ProductionMaterialItem, ProductionOrder } from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { AlertTriangle, Plus, X } from 'lucide-react';

interface Props {
  order: ProductionOrder;
  onClose: () => void;
  onConfirm: (materialName: string, quantity: string, reason: string, category4M: string, comment: string) => void;
}

export const SolicitarMaterialExtraModal: React.FC<Props> = ({ order, onClose, onConfirm }) => {
  const materialsList = order.materials && order.materials.length > 0
    ? order.materials
    : [{ id: 'm-default', item: order.area === 'Offset' ? 'Papel Bond 60g 57x87 cm' : 'Bobina Bopp Blanco 7”', delivered: '1,000 unidades' }];

  const [selectedItem, setSelectedItem] = useState(materialsList[0].item);
  const [quantity, setQuantity] = useState('1000 pliegos / metros');
  const [reason, setReason] = useState('Merma en arranque / calibración de registro');
  const [category4M, setCategory4M] = useState('Método');
  const [comment, setComment] = useState('Descalce en corrida inicial requiere pliegos de ajuste para tono');

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600">
                PISO DE PRODUCCIÓN · SOLICITUD ADICIONAL
              </span>
            </div>
            <h2 className="text-base font-black text-theme-main mt-1">
              Solicitar Material Adicional / Merma ({order.folio})
            </h2>
            <p className="text-xs text-theme-muted">
              {order.cliente} · {order.partNumber} · Máquina: {order.machine}
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
          {/* Alerta informativa de lo ya entregado */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-400/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Esta OP ya recibió material estándar programado.</p>
              <p className="text-[11px] text-theme-muted mt-0.5">
                La solicitud de material adicional incrementará el registro de scrap/merma y quedará asentada en la trazabilidad de la orden.
              </p>
            </div>
          </div>

          <label className="block">
            <span className="font-semibold text-theme-muted">Insumo a Solicitar</span>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-main"
            >
              {materialsList.map((m) => (
                <option key={m.id} value={m.item}>
                  {m.item} (Entregado prev.: {m.delivered || '1,000 unids'})
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-semibold text-theme-muted">Cantidad Adicional Requerida</span>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
                placeholder="Ej. 500 pliegos o 300 m"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-theme-muted">Categoría Ishikawa 4M</span>
              <select
                value={category4M}
                onChange={(e) => setCategory4M(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-semibold"
              >
                <option value="Material">Material (Defecto de sustrato/tinta)</option>
                <option value="Máquina">Máquina (Desajuste o falla mecánica)</option>
                <option value="Método">Método (Calibración o cambio especificación)</option>
                <option value="Mano de obra">Mano de obra (Merma de operador / ajuste)</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="font-semibold text-theme-muted">Motivo / Causa Raíz</span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
            />
          </label>

          <label className="block">
            <span className="font-semibold text-theme-muted">Comentarios Técnicos de Piso</span>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
            onClick={() => onConfirm(selectedItem, quantity, reason, category4M, comment)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-xs"
          >
            <Plus className="h-4 w-4" /> Registrar Material Extra y Merma
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
