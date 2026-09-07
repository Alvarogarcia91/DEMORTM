import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Tag, 
  Check, 
  Boxes,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ShowroomBayRecord } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface WithdrawShowroomModalProps {
  bay: ShowroomBayRecord;
  onClose: () => void;
  onConfirmWithdrawal: (bayId: string, returnLocation: string, condition: 'Excelente' | 'Bueno' | 'Observado', notes?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const WithdrawShowroomModal: React.FC<WithdrawShowroomModalProps> = ({
  bay,
  onClose,
  onConfirmWithdrawal,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [targetLocation, setTargetLocation] = useState<string>('A-A-01');
  const [unitCondition, setUnitCondition] = useState<'Excelente' | 'Bueno' | 'Observado'>('Excelente');
  const [withdrawalReason, setWithdrawalReason] = useState<string>('Rotación programada por antigüedad');
  const [notes, setNotes] = useState<string>('');

  const currentUnit = bay.currentUnit;
  const currentArticle = bay.currentArticle;

  // Step 1: Scan UID from Showroom
  const handleSimulateUidScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setErrorMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('success');
      setTimeout(() => {
        setScanStatus('idle');
        setStep(2);
      }, 500);
    }, 450);
  };

  // Step 2: Scan Destination Location
  const handleSimulateLocationScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setErrorMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('success');
      setTimeout(() => {
        setScanStatus('idle');
        setStep(3);
      }, 500);
    }, 450);
  };

  const handleFinalConfirm = () => {
    onConfirmWithdrawal(bay.id, targetLocation, unitCondition, notes);
    if (onShowToast) {
      onShowToast(`Artículo retirado de ${bay.code}. La unidad ${currentUnit?.uid} regresó a almacén en ${targetLocation}.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Retirar Artículo de Showroom
                </h3>
                <p className="text-[11px] text-theme-muted">
                  {bay.name} &bull; {bay.branchName}
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

          {/* Stepper Progress */}
          <div className="px-6 py-3 bg-theme-muted/10 border-b border-theme-subtle flex items-center justify-between text-[11px] font-bold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-theme-primary' : 'text-theme-muted'}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
              <span>Escanear UID</span>
            </div>
            <div className="w-8 h-px bg-theme-subtle" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-theme-primary' : 'text-theme-muted'}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
              <span>Ubicación Almacén</span>
            </div>
            <div className="w-8 h-px bg-theme-subtle" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-theme-primary' : 'text-theme-muted'}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</span>
              <span>Inspección & Cierre</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Unit info card */}
            <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-theme-primary">
                  {currentUnit?.uid || 'RTM-UID-...'}
                </span>
                <span className="text-[10px] font-bold text-theme-muted">
                  {currentUnit?.daysInExhibition || 0} días en exhibición
                </span>
              </div>
              <strong className="text-sm font-bold text-theme-main block">
                {currentArticle?.productName || 'Artículo en exhibición'}
              </strong>
              <div className="flex items-center gap-2 text-xs text-theme-muted">
                <span>SKU: <strong className="text-theme-main font-mono">{currentArticle?.sku}</strong></span>
                <span>&bull;</span>
                <span>Medida: <strong className="text-theme-main">{currentArticle?.size}</strong></span>
              </div>
            </div>

            {/* STEP 1: SCAN UID */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150 text-center">
                <div className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col items-center space-y-3 shadow-2xs">
                  <Scan className="w-10 h-10 text-theme-primary animate-pulse" />
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-zinc-900 block">
                      Escanear código QR del Muestrario físico
                    </strong>
                    <span className="text-[11px] text-zinc-500 block">
                      Apunta la terminal al código serializado del artículo en {bay.code}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs font-bold text-zinc-800">
                    UID Esperado: {currentUnit?.uid}
                  </div>
                </div>

                <button
                  onClick={handleSimulateUidScan}
                  disabled={isScanning}
                  className="w-full py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isScanning ? 'Validando UID...' : 'Simular escaneo de UID correcto'}</span>
                </button>
              </div>
            )}

            {/* STEP 2: SCAN DESTINATION LOCATION */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-theme-main block">
                    Ubicación de reingreso en almacén de sucursal
                  </label>
                  <select
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-mono font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                  >
                    <option value="A-A-01">Pasillo A &bull; Nivel Piso A-A-01 (Recomendada)</option>
                    <option value="A-A-04">Pasillo A &bull; Nivel Piso A-A-04</option>
                    <option value="B-A-02">Pasillo B &bull; Nivel Piso B-A-02</option>
                    <option value="MINI-RACK-02">Zona de Reserva &bull; MINI-RACK-02</option>
                    <option value="ACOMODO">Área de Acomodo Temporal</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-2 shadow-2xs">
                  <MapPin className="w-7 h-7 text-emerald-600 mx-auto" />
                  <span className="text-xs font-bold text-zinc-900 block">
                    Confirmar escaneo de ubicación destino ({targetLocation})
                  </span>
                </div>

                <button
                  onClick={handleSimulateLocationScan}
                  disabled={isScanning}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isScanning ? 'Verificando ubicación...' : 'Confirmar escaneo de ubicación'}</span>
                </button>
              </div>
            )}

            {/* STEP 3: INSPECTION & CONFIRMATION */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-theme-main block">
                    Estado físico de la unidad al retiro
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Excelente', 'Bueno', 'Observado'] as const).map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setUnitCondition(cond)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          unitCondition === cond
                            ? 'bg-white border-zinc-900 text-zinc-900 shadow-sm'
                            : 'bg-theme-surface border-theme-subtle text-theme-muted hover:border-theme-main'
                        }`}
                      >
                        <span>{cond}</span>
                        <span className="text-[10px] font-normal opacity-80">
                          {cond === 'Excelente' ? 'Disponible' : cond === 'Bueno' ? 'Disponible' : 'A revisión'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-theme-main block">
                    Motivo de retiro
                  </label>
                  <select
                    value={withdrawalReason}
                    onChange={(e) => setWithdrawalReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-bold text-theme-main"
                  >
                    <option value="Rotación programada por antigüedad">Rotación programada por antigüedad</option>
                    <option value="Venta / Liquidación de modelo de exhibición">Venta / Liquidación de modelo de exhibición</option>
                    <option value="Reacomodo de piso de venta">Reacomodo de piso de venta</option>
                    <option value="Mantenimiento o cambio de imagen">Mantenimiento o cambio de imagen</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-theme-main block">
                    Observaciones adicionales (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Funda protectora limpia, sin detalles en tela..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Al confirmar, el UID pasará a <strong>{unitCondition === 'Observado' ? 'Pendiente de revisión' : 'Disponible'}</strong> en almacén y la bahía <strong>{bay.code}</strong> quedará en estado <strong>Disponible</strong>.
                  </span>
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
              Cancelar
            </button>

            {step === 3 && (
              <button
                onClick={handleFinalConfirm}
                className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar retiro y liberar bahía</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
