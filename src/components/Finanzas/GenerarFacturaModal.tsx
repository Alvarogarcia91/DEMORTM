import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, ShieldAlert, Sparkles, Building2, Calendar, DollarSign, Truck, AlertCircle } from 'lucide-react';
import { EligibleRemision, SalesInvoice, PaymentMethodSat, PaymentFormSat, CfdiUsageSat } from '../../data/mockFinanzasData';

interface GenerarFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleRemisiones: EligibleRemision[];
  onGenerateInvoice: (invoice: SalesInvoice, autoStamp: boolean) => void;
}

export const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({
  isOpen,
  onClose,
  eligibleRemisiones,
  onGenerateInvoice,
}) => {
  const [selectedRemisionId, setSelectedRemisionId] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<PaymentMethodSat>('PPD');
  const [formaPago, setFormaPago] = useState<PaymentFormSat>('99');
  const [usoCfdi, setUsoCfdi] = useState<CfdiUsageSat>('G01');
  const [notas, setNotas] = useState<string>('');
  const [isStamping, setIsStamping] = useState<boolean>(false);

  useEffect(() => {
    if (eligibleRemisiones.length > 0 && !selectedRemisionId) {
      setSelectedRemisionId(eligibleRemisiones[0].id);
      setMetodoPago(eligibleRemisiones[0].metodoPagoDefecto);
      setFormaPago(eligibleRemisiones[0].formaPagoDefecto);
      setUsoCfdi(eligibleRemisiones[0].usoCfdiDefecto);
    }
  }, [eligibleRemisiones, selectedRemisionId]);

  const selectedRemision = eligibleRemisiones.find((r) => r.id === selectedRemisionId);

  const handleRemisionChange = (id: string) => {
    setSelectedRemisionId(id);
    const rem = eligibleRemisiones.find((r) => r.id === id);
    if (rem) {
      setMetodoPago(rem.metodoPagoDefecto);
      setFormaPago(rem.formaPagoDefecto);
      setUsoCfdi(rem.usoCfdiDefecto);
    }
  };

  const handleGenerate = (autoStamp: boolean) => {
    if (!selectedRemision) return;

    if (autoStamp) {
      setIsStamping(true);
      setTimeout(() => {
        finishCreation(true);
        setIsStamping(false);
      }, 1200);
    } else {
      finishCreation(false);
    }
  };

  const finishCreation = (autoStamp: boolean) => {
    if (!selectedRemision) return;

    const folioNum = Math.floor(52 + Math.random() * 40);
    const folioStr = `FAC-RTM-2026-00${folioNum}`;
    const uuidStr = autoStamp
      ? `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-4C10-90D1-${Math.random().toString(36).substring(2, 14).toUpperCase()}`
      : undefined;

    const now = new Date().toISOString();

    const newInvoice: SalesInvoice = {
      id: `fac-${Date.now()}`,
      folio: folioStr,
      uuidSat: uuidStr,
      fechaEmision: now,
      fechaTimbrado: autoStamp ? now : undefined,
      clienteId: selectedRemision.clienteId,
      clienteNombre: selectedRemision.clienteNombre,
      clienteRfc: selectedRemision.clienteRfc,
      clienteRegimen: '601 - General de Ley Personas Morales',
      clienteCp: '54030',
      remisionId: selectedRemision.id,
      remisionFolio: selectedRemision.folio,
      pedidoFolio: selectedRemision.pedidoFolio,
      status: autoStamp ? 'timbrada' : 'borrador',
      metodoPago: metodoPago,
      formaPago: formaPago,
      usoCfdi: usoCfdi,
      moneda: 'MXN',
      subtotal: selectedRemision.subtotal,
      iva: selectedRemision.iva,
      total: selectedRemision.total,
      saldoPendiente: selectedRemision.total,
      estadoPago: 'pendiente',
      items: [...selectedRemision.items],
      notas: notas || `Facturado con base en remisión de entrega ${selectedRemision.folio}`
    };

    onGenerateInvoice(newInvoice, autoStamp);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-main">
                Generar Factura de Venta desde Remisión
              </h3>
              <p className="text-xs text-theme-muted">
                Conversión de remisión de entrega validada a Comprobante Fiscal CFDI 4.0
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Remisión Selector */}
          <div>
            <label className="block text-xs font-bold text-theme-main uppercase tracking-wider mb-2">
              1. Seleccionar Remisión de Entrega Entregada
            </label>
            {eligibleRemisiones.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-theme-subtle text-center text-theme-muted">
                No hay remisiones pendientes de facturación en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eligibleRemisiones.map((rem) => {
                  const isSel = rem.id === selectedRemisionId;
                  return (
                    <div
                      key={rem.id}
                      onClick={() => handleRemisionChange(rem.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'border-theme-primary bg-theme-primary/5 shadow-xs ring-2 ring-theme-primary/20'
                          : 'border-theme-subtle hover:border-theme-subtle-hover bg-theme-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-xs text-theme-main">{rem.folio}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Entregada
                        </span>
                      </div>
                      <p className="font-semibold text-theme-main text-xs truncate">{rem.clienteNombre}</p>
                      <p className="text-[11px] text-theme-muted">Pedido: {rem.pedidoFolio} · Entrega: {rem.fechaEntrega}</p>
                      <div className="mt-2 pt-2 border-t border-theme-subtle flex justify-between items-center">
                        <span className="text-theme-muted text-[11px]">Total Remisión:</span>
                        <span className="font-mono font-bold text-theme-main text-xs">
                          ${rem.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedRemision && (
            <>
              {/* Client and Fiscal Details */}
              <div className="p-4 rounded-xl border border-theme-subtle bg-theme-muted/30 space-y-3">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-theme-main flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-theme-primary" />
                    Datos Fiscales del Cliente Receptor
                  </span>
                  <span className="text-theme-muted text-[11px] font-mono">ID: {selectedRemision.clienteId}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-theme-muted block">Razón Social:</span>
                    <strong className="text-theme-main">{selectedRemision.clienteNombre}</strong>
                  </div>
                  <div>
                    <span className="text-theme-muted block">RFC Cliente:</span>
                    <strong className="text-theme-main font-mono">{selectedRemision.clienteRfc}</strong>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Lugar / Sello de Entrega Almacén:</span>
                    <span className="text-theme-main">{selectedRemision.recibidoPor}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Crédito Comercial:</span>
                    <span className="text-theme-main font-semibold">{selectedRemision.diasCredito} días de crédito</span>
                  </div>
                </div>
              </div>

              {/* CFDI 4.0 Configuration */}
              <div>
                <label className="block text-xs font-bold text-theme-main uppercase tracking-wider mb-2">
                  2. Parámetros Fiscales CFDI 4.0
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-theme-muted text-[11px] mb-1">Método de Pago:</label>
                    <select
                      value={metodoPago}
                      onChange={(e) => {
                        const val = e.target.value as PaymentMethodSat;
                        setMetodoPago(val);
                        if (val === 'PPD') setFormaPago('99');
                        if (val === 'PUE') setFormaPago('03');
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-semibold text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                    >
                      <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                      <option value="PUE">PUE - Pago en una sola exhibición</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-theme-muted text-[11px] mb-1">Forma de Pago:</label>
                    <select
                      value={formaPago}
                      onChange={(e) => setFormaPago(e.target.value as PaymentFormSat)}
                      className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-semibold text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                    >
                      <option value="99">99 - Por definir (Obligatorio en PPD)</option>
                      <option value="03">03 - Transferencia electrónica SPEI</option>
                      <option value="01">01 - Efectivo</option>
                      <option value="04">04 - Tarjeta de crédito</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-theme-muted text-[11px] mb-1">Uso de CFDI:</label>
                    <select
                      value={usoCfdi}
                      onChange={(e) => setUsoCfdi(e.target.value as CfdiUsageSat)}
                      className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-semibold text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                    >
                      <option value="G01">G01 - Adquisición de mercancías</option>
                      <option value="G03">G03 - Gastos en general</option>
                      <option value="I08">I08 - Otra maquinaria y equipo</option>
                      <option value="CP01">CP01 - Pagos</option>
                      <option value="S01">S01 - Sin efectos fiscales</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div>
                <label className="block text-xs font-bold text-theme-main uppercase tracking-wider mb-2">
                  3. Conceptos Incluidos en la Remisión
                </label>
                <div className="border border-theme-subtle rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase">
                      <tr>
                        <th className="px-3 py-2">Clave SAT</th>
                        <th className="px-3 py-2">Descripción</th>
                        <th className="px-3 py-2 text-right">Cant.</th>
                        <th className="px-3 py-2 text-right">Precio</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-subtle">
                      {selectedRemision.items.map((it) => (
                        <tr key={it.id}>
                          <td className="px-3 py-2 font-mono text-[11px] text-theme-muted">{it.satKey}</td>
                          <td className="px-3 py-2 font-medium text-theme-main">{it.description}</td>
                          <td className="px-3 py-2 text-right font-mono">{it.quantity.toLocaleString('es-MX')} {it.unit}</td>
                          <td className="px-3 py-2 text-right font-mono">${it.unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-theme-main">${it.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-theme-muted/30 border-t border-theme-subtle flex justify-end gap-6 text-xs">
                    <span className="text-theme-muted">Subtotal: <strong>${selectedRemision.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></span>
                    <span className="text-theme-muted">IVA (16%): <strong>${selectedRemision.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></span>
                    <span className="font-bold text-theme-main">Total CFDI: <strong className="text-emerald-700 font-mono text-sm">${selectedRemision.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong></span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-theme-muted text-[11px] mb-1">Observaciones / Leyenda comercial:</label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Pedido entregado bajo orden de compra cliente MP-2026..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-muted/40">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleGenerate(false)}
              disabled={!selectedRemision || isStamping}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-bold text-theme-main transition-colors cursor-pointer disabled:opacity-50"
            >
              Guardar como Borrador
            </button>

            <button
              onClick={() => handleGenerate(true)}
              disabled={!selectedRemision || isStamping}
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isStamping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Timbrando con PAC...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Timbrar CFDI 4.0 (Simulación)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
