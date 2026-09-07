import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  User,
  Calendar,
  Layers,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SalesInvoice } from '../../data/mockFinanzasData';

interface FacturaPrintPreviewModalProps {
  invoice: SalesInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert numbers to Mexican Spanish currency words (Pesos M.N.)
function numeroALetrasMXN(amount: number): string {
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const diezY = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const veinti = ['', 'VEINTIUNO', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function tresDigitos(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'CIEN';
    let res = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) res += centenas[c] + ' ';

    if (d === 1) {
      res += diezY[u];
    } else if (d === 2) {
      if (u === 0) res += 'VEINTE';
      else res += veinti[u];
    } else if (d > 2) {
      res += decenas[d];
      if (u > 0) res += ' Y ' + unidades[u];
    } else if (u > 0) {
      res += unidades[u];
    }
    return res.trim();
  }

  const enteroyCentavos = Math.round(amount * 100);
  const centavos = enteroyCentavos % 100;
  const entero = Math.floor(amount);
  const centavosStr = `${centavos.toString().padStart(2, '0')}/100 M.N.`;

  if (entero === 0) return `CERO PESOS ${centavosStr}`;

  let millones = Math.floor(entero / 1000000);
  let miles = Math.floor((entero % 1000000) / 1000);
  let resto = entero % 1000;

  let letras = '';
  if (millones === 1) letras += 'UN MILLÓN ';
  else if (millones > 1) letras += `${tresDigitos(millones)} MILLONES `;

  if (miles === 1) letras += 'MIL ';
  else if (miles > 1) letras += `${tresDigitos(miles)} MIL `;

  if (resto > 0) letras += tresDigitos(resto);

  return `${letras.trim()} PESOS ${centavosStr}`;
}

export const FacturaPrintPreviewModal: React.FC<FacturaPrintPreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedUUID, setCopiedUUID] = useState(false);

  if (!isOpen || !invoice) return null;

  const isTimbrada = invoice.status === 'timbrada';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopiedUUID(true);
    setTimeout(() => setCopiedUUID(false), 2000);
    showToast('UUID copiado al portapapeles');
  };

  const handleDownloadPdf = () => {
    showToast(`PDF de ${invoice.folio} generado en modo demostración (Demo ERP RTM)`);
  };

  const metodoPagoDesc =
    invoice.metodoPago === 'PUE'
      ? 'PUE - Pago en una sola exhibición'
      : 'PPD - Pago en parcialidades o diferido';

  const formaPagoDesc =
    invoice.formaPago === '03'
      ? '03 - Transferencia electrónica de fondos (SPEI)'
      : invoice.formaPago === '01'
      ? '01 - Efectivo'
      : invoice.formaPago === '04'
      ? '04 - Tarjeta de crédito'
      : invoice.formaPago === '28'
      ? '28 - Tarjeta de débito'
      : invoice.formaPago === '99'
      ? '99 - Por definir'
      : `${invoice.formaPago} - Otra forma`;

  const totalConLetra = numeroALetrasMXN(invoice.total);

  // Simulated QR payload following SAT spec: ?re=RFC_EMISOR&rr=RFC_RECEPTOR&tt=TOTAL&id=UUID
  const qrString = isTimbrada && invoice.uuidSat
    ? `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${invoice.uuidSat}&re=RTM890315AB1&rr=${invoice.clienteRfc}&tt=${invoice.total.toFixed(2)}&fe=DEMO`
    : `https://impresosrtm.com.mx/demo-cfdi?folio=${invoice.folio}&status=borrador`;

  return (
    <>
      {/* Dynamic Print Styles for Pure A4 Isolation */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all application elements except our printable sheet */
          body > div:not(#root),
          #root > *:not(.factura-print-modal-container),
          .factura-print-modal-backdrop,
          .factura-print-modal-header,
          .factura-print-no-print {
            display: none !important;
          }
          .factura-print-modal-container {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            overflow: visible !important;
            display: block !important;
            inset: auto !important;
          }
          .factura-a4-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="factura-print-modal-container fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 animate-in fade-in duration-150">
        {/* Toast demo feedback */}
        {toastMessage && (
          <div className="fixed top-5 z-50 bg-zinc-900 text-white border border-zinc-700 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Control Bar (Outside the A4 sheet) */}
        <div className="factura-print-modal-header w-full max-w-[210mm] mb-3 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Vista previa de impresión
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300 font-bold border border-zinc-700">
                  {invoice.folio}
                </span>
                {isTimbrada ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Timbrada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Borrador · Sin timbrar
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400">
                Representación impresa CFDI 4.0 · Hoja formato A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700 cursor-pointer"
              title="Descarga simulada de PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descargar PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Abrir diálogo de impresión de la hoja A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer ml-1"
              title="Cerrar vista previa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE A4 PRINTABLE SHEET (Authentic Mexican CFDI 4.0 Layout)
            Dimensions: 210mm x 297mm target, standard professional typography
           ========================================================================= */}
        <div className="factura-a4-sheet relative w-full max-w-[210mm] min-h-[297mm] bg-white text-zinc-900 shadow-2xl p-6 sm:p-8 rounded-lg border border-zinc-300 font-sans text-xs leading-normal select-text print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
          {/* Watermark for Draft / Not yet Stamped invoices */}
          {!isTimbrada && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
              <div className="transform -rotate-30 text-rose-500/15 border-8 border-rose-500/20 px-8 py-4 rounded-3xl font-black text-3xl sm:text-5xl uppercase tracking-widest text-center whitespace-nowrap">
                BORRADOR · SIN VALIDEZ FISCAL
              </div>
            </div>
          )}

          {/* DOCUMENT HEADER */}
          <div className="border-b border-zinc-300 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              {/* Company Identity & Logo */}
              <div className="flex items-start gap-3">
                <img
                  src="/assets/logo-rtm.svg"
                  alt="RTM Impresos"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div>
                  <h1 className="text-base font-black tracking-tight text-zinc-900 leading-tight">
                    IMPRESOS RTM
                  </h1>
                  <p className="text-[10px] text-zinc-600 font-medium">
                    RTM IMPRESOS S.A. DE C.V. · Soluciones de Empaque y Artes Gráficas
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Representación impresa CFDI 4.0 · DEMO ERP
                  </p>
                </div>
              </div>

              {/* Invoice Box / Stamp header */}
              <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-4">
                <div className="inline-block sm:text-right">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">
                    FACTURA ELECTRÓNICA
                  </span>
                  <div className="text-lg font-black font-mono text-zinc-900 tracking-tight">
                    {invoice.folio}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">
                    Tipo de Comprobante: <strong className="text-zinc-800 font-mono">I - Ingreso</strong>
                  </div>
                  <div className="text-[10px] text-zinc-600">
                    Fecha Emisión:{' '}
                    <strong className="text-zinc-800 font-mono">
                      {new Date(invoice.fechaEmision).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </div>
                  <div className="text-[10px] text-zinc-600">
                    Lugar de Expedición: <strong className="text-zinc-800 font-mono">54030</strong> (Tlalnepantla, Méx.)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EMISOR & RECEPTOR TWO-COLUMN SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-[11px]">
            {/* Emisor Box */}
            <div className="p-2.5 rounded border border-zinc-300 bg-zinc-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-800 font-bold uppercase text-[9px] tracking-wider border-b border-zinc-200 pb-1">
                <Building2 className="w-3 h-3 text-zinc-600" />
                <span>Datos del Emisor</span>
              </div>
              <p className="font-bold text-zinc-900 text-xs leading-tight">
                RTM IMPRESOS S.A. DE C.V.
              </p>
              <div className="flex items-baseline gap-1 text-zinc-700">
                <span className="text-zinc-500 font-medium">RFC:</span>
                <span className="font-mono font-bold text-zinc-900">RTM890315AB1</span>
              </div>
              <div className="text-zinc-700 text-[10px]">
                <span className="text-zinc-500 font-medium">Régimen Fiscal:</span>{' '}
                601 - General de Ley Personas Morales
              </div>
              <div className="text-zinc-700 text-[10px]">
                <span className="text-zinc-500 font-medium">Domicilio Fiscal / Expedición:</span>{' '}
                Av. Gustavo Baz Prada 2160, C.P. 54030, Tlalnepantla, Edo. Méx.
              </div>
            </div>

            {/* Receptor Box */}
            <div className="p-2.5 rounded border border-zinc-300 bg-zinc-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-800 font-bold uppercase text-[9px] tracking-wider border-b border-zinc-200 pb-1">
                <User className="w-3 h-3 text-zinc-600" />
                <span>Datos del Receptor (Cliente)</span>
              </div>
              <p className="font-bold text-zinc-900 text-xs leading-tight">
                {invoice.clienteNombre}
              </p>
              <div className="flex items-baseline gap-1 text-zinc-700">
                <span className="text-zinc-500 font-medium">RFC:</span>
                <span className="font-mono font-bold text-zinc-900">{invoice.clienteRfc}</span>
              </div>
              <div className="text-zinc-700 text-[10px]">
                <span className="text-zinc-500 font-medium">Régimen Fiscal:</span>{' '}
                {invoice.clienteRegimen}
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-700 text-[10px]">
                <div>
                  <span className="text-zinc-500 font-medium">C.P. Domicilio:</span>{' '}
                  <span className="font-mono font-semibold">{invoice.clienteCp}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">Uso CFDI:</span>{' '}
                  <span className="font-mono font-semibold">{invoice.usoCfdi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COMMERCIAL TRACEABILITY & PAYMENT METADATA */}
          <div className="mb-3 p-2.5 rounded border border-zinc-300 bg-white grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
            <div>
              <span className="text-zinc-500 uppercase font-bold text-[8px] block">Método de Pago</span>
              <span className="font-bold text-zinc-900 block truncate" title={metodoPagoDesc}>
                {invoice.metodoPago} ({invoice.metodoPago === 'PUE' ? 'Una exhibición' : 'Parcialidades'})
              </span>
            </div>

            <div>
              <span className="text-zinc-500 uppercase font-bold text-[8px] block">Forma de Pago</span>
              <span className="font-bold text-zinc-900 block truncate" title={formaPagoDesc}>
                {invoice.formaPago} · {invoice.formaPago === '03' ? 'SPEI' : invoice.formaPago === '99' ? 'Por definir' : 'Otro'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 uppercase font-bold text-[8px] block">Moneda / T.C.</span>
              <span className="font-mono font-bold text-zinc-900 block">
                {invoice.moneda} · 1.0000
              </span>
            </div>

            <div>
              <span className="text-zinc-500 uppercase font-bold text-[8px] block">Remisión Origen</span>
              <span className="font-mono font-bold text-zinc-900 block">
                {invoice.remisionFolio || 'N/A (Directa)'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 uppercase font-bold text-[8px] block">Pedido Origen</span>
              <span className="font-mono font-bold text-zinc-900 block">
                {invoice.pedidoFolio || 'N/A'}
              </span>
            </div>
          </div>

          {/* CONCEPTS / ITEMS TABLE */}
          <div className="mb-3 border border-zinc-300 rounded overflow-hidden">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-700 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-1.5 text-center w-16">Clave SAT</th>
                  <th className="p-1.5 w-24">No. Parte / SKU</th>
                  <th className="p-1.5">Descripción de Producto / Servicio</th>
                  <th className="p-1.5 text-right w-16">Cant.</th>
                  <th className="p-1.5 text-center w-14">Unidad</th>
                  <th className="p-1.5 text-right w-20">P. Unitario</th>
                  <th className="p-1.5 text-right w-18">IVA 16%</th>
                  <th className="p-1.5 text-right w-24">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((it, idx) => (
                  <tr key={it.id || idx} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="p-1.5 font-mono text-center text-zinc-500 text-[9px]">
                      {it.satKey}
                    </td>
                    <td className="p-1.5 font-mono font-bold text-zinc-800">
                      {it.sku}
                    </td>
                    <td className="p-1.5 text-zinc-800 leading-snug">
                      <div className="font-medium">{it.description}</div>
                      <div className="text-[8px] text-zinc-500 font-mono">
                        Clave Unidad SAT: {it.satUnit || 'H87'} · Impuesto: 002-IVA Base: ${it.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-1.5 text-right font-mono font-semibold text-zinc-900">
                      {it.quantity.toLocaleString('es-MX')}
                    </td>
                    <td className="p-1.5 text-center text-zinc-600">
                      {it.unit}
                    </td>
                    <td className="p-1.5 text-right font-mono text-zinc-700">
                      ${it.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-1.5 text-right font-mono text-zinc-600">
                      ${it.taxAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-1.5 text-right font-mono font-bold text-zinc-900">
                      ${it.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS & NOTES SECTION */}
          <div className="mb-4 flex flex-col sm:flex-row items-start justify-between gap-4 pt-1">
            {/* Left: Total in words & notes */}
            <div className="flex-1 text-[10px] space-y-2">
              <div className="p-2 rounded border border-zinc-200 bg-zinc-50/70">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                  Cantidad con Letra:
                </span>
                <span className="font-bold text-zinc-800 tracking-wide text-[10px]">
                  *** {totalConLetra} ***
                </span>
              </div>

              {invoice.notas && (
                <div className="text-zinc-600 text-[10px] leading-tight pl-1">
                  <strong className="text-zinc-700">Observaciones:</strong> {invoice.notas}
                </div>
              )}

              <div className="text-[9px] text-zinc-500 pl-1">
                Efectos fiscales al pago · Régimen 601 General de Ley Personas Morales · Impresos RTM
              </div>
            </div>

            {/* Right: Financial Totals Box */}
            <div className="w-full sm:w-60 border border-zinc-300 rounded overflow-hidden text-[11px]">
              <div className="bg-zinc-50 px-3 py-1.5 border-b border-zinc-200 flex justify-between">
                <span className="text-zinc-600">Subtotal:</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ${invoice.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-zinc-50 px-3 py-1.5 border-b border-zinc-200 flex justify-between">
                <span className="text-zinc-600">IVA Trasladado (16%):</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ${invoice.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-zinc-100 px-3 py-2 flex justify-between items-baseline font-bold">
                <span className="text-zinc-900 text-xs">Total Facturado:</span>
                <span className="font-mono text-sm text-zinc-950">
                  ${invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {invoice.moneda}
                </span>
              </div>
            </div>
          </div>

          {/* FISCAL STAMP & DIGITAL SIGNATURES (CFDI 4.0 TIMBRE) */}
          <div className="border-t-2 border-zinc-400 pt-3 text-[9px] leading-tight">
            {isTimbrada ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                {/* Visual QR Demo */}
                <div className="flex flex-col items-center justify-center p-2 rounded border border-zinc-300 bg-white">
                  <QRCodeSVG
                    value={qrString}
                    size={88}
                    level="M"
                    includeMargin={false}
                    className="w-22 h-22 text-zinc-900"
                  />
                  <span className="text-[8px] font-mono text-zinc-500 mt-1">SAT QR Demo</span>
                </div>

                {/* Fiscal UUID & Cryptographic strings */}
                <div className="sm:col-span-3 space-y-1 font-mono text-[9px] text-zinc-700">
                  <div className="flex flex-wrap items-center justify-between gap-1 pb-1 border-b border-zinc-200">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-zinc-900 uppercase">Folio Fiscal (UUID):</strong>
                      <span className="text-blue-800 font-bold">{invoice.uuidSat}</span>
                    </div>
                    {invoice.uuidSat && (
                      <button
                        onClick={() => handleCopyUUID(invoice.uuidSat!)}
                        className="factura-print-no-print p-0.5 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                        title="Copiar UUID"
                      >
                        {copiedUUID ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px]">
                    <div>
                      <strong className="text-zinc-800">No. Certificado Emisor:</strong> 00001000000508823192
                    </div>
                    <div>
                      <strong className="text-zinc-800">No. Certificado SAT:</strong> 00001000000504465028
                    </div>
                    <div>
                      <strong className="text-zinc-800">Fecha Certificación SAT:</strong>{' '}
                      {invoice.fechaTimbrado
                        ? new Date(invoice.fechaTimbrado).toLocaleString('es-MX')
                        : '2026-08-20 10:32:15'}
                    </div>
                    <div>
                      <strong className="text-zinc-800">RFC Proveedor Certif:</strong> SAT970701NN3
                    </div>
                  </div>

                  {/* Sello Digital Emisor */}
                  <div className="text-[8px] break-all text-zinc-500 pt-0.5">
                    <strong className="text-zinc-700">Sello Digital del Emisor:</strong>
                    <br />
                    MIIEpAIBAAKCAQEA0Q9jHk1y6d9xL2pQ+demoSelloRTM890315AB1cfdi40v4==
                  </div>

                  {/* Sello Digital SAT */}
                  <div className="text-[8px] break-all text-zinc-500">
                    <strong className="text-zinc-700">Sello Digital del SAT:</strong>
                    <br />
                    K9p8Lm12xYzAbCdEfGhIjKlMnOpQrStUvWxYz0123456789+demoTimbrePAC58211==
                  </div>

                  {/* Cadena Original */}
                  <div className="text-[7.5px] break-all text-zinc-400">
                    <strong className="text-zinc-600">Cadena Original del Complemento de Certificación Digital del SAT:</strong>
                    <br />
                    ||1.1|{invoice.uuidSat}|2026-08-20T10:32:15|SAT970701NN3|RTM890315AB1|{invoice.clienteRfc}|{invoice.total.toFixed(2)}||
                  </div>
                </div>
              </div>
            ) : (
              /* Draft / Ready to stamp notice */
              <div className="p-3 rounded border border-amber-300 bg-amber-50/60 text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[10px]">
                  <p className="font-bold uppercase tracking-wider text-amber-900">
                    Comprobante pendiente de certificación fiscal SAT
                  </p>
                  <p className="text-amber-800 leading-normal">
                    Este documento es un borrador preliminar. Aún no cuenta con Folio Fiscal (UUID) ni Timbre Digital del SAT. Al timbrarlo desde el ERP RTM se generará la cadena de certificación y se activará la cuenta por cobrar en el módulo de Tesorería.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DOCUMENT FOOTER */}
          <div className="border-t border-zinc-200 mt-4 pt-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] text-zinc-500">
            <span>
              Este documento es una representación impresa de demostración del flujo CFDI 4.0 del ERP RTM.
            </span>
            <span className="font-mono font-medium">Página 1 / 1</span>
          </div>
        </div>
      </div>
    </>
  );
};
