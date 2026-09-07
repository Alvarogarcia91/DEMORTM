import React from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Calendar, 
  QrCode, 
  Scan, 
  RotateCcw, 
  User, 
  Phone, 
  Boxes, 
  FileText, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ExpoRecord, ExpoStatus } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface ExpoDetailModalProps {
  expo: ExpoRecord;
  onClose: () => void;
  onOpenQrModal: (expo: ExpoRecord) => void;
  onOpenMountScanModal: (expo: ExpoRecord) => void;
  onOpenReturnModal: (expo: ExpoRecord) => void;
}

export const ExpoDetailModal: React.FC<ExpoDetailModalProps> = ({
  expo,
  onClose,
  onOpenQrModal,
  onOpenMountScanModal,
  onOpenReturnModal,
}) => {
  const getStatusVariant = (status: ExpoStatus): SemanticVariant => {
    switch (status) {
      case 'En exposición externa':
        return 'smart';
      case 'Preparando':
      case 'En tránsito':
        return 'info';
      case 'Planeada':
        return 'warning';
      case 'Por regresar':
      case 'En retorno':
        return 'danger';
      case 'Cerrada':
        return 'neutral';
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
              <div className="w-10 h-10 rounded-2xl bg-white border border-blue-500 text-blue-600 flex items-center justify-center shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-theme-main font-mono">
                    {expo.folio}
                  </h3>
                  <StatusBadge variant={getStatusVariant(expo.status)} label={expo.status} size="sm" />
                </div>
                <strong className="text-xs font-bold text-theme-muted block line-clamp-1">
                  {expo.name}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenQrModal(expo)}
                className="p-2 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main border border-theme-subtle transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Ver e imprimir QR de la Expo"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">QR Expo</span>
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
            
            {/* Venue and Dates Card */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 font-semibold uppercase text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Sede & Recinto</span>
                </div>
                <strong className="text-zinc-900 font-bold block">{expo.venue}</strong>
                <span className="text-[11px] text-zinc-600 block">{expo.address}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 font-semibold uppercase text-[10px]">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Periodo del Evento</span>
                </div>
                <strong className="text-zinc-900 font-bold block font-mono">
                  {expo.startDate} &ndash; {expo.endDate}
                </strong>
                <span className="text-[11px] text-zinc-600 block">
                  Responsable: {expo.responsiblePerson} ({expo.contactPhone})
                </span>
              </div>
            </div>

            {/* Operational Links */}
            <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-theme-muted font-bold text-[10px] uppercase">Enlaces Operativos:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-mono text-[10px]">
                  Recolección: {expo.operationalLinks.pickOrderFolio}
                </span>
                {expo.operationalLinks.outboundOrderFolio && (
                  <span className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-mono text-[10px]">
                    Salida: {expo.operationalLinks.outboundOrderFolio}
                  </span>
                )}
                {expo.operationalLinks.remisionFolio && (
                  <span className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-mono text-[10px]">
                    Remisión: {expo.operationalLinks.remisionFolio}
                  </span>
                )}
              </div>
            </div>

            {/* Units Manifest */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-main uppercase tracking-wider">
                  Manifiesto de UIDs Serializadas ({expo.uidsData.length} unidades)
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto border border-theme-subtle rounded-2xl p-2">
                {expo.uidsData.map((u) => (
                  <div key={u.uid} className="p-3 rounded-xl bg-theme-surface border border-theme-subtle flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-theme-primary block">{u.uid}</span>
                      <strong className="text-theme-main font-semibold block line-clamp-1">{u.productName}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-zinc-300">
                      {u.status}
                    </span>
                  </div>
                ))}
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
              {expo.status === 'Preparando' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMountScanModal(expo);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Escanear Montaje en Sede</span>
                </button>
              )}

              {(expo.status === 'En exposición externa' || expo.status === 'Por regresar') && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReturnModal(expo);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Generar Retorno</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
