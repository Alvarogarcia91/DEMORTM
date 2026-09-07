import React from 'react';
import {
  X,
  Package,
  CheckCircle2,
  Printer,
  Truck,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  FileText,
  Boxes,
  ArrowRight,
} from 'lucide-react';
import { FinishedGoodsRelease } from '../../data/mockFinishedGoodsData';
import { ModalPortal } from '../common/ModalPortal';

interface Props {
  release: FinishedGoodsRelease;
  onClose: () => void;
  onNavigateToEmbarques?: () => void;
  onPrintLabelDemo?: (release: FinishedGoodsRelease) => void;
}

export const FichaLotePtModal: React.FC<Props> = ({
  release,
  onClose,
  onNavigateToEmbarques,
  onPrintLabelDemo,
}) => {
  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {release.lotNumber}
                </span>
                <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                  {release.status}
                </span>
              </div>
              <h3 className="text-sm font-black text-theme-main">
                Ficha de Lote · Producto Terminado
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="p-1.5 rounded-xl border border-theme-subtle text-theme-muted hover:text-theme-main hover:bg-theme-muted/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Main Info Box */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-theme-muted font-bold">Cliente:</span>
              <strong className="text-theme-main font-bold">{release.client}</strong>
            </div>

            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-theme-muted font-bold">Parte & Revisión:</span>
              <span className="font-mono font-bold text-theme-main">
                {release.partNumber} · {release.revision}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-theme-muted font-bold">Cantidad Conforme:</span>
              <span className="font-mono font-black text-theme-main">
                {release.finishedQty.toLocaleString()} pzas ({release.packageCount || 50} bultos)
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-theme-muted font-bold">OP Origen / Pedido:</span>
              <span className="font-mono text-theme-primary font-bold">
                {release.opFolio} · {release.pedido}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-theme-muted font-bold">Ubicación Almacén PT:</span>
              <span className="font-mono font-black text-theme-main flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {release.location} ({release.warehouseName})
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-theme-muted font-bold">Dictamen Calidad:</span>
              <span className="text-theme-muted text-[11px]">
                {release.qualityReleaseId || 'QA-260907-084'} por <b className="text-theme-main">{release.releasedBy}</b> ({release.releasedAt})
              </span>
            </div>
          </div>

          {/* 5-Step Traceability Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
              Trazabilidad del Cierre de Manufactura:
            </span>

            <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-muted/5 overflow-hidden text-xs">
              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-theme-muted/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-theme-main">1. Producción Concluida</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">{release.opFolio} · 100%</span>
              </div>

              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-theme-muted/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-theme-main">2. Auditoría Final Conforme</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">{release.qualityReleaseId || 'QA Aprobada'}</span>
              </div>

              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-theme-muted/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-theme-main">3. Lote PT Generado</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">{release.lotNumber}</span>
              </div>

              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-theme-muted/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-theme-main">4. Ubicación en Rack PT</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">{release.location}</span>
              </div>

              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-theme-muted/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">5. Disponible para Embarques</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">Habilitado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-subtle bg-theme-muted/10 flex items-center justify-between gap-2">
          {onPrintLabelDemo && (
            <button
              type="button"
              onClick={() => onPrintLabelDemo(release)}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-theme-muted" />
              <span>Etiqueta PT Demo</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onNavigateToEmbarques && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToEmbarques();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-theme-primary/90 transition-all hover:scale-[1.01]"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Ir a Embarques</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
