import React from 'react';
import { 
  X, 
  Store, 
  QrCode, 
  ArrowLeftRight, 
  Clock, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  History,
  Sparkles,
  Printer
} from 'lucide-react';
import { ShowroomBayRecord } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface ShowroomDetailModalProps {
  bay: ShowroomBayRecord;
  onClose: () => void;
  onOpenMountWizard: (bay: ShowroomBayRecord) => void;
  onOpenWithdrawModal: (bay: ShowroomBayRecord) => void;
  onOpenQrModal: (bay: ShowroomBayRecord) => void;
  onShowToast?: (msg: string) => void;
}

export const ShowroomDetailModal: React.FC<ShowroomDetailModalProps> = ({
  bay,
  onClose,
  onOpenMountWizard,
  onOpenWithdrawModal,
  onOpenQrModal,
  onShowToast,
}) => {
  const getBayVariant = (status: string): SemanticVariant => {
    switch (status) {
      case 'En exhibición':
        return 'smart';
      case 'Disponible':
        return 'success';
      case 'Pendiente de montaje':
        return 'warning';
      case 'Pendiente de retiro':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-2xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-purple-500 text-purple-600 flex items-center justify-center shadow-2xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-theme-main">
                    {bay.code} &bull; {bay.name}
                  </h3>
                  <StatusBadge variant={getBayVariant(bay.status)} label={bay.status} size="sm" />
                </div>
                <p className="text-xs text-theme-muted flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                  <span>{bay.branchName} ({bay.branchCode})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenQrModal(bay)}
                className="p-2 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Ver e imprimir código QR de ubicación"
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">QR Bahía</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            
            {/* Current Article Card */}
            {bay.currentArticle ? (
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-[10px] font-mono font-bold text-theme-primary uppercase tracking-wider">
                    ARTÍCULO EN EXHIBICIÓN ACTIVA
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500">
                    Rotación: <strong className="text-purple-600">{bay.currentArticle.rotationTier}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900">
                    {bay.currentArticle.productName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                    <span>SKU: <strong className="font-mono text-zinc-900">{bay.currentArticle.sku}</strong></span>
                    <span>&bull;</span>
                    <span>Medida: <strong>{bay.currentArticle.size}</strong></span>
                    <span>&bull;</span>
                    <span>Precio Lista: <strong className="text-emerald-700 font-mono">${bay.currentArticle.priceMxn.toLocaleString()} MXN</strong></span>
                  </div>
                </div>

                {bay.currentUnit && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">UID Serializado</span>
                      <strong className="text-xs font-mono font-black text-theme-primary block">
                        {bay.currentUnit.uid}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">Fecha de Montaje</span>
                      <strong className="text-xs text-zinc-800 block font-semibold">
                        {bay.currentUnit.mountedAt}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">Días en Piso</span>
                      <strong className={`text-xs font-bold block ${
                        bay.currentUnit.daysInExhibition >= 40 ? 'text-rose-600 font-black' : 'text-zinc-800'
                      }`}>
                        {bay.currentUnit.daysInExhibition} días
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">Condición</span>
                      <strong className="text-xs text-emerald-700 block font-semibold">
                        {bay.currentUnit.condition}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-theme-muted/20 border border-dashed border-theme-subtle text-center space-y-2">
                <Store className="w-8 h-8 text-theme-muted mx-auto opacity-50" />
                <h4 className="text-xs font-bold text-theme-main">Bahía actualmente disponible</h4>
                <p className="text-[11px] text-theme-muted max-w-sm mx-auto">
                  No hay ningún artículo montado en esta bahía de showroom. Puedes montar un modelo recomendado basado en rotación comercial.
                </p>
                <button
                  onClick={() => onOpenMountWizard(bay)}
                  className="mt-2 px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Montar artículo sugerido</span>
                </button>
              </div>
            )}

            {/* Pending Order Notice */}
            {bay.pendingOrderFolio && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">Orden {bay.pendingOrderType} en proceso: {bay.pendingOrderFolio}</span>
                  <span className="text-[11px] text-amber-700">Verifica la recolección en el módulo de Recolecciones.</span>
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-theme-muted" />
                <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider">
                  Historial de Movimientos en esta Bahía
                </h4>
              </div>

              <div className="overflow-x-auto border border-theme-subtle rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-theme-muted/30 border-b border-theme-subtle text-theme-muted text-[10px] uppercase font-bold">
                      <th className="py-2.5 px-3">Fecha / Hora</th>
                      <th className="py-2.5 px-3">Acción</th>
                      <th className="py-2.5 px-3">UID / Artículo</th>
                      <th className="py-2.5 px-3">Ubicación Origen/Destino</th>
                      <th className="py-2.5 px-3">Operador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {bay.history.map((h) => (
                      <tr key={h.id} className="hover:bg-theme-muted/20">
                        <td className="py-2 px-3 font-mono text-[10px] text-theme-muted whitespace-nowrap">
                          {h.timestamp}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            h.action === 'MONTAJE'
                              ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                          }`}>
                            {h.action}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-mono font-bold text-theme-primary block text-[11px]">{h.uid}</span>
                          <span className="text-[10px] text-theme-main font-semibold line-clamp-1">{h.productName}</span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-theme-muted">
                          {h.originOrDestinationLocation}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-theme-muted whitespace-nowrap">
                          {h.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <div className="flex items-center gap-2">
              {bay.status === 'En exhibición' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenWithdrawModal(bay);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Retirar artículo</span>
                </button>
              )}

              {bay.status === 'Disponible' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMountWizard(bay);
                  }}
                  className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Montar artículo</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
