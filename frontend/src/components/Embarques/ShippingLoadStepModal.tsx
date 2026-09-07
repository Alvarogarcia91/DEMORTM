import React from 'react';
import { X, Send, Truck, CheckCircle2, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { ShippingOutboundOrder } from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';

interface ShippingLoadStepModalProps {
  order: ShippingOutboundOrder;
  onClose: () => void;
}

export const ShippingLoadStepModal: React.FC<ShippingLoadStepModalProps> = ({
  order,
  onClose,
}) => {
  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-theme-main">
                Secuenciación de Carga
              </h3>
              <p className="text-[11px] font-mono text-rose-600 font-bold">
                {order.folio} &bull; {order.totalUnits} piezas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Validación de Salida y Remisión Completas</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              La orden <strong>{order.folio}</strong> cuenta con transporte asignado (<strong>{order.assignedVehicleName}</strong> &bull; <strong>{order.assignedDriverName}</strong>) y remisión oficial <strong>{order.remisionFolio}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-500/30 shadow-2xs space-y-2 text-zinc-900">
            <span className="font-black text-rose-600 uppercase text-[10px] tracking-wider block">
              Próximo Paso Operativo
            </span>
            <p className="text-xs font-bold leading-relaxed">
              La planificación de ruta y carga se realizará en el siguiente paso.
            </p>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              En la siguiente fase se habilitará el Wizard de acomodo en caja seca según el orden LIFO de paradas y confirmación de estiba física.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>

      </div>
    </ModalPortal>
  );
};
