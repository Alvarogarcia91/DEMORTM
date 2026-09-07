import React from 'react';
import { X, Building2, Calendar, FileText, Truck, Scale, DollarSign, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SupplierInvoice } from '../../data/mockFinanzasData';

interface CxpDetailModalProps {
  invoice: SupplierInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenThreeWayMatch?: (invoice: SupplierInvoice) => void;
  onOpenRegisterPayment?: (invoice: SupplierInvoice) => void;
}

export const CxpDetailModal: React.FC<CxpDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onOpenThreeWayMatch,
  onOpenRegisterPayment,
}) => {
  if (!isOpen || !invoice) return null;

  const isBlocked = invoice.estadoPago === 'bloqueada';
  const isPaid = invoice.estadoPago === 'pagada';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-theme-main">
                  Ficha de Factura por Pagar (CxP)
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : isBlocked
                      ? 'bg-rose-50 text-rose-700 border border-rose-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  {isPaid ? 'Liquidada' : isBlocked ? 'Bloqueada por Match' : 'Programada para Pago'}
                </span>
              </div>
              <p className="text-xs text-theme-muted">
                Folio: <strong className="text-theme-main">{invoice.folioProveedor}</strong> · Proveedor: {invoice.proveedorNombre}
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
          {/* Discrepancy warning if blocked */}
          {isBlocked && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs">Bloqueo Preventivo Activo</strong>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  {invoice.motivoDiscrepancia || 'Discrepancia detectada en la conciliación con almacén. No se puede emitir pago.'}
                </p>
              </div>
            </div>
          )}

          {/* Financial summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-muted/20">
              <span className="text-theme-muted font-bold text-[10px] uppercase tracking-wider block">Importe Facturado</span>
              <span className="font-mono font-bold text-base text-theme-main mt-1 block">
                ${invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-theme-muted">IVA: ${invoice.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-theme-subtle bg-emerald-50/50">
              <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider block">Pagado Acumulado</span>
              <span className="font-mono font-bold text-base text-emerald-700 mt-1 block">
                ${invoice.totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-600">Dispersado vía SPEI</span>
            </div>

            <div className={`p-3.5 rounded-xl border ${invoice.saldoPendiente > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-zinc-50 border-zinc-200'}`}>
              <span className="text-theme-muted font-bold text-[10px] uppercase tracking-wider block">Saldo Pendiente</span>
              <span className="font-mono font-black text-base text-theme-main mt-1 block">
                ${invoice.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-theme-muted">Vence: {invoice.fechaVencimiento}</span>
            </div>
          </div>

          {/* Document traceability */}
          <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-theme-main flex items-center gap-2">
              <Scale className="w-4 h-4 text-theme-primary" />
              <span>Trazabilidad Operativa y Conciliación</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-theme-muted block">Orden de Compra:</span>
                <strong className="text-theme-main font-mono">{invoice.ordenCompraFolio}</strong>
              </div>
              <div>
                <span className="text-theme-muted block">Recepción de Almacén:</span>
                <strong className="text-theme-main font-mono">{invoice.recepcionFolio}</strong>
              </div>
              <div>
                <span className="text-theme-muted block">UUID SAT Proveedor:</span>
                <span className="text-blue-700 font-mono text-[10px] truncate block" title={invoice.uuidSat}>
                  {invoice.uuidSat}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-theme-main mb-2">
              Historial de Pagos y Dispersiones Bancarias
            </h4>
            {invoice.historialPagos.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-theme-subtle text-center text-theme-muted">
                Aún no se han efectuado pagos para esta factura.
              </div>
            ) : (
              <div className="border border-theme-subtle rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase">
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Cuenta Origen / Método</th>
                      <th className="px-3 py-2">Rastreo SPEI</th>
                      <th className="px-3 py-2">Autorizado Por</th>
                      <th className="px-3 py-2 text-right">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {invoice.historialPagos.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 font-medium text-theme-main">{p.fecha}</td>
                        <td className="px-3 py-2">
                          <div className="font-semibold text-theme-main">{p.cuentaOrigen}</div>
                          <div className="text-[10px] text-theme-muted">{p.metodoPago}</div>
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-theme-main">{p.referenciaBancaria}</td>
                        <td className="px-3 py-2 text-theme-muted text-[11px]">{p.autorizadoPor}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-theme-primary">
                          ${p.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-muted/40">
          {onOpenThreeWayMatch && (
            <button
              onClick={() => {
                onClose();
                onOpenThreeWayMatch(invoice);
              }}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-bold text-theme-main flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-theme-primary" />
              <span>Ver Conciliación 3-Way Match</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            {!isPaid && !isBlocked && onOpenRegisterPayment && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterPayment(invoice);
                }}
                className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Registrar Pago</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
