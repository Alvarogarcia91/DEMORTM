import React, { useState } from 'react';
import { X, Scan, CheckCircle2, AlertTriangle, Check, Truck, MapPin, Tag } from 'lucide-react';
import { ExpoRecord } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface ExpoMountingScanModalProps {
  expo: ExpoRecord;
  onClose: () => void;
  onConfirmMounting: (expoId: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ExpoMountingScanModal: React.FC<ExpoMountingScanModalProps> = ({
  expo,
  onClose,
  onConfirmMounting,
  onShowToast,
}) => {
  const [isExpoQrScanned, setIsExpoQrScanned] = useState(false);
  const [scannedUids, setScannedUids] = useState<string[]>(
    expo.uidsData.filter(u => u.status === 'En exposición externa').map(u => u.uid)
  );
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pendingUids = expo.uidsData.filter(u => !scannedUids.includes(u.uid));
  const isAllScanned = pendingUids.length === 0;

  const handleScanExpoQr = () => {
    setIsScanning(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setIsExpoQrScanned(true);
    }, 450);
  };

  const handleScanUid = (uid: string) => {
    setIsScanning(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedUids(prev => [...prev, uid]);
    }, 350);
  };

  const handleScanAllRemaining = () => {
    setIsScanning(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedUids(expo.uidsData.map(u => u.uid));
    }, 600);
  };

  const handleFinalConfirm = () => {
    onConfirmMounting(expo.id);
    if (onShowToast) {
      onShowToast(`Recepción y montaje de ${expo.folio} confirmado. ${expo.totalUnits} unidades en exposición externa.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider font-mono">
                  Recepción & Montaje en Sede &bull; {expo.folio}
                </h3>
                <p className="text-[11px] text-theme-muted">
                  {expo.venue}
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

          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Step 1: Scan Expo QR */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
              isExpoQrScanned
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900'
                : 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  1. Escaneo de Manifiesto / QR Expo
                </span>
                {isExpoQrScanned && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <strong className="text-xs font-bold block">{expo.name}</strong>
              
              {!isExpoQrScanned && (
                <button
                  type="button"
                  onClick={handleScanExpoQr}
                  disabled={isScanning}
                  className="mt-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>{isScanning ? 'Validando QR...' : 'Escanear QR de Sede Expo'}</span>
                </button>
              )}
            </div>

            {/* Step 2: Scan UIDs arrived */}
            {isExpoQrScanned && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                    2. Unidades físicas recibidas ({scannedUids.length} de {expo.uidsData.length})
                  </span>
                  {!isAllScanned && (
                    <button
                      type="button"
                      onClick={handleScanAllRemaining}
                      className="text-[11px] text-theme-primary hover:underline font-bold cursor-pointer"
                    >
                      Escanear todas restantes
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {expo.uidsData.map((u) => {
                    const isDone = scannedUids.includes(u.uid);
                    return (
                      <div
                        key={u.uid}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/30 text-zinc-900'
                            : 'bg-theme-surface border-theme-subtle text-theme-muted'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-theme-primary">{u.uid}</span>
                          <span className="text-[11px] font-semibold text-theme-main block">{u.productName}</span>
                        </div>

                        {isDone ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verificada</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleScanUid(u.uid)}
                            disabled={isScanning}
                            className="px-2.5 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-[10px] border border-theme-subtle cursor-pointer"
                          >
                            Escanear
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            {isAllScanned && (
              <button
                onClick={handleFinalConfirm}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar montaje activo</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
