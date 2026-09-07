import React from 'react';
import {
  CheckCircle2,
  X,
  Printer,
  Truck,
  FileText,
  Sparkles,
  ArrowRight,
  Boxes,
  MapPin,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { FinishedGoodsRelease } from '../../data/mockFinishedGoodsData';
import { ModalPortal } from '../common/ModalPortal';

interface Props {
  release: FinishedGoodsRelease;
  onClose: () => void;
  onOpenPtSheet: (release: FinishedGoodsRelease) => void;
  onPrintLabelDemo: (release: FinishedGoodsRelease) => void;
  onNavigateToEmbarques: () => void;
}

export const ProductoTerminadoLiberadoModal: React.FC<Props> = ({
  release,
  onClose,
  onOpenPtSheet,
  onPrintLabelDemo,
  onNavigateToEmbarques,
}) => {
  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-theme-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Top Header Banner Verde Industrial */}
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1.5 rounded-xl hover:bg-emerald-500/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              LIBERACIÓN FINAL DE CALIDAD
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            ✓ PRODUCTO TERMINADO LIBERADO
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {release.opFolio} · {release.client} · {release.partNumber} ({release.revision})
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Lote PT */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
                Lote de Producto Terminado
              </span>
              <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                {release.lotNumber}
              </div>
              <span className="text-[10px] text-theme-muted">
                Pedido comercial: {release.pedido}
              </span>
            </div>

            {/* Cantidad Buena */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted">
                Cantidad Buena Conforme
              </span>
              <div className="text-base font-black font-mono text-theme-main">
                {release.finishedQty.toLocaleString()} pzas
              </div>
              <span className="text-[10px] text-theme-muted">
                {release.packageCount ? `${release.packageCount} bultos / cajas` : 'Inspección AQL 0.65'}
              </span>
            </div>

            {/* Almacén & Ubicación */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-theme-muted">
                <MapPin className="w-3 h-3 text-theme-muted" />
                <span>Ubicación en Almacén</span>
              </div>
              <div className="text-sm font-black font-mono text-theme-main">
                {release.location}
              </div>
              <span className="text-[10px] text-theme-muted">
                {release.warehouseName}
              </span>
            </div>

            {/* Auditor & Hora */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-theme-muted">
                <Clock className="w-3 h-3 text-theme-muted" />
                <span>Liberado por</span>
              </div>
              <div className="text-sm font-bold text-theme-main truncate">
                {release.releasedBy}
              </div>
              <span className="text-[10px] text-theme-muted">
                {release.releasedAt}
              </span>
            </div>
          </div>

          {/* Status Pill */}
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 px-4 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Estado: DISPONIBLE PARA EMBARQUES</span>
            </div>
            <span className="text-[11px] font-mono font-black">
              Listo en Andén
            </span>
          </div>

          {/* Sugerencia del Sistema (Morada SMART) */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3.5 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                ✦ Sugerencia del sistema
              </span>
              <p className="text-xs text-theme-muted leading-relaxed">
                El pedido <b>{release.pedido}</b> tiene ventana de entrega programada hoy. El lote <b>{release.lotNumber}</b> ya se encuentra registrado y listo para asignar a orden de salida.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-theme-subtle bg-theme-muted/10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPtSheet(release);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-theme-muted" />
              <span>Ver Ficha Lote PT</span>
            </button>

            <button
              type="button"
              onClick={() => onPrintLabelDemo(release)}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-theme-muted" />
              <span>Imprimir Etiqueta PT · Demo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToEmbarques();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-black text-white shadow-md hover:bg-theme-primary/90 transition-all hover:scale-[1.02]"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Ir a Embarques</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
