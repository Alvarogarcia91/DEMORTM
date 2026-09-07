import React from 'react';
import { X, Calendar, User, Phone, Mail, DollarSign, CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { AccountReceivable } from '../../data/mockFinanzasData';

interface CxcDetailModalProps {
  cxc: AccountReceivable | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterPayment?: (cxc: AccountReceivable) => void;
  onNavigateToInvoice?: (invoiceFolio: string) => void;
}

export const CxcDetailModal: React.FC<CxcDetailModalProps> = ({
  cxc,
  isOpen,
  onClose,
  onOpenRegisterPayment,
  onNavigateToInvoice,
}) => {
  if (!isOpen || !cxc) return null;

  const isPagada = cxc.status === 'pagada';
  const isVencida = cxc.status === 'vencida';

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
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-theme-main">
                  Detalle de Cuenta por Cobrar
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isPagada
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : isVencida
                      ? 'bg-rose-50 text-rose-700 border border-rose-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  {isPagada ? 'Liquidada' : isVencida ? `Vencida (${cxc.diasMora} días)` : `Por Vencer (${cxc.diasParaVencer} días)`}
                </span>
              </div>
              <p className="text-xs text-theme-muted font-mono">
                Factura Fiscal: <strong>{cxc.facturaFolio}</strong>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Main Financial Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-theme-subtle bg-theme-muted/20">
              <span className="text-theme-muted font-bold text-[10px] uppercase tracking-wider block">Monto Original</span>
              <span className="font-mono font-bold text-base text-theme-main mt-1 block">
                ${cxc.montoOriginal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-theme-muted">CFDI con IVA incluido</span>
            </div>

            <div className="p-4 rounded-xl border border-theme-subtle bg-emerald-50/50">
              <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider block">Total Cobrado</span>
              <span className="font-mono font-bold text-base text-emerald-700 mt-1 block">
                ${cxc.totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-600">
                {((cxc.totalPagado / cxc.montoOriginal) * 100).toFixed(1)}% recuperado
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${cxc.saldoPendiente > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-zinc-50 border-zinc-200'}`}>
              <span className={`font-bold text-[10px] uppercase tracking-wider block ${cxc.saldoPendiente > 0 ? 'text-rose-800' : 'text-zinc-600'}`}>
                Saldo Pendiente
              </span>
              <span className={`font-mono font-black text-base mt-1 block ${cxc.saldoPendiente > 0 ? 'text-rose-700' : 'text-zinc-700'}`}>
                ${cxc.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-theme-muted">Por liquidar</span>
            </div>
          </div>

          {/* Customer & Credit Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-theme-subtle bg-theme-surface">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Datos del Cliente</span>
              </div>
              <div>
                <p className="font-bold text-sm text-theme-main">{cxc.clienteNombre}</p>
                <p className="text-theme-muted font-mono">RFC: {cxc.clienteRfc}</p>
              </div>
              <div className="pt-2 text-[11px] space-y-1">
                <p className="text-theme-muted">
                  Contacto de Cobranza: <strong className="text-theme-main">{cxc.contactoCobranza.nombre}</strong>
                </p>
                <p className="text-theme-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-theme-primary" />
                  <a href={`mailto:${cxc.contactoCobranza.email}`} className="text-theme-primary hover:underline">
                    {cxc.contactoCobranza.email}
                  </a>
                </p>
                <p className="text-theme-muted flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-theme-primary" />
                  <span>{cxc.contactoCobranza.telefono}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 md:border-l md:border-theme-subtle md:pl-4">
              <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Plazos de Crédito y Vencimiento</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-theme-muted block">Fecha Emisión:</span>
                  <strong className="text-theme-main">{cxc.fechaEmision}</strong>
                </div>
                <div>
                  <span className="text-theme-muted block">Fecha Vencimiento:</span>
                  <strong className={isVencida ? 'text-rose-600' : 'text-theme-main'}>{cxc.fechaVencimiento}</strong>
                </div>
                <div>
                  <span className="text-theme-muted block">Plazo Autorizado:</span>
                  <span className="text-theme-main font-semibold">{cxc.diasCredito} días de crédito</span>
                </div>
                <div>
                  <span className="text-theme-muted block">Método de Pago:</span>
                  <span className="text-theme-main font-bold font-mono">{cxc.metodoPago}</span>
                </div>
              </div>

              {cxc.uuidSat && (
                <div className="pt-2 text-[10px] text-theme-muted font-mono">
                  <span>UUID Fiscal SAT: </span>
                  <strong className="text-blue-700">{cxc.uuidSat}</strong>
                </div>
              )}
            </div>
          </div>

          {/* History of Payments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-theme-main">
                Historial de Cobros y Abonos Aplicados
              </h4>
              <span className="text-theme-muted text-[11px]">
                {cxc.historialPagos.length} {cxc.historialPagos.length === 1 ? 'abono registrado' : 'abonos registrados'}
              </span>
            </div>

            {cxc.historialPagos.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-theme-subtle text-center text-theme-muted">
                No se han registrado cobros o abonos para esta factura aún.
              </div>
            ) : (
              <div className="border border-theme-subtle rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] font-bold text-theme-muted uppercase">
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Forma / Banco</th>
                      <th className="px-3 py-2">Referencia / Rastreo</th>
                      <th className="px-3 py-2">CFDI de Pago (REP)</th>
                      <th className="px-3 py-2 text-right">Importe Abonado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {cxc.historialPagos.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2.5 font-medium text-theme-main whitespace-nowrap">
                          {p.fecha}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-semibold text-theme-main text-[11px]">{p.formaPago}</div>
                          <div className="text-[10px] text-theme-muted">{p.bancoDestino}</div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-[11px] text-theme-main">
                          {p.referencia}
                        </td>
                        <td className="px-3 py-2.5">
                          {p.comprobanteFolio ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] border border-blue-200">
                              {p.comprobanteFolio}
                            </span>
                          ) : (
                            <span className="text-[10px] text-theme-muted italic">N/A (PUE)</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-700">
                          +${p.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
          <div className="flex items-center gap-2">
            {onNavigateToInvoice && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToInvoice(cxc.facturaFolio);
                }}
                className="px-3 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver Factura CFDI</span>
                <ArrowRight className="w-3.5 h-3.5 text-theme-muted" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            {cxc.saldoPendiente > 0 && onOpenRegisterPayment && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterPayment(cxc);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Registrar Abono / Pago</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
