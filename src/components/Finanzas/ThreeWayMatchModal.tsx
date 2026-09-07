import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Scale, FileText, Package, Truck, ArrowRight, Building2, Check, Ban } from 'lucide-react';
import { SupplierInvoice } from '../../data/mockFinanzasData';

interface ThreeWayMatchModalProps {
  invoice: SupplierInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onResolveDiscrepancy?: (invoiceId: string, resolutionType: 'correccion' | 'excepcion', note: string) => void;
}

export const ThreeWayMatchModal: React.FC<ThreeWayMatchModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onResolveDiscrepancy,
}) => {
  if (!isOpen || !invoice) return null;

  const [exceptionNote, setExceptionNote] = useState<string>('');
  const [showExceptionInput, setShowExceptionInput] = useState<boolean>(false);

  const hasDiscrepancy = invoice.matchStatus !== 'conciliada';

  const handleAuthorizeException = () => {
    if (!exceptionNote.trim()) {
      alert('Por favor especifique la justificación para autorizar la excepción.');
      return;
    }
    if (onResolveDiscrepancy) {
      onResolveDiscrepancy(invoice.id, 'excepcion', exceptionNote);
    }
    setShowExceptionInput(false);
    onClose();
  };

  const handleRequestCorrection = () => {
    if (onResolveDiscrepancy) {
      onResolveDiscrepancy(
        invoice.id,
        'correccion',
        'Notificación enviada al proveedor solicitando Nota de Crédito o refacturación por diferencia entre almacén y factura.'
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              hasDiscrepancy
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-600'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
            }`}>
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-theme-main">
                  Conciliación 3-Way Match (OC vs Recepción vs Factura)
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    hasDiscrepancy
                      ? 'bg-rose-50 text-rose-700 border border-rose-300'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  {hasDiscrepancy ? 'Discrepancia Detectada' : '3-Way Match Conciliado'}
                </span>
              </div>
              <p className="text-xs text-theme-muted">
                Proveedor: <strong className="text-theme-main">{invoice.proveedorNombre}</strong> · Factura: <span className="font-mono">{invoice.folioProveedor}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Discrepancy Alert Banner */}
          {hasDiscrepancy ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-rose-900">
                    Factura Bloqueada para Pago por Políticas de Control Interno RTM
                  </h4>
                  <p className="text-[11px] text-rose-800 leading-relaxed mt-1">
                    {invoice.motivoDiscrepancia ||
                      'Se detectó una discrepancia entre lo recibido físicamente en el almacén y lo cobrado en el CFDI del proveedor. No se autorizan pagos sobre mercancía no ingresada a planta.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-[11px]">
                <strong>Conciliación Perfecta:</strong> Las cantidades y precios pactados en la Orden de Compra coinciden exactamente con la remisión física de entrada y el CFDI del proveedor. Esta factura está autorizada para pago.
              </p>
            </div>
          )}

          {/* Three Document Traceability Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Orden de Compra */}
            <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-muted/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-theme-primary font-bold text-[11px] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>1. Orden de Compra</span>
              </div>
              <p className="font-mono font-bold text-xs text-theme-main">{invoice.ordenCompraFolio}</p>
              <p className="text-theme-muted text-[11px]">Emitida por Compras Industriales RTM</p>
              <p className="text-theme-muted text-[11px]">Condición: {invoice.diasCredito} días de crédito</p>
            </div>

            {/* 2. Recepción de Almacén */}
            <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-muted/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>2. Entrada de Almacén</span>
              </div>
              <p className="font-mono font-bold text-xs text-theme-main">{invoice.recepcionFolio}</p>
              <p className="text-theme-muted text-[11px]">Verificado en Mesa de Recepción</p>
              <p className="text-theme-muted text-[11px]">Fecha Ingreso: {invoice.fechaRecepcion}</p>
            </div>

            {/* 3. Factura Proveedor */}
            <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-muted/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" />
                <span>3. Factura CFDI Proveedor</span>
              </div>
              <p className="font-mono font-bold text-xs text-theme-main">{invoice.folioProveedor}</p>
              <p className="text-theme-muted text-[11px] truncate" title={invoice.uuidSat}>
                UUID: {invoice.uuidSat.substring(0, 16)}...
              </p>
              <p className="text-theme-muted text-[11px]">Emisión: {invoice.fechaEmision}</p>
            </div>
          </div>

          {/* 3-Way Match Item Level Comparison Table */}
          <div className="border border-theme-subtle rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-theme-muted/50 border-b border-theme-subtle font-bold text-[11px] text-theme-main uppercase tracking-wider flex items-center justify-between">
              <span>Comparativa Línea por Línea (Pactado vs Recibido vs Facturado)</span>
              <span className="text-[10px] text-theme-muted font-normal">Tolerancia RTM: 0% en precio / 0% en piezas no recibidas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-theme-subtle bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted">
                    <th className="px-3 py-2.5">SKU & Descripción</th>
                    <th className="px-3 py-2.5 text-center bg-zinc-50 border-r border-theme-subtle">
                      1. OC (Ordenado)
                    </th>
                    <th className="px-3 py-2.5 text-center bg-blue-50/50 border-r border-theme-subtle">
                      2. Almacén (Recibido)
                    </th>
                    <th className="px-3 py-2.5 text-center bg-emerald-50/40 border-r border-theme-subtle">
                      3. Factura (Cobrado)
                    </th>
                    <th className="px-3 py-2.5 text-center">Resultado Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {invoice.matchItems.map((item) => {
                    const isDiff = item.estado !== 'ok';
                    return (
                      <tr key={item.id} className={`hover:bg-theme-muted/20 transition-colors ${isDiff ? 'bg-rose-50/40' : ''}`}>
                        {/* SKU */}
                        <td className="px-3 py-3">
                          <div className="font-mono font-bold text-theme-main text-xs">{item.sku}</div>
                          <div className="text-theme-muted text-[11px] max-w-xs">{item.descripcion}</div>
                        </td>

                        {/* 1. OC */}
                        <td className="px-3 py-3 text-center border-r border-theme-subtle">
                          <div className="font-mono font-semibold text-theme-main">
                            {item.cantOrdenada} {item.unidad}
                          </div>
                          <div className="text-[10px] text-theme-muted font-mono">
                            ${item.precioOrdenado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u
                          </div>
                        </td>

                        {/* 2. Almacén */}
                        <td className="px-3 py-3 text-center border-r border-theme-subtle bg-blue-50/20">
                          <div className={`font-mono font-bold ${item.cantRecibida < item.cantFacturada ? 'text-rose-600' : 'text-theme-main'}`}>
                            {item.cantRecibida} {item.unidad}
                          </div>
                          <div className="text-[10px] text-blue-700 font-mono">
                            {item.recepcionFolio}
                          </div>
                        </td>

                        {/* 3. Factura */}
                        <td className="px-3 py-3 text-center border-r border-theme-subtle bg-emerald-50/20">
                          <div className={`font-mono font-bold ${item.cantFacturada > item.cantRecibida ? 'text-rose-700 font-black' : 'text-theme-main'}`}>
                            {item.cantFacturada} {item.unidad}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-mono">
                            ${item.precioFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3 text-center">
                          {item.estado === 'ok' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                              <Check className="w-3 h-3" />
                              <span>Coincide</span>
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300">
                                <AlertTriangle className="w-3 h-3" />
                                <span>+{item.variacionCantidad} {item.unidad} excedente</span>
                              </span>
                              <p className="text-[10px] text-rose-700 font-medium">Cobro sin recepción física</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="p-4 bg-theme-muted/30 border-t border-theme-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-theme-muted text-[11px]">
                <span>Moneda: <strong>{invoice.moneda}</strong> · IVA Trasladado: <strong>${invoice.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-theme-muted text-xs mr-2">Importe Total Facturado:</span>
                <span className="font-mono font-black text-sm text-theme-main">
                  ${invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
            </div>
          </div>

          {/* Exception Resolution UI (if discrepancy exists) */}
          {hasDiscrepancy && (
            <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-theme-main">
                Opciones de Gestión y Resolución de Discrepancia
              </h4>

              {invoice.resolucionExcepcion ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                  <strong>Excepción Autorizada:</strong> {invoice.resolucionExcepcion.motivo} (Por: {invoice.resolucionExcepcion.autorizadoPor} el {invoice.resolucionExcepcion.fecha})
                </div>
              ) : showExceptionInput ? (
                <div className="space-y-2 p-3 rounded-lg bg-theme-muted/30 border border-theme-subtle">
                  <label className="block font-bold text-theme-main text-[11px]">
                    Justificación Gerencial para Autorizar Pago con Excepción:
                  </label>
                  <textarea
                    value={exceptionNote}
                    onChange={(e) => setExceptionNote(e.target.value)}
                    rows={2}
                    placeholder="Ej: Autorizado por Gerencia de Compras debido a entrega urgente validada verbalmente por almacén..."
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowExceptionInput(false)}
                      className="px-3 py-1.5 rounded-lg border border-theme-subtle hover:bg-theme-muted text-xs text-theme-muted cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAuthorizeException}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Confirmar Desbloqueo por Excepción
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleRequestCorrection}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Solicitar Nota de Crédito / Corrección al Proveedor</span>
                  </button>

                  <button
                    onClick={() => setShowExceptionInput(true)}
                    className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Autorizar Pago como Excepción Gerencial</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle flex items-center justify-end bg-theme-muted/40">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Conciliación
          </button>
        </div>
      </div>
    </div>
  );
};
