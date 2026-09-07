import React, { useState } from 'react';
import { 
  X, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Tag, 
  Check, 
  Boxes, 
  Store, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { ShowroomPickOrder } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface ShowroomPickingExecutionModalProps {
  order: ShowroomPickOrder;
  onClose: () => void;
  onConfirmComplete: (orderId: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ShowroomPickingExecutionModal: React.FC<ShowroomPickingExecutionModalProps> = ({
  order,
  onClose,
  onConfirmComplete,
  onShowToast,
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [itemsState, setItemsState] = useState(order.items);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const currentItem = itemsState[activeItemIndex] || itemsState[0];
  const allCompleted = itemsState.every((it) => it.status === 'Recolectada' || it.status === 'Montada');

  const handleSimulateValidScan = () => {
    setIsScanning(true);
    setScanError(null);

    setTimeout(() => {
      setIsScanning(false);
      setItemsState((prev) =>
        prev.map((it, idx) =>
          idx === activeItemIndex
            ? { ...it, status: 'Recolectada', scannedUid: it.suggestedUid }
            : it
        )
      );

      // Auto advance to next pending item if exists
      if (activeItemIndex < itemsState.length - 1) {
        setActiveItemIndex((prev) => prev + 1);
      }
    }, 450);
  };

  const handleSimulateInvalidScan = () => {
    setIsScanning(true);
    setScanError(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanError(`✕ La unidad escaneada (SC-UID-2026-000999) no coincide con ${currentItem.suggestedUid}.`);
    }, 400);
  };

  const handleFinalSubmit = () => {
    onConfirmComplete(order.id);
    if (onShowToast) {
      onShowToast(`Orden ${order.folio} completada exitosamente. Unidades recolectadas.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider font-mono">
                    {order.folio}
                  </h3>
                  <StatusBadge variant="info" label={order.type} size="sm" />
                </div>
                <p className="text-[11px] text-theme-muted">
                  {order.branchName} &bull; Destino: {order.destinationLocation}
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
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Order overview card */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500 font-semibold uppercase text-[10px]">Origen de recolección</span>
                <strong className="text-zinc-900 font-mono font-bold">{order.sourceLocation}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold uppercase text-[10px]">Destino final</span>
                <strong className="text-rose-600 font-bold">{order.destinationLocation}</strong>
              </div>
            </div>

            {/* Error Banner */}
            {scanError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{scanError}</span>
              </div>
            )}

            {/* Current Item to Scan */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Partidas de la orden ({itemsState.length} unidades totales)
              </span>

              <div className="space-y-2">
                {itemsState.map((it, idx) => {
                  const isCurrent = idx === activeItemIndex;
                  const isDone = it.status === 'Recolectada' || it.status === 'Montada';

                  return (
                    <div
                      key={it.id}
                      onClick={() => setActiveItemIndex(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-white border-zinc-900 shadow-sm ring-1 ring-zinc-900'
                          : isDone
                          ? 'bg-emerald-500/5 border-emerald-500/30 text-zinc-900'
                          : 'bg-theme-surface border-theme-subtle hover:border-theme-main'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-theme-primary">
                            {it.suggestedUid}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-zinc-500">
                            Ubicación: {it.fromLocation}
                          </span>
                        </div>
                        <strong className="text-xs font-bold text-theme-main block line-clamp-1">
                          {it.productName}
                        </strong>
                      </div>

                      <div>
                        {isDone ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Listo</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scan Box for Active Item */}
            {!allCompleted && (
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 text-center space-y-3 shadow-2xs">
                <Scan className="w-8 h-8 text-theme-primary mx-auto animate-pulse" />
                <div className="space-y-0.5">
                  <strong className="text-xs font-bold text-zinc-900 block">
                    Escanear UID: <span className="font-mono text-rose-600">{currentItem.suggestedUid}</span>
                  </strong>
                  <span className="text-[11px] text-zinc-500 block">
                    Ubicación en rack: {currentItem.fromLocation}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSimulateValidScan}
                    disabled={isScanning}
                    className="flex-1 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isScanning ? 'Verificando...' : 'Escanear UID correcto'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateInvalidScan}
                    className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Simular error
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            {allCompleted && (
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar recolección completa</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
