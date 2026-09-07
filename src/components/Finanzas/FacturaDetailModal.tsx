import React from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, Download, FileCode, AlertCircle, Building2, User, Calendar, DollarSign, QrCode } from 'lucide-react';
import { SalesInvoice } from '../../data/mockFinanzasData';

interface FacturaDetailModalProps {
  invoice: SalesInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCxc?: (cxcId: string) => void;
}

export const FacturaDetailModal: React.FC<FacturaDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onNavigateToCxc,
}) => {
  if (!isOpen || !invoice) return null;

  const isTimbrada = invoice.status === 'timbrada';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-theme-main">
                  Representación Impresa CFDI 4.0 (Demo)
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isTimbrada
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : invoice.status === 'lista_timbrar'
                      ? 'bg-blue-50 text-blue-700 border border-blue-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  {isTimbrada ? 'Timbrada con UUID' : invoice.status === 'lista_timbrar' ? 'Lista para Timbrar' : 'Borrador'}
                </span>
              </div>
              <p className="text-xs text-theme-muted">
                Folio: <strong className="text-theme-main">{invoice.folio}</strong> · Serie RTM Ingreso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-theme-subtle hover:bg-theme-muted text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir / Vista PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Demo Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Simulación Fiscal SAT:</strong> Este comprobante es generado para demostración de flujos ERP en Impresos RTM. El UUID y los sellos mostrados son cadenas de prueba estructuradas para validar flujos de cuentas por cobrar y remisiones.
            </p>
          </div>

          {/* Document Top Header: Emisor & Receptor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-theme-subtle bg-theme-muted/20">
            {/* Emisor */}
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-theme-subtle pb-3 md:pb-0 md:pr-4">
              <div className="flex items-center gap-1.5 text-theme-primary font-bold text-[11px] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Emisor (Proveedor de empaque)</span>
              </div>
              <p className="font-bold text-sm text-theme-main">RTM IMPRESOS S.A. DE C.V.</p>
              <p className="text-theme-muted">RFC: <strong className="text-theme-main">RTM890315AB1</strong></p>
              <p className="text-theme-muted">Régimen Fiscal: 601 - General de Ley Personas Morales</p>
              <p className="text-theme-muted">Lugar de Expedición: C.P. 54030 (Tlalnepantla, Edo. Méx.)</p>
            </div>

            {/* Receptor */}
            <div className="space-y-1.5 md:pl-2">
              <div className="flex items-center gap-1.5 text-theme-primary font-bold text-[11px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Receptor (Cliente)</span>
              </div>
              <p className="font-bold text-sm text-theme-main">{invoice.clienteNombre}</p>
              <p className="text-theme-muted">RFC: <strong className="text-theme-main">{invoice.clienteRfc}</strong></p>
              <p className="text-theme-muted">Régimen: {invoice.clienteRegimen}</p>
              <p className="text-theme-muted">Código Postal: {invoice.clienteCp}</p>
              <p className="text-theme-muted">Uso de CFDI: <strong className="text-theme-main">{invoice.usoCfdi}</strong></p>
            </div>
          </div>

          {/* CFDI Technical Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-theme-subtle bg-white text-[11px]">
            <div>
              <p className="text-theme-muted uppercase font-bold text-[10px]">Método de Pago</p>
              <p className="font-bold text-theme-main">
                {invoice.metodoPago === 'PUE' ? 'PUE - En una sola exhibición' : 'PPD - Pago en parcialidades o diferido'}
              </p>
            </div>
            <div>
              <p className="text-theme-muted uppercase font-bold text-[10px]">Forma de Pago</p>
              <p className="font-bold text-theme-main">
                {invoice.formaPago === '03' ? '03 - Transferencia SPEI' : invoice.formaPago === '99' ? '99 - Por definir' : invoice.formaPago}
              </p>
            </div>
            <div>
              <p className="text-theme-muted uppercase font-bold text-[10px]">Fecha Emisión</p>
              <p className="font-medium text-theme-main">
                {new Date(invoice.fechaEmision).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-theme-muted uppercase font-bold text-[10px]">Moneda / Tipo Cambio</p>
              <p className="font-bold text-theme-main">{invoice.moneda} · $1.0000</p>
            </div>
          </div>

          {/* Traceability badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-theme-muted">Trazabilidad de origen:</span>
            {invoice.remisionFolio && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                Remisión: <strong>{invoice.remisionFolio}</strong>
              </span>
            )}
            {invoice.pedidoFolio && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                Pedido: <strong>{invoice.pedidoFolio}</strong>
              </span>
            )}
            {invoice.cxcId && onNavigateToCxc && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCxc(invoice.cxcId!);
                }}
                className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-[11px] border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer ml-auto"
              >
                <span>Ver Cuenta en CxC</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>

          {/* Items Table */}
          <div className="border border-theme-subtle rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-theme-muted/50 border-b border-theme-subtle font-bold text-[11px] text-theme-main uppercase tracking-wider">
              Conceptos Facturados
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-theme-subtle bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted">
                    <th className="px-3 py-2">Clave SAT</th>
                    <th className="px-3 py-2">Código SKU</th>
                    <th className="px-3 py-2">Descripción</th>
                    <th className="px-3 py-2 text-right">Cant.</th>
                    <th className="px-3 py-2">Unidad</th>
                    <th className="px-3 py-2 text-right">P. Unitario</th>
                    <th className="px-3 py-2 text-right">IVA 16%</th>
                    <th className="px-3 py-2 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {invoice.items.map((it) => (
                    <tr key={it.id} className="hover:bg-theme-muted/20 transition-colors">
                      <td className="px-3 py-2.5 font-mono text-[11px] text-theme-muted">
                        {it.satKey}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-theme-main">
                        {it.sku}
                      </td>
                      <td className="px-3 py-2.5 max-w-xs font-medium text-theme-main">
                        {it.description}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold">
                        {it.quantity.toLocaleString('es-MX')}
                      </td>
                      <td className="px-3 py-2.5 text-theme-muted">
                        {it.unit}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">
                        ${it.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-theme-muted">
                        ${it.taxAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-theme-main">
                        ${it.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="p-4 bg-theme-muted/30 border-t border-theme-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-theme-muted text-[11px] max-w-sm">
                {invoice.notas && (
                  <p><strong>Observaciones:</strong> {invoice.notas}</p>
                )}
              </div>
              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-theme-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">${invoice.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-theme-muted">
                  <span>IVA Trasladado (16%):</span>
                  <span className="font-mono font-medium">${invoice.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-theme-main pt-1 border-t border-theme-subtle">
                  <span>Total Facturado:</span>
                  <span className="font-mono text-emerald-700 font-black">${invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {invoice.moneda}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SAT Seal & QR section (CFDI simulation) */}
          {isTimbrada && (
            <div className="p-4 rounded-xl border border-theme-subtle bg-white space-y-3">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-900">
                    Sello Digital SAT & Certificación Fiscal (Demo)
                  </span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">
                  PAC Autorizado #58211
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <QrCode className="w-20 h-20 text-zinc-800" />
                  <span className="text-[9px] text-zinc-500 mt-1 font-mono">Código Bidimensional</span>
                </div>

                <div className="md:col-span-3 space-y-1.5 font-mono text-[10px] text-zinc-600 break-all leading-tight">
                  <p>
                    <strong className="text-zinc-900">Folio Fiscal (UUID):</strong>{' '}
                    <span className="text-blue-700 font-bold">{invoice.uuidSat}</span>
                  </p>
                  <p>
                    <strong className="text-zinc-900">Fecha y Hora de Certificación:</strong>{' '}
                    {invoice.fechaTimbrado ? new Date(invoice.fechaTimbrado).toLocaleString('es-MX') : '2026-08-20T10:32:15'}
                  </p>
                  <p>
                    <strong className="text-zinc-900">No. Serie Certificado SAT:</strong> 00001000000504465028
                  </p>
                  <p className="text-[9px] text-zinc-400">
                    <strong>Cadena Original:</strong> ||1.1|{invoice.uuidSat}|2026-08-20T10:32:15|SAT970701NN3|RTM890315AB1|{invoice.clienteRfc}|{invoice.total}||
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-muted/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Descarga simulada de archivo XML: ${invoice.folio}.xml`)}
              className="px-3 py-1.5 rounded-lg border border-theme-subtle hover:bg-theme-muted text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Descargar XML</span>
            </button>
            <button
              onClick={() => alert(`Descarga simulada de archivo PDF: ${invoice.folio}.pdf`)}
              className="px-3 py-1.5 rounded-lg border border-theme-subtle hover:bg-theme-muted text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Descargar PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-colors cursor-pointer"
          >
            Cerrar Comprobante
          </button>
        </div>
      </div>
    </div>
  );
};
