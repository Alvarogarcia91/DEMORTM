import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Layers, 
  MapPin, 
  Scan, 
  Tag, 
  PackageCheck, 
  User, 
  ArrowRight, 
  AlertTriangle, 
  AlertOctagon,
  Send,
  Sparkles,
  QrCode,
  Info,
  Printer,
  FileText,
  Eye
} from 'lucide-react';
import { 
  OutboundVerificationOrder, 
  OutboundVerificationItem 
} from '../../../data/mockOutboundVerificationData';
import { 
  OutboundRemision, 
  getOrCreateRemisionForOrder 
} from '../../../data/mockRemisionesData';
import { OutboundVerificationScanStationModal } from './OutboundVerificationScanStationModal';
import { OutboundDifferenceModal } from './OutboundDifferenceModal';
import { OutboundCancelModal } from './OutboundCancelModal';
import { RemisionPreviewModal } from './RemisionPreviewModal';
import { ReceiptStickerModal } from '../Inbound/ReceiptStickerModal';
import { ReceivedUnitRecord } from '../../../data/mockInboundData';

interface OutboundVerificationDetailViewProps {
  order: OutboundVerificationOrder;
  onBack: () => void;
  onUpdateOrder: (updatedOrder: OutboundVerificationOrder) => void;
  onShowToast?: (msg: string) => void;
}

export const OutboundVerificationDetailView: React.FC<OutboundVerificationDetailViewProps> = ({
  order,
  onBack,
  onUpdateOrder,
  onShowToast,
}) => {
  const [isScanStationOpen, setIsScanStationOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRemisionModalOpen, setIsRemisionModalOpen] = useState(false);
  const [selectedStickerItem, setSelectedStickerItem] = useState<ReceivedUnitRecord | null>(null);
  const [showLoadMsg, setShowLoadMsg] = useState(false);

  const validatedCount = order.items.filter((it) => it.isValidated).length;
  const isOrderFullyComplete = order.status === 'Lista para carga' || (validatedCount === order.items.length && order.items.length > 0);

  // Get or create deterministic remision for this order
  const remision = getOrCreateRemisionForOrder(order);

  // Handle confirming verification from scan station
  const handleConfirmVerification = (updatedItems: OutboundVerificationItem[]) => {
    const newValidatedCount = updatedItems.filter((it) => it.isValidated).length;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Update article summaries counts
    const updatedArticleSummaries = order.articleSummaries.map((art) => {
      const validForArt = updatedItems.filter((it) => it.sku === art.sku && it.isValidated).length;
      return {
        ...art,
        validatedUnits: validForArt,
      };
    });

    const isAll = newValidatedCount === updatedItems.length;

    const updatedOrder: OutboundVerificationOrder = {
      ...order,
      items: updatedItems,
      articleSummaries: updatedArticleSummaries,
      validatedUnits: newValidatedCount,
      status: isAll ? 'Lista para carga' : 'En validación',
      completedAt: isAll ? `27 Ago 2026, ${timeStr}` : undefined,
    };

    onUpdateOrder(updatedOrder);
    setIsScanStationOpen(false);

    if (onShowToast) {
      onShowToast(
        isAll
          ? `✓ Verificación ${order.folio} completada: 100% unidades validadas en ${order.assignedLane}. Remisión ${remision.folio} lista.`
          : `✓ Avance guardado: ${newValidatedCount}/${updatedItems.length} unidades validadas.`
      );
    }
  };

  // Handle difference registration
  const handleConfirmDifference = (type: any, notes: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedOrder: OutboundVerificationOrder = {
      ...order,
      status: 'Con diferencia',
      differenceLog: {
        type,
        notes,
        registeredAt: `27 Ago ${timeStr}`,
        registeredBy: order.operatorAssigned,
      },
    };

    onUpdateOrder(updatedOrder);
    setIsDiffModalOpen(false);

    if (onShowToast) {
      onShowToast(`⚠ Discrepancia registrada en orden ${order.folio}: ${type}.`);
    }
  };

  // Handle cancellation
  const handleConfirmCancel = (reason: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedOrder: OutboundVerificationOrder = {
      ...order,
      status: 'Cancelada',
      cancellationLog: {
        reason,
        cancelledAt: `27 Ago ${timeStr}`,
        cancelledBy: order.operatorAssigned,
      },
    };

    onUpdateOrder(updatedOrder);
    setIsCancelModalOpen(false);

    if (onShowToast) {
      onShowToast(`✕ Verificación ${order.folio} cancelada.`);
    }
  };

  const handleRemisionPrinted = (updatedRemision: OutboundRemision) => {
    if (onShowToast) {
      onShowToast(`✓ Remisión ${updatedRemision.folio} impresa.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Quick Actions */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-colors cursor-pointer"
              title="Volver a lista"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-black text-rose-600">
                  {order.folio}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                  order.status === 'Lista para carga'
                    ? 'border-emerald-600 text-emerald-700'
                    : order.status === 'En validación'
                    ? 'border-blue-500 text-blue-700'
                    : order.status === 'Con diferencia'
                    ? 'border-amber-500 text-amber-700'
                    : order.status === 'Cancelada'
                    ? 'border-rose-500 text-rose-700'
                    : 'border-zinc-400 text-zinc-700'
                }`}>
                  {order.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs font-mono">
                  Carril: {order.assignedLane}
                </span>
                {remision && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs">
                    Remisión: {remision.folio}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
                Ref: {order.referenceFolio} &bull; Pick: {order.pickOrderFolio} &rarr; {order.destinationName}
              </h2>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Remisión CTAs */}
            <button
              onClick={() => setIsRemisionModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Vista previa de remisión</span>
            </button>

            {isOrderFullyComplete && (
              <button
                onClick={() => setIsRemisionModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir remisión</span>
              </button>
            )}

            {order.status !== 'Cancelada' && order.status !== 'Lista para carga' && (
              <>
                <button
                  onClick={() => setIsDiffModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-white hover:bg-theme-muted text-amber-700 font-bold text-xs border border-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Diferencia</span>
                </button>

                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-white hover:bg-theme-muted text-rose-600 font-bold text-xs border border-rose-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Cancelar</span>
                </button>

                <button
                  onClick={() => setIsScanStationOpen(true)}
                  className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>{validatedCount === 0 ? 'Iniciar verificación' : 'Continuar verificación'}</span>
                </button>
              </>
            )}

            {order.status === 'Lista para carga' && (
              <button
                onClick={() => setShowLoadMsg(true)}
                className="px-4 py-2 rounded-2xl bg-white text-zinc-900 font-bold text-xs border border-zinc-300 hover:bg-zinc-100 transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Continuar a carga</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
          <div>
            <span className="text-[10px] uppercase font-bold block">Instalación Origen:</span>
            <strong className="text-theme-main font-semibold">{order.warehouseName}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold block">Progreso de Validación:</span>
            <strong className="text-emerald-600 font-mono font-bold">
              {validatedCount} / {order.items.length} piezas ({order.items.length > 0 ? Math.round((validatedCount / order.items.length) * 100) : 0}%)
            </strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold block">Carril de Embarque:</span>
            <strong className="text-emerald-600 font-mono font-bold">{order.assignedLane}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold block">Verificador Asignado:</span>
            <strong className="text-theme-main font-semibold">{order.operatorAssigned}</strong>
          </div>
        </div>
      </div>

      {/* Remisión Document Card Banner */}
      <div className={`p-4 rounded-3xl bg-white border shadow-xs transition-all ${
        isOrderFullyComplete 
          ? 'border-emerald-600' 
          : 'border-theme-subtle'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-white border flex items-center justify-center shrink-0 shadow-2xs ${
              isOrderFullyComplete ? 'border-emerald-600 text-emerald-700' : 'border-zinc-300 text-zinc-600'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-theme-main uppercase">
                  Remisión de Salida ({remision.type})
                </span>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.2 rounded-full bg-white border border-rose-400">
                  {remision.folio}
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                  isOrderFullyComplete ? 'border-emerald-600 text-emerald-700' : 'border-amber-500 text-amber-700'
                }`}>
                  {isOrderFullyComplete ? remision.status : 'Pendiente de remisión'}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted mt-0.5">
                {isOrderFullyComplete ? (
                  <span>Documento oficial de transporte y entrega listo. Ampara <strong>{order.totalUnits} piezas</strong> hacia <strong>{order.destinationName}</strong>.</span>
                ) : (
                  <span className="text-amber-800 dark:text-amber-300 font-medium">
                    La remisión estará disponible cuando la verificación esté completa.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRemisionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-theme-primary" />
              <span>{isOrderFullyComplete ? 'Vista previa' : 'Ver borrador'}</span>
            </button>

            {isOrderFullyComplete && (
              <button
                onClick={() => setIsRemisionModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir remisión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Difference Alert Banner if applicable */}
      {order.status === 'Con diferencia' && order.differenceLog && (
        <div className="p-4 rounded-3xl bg-white border border-amber-500 shadow-2xs space-y-1 text-xs text-zinc-900">
          <div className="flex items-center gap-2 font-bold text-amber-600">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-zinc-900 font-bold">Orden con Discrepancia Registrada ({order.differenceLog.type})</span>
          </div>
          <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
            {order.differenceLog.notes} &bull; Registrado por {order.differenceLog.registeredBy} ({order.differenceLog.registeredAt}).
          </p>
        </div>
      )}

      {/* Load placeholder notification */}
      {showLoadMsg && (
        <div className="p-4 rounded-3xl bg-white border border-blue-500 shadow-2xs flex items-center justify-between text-xs text-zinc-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>La secuenciación de carga será gestionada en el módulo de Embarques & Entregas.</span>
          </div>
          <button onClick={() => setShowLoadMsg(false)} className="cursor-pointer font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Article Summaries Table (Expected vs Validated by SKU) */}
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-theme-subtle">
          <h3 className="text-xs font-black text-theme-main uppercase tracking-wider">
            Resumen Agrupado por Artículo ({order.articleSummaries.length} productos)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-3">Marca & Medida</th>
                <th className="py-3 px-3 text-center">Esperadas</th>
                <th className="py-3 px-3 text-center">Validadas</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle font-sans">
              {order.articleSummaries.map((art) => {
                const isComplete = art.validatedUnits === art.expectedUnits;

                return (
                  <tr key={art.sku} className="hover:bg-theme-muted/30 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-theme-main block">{art.productName}</span>
                      <span className="font-mono text-[10px] text-theme-primary">{art.sku}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-theme-muted">
                      {art.brand} &bull; {art.size}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
                      {art.expectedUnits} u.
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
                      {art.validatedUnits} u.
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                        isComplete
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-amber-500 text-amber-700'
                      }`}>
                        {isComplete ? 'Completo' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expected UIDs Individual Table */}
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
          <h3 className="text-xs font-black text-theme-main uppercase tracking-wider">
            Detalle Individual de UIDs Serializados ({order.items.length} piezas)
          </h3>
          <span className="text-[10px] text-theme-muted font-mono">
            Ubicación en carril: <strong>{order.assignedLane}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">UID / Serie</th>
                <th className="py-3 px-3">Artículo / SKU</th>
                <th className="py-3 px-3">Lote</th>
                <th className="py-3 px-3">Validación</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle font-sans">
              {order.items.map((it) => (
                <tr key={it.id} className="hover:bg-theme-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-theme-main whitespace-nowrap">
                    {it.uid}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-theme-main block">{it.productName}</span>
                    <span className="font-mono text-[10px] text-theme-muted">{it.sku}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                    {it.lotNumber}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {it.isValidated ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-600 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Validada {it.validatedAt ? `(${it.validatedAt})` : ''}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-amber-700 border border-amber-500 shadow-2xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Por escanear</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedStickerItem({
                          uid: it.uid,
                          sku: it.sku,
                          productName: it.productName,
                          brand: it.brand,
                          size: it.size,
                          lotNumber: it.lotNumber,
                          locationCode: order.assignedLane,
                          receivedAt: '27 Ago 2026 12:00',
                          operator: order.operatorAssigned,
                          status: 'Pendiente de acomodo',
                        });
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-theme-muted text-theme-main font-bold text-[11px] border border-theme-subtle transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3 text-rose-600" />
                      <span>Etiqueta UID</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isScanStationOpen && (
        <OutboundVerificationScanStationModal
          order={order}
          onClose={() => setIsScanStationOpen(false)}
          onConfirmVerification={handleConfirmVerification}
          onRegisterDifference={() => {
            setIsScanStationOpen(false);
            setIsDiffModalOpen(true);
          }}
          onShowToast={onShowToast}
        />
      )}

      {isDiffModalOpen && (
        <OutboundDifferenceModal
          order={order}
          onClose={() => setIsDiffModalOpen(false)}
          onConfirmDifference={handleConfirmDifference}
        />
      )}

      {isCancelModalOpen && (
        <OutboundCancelModal
          order={order}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}

      {isRemisionModalOpen && (
        <RemisionPreviewModal
          remision={remision}
          isOrderComplete={isOrderFullyComplete}
          onClose={() => setIsRemisionModalOpen(false)}
          onPrinted={handleRemisionPrinted}
        />
      )}

      {selectedStickerItem && (
        <ReceiptStickerModal
          unit={selectedStickerItem}
          onClose={() => setSelectedStickerItem(null)}
        />
      )}

    </div>
  );
};
