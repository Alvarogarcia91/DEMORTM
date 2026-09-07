import React from 'react';
import { X, QrCode, Printer, MapPin, Calendar, Truck } from 'lucide-react';
import { ExpoRecord } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';

interface ExpoQrModalProps {
  expo: ExpoRecord;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const ExpoQrModal: React.FC<ExpoQrModalProps> = ({
  expo,
  onClose,
  onShowToast,
}) => {
  const qrPayload = `SC-EXPO-MANIFEST:${expo.folio}:${expo.id}`;

  const handlePrint = () => {
    if (onShowToast) {
      onShowToast(`Enviando manifiesto y QR de ${expo.folio} a impresión...`);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-md bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider font-mono">
                  {expo.folio}
                </h3>
                <p className="text-[11px] text-theme-muted">
                  Código QR Oficial de Exposición Externa
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

          <div className="p-6 space-y-4">
            <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-zinc-300 text-zinc-900 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-between w-full border-b border-zinc-200 pb-2">
                <span className="text-[10px] font-black uppercase text-theme-primary">
                  IMPRESOS RTM &bull; LOGÍSTICA
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  {expo.startDate} &ndash; {expo.endDate}
                </span>
              </div>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrPayload)}`}
                alt={`QR ${expo.folio}`}
                className="w-40 h-40 object-contain mx-auto"
              />

              <div className="space-y-1">
                <strong className="text-sm font-bold text-zinc-900 block">
                  {expo.name}
                </strong>
                <span className="text-xs text-zinc-600 block">
                  Sede: {expo.venue}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  {qrPayload}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-theme-muted text-center leading-relaxed">
              Escanea este QR en la sede del evento junto con los UIDs para validar la recepción y montaje de unidades en piso de exhibición.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Manifiesto QR</span>
            </button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
