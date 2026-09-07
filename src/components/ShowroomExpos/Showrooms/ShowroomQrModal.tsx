import React from 'react';
import { X, QrCode, Printer, Download, Store, MapPin, Tag } from 'lucide-react';
import { ShowroomBayRecord } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface ShowroomQrModalProps {
  bay: ShowroomBayRecord;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const ShowroomQrModal: React.FC<ShowroomQrModalProps> = ({
  bay,
  onClose,
  onShowToast,
}) => {
  const qrPayload = `SC-SHOWROOM-BAY:${bay.branchCode}:${bay.code}`;

  const handlePrint = () => {
    if (onShowToast) {
      onShowToast(`Enviando etiqueta de ubicación ${bay.code} a impresora térmica Zebra...`);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-md bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Etiqueta QR de Showroom
                </h3>
                <p className="text-[11px] text-theme-muted">
                  Código físico de ubicación para piso de venta
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

          {/* Body: Etiqueta física para imprimir */}
          <div className="p-6 space-y-5">
            
            {/* Label Card Preview */}
            <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-zinc-300 text-zinc-900 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-between w-full border-b border-zinc-200 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                  IMPRESOS RTM
                </span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase">
                  {bay.branchName}
                </span>
              </div>

              {/* QR Graphic Mock */}
              <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrPayload)}`}
                  alt={`QR ${bay.code}`}
                  className="w-40 h-40 object-contain mx-auto"
                />
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-zinc-600 bg-white/90 px-1 rounded">
                  QR LOC
                </span>
              </div>

              <div className="space-y-1">
                <strong className="text-2xl font-mono font-black text-zinc-900 tracking-wider block">
                  {bay.code}
                </strong>
                <span className="text-xs font-bold text-zinc-700 block">
                  {bay.name} &bull; {bay.branchCode}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  {qrPayload}
                </span>
              </div>

              <div className="w-full pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
                <span>Formato: 100 x 75 mm</span>
                <span>Zebra ZD421</span>
              </div>
            </div>

            {/* Note */}
            <p className="text-[11px] text-theme-muted leading-relaxed text-center">
              Este QR identifica exclusivamente la bahía física de exhibición en sucursal. Debe escanearse durante el montaje y retiro.
            </p>
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
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir etiqueta</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
