import React, { useState } from 'react';
import { X, DollarSign, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Building2, Calendar } from 'lucide-react';
import { AccountReceivable, PaymentRecord } from '../../data/mockFinanzasData';

interface RegistrarPagoClienteModalProps {
  cxc: AccountReceivable | null;
  isOpen: boolean;
  onClose: () => void;
  onRegisterPayment: (cxcId: string, payment: PaymentRecord) => void;
}

export const RegistrarPagoClienteModal: React.FC<RegistrarPagoClienteModalProps> = ({
  cxc,
  isOpen,
  onClose,
  onRegisterPayment,
}) => {
  if (!isOpen || !cxc) return null;

  const [monto, setMonto] = useState<string>(cxc.saldoPendiente.toString());
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formaPago, setFormaPago] = useState<string>('Transferencia SPEI (03)');
  const [bancoDestino, setBancoDestino] = useState<string>('BBVA Bancomer Cta 8821');
  const [referencia, setReferencia] = useState<string>('');
  const [generarRep, setGenerarRep] = useState<boolean>(cxc.metodoPago === 'PPD');
  const [notas, setNotas] = useState<string>('');
  const [error, setError] = useState<string>('');

  const numMonto = parseFloat(monto) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numMonto <= 0) {
      setError('El monto a abonar debe ser mayor a $0.00');
      return;
    }
    if (numMonto > cxc.saldoPendiente + 0.01) {
      setError(`El monto no puede exceder el saldo pendiente ($${cxc.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`);
      return;
    }
    if (!referencia.trim()) {
      setError('Por favor captura la referencia bancaria o clave de rastreo SPEI');
      return;
    }

    const repFolio = generarRep
      ? `REP-RTM-2026-00${Math.floor(10 + Math.random() * 89)}`
      : undefined;

    const payment: PaymentRecord = {
      id: `pago-${Date.now()}`,
      fecha: fecha,
      monto: numMonto,
      formaPago: formaPago,
      referencia: referencia.trim(),
      bancoDestino: bancoDestino,
      comprobanteFolio: repFolio,
      registradoPor: 'L. Mendoza (Crédito y Cobranza)',
      notas: notas.trim() || undefined,
    };

    onRegisterPayment(cxc.id, payment);
    onClose();
  };

  const nuevoSaldo = Math.max(0, cxc.saldoPendiente - numMonto);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-main">
                Registrar Cobro / Abono de Cliente
              </h3>
              <p className="text-xs text-theme-muted font-mono">
                Factura: {cxc.facturaFolio}
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
              <span className="text-theme-muted">Cliente:</span>
              <strong className="text-theme-main text-right">{cxc.clienteNombre}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">RFC:</span>
              <span className="font-mono text-theme-main">{cxc.clienteRfc}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Monto Original Factura:</span>
              <span className="font-mono font-medium">${cxc.montoOriginal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-theme-subtle">
              <span className="font-bold text-theme-main">Saldo Pendiente Actual:</span>
              <span className="font-mono font-black text-sm text-rose-700">
                ${cxc.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
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
              Importe a Abonar (MXN) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted font-bold text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={cxc.saldoPendiente}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-mono text-base font-bold focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setMonto(cxc.saldoPendiente.toString())}
                className="text-theme-primary hover:underline font-semibold cursor-pointer"
              >
                Liquidar Saldo Completo
              </button>
              <span className="text-theme-muted">
                Nuevo saldo: <strong className="font-mono text-theme-main">${nuevoSaldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>
          </div>

          {/* Date and Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Fecha de Pago *
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
                Forma de Pago
              </label>
              <select
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
              >
                <option value="Transferencia SPEI (03)">03 - Transferencia SPEI</option>
                <option value="Cheque nominativo (02)">02 - Cheque nominativo</option>
                <option value="Efectivo (01)">01 - Efectivo</option>
                <option value="Tarjeta de crédito (04)">04 - Tarjeta de crédito</option>
              </select>
            </div>
          </div>

          {/* Bank Account and Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Cuenta Bancaria RTM Destino
              </label>
              <select
                value={bancoDestino}
                onChange={(e) => setBancoDestino(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
              >
                <option value="BBVA Bancomer Cta 8821">BBVA Bancomer · Cta 8821 (Concentradora)</option>
                <option value="Banamex Cta 4819">Citibanamex · Cta 4819 (Operativa)</option>
                <option value="Santander Cta 1102">Santander · Cta 1102 (Nómina/Pagos)</option>
              </select>
            </div>

            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Referencia / Rastreo SPEI *
              </label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder="Ej: SPEI-899214 o Cheque 402"
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>
          </div>

          {/* SAT REP Option */}
          <div className="p-3 rounded-xl border border-theme-subtle bg-theme-muted/10 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="generarRepCheck"
              checked={generarRep}
              onChange={(e) => setGenerarRep(e.target.checked)}
              className="mt-0.5 rounded border-theme-subtle text-theme-primary focus:ring-theme-primary/30"
            />
            <label htmlFor="generarRepCheck" className="text-[11px] text-theme-main cursor-pointer">
              <strong className="block">Emitir Recibo Electrónico de Pago (REP - CFDI de Pago Demo)</strong>
              <span className="text-theme-muted text-[10px]">
                Requerido por el SAT para facturas emitidas bajo método PPD al momento de recibir cobros posteriores.
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
              Notas de Cobranza (Opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              placeholder="Detalle o acuerdo con el cliente respecto a este abono..."
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Aplicar Pago</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
