import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Building2, 
  MapPin, 
  Truck, 
  QrCode,
  ShieldCheck,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OutboundRemision, markRemisionAsPrinted } from '../../../data/mockRemisionesData';
import { ModalPortal } from '../../common/ModalPortal';

interface RemisionPreviewModalProps {
  remision: OutboundRemision;
  isOrderComplete: boolean;
  onClose: () => void;
  onPrinted?: (updatedRemision: OutboundRemision) => void;
}

export const RemisionPreviewModal: React.FC<RemisionPreviewModalProps> = ({
  remision,
  isOrderComplete,
  onClose,
  onPrinted,
}) => {
  const [currentRemision, setCurrentRemision] = useState<OutboundRemision>(remision);
  const [showPrintedNotice, setShowPrintedNotice] = useState(false);

  const handlePrint = () => {
    if (!isOrderComplete) return;

    const updated = markRemisionAsPrinted(currentRemision.folio);
    if (updated) {
      setCurrentRemision({ ...updated });
      if (onPrinted) onPrinted(updated);
    }
    
    setShowPrintedNotice(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const isTransfer = currentRemision.type === 'Traspaso';

  return (
    <ModalPortal onClose={onClose}>
      
      {/* Hidden print stylesheet for isolating remisión when window.print() is triggered */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-remision-document, #printable-remision-document * {
            visibility: visible !important;
          }
          #printable-remision-document {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 4mm 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar (Controls outside the sheet) */}
        <div className="px-6 py-4 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-theme-main">
                  Vista Previa de Remisión
                </h3>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                  {currentRemision.folio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                  currentRemision.status === 'Impresa'
                    ? 'border-blue-500 text-blue-700'
                    : currentRemision.status === 'Remisión generada'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-amber-500 text-amber-700'
                }`}>
                  {currentRemision.status}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Documento físico oficial de entrega &bull; Ref: {currentRemision.sourceDocumentFolio} ({currentRemision.type})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOrderComplete && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Borrador &bull; Verificación en proceso</span>
              </div>
            )}

            <button
              type="button"
              onClick={handlePrint}
              disabled={!isOrderComplete}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                isOrderComplete
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
              }`}
              title={isOrderComplete ? 'Imprimir remisión definitiva' : 'Disponible al completar la verificación al 100%'}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir remisión</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl text-theme-muted hover:text-theme-main hover:bg-theme-muted border border-theme-subtle transition-colors cursor-pointer"
              title="Cerrar vista previa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning Banner if order not complete */}
        {!isOrderComplete && (
          <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 no-print">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              La remisión estará disponible cuando la verificación esté completa. (Visualizando borrador preliminar).
            </span>
          </div>
        )}

        {/* Modal Scrollable Canvas Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-start">
          
          {/* THE OFFICIAL PRINTABLE LETTER-SIZE REMISIÓN SHEET */}
          <div
            id="printable-remision-document"
            className="w-full max-w-[760px] bg-white text-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-300 shadow-xl space-y-5 select-none font-sans text-xs"
          >
            
            {/* Sheet Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-zinc-900 pb-4">
              <div className="flex items-start gap-3.5">
                <img
                  src="/assets/logo-rtm.svg"
                  alt="Impresos RTM"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div className="space-y-0.5">
                  <h1 className="text-base font-black tracking-tight text-zinc-950 uppercase leading-none">
                    IMPRESOS RTM S.A. DE C.V.
                  </h1>
                  <p className="text-[10px] text-zinc-600 font-medium">
                    RFC: RTM-980415-RT9 &bull; Planta Reynosa, Tamps. &bull; Tel. (899) 921-5000
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Planta de Producción Gráfica, Empaques &amp; Logística
                  </p>
                </div>
              </div>

              {/* Remisión Folio Box */}
              <div className="bg-white border-2 border-rose-600 rounded-xl p-3 text-right shrink-0 min-w-[210px] shadow-2xs">
                <span className="text-[10px] font-black tracking-widest uppercase text-rose-600 block">
                  REMISIÓN DE SALIDA
                </span>
                <span className="font-mono text-base font-black text-zinc-950 block">
                  {currentRemision.folio}
                </span>
                <div className="flex items-center justify-end gap-2 mt-1 text-[10px] font-bold">
                  <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-900 border border-zinc-300 uppercase">
                    {currentRemision.type}
                  </span>
                  <span className="text-zinc-600 font-mono">
                    {currentRemision.createdAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Reference Grid (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
              {/* Left Column: Origin and Logistics */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="text-[10px] uppercase text-zinc-500">Origen de Mercancía</span>
                </div>
                <p className="font-extrabold text-zinc-900 pl-5">
                  {currentRemision.originWarehouseName}
                </p>
                <div className="pl-5 text-[11px] text-zinc-600 space-y-0.5 font-mono">
                  <p>Salida: <strong>{currentRemision.outboundOrderFolio}</strong> &bull; Carril: <strong>{currentRemision.assignedLane || 'EMB-01'}</strong></p>
                  <p>Operador: {currentRemision.operatorAssigned}</p>
                </div>
              </div>

              {/* Right Column: Destination and Reference */}
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-4">
                <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="text-[10px] uppercase text-zinc-500">
                    {isTransfer ? 'Instalación Destino' : 'Cliente & Entrega'}
                  </span>
                </div>
                <p className="font-extrabold text-zinc-900 pl-5">
                  {currentRemision.destinationName}
                </p>
                <div className="pl-5 text-[11px] text-zinc-600 space-y-0.5">
                  <p className="font-mono font-bold text-zinc-900">
                    Doc. Origen: {currentRemision.sourceDocumentType} {currentRemision.sourceDocumentFolio}
                  </p>
                  <p className="text-[10px] leading-tight text-zinc-600">
                    {isTransfer 
                      ? (currentRemision.destinationFacility || currentRemision.destinationName)
                      : (currentRemision.destinationAddress || 'Domicilio registrado en pedido')}
                  </p>
                </div>
              </div>
            </div>

            {/* Carrier Info if available */}
            {currentRemision.carrierInfo && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-zinc-100/80 border border-zinc-200 text-[11px] text-zinc-700 font-mono">
                <span><strong>Unidad:</strong> {currentRemision.carrierInfo.vehicleType}</span>
                <span><strong>Placas:</strong> {currentRemision.carrierInfo.unitPlate}</span>
                <span><strong>Operador / Chofer:</strong> {currentRemision.carrierInfo.driverName}</span>
              </div>
            )}

            {/* Items Table (Partidas) */}
            <div className="border border-zinc-900 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">SKU & Artículo</th>
                    <th className="py-2.5 px-3">Marca & Medida</th>
                    <th className="py-2.5 px-3 text-center w-16">Cant.</th>
                    <th className="py-2.5 px-3">Series / UIDs de Trazabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-300">
                  {currentRemision.items.map((item, idx) => (
                    <tr key={item.sku} className="align-top">
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-500">
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-zinc-950 block text-xs">{item.productName}</strong>
                        <span className="font-mono text-[10px] text-zinc-600">{item.sku}</span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-700">
                        {item.brand} &bull; {item.size}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-zinc-950">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {item.uids.map((uid) => (
                            <span 
                              key={uid}
                              className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-zinc-900 border border-zinc-400"
                            >
                              {uid}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-100 font-bold border-t-2 border-zinc-900 text-zinc-950">
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-[10px]">
                      Total de Unidades Amparadas:
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-zinc-950">
                      {currentRemision.totalUnits}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500 font-mono">
                      {currentRemision.items.reduce((acc, it) => acc + it.uids.length, 0)} UIDs serializados
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Observations Box */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-0.5">
                Observaciones y Condiciones de Entrega
              </span>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-sans">
                {currentRemision.observations || 'Sin observaciones adicionales. Mercancía inspeccionada y verificada al 100% en andén de salida.'}
              </p>
            </div>

            {/* Delivery Proof Card (When delivered) */}
            {currentRemision.deliveryProof && (
              <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-500 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <strong className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                      Constancia Oficial de Entrega Física
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-emerald-800 border border-emerald-500 shadow-2xs">
                    {currentRemision.deliveryProof.result}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Fecha y Hora:</span>
                    <strong className="text-zinc-900 font-mono">{currentRemision.deliveryProof.deliveredAt}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Recibió de Conformidad:</span>
                    <strong className="text-zinc-900">{currentRemision.deliveryProof.recipientName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Chofer de Reparto:</span>
                    <strong className="text-zinc-900">{currentRemision.deliveryProof.driverName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Coordenadas GPS:</span>
                    <span className="font-mono text-[10px] text-zinc-700">{currentRemision.deliveryProof.coordinates.label}</span>
                  </div>
                </div>

                {currentRemision.deliveryProof.observations && (
                  <p className="text-[10px] text-zinc-600 italic pt-1 border-t border-zinc-100">
                    Nota de entrega: {currentRemision.deliveryProof.observations}
                  </p>
                )}
              </div>
            )}

            {/* Security, QR and Signature Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-zinc-200 items-end">
              
              {/* QR Remisión Block (4 cols) */}
              <div className="md:col-span-4 flex items-center gap-3 p-3 bg-white border border-zinc-300 rounded-xl shadow-2xs">
                <div className="bg-white p-1 rounded-lg border border-zinc-400 shrink-0">
                  <QRCodeSVG 
                    value={currentRemision.qrPayload}
                    size={78}
                    level="M"
                  />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-1 text-rose-600 font-bold text-[10px] uppercase">
                    <QrCode className="w-3 h-3" />
                    <span>QR de Remisión</span>
                  </div>
                  <p className="font-mono text-[9px] text-zinc-800 font-bold truncate" title={currentRemision.qrPayload}>
                    {currentRemision.folio}
                  </p>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    Escaneo oficial para control de ruta y recepción en destino.
                  </p>
                </div>
              </div>

              {/* Signatures Block (8 cols) */}
              <div className="md:col-span-8 grid grid-cols-2 gap-4 text-center text-xs">
                
                {/* Delivery Signature */}
                <div className="space-y-6 pt-4 border-t-2 border-zinc-900 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-950 text-[11px]">
                      {currentRemision.signatures.deliveredByLabel}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {currentRemision.signatures.deliveredByName || currentRemision.operatorAssigned}
                    </p>
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                    Firma / Sello de Despacho
                  </span>
                </div>

                {/* Receiver Signature */}
                <div className="space-y-6 pt-4 border-t-2 border-zinc-900 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-950 text-[11px]">
                      {currentRemision.signatures.receivedByLabel}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono">
                      {currentRemision.signatures.signeeName || 'Nombre y Firma'}
                    </p>
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                    {currentRemision.signatures.dateTimeLabel}
                  </span>
                </div>

              </div>

            </div>

            {/* Legal Notice */}
            <div className="pt-2 border-t border-zinc-200 text-center text-[9px] text-zinc-500 leading-tight">
              Este documento ampara el traslado físico y entrega de los artículos descritos. Para cualquier aclaración o reclamación de garantía, conserve este comprobante junto con su pedido original.
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer (no-print) */}
        <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-surface no-print text-xs text-theme-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Documento emitido con firma digital de trazabilidad interna Impresos RTM.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={!isOrderComplete}
              className={`px-5 py-2 rounded-2xl font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                isOrderComplete
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

      </div>
    </ModalPortal>
  );
};
