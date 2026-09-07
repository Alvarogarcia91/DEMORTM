import React, { useState } from 'react';
import { X, DollarSign, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupplierInvoice, SupplierPaymentRecord } from '../../data/mockFinanzasData';

interface RegistrarPagoProveedorModalProps {
  invoice: SupplierInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onRegisterPayment: (invoiceId: string, payment: SupplierPaymentRecord) => void;
}

export const RegistrarPagoProveedorModal: React.FC<RegistrarPagoProveedorModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onRegisterPayment,
}) => {
  if (!isOpen || !invoice) return null;

  const [monto, setMonto] = useState<string>(invoice.saldoPendiente.toString());
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cuentaOrigen, setCuentaOrigen] = useState<string>('BBVA MXN Cta Cheques 8821');
  const [metodoPago, setMetodoPago] = useState<string>('SPEI Transferencia');
  const [referenciaBancaria, setReferenciaBancaria] = useState<string>('');
  const [autorizadoPor, setAutorizadoPor] = useState<string>('Lic. Gerardo Morales (Dir. Finanzas)');
  const [notas, setNotas] = useState<string>('');
  const [error, setError] = useState<string>('');

  const numMonto = parseFloat(monto) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numMonto <= 0) {
      setError('El importe a pagar debe ser mayor a $0.00');
      return;
    }
    if (numMonto > invoice.saldoPendiente + 0.01) {
      setError(`El importe excede el saldo pendiente ($${invoice.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`);
      return;
    }
    if (!referenciaBancaria.trim()) {
      setError('Por favor indica la referencia bancaria o clave de rastreo SPEI');
      return;
    }

    const payment: SupplierPaymentRecord = {
      id: `pago-prov-${Date.now()}`,
      fecha: fecha,
      monto: numMonto,
      cuentaOrigen: cuentaOrigen,
      metodoPago: metodoPago,
      referenciaBancaria: referenciaBancaria.trim(),
      autorizadoPor: autorizadoPor,
      notas: notas.trim() || undefined,
    };

    onRegisterPayment(invoice.id, payment);
    onClose();
  };

  const nuevoSaldo = Math.max(0, invoice.saldoPendiente - numMonto);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-main">
                Registrar Pago a Proveedor
              </h3>
              <p className="text-xs text-theme-muted font-mono">
                Factura: {invoice.folioProveedor} · {invoice.proveedorNombre}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Summary Card */}
          <div className="p-4 rounded-xl border border-theme-subtle bg-theme-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Proveedor:</span>
              <strong className="text-theme-main text-right">{invoice.proveedorNombre}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Orden de Compra:</span>
              <span className="font-mono text-theme-main">{invoice.ordenCompraFolio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Monto Total Facturado:</span>
              <span className="font-mono font-medium">${invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-theme-subtle">
              <span className="font-bold text-theme-main">Saldo Pendiente a Liquidar:</span>
              <span className="font-mono font-black text-sm text-theme-primary">
                ${invoice.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
              Importe a Pagar (MXN) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted font-bold text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={invoice.saldoPendiente}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-mono text-base font-bold focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setMonto(invoice.saldoPendiente.toString())}
                className="text-theme-primary hover:underline font-semibold cursor-pointer"
              >
                Liquidar Saldo Completo
              </button>
              <span className="text-theme-muted">
                Remanente: <strong className="font-mono text-theme-main">${nuevoSaldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>
          </div>

          {/* Date & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Fecha Valor de Pago *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Cuenta de Origen RTM *
              </label>
              <select
                value={cuentaOrigen}
                onChange={(e) => setCuentaOrigen(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
              >
                <option value="BBVA MXN Cta Cheques 8821">BBVA · Cta 8821 (Proveedores)</option>
                <option value="Banamex Cta 4819">Citibanamex · Cta 4819 (Operativa)</option>
                <option value="Santander Cta 1102">Santander · Cta 1102 (General)</option>
              </select>
            </div>
          </div>

          {/* Reference & Authorized By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Referencia SPEI / Rastreo *
              </label>
              <input
                type="text"
                value={referenciaBancaria}
                onChange={(e) => setReferenciaBancaria(e.target.value)}
                placeholder="Ej: SPEI-BPA-00918"
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Autorizado Por *
              </label>
              <input
                type="text"
                value={autorizadoPor}
                onChange={(e) => setAutorizadoPor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
              Notas del Pago (Opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              placeholder="Detalles sobre retenciones o instrucciones de tesorería..."
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-theme-subtle flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aplicar Pago a Proveedor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
