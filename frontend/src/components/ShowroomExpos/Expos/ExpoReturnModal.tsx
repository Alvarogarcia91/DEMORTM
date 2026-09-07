import React, { useState } from 'react';
import { X, RotateCcw, Scan, CheckCircle2, AlertTriangle, Check, ShieldCheck, Tag } from 'lucide-react';
import { ExpoRecord, ExpoUnitItem } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface ExpoReturnModalProps {
  expo: ExpoRecord;
  onClose: () => void;
  onConfirmReturn: (expoId: string, returnResults: { uid: string; condition: string; notes?: string }[]) => void;
  onShowToast?: (msg: string) => void;
}

export const ExpoReturnModal: React.FC<ExpoReturnModalProps> = ({
  expo,
  onClose,
  onConfirmReturn,
  onShowToast,
}) => {
  const [returnFolio] = useState<string>(`RET-EXPO-2026-00${Math.floor(10 + Math.random() * 40)}`);
  const [unitsCondition, setUnitsCondition] = useState<Record<string, 'Excelente' | 'Buen estado' | 'Empaque dañado' | 'Producto dañado'>>(() => {
    const init: Record<string, any> = {};
    expo.uidsData.forEach((u) => {
      init[u.uid] = 'Excelente';
    });
    return init;
  });
  const [inspectionNotes, setInspectionNotes] = useState<string>('');

  const handleConditionChange = (uid: string, cond: any) => {
    setUnitsCondition((prev) => ({ ...prev, [uid]: cond }));
  };

  const handleFinalSubmit = () => {
    const results = expo.uidsData.map((u) => ({
      uid: u.uid,
      condition: unitsCondition[u.uid] || 'Excelente',
      notes: inspectionNotes,
    }));

    onConfirmReturn(expo.id, results);
    if (onShowToast) {
      onShowToast(`Orden de retorno ${returnFolio} procesada. Unidades inspeccionadas en Mesa de Verificación.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-2xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider font-mono">
                  Retorno e Inspección &bull; {expo.folio}
                </h3>
                <p className="text-[11px] text-theme-muted">
                  Reingreso hacia {expo.originFacilityName}
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
            
            {/* Header Folio */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Orden de Retorno Generada</span>
                <strong className="text-sm font-mono font-black text-rose-600">{returnFolio}</strong>
              </div>
              <span className="text-xs text-zinc-700 font-bold">{expo.totalUnits} unidades de retorno</span>
            </div>

            {/* Units Inspection List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                Inspección física por UID en Mesa de Verificación:
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {expo.uidsData.map((u) => (
                  <div key={u.uid} className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-theme-primary">{u.uid}</span>
                      <span className="text-theme-main font-semibold line-clamp-1">{u.productName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-theme-subtle">
                      {(['Excelente', 'Buen estado', 'Empaque dañado', 'Producto dañado'] as const).map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => handleConditionChange(u.uid, cond)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            unitsCondition[u.uid] === cond
                              ? cond.includes('dañado')
                                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                : 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border-theme-subtle'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-main block">
                Observaciones de inspección y acomodo
              </label>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Ej. Unidades con empaque limpio, 1 unidad enviada a rampa de retrabajo..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main focus:outline-none focus:border-theme-primary font-semibold"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 text-[11px] leading-relaxed">
              Las unidades en <strong>Buen estado</strong> pasarán a <strong>Pendiente de acomodo</strong> en almacén. Unidades con <strong>Empaque dañado</strong> o <strong>Producto dañado</strong> serán canalizadas a la zona de <strong>Retrabajo / Incidencias</strong>. El UID físico se conserva en todo el ciclo.
            </div>

          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar retorno e ingreso a almacén</span>
            </button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
